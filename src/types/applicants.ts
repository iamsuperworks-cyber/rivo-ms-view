export type ApplicantStatus = "In Process" | "Declined" | "Not Proceeding";

export interface Liability {
  id: string;
  type: string;
  monthlyAmount: string;
}

export interface ApplicantData {
  id: string;
  // Personal Information (Section 1)
  firstName: string;
  lastName: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  nationality: string;
  residency: string;
  employment: string;
  source: string;

  // Application Type (Section 2)
  applicationType: "Individual" | "Joint";

  // Property Intent (Section 3)
  mortgagePurpose: string;
  emirate: string;
  propertyType: string;
  propertyStatus: string;
  propertyReadiness: string;
  developerProject: string;
  specificProject: string;
  estimatedValue: string;
  propertyLocation: string;
  firstProperty: string;
  timeline: string;
  financingPreference: string;
  downPaymentReady: string;

  // Borrower Profile (Section 4)
  borrowerFullName: string;
  borrowerEmail: string;
  borrowerDOB: string;
  borrowerNationality: string;
  borrowerResidencyStatus: string;
  borrowerEmploymentType: string;
  borrowerCurrentEmployer: string;
  borrowerJobTitle: string;
  borrowerYearsInRole: string;
  borrowerTotalYearsUAE: string;
  borrowerMaritalStatus: string;
  borrowerApplicationType: string;

  // Financial Snapshot (Section 5)
  monthlyIncome: string;
  additionalIncome: string;
  existingHomeLoanEMI: string;
  carLoanEMI: string;
  personalLoanEMI: string;
  creditCardObligations: string;
  otherLiabilities: string;
  aecbCreditScore: string;
  sourceOfDownPayment: string;
  creditIssues: string[];

  // Income & Liabilities Verified (Section 6)
  verifiedMonthlySalary: string;
  verifiedTotalAddbacks: string;
  verifiedLiabilities: Liability[];

  // Property Details (Section 7)
  propertyCategory: string;
  propertyDetailType: string;
  propertyDetailEmirate: string;
  propertyTransaction: string;
  propertyValue: string;
  propertyFirstProperty: string;

  // Loan Details (Section 8)
  loanAmount: string;
  tenureYears: string;
  tenureMonths: string;

  // Meta
  status: ApplicantStatus;
  assignedMS: string;
  campaign: string;
  slaStatus: "completed" | "remaining" | "none";
  slaRemainingDays?: number;
  slaRemainingHours?: number;
  createdAt: string;
}

export function createEmptyApplicant(id: string): ApplicantData {
  return {
    id,
    firstName: "", lastName: "", phoneCountryCode: "+971", phone: "", email: "",
    dateOfBirth: "", nationality: "", residency: "", employment: "", source: "",
    applicationType: "Individual",
    mortgagePurpose: "", emirate: "", propertyType: "", propertyStatus: "",
    propertyReadiness: "", developerProject: "", specificProject: "",
    estimatedValue: "", propertyLocation: "", firstProperty: "",
    timeline: "", financingPreference: "", downPaymentReady: "",
    borrowerFullName: "", borrowerEmail: "", borrowerDOB: "", borrowerNationality: "",
    borrowerResidencyStatus: "", borrowerEmploymentType: "", borrowerCurrentEmployer: "",
    borrowerJobTitle: "", borrowerYearsInRole: "", borrowerTotalYearsUAE: "",
    borrowerMaritalStatus: "", borrowerApplicationType: "Individual",
    monthlyIncome: "", additionalIncome: "", existingHomeLoanEMI: "",
    carLoanEMI: "", personalLoanEMI: "", creditCardObligations: "",
    otherLiabilities: "", aecbCreditScore: "", sourceOfDownPayment: "",
    creditIssues: [],
    verifiedMonthlySalary: "", verifiedTotalAddbacks: "", verifiedLiabilities: [],
    propertyCategory: "", propertyDetailType: "", propertyDetailEmirate: "",
    propertyTransaction: "", propertyValue: "", propertyFirstProperty: "",
    loanAmount: "", tenureYears: "", tenureMonths: "",
    status: "In Process", assignedMS: "Anam Riaz", campaign: "",
    slaStatus: "none", createdAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
  };
}

export const SAMPLE_APPLICANTS: ApplicantData[] = [
  {
    ...createEmptyApplicant("a1"),
    firstName: "James", lastName: "Wilson",
    phone: "55 987 6543", email: "james.wilson@email.com",
    source: "Rivo Partners App (Freelance Network)", campaign: "Freelance Network",
    status: "In Process", assignedMS: "Anam Riaz",
    slaStatus: "completed",
    mortgagePurpose: "Purchase", emirate: "Dubai", propertyType: "Villa",
    propertyStatus: "Ready", estimatedValue: "2500000", timeline: "1-3 months",
    borrowerFullName: "James Wilson", borrowerEmail: "james.wilson@email.com",
    borrowerEmploymentType: "Salaried — Private", borrowerYearsInRole: "3",
    monthlyIncome: "35000", firstProperty: "Yes", downPaymentReady: "Yes",
    createdAt: "03 Mar 2026",
  },
  {
    ...createEmptyApplicant("a2"),
    firstName: "Lisa", lastName: "Chen",
    phone: "50 123 4567", email: "lisa.chen@email.com",
    source: "Meta Ads", campaign: "Q1 Campaign",
    status: "In Process", assignedMS: "Anam Riaz",
    slaStatus: "remaining", slaRemainingDays: 1, slaRemainingHours: 4,
    mortgagePurpose: "Purchase", emirate: "Abu Dhabi", propertyType: "Apartment",
    estimatedValue: "1200000", timeline: "3-6 months",
    borrowerFullName: "Lisa Chen", monthlyIncome: "28000",
    createdAt: "08 Mar 2026",
  },
  {
    ...createEmptyApplicant("a3"),
    firstName: "Ahmed", lastName: "Al-Rashid",
    phone: "56 111 2233", email: "ahmed@email.com",
    source: "Meta Ads", campaign: "Ramadan Campaign",
    status: "Declined", assignedMS: "Anam Riaz",
    slaStatus: "completed",
    createdAt: "01 Mar 2026",
  },
];
