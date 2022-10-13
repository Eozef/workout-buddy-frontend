import { createContext, useReducer } from "react";

export const WorkoutContext = createContext();

export const workoutsReducer = (state, action) => {
  switch (action.type) {
    case "SET_WORKOUTS":
      return {
        workouts: action.payload,
      };
    case "CREATE_WORKOUT":
      return {
        workouts: [action.payload, ...state.workouts],
      };
    case "DELETE_WORKOUT":
      return {
        workouts: state.workouts.filter(
          //filter through current worksouts before making changes
          //check if the id the one that meant to be deleted
          (workout) => workout._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};
// whatever components will need to access the Context it represents as the children prop is the root componet
export const WorkoutsContextProvider = ({ children }) => {
  // will update using once the data got passed in from dispatch()
  const [state, dispatch] = useReducer(workoutsReducer, {
    workout: null,
  });

  return (
    <WorkoutContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutContext.Provider>
  );
};
