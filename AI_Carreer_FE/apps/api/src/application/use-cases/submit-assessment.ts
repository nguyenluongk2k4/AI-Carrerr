import { AcademicData, Preferences, TestResult } from "../../domain/assessment/student-profile";
import { StudentProfile } from "../../domain/assessment/student-profile";

export interface SubmitAssessmentInput {
  tests: TestResult[];
  academics: AcademicData;
  preferences: Preferences;
}

export interface SubmitAssessmentOutput {
  profile: StudentProfile;
}

export interface SubmitAssessment {
  execute(input: SubmitAssessmentInput): Promise<SubmitAssessmentOutput>;
}
