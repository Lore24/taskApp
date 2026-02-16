import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Archive, ChevronDown, Plus, ListTree } from 'lucide-react';
import Header from '../components/layout/Header';
import ListView from '../components/list/ListView';
import ArchivedTaskRow from '../components/shared/ArchivedTaskRow';
import TaskDetailPanel from '../components/tasks/TaskDetailPanel';
import TaskForm from '../components/tasks/TaskForm';
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
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(true);

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
          <div className="flex items-center gap-3">
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
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                showSubtasks
                  ? 'text-accent-violet bg-accent-violet/10'
                  : 'text-content-tertiary hover:text-content-secondary bg-surface-tertiary'
              }`}
              title={showSubtasks ? 'Hide subtasks' : 'Show subtasks'}
            >
              <ListTree size={16} />
              Subtasks
            </button>
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-accent-violet hover:bg-accent-violet/80 transition-colors"
            >
              <Plus size={16} />
              New Task
            </button>
          </div>
        }
      />
      <ListView
        tasks={activeTasks}
        subtasks={subtasks}
        projects={projects}
        filter={filter}
        showSubtasks={showSubtasks}
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

      <TaskForm
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        projects={projects}
      />
      <TaskDetailPanel />
    </div>
  );
}
