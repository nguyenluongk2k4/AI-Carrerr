import { Money, UniqueId } from "../shared/types";

export interface CostEstimate {
  profileId: UniqueId;
  universityId: UniqueId;
  majorId: UniqueId;
  yearlyTuition: Money;
  totalCost: Money;
}
