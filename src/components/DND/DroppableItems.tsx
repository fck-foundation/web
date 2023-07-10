import React from "react";
import { Droppable } from "react-beautiful-dnd";
import cn from "classnames";

import { DraggableItem } from "./DraggableItem";

interface Props {
  column: any; //ObjectList
  id: number;
  data: { address: string; children: React.ReactNode };
}

export const DroppableItems: React.FC<Props> = ({ column, id, data }) => {
  return (
    <div key={id} className="w-full">
      <Droppable key={id} droppableId={id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn("h-full", {
              "bg-white dark:bg-gray-900": snapshot.isDraggingOver,
            })}
          >
            <DraggableItem key={id} id={id} item={column} data={data} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
