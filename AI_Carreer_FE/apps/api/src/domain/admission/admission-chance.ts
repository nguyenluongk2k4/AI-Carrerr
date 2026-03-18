import { UniqueId } from "../shared/types";

export type AdmissionChance = "high" | "medium" | "low";

export interface AdmissionResult {
  profileId: UniqueId;
  universityId: UniqueId;
  majorId: UniqueId;
  chance: AdmissionChance;
}
