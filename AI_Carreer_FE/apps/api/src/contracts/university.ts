export interface UniversityRecommendationResponse {
  universities: {
    id: string;
    name: string;
    location: string;
    admissionChance: "high" | "medium" | "low";
    yearlyTuition: { amount: number; currency: "VND" };
  }[];
}
