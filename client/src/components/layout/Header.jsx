import { Sun, Moon, Menu } from 'lucide-react';
import useUIStore from '../../stores/useUIStore';

export default function Header({ title, subtitle, actions }) {
  const { darkMode, toggleDarkMode, sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <header className="sticky top-0 z-30 bg-surface-primary/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-content-primary">{title}</h1>
            {subtitle && (
              <p className="text-sm text-content-secondary">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
