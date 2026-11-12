import { CheckCircle2, XCircle, Trash2, Play } from 'lucide-react';

function formatTime(value) {
  return new Date(value).toLocaleString();
}

export default function HistoryItem({ item, onOpen, onDelete }) {
  const ok = item.status === 'success';

  return (
    <li className="group rounded-lg border border-slate-800 bg-slate-900 p-4">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {ok ? (
            <CheckCircle2 size={14} className="text-emerald-500" />
          ) : (
            <XCircle size={14} className="text-red-500" />
          )}
          <span>{formatTime(item.createdAt)}</span>
          {item.connectionName && <span>· {item.connectionName}</span>}
        </div>
        <div className="flex items-center gap-3">
          {ok && (
            <span>
              {item.rowCount ?? 0} rows · {item.durationMs ?? 0} ms
            </span>
          )}
          <button
            onClick={() => onOpen(item.sql)}
            className="text-slate-400 hover:text-blue-400"
            aria-label="Open in workspace"
          >
            <Play size={14} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-slate-500 opacity-0 hover:text-red-400 group-hover:opacity-100"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-slate-200">
        {item.sql}
      </pre>

      {!ok && item.errorMessage && (
        <p className="mt-2 text-xs text-red-400">{item.errorMessage}</p>
      )}
    </li>
  );
}