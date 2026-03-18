export interface AskAdvisorInput {
  profileId: string;
  question: string;
}

export interface AskAdvisorOutput {
  answer: string;
}

export interface AskAdvisor {
  execute(input: AskAdvisorInput): Promise<AskAdvisorOutput>;
}
