import { ListTodo } from 'lucide-react';
import ListTaskRow from './ListTaskRow';
import EmptyState from '../shared/EmptyState';
import { matchesDateFilter } from '../../utils/dateHelpers';

export default function ListView({ tasks, subtasks, projects, filter }) {
  const hasResults = projects.some((project) => {
    const projectTasks = tasks
      .filter((t) => t.projectId === project.id)
      .filter((t) => matchesDateFilter(t, filter));
    return projectTasks.length > 0;
  });

  const filterLabel = {
    all: '',
    today: ' for today',
    week: ' this week',
    month: ' this month',
  };

  return (
    <div className="pb-8">
      {/* Column headers */}
      <div className="flex items-center gap-4 px-6 py-2 border-b border-border text-[10px] font-semibold text-content-tertiary uppercase tracking-wider sticky top-[57px] z-20 bg-surface-primary">
        <div className="w-1 flex-shrink-0" />
        <span className="flex-1">Task</span>
        <span className="w-20 flex-shrink-0">Assignee</span>
        <span className="w-24 flex-shrink-0">Start</span>
        <span className="w-24 flex-shrink-0">Due</span>
        <span className="w-24 flex-shrink-0">Status</span>
      </div>

      {hasResults ? (
        projects.map((project) => {
          const projectTasks = tasks
            .filter((t) => t.projectId === project.id)
            .filter((t) => matchesDateFilter(t, filter));

          if (projectTasks.length === 0) return null;

          return (
            <div key={project.id}>
              {/* Project group header */}
              <div className="flex items-center gap-2.5 px-6 py-2.5 bg-surface-secondary/50 border-b border-border">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <h3 className="text-sm font-semibold text-content-primary">{project.name}</h3>
                <span className="text-xs text-content-tertiary font-medium">
                  {projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Tasks */}
              {projectTasks.map((task) => (
                <ListTaskRow
                  key={task.id}
                  task={task}
                  subtasks={subtasks.filter((s) => s.taskId === task.id)}
                  projectColor={project.color}
                />
              ))}
            </div>
          );
        })
      ) : (
        <EmptyState
          icon={ListTodo}
          title={`No tasks${filterLabel[filter] || ''}`}
          description={
            filter !== 'all'
              ? 'Try a different time filter or check back later.'
              : 'Create a project and add tasks to see them here.'
          }
        />
      )}
    </div>
  );
}
