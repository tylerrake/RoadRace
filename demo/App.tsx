
import React, { useState } from 'react';
import { GamePhase, Player, Rival, RaceState, RaceRecap } from './types';
import { INITIAL_PLAYER, INITIAL_RIVALS, INITIAL_RACE_STATE } from './constants';
import IntroScreen from './components/IntroScreen';
import RaceScreen from './components/RaceScreen';
import RecapScreen from './components/RecapScreen';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.INTRO);
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [rivals, setRivals] = useState<Rival[]>(INITIAL_RIVALS);
  const [raceState, setRaceState] = useState<RaceState>(INITIAL_RACE_STATE);
  const [recap, setRecap] = useState<RaceRecap | null>(null);

  const startRace = () => {
    setRaceState(INITIAL_RACE_STATE);
    setPhase(GamePhase.RACING);
  };

  const finishRace = (finalRecap: RaceRecap) => {
    setRecap(finalRecap);
    setPhase(GamePhase.RECAP);
  };

  const restartGame = () => {
    setPlayer(INITIAL_PLAYER);
    setRivals(INITIAL_RIVALS);
    setPhase(GamePhase.INTRO);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-cyan-500/30">
      {phase === GamePhase.INTRO && <IntroScreen onStart={startRace} />}
      
      {phase === GamePhase.RACING && (
        <RaceScreen 
          player={player}
          setPlayer={setPlayer}
          rivals={rivals}
          setRivals={setRivals}
          raceState={raceState}
          setRaceState={setRaceState}
          onFinish={finishRace}
        />
      )}

      {phase === GamePhase.RECAP && recap && (
        <RecapScreen 
          recap={recap} 
          onRestart={restartGame} 
        />
      )}
    </div>
  );
};

export default App;
