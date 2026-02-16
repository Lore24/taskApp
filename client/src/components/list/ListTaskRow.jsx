import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import AssigneeBadge from '../shared/AssigneeBadge';
import StatusBadge from '../shared/StatusBadge';
import { formatDate, isDueOverdue } from '../../utils/dateHelpers';
import useUIStore from '../../stores/useUIStore';
import useTaskStore from '../../stores/useTaskStore';

export default function ListTaskRow({ task, subtasks, projectColor }) {
  const { openTaskPanel } = useUIStore();
  const { patchTask } = useTaskStore();
  const overdue = task.status !== 'done' && isDueOverdue(task.dueDate);
  const [archiving, setArchiving] = useState(false);

  const handleArchive = (e) => {
    e.stopPropagation();
    setArchiving(true);
    setTimeout(() => {
      patchTask(task.id, { status: 'archived' });
    }, 300);
  };

  return (
    <div>
      {/* Main task row */}
      <div
        onClick={() => openTaskPanel(task.id)}
        className={`flex items-center gap-4 px-6 py-3 border-b border-border/50 cursor-pointer hover:bg-surface-tertiary/30 transition-all duration-300 group ${archiving ? 'opacity-50 scale-95' : ''}`}
      >
        <button
          onClick={handleArchive}
          className="flex-shrink-0 text-content-tertiary hover:text-accent-emerald transition-colors"
          title="Archive task"
        >
          <Circle size={16} />
        </button>
        <div
          className="w-1 h-8 rounded-full flex-shrink-0"
          style={{ backgroundColor: projectColor }}
        />
        <span className="flex-1 text-sm font-medium text-content-primary truncate group-hover:text-accent-violet transition-colors">
          {task.title}
        </span>
        <span className="w-20 flex-shrink-0">
          {task.assignee && <AssigneeBadge name={task.assignee} size="sm" showName={false} />}
        </span>
        <span className="w-24 flex-shrink-0 text-xs text-content-tertiary">
          {formatDate(task.startDate)}
        </span>
        <span className={`w-24 flex-shrink-0 text-xs ${overdue ? 'text-accent-rose font-medium' : 'text-content-tertiary'}`}>
          {formatDate(task.dueDate)}
        </span>
        <span className="w-24 flex-shrink-0">
          <StatusBadge status={task.status} />
        </span>
      </div>

      {/* Subtask rows */}
      {subtasks.length > 0 && subtasks.map((sub) => (
        <div
          key={sub.id}
          onClick={() => openTaskPanel(task.id)}
          className="flex items-center gap-4 px-6 py-2 pl-14 border-b border-border/30 cursor-pointer hover:bg-surface-tertiary/20 transition-colors"
        >
          <span className="flex-shrink-0">
            {sub.status === 'done' ? (
              <CheckCircle2 size={14} className="text-accent-emerald" />
            ) : (
              <Circle size={14} className="text-content-tertiary" />
            )}
          </span>
          <span className={`flex-1 text-xs truncate ${sub.status === 'done' ? 'line-through text-content-tertiary' : 'text-content-secondary'}`}>
            {sub.title}
          </span>
          <span className="w-20 flex-shrink-0">
            {sub.assignee && <AssigneeBadge name={sub.assignee} size="sm" />}
          </span>
          <span className="w-24 flex-shrink-0 text-[11px] text-content-tertiary">
            {formatDate(sub.startDate)}
          </span>
          <span className="w-24 flex-shrink-0 text-[11px] text-content-tertiary">
            {formatDate(sub.dueDate)}
          </span>
          <span className="w-24 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
