import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ComingSoon from './pages/ComingSoon';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ComingSoon title="Workspace" />} />
        <Route path="/history" element={<ComingSoon title="History" />} />
        <Route path="/analytics" element={<ComingSoon title="Analytics" />} />
        <Route path="/optimization-lab" element={<ComingSoon title="Optimization Lab" />} />
      </Route>
    </Routes>
  );
}