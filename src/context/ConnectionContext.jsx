import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { connectionsApi } from "../services/connectionsApi";

const ConnectionContext = createContext(null);

export function ConnectionProvider({ children }) {
  const [connection, setConnection] = useState(null);

  const refresh = useCallback(async () => {
    const data = await connectionsApi.getActive();
    setConnection(data.connected ? data.connection : null);
  }, []);

  useEffect(() => {
    refresh().catch(() => setConnection(null));
  }, [refresh]);

  return (
    <ConnectionContext.Provider value={{ connection, setConnection, refresh }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}
