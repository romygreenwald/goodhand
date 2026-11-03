import {
  type Campaign,
  type Candidate,
  type CandidateState,
  type Company,
  type Hire,
  type LicenseType,
  type Role,
  type Stage,
  type TeamMember,
  LICENSE_SHORT,
  STAGES,
} from "./types";
import { firstYearPay, fmtDate, isoDaysAgo, parseDate, toIso } from "@/lib/format";

/* -------------------------------------------------------------------------- */
/*  Company, team                                                             */
/* -------------------------------------------------------------------------- */

export const COMPANY: Company = {
  name: "Lone Star Mission Critical Electric",
  address: "7311 Jack Newell Blvd North",
  city: "Fort Worth",
  state: "TX",
  zip: "76118",
  defaultPerDiem: 110,
  defaultFeePercent: 18,
  logoInitials: "LS",
};

export const GOODHAND_MAILING_ADDRESS = "1420 Sawyer Street, Suite 210, Houston, TX 77007";
export const GOODHAND_LEGAL_NAME = "GoodHand Talent LLC";

export const TEAM: TeamMember[] = [
  {
    id: "tm-1",
    name: "Ray Alvarado",
    email: "ray@lonestarmce.example",
    role: "Owner",
    phone: "(817) 555-0119",
  },
  {
    id: "tm-2",
    name: "Dana Whitfield",
    email: "dana@lonestarmce.example",
    role: "Hiring manager",
    phone: "(817) 555-0132",
  },
  {
    id: "tm-3",
    name: "Marco Esquivel",
    email: "marco@lonestarmce.example",
    role: "Hiring manager",
    phone: "(254) 555-0188",
  },
  {
    id: "tm-4",
    name: "Jess Tran",
    email: "jess@lonestarmce.example",
    role: "Viewer",
    phone: "(817) 555-0144",
  },
];

/* -------------------------------------------------------------------------- */
/*  Roles                                                                     */
/* -------------------------------------------------------------------------- */

export const ROLES: Role[] = [
  {
    id: "role-1",
    title: "Journeyman wireman",
    trade: "Electrician",
    licenseType: "Journeyman",
    projectType: "Data center",
    city: "Abilene",
    county: "Taylor",
    hiresNeeded: 6,
    payMin: 36,
    payMax: 40,
    perDiem: 110,
    startDate: "2026-12-01",
    durationMonths: 14,
    overtimeExpected: true,
    overtimeHours: 55,
    travelRadius: "Anywhere in Texas",
    requirements: ["OSHA 10", "NFPA 70E", "Valid driver's license", "Drug test"],
    urgency: "Urgent",
    status: "Active",
    openedDate: isoDaysAgo(12),
    feePercent: 18,
  },
  {
    id: "role-2",
    title: "Foreman",
    trade: "Electrician",
    licenseType: "Journeyman",
    projectType: "Data center",
    city: "Temple",
    county: "Bell",
    hiresNeeded: 2,
    payMin: 42,
    payMax: 46,
    perDiem: 125,
    startDate: "2026-11-17",
    durationMonths: 18,
    overtimeExpected: true,
    overtimeHours: 50,
    travelRadius: "Anywhere in Texas",
    requirements: [
      "OSHA 30",
      "NFPA 70E",
      "Valid driver's license",
      "Drug test",
      "Background check",
    ],
    urgency: "Critical",
    status: "Sourcing",
    openedDate: isoDaysAgo(4),
    feePercent: 20,
  },
  {
    id: "role-3",
    title: "Medium voltage specialist",
    trade: "Electrician",
    licenseType: "Journeyman Industrial",
    projectType: "Data center",
    city: "Fort Worth",
    county: "Tarrant",
    hiresNeeded: 3,
    payMin: 40,
    payMax: 45,
    perDiem: 95,
    startDate: "2027-01-05",
    durationMonths: 12,
    overtimeExpected: true,
    overtimeHours: 50,
    travelRadius: "Within 150 miles",
    requirements: ["OSHA 10", "OSHA 30", "NFPA 70E", "Valid driver's license", "Drug test"],
    urgency: "Standard",
    status: "Active",
    openedDate: isoDaysAgo(21),
    feePercent: 18,
  },
  {
    id: "role-4",
    title: "Journeyman wireman",
    trade: "Electrician",
    licenseType: "Journeyman",
    projectType: "Data center",
    city: "San Antonio",
    county: "Bexar",
    hiresNeeded: 4,
    payMin: 32,
    payMax: 36,
    perDiem: 75,
    startDate: "2026-12-15",
    durationMonths: 9,
    overtimeExpected: true,
    overtimeHours: 45,
    travelRadius: "Within 50 miles",
    requirements: ["OSHA 10", "Valid driver's license"],
    urgency: "Standard",
    status: "Active",
    openedDate: isoDaysAgo(6),
    feePercent: 15,
  },
  {
    id: "role-5",
    title: "Journeyman wireman",
    trade: "Electrician",
    licenseType: "Journeyman",
    projectType: "Data center",
    city: "Temple",
    county: "Bell",
    hiresNeeded: 1,
    payMin: 38,
    payMax: 42,
    perDiem: 120,
    startDate: "2026-08-24",
    durationMonths: 16,
    overtimeExpected: true,
    overtimeHours: 50,
    travelRadius: "Within 150 miles",
    requirements: ["OSHA 10", "NFPA 70E", "Valid driver's license"],
    urgency: "Urgent",
    status: "Filled",
    openedDate: isoDaysAgo(96),
    feePercent: 17,
  },
  {
    id: "role-6",
    title: "Commissioning technician",
    trade: "Electrician",
    licenseType: "Master",
    projectType: "Data center",
    city: "San Antonio",
    county: "Bexar",
    hiresNeeded: 2,
    payMin: 44,
    payMax: 50,
    perDiem: 100,
    startDate: "2027-02-01",
    durationMonths: 10,
    overtimeExpected: false,
    overtimeHours: 0,
    travelRadius: "Anywhere in Texas",
    requirements: ["OSHA 30", "NFPA 70E", "Valid driver's license", "Background check"],
    urgency: "Standard",
    status: "Paused",
    openedDate: isoDaysAgo(31),
    feePercent: 18,
  },
];

