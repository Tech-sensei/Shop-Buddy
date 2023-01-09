// import React, { useState, useEffect } from "react";
// import List from "./List";
// import Alert from "./Alert";

// const getLocalStorage = () => {
//   let list = localStorage.getItem("list");
//   if (list) {
//     return (list = JSON.parse(localStorage.getItem("list")));
//   } else {
//     return [];
//   }
// };

// function App() {
//   const [enteredItem, setEnteredItem] = useState("");
//   const [list, setList] = useState(getLocalStorage());
//   const [isEditing, setIsEditing] = useState(false);
//   const [editID, setEditID] = useState(null);
//   const [alert, setAlert] = useState({
//     show: false,
//     type: "",
//     message: "",
//   });

//   useEffect(() => {
//     localStorage.setItem("list", JSON.stringify(list));
//   }, [list]);

//   // Helper Function
//   const showAlert = (show = false, type = "", message = "") => {
//     setAlert({ show: show, type: type, message: message });
//     // Or this
//     // setAlert({ show, type, message });
//   };

//   const editItem = (id) => {
//     const specificItem = list.find((item) => item.id === id);
//     setIsEditing(true);
//     setEditID(id);
//     setEnteredItem(specificItem.title);
//   };

//   const removeItem = (id) => {
//     showAlert(true, "danger", "Item removed");
//     const newList = list.filter((list) => list.id !== id);
//     setList(newList);
//   };

//   const clearItem = () => {
//     showAlert(true, "danger", "Items cleared");
//     setList([]);
//   };

//   const submitHandler = (event) => {
//     event.preventDefault();
//     if (enteredItem === "") {
//       showAlert(true, "danger", "Please enter item");
//     } else if (enteredItem && isEditing) {
//       setList(
//         list.map((item) => {
//           if (item.id === editID) {
//             return { ...item, title: enteredItem };
//           }
//           return item;
//         })
//       );
//       setEnteredItem("");
//       setEditID(null);
//       setIsEditing(false);
//       showAlert(true, "success", "item changed");
//     } else {
//       showAlert(true, "success", "Item added");
//       const newItem = {
//         id: new Date().getTime().toString(),
//         title: enteredItem,
//       };
//       setList([newItem, ...list]);
//       setEnteredItem("");
//     }
//   };

//   return (
//     <section className="section-center">
//       <form className="grocery-form" onSubmit={submitHandler}>
//         {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
//         <h3>Shop Buddy</h3>
//         <h5>shop without forgetting😉😉😉</h5>
//         <div className="form-control">
//           <input
//             type="text"
//             className="grocery"
//             placeholder="e.g Eggs"
//             value={enteredItem}
//             onChange={(e) => setEnteredItem(e.target.value)}
//           />
//           <button type="submit" className="submit-btn">
//             {isEditing ? "edit" : "Add"}
//           </button>
//         </div>
//       </form>
//       {list.length > 0 && (
//         <div className="grocery-container">
//           <List listItems={list} removeItem={removeItem} editItem={editItem} />
//           <button type="button" className="clear-btn" onClick={clearItem}>
//             clear items
//           </button>
//         </div>
//       )}
//     </section>
//   );
// }

// export default App;

import React, { useEffect, useReducer } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};

function reducer(state, action) {
  if (action.type === "changeEnteredItem") {
    return { ...state, enteredItem: action.payload };
  } else if (action.type === "changeList") {
    return { ...state, list: action.payload };
  } else if (action.type === "changeIsEditing") {
    return { ...state, isEditing: action.payload };
  } else if (action.type === "changeEditID") {
    return { ...state, editID: action.payload };
  } else if (action.type === "changeAlert") {
    return { ...state, alert: action.payload };
  } else {
    throw new Error();
  }
}

const initialState = {
  enteredItem: "",
  list: getLocalStorage(),
  isEditing: false,
  editID: null,
  alert: {
    show: false,
    type: "",
    message: "",
  },
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { enteredItem, list, isEditing, editID, alert } = state;

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  // Helper Function
  const showAlert = (show = false, type = "", message = "") => {
    dispatch({
      type: "changeAlert",
      payload: { show: show, type: type, message: message },
    });
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    dispatch({ type: "changeIsEditing", payload: true });
    dispatch({ type: "changeEditID", payload: id });
    dispatch({ type: "changeEnteredItem", payload: specificItem.title });
  };

  const removeItem = (id) => {
    showAlert(true, "danger", "Item removed");
    const newList = list.filter((list) => list.id !== id);
    dispatch({ type: "changeList", payload: newList });
  };

  const clearItem = () => {
    showAlert(true, "danger", "Items cleared");
    dispatch({ type: "changeList", payload: [] });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (enteredItem === "") {
      showAlert(true, "danger", "Please enter item");
    } else if (enteredItem && isEditing) {
      dispatch({
        type: "changeList",
        payload: list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: enteredItem };
          }
          return item;
        }),
      });
      dispatch({ type: "changeEnteredItem", payload: "" });
      dispatch({ type: "changeEditID", payload: null });
      dispatch({ type: "changeIsEditing", payload: false });
      showAlert(true, "success", "item changed");
    } else {
      showAlert(true, "success", "Item added");
      const newItem = {
        id: new Date().getTime().toString(),
        title: enteredItem,
      };
      dispatch({ type: "changeEnteredItem", payload: "" });
      dispatch({ type: "changeList", payload: [newItem, ...list] });
    }
  };

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={submitHandler}>
        {state.alert.show && (
          <Alert {...alert} removeAlert={showAlert} list={list} />
        )}
        <h3>Shop Buddy</h3>
        <h5>shop without forgetting😉😉😉</h5>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="e.g Eggs"
            value={state.enteredItem}
            onChange={(e) =>
              dispatch({ type: "changeEnteredItem", payload: e.target.value })
            }
          />
          <button type="submit" className="submit-btn">
            {state.isEditing ? "edit" : "Add"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List listItems={list} removeItem={removeItem} editItem={editItem} />
          <button type="button" className="clear-btn" onClick={clearItem}>
            clear items
          </button>
        </div>
      )}
    </section>
  );
}
export default App;
