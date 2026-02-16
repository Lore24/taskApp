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

export function toInputDate(dateStr) {
  if (!dateStr) return '';
  if (isDateOnly(dateStr)) return dateStr;
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'yyyy-MM-dd');
}

export function fromInputDatetime(inputValue) {
  if (!inputValue) return null;
  return new Date(inputValue).toISOString();
}

export function fromInputDate(inputValue) {
  if (!inputValue) return null;
  return inputValue; // Store as 'YYYY-MM-DD' string — no time component
}

export function isDateOnly(dateStr) {
  if (!dateStr) return false;
  // Date-only values are stored as 'YYYY-MM-DD' (10 chars, no 'T')
  return typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
}

export function hasTime(dateStr) {
  if (!dateStr) return false;
  return !isDateOnly(dateStr);
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