/* -------------------------------------------------------------------------- */
/*  Candidates                                                                */
/* -------------------------------------------------------------------------- */

interface Row {
  role: string;
  first: string;
  last: string;
  lic: LicenseType;
  since: number;
  city: string;
  county: string;
  mi: number;
  travel: boolean;
  emp: string;
  score: number;
  stage: CandidateState;
  peak?: Stage;
  area: string;
  contacted?: number;
  replied?: number;
  reply?: string;
  avail?: string;
  pay?: number;
  reason?: string;
  reviewed?: boolean;
}

const ROWS: Row[] = [
  // Abilene, journeyman wireman (role-1)
  { role: "role-1", first: "Dustin", last: "R", lic: "Journeyman", since: 2014, city: "Lubbock", county: "Lubbock", mi: 168, travel: true, emp: "commercial contractor", score: 92, stage: "started", area: "806", contacted: 26, replied: 24, reply: "Yeah I'm interested. I'm in Lubbock but can travel for per diem. Done with my current job mid November.", avail: "2026-11-01", pay: 36 },
  { role: "role-1", first: "Cody", last: "B", lic: "Journeyman", since: 2011, city: "Abilene", county: "Taylor", mi: 6, travel: true, emp: "industrial contractor", score: 95, stage: "hired", area: "325", contacted: 22, replied: 21, reply: "Yes sir. I can start Dec 1. Just need to give two weeks.", avail: "2026-12-01", pay: 38 },
  { role: "role-1", first: "Travis", last: "L", lic: "Journeyman", since: 2016, city: "Sweetwater", county: "Nolan", mi: 41, travel: true, emp: "data center contractor", score: 89, stage: "interviewing", area: "325", contacted: 14, replied: 12, reply: "What's the schedule look like? I can do 6 tens no problem.", avail: "2026-11-23", pay: 37 },
  { role: "role-1", first: "Jaime", last: "O", lic: "Journeyman", since: 2009, city: "Odessa", county: "Ector", mi: 150, travel: true, emp: "oil and gas contractor", score: 86, stage: "introduced", area: "432", contacted: 11, replied: 9, reply: "Interested. Is the per diem paid weekly or at the end?", avail: "2026-12-01", pay: 38 },
  { role: "role-1", first: "Brandon", last: "K", lic: "Journeyman", since: 2018, city: "Big Spring", county: "Howard", mi: 108, travel: true, emp: "commercial contractor", score: 81, stage: "introduced", area: "432", contacted: 10, replied: 8, reply: "I pull a camper so travel is easy for me. Count me in.", avail: "2026-11-30", pay: 36 },
  { role: "role-1", first: "Wyatt", last: "S", lic: "Journeyman", since: 2013, city: "Brownwood", county: "Brown", mi: 93, travel: true, emp: "industrial contractor", score: 88, stage: "interested", area: "325", contacted: 5, replied: 3, reply: "Yes. Been wanting to get on a data center job.", avail: "2026-12-07", pay: 37, reviewed: false },
  { role: "role-1", first: "Luis", last: "M", lic: "Journeyman", since: 2015, city: "Clyde", county: "Callahan", mi: 22, travel: false, emp: "commercial contractor", score: 84, stage: "interested", area: "325", contacted: 4, replied: 2, reply: "Sounds good. I live about 40 minutes out. When do you need me?", avail: "2026-11-16", pay: 36, reviewed: false },
  { role: "role-1", first: "Dalton", last: "P", lic: "Journeyman", since: 2019, city: "Anson", county: "Jones", mi: 24, travel: true, emp: "residential contractor", score: 76, stage: "interested", area: "325", contacted: 4, replied: 2, reply: "I'm interested but I need $38 to make the move worth it.", avail: "2026-12-01", pay: 38, reviewed: false },
  { role: "role-1", first: "Keisha", last: "W", lic: "Journeyman", since: 2012, city: "San Angelo", county: "Tom Green", mi: 90, travel: true, emp: "manufacturing plant", score: 83, stage: "replied", area: "325", contacted: 3, replied: 1, reply: "Tell me more about the length of the job. Not looking for 2 months of work." },
  { role: "role-1", first: "Hector", last: "V", lic: "Journeyman", since: 2017, city: "Albany", county: "Shackelford", mi: 36, travel: true, emp: "utility contractor", score: 79, stage: "emailed", area: "325", contacted: 2 },
  { role: "role-1", first: "Randy", last: "C", lic: "Journeyman", since: 2008, city: "Cisco", county: "Eastland", mi: 58, travel: false, emp: "self employed electrician", score: 74, stage: "emailed", area: "254", contacted: 2 },
  { role: "role-1", first: "Trevor", last: "N", lic: "Journeyman", since: 2020, city: "Abilene", county: "Taylor", mi: 4, travel: true, emp: "commercial contractor", score: 72, stage: "matched", area: "325" },
  { role: "role-1", first: "Shane", last: "D", lic: "Journeyman", since: 2010, city: "Stamford", county: "Jones", mi: 41, travel: true, emp: "industrial contractor", score: 77, stage: "matched", area: "325" },
  { role: "role-1", first: "Ernesto", last: "G", lic: "Journeyman", since: 2021, city: "Coleman", county: "Coleman", mi: 52, travel: false, emp: "residential contractor", score: 68, stage: "matched", area: "325" },
  { role: "role-1", first: "Colton", last: "H", lic: "Journeyman", since: 2015, city: "Midland", county: "Midland", mi: 172, travel: false, emp: "oil and gas contractor", score: 80, stage: "not_a_fit", peak: "interested", area: "432", contacted: 9, replied: 7, reply: "I'd look at it but I'm not leaving the Permian.", avail: "2026-12-01", pay: 42, reason: "Too far from the job site" },

  // Temple, foreman (role-2)
  { role: "role-2", first: "Mariana", last: "S", lic: "Journeyman", since: 2007, city: "Killeen", county: "Bell", mi: 23, travel: true, emp: "data center contractor", score: 94, stage: "interested", area: "254", contacted: 3, replied: 1, reply: "Already on a data center in Temple but I'd move for better pay.", avail: "2026-11-30", pay: 46, reviewed: false },
  { role: "role-2", first: "Dewayne", last: "F", lic: "Journeyman", since: 2005, city: "Waco", county: "McLennan", mi: 36, travel: true, emp: "industrial contractor", score: 90, stage: "interested", area: "254", contacted: 3, replied: 2, reply: "Yep count me in. I've got my 70E card already.", avail: "2026-11-17", pay: 45, reviewed: false },
  { role: "role-2", first: "Kyle", last: "A", lic: "Journeyman", since: 2009, city: "Georgetown", county: "Williamson", mi: 45, travel: true, emp: "commercial contractor", score: 85, stage: "introduced", area: "512", contacted: 4, replied: 3, reply: "Interested. Been running crews for 8 years.", avail: "2026-12-01", pay: 44 },
  { role: "role-2", first: "Rogelio", last: "Q", lic: "Journeyman", since: 2011, city: "Temple", county: "Bell", mi: 3, travel: true, emp: "commercial contractor", score: 82, stage: "emailed", area: "254", contacted: 2 },
  { role: "role-2", first: "Jared", last: "E", lic: "Journeyman", since: 2013, city: "Belton", county: "Bell", mi: 9, travel: false, emp: "manufacturing plant", score: 78, stage: "matched", area: "254" },
  { role: "role-2", first: "Tyrell", last: "B", lic: "Journeyman", since: 2016, city: "Cameron", county: "Milam", mi: 31, travel: true, emp: "utility contractor", score: 75, stage: "matched", area: "254" },

  // Fort Worth, medium voltage (role-3)
  { role: "role-3", first: "Austin", last: "M", lic: "Journeyman Industrial", since: 2010, city: "Fort Worth", county: "Tarrant", mi: 11, travel: true, emp: "utility contractor", score: 96, stage: "interviewing", area: "817", contacted: 17, replied: 15, reply: "I'm in. Been doing MV terminations for 6 years.", avail: "2026-12-28", pay: 45 },
  { role: "role-3", first: "Blake", last: "W", lic: "Journeyman Industrial", since: 2012, city: "Weatherford", county: "Parker", mi: 32, travel: true, emp: "industrial contractor", score: 91, stage: "introduced", area: "817", contacted: 16, replied: 14, reply: "Sure. Do y'all cover mileage for the first trip out?", avail: "2027-01-05", pay: 44 },
  { role: "role-3", first: "Rosa", last: "T", lic: "Journeyman Industrial", since: 2014, city: "Denton", county: "Denton", mi: 41, travel: true, emp: "data center contractor", score: 88, stage: "interested", area: "940", contacted: 6, replied: 4, reply: "Yes. I've done switchgear and 15kV terminations.", avail: "2027-01-05", pay: 43, reviewed: false },
  { role: "role-3", first: "Dominic", last: "J", lic: "Journeyman Industrial", since: 2009, city: "Cleburne", county: "Johnson", mi: 29, travel: false, emp: "commercial contractor", score: 84, stage: "interested", area: "817", contacted: 6, replied: 5, reply: "Interested. My license is good through next year.", avail: "2026-12-15", pay: 42, reviewed: false },
  { role: "role-3", first: "Levi", last: "C", lic: "Journeyman Industrial", since: 2017, city: "Decatur", county: "Wise", mi: 38, travel: true, emp: "utility contractor", score: 80, stage: "replied", area: "940", contacted: 5, replied: 3, reply: "I'd take it if there's OT. Call me after 4, I'm in the field till then." },
  { role: "role-3", first: "Omar", last: "Z", lic: "Journeyman Industrial", since: 2015, city: "Granbury", county: "Hood", mi: 44, travel: true, emp: "manufacturing plant", score: 79, stage: "emailed", area: "817", contacted: 3 },
  { role: "role-3", first: "Chase", last: "B", lic: "Journeyman Industrial", since: 2019, city: "Arlington", county: "Tarrant", mi: 18, travel: true, emp: "commercial contractor", score: 76, stage: "emailed", area: "682", contacted: 3 },
  { role: "role-3", first: "Garrett", last: "L", lic: "Journeyman Industrial", since: 2013, city: "Mineral Wells", county: "Palo Pinto", mi: 55, travel: false, emp: "industrial contractor", score: 73, stage: "matched", area: "940" },
  { role: "role-3", first: "Tanner", last: "K", lic: "Journeyman Industrial", since: 2021, city: "Waxahachie", county: "Ellis", mi: 48, travel: true, emp: "residential contractor", score: 69, stage: "matched", area: "972" },

  // San Antonio, journeyman wireman (role-4), no interest yet
  { role: "role-4", first: "Isaiah", last: "P", lic: "Journeyman", since: 2016, city: "San Antonio", county: "Bexar", mi: 8, travel: true, emp: "commercial contractor", score: 87, stage: "replied", area: "210", contacted: 4, replied: 2, reply: "What's the schedule? I can't do nights right now." },
  { role: "role-4", first: "Clay", last: "M", lic: "Journeyman", since: 2011, city: "New Braunfels", county: "Comal", mi: 32, travel: true, emp: "industrial contractor", score: 83, stage: "emailed", area: "830", contacted: 4 },
  { role: "role-4", first: "Vernon", last: "D", lic: "Journeyman", since: 2008, city: "Seguin", county: "Guadalupe", mi: 37, travel: false, emp: "self employed electrician", score: 80, stage: "emailed", area: "830", contacted: 4 },
  { role: "role-4", first: "Alicia", last: "R", lic: "Journeyman", since: 2018, city: "Castroville", county: "Medina", mi: 25, travel: true, emp: "residential contractor", score: 77, stage: "emailed", area: "830", contacted: 3 },
  { role: "role-4", first: "Bryce", last: "T", lic: "Journeyman", since: 2014, city: "Boerne", county: "Kendall", mi: 33, travel: true, emp: "commercial contractor", score: 75, stage: "matched", area: "830" },
  { role: "role-4", first: "Felix", last: "A", lic: "Journeyman", since: 2020, city: "Pleasanton", county: "Atascosa", mi: 35, travel: false, emp: "oil and gas contractor", score: 71, stage: "matched", area: "830" },
  { role: "role-4", first: "Nathan", last: "S", lic: "Journeyman", since: 2012, city: "Floresville", county: "Wilson", mi: 30, travel: true, emp: "utility contractor", score: 74, stage: "matched", area: "830" },

  // Temple, filled role (role-5)
  { role: "role-5", first: "Marcus", last: "T", lic: "Journeyman", since: 2006, city: "Temple", county: "Bell", mi: 5, travel: true, emp: "industrial contractor", score: 97, stage: "started", area: "254", contacted: 94, replied: 92, reply: "Ready to go. I've worked Bell County my whole career.", avail: "2026-08-24", pay: 38 },
  { role: "role-5", first: "Sergio", last: "L", lic: "Journeyman", since: 2015, city: "Waco", county: "McLennan", mi: 35, travel: true, emp: "commercial contractor", score: 86, stage: "not_a_fit", peak: "interested", area: "254", contacted: 93, replied: 90, reply: "Yes I'm interested if the job is still open.", avail: "2026-09-15", pay: 40, reason: "We already filled this role" },
  { role: "role-5", first: "Darnell", last: "H", lic: "Journeyman", since: 2013, city: "Round Rock", county: "Williamson", mi: 48, travel: true, emp: "data center contractor", score: 84, stage: "not_a_fit", peak: "replied", area: "512", contacted: 93, replied: 91, reply: "Can't get loose until February.", reason: "Not available when we need them" },

  // San Antonio, paused role (role-6)
  { role: "role-6", first: "Weston", last: "F", lic: "Master", since: 2004, city: "San Antonio", county: "Bexar", mi: 7, travel: true, emp: "data center contractor", score: 93, stage: "matched", area: "210" },
  { role: "role-6", first: "Priscilla", last: "V", lic: "Master", since: 2008, city: "Schertz", county: "Guadalupe", mi: 19, travel: true, emp: "commercial contractor", score: 89, stage: "matched", area: "210" },
];

