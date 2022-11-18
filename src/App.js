import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import stations from "./stations";
import CustomScroller from "react-custom-scroller";

// fake data generator
// count is passed as argument, offset as optional arg
const getItems = (count, offset = 0) =>
  // builds shallow array of length equal to count
  // Array.from(arrayLike, (element, index) => { /* … */ })
  //
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: stations[k + offset],
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});
const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

function App() {
  const [droppableState, setDroppableState] = useState([
    getItems(2),
    getItems(10, 2),
  ]);

  // const [isDropDisabled, setIsDropDisabled] = useState(false);

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    // if (droppableState[dInd].length > 3) {
    //   setIsDropDisabled(true);
    // }

    // don't allow more than 5 in the left column
    // if (sInd === 1 && dInd === 0) {
    //   if (droppableState[dInd].length > 4) {
    //     return;
    //   }
    // }

    // if (droppableState[dInd].length > 3) {
    //   setIsDropDisabled(true);
    // } else {
    // }

    if (sInd === dInd) {
      const items = reorder(
        droppableState[sInd],
        source.index,
        destination.index
      );
      const newState = [...droppableState];
      newState[sInd] = items;
      setDroppableState(newState);
    } else {
      const result = move(
        droppableState[sInd],
        droppableState[dInd],
        source,
        destination
      );
      const newState = [...droppableState];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setDroppableState(newState.filter((group) => group.length));

      // // disable when 4+ elements in left side
      // if (droppableState[dInd].length > 3) {
      //   setIsDropDisabled(true);
      // } else {
      //   setIsDropDisabled(false);
      // }
    }
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable key={0} droppableId={`${0}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {droppableState[0].map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          {item.content.call_sign}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div style={{ height: 100, width: 100 }}></div>
          <CustomScroller
            className="scroller"
            style={{ height: 400, scrollbarWidth: "none" }}
          >
            <Droppable key={1} droppableId={`${1}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {droppableState[1].map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            {item.content.call_sign}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </CustomScroller>

          {/* {droppableState.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {el.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                            }}
                          >
                            {item.content.call_sign}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))} */}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
