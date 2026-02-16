
import React from 'react';
import { Rival } from '../types';

interface RivalPanelProps {
  rival: Rival;
  isTarget: boolean;
}

const RivalPanel: React.FC<RivalPanelProps> = ({ rival, isTarget }) => {
  const getEmotionEmoji = (state: string) => {
    switch (state.toLowerCase()) {
      case 'furious': return '😠';
      case 'calculating': return '🧠';
      case 'fearful': return '😨';
      case 'confident': return '😎';
      case 'focused': return '🎯';
      case 'vengeful': return '👿';
      default: return '😐';
    }
  };

  return (
    <div className={`p-3 rounded-md transition-all duration-500 border-l-4 ${isTarget ? 'bg-cyan-900/20 border-cyan-500' : 'bg-white/5 border-gray-700'}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-orbitron text-sm font-bold tracking-wider">{rival.name}</h4>
          <span className="text-[10px] text-gray-500 uppercase">{rival.archetype}</span>
        </div>
        <div className="text-xl">{getEmotionEmoji(rival.emotionalState)}</div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[9px] uppercase font-bold text-gray-500">
          <span>Emotional State</span>
          <span className="text-cyan-400">{rival.emotionalState}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {rival.memory.slice(-2).map((mem, i) => (
            <div key={i} className="text-[8px] bg-black/40 px-2 py-0.5 rounded text-gray-400 border border-white/5 truncate max-w-full">
              • {mem}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RivalPanel;
