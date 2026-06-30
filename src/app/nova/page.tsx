"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaQueryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sql, setSql] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, sql }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar.");
        return;
      }

      router.push(`/query/${data.query.id}`);
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
        Cadastrar nova query
      </h1>
      <p className="text-slate-500 mb-8">
        Aberto para todos — salva direto no banco, sem aprovação.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Descrição <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            SQL completo <span className="text-red-500">*</span>
          </label>
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            required
            rows={10}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Salvando..." : "Salvar query"}
        </button>
      </form>
    </div>
  );
}
