import { StudentProfile } from "./student-profile";
import { UniqueId } from "../shared/types";

export interface StudentProfileRepository {
  getById(id: UniqueId): Promise<StudentProfile | null>;
  save(profile: StudentProfile): Promise<void>;
  update(profile: StudentProfile): Promise<void>;
}
