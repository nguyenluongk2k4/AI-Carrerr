import { Pagination, UniqueId } from "../shared/types";
import { University } from "./university";

export interface UniversityRepository {
  getById(id: UniqueId): Promise<University | null>;
  search(criteria: {
    majorId?: UniqueId;
    location?: string;
    maxTuitionPerYear?: number;
  }, pagination?: Pagination): Promise<University[]>;
}
