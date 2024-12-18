import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTimer } from '../context/TimerContext';
import { TimerItem } from './TimerItem';
import { AddEditTimerModal } from './AddEditTimerModal';
import { Button } from './common/Button';

export const TimerList: React.FC = () => {
  const { timers } = useTimer();
  console.log('TimerList rendered, timers:', timers); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  console.log('TimerList rendered');
  console.log('Current timers:', timers);
  console.log('Modal state:', isAddModalOpen);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Timers</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Timer
        </Button>
      </div>

      {timers.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No timers added yet. Add your first timer!
        </div>
      ) : (
        <div className="space-y-4">
          {timers.map((timer) => (
            <TimerItem key={timer.id} id={timer.id} />
          ))}
        </div>
      )}

      <AddEditTimerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};