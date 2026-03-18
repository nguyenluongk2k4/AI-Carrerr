import { RecommendUniversities } from "../../../application/use-cases/recommend-universities";

export class UniversityController {
  constructor(private readonly recommend: RecommendUniversities) {}

  async list(payload: unknown) {
    return this.recommend.execute(payload as never);
  }
}
