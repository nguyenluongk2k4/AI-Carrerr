import { Score, UniqueId } from "../shared/types";

export interface Major {
  id: UniqueId;
  name: string;
  requiredSkills: string[];
  typicalScoreRequirement?: Score;
  careerPaths?: string[];
}
