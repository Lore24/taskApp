import { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Clock, User, FileText, Archive, ArchiveRestore } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import useUIStore from '../../stores/useUIStore';
import useTaskStore from '../../stores/useTaskStore';
import useProjectStore from '../../stores/useProjectStore';
import SubtaskList from './SubtaskList';
import StatusBadge from '../shared/StatusBadge';
import ConfirmDialog from '../shared/ConfirmDialog';
import { STATUSES, STATUS_LABELS, ASSIGNEES } from '../../utils/constants';
import { toInputDatetime, fromInputDatetime } from '../../utils/dateHelpers';

export default function TaskDetailPanel() {
  const { selectedTaskId, taskPanelOpen, closeTaskPanel } = useUIStore();
  const { getTask, updateTask, deleteTask, fetchSubtasks } = useTaskStore();
  const { getProject } = useProjectStore();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('todo');
  const [assignee, setAssignee] = useState('Lauren');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [saving, setSaving] = useState(false);

  const task = selectedTaskId ? getTask(selectedTaskId) : null;
  const project = task ? getProject(task.projectId) : null;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setNotes(task.notes || '');
      setStatus(task.status);
      setAssignee(task.assignee || 'Lauren');
      setStartDate(toInputDatetime(task.startDate));
      setDueDate(toInputDatetime(task.dueDate));
      fetchSubtasks(task.id);
    }
  }, [task?.id, task?.updatedAt]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && taskPanelOpen) closeTaskPanel();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [taskPanelOpen, closeTaskPanel]);

  const saveField = async (field, value) => {
    if (!task) return;
    setSaving(true);
    try {
      await updateTask(task.id, { [field]: value });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    await deleteTask(task.id);
    closeTaskPanel();
  };

  if (!taskPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={closeTaskPanel}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-lg bg-surface-secondary border-l border-border shadow-2xl overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-surface-secondary border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {project && (
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
            )}
            <span className="text-sm text-content-secondary font-medium">{project?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            {saving && (
              <span className="text-xs text-content-tertiary">Saving...</span>
            )}
            {task?.status === 'archived' ? (
              <button
                onClick={() => { saveField('status', 'done'); setStatus('done'); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-accent-violet bg-accent-violet/10 hover:bg-accent-violet/20 transition-colors"
              >
                <ArchiveRestore size={14} />
                Restore
              </button>
            ) : (
              <button
                onClick={() => { saveField('status', 'archived'); closeTaskPanel(); }}
                className="p-2 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary transition-colors"
                title="Archive task"
              >
                <Archive size={16} />
              </button>
            )}
            <button
              onClick={() => setShowDelete(true)}
              className="p-2 rounded-lg text-content-tertiary hover:text-accent-rose hover:bg-accent-rose/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={closeTaskPanel}
              className="p-2 rounded-lg text-content-tertiary hover:text-content-primary hover:bg-surface-tertiary transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {task ? (
          <div className="px-6 py-5 space-y-6">
            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => title.trim() && saveField('title', title.trim())}
              className="w-full text-xl font-bold bg-transparent text-content-primary border-none outline-none placeholder-content-tertiary"
              placeholder="Task title..."
            />

            {/* Status & Assignee */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-content-tertiary mb-1.5">
                  <FileText size={12} /> Status
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    saveField('status', e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-surface-tertiary border border-border rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet/50 transition-colors"
                >
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-content-tertiary mb-1.5">
                  <User size={12} /> Assignee
                </label>
                <select
                  value={assignee}
                  onChange={(e) => {
                    setAssignee(e.target.value);
                    saveField('assignee', e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-surface-tertiary border border-border rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet/50 transition-colors"
                >
                  {ASSIGNEES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-content-tertiary mb-1.5">
                  <Clock size={12} /> Start
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    saveField('startDate', fromInputDatetime(e.target.value));
                  }}
                  className="w-full px-3 py-2 bg-surface-tertiary border border-border rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet/50 transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-content-tertiary mb-1.5">
                  <Calendar size={12} /> Due
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    saveField('dueDate', fromInputDatetime(e.target.value));
                  }}
                  className="w-full px-3 py-2 bg-surface-tertiary border border-border rounded-lg text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet/50 transition-colors"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-content-tertiary mb-2">
                <FileText size={12} /> Notes
              </label>
              <div data-color-mode="dark">
                <MDEditor
                  value={notes}
                  onChange={(val) => setNotes(val || '')}
                  onBlur={() => saveField('notes', notes)}
                  preview="edit"
                  height={200}
                  visibleDragbar={false}
                />
              </div>
            </div>

            {/* Subtasks */}
            <div className="border-t border-border pt-5">
              <SubtaskList taskId={task.id} />
            </div>
          </div>
        ) : (
          <div className="px-6 py-16 text-center text-content-tertiary">
            Task not found
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This will also remove all subtasks. This action cannot be undone."
      />

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
