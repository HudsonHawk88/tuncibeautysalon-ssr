import React, { useRef } from "react";
import PropTypes from "prop-types";

const Sortable = (props) => {
  const { items, innerParam, setItems } = props;

  const dragItem = useRef(0);
  const draggedOverItem = useRef(0);

  const handleSort = () => {
    const szolgSorrendekClone = [...items];
    const temp = szolgSorrendekClone[dragItem.current];
    szolgSorrendekClone[dragItem.current] = szolgSorrendekClone[draggedOverItem.current];
    szolgSorrendekClone[draggedOverItem.current] = temp;
    console.log(dragItem.current, draggedOverItem.current);

    console.log(setItems)
    dragItem.current = 0;
    draggedOverItem.current = 0;
    szolgSorrendekClone.forEach((s, idx) => s.sorrend = (idx + 1))
    setItems(szolgSorrendekClone);
  };


  return (
    <React.Fragment>
      {items &&
        Array.isArray(items) &&
        items.length > 0 &&
        items.map((item, idx) => {
          return (
            <div
              draggable
              key={`szolg_${item.id}`}
              // className="szolgSorrendekDiv"
              className="relative flex space-x-3 border rounded p-2 bg-gray-100"
              onDragStart={() => (dragItem.current = idx)}
              onDragEnter={() => (draggedOverItem.current = idx)}
              onDragEnd={handleSort}
              onDragOver={(e) => e.preventDefault()}
              style={{ cursor: 'pointer' }}
            >
              <div>{`${idx + 1}.) ${item[innerParam]}`}</div>
            </div>
          );
        })}
    </React.Fragment>
  );
};

Sortable.propTypes = {
  innerParam: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  setItems: PropTypes.func.isRequired
};

export default Sortable;
