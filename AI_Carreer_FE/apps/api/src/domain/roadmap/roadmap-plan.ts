import { TimeRange, UniqueId } from "../shared/types";

export interface Milestone {
  title: string;
  timeframe: TimeRange;
  tasks: string[];
}

export interface RoadmapPlan {
  id: UniqueId;
  profileId: UniqueId;
  targetUniversityId: UniqueId;
  targetMajorId: UniqueId;
  durationMonths: number;
  milestones: Milestone[];
}

export interface ProgressSnapshot {
  profileId: UniqueId;
  targetScore: number;
  currentScore: number;
  progressPercent: number;
  suggestedImprovement: string;
}
