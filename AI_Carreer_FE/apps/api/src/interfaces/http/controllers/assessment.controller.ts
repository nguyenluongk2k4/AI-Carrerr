import { SubmitAssessment } from "../../../application/use-cases/submit-assessment";

export class AssessmentController {
  constructor(private readonly submitAssessment: SubmitAssessment) {}

  async submit(payload: unknown) {
    return this.submitAssessment.execute(payload as never);
  }
}
