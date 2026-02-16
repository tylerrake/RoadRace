
import React from 'react';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8 bg-black p-8 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-magenta-600/10 rounded-full blur-[120px]" />

      <div className="text-center space-y-2 z-10">
        <h1 className="text-7xl md:text-9xl font-black font-orbitron italic tracking-tighter text-white">
          NEURAL <span className="text-magenta-500">MOTO</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-orbitron tracking-[0.5em] text-gray-500 uppercase">
          Apex Rivals // Laguna Seca
        </h2>
      </div>

      <div className="max-w-xl text-center space-y-6 text-gray-400 font-medium z-10">
        <p className="text-lg leading-relaxed">
          The ultimate simulation of motorcycle racing psychology. 
          Master the lean, conquer the apex, and outsmart rivals that learn from your every move.
        </p>
        <div className="grid grid-cols-2 gap-3 text-[10px] font-bold uppercase tracking-widest">
          <div className="p-4 border border-white/5 bg-white/5 rounded-lg flex flex-col items-center gap-2">
            <span className="text-magenta-500">Physics Engine</span>
            <span className="text-white/40">Real-time Lean Calc</span>
          </div>
          <div className="p-4 border border-white/5 bg-white/5 rounded-lg flex flex-col items-center gap-2">
            <span className="text-magenta-500">Neural Network</span>
            <span className="text-white/40">Rider Ego Sim</span>
          </div>
        </div>
      </div>

      <button 
        onClick={onStart}
        className="group relative px-16 py-5 bg-white text-black font-orbitron font-black text-xl uppercase tracking-widest overflow-hidden hover:bg-magenta-500 transition-colors duration-300 z-10"
      >
        Drop the Clutch
      </button>

      <div className="absolute bottom-12 text-gray-700 text-[9px] tracking-[0.4em] uppercase font-bold">
        Session: Open // Hardware: Optimized // AI: Gemini 3 Pro Engine
      </div>
    </div>
  );
};

export default IntroScreen;
