import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';
import { STATUS_COLORS } from '../../utils/constants';
import clsx from 'clsx';

export default function KanbanColumn({ status, label, tasks, projectColor, onAddTask }) {
  const colors = STATUS_COLORS[status];

  return (
    <div className="flex-shrink-0 w-80">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
          <h3 className="text-sm font-semibold text-content-primary">{label}</h3>
          <span className="text-xs font-medium text-content-tertiary bg-surface-tertiary px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="p-1 rounded-md text-content-tertiary hover:text-accent-violet hover:bg-accent-violet/10 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={clsx(
              'min-h-[200px] rounded-xl p-2 transition-colors',
              snapshot.isDraggingOver && 'bg-accent-violet/5 ring-2 ring-accent-violet/20 ring-inset'
            )}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task.id}
                task={task}
                index={index}
                projectColor={projectColor}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
