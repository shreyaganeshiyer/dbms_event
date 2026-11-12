import { AlertTriangle, Loader2 } from 'lucide-react';

function Message({ children }) {
  return <div className="flex h-full items-center justify-center text-sm text-slate-500">{children}</div>;
}

function formatCell(value) {
  if (value === null || value === undefined) return <span className="italic text-slate-500">NULL</span>;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default function ResultsTable({ result, error, running }) {
  if (running) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-400">
        <Loader2 size={16} className="animate-spin" /> Running query…
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 flex items-start gap-3 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
        <AlertTriangle size={18} className="mt-0.5 shrink-0" />
        <pre className="whitespace-pre-wrap font-mono">{error}</pre>
      </div>
    );
  }

  if (!result) return <Message>Run a query to see results here.</Message>;

  const rows = result.rows ?? [];
  const columns = result.columns ?? Object.keys(rows[0] ?? {});

  if (columns.length === 0) return <Message>Query ran successfully. No rows returned.</Message>;

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-4 border-b border-slate-800 px-4 py-2 text-xs text-slate-400">
        <span>{result.rowCount ?? rows.length} rows</span>
        {result.durationMs != null && <span>{result.durationMs} ms</span>}
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 bg-slate-900">
            <tr>
              {columns.map((col) => (
                <th key={col} className="border-b border-slate-800 px-4 py-2 font-medium text-slate-300">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-800/50">
                {columns.map((col) => (
                  <td key={col} className="border-b border-slate-800/60 px-4 py-2 font-mono text-slate-200">
                    {formatCell(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}