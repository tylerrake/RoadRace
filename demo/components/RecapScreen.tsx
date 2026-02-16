
import React from 'react';
import { RaceRecap } from '../types';

interface RecapScreenProps {
  recap: RaceRecap;
  onRestart: () => void;
}

const RecapScreen: React.FC<RecapScreenProps> = ({ recap, onRestart }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center p-8 space-y-8 overflow-y-auto">
      <div className="text-center space-y-2 mt-12">
        <h1 className="text-5xl font-black font-orbitron italic text-white tracking-tighter uppercase">Race Complete</h1>
        <div className="h-1 w-32 bg-cyan-500 mx-auto rounded-full shadow-[0_0_10px_#00ffff]" />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Story */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-6">
            <h2 className="text-3xl font-orbitron font-black text-cyan-400 italic tracking-tight uppercase leading-none">
              {recap.headline}
            </h2>
            
            <div className="space-y-4 text-gray-300 leading-relaxed font-medium text-lg">
              {recap.narrative.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Forum Reactions */}
          <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-3 border-b border-white/10 bg-white/5 font-orbitron text-[10px] tracking-[0.3em] text-gray-400 uppercase">Underground Forums // Live Reactions</div>
            <div className="p-6 space-y-4">
              {recap.forumComments.map((comment, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-cyan-500 font-bold whitespace-nowrap">@{comment.user}:</span>
                  <span className="text-gray-400 italic">"{comment.text}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Quotes & Stats */}
        <div className="space-y-6">
          <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-xl p-6">
            <h3 className="font-orbitron text-xs font-bold uppercase text-cyan-500 mb-4 tracking-widest">Post-Race Debrief</h3>
            <div className="space-y-4">
              {Object.entries(recap.rivalQuotes).map(([name, quote]) => (
                <div key={name} className="space-y-1">
                  <div className="text-[10px] uppercase font-black text-gray-500">{name}</div>
                  <div className="text-xs text-gray-300 italic border-l-2 border-white/10 pl-3 py-1">"{quote}"</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-magenta-900/10 border border-magenta-500/20 rounded-xl p-6 text-center">
            <h3 className="font-orbitron text-xs font-bold uppercase text-magenta-500 mb-2 tracking-widest">Reputation Evolution</h3>
            <p className="text-sm text-gray-400 mb-6">{recap.statsSummary}</p>
            <button 
              onClick={onRestart}
              className="w-full py-4 bg-transparent border-2 border-magenta-500 text-magenta-500 font-orbitron font-bold uppercase tracking-widest hover:bg-magenta-500 hover:text-black transition-all"
            >
              Ready for Next Hit
            </button>
          </div>
        </div>
      </div>

      <div className="text-gray-600 text-[10px] uppercase tracking-widest py-12">
        End of Data Log // Secure Connection Terminated
      </div>
    </div>
  );
};

export default RecapScreen;
