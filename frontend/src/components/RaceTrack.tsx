import React from 'react';

interface RaceTrackProps {
  streak: number;
  goal: number;
}

const RaceTrack: React.FC<RaceTrackProps> = ({ streak, goal }) => {
  const progress = Math.min((
streak / goal) * 100, 100);

  return (
    <div className="relative w-full h-16 bg-gray-200 rounded-full overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-start px-4">
        <div 
          className="w-8 h-8 bg-red-500 rounded-full transition-all duration-500 ease-in-out flex items-center justify-center text-white font-bold"
          style={{ transform: `translateX(${progress}%)` }}
        >
          🚗
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <div className="text-sm font-bold">Start</div>
        <div className="text-sm font-bold">Goal: {goal} days</div>
      </div>
      <div 
        className="absolute bottom-0 left-0 h-2 bg-green-500 transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default RaceTrack;

