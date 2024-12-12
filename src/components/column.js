import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const Column = ({ columnId, title, tasks, children }) => {
  return (
    <div className="column">
      <h2>{title}</h2>
      <Droppable droppableId={columnId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="task-list"
          >
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;
