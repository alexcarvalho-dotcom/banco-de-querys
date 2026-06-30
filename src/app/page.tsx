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
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        Erro ao carregar as querys: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
        Índice de Querys
      </h1>
      <p className="text-slate-500 mb-8">
        {queries?.length ?? 0} quer{queries?.length === 1 ? "y" : "ys"}{" "}
        cadastrada{queries?.length === 1 ? "" : "s"}
      </p>

      {!queries || queries.length === 0 ? (
        <p className="text-slate-500">
          Nenhuma query cadastrada ainda.{" "}
          <Link href="/nova" className="text-blue-600 hover:underline font-medium">
            Cadastre a primeira
          </Link>
          .
        </p>
      ) : (
        <ol className="space-y-2">
          {queries.map((q, i) => (
            <li key={q.id}>
              <Link
                href={`/query/${q.id}`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <span className="flex-none w-6 text-sm font-semibold text-slate-400">
                  {i + 1}
                </span>
                <span className="font-medium text-slate-900">{q.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
