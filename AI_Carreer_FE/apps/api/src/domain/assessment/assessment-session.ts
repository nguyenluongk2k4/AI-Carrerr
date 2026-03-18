import { UniqueId } from "../shared/types";

export type AssessmentStatus = "draft" | "submitted" | "completed";

export interface AssessmentSession {
  id: UniqueId;
  studentId: UniqueId;
  status: AssessmentStatus;
  startedAt: string;
  completedAt?: string;
}
