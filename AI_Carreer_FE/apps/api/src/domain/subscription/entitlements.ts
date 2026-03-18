import { UniqueId } from "../shared/types";

export type PlanTier = "free" | "paid" | "premium";

export interface Entitlement {
  profileId: UniqueId;
  plan: PlanTier;
  features: string[];
}

export interface EntitlementService {
  canAccess(plan: PlanTier, feature: string): boolean;
}