const LIC_CODE: Record<LicenseType, string> = {
  Apprentice: "AP",
  Journeyman: "JM",
  "Journeyman Industrial": "JI",
  "Residential Wireman": "RW",
  Master: "ME",
};

function buildTimeline(row: Row, roleOpened: string): { label: string; date: string }[] {
  const events: { label: string; date: string }[] = [];
  const matchedDays = row.contacted != null ? row.contacted + 1 : 1;
  events.push({
    label: "Matched from Texas license records",
    date: row.contacted != null ? isoDaysAgo(matchedDays) : roleOpened,
  });
  if (row.contacted != null) {
    events.push({ label: "Job offer emailed", date: isoDaysAgo(row.contacted) });
  }
  if (row.replied != null) {
    events.push({ label: "Replied to the offer", date: isoDaysAgo(row.replied) });
  }
  const reached = row.stage === "not_a_fit" ? (row.peak ?? "replied") : row.stage;
  const idx = STAGES.indexOf(reached as Stage);
  const base = row.replied ?? 0;
  if (idx >= STAGES.indexOf("interested")) {
    events.push({ label: "Marked interested", date: isoDaysAgo(Math.max(base - 1, 0)) });
  }
  if (idx >= STAGES.indexOf("introduced")) {
    events.push({ label: "Introduced to you", date: isoDaysAgo(Math.max(base - 2, 0)) });
  }
  if (idx >= STAGES.indexOf("interviewing")) {
    events.push({ label: "Moved to interviewing", date: isoDaysAgo(Math.max(base - 4, 0)) });
  }
  if (idx >= STAGES.indexOf("hired")) {
    events.push({ label: "Marked hired", date: isoDaysAgo(Math.max(base - 6, 0)) });
  }
  if (reached === "started" && row.avail) {
    events.push({ label: "Started work", date: row.avail });
  }
  if (row.stage === "not_a_fit") {
    events.push({
      label: `Not a fit: ${row.reason ?? "no reason given"}`,
      date: isoDaysAgo(Math.max(base - 2, 0)),
    });
  }
  return events;
}

