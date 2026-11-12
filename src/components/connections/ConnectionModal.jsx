import { useState } from 'react';
import { X, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import * as connectionsApi from '../../services/connectionsApi';
import { useConnection } from '../../context/ConnectionContext';

const emptyForm = { name: '', host: 'localhost', port: '3306', database: '', username: '', password: '' };

const fields = [
  { key: 'name', label: 'Connection name', placeholder: 'Demo MySQL Database' },
  { key: 'host', label: 'Host', placeholder: 'localhost' },
  { key: 'port', label: 'Port', placeholder: '3306' },
  { key: 'database', label: 'Database', placeholder: 'sales_db' },
  { key: 'username', label: 'Username', placeholder: 'root' },
  { key: 'password', label: 'Password', type: 'password' },
];

const inputClass = 'mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500';

export default function ConnectionModal({ open, onClose }) {
  const { connection, setConnection, saveConnection } = useConnection();
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(null); // 'test' | 'connect' | 'save' | 'disconnect' | null
  const [status, setStatus] = useState(null); // { ok, message }

  // Don't render anything when closed.
  if (!open) return null;

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function run(action, fn) {
    setBusy(action);
    setStatus(null);
    try {
      const data = await fn();
      setStatus({ ok: true, message: data?.message || 'Done.' });
      return data;
    } catch (err) {
      setStatus({ ok: false, message: err.message });
      return null;
    } finally {
      setBusy(null);
    }
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setStatus({ ok: false, message: 'Give this connection a name before saving.' });
      return;
    }
    const data = await run('save', () => saveConnection(form));
    if (data) {
      setStatus({ ok: true, message: 'Saved to your connections.' });
    }
  }

  async function handleConnect() {
    const data = await run('connect', () => connectionsApi.connect(form));
    if (data) {
      setConnection(data.connection);
      onClose();
    }
  }

  async function handleDisconnect() {
    const data = await run('disconnect', () => connectionsApi.disconnect());
    if (data) setConnection(null);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Database connection</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((f) => (
            <label key={f.key} className="block text-sm text-slate-300">
              {f.label}
              <input
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={update(f.key)}
                className={inputClass}
              />
            </label>
          ))}
        </div>

        {status && (
          <div
            className={`mt-4 flex items-start gap-2 rounded-md px-3 py-2 text-sm ${
              status.ok ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'
            }`}
          >
            {status.ok ? <CheckCircle2 size={16} className="mt-0.5" /> : <XCircle size={16} className="mt-0.5" />}
            <span>{status.message}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          {connection ? (
            <button
              onClick={handleDisconnect}
              disabled={busy !== null}
              className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              Disconnect
            </button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <button
              onClick={() => run('test', () => connectionsApi.test(form))}
              disabled={busy !== null}
              className="flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
            >
              {busy === 'test' && <Loader2 size={14} className="animate-spin" />}
              Test
            </button>
            <button
              onClick={handleSave}
              disabled={busy !== null}
              className="flex items-center gap-2 rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-50"
            >
              {busy === 'save' && <Loader2 size={14} className="animate-spin" />}
              Save
            </button>
            <button
              onClick={handleConnect}
              disabled={busy !== null}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {busy === 'connect' && <Loader2 size={14} className="animate-spin" />}
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}