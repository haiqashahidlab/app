export type UniversitySector = 'Public' | 'Private' | 'Semi-Government';

export type ProgramField =
  | 'Computing & IT'
  | 'Engineering'
  | 'Medical & Health'
  | 'Business & Management'
  | 'Law & Humanities'
  | 'Natural Sciences';

export type NavigationTab = 'finder' | 'compare' | 'exams' | 'shortlist' | 'blogs' | 'admin';

export type FeeBudgetPreference =
  | 'Any'
  | 'below_50k'
  | 'below_100k'
  | 'below_150k'
  | 'above_150k';

export interface ProgramOffering {
  id: string;
  name: string;
  degreeType: 'BS' | 'BE' | 'BBA' | 'MBBS' | 'BDS' | 'LLB' | 'Pharm-D';
  field: ProgramField;
  durationYears: number;
  perSemesterFeePKR: number;
  totalEstimatedCostPKR: number;
  closingMeritLastYear: number; // e.g. 79.5
  entryTestRequired: string;
  formulaDescription: string;
  formulaId: string; // e.g. 'ned', 'nust', 'fast', etc.
  accreditation: string; // e.g., 'NCEAC W-Category', 'PEC Level-II (Washington Accord)'
  keyFeatures: string[];
  testSubjects: string; // e.g. "Maths (60), Physics (30), English (10)"
  preMedAllowed?: boolean; // If true or auto-calculated, Pre-Med can join via HEC deficiency math policy
  eligibilityDetail?: string; // e.g., "HEC Policy: Pre-Med eligible with 6-CH Deficiency Math in 1st year"
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  province: 'Islamabad Capital' | 'Punjab' | 'Sindh' | 'Khyber Pakhtunkhwa' | 'Balochistan';
  sector: UniversitySector;
  hecRanking: string;
  establishedYear: number;
  officialWebsite: string;
  admissionsUrl: string;
  feeStructureUrl: string;
  hostelsAvailable: boolean;
  transportAvailable: boolean;
  scholarships: string[];
  programs: ProgramOffering[];
  badgeColor: string;
  summary: string;
  // Authentically scraped official admission document requirements for this specific university
  documentsRequired: string[];
  admissionHelpline?: string;
  isPrivatePartner?: boolean; // Eligible for direct student lead generation
}

export interface EntranceExam {
  id: string;
  name: string;
  universityOrBody: string;
  series: string;
  registrationStartDate: string;
  registrationEndDate: string;
  examDate: string;
  resultDate: string;
  testFeePKR: number;
  eligibilityCriteria: string;
  testPattern: {
    subjects: string;
    totalMarks: number;
    durationMinutes: number;
    negativeMarking: boolean;
  };
  officialPortalUrl: string;
  status: 'Registration Open' | 'Upcoming' | 'Closed' | 'Result Announced';
  reminderSet?: boolean;
}

export type EducationSystem = 'fsc' | 'alevels';

export type IntermediateStream =
  | 'pre_medical'
  | 'pre_engineering'
  | 'ics'
  | 'general_science'
  | 'icom'
  | 'fa_humanities'
  | 'other';

export interface StudentProfile {
  educationSystem?: EducationSystem;
  intermediateStream?: IntermediateStream;
  alevelSubjects?: string[];
  hasAdditionalMath?: boolean; // If Pre-Med student has taken / taking Additional Math
  matricPercentage: number;
  fscPercentage: number;
  entryTestScore?: number | null; // Optional exploration!
  entryTestMax?: number;
  entryTestType?: string;
  calculatedAggregate?: number;
  preferredCity: string;
  preferredProgram: string;
  sectorPreference: 'All' | 'Public' | 'Private';
  budgetPreference: FeeBudgetPreference;
}

export type ApplicationStage =
  | 'Considering'
  | 'Form Incomplete'
  | 'Challan Paid'
  | 'Admit Card Issued'
  | 'Exam Done'
  | 'Merit Awaited'
  | 'Selected / Admitted';

export interface ShortlistItem {
  id: string;
  universityId: string;
  programId: string;
  addedAt: string;
  notes: string;
  stage: ApplicationStage;
  reminderDate?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'deadline' | 'exam' | 'merit' | 'alert' | 'info';
  priority: 'high' | 'medium' | 'low';
  link?: string;
  read: boolean;
}

export interface FormulaConfig {
  id: string;
  name: string;
  matricWeight: number;
  fscWeight: number;
  testWeight: number;
  testName: string;
  testMaxMarks: number;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: 'Admission Strategy' | 'Merit & Tests' | 'University Comparison' | 'Scholarships' | 'Sponsored';
  excerpt: string;
  content: string;
  sponsored?: boolean;
  sponsorName?: string;
}

export interface StudentUser {
  id: string;
  name: string;
  contact: string; // WhatsApp number or email
  provider: 'google' | 'whatsapp' | 'guest';
  isPro: boolean;
  tier: 'Free' | 'EarlyBird900' | 'Tier1000' | 'Standard1500';
  registeredAt: string;
}

export interface UniversityLead {
  id: string;
  studentName: string;
  studentContact: string;
  studentCity: string;
  universityId: string;
  universityName: string;
  programId?: string;
  programName: string;
  matricPct: number;
  fscPct: number;
  userAggregate?: number;
  createdDate: string;
  status: 'Fresh Lead' | 'Forwarded to Admissions' | 'Connected';
  intentType?: 'Interested' | 'Prospectus Request';
  source?: string;
}

export type UniversityEventType =
  | 'application_deadline'
  | 'entrance_exam'
  | 'scholarship'
  | 'open_house';

export interface UniversityEvent {
  id: string;
  universityId: string;
  universityName: string;
  universityShortName: string;
  city: string;
  province?: string;
  title: string;
  type: UniversityEventType;
  date: string; // Key date / deadline (YYYY-MM-DD)
  startDate?: string;
  endDate?: string;
  time?: string;
  mode: 'Online' | 'On-Campus' | 'Hybrid';
  venueOrLink: string;
  relevantFields: ProgramField[];
  description: string;
  eligibilityOrRequirement?: string;
  scholarshipCoverage?: string;
  feePKR?: number;
  officialPortalUrl: string;
  status: 'Open / Active' | 'Closing Soon' | 'Upcoming' | 'Closed';
  isVerified: boolean;
  reminderSet?: boolean;
}

export interface EmailAlertSubscription {
  email: string;
  whatsapp?: string;
  frequency: 'immediate_48h' | '3_days_before' | 'weekly_digest';
  selectedEventTypes: UniversityEventType[];
  preferredCities: string[];
  subscribedAt: string;
  active: boolean;
}
