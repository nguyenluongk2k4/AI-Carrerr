export interface RoadmapResponse {
  roadmapId: string;
  milestones: {
    title: string;
    fromMonth: number;
    toMonth: number;
    tasks: string[];
  }[];
}
