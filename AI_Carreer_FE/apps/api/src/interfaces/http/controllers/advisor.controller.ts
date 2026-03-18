import { AskAdvisor } from "../../../application/use-cases/ask-advisor";

export class AdvisorController {
  constructor(private readonly ask: AskAdvisor) {}

  async question(payload: unknown) {
    return this.ask.execute(payload as never);
  }
}
