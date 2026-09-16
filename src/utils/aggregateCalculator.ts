import { FormulaConfig } from '../types';

export const FORMULA_PRESETS: FormulaConfig[] = [
  {
    id: 'ned',
    name: 'NED University Karachi (Official Pre-Admission)',
    matricWeight: 0,
    fscWeight: 40,
    testWeight: 60,
    testName: 'NED Entry Test',
    testMaxMarks: 100,
    description: '60% NED Entry Test + 40% HSC / FSc (Part-1 / Total)'
  },
  {
    id: 'ned_equal',
    name: 'NED University Karachi (Standard 50/50 Category)',
    matricWeight: 0,
    fscWeight: 50,
    testWeight: 50,
    testName: 'NED Entry Test',
    testMaxMarks: 100,
    description: '50% NED Entry Test + 50% HSC / Intermediate'
  },
  {
    id: 'nust',
    name: 'NUST Islamabad (Official NET Formula)',
    matricWeight: 10,
    fscWeight: 15,
    testWeight: 75,
    testName: 'NUST NET',
    testMaxMarks: 200,
    description: '75% NET + 15% FSc (Part-1 or Total) + 10% Matric / SSC'
  },
  {
    id: 'fast',
    name: 'FAST-NUCES (Official NU Test Formula)',
    matricWeight: 0,
    fscWeight: 50,
    testWeight: 50,
    testName: 'NU Test',
    testMaxMarks: 120,
    description: '50% NU Entry Test + 50% FSc / Intermediate'
  },
  {
    id: 'giki',
    name: 'GIKI Topi (Official GIKI Test)',
    matricWeight: 0,
    fscWeight: 15,
    testWeight: 85,
    testName: 'GIKI Test',
    testMaxMarks: 80,
    description: '85% GIKI Entrance Test + 15% FSc / O-Levels'
  },
  {
    id: 'pieas',
    name: 'PIEAS Islamabad (Official Admission Formula)',
    matricWeight: 15,
    fscWeight: 25,
    testWeight: 60,
    testName: 'PIEAS Written Test',
    testMaxMarks: 100,
    description: '60% PIEAS Test + 25% FSc + 15% Matric / SSC'
  },
  {
    id: 'duet',
    name: 'Dawood University Karachi (DUET Official)',
    matricWeight: 0,
    fscWeight: 50,
    testWeight: 50,
    testName: 'DUET Pre-Admission Test',
    testMaxMarks: 100,
    description: '50% Pre-Admission Test + 50% HSC Pre-Engineering'
  },
  {
    id: 'pu',
    name: 'Punjab University Lahore (PUCIT / Engg)',
    matricWeight: 18.75, // 25% of 75% academic = 18.75
    fscWeight: 56.25,   // 75% of 75% academic = 56.25
    testWeight: 25,
    testName: 'PU Admission Test',
    testMaxMarks: 100,
    description: '25% PU Entry Test + 75% Academic Record (FSc & Matric)'
  },
  {
    id: 'comsats',
    name: 'COMSATS University (Official NTS-NAT)',
    matricWeight: 10,
    fscWeight: 40,
    testWeight: 50,
    testName: 'NTS-NAT',
    testMaxMarks: 90,
    description: '50% NTS NAT + 40% FSc + 10% Matric'
  },
  {
    id: 'uet',
    name: 'UET Lahore (Official ECAT Formula)',
    matricWeight: 0,
    fscWeight: 67,
    testWeight: 33,
    testName: 'ECAT',
    testMaxMarks: 400,
    description: '33% ECAT + 67% FSc / Intermediate'
  },
  {
    id: 'pmdc',
    name: 'PMDC National MDCAT (MBBS & BDS)',
    matricWeight: 10,
    fscWeight: 40,
    testWeight: 50,
    testName: 'National MDCAT',
    testMaxMarks: 200,
    description: '50% MDCAT + 40% FSc Pre-Medical + 10% Matric'
  },
  {
    id: 'habib',
    name: 'Habib University Karachi (Comprehensive Evaluation)',
    matricWeight: 0,
    fscWeight: 40,
    testWeight: 60,
    testName: 'Habib Admissions Test / SAT',
    testMaxMarks: 100,
    description: '60% Entrance Test & Interview + 40% High School / Inter'
  },
  {
    id: 'salim_habib',
    name: 'Salim Habib University Karachi (SHU)',
    matricWeight: 0,
    fscWeight: 50,
    testWeight: 50,
    testName: 'SHU Aptitude Test / NAT',
    testMaxMarks: 100,
    description: '50% Aptitude Test + 50% Intermediate / HSSC'
  },
  {
    id: 'alkauthar',
    name: 'Al-Kauthar University (Islamic & Modern Studies)',
    matricWeight: 10,
    fscWeight: 40,
    testWeight: 50,
    testName: 'Al-Kauthar Aptitude Test',
    testMaxMarks: 100,
    description: '50% Aptitude & Arabic/English Test + 40% FSc + 10% Matric'
  },
  {
    id: 'bahria',
    name: 'Bahria University (Official CBT Formula)',
    matricWeight: 10,
    fscWeight: 40,
    testWeight: 50,
    testName: 'Bahria CBT Entry Test / NAT',
    testMaxMarks: 100,
    description: '50% Bahria CBT Entry Test + 40% Intermediate (HSSC/FSc) + 10% Matric/SSC'
  }
];

