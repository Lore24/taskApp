import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { formatRelative, isDueOverdue } from '../../utils/dateHelpers';
import useTaskStore from '../../stores/useTaskStore';
import useUIStore from '../../stores/useUIStore';
import AssigneeBadge from '../shared/AssigneeBadge';

export default function KanbanCard({ task, index, projectColor }) {
  const { getSubtaskProgress, patchTask } = useTaskStore();
  const { openTaskPanel } = useUIStore();
  const progress = getSubtaskProgress(task.id);
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
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => openTaskPanel(task.id)}
          className={`group rounded-xl p-4 mb-2.5 border-l-4 cursor-pointer transition-all duration-300 bg-surface-card border border-border/50 hover:border-border ${
            snapshot.isDragging ? 'shadow-2xl shadow-accent-violet/10 rotate-1 scale-[1.02]' : 'hover:shadow-lg'
          } ${archiving ? 'opacity-50 scale-95' : ''}`}
          style={{
            borderLeftColor: projectColor,
            ...provided.draggableProps.style,
          }}
        >
          <div className="flex items-start gap-2 mb-2">
            <button
              onClick={handleArchive}
              className="mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 text-content-tertiary hover:text-accent-emerald transition-all"
              title="Archive task"
            >
              <Circle size={16} />
            </button>
            <p className="font-medium text-sm text-content-primary leading-snug flex-1">
              {task.title}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {task.assignee && (
              <AssigneeBadge name={task.assignee} size="sm" showName={true} />
            )}
            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-xs ${
                  overdue ? 'text-accent-rose font-medium' : 'text-content-tertiary'
                }`}
              >
                <Calendar size={12} />
                {formatRelative(task.dueDate)}
              </span>
            )}
            {progress && (
              <span className="inline-flex items-center gap-1 text-xs text-content-tertiary">
                <CheckCircle2 size={12} />
                {progress.done}/{progress.total}
              </span>
            )}
          </div>
          {progress && (
            <div className="mt-2.5 h-1 rounded-full bg-surface-tertiary overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-emerald transition-all duration-300"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
