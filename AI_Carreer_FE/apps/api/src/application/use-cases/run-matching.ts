import { MatchResult } from "../../domain/career/career-match";

export interface RunMatchingInput {
  profileId: string;
}

export interface RunMatchingOutput {
  result: MatchResult;
}

export interface RunMatching {
  execute(input: RunMatchingInput): Promise<RunMatchingOutput>;
}
