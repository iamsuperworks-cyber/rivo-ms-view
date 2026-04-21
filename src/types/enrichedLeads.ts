export interface DealPills {
  type: string;
  location: string;
  value: string;
  timeline: string;
}

export interface RetryReminder {
  date: string;
  time: string;
}

export type EnrichedLeadStatus = "new" | "active" | "qualified" | "nurture" | "declined";
export type CallOutcome = "connected" | "no-answer" | "not-reached" | "wrong-number" | null;

export interface DsaFormData {
  loanPurpose: "Purchase" | "Refinance" | null;
  propertyIdentified: "Yes, I have a property" | "Still searching" | null;
  monthlyIncome: number | null;
  expectedLoanAmount: number | null;
}

export interface EnrichedLead {
  id: number;
  name: string;
  source: string;
  status: EnrichedLeadStatus;
  created: string;
  lastActivity: string;
  attempts: number;
  lastOutcome: CallOutcome;
  everConnected: boolean;
  connectedDuration: number | null;
  retryReminder: RetryReminder | null;
  nurtureReason: string | null;
  nurtureCallbackDate: string | null;
  nurtureCallbackUrgency: "urgent" | "soon" | null;
  declineCategory: string | null;
  declineSubReason: string | null;
  declineNote: string | null;
  qualFormStatus: "draft" | "submitted" | "declined" | null;
  dealPills: DealPills | null;
  dsaForm: DsaFormData | null;
}

export const ENRICHED_LEADS: EnrichedLead[] = [
  {
    id: 1,
    name: "Ahmed Al Sayed",
    source: "DSA — Al Futtaim Referral",
    status: "new",
    created: "07 Apr 2026",
    lastActivity: "Today",
    attempts: 0,
    lastOutcome: null,
    everConnected: false,
    connectedDuration: null,
    retryReminder: null,
    nurtureReason: null,
    nurtureCallbackDate: null,
    nurtureCallbackUrgency: null,
    declineCategory: null,
    declineSubReason: null,
    declineNote: null,
    qualFormStatus: null,
    dealPills: null,
    dsaForm: { loanPurpose: "Purchase", propertyIdentified: "Still searching", monthlyIncome: 25000, expectedLoanAmount: 1500000 },
  },
  {
    id: 2,
    name: "Sara Al Mansoori",
    source: "Meta Ads — Q1 Campaign",
    status: "active",
    created: "04 Apr 2026",
    lastActivity: "1d ago",
    attempts: 2,
    lastOutcome: "no-answer",
    everConnected: false,
    connectedDuration: null,
    retryReminder: { date: "Today", time: "5:00 PM" },
    nurtureReason: null,
    nurtureCallbackDate: null,
    nurtureCallbackUrgency: null,
    declineCategory: null,
    declineSubReason: null,
    declineNote: null,
    qualFormStatus: null,
    dealPills: null,
    dsaForm: null,
  },
  {
    id: 3,
    name: "Tariq Mahmoud",
    source: "WhatsApp Campaign — Eid Promo",
    status: "active",
    created: "01 Mar 2026",
    lastActivity: "5d ago",
    attempts: 1,
    lastOutcome: "wrong-number",
    everConnected: false,
    connectedDuration: null,
    retryReminder: null,
    nurtureReason: null,
    nurtureCallbackDate: null,
    nurtureCallbackUrgency: null,
    declineCategory: null,
    declineSubReason: null,
    declineNote: null,
    qualFormStatus: null,
    dealPills: null,
    dsaForm: null,
  },
  {
    id: 4,
    name: "Khalid Bin Hamdan",
    source: "Google Ads — Buy Property UAE",
    status: "active",
    created: "20 Feb 2026",
    lastActivity: "2d ago",
    attempts: 5,
    lastOutcome: "no-answer",
    everConnected: false,
    connectedDuration: null,
    retryReminder: null,
    nurtureReason: null,
    nurtureCallbackDate: null,
    nurtureCallbackUrgency: null,
    declineCategory: null,
    declineSubReason: null,
    declineNote: null,
    qualFormStatus: null,
    dealPills: null,
    dsaForm: null,
  },
  {
    id: 5,
    name: "James Wilson",
    source: "Rivo Partners App (Freelance Network)",
    status: "active",
    created: "03 Mar 2026",
    lastActivity: "33d ago",
    attempts: 3,
    lastOutcome: "connected",
    everConnected: true,
    connectedDuration: 12,
    retryReminder: null,
    nurtureReason: null,
    nurtureCallbackDate: null,
    nurtureCallbackUrgency: null,
    declineCategory: null,
    declineSubReason: null,
    declineNote: null,
    qualFormStatus: "draft",
    dealPills: {
      type: "Villa",
      location: "Dubai",
      value: "AED 2–3M",
      timeline: "1–3 months",
    },
    dsaForm: null,
  },
  {
    id: 6,
    name: "James Wilson",
    source: "Rivo Partners App (Freelance Network)",
    status: "qualified",
    created: "03 Mar 2026",
    lastActivity: "33d ago",
    attempts: 3,
    lastOutcome: "connected",
    everConnected: true,
    connectedDuration: 12,
    retryReminder: null,
    nurtureReason: null,
    nurtureCallbackDate: null,
    nurtureCallbackUrgency: null,
    declineCategory: null,
    declineSubReason: null,
    declineNote: null,
    qualFormStatus: "submitted",
    dealPills: {
      type: "Villa",
      location: "Dubai",
      value: "AED 2–3M",
      timeline: "1–3 months",
    },
    dsaForm: null,
  },
  {
    id: 7,
    name: "Priya Sharma",
    source: "Meta Ads — Ramadan Campaign",
    status: "nurture",
    created: "28 Feb 2026",
    lastActivity: "2d ago",
    attempts: 2,
    lastOutcome: "connected",
    everConnected: true,
    connectedDuration: 9,
    retryReminder: null,
    nurtureReason: "asked to call back in 3 months",
    nurtureCallbackDate: "Jun 5, 2026",
    nurtureCallbackUrgency: "soon",
    declineCategory: null,
    declineSubReason: null,
    declineNote: null,
    qualFormStatus: null,
    dealPills: {
      type: "Apartment",
      location: "Abu Dhabi",
      value: "AED 1–1.5M",
      timeline: "3–6 months",
    },
    dsaForm: null,
  },
  {
    id: 8,
    name: "Fatima Al Rashid",
    source: "AskRivo — AI Intake",
    status: "declined",
    created: "25 Feb 2026",
    lastActivity: "22d ago",
    attempts: 1,
    lastOutcome: "connected",
    everConnected: true,
    connectedDuration: 7,
    retryReminder: null,
    nurtureReason: null,
    nurtureCallbackDate: null,
    nurtureCallbackUrgency: null,
    declineCategory: "Eligibility",
    declineSubReason: "Visit Visa",
    declineNote: "Lead is on a visit visa and does not meet the minimum residency requirement for mortgage approval in the UAE.",
    qualFormStatus: "declined",
    dealPills: {
      type: "Villa",
      location: "Dubai",
      value: "AED 2–3M",
      timeline: "Urgent (<30 days)",
    },
    dsaForm: null,
  },
];
