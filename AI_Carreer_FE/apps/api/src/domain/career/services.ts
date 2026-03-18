import { StudentProfile } from "../assessment/student-profile";
import { MatchResult } from "./career-match";

export interface CareerMatchingService {
  match(profile: StudentProfile): Promise<MatchResult>;
}
