import { StudentProfileRepository } from "../../../domain/assessment/repositories";
import { StudentProfile } from "../../../domain/assessment/student-profile";
import { UniqueId } from "../../../domain/shared/types";

export class InMemoryStudentProfileRepository implements StudentProfileRepository {
  private readonly store = new Map<UniqueId, StudentProfile>();

  async getById(id: UniqueId): Promise<StudentProfile | null> {
    return this.store.get(id) || null;
  }

  async save(profile: StudentProfile): Promise<void> {
    this.store.set(profile.id, profile);
  }

  async update(profile: StudentProfile): Promise<void> {
    this.store.set(profile.id, profile);
  }
}
