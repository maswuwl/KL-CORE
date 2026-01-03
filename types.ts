
export interface ProjectNode {
  id: string;
  title: string;
  description: string;
  roadmap: string[];
  costPoints: number;
  harmony: number;
  timestamp: string;
  status: 'STABLE' | 'EVOLVING' | 'CRITICAL';
}

export interface SystemLog {
  id: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: string;
}

export interface EconomicMetric {
  time: string;
  value: number;
}

export enum AppSection {
  IDEA_LAB = 'IDEA_LAB',
  LIVE_EXP = 'LIVE_EXP',
  ECONOMY = 'ECONOMY',
  ROBOTS = 'ROBOTS',
  SOCIAL = 'SOCIAL',
  TERMINAL = 'TERMINAL'
}

export interface IdeaSynthesisResult {
  title: string;
  description: string;
  roadmap: string[];
  costEstimation: number;
  fishHeartMetric: number;
}
