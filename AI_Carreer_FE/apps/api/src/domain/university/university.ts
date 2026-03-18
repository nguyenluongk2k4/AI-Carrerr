import { Money, Score, UniqueId } from "../shared/types";

export interface AdmissionScoreHistory {
  year: number;
  score: Score;
}

export interface MajorOffering {
  majorId: UniqueId;
  admissionScores: AdmissionScoreHistory[];
  tuitionPerYear: Money;
}

export interface University {
  id: UniqueId;
  name: string;
  location: string;
  majors: MajorOffering[];
}
