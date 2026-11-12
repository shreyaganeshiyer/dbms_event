import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const inputClass =
  'mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500';

export default function AuthForm({ mode }) {
  const isLogin = mode === 'login';
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  // Already logged in: skip the form.
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (isLogin) await login(username.trim(), password);
      else await signup(username.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <h1 className="mb-1 text-xl font-semibold text-white">
          {isLogin ? 'Log in to QueryLens' : 'Create your account'}
        </h1>
        <p className="mb-5 text-sm text-slate-400">
          {isLogin ? 'Your saved connections are tied to your account.' : 'Usernames: 3-30 letters, numbers or underscores.'}
        </p>

        <label className="block text-sm text-slate-300">
          Username
          <input
            className={inputClass}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="mt-3 block text-sm text-slate-300">
          Password
          <input
            type="password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
          />
        </label>

        {error && (
          <p className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {busy ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-400">
          {isLogin ? (
            <>No account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link></>
          ) : (
            <>Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Log in</Link></>
          )}
        </p>
      </form>
    </div>
  );
}