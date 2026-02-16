import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Columns3, Calendar, List, Pencil, Trash2, Archive, ChevronDown } from 'lucide-react';
import Header from '../components/layout/Header';
import KanbanBoard from '../components/kanban/KanbanBoard';
import CalendarView from '../components/calendar/CalendarView';
import ListView from '../components/list/ListView';
import TaskForm from '../components/tasks/TaskForm';
import TaskDetailPanel from '../components/tasks/TaskDetailPanel';
import ProjectForm from '../components/projects/ProjectForm';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import ArchivedTaskRow from '../components/shared/ArchivedTaskRow';
import useProjectStore from '../stores/useProjectStore';
import useTaskStore from '../stores/useTaskStore';
import useUIStore from '../stores/useUIStore';

export default function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getProject, fetchProjects, deleteProject } = useProjectStore();
  const { fetchTasks, fetchAllSubtasks, tasks, subtasks } = useTaskStore();
  const { activeView, setActiveView } = useUIStore();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');
  const [defaultDate, setDefaultDate] = useState(null);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showDeleteProject, setShowDeleteProject] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const project = getProject(projectId);

  useEffect(() => {
    fetchProjects();
    fetchTasks(projectId);
    fetchAllSubtasks();
  }, [projectId]);

  const handleAddTask = (status) => {
    setDefaultStatus(status);
    setDefaultDate(null);
    setShowTaskForm(true);
  };

  const handleDateSelect = (dateStr) => {
    setDefaultDate(dateStr);
    setDefaultStatus('todo');
    setShowTaskForm(true);
  };

  const handleDeleteProject = async () => {
    await deleteProject(projectId);
    navigate('/');
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-content-tertiary">Loading project...</p>
      </div>
    );
  }

  const allProjectTasks = tasks.filter((t) => t.projectId === projectId);
  const projectTasks = allProjectTasks.filter((t) => t.status !== 'archived');
  const archivedTasks = allProjectTasks.filter((t) => t.status === 'archived');
  const projectSubtasks = subtasks.filter((s) =>
    projectTasks.some((t) => t.id === s.taskId)
  );

  return (
    <div className="min-h-screen">
      <Header
        title={project.name}
        subtitle={project.description}
        actions={
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center bg-surface-tertiary rounded-lg p-0.5">
              <button
                onClick={() => setActiveView('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'kanban'
                    ? 'bg-surface-card text-accent-violet shadow-sm'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                <Columns3 size={16} />
                Board
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'list'
                    ? 'bg-surface-card text-accent-violet shadow-sm'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                <List size={16} />
                List
              </button>
              <button
                onClick={() => setActiveView('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'calendar'
                    ? 'bg-surface-card text-accent-violet shadow-sm'
                    : 'text-content-secondary hover:text-content-primary'
                }`}
              >
                <Calendar size={16} />
                Calendar
              </button>
            </div>

            <button
              onClick={() => setShowEditProject(true)}
              className="p-2 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary transition-colors"
              title="Edit project"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={async () => {
                const { updateProject } = useProjectStore.getState();
                await updateProject(projectId, { archived: true });
                navigate('/');
              }}
              className="p-2 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary transition-colors"
              title="Archive project"
            >
              <Archive size={18} />
            </button>
            <button
              onClick={() => setShowDeleteProject(true)}
              className="p-2 rounded-lg text-content-tertiary hover:text-accent-rose hover:bg-accent-rose/10 transition-colors"
              title="Delete project"
            >
              <Trash2 size={18} />
            </button>
          </div>
        }
      />

      <div className="py-4">
        {activeView === 'kanban' ? (
          <KanbanBoard
            projectId={projectId}
            projectColor={project.color}
            onAddTask={handleAddTask}
          />
        ) : activeView === 'list' ? (
          <ListView
            tasks={projectTasks}
            subtasks={projectSubtasks}
            projects={[project]}
            filter="all"
          />
        ) : (
          <CalendarView
            tasks={projectTasks}
            subtasks={projectSubtasks}
            projects={[project]}
            onDateSelect={handleDateSelect}
          />
        )}
      </div>

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
              {archivedTasks.map((task) => (
                <ArchivedTaskRow key={task.id} task={task} projectColor={project.color} />
              ))}
            </div>
          )}
        </div>
      )}

      <TaskForm
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        projectId={projectId}
        defaultStatus={defaultStatus}
        defaultDate={defaultDate}
      />

      <TaskDetailPanel />

      <ProjectForm
        isOpen={showEditProject}
        onClose={() => setShowEditProject(false)}
        project={project}
      />

      <ConfirmDialog
        isOpen={showDeleteProject}
        onClose={() => setShowDeleteProject(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${project.name}"? All tasks and subtasks will be permanently removed.`}
      />
    </div>
  );
}
