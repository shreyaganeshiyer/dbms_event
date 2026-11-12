import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Database, Plus, Trash2 } from 'lucide-react';
import { useConnection } from '../../context/ConnectionContext';
import ConnectionModal from './ConnectionModal';

export default function ConnectionStatus() {

  const { connection,saved,refreshSaved,switchTo,removeSaved,} = useConnection();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [switchingId, setSwitchingId] = useState(null);
  const [error, setError] = useState(null);
  const wrapRef = useRef(null);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const toggleMenu = () => {
    if (!menuOpen) {
      setError(null);
      refreshSaved();
    }
    setMenuOpen((o) => !o);
  };

  const isActive = (c) =>
    connection &&
    connection.name === c.name &&
    connection.database === c.database;

  const handleSwitch = async (id) => {
    setSwitchingId(id);
    setError(null);
    try {
      await switchTo(id);
      setMenuOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSwitchingId(null);
    }
  };

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this saved connection?')) return;
    setError(null);
    try {
      await removeSaved(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const connected = Boolean(connection);

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
      >
        <span
          className={`h-2 w-2 rounded-full ${
            connected ? 'bg-emerald-500' : 'bg-slate-500'
          }`}
        />
        <span className="max-w-[10rem] truncate">
          {connected ? connection.name : 'Not connected'}
        </span>
        <ChevronDown size={14} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 rounded-lg border border-slate-800 bg-slate-900 p-1 shadow-xl">
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-500">
            Saved connections
          </p>

          {saved.length === 0 && (
            <p className="px-3 pb-3 text-sm text-slate-400">
              No saved connections yet.
            </p>
          )}

          <ul className="max-h-64 overflow-y-auto">
            {saved.map((c) => (
              <li key={c.id}>
                <div
                  onClick={() => handleSwitch(c.id)}
                  className="group flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 hover:bg-slate-800"
                >
                  <Database size={14} className="shrink-0 text-slate-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-slate-100">{c.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {c.username}@{c.host}:{c.port}/{c.database}
                    </p>
                  </div>

                  {switchingId === c.id ? (
                    <span className="text-xs text-slate-400">Connecting…</span>
                  ) : isActive(c) ? (
                    <Check size={16} className="shrink-0 text-emerald-500" />
                  ) : null}

                  <button
                    onClick={(e) => handleRemove(e, c.id)}
                    className="shrink-0 rounded p-1 text-slate-500 opacity-0 hover:text-red-400 group-hover:opacity-100"
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {error && <p className="px-3 py-2 text-xs text-red-400">{error}</p>}

          <div className="mt-1 border-t border-slate-800 pt-1">
            <button
              onClick={() => {
                setMenuOpen(false);
                setModalOpen(true);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-blue-400 hover:bg-slate-800"
            >
              <Plus size={14} />
              New connection
            </button>
          </div>
        </div>
      )}

      <ConnectionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}