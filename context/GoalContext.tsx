// context/GoalContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Goal } from "../types/models";
import { auth, db } from "../config/firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

type GoalState = {
  goals: Goal[];
  loading: boolean;
  error: string | null;
};

type GoalAction =
  | { type: "SET_GOALS"; payload: Goal[] }
  | { type: "ADD_GOAL"; payload: Goal }
  | { type: "UPDATE_GOAL"; payload: Goal }
  | { type: "DELETE_GOAL"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: GoalState = {
  goals: [],
  loading: false,
  error: null,
};

const GoalContext = createContext<{
  state: GoalState;
  dispatch: React.Dispatch<GoalAction>;
}>({ state: initialState, dispatch: () => null });

export const useGoalContext = () => useContext(GoalContext);

function goalReducer(state: GoalState, action: GoalAction): GoalState {
  switch (action.type) {
    case "SET_GOALS":
      return { ...state, goals: action.payload };
    case "ADD_GOAL":
      return { ...state, goals: [...state.goals, action.payload] };
    case "UPDATE_GOAL":
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload.id ? action.payload : goal
        ),
      };
    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload),
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function GoalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(goalReducer, initialState);

  useEffect(() => {
    let unsubscribeGoals: (() => void) | undefined;

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      // If there's an existing goals subscription, unsubscribe before re-subscribing
      if (unsubscribeGoals) {
        unsubscribeGoals();
        unsubscribeGoals = undefined;
      }

      // If user is not logged in, clear goals and return
      if (!user) {
        dispatch({ type: "SET_GOALS", payload: [] });
        return;
      }

      // Otherwise, subscribe to this user's goals
      dispatch({ type: "SET_LOADING", payload: true });
      const goalsRef = collection(db, `users/${user.uid}/goals`);
      const q = query(goalsRef, orderBy("created", "desc"));

      unsubscribeGoals = onSnapshot(
        q,
        (snapshot) => {
          const goals: Goal[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Goal[];
          dispatch({ type: "SET_GOALS", payload: goals });
          dispatch({ type: "SET_LOADING", payload: false });
        },
        (error) => {
          console.error("Error fetching goals:", error);
          dispatch({ type: "SET_ERROR", payload: "Failed to load goals" });
          dispatch({ type: "SET_LOADING", payload: false });
        }
      );
    });

    // Clean up both the auth listener and any Firestore listener on unmount
    return () => {
      if (unsubscribeGoals) unsubscribeGoals();
      unsubscribeAuth();
    };
  }, []);

  return (
    <GoalContext.Provider value={{ state, dispatch }}>
      {children}
    </GoalContext.Provider>
  );
}
