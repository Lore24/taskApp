import {
  format, formatDistanceToNow, isPast, isToday, isTomorrow, parseISO,
  startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval,
} from 'date-fns';

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'MMM d, yyyy');
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'MMM d, yyyy h:mm a');
}

export function formatTime(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'h:mm a');
}

export function formatRelative(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isDueOverdue(dateStr) {
  if (!dateStr) return false;
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return isPast(date) && !isToday(date);
}

export function toInputDatetime(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

export function fromInputDatetime(inputValue) {
  if (!inputValue) return null;
  return new Date(inputValue).toISOString();
}

export function isThisWeek(dateStr) {
  if (!dateStr) return false;
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  const now = new Date();
  return isWithinInterval(date, {
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  });
}

export function isThisMonth(dateStr) {
  if (!dateStr) return false;
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  const now = new Date();
  return isWithinInterval(date, {
    start: startOfMonth(now),
    end: endOfMonth(now),
  });
}

export function matchesDateFilter(task, filter) {
  if (!filter || filter === 'all') return true;
  const start = task.startDate;
  const due = task.dueDate;
  const checkDate = (dateStr) => {
    if (!dateStr) return false;
    const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
    switch (filter) {
      case 'today': return isToday(d);
      case 'week': return isThisWeek(dateStr);
      case 'month': return isThisMonth(dateStr);
      default: return true;
    }
  };
  return checkDate(start) || checkDate(due);
}
