export type LeadStatus = "Qualified" | "Lead In" | "Nurture" | "Applicant" | "Declined" | "Dead" | "Not Proceeding";

export interface Lead {
  id: string;
  name: string;
  callAttempts: number;
  source: string;
  status: LeadStatus;
  created: string;
  lastActivity: string;
  phone: string;
  agent: string;
  email: string;
  intent: string;
}

export interface CallAttempt {
  id: string;
  timestamp: string;
  outcome: "Connected" | "Not Reached" | "No Answer" | "Wrong Number";
  note: string;
  duration?: string;
  language?: string;
  reminderDate?: string;
}

export interface QualificationData {
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
  paymentAssistance: string;
  timeline: string;
  downPaymentReady: string;
  financingPreference: string;
  // Borrower Profile
  fullName: string;
  borrowerEmail: string;
  dateOfBirth: string;
  nationality: string;
  residencyStatus: string;
  visaType: string;
  visaExpiry: string;
  employmentType: string;
  currentEmployer: string;
  jobTitle: string;
  yearsInCurrentRole: string;
  totalYearsInUAE: string;
  maritalStatus: string;
  applicationType: string;
  // Financial
  monthlyIncome: string;
  additionalIncome: string;
  existingHomeLoanEMI: string;
  carLoanEMI: string;
  personalLoanEMI: string;
  creditCardObligations: string;
  otherLiabilities: string;
  aecbCreditScore: string;
  creditIssues: string;
  downPaymentSource: string;
  callNotes: string;
}

export interface DeclineData {
  category: string;
  subReason: string;
  notes: string;
}

export interface NurtureData {
  reason: string;
  reEngagementDate: string;
  preferredContact: string;
  notes: string;
}

export const SAMPLE_LEADS: Lead[] = [
  {
    id: "1",
    name: "Lisa Chen",
    callAttempts: 2,
    source: "Rivo Partners App (Freelance Network)",
    status: "Nurture",
    created: "08 Mar 2026",
    lastActivity: "28d ago",
    phone: "+971 50 123 4567",
    agent: "Anam Riaz",
    email: "lisa.chen@email.com",
    intent: "Looking for a mortgage for a new villa in Dubai Marina",
  },
  {
    id: "2",
    name: "James Wilson",
    callAttempts: 1,
    source: "Rivo Partners App (Freelance Network)",
    status: "Qualified",
    created: "03 Mar 2026",
    lastActivity: "33d ago",
    phone: "+971 55 987 6543",
    agent: "Anam Riaz",
    email: "james.wilson@email.com",
    intent: "Refinancing existing property in JBR",
  },
  {
    id: "3",
    name: "Ahmed Al-Rashid",
    callAttempts: 0,
    source: "Meta Ads",
    status: "Declined",
    created: "01 Mar 2026",
    lastActivity: "36d ago",
    phone: "+971 56 111 2233",
    agent: "Anam Riaz",
    email: "ahmed.alrashid@email.com",
    intent: "Interested in apartment purchase in Downtown Dubai",
  },
];

export const DECLINE_CATEGORIES = [
  { icon: "🏦", label: "Not Eligible — Bank Criteria" },
  { icon: "💰", label: "Financial — Affordability" },
  { icon: "📄", label: "Documentation Issues" },
  { icon: "🏠", label: "Property Related" },
  { icon: "👤", label: "Applicant Not Interested" },
  { icon: "📞", label: "Unreachable" },
];

export const DECLINE_MORE_REASONS = [
  "Duplicate Lead",
  "Already Has a Broker",
  "Already Applied Directly",
  "Under Legal Dispute",
  "Blacklisted by Banks",
  "Salary Transfer Issue",
  "Self-Employed — Insufficient Records",
  "Visa Expiring Soon",
  "Negative Equity",
  "Other",
];

export const DECLINE_SUB_REASONS: Record<string, string[]> = {
  "Not Eligible — Bank Criteria": [
    "Minimum salary not met",
    "Employment type not accepted",
    "Nationality restrictions",
    "Age restrictions",
    "Residency status not eligible",
  ],
  "Financial — Affordability": [
    "DBR exceeds limit",
    "Insufficient down payment",
    "Existing liabilities too high",
    "Income source not verifiable",
  ],
  "Documentation Issues": [
    "Missing salary certificate",
    "Bank statements incomplete",
    "Trade license expired",
    "Passport/visa issues",
  ],
  "Property Related": [
    "Property not mortgage-eligible",
    "Developer not approved",
    "Property valuation too low",
    "Off-plan restrictions",
  ],
  "Applicant Not Interested": [
    "Changed mind",
    "Going with another broker",
    "Postponing purchase",
    "Just inquiring",
  ],
  "Unreachable": [
    "No response after 5+ attempts",
    "Phone disconnected",
    "Wrong contact details",
    "Requested no further contact",
  ],
};

export const NURTURE_REASONS = [
  "Not ready yet — exploring options",
  "Waiting for salary increase",
  "Saving for down payment",
  "Visa renewal pending",
  "Property search in progress",
  "Waiting for pre-approval",
  "Timeline too far away (6+ months)",
  "Needs to build credit score",
  "Needs employment stability (< 6 months in role)",
  "Waiting for property identification",
  "Comparing with other brokers",
  "Down payment not ready",
  "Visa status changing soon",
  "Personal reasons — asked to call back later",
  "Other",
];
