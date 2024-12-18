import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Timer } from '../types/timer';


type TimerAction =
  | { type: 'ADD_TIMER'; payload: Omit<Timer, 'id'> }
  | { type: 'EDIT_TIMER'; payload: { id: string; updates: Partial<Timer> } }
  | { type: 'DELETE_TIMER'; payload: string }
  | { type: 'START_TIMER'; payload: string }
  | { type: 'PAUSE_TIMER'; payload: string }
  | { type: 'UPDATE_REMAINING_TIME'; payload: { id: string; remainingTime: number } }
  | { type: 'LOAD_TIMERS'; payload: Timer[] };

interface TimerContextType {
  timers: Timer[];
  addTimer: (timer: Omit<Timer, 'id'>) => void;
  editTimer: (id: string, updates: Partial<Timer>) => void;
  deleteTimer: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  updateRemainingTime: (id: string, remainingTime: number) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);


function timerReducer(state: Timer[], action: TimerAction): Timer[] {
  switch (action.type) {
    case 'ADD_TIMER':
      return [...state, { ...action.payload, id: crypto.randomUUID() }];

    case 'EDIT_TIMER':
      return state.map((timer) =>
        timer.id === action.payload.id
          ? { ...timer, ...action.payload.updates }
          : timer
      );

    case 'DELETE_TIMER':
      return state.filter((timer) => timer.id !== action.payload);

    case 'START_TIMER':
      return state.map((timer) =>
        timer.id === action.payload
          ? { ...timer, isRunning: true }
          : timer
      );

    case 'PAUSE_TIMER':
      return state.map((timer) =>
        timer.id === action.payload
          ? { ...timer, isRunning: false }
          : timer
      );

    case 'UPDATE_REMAINING_TIME':
      return state.map((timer) =>
        timer.id === action.payload.id
          ? { ...timer, remainingTime: action.payload.remainingTime }
          : timer
      );

    case 'LOAD_TIMERS':
      return action.payload;

    default:
      return state;
  }
}

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timers, dispatch] = useReducer(timerReducer, []);

  console.log('TimerProvider rendered');
  console.log('Current timers in context:', timers);

  useEffect(() => {
    const savedTimers = localStorage.getItem('timers');
    if (savedTimers) {
      dispatch({ type: 'LOAD_TIMERS', payload: JSON.parse(savedTimers) });
    }
  }, []);

 
  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  const addTimer = (timer: Omit<Timer, 'id'>) => {
    dispatch({ type: 'ADD_TIMER', payload: timer });
  };

  const editTimer = (id: string, updates: Partial<Timer>) => {
    dispatch({ type: 'EDIT_TIMER', payload: { id, updates } });
  };

  const deleteTimer = (id: string) => {
    dispatch({ type: 'DELETE_TIMER', payload: id });
  };

  const startTimer = (id: string) => {
    dispatch({ type: 'START_TIMER', payload: id });
  };

  const pauseTimer = (id: string) => {
    dispatch({ type: 'PAUSE_TIMER', payload: id });
  };

  const updateRemainingTime = (id: string, remainingTime: number) => {
    dispatch({
      type: 'UPDATE_REMAINING_TIME',
      payload: { id, remainingTime },
    });
  };

  return (
    <TimerContext.Provider
      value={{
        timers,
        addTimer,
        editTimer,
        deleteTimer,
        startTimer,
        pauseTimer,
        updateRemainingTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}


export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
} 