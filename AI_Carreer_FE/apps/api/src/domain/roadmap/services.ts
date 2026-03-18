import { StudentProfile } from "../assessment/student-profile";
import { RoadmapPlan } from "./roadmap-plan";

export interface RoadmapGenerator {
  generate(profile: StudentProfile, targetUniversityId: string, targetMajorId: string): Promise<RoadmapPlan>;
}
