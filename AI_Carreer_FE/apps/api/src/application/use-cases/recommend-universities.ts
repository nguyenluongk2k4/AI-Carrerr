import { University } from "../../domain/university/university";

export interface RecommendUniversitiesInput {
  profileId: string;
  majorId: string;
  location?: string;
  maxTuitionPerYear?: number;
}

export interface RecommendUniversitiesOutput {
  universities: University[];
}

export interface RecommendUniversities {
  execute(input: RecommendUniversitiesInput): Promise<RecommendUniversitiesOutput>;
}
