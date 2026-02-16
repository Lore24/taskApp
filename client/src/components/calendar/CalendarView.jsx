import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import useUIStore from '../../stores/useUIStore';
import useTaskStore from '../../stores/useTaskStore';

export default function CalendarView({ tasks, subtasks, projects, onDateSelect }) {
  const { openTaskPanel } = useUIStore();
  const { patchTask } = useTaskStore();

  const getProjectColor = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.color || '#8B5CF6';
  };

  // Combine tasks and subtasks into calendar events
  const events = [
    ...tasks.map((task) => ({
      id: task.id,
      title: task.title,
      start: task.startDate || task.dueDate,
      end: task.dueDate || task.startDate,
      backgroundColor: getProjectColor(task.projectId),
      borderColor: 'transparent',
      textColor: '#ffffff',
      extendedProps: { type: 'task', task },
    })),
    ...subtasks
      .filter((s) => s.dueDate || s.startDate)
      .map((sub) => ({
        id: sub.id,
        title: `  ${sub.title}`,
        start: sub.startDate || sub.dueDate,
        end: sub.dueDate || sub.startDate,
        backgroundColor: getProjectColor(
          tasks.find((t) => t.id === sub.taskId)?.projectId
        ),
        borderColor: 'transparent',
        textColor: '#ffffff',
        display: 'block',
        classNames: ['opacity-70', 'text-xs'],
        extendedProps: { type: 'subtask', subtask: sub },
      })),
  ].filter((e) => e.start);

  const handleEventClick = (info) => {
    const { type, task, subtask } = info.event.extendedProps;
    if (type === 'task') {
      openTaskPanel(task.id);
    } else if (type === 'subtask') {
      openTaskPanel(subtask.taskId);
    }
  };

  const handleEventDrop = (info) => {
    const { type, task } = info.event.extendedProps;
    if (type === 'task') {
      const newStart = info.event.start?.toISOString();
      const newEnd = info.event.end?.toISOString();
      patchTask(task.id, {
        startDate: newStart,
        dueDate: newEnd || newStart,
      });
    }
  };

  const handleDateSelect = (info) => {
    if (onDateSelect) {
      onDateSelect(info.start.toISOString());
    }
  };

  return (
    <div className="p-6 calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        select={handleDateSelect}
        height="auto"
        eventDisplay="block"
        dayMaxEvents={4}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
        }}
      />
    </div>
  );
}
