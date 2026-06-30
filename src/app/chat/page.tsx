"use client";

import { useState } from "react";
import Link from "next/link";

type Match = {
  id: string;
  title: string;
  description: string;
};

type Turn = {
  role: "user" | "ai";
  text: string;
  matches?: Match[];
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const message = input.trim();
    if (!message || loading) return;

    setTurns((t) => [...t, { role: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setTurns((t) => [
          ...t,
          { role: "ai", text: `Erro: ${data.error ?? "falha no chat"}` },
        ]);
      } else {
        setTurns((t) => [
          ...t,
          { role: "ai", text: data.reply, matches: data.matches },
        ]);
      }
    } catch {
      setTurns((t) => [
        ...t,
        { role: "ai", text: "Erro ao conectar com o servidor." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[75vh] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">Chat com IA</h1>
        <p className="text-sm text-slate-500">
          Descreva o que você precisa e eu aponto a query certa do banco.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50">
        {turns.length === 0 && (
          <p className="text-slate-500 text-sm">
            Ex: &ldquo;preciso de uma query de meta por loja&rdquo;.
          </p>
        )}

        {turns.map((turn, i) => (
          <div key={i} className={turn.role === "user" ? "text-right" : "text-left"}>
            <div
              className={
                "inline-block max-w-[85%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap " +
                (turn.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-800")
              }
            >
              {turn.text}
            </div>

            {turn.matches && turn.matches.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2 justify-start">
                {turn.matches.map((m) => (
                  <Link
                    key={m.id}
                    href={`/query/${m.id}`}
                    className="text-xs rounded-full border border-blue-200 bg-blue-50 text-blue-700 px-3 py-1 hover:bg-blue-100 font-medium"
                  >
                    {m.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="text-left">
            <div className="inline-block rounded-lg px-4 py-2 text-sm bg-white border border-slate-200 text-slate-400">
              Pensando...
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-slate-200 px-6 py-4 bg-white"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Descreva a query que você precisa..."
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
