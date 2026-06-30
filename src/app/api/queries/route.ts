import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("queries")
    .select("id, title, description, sql, created_at")
    .order("title", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ queries: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();
  const sql = (body.sql ?? "").trim();

  if (!title || !description || !sql) {
    return NextResponse.json(
      { error: "Título, descrição e SQL são obrigatórios." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("queries")
    .insert({ title, description, sql })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ query: data }, { status: 201 });
}
