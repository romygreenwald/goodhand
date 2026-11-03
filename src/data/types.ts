export type Trade = "Electrician" | "Plumber" | "HVAC" | "Welder" | "Pipefitter";

export const TRADES: { value: Trade; available: boolean }[] = [
  { value: "Electrician", available: true },
  { value: "Plumber", available: false },
  { value: "HVAC", available: false },
  { value: "Welder", available: false },
  { value: "Pipefitter", available: false },
];

export type LicenseType =
  | "Apprentice"
  | "Journeyman"
  | "Journeyman Industrial"
  | "Residential Wireman"
  | "Master";

export const LICENSE_TYPES: LicenseType[] = [
  "Apprentice",
  "Journeyman",
  "Journeyman Industrial",
  "Residential Wireman",
  "Master",
];

export const LICENSE_SHORT: Record<LicenseType, string> = {
  Apprentice: "APP",
  Journeyman: "JM",
  "Journeyman Industrial": "JM IND",
  "Residential Wireman": "RW",
  Master: "MASTER",
};

export const LICENSE_PLURAL: Record<LicenseType, string> = {
  Apprentice: "apprentices",
  Journeyman: "journeymen",
  "Journeyman Industrial": "industrial journeymen",
  "Residential Wireman": "residential wiremen",
  Master: "master electricians",
};

export type RoleTitle =
  | "Journeyman wireman"
  | "Foreman"
  | "General foreman"
  | "Medium voltage specialist"
  | "Commissioning technician";

export const ROLE_TITLES: RoleTitle[] = [
  "Journeyman wireman",
  "Foreman",
  "General foreman",
  "Medium voltage specialist",
  "Commissioning technician",
];

export type ProjectType = "Data center" | "Industrial" | "Commercial" | "Utility or substation";

export const PROJECT_TYPES: ProjectType[] = [
  "Data center",
  "Industrial",
  "Commercial",
  "Utility or substation",
];

export type TravelRadius = "Within 50 miles" | "Within 150 miles" | "Anywhere in Texas";

export const TRAVEL_RADIUS: TravelRadius[] = [
  "Within 50 miles",
  "Within 150 miles",
  "Anywhere in Texas",
];

export type Urgency = "Standard" | "Urgent" | "Critical";
export const URGENCIES: Urgency[] = ["Standard", "Urgent", "Critical"];

export type RoleStatus = "Sourcing" | "Active" | "Filled" | "Paused";
export const ROLE_STATUSES: RoleStatus[] = ["Sourcing", "Active", "Filled", "Paused"];

export type Requirement =
  | "OSHA 10"
  | "OSHA 30"
  | "NFPA 70E"
  | "Valid driver's license"
  | "Drug test"
  | "Background check";

export const REQUIREMENTS: Requirement[] = [
  "OSHA 10",
  "OSHA 30",
  "NFPA 70E",
  "Valid driver's license",
  "Drug test",
  "Background check",
];

export type Stage =
  | "matched"
  | "emailed"
  | "replied"
  | "interested"
  | "introduced"
  | "interviewing"
  | "hired"
  | "started";

export const STAGES: Stage[] = [
  "matched",
  "emailed",
  "replied",
  "interested",
  "introduced",
  "interviewing",
  "hired",
  "started",
];

/** The five stages the contractor actually works day to day. */
export const BOARD_STAGES: Stage[] = [
  "interested",
  "introduced",
  "interviewing",
  "hired",
  "started",
];

export const STAGE_LABELS: Record<Stage, string> = {
  matched: "Matched",
  emailed: "Emailed",
  replied: "Replied",
  interested: "Interested",
  introduced: "Introduced to you",
  interviewing: "Interviewing",
  hired: "Hired",
  started: "Started",
};

export const STAGE_LABELS_SHORT: Record<Stage, string> = {
  matched: "Matched",
  emailed: "Emailed",
  replied: "Replied",
  interested: "Interested",
  introduced: "Introduced",
  interviewing: "Interviewing",
  hired: "Hired",
  started: "Started",
};

export type CandidateState = Stage | "not_a_fit";

export function stageIndex(stage: Stage): number {
  return STAGES.indexOf(stage);
}

export const NOT_A_FIT_REASONS = [
  "Pay is too low for them",
  "Too far from the job site",
  "License does not match the role",
  "Not available when we need them",
  "Missing a required card",
  "We already filled this role",
  "Something else",
];

export interface TimelineEvent {
  label: string;
  date: string;
}

export interface Role {
  id: string;
  title: RoleTitle;
  trade: Trade;
  licenseType: LicenseType;
  projectType: ProjectType;
  city: string;
  county: string;
  hiresNeeded: number;
  payMin: number;
  payMax: number;
  perDiem: number;
  startDate: string;
  durationMonths: number;
  overtimeExpected: boolean;
  overtimeHours: number;
  travelRadius: TravelRadius;
  requirements: Requirement[];
  urgency: Urgency;
  status: RoleStatus;
  openedDate: string;
  feePercent: number;
}

export interface Candidate {
  id: string;
  roleId: string;
  firstName: string;
  lastInitial: string;
  licenseType: LicenseType;
  licenseNumber: string;
  licenseExpires: string;
  licensedSince: number;
  city: string;
  county: string;
  distanceMiles: number;
  willingToTravel: boolean;
  employerType: string;
  matchScore: number;
  stage: CandidateState;
  peakStage: Stage;
  contactedDate?: string;
  repliedDate?: string;
  replyMessage?: string;
  availabilityDate?: string;
  preferredPay?: number;
  phone: string;
  email: string;
  verifiedDate: string;
  reviewed: boolean;
  contactRevealed: boolean;
  notes: string;
  notAFitReason?: string;
  timeline: TimelineEvent[];
}

export type HireStatus = "Pending start" | "Invoice sent" | "Paid";
export type PaymentPlan = "full" | "installments";

export interface Hire {
  id: string;
  candidateId: string;
  name: string;
  roleId: string;
  roleTitle: string;
  city: string;
  startDate: string;
  hourlyRate: number;
  firstYearPay: number;
  feePercent: number;
  feeAmount: number;
  status: HireStatus;
  guaranteeEndDate: string;
  paymentPlan: PaymentPlan;
  invoiceNumber: string;
}

export interface OutreachEmail {
  step: string;
  whenLabel: string;
  subject: string;
  body: string;
}

export interface Campaign {
  roleId: string;
  emails: OutreachEmail[];
  bounced: number;
  unsubscribed: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Hiring manager" | "Viewer";
  phone: string;
}

export interface Company {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  defaultPerDiem: number;
  defaultFeePercent: number;
  logoInitials: string;
}
