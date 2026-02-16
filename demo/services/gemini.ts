
import { GoogleGenAI, Type } from "@google/genai";
import { Player, Rival, RaceState, AIDecisionResponse, RaceRecap } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const callAIDecisionEngine = async (
  player: Player,
  rivals: Rival[],
  raceState: RaceState,
  tick: number
): Promise<AIDecisionResponse> => {
  const context = {
    player,
    rivals,
    raceState,
    recentEvents: raceState.eventLog.slice(-5),
    tick
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are the AI engine for NEURAL MOTO: Apex Rivals, a high-speed bike racing simulation.
    
    CURRENT RACE STATE:
    ${JSON.stringify(context, null, 2)}

    YOUR ROLE:
    Control 4 AI riders with distinct psychological profiles (VIPER, CIPHER, HAVOC, GHOST).
    Bikes are faster, more fragile, and rely on slipstreaming and cornering lines.

    DECISION REQUIREMENTS:
    1. Rider actions (draft, shoulder-bump, late-brake, turbo, block).
    2. Emotional updates (Zen, Aggressive, Panicked, Focused).
    3. Track incidents (lowside, highside, track limits warning, mechanical).
    4. Commentary (max 15 words, use bike racing lingo like "knee down", "apex", "slipstream").
    5. Position changes (return array of all 5 IDs).

    Return ONLY valid JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rivalActions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rivalId: { type: Type.STRING },
                action: { type: Type.STRING },
                target: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ["rivalId", "action", "reasoning"]
            }
          },
          emotionalUpdates: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rivalId: { type: Type.STRING },
                newState: { type: Type.STRING },
                trigger: { type: Type.STRING }
              }
            }
          },
          commentary: { type: Type.STRING },
          policeAction: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
              target: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          },
          allianceChanges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                rivalA: { type: Type.STRING },
                rivalB: { type: Type.STRING },
                status: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          },
          bountyResponses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                bountyId: { type: Type.STRING },
                rivalId: { type: Type.STRING },
                decision: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              }
            }
          },
          positionChanges: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["rivalActions", "commentary", "positionChanges"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateRaceRecap = async (
  player: Player,
  rivals: Rival[],
  raceState: RaceState
): Promise<RaceRecap> => {
  const context = { player, rivals, raceState };
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a cinematic recap for the motorcycle race 'Neural Moto: Apex Rivals'.
    
    RACE DATA:
    ${JSON.stringify(context, null, 2)}

    Include:
    1. Racing magazine headline.
    2. 3-paragraph narrative about the circuit battle.
    3. Post-race quotes from riders.
    4. 5 fan reactions on social media.
    5. Points/Reputation summary.

    Return ONLY valid JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING },
          narrative: { type: Type.ARRAY, items: { type: Type.STRING } },
          rivalQuotes: { type: Type.OBJECT, properties: { 
            viper: { type: Type.STRING }, 
            cipher: { type: Type.STRING }, 
            havoc: { type: Type.STRING }, 
            ghost: { type: Type.STRING } 
          } },
          forumComments: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { user: { type: Type.STRING }, text: { type: Type.STRING } } } },
          statsSummary: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
