import { AdvisorSession } from "./advisor-session";

export interface AdvisorService {
  ask(session: AdvisorSession, question: string): Promise<string>;
}
