import { GenerateRoadmap } from "../../../application/use-cases/generate-roadmap";

export class RoadmapController {
  constructor(private readonly generate: GenerateRoadmap) {}

  async create(payload: unknown) {
    return this.generate.execute(payload as never);
  }
}
