import { AdmissionResult } from "../../domain/admission/admission-chance";

export interface ComputeAdmissionInput {
  profileId: string;
  universityId: string;
  majorId: string;
}

export interface ComputeAdmissionOutput {
  result: AdmissionResult;
}

export interface ComputeAdmission {
  execute(input: ComputeAdmissionInput): Promise<ComputeAdmissionOutput>;
}
