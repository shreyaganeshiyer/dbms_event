import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ComingSoon from "./pages/ComingSoon";
import Workspace from "./pages/workSpace";

import RequireAuth from "./components/auth/requireAuth";
import Login from "./pages/login";
import Signup from "./pages/signin";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/" element={<RequireAuth> <AppLayout /> </RequireAuth> }>
          <Route path="/" element={<Workspace />} />
          <Route path="/history" element={<ComingSoon title="History" />} />
          <Route path="/analytics" element={<ComingSoon title="Analytics" />} />
          <Route
            path="/optimization-lab"
            element={<ComingSoon title="Optimization Lab" />}
          />
      </Route>
    </Routes>
  );
}
