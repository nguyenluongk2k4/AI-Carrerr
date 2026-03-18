import { UniqueId } from "../shared/types";

export type AdvisorRole = "user" | "assistant";

export interface AdvisorMessage {
  role: AdvisorRole;
  content: string;
}

export interface AdvisorSession {
  id: UniqueId;
  profileId: UniqueId;
  messages: AdvisorMessage[];
  createdAt: string;
}
