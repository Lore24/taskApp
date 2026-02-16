import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useUIStore from '../../stores/useUIStore';

export default function Layout() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-surface-primary">
      <Sidebar />
      <main
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
