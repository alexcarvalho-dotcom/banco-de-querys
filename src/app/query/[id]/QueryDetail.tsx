"use client";

import { useState } from "react";

type Query = {
  id: string;
  title: string;
  description: string;
  sql: string;
};

export default function QueryDetail({ query }: { query: Query }) {
  const [showSql, setShowSql] = useState(false);

  return (
    <article className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{query.title}</h1>
      <p className="text-slate-600 mb-6 whitespace-pre-wrap leading-relaxed">
        {query.description}
      </p>

      <button
        onClick={() => setShowSql((v) => !v)}
        className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:bg-slate-700 transition-colors"
      >
        {showSql ? "Esconder query completa" : "Ver query completa"}
      </button>

      {showSql && (
        <pre className="mt-4 bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap border border-slate-800">
          <code>{query.sql}</code>
        </pre>
      )}
    </article>
  );
}
