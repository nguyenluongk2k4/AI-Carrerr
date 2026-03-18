import { StudentProfile } from "../assessment/student-profile";
import { CostEstimate } from "./cost-estimate";

export interface CostEstimator {
  estimate(profile: StudentProfile, universityId: string, majorId: string): Promise<CostEstimate>;
}
