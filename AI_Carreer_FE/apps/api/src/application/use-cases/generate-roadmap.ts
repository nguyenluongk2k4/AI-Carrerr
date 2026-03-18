import { RoadmapPlan } from "../../domain/roadmap/roadmap-plan";

export interface GenerateRoadmapInput {
  profileId: string;
  targetUniversityId: string;
  targetMajorId: string;
}

export interface GenerateRoadmapOutput {
  roadmap: RoadmapPlan;
}

export interface GenerateRoadmap {
  execute(input: GenerateRoadmapInput): Promise<GenerateRoadmapOutput>;
}
