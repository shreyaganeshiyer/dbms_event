import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as connectionsApi from '../services/connectionsApi';

const ConnectionContext = createContext(null);

// Strip the password before keeping a connection in client state.
const toPublic = ({ password, ...rest }) => rest;

export function ConnectionProvider({ children }) {
  
  const [connection, setConnection] = useState(null);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshSaved = useCallback(async () => {
    try {
      const data = await connectionsApi.listSaved();
      setSaved(data.connections ?? []);
    } catch {
      setSaved([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await connectionsApi.getActive();
        if (!cancelled) setConnection(data.connection ?? null);
      } catch {
        if (!cancelled) setConnection(null);
      }

      await refreshSaved();
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshSaved]);

  const connectWith = useCallback(async (details) => {
    const data = await connectionsApi.connect(details);
    setConnection(data.connection ?? toPublic(details));
    return data;
  }, []);

  const disconnect = useCallback(async () => {
    await connectionsApi.disconnect();
    setConnection(null);
  }, []);

  const switchTo = useCallback(async (id) => {
    const data = await connectionsApi.connectSaved(id);
    setConnection(data.connection ?? null);
    return data;
  }, []);

  const saveConnection = useCallback(
    async (details) => {
      const data = await connectionsApi.saveConnection(details);
      await refreshSaved();
      return data;
    },
    [refreshSaved]
  );

  const removeSaved = useCallback(
    async (id) => {
      await connectionsApi.deleteSaved(id);
      await refreshSaved();
    },
    [refreshSaved]
  );

  const value = useMemo(
    () => ({
      connection,
      setConnection,
      saved,
      loading,
      refreshSaved,
      connectWith,
      disconnect,
      switchTo,
      saveConnection,
      removeSaved,
    }),
    [
      connection,
      saved,
      loading,
      refreshSaved,
      connectWith,
      disconnect,
      switchTo,
      saveConnection,
      removeSaved,
    ]
  );

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const ctx = useContext(ConnectionContext);
  if (!ctx) {
    throw new Error('useConnection must be used inside <ConnectionProvider>');
  }
  return ctx;
}