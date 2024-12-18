import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { useTimer } from '../context/TimerContext';
import { validateTimerForm } from '../utils/validation';
import { Button } from './common/Button';
import { Timer } from '../types/timer';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timer?: Timer;
}

export const AddEditTimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  timer,
}) => {
  const isEditMode = !!timer;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [touched, setTouched] = useState({
    title: false,
    hours: false,
    minutes: false,
    seconds: false,
  });

  const { addTimer, editTimer } = useTimer();

  // Reset form when modal opens/closes or timer changes
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && timer) {
        setTitle(timer.title);
        setDescription(timer.description);
        setHours(Math.floor(timer.duration / 3600));
        setMinutes(Math.floor((timer.duration % 3600) / 60));
        setSeconds(timer.duration % 60);
      } else {
        setTitle('');
        setDescription('');
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
      setTouched({
        title: false,
        hours: false,
        minutes: false,
        seconds: false,
      });
    }
  }, [isOpen, timer, isEditMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTimerForm({ title, description, hours, minutes, seconds })) {
      return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    
    if (isEditMode && timer) {
      editTimer(timer.id, {
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
      });
    } else {
      addTimer({
        title: title.trim(),
        description: description.trim(),
        duration: totalSeconds,
        remainingTime: totalSeconds,
        isRunning: false,
        createdAt: Date.now()
      });
    }

    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const isTimeValid = hours > 0 || minutes > 0 || seconds > 0;
  const isTitleValid = title.trim().length > 0 && title.length <= 50;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">
              {isEditMode ? 'Edit Timer' : 'Add New Timer'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched({ ...touched, title: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter timer title"
              maxLength={50}
            />
            {touched.title && !isTitleValid && (
              <p className="mt-1 text-sm text-red-600">
                Title is required and must be less than 50 characters
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter timer description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                Hours
              </label>
              <input
                type="number"
                id="hours"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                onBlur={() => setTouched({ ...touched, hours: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="minutes" className="block text-sm font-medium text-gray-700">
                Minutes
              </label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                onBlur={() => setTouched({ ...touched, minutes: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="seconds" className="block text-sm font-medium text-gray-700">
                Seconds
              </label>
              <input
                type="number"
                id="seconds"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                onBlur={() => setTouched({ ...touched, seconds: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {touched.hours && touched.minutes && touched.seconds && !isTimeValid && (
            <p className="text-sm text-red-600">
              Please enter a duration greater than 0
            </p>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isTitleValid || !isTimeValid}
            >
              {isEditMode ? 'Save Changes' : 'Add Timer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
