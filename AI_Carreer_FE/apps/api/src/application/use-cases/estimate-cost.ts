import { CostEstimate } from "../../domain/finance/cost-estimate";

export interface EstimateCostInput {
  profileId: string;
  universityId: string;
  majorId: string;
}

export interface EstimateCostOutput {
  estimate: CostEstimate;
}

export interface EstimateCost {
  execute(input: EstimateCostInput): Promise<EstimateCostOutput>;
}
