import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import PortfolioPage from './pages/PortfolioPage';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen isLoading={loading} />
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
