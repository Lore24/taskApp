import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ProjectPage from './pages/ProjectPage';
import CalendarPage from './pages/CalendarPage';
import ListPage from './pages/ListPage';
import useUIStore from './stores/useUIStore';

export default function App() {
  const { darkMode } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/list" element={<ListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
