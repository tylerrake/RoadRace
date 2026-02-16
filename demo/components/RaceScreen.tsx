
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player, Rival, RaceState, RaceRecap, AIDecisionResponse, EventLog } from '../types';
import { callAIDecisionEngine, generateRaceRecap } from '../services/gemini';
import RivalPanel from './RivalPanel';
import BountyModal from './BountyModal';
import RaceVisualizer from './RaceVisualizer';

interface RaceScreenProps {
  player: Player;
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  rivals: Rival[];
  setRivals: React.Dispatch<React.SetStateAction<Rival[]>>;
  raceState: RaceState;
  setRaceState: React.Dispatch<React.SetStateAction<RaceState>>;
  onFinish: (recap: RaceRecap) => void;
}

const RaceScreen: React.FC<RaceScreenProps> = ({ 
  player, setPlayer, rivals, setRivals, raceState, setRaceState, onFinish 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [commentary, setCommentary] = useState<string[]>(["🎙️ Lights out! We are racing at Laguna Seca."]);
  const [speed, setSpeed] = useState(120);
  const [nitro, setNitro] = useState(100);
  const [showBountyModal, setShowBountyModal] = useState(false);

  const aiLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickCount = useRef(0);
  const commentaryEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    commentaryEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [commentary]);

  const addCommentary = useCallback((text: string) => {
    setCommentary(prev => [...prev.slice(-19), text]);
  }, []);

  const handleAction = (type: 'push' | 'block' | 'nitro') => {
    if (isProcessing) return;

    let heatIncrease = 0;
    let speedChange = 0;
    let nitroCost = 0;
    let desc = '';

    const targetId = raceState.positions[raceState.positions.indexOf('player') - 1] || 'ahead';

    switch (type) {
      case 'push':
        heatIncrease = 8;
        speedChange = 15;
        desc = `💥 SHADOW shoulders ${targetId.toUpperCase()} off the line!`;
        break;
      case 'block':
        heatIncrease = 3;
        speedChange = -10;
        desc = `🛡️ SHADOW cuts into the apex, forcing riders wide.`;
        break;
      case 'nitro':
        if (nitro < 20) return;
        nitroCost = 30;
        speedChange = 60;
        desc = `🔥 SHADOW tucks in and hits the OVERTAKE BOOST!`;
        break;
    }

    setPlayer(prev => ({ ...prev, heatLevel: Math.min(100, prev.heatLevel + heatIncrease) }));
    setSpeed(prev => Math.min(320, prev + speedChange));
    setNitro(prev => Math.max(0, prev - nitroCost));
    setRaceState(prev => ({
      ...prev,
      eventLog: [...prev.eventLog, { type, actor: 'player', target: targetId, tick: tickCount.current, description: desc }]
    }));
    addCommentary(desc);
  };

  const applyAIDecisions = useCallback((decisions: AIDecisionResponse) => {
    if (decisions.commentary) addCommentary(`🎙️ ${decisions.commentary}`);
    if (decisions.positionChanges) {
      setRaceState(prev => ({ ...prev, positions: decisions.positionChanges }));
    }
    if (decisions.emotionalUpdates) {
      setRivals(prev => prev.map(rival => {
        const update = decisions.emotionalUpdates.find(u => u.rivalId === rival.id);
        if (update) {
          return {
            ...rival,
            emotionalState: update.newState,
            memory: [...rival.memory.slice(-4), update.trigger]
          };
        }
        return rival;
      }));
    }
    if (decisions.policeAction && decisions.policeAction.type !== 'none') {
      addCommentary(`🚨 MARSHAL: ${decisions.policeAction.description}`);
      setRaceState(prev => ({ ...prev, heatLevel: Math.min(100, prev.heatLevel + 5) }));
    }
  }, [addCommentary, setRivals, setRaceState]);

  const runAITick = useCallback(async () => {
    if (raceState.lap > 3) return;

    setIsProcessing(true);
    try {
      const decisions = await callAIDecisionEngine(player, rivals, raceState, tickCount.current);
      applyAIDecisions(decisions);
      
      tickCount.current += 1;
      
      // Lap advancement logic
      if (tickCount.current % 4 === 0) {
        setRaceState(s => {
          if (s.lap >= 3) return s;
          addCommentary(`🏁 Sector Complete! Starting Lap ${s.lap + 1}`);
          return { ...s, lap: s.lap + 1 };
        });
      }

    } catch (error) {
      console.error("AI Error:", error);
      addCommentary("⚠️ Signal Interference: Rider telemetry dropped.");
    } finally {
      setIsProcessing(false);
    }
  }, [player, rivals, raceState, applyAIDecisions, addCommentary, setRaceState]);

  useEffect(() => {
    if (raceState.lap > 3) {
      const endRace = async () => {
        const recap = await generateRaceRecap(player, rivals, raceState);
        onFinish(recap);
      };
      endRace();
      return;
    }

    aiLoopRef.current = setTimeout(runAITick, 6000);
    return () => { if (aiLoopRef.current) clearTimeout(aiLoopRef.current); };
  }, [raceState.lap, runAITick, onFinish, player, rivals, raceState]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSpeed(s => Math.max(140, s - 2));
      setNitro(n => Math.min(100, n + 0.3));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen p-4 gap-4 bg-[#050505]">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 border border-magenta-500/30 bg-black/80 rounded-lg">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-orbitron tracking-widest">Risk Level</span>
            <div className="flex gap-1 mt-1">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-3 w-4 rounded-sm transition-all duration-300 ${i * 10 < player.heatLevel ? (player.heatLevel > 70 ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-magenta-500') : 'bg-gray-800'}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase font-orbitron tracking-widest">LAP</span>
            <span className="text-2xl font-black text-white font-orbitron italic">{Math.min(3, raceState.lap)}/3</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-gray-500 uppercase font-orbitron tracking-widest">PRIZE POOL</span>
          <div className="text-2xl font-bold text-green-400 font-orbitron tracking-tighter">${player.money.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left: Bike Visualizer */}
        <div className="flex-[3] flex flex-col gap-4">
          <div className="flex-1 border border-white/5 rounded-xl bg-black relative overflow-hidden">
            <RaceVisualizer positions={raceState.positions} speed={speed} />
            
            {/* HUD */}
            <div className="absolute bottom-8 left-8 flex items-end gap-12">
              <div className="flex flex-col">
                <div className="text-6xl font-black font-orbitron text-white italic leading-none">{Math.floor(speed)}</div>
                <div className="text-xs text-magenta-500 font-bold tracking-[0.4em] mt-1 uppercase">KPH // TELEMETRY</div>
              </div>
              <div className="flex flex-col w-64 pb-2">
                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold mb-2 tracking-widest">
                  <span>Draft Power</span>
                  <span className="text-white">{Math.floor(nitro)}%</span>
                </div>
                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-magenta-600 to-red-400" style={{ width: `${nitro}%` }} />
                </div>
              </div>
            </div>

            {isProcessing && (
              <div className="absolute top-6 right-6 flex items-center gap-3 bg-black/60 backdrop-blur px-4 py-2 border border-white/10 rounded">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-orbitron text-gray-400 tracking-[0.2em]">CALCULATING APEX...</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-4 gap-4 h-24">
            <button 
              onClick={() => handleAction('push')}
              disabled={isProcessing}
              className="bg-[#121212] border border-red-900/40 hover:border-red-500/60 rounded-lg flex flex-col items-center justify-center group disabled:opacity-20"
            >
              <span className="text-sm font-black font-orbitron text-red-500 group-hover:scale-110 transition-transform">SHOULDER BUMP</span>
              <span className="text-[9px] text-gray-600 font-bold uppercase mt-1">Force Error</span>
            </button>
            <button 
              onClick={() => handleAction('block')}
              disabled={isProcessing}
              className="bg-[#121212] border border-blue-900/40 hover:border-blue-500/60 rounded-lg flex flex-col items-center justify-center group disabled:opacity-20"
            >
              <span className="text-sm font-black font-orbitron text-blue-500 group-hover:scale-110 transition-transform">CLOSE LINE</span>
              <span className="text-[9px] text-gray-600 font-bold uppercase mt-1">Block Draft</span>
            </button>
            <button 
              onClick={() => handleAction('nitro')}
              disabled={isProcessing || nitro < 30}
              className="bg-[#121212] border border-magenta-900/40 hover:border-magenta-500/60 rounded-lg flex flex-col items-center justify-center group disabled:opacity-20"
            >
              <span className="text-sm font-black font-orbitron text-magenta-500 group-hover:scale-110 transition-transform">OVERTAKE</span>
              <span className="text-[9px] text-gray-600 font-bold uppercase mt-1">High Lean Angle</span>
            </button>
            <button 
              onClick={() => setShowBountyModal(true)}
              disabled={isProcessing}
              className="bg-[#121212] border border-yellow-900/40 hover:border-yellow-500/60 rounded-lg flex flex-col items-center justify-center group disabled:opacity-20"
            >
              <span className="text-sm font-black font-orbitron text-yellow-500 group-hover:scale-110 transition-transform">TEAM ORDER</span>
              <span className="text-[9px] text-gray-600 font-bold uppercase mt-1">Contract Rider</span>
            </button>
          </div>
        </div>

        {/* Right Feed */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-[2] bg-[#0c0c0c] border border-white/5 rounded-xl flex flex-col overflow-hidden">
            <div className="p-3 bg-white/5 font-orbitron text-[9px] tracking-widest text-gray-500 border-b border-white/5">RACE CONTROL</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-[13px] leading-tight">
              {commentary.map((text, i) => (
                <div key={i} className="text-gray-300 border-l-2 border-magenta-500/30 pl-3 py-1">
                  <span className="text-magenta-500/50 mr-2">[{i.toString().padStart(2, '0')}]</span>
                  {text}
                </div>
              ))}
              <div ref={commentaryEndRef} />
            </div>
          </div>

          <div className="flex-[3] bg-[#0c0c0c] border border-white/5 rounded-xl flex flex-col overflow-hidden">
            <div className="p-3 bg-white/5 font-orbitron text-[9px] tracking-widest text-gray-500 border-b border-white/5">PADDOCK INTELLIGENCE</div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {rivals.map(rival => (
                <RivalPanel key={rival.id} rival={rival} isTarget={raceState.positions[0] === rival.id} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showBountyModal && (
        <BountyModal 
          player={player}
          setPlayer={setPlayer}
          rivals={rivals}
          onClose={() => setShowBountyModal(false)}
          onPlace={(target, amount, visibility, condition) => {
            setRaceState(prev => ({
              ...prev,
              activeBounties: [...prev.activeBounties, {
                id: `order_${Date.now()}`,
                initiatorId: 'player',
                targetId: target,
                amount,
                visibility,
                condition,
                acceptedBy: [],
                status: 'active'
              }]
            }));
            addCommentary(`📋 Contract offered: $${amount} for a strategic block on ${target.toUpperCase()}.`);
            setShowBountyModal(false);
          }}
        />
      )}
    </div>
  );
};

export default RaceScreen;
