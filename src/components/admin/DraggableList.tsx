import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface DraggableListProps<T> {
  items: T[];
  droppableId: string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export default function DraggableList<T>({ items, droppableId, onReorder, renderItem }: DraggableListProps<T>) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...items];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onReorder(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => (
              <Draggable key={`${droppableId}-${index}`} draggableId={`${droppableId}-${index}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`${snapshot.isDragging ? 'opacity-70 shadow-lg' : ''}`}
                  >
                    <div className="flex items-start gap-1">
                      <div
                        {...provided.dragHandleProps}
                        className="mt-2.5 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0 px-1"
                        title="드래그하여 순서 변경"
                      >
                        ⠿
                      </div>
                      <div className="flex-1">{renderItem(item, index)}</div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
