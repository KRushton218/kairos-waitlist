import React from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = {
  ITEM: 'item',
};

const DraggableItem = ({ item, index, moveItem }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.ITEM,
    hover(draggedItem) {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.ITEM,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`p-4 mb-2 rounded text-text ${
        isDragging ? 'shadow-md' : ''
      }`}
      style={{
        backgroundColor: '#1C1F33',
        border: '1px solid #B4D4FF',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {item}
    </li>
  );
};

const RankedChoice = ({ items, setItems }) => {
  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ul className="list-none p-0">
        {items.map((item, index) => (
          <DraggableItem
            key={item}
            item={item}
            index={index}
            moveItem={moveItem}
          />
        ))}
      </ul>
    </DndProvider>
  );
};

export default RankedChoice;