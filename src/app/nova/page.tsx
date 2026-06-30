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
      <h1 className="text-2xl font-bold mb-6">Cadastrar nova query</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium mb-1">
            Título <span className="text-red-600">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Descrição <span className="text-red-600">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            SQL completo <span className="text-red-600">*</span>
          </label>
          <textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            required
            rows={10}
            className="w-full rounded border px-3 py-2 text-sm font-mono"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Salvar query"}
        </button>
      </form>
    </div>
  );
}
