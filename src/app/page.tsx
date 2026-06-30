import Link from "next/link";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function IndicePage() {
  const { data: queries, error } = await supabase
    .from("queries")
    .select("id, title, description")
    .order("title", { ascending: true });

  if (error) {
    return (
      <p className="text-red-600">
        Erro ao carregar as querys: {error.message}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Índice de Querys</h1>

      {!queries || queries.length === 0 ? (
        <p className="text-gray-500">
          Nenhuma query cadastrada ainda.{" "}
          <Link href="/nova" className="text-blue-600 hover:underline">
            Cadastre a primeira
          </Link>
          .
        </p>
      ) : (
        <ol className="space-y-2 list-decimal list-inside">
          {queries.map((q) => (
            <li key={q.id}>
              <Link
                href={`/query/${q.id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                {q.title}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
