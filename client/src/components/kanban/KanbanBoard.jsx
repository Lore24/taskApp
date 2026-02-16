import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import useTaskStore from '../../stores/useTaskStore';
import { KANBAN_COLUMNS } from '../../utils/constants';

export default function KanbanBoard({ projectId, projectColor, onAddTask }) {
  const { getTasksByStatus, reorderTasks, tasks } = useTaskStore();

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const projectTasks = tasks.filter((t) => t.projectId === projectId);

    if (destination.droppableId === source.droppableId) {
      // Reorder within same column
      const columnTasks = projectTasks
        .filter((t) => t.status === source.droppableId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const [moved] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, moved);

      const updates = columnTasks.map((t, i) => ({
        id: t.id,
        order: i,
        status: source.droppableId,
      }));
      reorderTasks(updates);
    } else {
      // Move to different column
      const sourceColumn = projectTasks
        .filter((t) => t.status === source.droppableId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const destColumn = projectTasks
        .filter((t) => t.status === destination.droppableId)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      const [moved] = sourceColumn.splice(source.index, 1);
      moved.status = destination.droppableId;
      destColumn.splice(destination.index, 0, moved);

      const updates = [
        ...sourceColumn.map((t, i) => ({ id: t.id, order: i, status: source.droppableId })),
        ...destColumn.map((t, i) => ({ id: t.id, order: i, status: destination.droppableId })),
      ];
      reorderTasks(updates);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-6 h-full overflow-x-auto pb-4 px-6">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            status={col.id}
            label={col.label}
            tasks={getTasksByStatus(projectId, col.id)}
            projectColor={projectColor}
            onAddTask={onAddTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
