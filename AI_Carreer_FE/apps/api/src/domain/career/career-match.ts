import { Percentage, UniqueId } from "../shared/types";

export interface CareerMatch {
  profileId: UniqueId;
  majorId: UniqueId;
  compatibility: Percentage;
  explanation: string[];
}

export interface MatchResult {
  profileId: UniqueId;
  topMatches: CareerMatch[];
}
