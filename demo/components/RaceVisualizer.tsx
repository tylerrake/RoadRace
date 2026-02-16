
import React from 'react';

interface RaceVisualizerProps {
  positions: string[];
  speed: number;
}

const RaceVisualizer: React.FC<RaceVisualizerProps> = ({ positions, speed }) => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a0a0a]">
      {/* Dynamic Background Tracks */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #333 1px, transparent 1px)',
            backgroundSize: '100px 100px',
            transform: `translateY(${(Date.now() / 20) % 100}px)`
          }}
        />
      </div>

      {/* The Circuit Road */}
      <div className="absolute inset-0 flex justify-center">
        <div 
          className="w-80 h-[200%] bg-[#1a1a1a] border-x-8 border-gray-800 relative shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          style={{ transform: 'perspective(1000px) rotateX(45deg) translateY(-25%)' }}
        >
          {/* Kerbs */}
          <div className="absolute left-0 w-4 h-full bg-repeating-linear-gradient(to bottom, #fff, #fff 40px, #f00 40px, #f00 80px)" />
          <div className="absolute right-0 w-4 h-full bg-repeating-linear-gradient(to bottom, #fff, #fff 40px, #f00 40px, #f00 80px)" />
          
          {/* Center Line */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-white/20"
            style={{
              backgroundImage: 'linear-gradient(to bottom, #fff 50%, transparent 50%)',
              backgroundSize: '1px 120px',
              animation: `roadLine ${2000/speed}s linear infinite`
            }}
          />
        </div>
      </div>

      {/* Riders (Bikes) */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-32">
        <div className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none">
          {positions.map((id, index) => {
            const isPlayer = id === 'player';
            const offset = (index - 2) * 40; // Lateral spread
            const zIndex = 10 - index;
            const lean = index % 2 === 0 ? 5 : -5;

            return (
              <div 
                key={id}
                className="absolute transition-all duration-[1500ms] ease-in-out"
                style={{
                  transform: `translateY(${index * 50 - 100}px) translateX(${offset}px) scale(${1 - index * 0.1})`,
                  zIndex,
                  opacity: 1 - index * 0.15
                }}
              >
                {/* Rider Tag */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-black font-orbitron whitespace-nowrap tracking-widest flex flex-col items-center">
                  <span className={isPlayer ? 'text-magenta-500' : 'text-gray-500'}>{id.toUpperCase()}</span>
                  {isPlayer && <div className="w-1 h-1 bg-magenta-500 rounded-full mt-1 animate-ping" />}
                </div>

                {/* Motorcycle Body */}
                <div 
                  className={`relative w-8 h-20 rounded-full transition-transform duration-700 ${isPlayer ? 'bg-magenta-600 shadow-[0_0_20px_rgba(255,0,255,0.4)]' : 'bg-gray-700'}`}
                  style={{ transform: `rotate(${lean}deg)` }}
                >
                  {/* Seat/Rider Body */}
                  <div className="absolute top-4 left-1 w-6 h-10 bg-black rounded-full" />
                  
                  {/* Wheels */}
                  <div className="absolute -top-1 left-2 w-4 h-6 bg-black rounded-sm border-x border-gray-600" />
                  <div className="absolute -bottom-1 left-2 w-4 h-6 bg-black rounded-sm border-x border-gray-600" />
                  
                  {/* Exhaust Glow if speed high */}
                  {isPlayer && speed > 200 && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4 h-12 bg-gradient-to-t from-transparent via-cyan-500/20 to-cyan-400 rounded-full blur-sm animate-pulse" />
                  )}

                  {/* Knees */}
                  <div className={`absolute top-8 -left-2 w-3 h-5 rounded-full ${isPlayer ? 'bg-magenta-400' : 'bg-gray-600'} opacity-60`} style={{ transform: 'rotate(-20deg)' }} />
                  <div className={`absolute top-8 -right-2 w-3 h-5 rounded-full ${isPlayer ? 'bg-magenta-400' : 'bg-gray-600'} opacity-60`} style={{ transform: 'rotate(20deg)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes roadLine {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
      `}</style>
    </div>
  );
};

export default RaceVisualizer;
