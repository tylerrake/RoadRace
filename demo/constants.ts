
import { Rival, Archetype, Player, RaceState } from './types';

export const INITIAL_PLAYER: Player = {
  name: 'SHADOW',
  reputation: 60,
  fear: 0,
  respect: 0,
  heatLevel: 0,
  money: 5000
};

export const INITIAL_RIVALS: Rival[] = [
  {
    id: 'viper',
    name: 'VIPER',
    archetype: Archetype.PREDATOR,
    aggression: 0.95,
    loyalty: 0.1,
    fear: 0.05,
    heatTolerance: 0.9,
    money: 12000,
    emotionalState: 'Aggressive',
    relationships: { player: -0.6 },
    memory: ['Always hunts the slipstream', 'Ignores yellow flags']
  },
  {
    id: 'cipher',
    name: 'CIPHER',
    archetype: Archetype.STRATEGIST,
    aggression: 0.3,
    loyalty: 0.5,
    fear: 0.3,
    heatTolerance: 0.7,
    money: 15000,
    emotionalState: 'Zen',
    relationships: { player: 0.1 },
    memory: ['Calculates fuel load precisely', 'Watches tire wear']
  },
  {
    id: 'havoc',
    name: 'HAVOC',
    archetype: Archetype.CHAOS_AGENT,
    aggression: 0.8,
    loyalty: 0.0,
    fear: 0.2,
    heatTolerance: 0.4,
    money: 4000,
    emotionalState: 'Erratic',
    relationships: { viper: -0.4, player: -0.2 },
    memory: ['Prone to late-braking errors', 'Desperate for podium']
  },
  {
    id: 'ghost',
    name: 'GHOST',
    archetype: Archetype.LOYALIST,
    aggression: 0.5,
    loyalty: 0.9,
    fear: 0.5,
    heatTolerance: 0.8,
    money: 9000,
    emotionalState: 'Focused',
    relationships: { cipher: 0.7 },
    memory: ['Perfect defensive lines', 'Consistent lap times']
  }
];

export const INITIAL_RACE_STATE: RaceState = {
  lap: 1,
  positions: ['viper', 'cipher', 'player', 'ghost', 'havoc'],
  heatLevel: 0,
  eventLog: [],
  activeBounties: [],
  allianceMap: {}
};
