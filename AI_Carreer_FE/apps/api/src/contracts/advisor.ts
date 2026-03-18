export interface AskAdvisorRequest {
  profileId: string;
  question: string;
}

export interface AskAdvisorResponse {
  answer: string;
}
