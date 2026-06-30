import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import QueryDetail from "./QueryDetail";

export const dynamic = "force-dynamic";

export default async function QueryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: query, error } = await supabase
    .from("queries")
    .select("id, title, description, sql")
    .eq("id", id)
    .single();

  if (error || !query) {
    notFound();
  }

  return (
    <div>
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Voltar ao índice
      </Link>
      <QueryDetail query={query} />
    </div>
  );
}
