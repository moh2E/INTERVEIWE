import React from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  color?: 'emerald' | 'indigo' | 'amber';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isActive,
  color = 'emerald',
}) => {
  const barHeights = [40, 75, 55, 95, 60, 85, 45, 90, 70, 50, 80, 60];

  const colorClasses = {
    emerald: 'bg-emerald-400 shadow-emerald-500/50',
    indigo: 'bg-indigo-400 shadow-indigo-500/50',
    amber: 'bg-amber-400 shadow-amber-500/50',
  }[color];

  return (
    <div className="flex items-center justify-center gap-1 h-8 px-2 py-1">
      {barHeights.map((height, i) => (
        <span
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${colorClasses} ${
            isActive
              ? 'animate-pulse'
              : 'opacity-30'
          }`}
          style={{
            height: isActive ? `${Math.max(15, (height * (0.6 + Math.sin(i * 1.5) * 0.4)))}%` : '20%',
            animationDelay: `${i * 80}ms`,
            animationDuration: '600ms',
          }}
        />
      ))}
    </div>
  );
};
