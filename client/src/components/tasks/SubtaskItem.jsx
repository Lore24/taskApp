import { useState } from 'react';
import { CheckCircle2, Circle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import useTaskStore from '../../stores/useTaskStore';
import AssigneeBadge from '../shared/AssigneeBadge';
import { ASSIGNEES } from '../../utils/constants';
import { toInputDatetime, toInputDate, fromInputDatetime, fromInputDate, hasTime } from '../../utils/dateHelpers';

export default function SubtaskItem({ subtask }) {
  const { patchSubtask, deleteSubtask } = useTaskStore();
  const isDone = subtask.status === 'done';
  const [isExpanded, setIsExpanded] = useState(false);

  const [editTitle, setEditTitle] = useState(subtask.title);
  const [editStartDate, setEditStartDate] = useState(
    hasTime(subtask.startDate) ? toInputDatetime(subtask.startDate) : toInputDate(subtask.startDate)
  );
  const [editDueDate, setEditDueDate] = useState(
    hasTime(subtask.dueDate) ? toInputDatetime(subtask.dueDate) : toInputDate(subtask.dueDate)
  );
  const [editAssignee, setEditAssignee] = useState(subtask.assignee || 'Lauren');
  const [startTimeOn, setStartTimeOn] = useState(hasTime(subtask.startDate));
  const [dueTimeOn, setDueTimeOn] = useState(hasTime(subtask.dueDate));

  const toggleStatus = (e) => {
    e.stopPropagation();
    patchSubtask(subtask.id, { status: isDone ? 'todo' : 'done' });
  };

  const handleExpand = () => {
    if (!isExpanded) {
      const sTime = hasTime(subtask.startDate);
      const dTime = hasTime(subtask.dueDate);
      setEditTitle(subtask.title);
      setStartTimeOn(sTime);
      setDueTimeOn(dTime);
      setEditStartDate(sTime ? toInputDatetime(subtask.startDate) : toInputDate(subtask.startDate));
      setEditDueDate(dTime ? toInputDatetime(subtask.dueDate) : toInputDate(subtask.dueDate));
      setEditAssignee(subtask.assignee || 'Lauren');
    }
    setIsExpanded(!isExpanded);
  };

  const handleSave = () => {
    patchSubtask(subtask.id, {
      title: editTitle.trim() || subtask.title,
      startDate: startTimeOn ? fromInputDatetime(editStartDate) : fromInputDate(editStartDate),
      dueDate: dueTimeOn ? fromInputDatetime(editDueDate) : fromInputDate(editDueDate),
      assignee: editAssignee,
    });
    setIsExpanded(false);
  };

  return (
    <div className="rounded-lg transition-colors">
      {/* Collapsed row */}
      <div className="group flex items-center gap-2 py-2 px-1 hover:bg-surface-tertiary/50 rounded-lg">
        <button onClick={toggleStatus} className="flex-shrink-0">
          {isDone ? (
            <CheckCircle2 size={18} className="text-accent-emerald" />
          ) : (
            <Circle size={18} className="text-content-tertiary hover:text-accent-violet transition-colors" />
          )}
        </button>
        <button
          onClick={handleExpand}
          className={`flex-1 text-left text-sm truncate ${
            isDone ? 'line-through text-content-tertiary' : 'text-content-primary hover:text-accent-violet'
          } transition-colors`}
        >
          {subtask.title}
        </button>
        {subtask.assignee && (
          <AssigneeBadge name={subtask.assignee} size="sm" />
        )}
        <button
          onClick={handleExpand}
          className="p-0.5 rounded text-content-tertiary hover:text-content-primary transition-colors"
        >
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); deleteSubtask(subtask.id); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded text-content-tertiary hover:text-accent-rose transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Expanded editor */}
      {isExpanded && (
        <div className="ml-7 mt-1 mb-2 p-3 bg-surface-tertiary/30 border border-border rounded-lg space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Subtask title..."
            className="w-full px-2.5 py-1.5 bg-surface-tertiary border border-border rounded-md text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-violet/50 transition-colors"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-medium text-content-tertiary uppercase tracking-wider">Start</label>
                <button
                  type="button"
                  onClick={() => {
                    const newOn = !startTimeOn;
                    setStartTimeOn(newOn);
                    if (!newOn && editStartDate) {
                      setEditStartDate(editStartDate.slice(0, 10));
                    } else if (newOn && editStartDate) {
                      setEditStartDate(editStartDate + 'T09:00');
                    }
                  }}
                  className={`text-[9px] font-medium px-1 py-0.5 rounded transition-colors ${
                    startTimeOn
                      ? 'text-accent-violet bg-accent-violet/10'
                      : 'text-content-tertiary hover:text-content-secondary'
                  }`}
                >
                  {startTimeOn ? 'Has time' : '+ Time'}
                </button>
              </div>
              <input
                type={startTimeOn ? 'datetime-local' : 'date'}
                value={editStartDate}
                onChange={(e) => setEditStartDate(e.target.value)}
                className="w-full px-2 py-1.5 bg-surface-tertiary border border-border rounded-md text-content-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent-violet/50 transition-colors"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-medium text-content-tertiary uppercase tracking-wider">Due</label>
                <button
                  type="button"
                  onClick={() => {
                    const newOn = !dueTimeOn;
                    setDueTimeOn(newOn);
                    if (!newOn && editDueDate) {
                      setEditDueDate(editDueDate.slice(0, 10));
                    } else if (newOn && editDueDate) {
                      setEditDueDate(editDueDate + 'T17:00');
                    }
                  }}
                  className={`text-[9px] font-medium px-1 py-0.5 rounded transition-colors ${
                    dueTimeOn
                      ? 'text-accent-violet bg-accent-violet/10'
                      : 'text-content-tertiary hover:text-content-secondary'
                  }`}
                >
                  {dueTimeOn ? 'Has time' : '+ Time'}
                </button>
              </div>
              <input
                type={dueTimeOn ? 'datetime-local' : 'date'}
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full px-2 py-1.5 bg-surface-tertiary border border-border rounded-md text-content-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent-violet/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-content-tertiary mb-1 uppercase tracking-wider">Assignee</label>
            <select
              value={editAssignee}
              onChange={(e) => setEditAssignee(e.target.value)}
              className="w-full px-2 py-1.5 bg-surface-tertiary border border-border rounded-md text-content-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent-violet/50 transition-colors"
            >
              {ASSIGNEES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-1 rounded-md text-xs font-medium text-content-secondary bg-surface-tertiary hover:bg-surface-tertiary/80 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded-md text-xs font-medium text-white bg-accent-violet hover:bg-accent-violet/80 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
