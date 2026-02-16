import { useState } from 'react';
import { Plus } from 'lucide-react';
import SubtaskItem from './SubtaskItem';
import useTaskStore from '../../stores/useTaskStore';

export default function SubtaskList({ taskId }) {
  const { getSubtasksByTask, createSubtask } = useTaskStore();
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const subtasks = getSubtasksByTask(taskId);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createSubtask({ taskId, title: newTitle.trim() });
    setNewTitle('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-content-primary">Subtasks</h4>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-1 rounded-md text-content-tertiary hover:text-accent-violet hover:bg-accent-violet/10 transition-colors"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
      <div className="space-y-0.5">
        {subtasks.map((sub) => (
          <SubtaskItem key={sub.id} subtask={sub} />
        ))}
      </div>
      {isAdding && (
        <form onSubmit={handleAdd} className="mt-2 flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a subtask..."
            autoFocus
            onBlur={() => {
              if (!newTitle.trim()) setIsAdding(false);
            }}
            className="flex-1 px-3 py-1.5 bg-surface-tertiary border border-border rounded-lg text-content-primary placeholder-content-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet/50 transition-colors"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-accent-violet hover:bg-accent-violet/80 transition-colors"
          >
            Add
          </button>
        </form>
      )}
      {subtasks.length === 0 && !isAdding && (
        <p className="text-xs text-content-tertiary py-1">No subtasks yet</p>
      )}
    </div>
  );
}
