import { ArchiveRestore } from 'lucide-react';
import AssigneeBadge from './AssigneeBadge';
import useTaskStore from '../../stores/useTaskStore';
import useUIStore from '../../stores/useUIStore';

export default function ArchivedTaskRow({ task, projectColor }) {
  const { patchTask } = useTaskStore();
  const { openTaskPanel } = useUIStore();

  return (
    <div className="flex items-center gap-4 px-6 py-2 border-b border-border/30 hover:bg-surface-tertiary/20 transition-colors group">
      <div
        className="w-1 h-6 rounded-full flex-shrink-0 opacity-40"
        style={{ backgroundColor: projectColor }}
      />
      <span
        onClick={() => openTaskPanel(task.id)}
        className="flex-1 text-sm text-content-tertiary line-through cursor-pointer hover:text-content-secondary transition-colors truncate"
      >
        {task.title}
      </span>
      {task.assignee && <AssigneeBadge name={task.assignee} size="sm" showName={false} />}
      <button
        onClick={() => patchTask(task.id, { status: 'done' })}
        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 rounded-md text-xs text-content-tertiary hover:text-accent-violet hover:bg-accent-violet/10 transition-all"
        title="Restore task"
      >
        <ArchiveRestore size={14} />
        Restore
      </button>
    </div>
  );
}
