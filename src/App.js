import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import stations from "./stations";

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
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

  console.log(result);
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
  const [state, setState] = useState([getItems(10), getItems(5, 10)]);

  function onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter((group) => group.length));
    }
  }

  return (
    <div>
      <div style={{ display: "flex" }}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state.map((el, ind) => (
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
                            {item.content}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;

//   const [allStations, setAllStations] = useState(stations);

//   function handleOnDragEnd(result) {
//     console.log(result);
//     if (!result.destination) return;
//     const items = Array.from(allStations);
//     const [reorderedItem] = items.splice(result.source.index, 1);
//     items.splice(result.destination.index, 0, reorderedItem);
//     setAllStations(items);
//   }

//   return (
//     <div className="App">
//       <div className="cols">
//         <DragDropContext onDragEnd={handleOnDragEnd}>
//           <Droppable droppableId="stationcards1">
//             {(provided) => (
//               <ul
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//                 className="Container1"
//               >
//                 {allStations.map(({ id, call_sign }, index) => {
//                   return (
//                     <Draggable
//                       key={id.toString()}
//                       draggableId={id.toString()}
//                       index={index}
//                     >
//                       {(provided) => (
//                         <li
//                           className="Card"
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                         >
//                           {call_sign}
//                         </li>
//                       )}
//                     </Draggable>
//                   );
//                 })}
//                 {provided.placeholder}
//               </ul>
//             )}
//           </Droppable>
//           <Droppable droppableId="stationcards2">
//             {(provided) => (
//               <ul
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//                 className="Container2"
//               >
//                 {allStations.map(({ id, call_sign }, index) => {
//                   return (
//                     <Draggable
//                       key={(id + 5).toString()}
//                       draggableId={(id + 5).toString()}
//                       index={index}
//                     >
//                       {(provided) => (
//                         <li
//                           className="Card"
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                         >
//                           {call_sign}
//                         </li>
//                       )}
//                     </Draggable>
//                   );
//                 })}
//                 {provided.placeholder}
//               </ul>
//             )}
//           </Droppable>
//         </DragDropContext>
//       </div>
//     </div>
//   );
// }

// export default App;

// class MultipleDragList extends Component {
//   state = {
//       items: getItems(10),
//       selected: getItems(5, 10)
//   };

//   // Defining unique ID for multiple lists
//   id2List = {
//       droppable: 'items',
//       droppable2: 'selected'
//   };

//   getList = id => this.state[this.id2List[id]];

//   onDragEnd = result => {
//       const { source, destination } = result;

//       if (!destination) {
//           return;
//       }

//       // Sorting in same list
//       if (source.droppableId === destination.droppableId) {
//           const items = reorder(
//               this.getList(source.droppableId),
//               source.index,
//               destination.index
//           );

//           let state = { items };

//           if (source.droppableId === 'droppable2') {
//               state = { selected: items };
//           }

//           this.setState(state);
//       }
//       // Interlist movement
//       else {
//           const result = move(
//               this.getList(source.droppableId),
//               this.getList(destination.droppableId),
//               source,
//               destination
//           );

//           this.setState({
//               items: result.droppable,
//               selected: result.droppable2
//           });
//       }
//   };
