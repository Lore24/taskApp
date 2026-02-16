import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, List, Plus, FolderKanban, ChevronLeft, Sparkles } from 'lucide-react';
import useProjectStore from '../../stores/useProjectStore';
import useUIStore from '../../stores/useUIStore';
import ProjectForm from '../projects/ProjectForm';

export default function Sidebar() {
  const { projects } = useProjectStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;
  const isProjectActive = (id) => location.pathname === `/project/${id}`;

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full z-40 bg-surface-secondary border-r border-border transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-violet to-accent-pink flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-content-primary tracking-tight">TaskApp</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-accent-violet/10 text-accent-violet'
                  : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary'
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link
              to="/list"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/list')
                  ? 'bg-accent-violet/10 text-accent-violet'
                  : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary'
              }`}
            >
              <List size={18} />
              List
            </Link>
            <Link
              to="/calendar"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/calendar')
                  ? 'bg-accent-violet/10 text-accent-violet'
                  : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary'
              }`}
            >
              <Calendar size={18} />
              Calendar
            </Link>
          </div>

          {/* Projects section */}
          <div className="mt-8">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-xs font-semibold text-content-tertiary uppercase tracking-wider">
                Projects
              </span>
              <button
                onClick={() => setShowProjectForm(true)}
                className="p-1 rounded-md text-content-tertiary hover:text-accent-violet hover:bg-accent-violet/10 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-0.5">
              {projects.filter((p) => !p.archived).map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    isProjectActive(project.id)
                      ? 'bg-surface-tertiary text-content-primary'
                      : 'text-content-secondary hover:text-content-primary hover:bg-surface-tertiary'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="truncate">{project.name}</span>
                </button>
              ))}
              {projects.filter((p) => !p.archived).length === 0 && (
                <p className="px-3 py-2 text-xs text-content-tertiary">No projects yet</p>
              )}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-accent-pink/20 flex items-center justify-center">
              <span className="text-xs font-bold text-accent-pink">L</span>
            </div>
            <span className="text-sm font-medium text-content-secondary">Lauren</span>
          </div>
        </div>
      </aside>

      <ProjectForm
        isOpen={showProjectForm}
        onClose={() => setShowProjectForm(false)}
      />
    </>
  );
}
