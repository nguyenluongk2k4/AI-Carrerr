import { TestType } from "../domain/assessment/student-profile";

export interface SubmitAssessmentRequest {
  tests: { type: TestType; scores: Record<string, number> }[];
  academics: {
    gpa?: number;
    examScore?: number;
    subjectCombination: string;
  };
  preferences: {
    regionPreference?: string;
    financialCapacity?: { amount: number; currency: "VND" };
    careerInterests?: string[];
  };
}

export interface SubmitAssessmentResponse {
  profileId: string;
}
