import { useEffect } from 'react';
import Header from '../components/layout/Header';
import CalendarView from '../components/calendar/CalendarView';
import TaskDetailPanel from '../components/tasks/TaskDetailPanel';
import useProjectStore from '../stores/useProjectStore';
import useTaskStore from '../stores/useTaskStore';

export default function CalendarPage() {
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, subtasks, fetchAllTasks, fetchAllSubtasks } = useTaskStore();

  useEffect(() => {
    fetchProjects();
    fetchAllTasks();
    fetchAllSubtasks();
  }, []);

  return (
    <div className="min-h-screen">
      <Header
        title="Calendar"
        subtitle="All tasks across projects"
      />
      <CalendarView
        tasks={tasks.filter((t) => t.status !== 'archived')}
        subtasks={subtasks}
        projects={projects}
      />
      <TaskDetailPanel />
    </div>
  );
}
