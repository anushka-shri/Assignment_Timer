import React, { useEffect, useRef } from 'react';
import { useTimer } from '../context/TimerContext';
import { formatTime } from '../utils/time'

export const TimerItem: React.FC<{ id: string }> = ({ id }) => {
  const { 
    timers, 
    startTimer, 
    pauseTimer, 
    deleteTimer, 
    updateRemainingTime 
  } = useTimer();
  
  const timer = timers.find(t => t.id === id);
  const intervalRef = useRef<number>();
  const handleStart = () => {
    if (!timer) return;
    startTimer(timer.id);
  };

  const handlePause = () => {
    if (!timer) return;
    pauseTimer(timer.id);
  };

  useEffect(() => {
    if (!timer) return;

    if (timer.isRunning) {
      intervalRef.current = window.setInterval(() => {
        if (timer.remainingTime <= 0) {
          clearInterval(intervalRef.current);
          pauseTimer(timer.id);
          return;
        }
        
        updateRemainingTime(timer.id, timer.remainingTime - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer?.isRunning, timer?.id, timer?.remainingTime]);

  if (!timer) return null;

  const handleDelete = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    deleteTimer(timer.id);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{timer.title}</h3>
          {timer.description && (
            <p className="text-sm text-gray-600 mt-1">{timer.description}</p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="mt-4">
        <div className="text-3xl font-mono text-center">
          {formatTime(timer.remainingTime)}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={timer.isRunning ? handlePause : handleStart}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            timer.isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {timer.isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            if (timer.remainingTime !== timer.duration) {
              updateRemainingTime(timer.id, timer.duration);
              pauseTimer(timer.id);
            }
          }}
          className={`px-4 py-2 rounded-md font-medium transition-colors 
            ${timer.remainingTime === timer.duration
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          disabled={timer.remainingTime === timer.duration}
        >
          Reset
        </button>
      </div>
    </div>
  );
};