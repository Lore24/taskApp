import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Header from '../components/layout/Header';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskDetailPanel from '../components/tasks/TaskDetailPanel';
import TaskForm from '../components/tasks/TaskForm';
import useProjectStore from '../stores/useProjectStore';
import useTaskStore from '../stores/useTaskStore';

export default function KanbanPage() {
  const { projects, fetchProjects } = useProjectStore();
  const { fetchAllTasks, fetchAllSubtasks } = useTaskStore();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  useEffect(() => {
    fetchProjects();
    fetchAllTasks();
    fetchAllSubtasks();
  }, []);

  const handleAddTask = (status) => {
    setDefaultStatus(status);
    setShowTaskForm(true);
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Board"
        subtitle="All tasks across projects"
        actions={
          <button
            onClick={() => { setDefaultStatus('todo'); setShowTaskForm(true); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-accent-violet hover:bg-accent-violet/80 transition-colors"
          >
            <Plus size={16} />
            New Task
          </button>
        }
      />
      <div className="pt-4">
        <KanbanBoard
          projectId={null}
          projects={projects}
          onAddTask={handleAddTask}
        />
      </div>
      <TaskForm
        isOpen={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        projects={projects}
        defaultStatus={defaultStatus}
      />
      <TaskDetailPanel />
    </div>
  );
}
