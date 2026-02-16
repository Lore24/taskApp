import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Archive, ChevronDown } from 'lucide-react';
import Header from '../components/layout/Header';
import ListView from '../components/list/ListView';
import ArchivedTaskRow from '../components/shared/ArchivedTaskRow';
import TaskDetailPanel from '../components/tasks/TaskDetailPanel';
import useProjectStore from '../stores/useProjectStore';
import useTaskStore from '../stores/useTaskStore';

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

export default function ListPage() {
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, subtasks, fetchAllTasks, fetchAllSubtasks } = useTaskStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const [showArchived, setShowArchived] = useState(false);

  const activeTasks = tasks.filter((t) => t.status !== 'archived');
  const archivedTasks = tasks.filter((t) => t.status === 'archived');

  useEffect(() => {
    fetchProjects();
    fetchAllTasks();
    fetchAllSubtasks();
  }, []);

  return (
    <div className="min-h-screen">
      <Header
        title="List"
        subtitle="All tasks across projects"
        actions={
          <div className="flex items-center bg-surface-tertiary rounded-lg p-0.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSearchParams(tab.key === 'all' ? {} : { filter: tab.key })}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-surface-card text-accent-violet shadow-sm'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        }
      />
      <ListView
        tasks={activeTasks}
        subtasks={subtasks}
        projects={projects}
        filter={filter}
      />

      {/* Archived tasks section */}
      {archivedTasks.length > 0 && (
        <div className="px-6 pb-6">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 text-sm text-content-tertiary hover:text-content-secondary transition-colors"
          >
            <Archive size={16} />
            {showArchived ? 'Hide' : 'Show'} archived ({archivedTasks.length})
            <ChevronDown size={14} className={`transition-transform duration-200 ${showArchived ? 'rotate-180' : ''}`} />
          </button>
          {showArchived && (
            <div className="mt-3 space-y-0.5">
              {projects.filter((p) => !p.archived).map((project) => {
                const projArchived = archivedTasks.filter((t) => t.projectId === project.id);
                if (projArchived.length === 0) return null;
                return (
                  <div key={project.id}>
                    <div className="px-6 py-2 text-xs font-semibold text-content-tertiary uppercase tracking-wider">
                      {project.name}
                    </div>
                    {projArchived.map((task) => (
                      <ArchivedTaskRow key={task.id} task={task} projectColor={project.color} />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <TaskDetailPanel />
    </div>
  );
}
