import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import useUIStore from '../../stores/useUIStore';
import useTaskStore from '../../stores/useTaskStore';
import { isDateOnly } from '../../utils/dateHelpers';
import { ASSIGNEE_COLORS } from '../../utils/constants';

export default function CalendarView({ tasks, subtasks, projects, onDateSelect }) {
  const { openTaskPanel } = useUIStore();
  const { patchTask } = useTaskStore();

  const getProjectColor = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.color || '#8B5CF6';
  };

  const isAllDay = (dateStr) => {
    return !dateStr || isDateOnly(dateStr);
  };

  // Combine tasks and subtasks into calendar events
  const events = [
    ...tasks.map((task) => {
      const allDay = isAllDay(task.startDate || task.dueDate) && isAllDay(task.dueDate || task.startDate);

      // For all-day events, FullCalendar end is exclusive — add 1 day
      let endDate = task.dueDate || task.startDate;
      if (allDay && endDate && isDateOnly(endDate)) {
        const d = new Date(endDate + 'T00:00:00');
        d.setDate(d.getDate() + 1);
        endDate = d.toISOString().slice(0, 10);
      }

      return {
        id: task.id,
        title: task.title,
        start: task.startDate || task.dueDate,
        end: endDate,
        allDay,
        backgroundColor: getProjectColor(task.projectId),
        borderColor: 'transparent',
        textColor: '#ffffff',
        extendedProps: { type: 'task', task, assignee: task.assignee },
      };
    }),
    ...subtasks
      .filter((s) => s.dueDate || s.startDate)
      .map((sub) => {
        const allDay = isAllDay(sub.startDate || sub.dueDate) && isAllDay(sub.dueDate || sub.startDate);

        let endDate = sub.dueDate || sub.startDate;
        if (allDay && endDate && isDateOnly(endDate)) {
          const d = new Date(endDate + 'T00:00:00');
          d.setDate(d.getDate() + 1);
          endDate = d.toISOString().slice(0, 10);
        }

        return {
          id: sub.id,
          title: `  ${sub.title}`,
          start: sub.startDate || sub.dueDate,
          end: endDate,
          allDay,
          backgroundColor: getProjectColor(
            tasks.find((t) => t.id === sub.taskId)?.projectId
          ),
          borderColor: 'transparent',
          textColor: '#ffffff',
          display: 'block',
          classNames: ['opacity-70', 'text-xs'],
          extendedProps: { type: 'subtask', subtask: sub, assignee: sub.assignee },
        };
      }),
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
      if (info.event.allDay) {
        // Dropped into all-day area — store as date-only
        const startStr = info.event.start?.toISOString().slice(0, 10);
        const endDate = info.event.end;
        let endStr = startStr;
        if (endDate) {
          const d = new Date(endDate);
          d.setDate(d.getDate() - 1);
          endStr = d.toISOString().slice(0, 10);
        }
        patchTask(task.id, { startDate: startStr, dueDate: endStr });
      } else {
        const newStart = info.event.start?.toISOString();
        const newEnd = info.event.end?.toISOString();
        patchTask(task.id, {
          startDate: newStart,
          dueDate: newEnd || newStart,
        });
      }
    }
  };

  const handleDateSelect = (info) => {
    if (onDateSelect) {
      if (info.allDay) {
        onDateSelect(info.start.toISOString().slice(0, 10));
      } else {
        onDateSelect(info.start.toISOString());
      }
    }
  };

  // Custom event renderer with assignee badge
  const renderEventContent = (eventInfo) => {
    const { assignee } = eventInfo.event.extendedProps;
    const initial = assignee ? assignee.charAt(0).toUpperCase() : null;

    return (
      <div className="fc-custom-event">
        {eventInfo.timeText && (
          <span className="fc-event-time-text">{eventInfo.timeText}</span>
        )}
        <span className="fc-event-title-text">{eventInfo.event.title}</span>
        {initial && (
          <span className="fc-event-assignee" data-assignee={assignee}>
            {initial}
          </span>
        )}
      </div>
    );
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
        eventContent={renderEventContent}
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
