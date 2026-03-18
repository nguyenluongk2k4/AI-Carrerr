// Mock data for the career guidance platform

export interface University {
  name: string;
  location: string;
  tuition: string;
  admissionScore: number;
  probability: "High" | "Medium" | "Low";
  major: string;
  ranking: number;
  acceptanceRate: string;
  fourYearCost: string;
}

export interface Major {
  major: string;
  compatibility: number;
  reasons: string[];
  careers: string[];
  avgSalary: string;
}

export const mockMajors: Major[] = [
  {
    major: "Computer Science",
    compatibility: 92,
    reasons: [
      "Strong analytical thinking skills",
      "High interest in technology",
      "Excellent problem-solving abilities"
    ],
    careers: ["Software Engineer", "Data Scientist", "AI Researcher"],
    avgSalary: "$95,000"
  },
  {
    major: "Business Analytics",
    compatibility: 88,
    reasons: [
      "Combines business and technical skills",
      "Strong mathematical foundation",
      "Leadership potential"
    ],
    careers: ["Business Analyst", "Consultant", "Data Analyst"],
    avgSalary: "$75,000"
  },
  {
    major: "Information Systems",
    compatibility: 85,
    reasons: [
      "Balance of technical and business skills",
      "Good communication abilities",
      "Problem-solving mindset"
    ],
    careers: ["IT Manager", "Systems Analyst", "Project Manager"],
    avgSalary: "$80,000"
  }
];

export const mockUniversities: University[] = [
  {
    name: "MIT",
    location: "Cambridge, MA",
    tuition: "$53,790",
    admissionScore: 95,
    probability: "Medium",
    major: "Computer Science",
    ranking: 1,
    acceptanceRate: "7%",
    fourYearCost: "$215,160"
  },
  {
    name: "Stanford University",
    location: "Stanford, CA",
    tuition: "$56,169",
    admissionScore: 94,
    probability: "Medium",
    major: "Computer Science",
    ranking: 2,
    acceptanceRate: "5%",
    fourYearCost: "$224,676"
  },
  {
    name: "Carnegie Mellon University",
    location: "Pittsburgh, PA",
    tuition: "$59,864",
    admissionScore: 93,
    probability: "High",
    major: "Computer Science",
    ranking: 3,
    acceptanceRate: "13%",
    fourYearCost: "$239,456"
  },
  {
    name: "UC Berkeley",
    location: "Berkeley, CA",
    tuition: "$44,115",
    admissionScore: 92,
    probability: "High",
    major: "Computer Science",
    ranking: 4,
    acceptanceRate: "15%",
    fourYearCost: "$176,460"
  },
  {
    name: "Georgia Tech",
    location: "Atlanta, GA",
    tuition: "$33,794",
    admissionScore: 88,
    probability: "High",
    major: "Computer Science",
    ranking: 8,
    acceptanceRate: "18%",
    fourYearCost: "$135,176"
  },
  {
    name: "University of Illinois",
    location: "Urbana-Champaign, IL",
    tuition: "$34,316",
    admissionScore: 87,
    probability: "High",
    major: "Computer Science",
    ranking: 10,
    acceptanceRate: "45%",
    fourYearCost: "$137,264"
  },
];
