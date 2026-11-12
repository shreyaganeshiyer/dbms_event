import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import * as historyApi from '../services/historyApi';
import HistoryItem from '../components/history/historyItems';

export default function History() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'success' | 'error'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await historyApi.listHistory();
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    try {
      await historyApi.deleteHistoryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleClear() {
    if (!window.confirm('Clear all your query history?')) return;
    try {
      await historyApi.clearHistory();
      setItems([]);
    } catch (err) {
      setError(err.message);
    }
  }

  // Passes the SQL to the Workspace through router state.
  function handleOpen(sql) {
    navigate('/', { state: { sql } });
  }

  const visible = items.filter((i) => filter === 'all' || i.status === filter);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Query history</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-slate-700 p-0.5 text-sm">
            {['all', 'success', 'error'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded px-3 py-1 capitalize ${
                  filter === f ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleClear}
            disabled={items.length === 0}
            className="flex items-center gap-2 rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-40"
          >
            <Trash2 size={14} />
            Clear all
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">Loading history…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-slate-400">No queries yet. Run one in the Workspace.</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onOpen={handleOpen}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}