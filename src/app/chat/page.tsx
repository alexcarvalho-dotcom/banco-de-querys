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
    <div className="flex flex-col h-[70vh]">
      <h1 className="text-2xl font-bold mb-4">Chat com IA</h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {turns.length === 0 && (
          <p className="text-gray-500 text-sm">
            Descreva a query que você precisa, ex: &ldquo;preciso de uma
            query de meta por loja&rdquo;.
          </p>
        )}

        {turns.map((turn, i) => (
          <div
            key={i}
            className={
              turn.role === "user"
                ? "text-right"
                : "text-left"
            }
          >
            <div
              className={
                "inline-block max-w-[85%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap " +
                (turn.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border")
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
                    className="text-xs rounded border border-blue-300 bg-blue-50 text-blue-700 px-2 py-1 hover:bg-blue-100"
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
            <div className="inline-block rounded-lg px-4 py-2 text-sm bg-white border text-gray-400">
              Pensando...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Descreva a query que você precisa..."
          className="flex-1 rounded border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-700 disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
