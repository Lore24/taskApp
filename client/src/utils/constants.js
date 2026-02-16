export const STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
};

export const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
  archived: 'Archived',
};

export const STATUS_COLORS = {
  todo: { bg: 'bg-slate-500/20', text: 'text-slate-300', dot: 'bg-slate-400' },
  in_progress: { bg: 'bg-accent-violet/20', text: 'text-accent-violet', dot: 'bg-accent-violet' },
  done: { bg: 'bg-accent-emerald/20', text: 'text-accent-emerald', dot: 'bg-accent-emerald' },
  archived: { bg: 'bg-slate-500/10', text: 'text-slate-500', dot: 'bg-slate-500' },
};

export const ASSIGNEES = ['Lauren', 'Claude'];

export const ASSIGNEE_COLORS = {
  Lauren: { bg: 'bg-accent-pink/20', text: 'text-accent-pink' },
  Claude: { bg: 'bg-accent-violet/20', text: 'text-accent-violet' },
};

export const PROJECT_COLORS = [
  { name: 'Violet', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Emerald', value: '#10B981' },
  { name: 'Rose', value: '#F43F5E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Orange', value: '#F97316' },
];

export const KANBAN_COLUMNS = [
  { id: STATUSES.TODO, label: STATUS_LABELS.todo },
  { id: STATUSES.IN_PROGRESS, label: STATUS_LABELS.in_progress },
  { id: STATUSES.DONE, label: STATUS_LABELS.done },
];
