import { ProgramOffering, University, StudentProfile, IntermediateStream, EducationSystem } from '../types';

export interface EligibilityResult {
  isEligible: boolean;
  status: 'fully_eligible' | 'pre_med_conditional' | 'additional_math_required' | 'ineligible';
  badgeLabel: string;
  badgeColor: string; // Tailwind class
  badgeBorder: string;
  badgeBg: string;
  badgeTextColor: string;
  reason: string;
  policyNote?: string;
  actionAdvice?: string;
}

export const STREAM_LABELS: Record<IntermediateStream, string> = {
  pre_medical: 'FSc Pre-Medical (Biology, Chem, Physics)',
  pre_engineering: 'FSc Pre-Engineering (Math, Chem, Physics)',
  ics: 'ICS (Computer Science, Math, Physics/Stats)',
  general_science: 'FSc General Science (Math, Stats, Econ)',
  icom: 'I.Com (Commerce & Accounting)',
  fa_humanities: 'FA / Humanities & Arts',
  other: 'Other Intermediate Stream'
};

export const COMMON_ALEVEL_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Further Mathematics',
  'Economics',
  'Business',
  'Accounting',
  'Law'
];

/**
 * Checks a student's eligibility for a given program and university based on their academic stream.
 */
export function checkProgramEligibility(
  program: ProgramOffering,
  university: University,
  profile: StudentProfile | null
): EligibilityResult {
  // Default if profile not provided yet
  if (!profile) {
    return {
      isEligible: true,
      status: 'fully_eligible',
      badgeLabel: 'Check Background',
      badgeColor: 'text-slate-600 bg-slate-100 border-slate-200',
      badgeBorder: 'border-slate-200',
      badgeBg: 'bg-slate-100',
      badgeTextColor: 'text-slate-700',
      reason: 'Select your intermediate stream or A-Level subjects to see personalized eligibility.'
    };
  }

  const system = profile.educationSystem || 'fsc';
  const stream = profile.intermediateStream || 'pre_medical';
  const hasAddMath = !!profile.hasAdditionalMath;
  const alevelSubs = profile.alevelSubjects || [];

  const isALevels = system === 'alevels';
  const hasALevelMath = alevelSubs.includes('Mathematics') || alevelSubs.includes('Further Mathematics');
  const hasALevelPhysics = alevelSubs.includes('Physics');
  const hasALevelBio = alevelSubs.includes('Biology');
  const hasALevelChem = alevelSubs.includes('Chemistry');
  const hasALevelCS = alevelSubs.includes('Computer Science');

  const field = program.field;
  const degreeType = program.degreeType;
  const isEngineeringDegree = degreeType === 'BE' || (field === 'Engineering' && !program.name.toLowerCase().includes('technology'));
  const isMedicalMBBS_BDS = degreeType === 'MBBS' || degreeType === 'BDS';
  const isComputing = field === 'Computing & IT';
  const isBusiness = field === 'Business & Management' || degreeType === 'BBA';
  const isMedicalOrHealth = field === 'Medical & Health' || degreeType === 'Pharm-D';

  // 1. BUSINESS & MANAGEMENT (BBA, BS Accounting & Finance, BS Fintech)
  if (isBusiness) {
    return {
      isEligible: true,
      status: 'fully_eligible',
      badgeLabel: 'Directly Eligible',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badgeBorder: 'border-emerald-200',
      badgeBg: 'bg-emerald-50',
      badgeTextColor: 'text-emerald-800',
      reason: 'All Intermediate and A-Level streams are eligible for Business & Management degrees.',
      policyNote: 'Minimum 50% in HSSC / A-Level Equivalence required by HEC.'
    };
  }

  // 2. MEDICAL & HEALTH (MBBS, BDS, Pharm-D)
  if (isMedicalMBBS_BDS || isMedicalOrHealth) {
    if (isALevels) {
      if (hasALevelBio && hasALevelChem) {
        return {
          isEligible: true,
          status: 'fully_eligible',
          badgeLabel: 'Directly Eligible (A-Level)',
          badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          badgeBorder: 'border-emerald-200',
          badgeBg: 'bg-emerald-50',
          badgeTextColor: 'text-emerald-800',
          reason: 'Your A-Level subjects (Biology + Chemistry) satisfy PMDC equivalence criteria.',
          policyNote: 'Must obtain IBCC Equivalence Certificate with minimum 65% for MBBS/BDS, and pass MDCAT.'
        };
      }
      return {
        isEligible: false,
        status: 'ineligible',
        badgeLabel: 'Ineligible (PMDC Requires Biology & Chem)',
        badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
        badgeBorder: 'border-rose-200',
        badgeBg: 'bg-rose-50',
        badgeTextColor: 'text-rose-800',
        reason: 'Pakistan Medical and Dental Council (PMDC) strictly mandates Biology and Chemistry in A-Levels.',
        actionAdvice: 'Consider Computing, Business, or Natural Sciences instead.'
      };
    }

    // FSc
    if (stream === 'pre_medical') {
      return {
        isEligible: true,
        status: 'fully_eligible',
        badgeLabel: 'Directly Eligible (PMDC / HEC)',
        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badgeBorder: 'border-emerald-200',
        badgeBg: 'bg-emerald-50',
        badgeTextColor: 'text-emerald-800',
        reason: 'FSc Pre-Medical is the required foundational qualification for Medical & Health Sciences.',
        policyNote: 'Requires passing the national MDCAT with minimum 55% for MBBS, 50% for BDS.'
      };
    }

    return {
      isEligible: false,
      status: 'ineligible',
      badgeLabel: 'Ineligible (Requires Pre-Medical)',
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
      badgeBorder: 'border-rose-200',
      badgeBg: 'bg-rose-50',
      badgeTextColor: 'text-rose-800',
      reason: `Students with ${STREAM_LABELS[stream] || stream} cannot apply to Medical/BDS programs under PMDC regulations.`,
      actionAdvice: 'Explore Computing, Engineering, or Business programs which match your background.'
    };
  }

  // 3. COMPUTING & IT (BS Computer Science, Software Engineering, AI, Cyber Security, Data Science)
  if (isComputing) {
    // A-Levels
    if (isALevels) {
      if (hasALevelMath) {
        return {
          isEligible: true,
          status: 'fully_eligible',
          badgeLabel: 'Directly Eligible (A-Level Math)',
          badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          badgeBorder: 'border-emerald-200',
          badgeBg: 'bg-emerald-50',
          badgeTextColor: 'text-emerald-800',
          reason: 'A-Level Mathematics qualifies you directly for all Computing & IT degrees across Pakistan.',
          policyNote: 'IBCC Equivalence with minimum 50% marks required.'
        };
      }
      if (hasALevelBio) {
        // Pre-Medical equivalent in A-Levels
        return {
          isEligible: true,
          status: 'pre_med_conditional',
          badgeLabel: 'Eligible via HEC Deficiency Math',
          badgeColor: 'text-teal-700 bg-teal-50 border-teal-200',
          badgeBorder: 'border-teal-200',
          badgeBg: 'bg-teal-50',
          badgeTextColor: 'text-teal-800',
          reason: 'Under HEC rules, Biology background students are eligible for BS CS/SE/AI. You will complete 2 deficiency math courses during your 1st year.',
          policyNote: 'HEC Notification: Pre-Med/Bio students take 6 credit hours of foundational math in university.'
        };
      }
      return {
        isEligible: true,
        status: 'pre_med_conditional',
        badgeLabel: 'Eligible with Deficiency Math',
        badgeColor: 'text-teal-700 bg-teal-50 border-teal-200',
        badgeBorder: 'border-teal-200',
        badgeBg: 'bg-teal-50',
        badgeTextColor: 'text-teal-800',
        reason: 'Eligible at most universities; you will take remedial/deficiency math courses in semester 1 & 2.'
      };
    }

    // FSc Pre-Engineering & ICS
    if (stream === 'pre_engineering' || stream === 'ics' || stream === 'general_science') {
      return {
        isEligible: true,
        status: 'fully_eligible',
        badgeLabel: 'Directly Eligible (Tech Core)',
        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badgeBorder: 'border-emerald-200',
        badgeBg: 'bg-emerald-50',
        badgeTextColor: 'text-emerald-800',
        reason: 'Your mathematics foundation directly satisfies all entrance criteria for BS CS, SE, AI, and IT.',
        policyNote: 'No deficiency math required. Eligible for all merit quotas.'
      };
    }

    // FSc Pre-Medical
    if (stream === 'pre_medical') {
      if (hasAddMath) {
        return {
          isEligible: true,
          status: 'fully_eligible',
          badgeLabel: 'Directly Eligible (With Addl Math)',
          badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          badgeBorder: 'border-emerald-200',
          badgeBg: 'bg-emerald-50',
          badgeTextColor: 'text-emerald-800',
          reason: 'Having Board Additional Mathematics satisfies the formal HSC math requirement for all universities.',
          policyNote: 'Exempt from university deficiency math courses.'
        };
      }

      // Check if this specific university has specific rules (NED traditionally strict)
      const isStrictNED = university.id === 'ned-khi';

      if (isStrictNED) {
        return {
          isEligible: false,
          status: 'additional_math_required',
          badgeLabel: 'Requires Board Addl. Math',
          badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
          badgeBorder: 'border-amber-200',
          badgeBg: 'bg-amber-50',
          badgeTextColor: 'text-amber-800',
          reason: 'NED University Karachi traditionally requires Board HSC Mathematics or Pre-Engineering for BS CS/SE.',
          policyNote: 'Pre-Medical students must pass Board Additional Mathematics to enter NED CS.',
          actionAdvice: 'You are directly eligible for FAST Karachi, Bahria, Dawood UET, and Salim Habib without Additional Math!'
        };
      }

      // NUST, FAST, COMSATS, ITU, Bahria, Dawood, Salim Habib, PU, etc.
      return {
        isEligible: true,
        status: 'pre_med_conditional',
        badgeLabel: 'Eligible via Pre-Med (HEC Policy)',
        badgeColor: 'text-teal-700 bg-teal-50 border-teal-200',
        badgeBorder: 'border-teal-200',
        badgeBg: 'bg-teal-50',
        badgeTextColor: 'text-teal-800',
        reason: `${university.shortName} admits Pre-Medical students for BS CS/SE/AI under the HEC revised policy. You will take 2 deficiency mathematics courses (6 credit hours) in your 1st year.`,
        policyNote: 'HEC Official Circular: Pre-Medical students can enroll in BS Computing programs without prior Board Math.',
        actionAdvice: 'Appear for the university entry test (e.g. FAST NU Test, NUST NET Computing/Pre-Med, or NAT-IE).'
      };
    }

    // I.Com & FA
    if (stream === 'icom' || stream === 'fa_humanities') {
      return {
        isEligible: true,
        status: 'pre_med_conditional',
        badgeLabel: 'Eligible with Deficiency Math',
        badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
        badgeBorder: 'border-blue-200',
        badgeBg: 'bg-blue-50',
        badgeTextColor: 'text-blue-800',
        reason: 'Allowed for BS Information Technology and select Computing programs under HEC guidelines with remedial math.',
        policyNote: 'Check university specific prospectus for BS Computer Science vs BS IT quotas.'
      };
    }
  }

  // 4. ENGINEERING (BE / PEC ACCREDITED - Mechanical, Electrical, Civil, Chemical)
  if (isEngineeringDegree) {
    if (isALevels) {
      if (hasALevelMath && hasALevelPhysics && (hasALevelChem || hasALevelCS)) {
        return {
          isEligible: true,
          status: 'fully_eligible',
          badgeLabel: 'Directly Eligible (PEC)',
          badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          badgeBorder: 'border-emerald-200',
          badgeBg: 'bg-emerald-50',
          badgeTextColor: 'text-emerald-800',
          reason: 'Your A-Level combination meets all Pakistan Engineering Council (PEC) accreditation rules.',
          policyNote: 'Minimum 60% in IBCC Pre-Engineering equivalence required.'
        };
      }
      return {
        isEligible: false,
        status: 'ineligible',
        badgeLabel: 'Ineligible (PEC Requires Physics, Math & Chem)',
        badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
        badgeBorder: 'border-rose-200',
        badgeBg: 'bg-rose-50',
        badgeTextColor: 'text-rose-800',
        reason: 'PEC strictly requires Physics, Mathematics, and Chemistry (or Computer Science) for BE degrees.'
      };
    }

    // FSc
    if (stream === 'pre_engineering') {
      return {
        isEligible: true,
        status: 'fully_eligible',
        badgeLabel: 'Directly Eligible (PEC)',
        badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        badgeBorder: 'border-emerald-200',
        badgeBg: 'bg-emerald-50',
        badgeTextColor: 'text-emerald-800',
        reason: 'FSc Pre-Engineering is the benchmark entry stream for all PEC accredited engineering degrees.',
        policyNote: 'PEC Level-II Washington Accord accredited.'
      };
    }

    if (stream === 'pre_medical') {
      if (hasAddMath) {
        return {
          isEligible: true,
          status: 'fully_eligible',
          badgeLabel: 'Eligible with Additional Math',
          badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
          badgeBorder: 'border-emerald-200',
          badgeBg: 'bg-emerald-50',
          badgeTextColor: 'text-emerald-800',
          reason: 'Pre-Medical students with BISE Board Additional Mathematics are fully eligible under PEC rules.',
          policyNote: 'Submit Additional Math result / roll number slip during application.'
        };
      }

      return {
        isEligible: false,
        status: 'ineligible',
        badgeLabel: 'Ineligible (PEC Requires Mathematics)',
        badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
        badgeBorder: 'border-rose-200',
        badgeBg: 'bg-rose-50',
        badgeTextColor: 'text-rose-800',
        reason: 'Pakistan Engineering Council (PEC) regulations strictly require FSc Pre-Engineering or Board Additional Math for Bachelor of Engineering (BE).',
        actionAdvice: 'Register for BISE Additional Math, or apply to BS Computer Science / Software Engineering which allow Pre-Med students!'
      };
    }

    if (stream === 'ics') {
      return {
        isEligible: true,
        status: 'pre_med_conditional',
        badgeLabel: 'Eligible for Computing/Software Engg',
        badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
        badgeBorder: 'border-blue-200',
        badgeBg: 'bg-blue-50',
        badgeTextColor: 'text-blue-800',
        reason: 'ICS is eligible for Software Engineering, Computer Systems, and Telecom Engineering at most universities.',
        policyNote: 'Traditional Mechanical, Civil, and Chemical Engineering require Chemistry.'
      };
    }

    return {
      isEligible: false,
      status: 'ineligible',
      badgeLabel: 'Ineligible for PEC BE',
      badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
      badgeBorder: 'border-rose-200',
      badgeBg: 'bg-rose-50',
      badgeTextColor: 'text-rose-800',
      reason: 'PEC accreditation requires a strong Physics & Mathematics foundation at Intermediate level.'
    };
  }

  // 5. NATURAL SCIENCES & LAW
  return {
    isEligible: true,
    status: 'fully_eligible',
    badgeLabel: 'Directly Eligible',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    badgeBorder: 'border-emerald-200',
    badgeBg: 'bg-emerald-50',
    badgeTextColor: 'text-emerald-800',
    reason: 'Your academic background qualifies you to apply.',
    policyNote: 'Law requires passing HEC Law Admission Test (LAT).'
  };
}
