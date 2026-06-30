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
    <article className="mt-6">
      <h1 className="text-2xl font-bold mb-2">{query.title}</h1>
      <p className="text-gray-700 mb-6 whitespace-pre-wrap">
        {query.description}
      </p>

      <button
        onClick={() => setShowSql((v) => !v)}
        className="rounded bg-gray-900 text-white px-4 py-2 text-sm hover:bg-gray-700"
      >
        {showSql ? "Esconder query completa" : "Ver query completa"}
      </button>

      {showSql && (
        <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm whitespace-pre-wrap">
          <code>{query.sql}</code>
        </pre>
      )}
    </article>
  );
}
