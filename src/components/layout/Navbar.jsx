import { NavLink } from "react-router-dom";
import { Database, Bell, ChevronDown } from "lucide-react";
import ConnectionStatus from "../connections/ConnectionStatus";

const tabs = [
  { to: "/", label: "Workspace" },
  { to: "/history", label: "History" },
  { to: "/analytics", label: "Analytics" },
  { to: "/optimization-lab", label: "Optimization Lab" },
];

export default function Navbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950 px-6">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
            <Database size={18} />
          </div>
          <span className="font-semibold text-white">QueryLens</span>
        </div>

        <nav className="flex items-center gap-1">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-slate-400 hover:text-slate-200"
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <ConnectionStatus />
        <button className="relative text-slate-400 hover:text-slate-200">
          <Bell size={18} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button className="flex items-center gap-2 text-slate-300">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
            S
          </span>
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}