export const CANDIDATES: Candidate[] = ROWS.map((row, i) => {
  const role = ROLES.find((r) => r.id === row.role)!;
  const seq = 300000 + i * 2137;
  const expYear = 2027 + (i % 2);
  const expMonth = ((i * 5) % 12) + 1;
  const reached = (row.stage === "not_a_fit" ? (row.peak ?? "replied") : row.stage) as Stage;
  const introducedPlus = STAGES.indexOf(reached) >= STAGES.indexOf("introduced");
  return {
    id: `cand-${i + 1}`,
    roleId: row.role,
    firstName: row.first,
    lastInitial: row.last,
    licenseType: row.lic,
    licenseNumber: `TX-${LIC_CODE[row.lic]}-${seq}`,
    licenseExpires: `${expYear}-${String(expMonth).padStart(2, "0")}-28`,
    licensedSince: row.since,
    city: row.city,
    county: row.county,
    distanceMiles: row.mi,
    willingToTravel: row.travel,
    employerType: row.emp,
    matchScore: row.score,
    stage: row.stage,
    peakStage: reached,
    contactedDate: row.contacted != null ? isoDaysAgo(row.contacted) : undefined,
    repliedDate: row.replied != null ? isoDaysAgo(row.replied) : undefined,
    replyMessage: row.reply,
    availabilityDate: row.avail,
    preferredPay: row.pay,
    phone: `(${row.area}) 555-0${String(100 + i).slice(-3)}`,
    email: `${row.first.toLowerCase()}.${row.last.toLowerCase()}${20 + i}@example.com`,
    verifiedDate: isoDaysAgo(3 + (i % 21)),
    reviewed: row.reviewed ?? true,
    contactRevealed: introducedPlus,
    notes: "",
    notAFitReason: row.reason,
    timeline: buildTimeline(row, role.openedDate),
  };
});

