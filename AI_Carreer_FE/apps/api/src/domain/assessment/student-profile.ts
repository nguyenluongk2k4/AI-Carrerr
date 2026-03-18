import { Money, Score, UniqueId } from "../shared/types";

export type TestType = "personality" | "interest" | "ability";

export interface TestResult {
  type: TestType;
  scores: Record<string, Score>;
}

export interface AcademicData {
  gpa?: number;
  examScore?: Score;
  subjectCombination: string;
}

export interface Preferences {
  regionPreference?: string;
  financialCapacity?: Money;
  careerInterests?: string[];
}

export interface StudentProfile {
  id: UniqueId;
  tests: TestResult[];
  academics: AcademicData;
  preferences: Preferences;
  createdAt: string;
}
