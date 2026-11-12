import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ConnectionProvider } from '../../context/ConnectionContext';

// Only logged-in users get the connections provider, so its API calls never run logged out.
export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return <ConnectionProvider>{children}</ConnectionProvider>;
}