/* -------------------------------------------------------------------------- */
/*  Hires and billing                                                        */
/* -------------------------------------------------------------------------- */

function guaranteeEnd(startDate: string): string {
  const d = parseDate(startDate);
  d.setDate(d.getDate() + 90);
  return toIso(d);
}

function hire(
  candidateId: string,
  roleId: string,
  startDate: string,
  hourlyRate: number,
  feePercent: number,
  status: Hire["status"],
  invoiceNumber: string,
  paymentPlan: Hire["paymentPlan"] = "full",
): Hire {
  const cand = CANDIDATES.find((c) => c.id === candidateId)!;
  const role = ROLES.find((r) => r.id === roleId)!;
  const base = firstYearPay(hourlyRate);
  return {
    id: `hire-${candidateId}`,
    candidateId,
    name: `${cand.firstName} ${cand.lastInitial}.`,
    roleId,
    roleTitle: role.title,
    city: role.city,
    startDate,
    hourlyRate,
    firstYearPay: base,
    feePercent,
    feeAmount: Math.round((base * feePercent) / 100),
    status,
    guaranteeEndDate: guaranteeEnd(startDate),
    paymentPlan,
    invoiceNumber,
  };
}

const marcus = CANDIDATES.find((c) => c.firstName === "Marcus")!;
const dustin = CANDIDATES.find((c) => c.firstName === "Dustin")!;
const cody = CANDIDATES.find((c) => c.firstName === "Cody")!;

