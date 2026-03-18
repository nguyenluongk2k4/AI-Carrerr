import { StudentProfile } from "../assessment/student-profile";
import { AdmissionResult } from "./admission-chance";

export interface AdmissionScoringService {
  score(profile: StudentProfile, universityId: string, majorId: string): Promise<AdmissionResult>;
}
