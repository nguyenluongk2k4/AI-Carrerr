export interface RunMatchingResponse {
  profileId: string;
  matches: {
    majorId: string;
    compatibility: number;
    explanation: string[];
  }[];
}
