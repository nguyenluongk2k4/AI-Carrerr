import { RunMatching } from "../../../application/use-cases/run-matching";

export class MatchingController {
  constructor(private readonly runMatching: RunMatching) {}

  async run(payload: unknown) {
    return this.runMatching.execute(payload as never);
  }
}
