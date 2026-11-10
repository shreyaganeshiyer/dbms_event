import { useState } from "react";
import { useConnection } from "../../context/ConnectionContext";
import ConnectionModal from "./ConnectionModal";

export default function ConnectionStatus() {
  const { connection } = useConnection();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
      >
        <span
          className={`h-2 w-2 rounded-full ${connection ? "bg-emerald-400" : "bg-slate-500"}`}
        />
        {connection ? connection.name : "No database connected"}
      </button>

      {open && <ConnectionModal onClose={() => setOpen(false)} />}
    </>
  );
}
