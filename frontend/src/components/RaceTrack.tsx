import React from 'react';

interface RaceTrackProps {
  streak: number;
  goal: number;
  carImage: string; 
}

const RaceTrack: React.FC<RaceTrackProps> = ({ streak, goal, carImage }) => {
  const progress = (streak / goal) * 100;

  return (
    <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
      {/* Teal progress bar */}
      <div
        className="absolute top-0 h-full transition-all duration-500 ease-in-out"
        style={{
          width: `${progress}%`,
          backgroundColor: '#64FCD9', // Teal color for the progress bar
        }}
      />

      {/* Car image */}
      <img
        src={carImage}
        alt="Racecar"
        className="absolute top-0 h-8 w-8 rounded-full transition-all duration-500 ease-in-out"
        style={{
          left: `${progress}%`,
          transform: 'translateX(-50%)', // Centers the car image
        }}
      />

      {/* Text labels */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        {progress === 0}
        <div className="text-sm font-bold ml-auto">Goal: {goal} days</div>
      </div>
    </div>
  );
};

export default RaceTrack;
