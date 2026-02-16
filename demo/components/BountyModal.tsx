
import React, { useState } from 'react';
import { Player, Rival } from '../types';

interface BountyModalProps {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  rivals: Rival[];
  onClose: () => void;
  onPlace: (target: string, amount: number, visibility: 'public' | 'secret', condition: 'crash' | 'block' | 'finishBelow') => void;
}

const BountyModal: React.FC<BountyModalProps> = ({ player, setPlayer, rivals, onClose, onPlace }) => {
  const [target, setTarget] = useState(rivals[0].id);
  const [amount, setAmount] = useState(1000);
  const [visibility, setVisibility] = useState<'public' | 'secret'>('public');
  const [condition, setCondition] = useState<'crash' | 'block' | 'finishBelow'>('crash');

  const handleSubmit = () => {
    if (amount > player.money) return;
    setPlayer(prev => ({ ...prev, money: prev.money - amount, heatLevel: Math.min(100, prev.heatLevel + 8) }));
    onPlace(target, amount, visibility, condition);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#121212] border border-cyan-500/50 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.1)]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="font-orbitron text-xl font-black italic neon-cyan">PLACE BOUNTY</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Select Target</label>
            <div className="grid grid-cols-2 gap-2">
              {rivals.map(rival => (
                <button
                  key={rival.id}
                  onClick={() => setTarget(rival.id)}
                  className={`p-3 rounded border transition-all text-sm font-bold ${target === rival.id ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400' : 'border-white/10 bg-white/5 text-gray-400'}`}
                >
                  {rival.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Amount ($)</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Math.min(player.money, Math.max(500, parseInt(e.target.value) || 0)))}
              className="w-full bg-black border border-white/10 rounded p-3 text-cyan-400 font-bold focus:border-cyan-500 outline-none"
            />
            <div className="text-[10px] text-gray-600">Available: ${player.money.toLocaleString()}</div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Condition</label>
            <select 
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="w-full bg-black border border-white/10 rounded p-3 text-sm text-white focus:border-cyan-500 outline-none"
            >
              <option value="crash">Total Wreck / Crash</option>
              <option value="block">Effective Block</option>
              <option value="finishBelow">Finish Behind Player</option>
            </select>
          </div>

          <div className="flex gap-4 p-4 bg-black/40 rounded border border-white/5">
            <div className="flex-1 text-[11px] text-gray-400 italic">
              "Bounties increase your heat significantly, but can force rivals into desperation."
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/5 flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 text-xs uppercase font-bold tracking-widest text-gray-500 hover:text-white">Cancel</button>
          <button 
            onClick={handleSubmit}
            className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 text-black font-black uppercase text-sm tracking-widest transition-colors rounded"
          >
            CONFIRM CONTRACT
          </button>
        </div>
      </div>
    </div>
  );
};

export default BountyModal;
