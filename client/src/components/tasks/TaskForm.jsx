import { useState } from 'react';
import Modal from '../shared/Modal';
import useTaskStore from '../../stores/useTaskStore';
import { ASSIGNEES } from '../../utils/constants';

export default function TaskForm({ isOpen, onClose, projectId, defaultStatus = 'todo', defaultDate = null }) {
  const { createTask } = useTaskStore();
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('Lauren');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask({
      projectId,
      title: title.trim(),
      status: defaultStatus,
      assignee,
      startDate: defaultDate,
      dueDate: defaultDate,
    });
    setTitle('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-content-secondary mb-1.5">
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            className="w-full px-3 py-2 bg-surface-tertiary border border-border rounded-lg text-content-primary placeholder-content-tertiary text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet/50 focus:border-accent-violet transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-content-secondary mb-1.5">
            Assignee
          </label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full px-3 py-2 bg-surface-tertiary border border-border rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet/50 focus:border-accent-violet transition-colors"
          >
            {ASSIGNEES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-content-secondary bg-surface-tertiary hover:bg-surface-tertiary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-accent-violet hover:bg-accent-violet/80 transition-colors"
          >
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
}
