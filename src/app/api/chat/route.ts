import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = (body.message ?? "").trim();

  if (!message) {
    return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
  }

  const { data: candidates, error } = await supabase
    .from("queries")
    .select("id, title, description, sql")
    .or(`title.ilike.%${message}%,description.ilike.%${message}%`)
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let matches = candidates ?? [];

  if (matches.length === 0) {
    const keywords = message
      .split(/\s+/)
      .filter((w: string) => w.length > 3)
      .slice(0, 5);

    if (keywords.length > 0) {
      const orFilter = keywords
        .map((k: string) => `title.ilike.%${k}%,description.ilike.%${k}%`)
        .join(",");

      const { data: keywordMatches } = await supabase
        .from("queries")
        .select("id, title, description, sql")
        .or(orFilter)
        .limit(5);

      matches = keywordMatches ?? [];
    }
  }

  if (matches.length === 0) {
    return NextResponse.json({
      reply:
        "Não encontrei nenhuma query cadastrada que pareça atender a esse pedido. Tente descrever com outras palavras ou cadastre uma nova query.",
      matches: [],
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY não configurada no servidor." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const catalog = matches
    .map(
      (q, i) =>
        `${i + 1}. Título: ${q.title}\nDescrição: ${q.description}\nID: ${q.id}`
    )
    .join("\n\n");

  const prompt = `Você é um assistente que ajuda funcionários a encontrar a query SQL certa em um banco de querys já existente.

Regras estritas:
- NUNCA invente, reescreva ou altere SQL. Você não tem acesso ao SQL completo, apenas a metadados (título/descrição).
- Sua única tarefa é indicar, entre as querys candidatas abaixo, qual (ou quais) melhor atende ao pedido do usuário, e explicar brevemente por quê.
- Responda em português, de forma curta e direta, citando o título exato da query recomendada.

Pedido do usuário: "${message}"

Querys candidatas encontradas no banco:
${catalog}`;

  try {
    const result = await model.generateContent(prompt);
    const reply = result.response.text();
    return NextResponse.json({ reply, matches });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro desconhecido.";
    return NextResponse.json(
      { error: `Erro ao consultar a IA: ${message}` },
      { status: 500 }
    );
  }
}
