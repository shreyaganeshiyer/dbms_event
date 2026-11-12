import { useState } from 'react';
import { Play } from 'lucide-react';

import SqlEditor from '../components/workspace/SqlEditor';
import ResultsTable from '../components/workspace/ResultsTable';

import { queriesApi } from '../services/queriesApi';
import { useConnection } from '../context/ConnectionContext';

const starter = 'SELECT * FROM customers LIMIT 10;';

export default function Workspace() {
  const { connection } = useConnection();

  const [sql, setSql] = useState(starter);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [running, setRunning] = useState(false);

  async function handleRun() {
    if (!connection) {
      setError('No database connected.');
      return;
    }
    if (!sql.trim() || running) return;

    setRunning(true);
    setError(null);
    try {
      const data = await queriesApi.execute(sql);
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err.message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="text-sm text-slate-400">Press Ctrl/Cmd + Enter to run</span>
        <button
          onClick={handleRun}
          disabled={running}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          <Play size={14} /> Run
        </button>
      </div>

      <div className="h-1/2 border-b border-slate-800">
        <SqlEditor value={sql} onChange={setSql} onRun={handleRun} />
      </div>

      <div className="flex-1 overflow-hidden bg-slate-950">
        <ResultsTable result={result} error={error} running={running} />
      </div>
    </div>
  );
}