export function getFormulaById(id: string): FormulaConfig {
  const found = FORMULA_PRESETS.find((f) => f.id === id);
  return (
    found || {
      id: 'general',
      name: 'General University Standard',
      matricWeight: 10,
      fscWeight: 40,
      testWeight: 50,
      testName: 'Entry Test',
      testMaxMarks: 100,
      description: '50% Test + 40% FSc + 10% Matric'
    }
  );
}

export function calculateAggregate(
  matricObtained: number,
  matricTotal: number,
  fscObtained: number,
  fscTotal: number,
  testObtained: number,
  testTotal: number,
  formula: FormulaConfig
): number {
  const matricPct = matricTotal > 0 ? (matricObtained / matricTotal) * 100 : 0;
  const fscPct = fscTotal > 0 ? (fscObtained / fscTotal) * 100 : 0;
  const testPct = testTotal > 0 ? (testObtained / testTotal) * 100 : 0;

  const aggregate =
    matricPct * (formula.matricWeight / 100) +
    fscPct * (formula.fscWeight / 100) +
    testPct * (formula.testWeight / 100);

  return parseFloat(aggregate.toFixed(2));
}

/**
 * Calculates the exact minimum score required in the entrance exam
 * to guarantee meeting or exceeding the previous year's closing merit.
 */
export function calculateRequiredTestScore(
  matricPct: number,
  fscPct: number,
  closingMerit: number,
  formula: FormulaConfig
): {
  requiredMarks: number;
  maxMarks: number;
  percentageNeeded: number;
  academicContribution: number;
  matricContribution: number;
  fscContribution: number;
  testContributionNeeded: number;
  feasibility: 'Guaranteed' | 'Feasible' | 'Competitive' | 'Challenging' | 'Requires Perfect Score';
  note: string;
} {
  const matricContribution = parseFloat((matricPct * (formula.matricWeight / 100)).toFixed(2));
  const fscContribution = parseFloat((fscPct * (formula.fscWeight / 100)).toFixed(2));
  const academicContribution = parseFloat((matricContribution + fscContribution).toFixed(2));

  const neededFromTest = parseFloat((closingMerit - academicContribution).toFixed(2));

  if (neededFromTest <= 0) {
    return {
      requiredMarks: 0,
      maxMarks: formula.testMaxMarks,
      percentageNeeded: 0,
      academicContribution,
      matricContribution,
      fscContribution,
      testContributionNeeded: 0,
      feasibility: 'Guaranteed',
      note: 'Your academic marks alone exceed last year closing cutoff!'
    };
  }

  // Percentage needed in the test to yield neededFromTest when weighted by formula.testWeight
  const testPctNeeded = (neededFromTest / (formula.testWeight / 100));
  const rawMarksNeeded = (testPctNeeded / 100) * formula.testMaxMarks;
  const requiredMarks = Math.ceil(rawMarksNeeded);

  let feasibility: 'Guaranteed' | 'Feasible' | 'Competitive' | 'Challenging' | 'Requires Perfect Score' = 'Feasible';
  let note = '';

  if (requiredMarks > formula.testMaxMarks) {
    feasibility = 'Requires Perfect Score';
    note = `Closing merit (${closingMerit}%) exceeds maximum achievable test score with current academic base. Requires ${requiredMarks}/${formula.testMaxMarks}.`;
  } else if (testPctNeeded > 80) {
    feasibility = 'Challenging';
    note = `Need high score of ${requiredMarks}/${formula.testMaxMarks} (${Math.round(testPctNeeded)}%) in ${formula.testName}.`;
  } else if (testPctNeeded > 65) {
    feasibility = 'Competitive';
    note = `Target score: ${requiredMarks}/${formula.testMaxMarks} (${Math.round(testPctNeeded)}%). Achievable with targeted preparation.`;
  } else {
    feasibility = 'Feasible';
    note = `Target score of ${requiredMarks}/${formula.testMaxMarks} (${Math.round(testPctNeeded)}%) in ${formula.testName}.`;
  }

  return {
    requiredMarks: Math.min(requiredMarks, formula.testMaxMarks),
    maxMarks: formula.testMaxMarks,
    percentageNeeded: parseFloat(testPctNeeded.toFixed(1)),
    academicContribution,
    matricContribution,
    fscContribution,
    testContributionNeeded: neededFromTest,
    feasibility,
    note
  };
}

export type FitCategory = 'Safe' | 'Target' | 'Reach';

export function getAdmissionChance(
  userAggregate: number,
  closingMerit: number
): {
  category: FitCategory;
  diff: number;
  label: string;
  badgeClass: string;
} {
  const diff = parseFloat((userAggregate - closingMerit).toFixed(2));

  if (diff >= 2.0) {
    return {
      category: 'Safe',
      diff,
      label: 'High Probability (Safe)',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  } else if (diff >= -2.0) {
    return {
      category: 'Target',
      diff,
      label: 'Moderate Chance (Target)',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  } else {
    return {
      category: 'Reach',
      diff,
      label: 'Competitive (Reach)',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
    };
  }
}

export function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0
  })
    .format(amount)
    .replace('PKR', 'Rs.');
}
