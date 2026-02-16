
export enum GamePhase {
  INTRO = 'INTRO',
  RACING = 'RACING',
  RECAP = 'RECAP'
}

export enum Archetype {
  PREDATOR = 'Predator',
  STRATEGIST = 'Strategist',
  CHAOS_AGENT = 'Chaos Agent',
  LOYALIST = 'Loyalist'
}

export type RelationshipMap = { [key: string]: number };

export interface Rival {
  id: string;
  name: string;
  archetype: Archetype;
  aggression: number;
  loyalty: number;
  fear: number;
  heatTolerance: number;
  money: number;
  emotionalState: string;
  relationships: RelationshipMap;
  memory: string[];
}

export interface Player {
  name: string;
  reputation: number;
  fear: number;
  respect: number;
  heatLevel: number;
  money: number;
}

export interface Bounty {
  id: string;
  initiatorId: string;
  targetId: string;
  amount: number;
  visibility: 'public' | 'secret';
  condition: 'crash' | 'block' | 'finishBelow';
  acceptedBy: string[];
  status: 'active' | 'complete' | 'failed';
}

export interface EventLog {
  type: string;
  actor: string;
  target?: string;
  tick: number;
  description: string;
}

export interface RaceState {
  lap: number;
  positions: string[];
  heatLevel: number;
  eventLog: EventLog[];
  activeBounties: Bounty[];
  allianceMap: { [key: string]: boolean };
}

export interface AIDecisionResponse {
  rivalActions: Array<{
    rivalId: string;
    action: string;
    target?: string;
    reasoning: string;
  }>;
  emotionalUpdates: Array<{
    rivalId: string;
    newState: string;
    trigger: string;
  }>;
  commentary: string;
  policeAction: {
    type: string;
    target: string;
    description: string;
  };
  allianceChanges: Array<{
    rivalA: string;
    rivalB: string;
    status: 'formed' | 'broken';
    reason: string;
  }>;
  bountyResponses: Array<{
    bountyId: string;
    rivalId: string;
    decision: 'accept' | 'reject' | 'betray';
    reasoning: string;
  }>;
  positionChanges: string[];
}

export interface RaceRecap {
  headline: string;
  narrative: string[];
  rivalQuotes: { [key: string]: string };
  forumComments: Array<{ user: string; text: string }>;
  statsSummary: string;
}