export const HIRES: Hire[] = [
  hire(marcus.id, "role-5", "2026-08-24", 38, 17, "Paid", "GH-1041"),
  hire(dustin.id, "role-1", "2026-11-01", 36, 18, "Invoice sent", "GH-1088", "installments"),
  hire(cody.id, "role-1", "2026-12-01", 38, 18, "Pending start", "GH-1094"),
];

/* -------------------------------------------------------------------------- */
/*  Outreach                                                                  */
/* -------------------------------------------------------------------------- */

export function requirementSentence(role: Role): string {
  const lic = `an active Texas ${role.licenseType.toLowerCase()} license`;
  const cards = role.requirements.filter((r) => r !== "Drug test" && r !== "Background check");
  const list = [lic, ...cards.map((c) => c.toLowerCase())];
  if (list.length === 1) return `You need ${list[0]}.`;
  return `You need ${list.slice(0, -1).join(", ")} and ${list[list.length - 1]}.`;
}

export function buildEmails(role: Role, company: Company = COMPANY) {
  const pay = `$${role.payMin} to $${role.payMax} an hour`;
  const start = fmtDate(role.startDate);
  const sched = role.overtimeExpected
    ? `about ${role.overtimeHours} hours a week, overtime after 40`
    : "40 hours a week";
  return [
    {
      step: "First email",
      whenLabel: "Sent right away",
      subject: `${role.title} work in ${role.city}, ${pay} plus $${role.perDiem} per diem`,
      body: [
        "Hi {{first name}},",
        "",
        `We have ${role.title.toLowerCase()} work on a ${role.projectType.toLowerCase()} in ${role.city}, Texas, for ${company.name}.`,
        "",
        `Pay: ${pay}, based on experience`,
        `Per diem: $${role.perDiem} a day`,
        `Start: ${start}`,
        `Schedule: ${sched}`,
        `Length: about ${role.durationMonths} months`,
        "",
        requirementSentence(role),
        "",
        "Reply YES and we'll connect you with the hiring manager.",
      ].join("\n"),
    },
    {
      step: "Follow up",
      whenLabel: "Sent 3 days later",
      subject: `Still hiring in ${role.city}, ${pay} plus per diem`,
      body: [
        "Hi {{first name}},",
        "",
        `Checking back on the ${role.title.toLowerCase()} job in ${role.city}. Still ${pay} plus $${role.perDiem} a day per diem, starting ${start}.`,
        "",
        "Seats are filling up. Reply YES and we'll connect you with the hiring manager.",
      ].join("\n"),
    },
    {
      step: "Last follow up",
      whenLabel: "Sent 7 days later",
      subject: `Last call on the ${role.city} job`,
      body: [
        "Hi {{first name}},",
        "",
        `Last note from me on the ${role.city} job. ${pay}, $${role.perDiem} a day per diem, about ${role.durationMonths} months of work.`,
        "",
        "If the timing is wrong, no worries at all. Reply YES and we'll connect you with the hiring manager.",
      ].join("\n"),
    },
  ];
}

export function emailFooter(company: Company = COMPANY): string[] {
  return [
    `${GOODHAND_LEGAL_NAME}, sourcing for ${company.name}`,
    GOODHAND_MAILING_ADDRESS,
    "You got this because you hold an active Texas electrical license. Unsubscribe and we will not email you again.",
  ];
}

const CAMPAIGN_NOISE: Record<string, { bounced: number; unsubscribed: number }> = {
  "role-1": { bounced: 2, unsubscribed: 1 },
  "role-2": { bounced: 0, unsubscribed: 0 },
  "role-3": { bounced: 1, unsubscribed: 2 },
  "role-4": { bounced: 1, unsubscribed: 0 },
  "role-5": { bounced: 0, unsubscribed: 1 },
  "role-6": { bounced: 0, unsubscribed: 0 },
};

export const CAMPAIGNS: Campaign[] = ROLES.map((role) => ({
  roleId: role.id,
  emails: buildEmails(role),
  bounced: CAMPAIGN_NOISE[role.id]?.bounced ?? 0,
  unsubscribed: CAMPAIGN_NOISE[role.id]?.unsubscribed ?? 0,
}));

export { LICENSE_SHORT };
