import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MapPin,
  GraduationCap,
  TrendingUp,
  RotateCcw,
  Check,
  Target,
  FileText,
  Star,
  Zap,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Stethoscope,
  Atom,
  Laptop,
  BookOpen,
  AlertTriangle,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import {
  University,
  ProgramOffering,
  StudentProfile,
  EducationSystem,
  IntermediateStream,
  FeeBudgetPreference
} from '../types';
import {
  getAdmissionChance,
  formatPKR,
  calculateRequiredTestScore,
  getFormulaById
} from '../utils/aggregateCalculator';
import {
  checkProgramEligibility,
  EligibilityResult,
  STREAM_LABELS,
  COMMON_ALEVEL_SUBJECTS
} from '../utils/eligibilityChecker';

interface UniFinderProps {
  universities: University[];
  userAggregate: number | null;
  userMatric: number;
  userFsc: number;
  studentProfile: StudentProfile | null;
  onUpdateProfileStream: (
    system: EducationSystem,
    stream: IntermediateStream,
    hasAddMath?: boolean,
    alevelSubjects?: string[]
  ) => void;
  onOpenOnboarding: () => void;
  onOpenCalculator: () => void;
  shortlistedIds: string[]; // universityId_programId
  onToggleShortlist: (university: University, program: ProgramOffering) => void;
  onAddToCompare: (university: University, program: ProgramOffering) => void;
  comparingIds: string[];
  interestedProgramIds: string[];
  onToggleInterest: (university: University, program: ProgramOffering) => void;
  onOpenDocsModal: (university: University) => void;
  budgetPreference: FeeBudgetPreference;
  onBudgetChange: (budget: FeeBudgetPreference) => void;
  isPro: boolean;
  onOpenPricing: () => void;
}

export const UniFinder: React.FC<UniFinderProps> = ({
  universities,
  userAggregate,
  userMatric,
  userFsc,
  studentProfile,
  onUpdateProfileStream,
  onOpenOnboarding,
  onOpenCalculator,
  shortlistedIds,
  onToggleShortlist,
  onAddToCompare,
  comparingIds,
  interestedProgramIds,
  onToggleInterest,
  onOpenDocsModal,
  budgetPreference,
  onBudgetChange,
  isPro,
  onOpenPricing
}) => {
  // Current user stream helpers
  const currentSystem: EducationSystem = studentProfile?.educationSystem || 'fsc';
  const currentStream: IntermediateStream = studentProfile?.intermediateStream || 'pre_medical';
  const hasAddMath: boolean = !!studentProfile?.hasAdditionalMath;
  const currentALevelSubjects: string[] = studentProfile?.alevelSubjects || ['Biology', 'Chemistry', 'Physics'];

  // Draft Filter States (User edits these before clicking "Search")
  const [draftSearch, setDraftSearch] = useState<string>('');
  const [draftDiscipline, setDraftDiscipline] = useState<string>('All');
  const [draftCity, setDraftCity] = useState<string>('All');
  const [draftSector, setDraftSector] = useState<string>('All');
  const [draftBudget, setDraftBudget] = useState<FeeBudgetPreference>(budgetPreference);

  // Applied Filter States
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [appliedDiscipline, setAppliedDiscipline] = useState<string>('All');
  const [appliedCity, setAppliedCity] = useState<string>('All');
  const [appliedSector, setAppliedSector] = useState<string>('All');
  const [appliedBudget, setAppliedBudget] = useState<FeeBudgetPreference>(budgetPreference);

  const [chanceFilter, setChanceFilter] = useState<'All' | 'Safe' | 'Target' | 'Reach'>('All');
  const [eligibilityFilter, setEligibilityFilter] = useState<'all' | 'eligible_only' | 'premed_cs_only'>('all');

  // Quick stream switcher UI state
  const [isStreamMenuOpen, setIsStreamMenuOpen] = useState<boolean>(false);

  // Manual aggregate adjustment input
  const [manualAggregate, setManualAggregate] = useState<string>(
    userAggregate ? String(userAggregate) : '78.5'
  );

  const effectiveAggregate = userAggregate ?? (parseFloat(manualAggregate) || 75.0);

  // Available unique cities for dropdown
  const availableCities = useMemo(() => {
    return ['All', 'Islamabad', 'Lahore', 'Karachi', 'Topi'];
  }, []);

  const disciplines: Array<{ id: string; label: string }> = [
    { id: 'All', label: 'All Disciplines' },
    { id: 'Computing & IT', label: 'Computing & IT (CS, SE, AI, IT, Cyber)' },
    { id: 'Engineering', label: 'Engineering (Electrical, Mech, Civil, Chemical)' },
    { id: 'Medical & Health', label: 'Medical & Health (MBBS, BDS, Pharm-D)' },
    { id: 'Business & Management', label: 'Business & Management (BBA, FinTech, Accounting)' },
    { id: 'Natural Sciences', label: 'Natural Sciences (Physics, Math, Chemistry)' }
  ];

  // Apply search action (Triggered by Search button or Enter key)
  const handleApplySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAppliedSearch(draftSearch);
    setAppliedDiscipline(draftDiscipline);
    setAppliedCity(draftCity);
    setAppliedSector(draftSector);
    setAppliedBudget(draftBudget);
    onBudgetChange(draftBudget);
  };

  // Reset filters
  const handleResetFilters = () => {
    setDraftSearch('');
    setDraftDiscipline('All');
    setDraftCity('All');
    setDraftSector('All');
    setDraftBudget('Any');

    setAppliedSearch('');
    setAppliedDiscipline('All');
    setAppliedCity('All');
    setAppliedSector('All');
    setAppliedBudget('Any');
    onBudgetChange('Any');
    setChanceFilter('All');
    setEligibilityFilter('all');
  };

  // Helper to match search query strictly against program & university
  const matchesStrictSearch = (uni: University, prog: ProgramOffering, rawQuery: string): boolean => {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return true;

    const progName = prog.name.toLowerCase();
    const progField = prog.field.toLowerCase();
    const uniName = uni.name.toLowerCase();
    const uniShort = uni.shortName.toLowerCase();
    const uniCity = uni.city.toLowerCase();

    // Specific field intention checks (Regex whole-word matching)
    const isComputingQuery = /\b(cs|computer|software|computing|it|ai|data science|cyber|artificial)\b/i.test(q);
    const isMedicalQuery = /\b(mbbs|bds|pharm|pharmacy|medical|doctor)\b/i.test(q);
    const isEngineeringQuery = /\b(chemical|mechanical|electrical|civil|metallurgy|engineering)\b/i.test(q);
    const isBusinessQuery = /\b(bba|business|accounting|finance|management)\b/i.test(q);

    // If query asks for CS/Computing, reject any Medical, Chemical, or other unrelated programs
    if (
      isComputingQuery &&
      prog.field !== 'Computing & IT' &&
      !progName.includes('computer') &&
      !progName.includes('cs') &&
      !progName.includes('software')
    ) {
      return false;
    }

    if (
      isMedicalQuery &&
      prog.field !== 'Medical & Health' &&
      !progName.includes('pharm') &&
      !progName.includes('mbbs')
    ) {
      return false;
    }

    if (
      isEngineeringQuery &&
      prog.field !== 'Engineering' &&
      !progName.includes('engineering')
    ) {
      return false;
    }

    if (
      isBusinessQuery &&
      prog.field !== 'Business & Management' &&
      !progName.includes('bba')
    ) {
      return false;
    }

    // Check individual search tokens
    const tokens = q.split(/\s+/).filter(Boolean);
    return tokens.every((token) => {
      return (
        uniName.includes(token) ||
        uniShort.includes(token) ||
        uniCity.includes(token) ||
        progName.includes(token) ||
        progField.includes(token)
      );
    });
  };

  // Flatten and filter university offerings
  const flattenedOfferings = useMemo(() => {
    const list: Array<{
      university: University;
      program: ProgramOffering;
      chance: ReturnType<typeof getAdmissionChance>;
      targetScore: ReturnType<typeof calculateRequiredTestScore>;
      eligibility: EligibilityResult;
    }> = [];

    universities.forEach((uni) => {
      // City filter
      if (appliedCity !== 'All' && !uni.city.toLowerCase().includes(appliedCity.toLowerCase())) {
        return;
      }

      // Sector filter
      if (appliedSector !== 'All' && uni.sector !== appliedSector) {
        return;
      }

      uni.programs.forEach((prog) => {
        // Discipline Filter
        if (appliedDiscipline !== 'All' && prog.field !== appliedDiscipline) {
          return;
        }

        // Semester Fee Budget Filter
        if (appliedBudget === 'below_50k' && prog.perSemesterFeePKR > 50000) return;
        if (appliedBudget === 'below_100k' && prog.perSemesterFeePKR > 100000) return;
        if (appliedBudget === 'below_150k' && prog.perSemesterFeePKR > 150000) return;
        if (appliedBudget === 'above_150k' && prog.perSemesterFeePKR <= 150000) return;

        // Strict Search Query Matching
        if (!matchesStrictSearch(uni, prog, appliedSearch)) {
          return;
        }

        // Eligibility Calculation
        const eligibility = checkProgramEligibility(prog, uni, studentProfile);

        // Eligibility Filter
        if (eligibilityFilter === 'eligible_only' && !eligibility.isEligible) {
          return;
        }
        if (eligibilityFilter === 'premed_cs_only') {
          // Show only Computing programs where Pre-Med is eligible
          if (prog.field !== 'Computing & IT' || !eligibility.isEligible) {
            return;
          }
        }

        const chance = getAdmissionChance(effectiveAggregate, prog.closingMeritLastYear);

        // Chance filter
        if (chanceFilter !== 'All' && chance.category !== chanceFilter) return;

        // Calculate Target Score required to guarantee admission based on user Matric & FSc
        const formula = getFormulaById(prog.formulaId);
        const targetScore = calculateRequiredTestScore(
          userMatric || 85,
          userFsc || 80,
          prog.closingMeritLastYear,
          formula
        );

        list.push({ university: uni, program: prog, chance, targetScore, eligibility });
      });
    });

    // Sort order: Safe first, then Target, then Reach; within that by closing merit descending
    return list.sort((a, b) => {
      const order = { Safe: 1, Target: 2, Reach: 3 };
      if (order[a.chance.category] !== order[b.chance.category]) {
        return order[a.chance.category] - order[b.chance.category];
      }
      return b.program.closingMeritLastYear - a.program.closingMeritLastYear;
    });
  }, [
    universities,
    appliedCity,
    appliedSector,
    appliedDiscipline,
    appliedBudget,
    appliedSearch,
    effectiveAggregate,
    chanceFilter,
    eligibilityFilter,
    userMatric,
    userFsc,
    studentProfile
  ]);

  // Counts for chance categories
  const counts = useMemo(() => {
    let safe = 0;
    let target = 0;
    let reach = 0;
    let eligible = 0;

    flattenedOfferings.forEach((item) => {
      if (item.chance.category === 'Safe') safe++;
      else if (item.chance.category === 'Target') target++;
      else if (item.chance.category === 'Reach') reach++;
      if (item.eligibility.isEligible) eligible++;
    });

    return { total: flattenedOfferings.length, safe, target, reach, eligible };
  }, [flattenedOfferings]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Verified Admissions 2026 */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Pakistani University Admissions 2026 Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
              University Finder & Stream Eligibility
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Find verified Pakistani universities matching your academic stream, aggregate score, and target entrance tests. Real formulas for NUST NET, FAST NU, NED, ECAT & MDCAT.
            </p>
          </div>

          {/* Quick Aggregate Score Box */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 flex flex-wrap items-center gap-4 w-full lg:w-auto">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-emerald-300 font-bold block mb-1">
                Your Current Aggregate:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-serif text-white">
                  {effectiveAggregate.toFixed(2)}%
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  (Matric: {userMatric || 85}%, FSc: {userFsc || 80}%)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenCalculator}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md"
            >
              <span>Recalculate Formula</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {!isPro && (
              <button
                type="button"
                onClick={onOpenPricing}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md"
              >
                <Zap className="w-3.5 h-3.5 text-amber-100 fill-amber-100" />
                <span>Pro Pass (Rs. 900)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* STUDENT ACADEMIC STREAM & ELIGIBILITY CONTROL BAR */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              {currentStream === 'pre_medical' ? (
                <Stethoscope className="w-5 h-5" />
              ) : currentStream === 'pre_engineering' ? (
                <Atom className="w-5 h-5" />
              ) : currentStream === 'ics' ? (
                <Laptop className="w-5 h-5" />
              ) : (
                <BookOpen className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Your Academic Background:
              </div>
              <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span>
                  {currentSystem === 'alevels'
                    ? `A-Levels (${currentALevelSubjects.slice(0, 3).join(', ')})`
                    : STREAM_LABELS[currentStream]}
                </span>
                {currentStream === 'pre_medical' && hasAddMath && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    + Additional Math
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stream Switcher Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">
              Switch Stream:
            </span>

            <button
              type="button"
              onClick={() => onUpdateProfileStream('fsc', 'pre_medical', hasAddMath)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                currentStream === 'pre_medical' && currentSystem === 'fsc'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Pre-Medical</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateProfileStream('fsc', 'pre_engineering', false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                currentStream === 'pre_engineering' && currentSystem === 'fsc'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Pre-Engineering</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateProfileStream('fsc', 'ics', false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                currentStream === 'ics' && currentSystem === 'fsc'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>ICS</span>
            </button>

            <button
              type="button"
              onClick={() => onUpdateProfileStream('alevels', 'other', false, currentALevelSubjects)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                currentSystem === 'alevels'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>A-Levels</span>
            </button>

            <button
              type="button"
              onClick={onOpenOnboarding}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors ml-1"
            >
              Edit Details
            </button>
          </div>
        </div>

        {/* Dynamic Stream Guidance Alert Banner */}
        {currentStream === 'pre_medical' && currentSystem === 'fsc' && (
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-teal-950 block mb-0.5">
                  Pre-Medical to Computer Science / Software Engineering (HEC Policy):
                </strong>
                <span className="text-teal-900 leading-relaxed">
                  Under the HEC revised undergraduate policy, Pre-Medical students are permitted to take <strong>BS Computer Science, Software Engineering & AI</strong> at top institutions (FAST, NUST, COMSATS, ITU, Bahria, Dawood UET, Salim Habib, etc.) by clearing 2 deficiency math courses (6 credit hours) during the first year of university!
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-teal-300 text-teal-950 font-bold shrink-0 cursor-pointer hover:bg-teal-50/50 transition-colors">
              <input
                type="checkbox"
                checked={hasAddMath}
                onChange={(e) => onUpdateProfileStream(currentSystem, currentStream, e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>I passed Board Additional Math</span>
            </label>
          </div>
        )}

        {currentSystem === 'alevels' && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                <strong>A-Level Subjects Selected:</strong> {currentALevelSubjects.join(', ')}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="text-xs font-bold text-emerald-700 hover:underline shrink-0"
            >
              Change A-Level Subjects
            </button>
          </div>
        )}

        {/* Search & Filter Toolbar with Search Button */}
        <form onSubmit={handleApplySearch} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Keyword Input */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Search Program or University:
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. CS, Software, Bahria, NUST, FAST, NED, BBA..."
                  value={draftSearch}
                  onChange={(e) => setDraftSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500 font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Discipline Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Discipline / Field:
              </label>
              <select
                value={draftDiscipline}
                onChange={(e) => setDraftDiscipline(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-500"
              >
                {disciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                City:
              </label>
              <select
                value={draftCity}
                onChange={(e) => setDraftCity(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500 font-medium text-slate-800"
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city === 'All' ? 'All Pakistani Cities' : city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end pt-1">
            {/* Sector Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sector:
              </label>
              <select
                value={draftSector}
                onChange={(e) => setDraftSector(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500 font-medium text-slate-800"
              >
                <option value="All">All Sectors (Public & Private)</option>
                <option value="Public">Public / Subsidized Government</option>
                <option value="Private">Private Chartered</option>
                <option value="Semi-Government">Semi-Government (Bahria, PIEAS)</option>
              </select>
            </div>

            {/* Semester Fee Budget Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Semester Fee Budget:
              </label>
              <select
                value={draftBudget}
                onChange={(e) => setDraftBudget(e.target.value as FeeBudgetPreference)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-emerald-800 focus:outline-emerald-500"
              >
                <option value="Any">Any Semester Fee</option>
                <option value="below_50k">Below Rs. 50,000 / sem (NED, PU, UET)</option>
                <option value="below_100k">Below Rs. 1 Lakh (PIEAS, Al-Kauthar)</option>
                <option value="below_150k">Below Rs. 1.5 Lakh (Bahria, COMSATS)</option>
                <option value="above_150k">Above Rs. 1.5 Lakh (NUST, FAST, LUMS)</option>
              </select>
            </div>

            {/* Action Buttons: Search / Filter & Reset */}
            <div className="sm:col-span-1 lg:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Programs</span>
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="py-2.5 px-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Reset all filters to default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>
        </form>

        {/* Active Filters Tag Bar */}
        {(appliedSearch || appliedDiscipline !== 'All' || appliedCity !== 'All' || appliedSector !== 'All' || appliedBudget !== 'Any') && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-bold">Active Search Filters:</span>
            {appliedSearch && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-semibold">
                Keyword: "{appliedSearch}"
              </span>
            )}
            {appliedDiscipline !== 'All' && (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-900 font-semibold">
                Field: {appliedDiscipline}
              </span>
            )}
            {appliedCity !== 'All' && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold">
                City: {appliedCity}
              </span>
            )}
            {appliedSector !== 'All' && (
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold">
                Sector: {appliedSector}
              </span>
            )}
            {appliedBudget !== 'Any' && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                Budget: {appliedBudget.replace('_', ' ')}
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-rose-600 font-bold hover:underline ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Eligibility & Odds Filter Pills */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Eligibility:
            </span>

            <button
              type="button"
              onClick={() => setEligibilityFilter('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                eligibilityFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Programs ({counts.total})
            </button>

            <button
              type="button"
              onClick={() => setEligibilityFilter('eligible_only')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                eligibilityFilter === 'eligible_only'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Eligible for My Stream ({counts.eligible})</span>
            </button>

            {currentStream === 'pre_medical' && (
              <button
                type="button"
                onClick={() => setEligibilityFilter('premed_cs_only')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                  eligibilityFilter === 'premed_cs_only'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Pre-Med Friendly CS</span>
              </button>
            )}

            <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Odds:
            </span>

            <button
              type="button"
              onClick={() => setChanceFilter('All')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                chanceFilter === 'All'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Odds
            </button>

            <button
              type="button"
              onClick={() => setChanceFilter('Safe')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                chanceFilter === 'Safe'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Safe ({counts.safe})
            </button>

            <button
              type="button"
              onClick={() => setChanceFilter('Target')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                chanceFilter === 'Target'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Target ({counts.target})
            </button>

            <button
              type="button"
              onClick={() => setChanceFilter('Reach')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                chanceFilter === 'Reach'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              Reach ({counts.reach})
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Showing <strong>{flattenedOfferings.length}</strong> programs
          </div>
        </div>
      </div>

      {/* University Offerings Cards List */}
      <div className="space-y-4">
        {flattenedOfferings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              No programs found matching your current filters
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try switching your stream filter to "All Programs", or click "Reset" to see all undergraduate programs in Pakistan.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
            >
              Reset Filters & Show All
            </button>
          </div>
        ) : (
          flattenedOfferings.map(({ university, program, chance, targetScore, eligibility }) => {
            const compositeId = `${university.id}_${program.id}`;
            const isShortlisted = shortlistedIds.includes(compositeId);
            const isComparing = comparingIds.includes(compositeId);
            const isInterested = interestedProgramIds.includes(compositeId);

            return (
              <div
                key={compositeId}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden p-5 sm:p-6 space-y-4"
              >
                {/* Header: Badges & Tags */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide ${university.badgeColor}`}
                    >
                      {university.shortName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {university.sector}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {university.city}
                    </span>
                  </div>

                  {/* STREAM ELIGIBILITY BADGE (Prominent) */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 shadow-xs ${eligibility.badgeColor}`}
                    >
                      {eligibility.isEligible ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      <span>{eligibility.badgeLabel}</span>
                    </div>
                  </div>
                </div>

                {/* Main Card Content Grid */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left Column: University & Program Overview */}
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 font-serif">
                        {program.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {university.name} • {program.durationYears} Years Full-Time ({program.field})
                      </p>
                    </div>

                    {/* Eligibility Explanation Box */}
                    <div className={`p-3 rounded-2xl border text-xs space-y-1 ${eligibility.badgeBg} ${eligibility.badgeBorder}`}>
                      <div className="flex items-start gap-2">
                        <Info className={`w-4 h-4 shrink-0 mt-0.5 ${eligibility.badgeTextColor}`} />
                        <div>
                          <span className={`font-bold block ${eligibility.badgeTextColor}`}>
                            Eligibility Verdict for Your Background:
                          </span>
                          <p className={`text-[11px] mt-0.5 leading-relaxed ${eligibility.badgeTextColor}`}>
                            {eligibility.reason}
                          </p>
                          {eligibility.policyNote && (
                            <p className="text-[10px] font-medium text-slate-600 mt-1">
                              <strong>Official Rule:</strong> {eligibility.policyNote}
                            </p>
                          )}
                          {eligibility.actionAdvice && (
                            <p className="text-[10px] font-semibold text-emerald-800 mt-1">
                              💡 <strong>Advice:</strong> {eligibility.actionAdvice}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Accurate Mathematical Formula & Test Score Required */}
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <Target className="w-4 h-4 text-emerald-600" />
                          <span>Last Year Official Closing Cutoff:</span>
                          <span className="text-emerald-700 font-black font-mono">
                            {program.closingMeritLastYear}%
                          </span>
                        </div>

                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {program.entryTestRequired}
                        </span>
                      </div>

                      {/* Required Test Score Display with Full Proof */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs sm:text-sm font-black text-slate-900">
                            {targetScore.feasibility === 'Guaranteed' ? (
                              <span className="text-emerald-700 font-bold">
                                Guaranteed on Academic Base ({targetScore.academicContribution}%)!
                              </span>
                            ) : (
                              <>
                                Target Score in Test:{' '}
                                <span className="text-emerald-700 font-mono font-black">
                                  {targetScore.requiredMarks} / {targetScore.maxMarks}
                                </span>{' '}
                                ({targetScore.percentageNeeded}% in {program.entryTestRequired})
                              </>
                            )}
                          </span>
                        </div>

                        {/* Step-by-Step Mathematical Proof */}
                        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>Mathematical Breakdown:</span>
                            <span className="text-[10px] text-emerald-700 font-black">
                              {targetScore.feasibility}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 space-y-0.5">
                            <div>
                              • Academic Base Contribution: <strong className="text-slate-800 font-mono">{targetScore.academicContribution}%</strong> (from Matric {userMatric || 85}% + FSc {userFsc || 80}%)
                            </div>
                            <div>
                              • Required From Entry Test: <strong className="text-slate-800 font-mono">{targetScore.testContributionNeeded}%</strong>
                            </div>
                            <div className="text-emerald-800 font-semibold">
                              ✓ Verified: {targetScore.academicContribution}% + {targetScore.testContributionNeeded}% = {program.closingMeritLastYear}% Total Aggregate
                            </div>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-500 pt-0.5">
                          <strong>Test Subjects:</strong> {program.testSubjects} • Formula: {program.formulaDescription}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Admission Odds, Fees, and Action Buttons */}
                  <div className="flex flex-col sm:items-end justify-between gap-4 lg:min-w-[240px]">
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full gap-2">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${chance.badgeClass}`}
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>{chance.label}</span>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                          Semester Tuition:
                        </span>
                        <div className="text-base font-black text-slate-900 font-serif">
                          {formatPKR(program.perSemesterFeePKR)}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          Est. Total: {formatPKR(program.totalEstimatedCostPKR)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap items-center gap-2 w-full justify-end pt-2">
                      {/* Kollegio-Style 1-Click Interested Button (NO FORM FILLING) */}
                      <button
                        type="button"
                        onClick={() => onToggleInterest(university, program)}
                        className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs ${
                          isInterested
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                        title={
                          isInterested
                            ? 'You indicated interest in this program'
                            : 'Mark program as interested'
                        }
                      >
                        {isInterested ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>Interested ✓</span>
                          </>
                        ) : (
                          <>
                            <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                            <span>Interested</span>
                          </>
                        )}
                      </button>

                      {/* Official Documents Checklist Button */}
                      <button
                        type="button"
                        onClick={() => onOpenDocsModal(university)}
                        className="p-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 border border-slate-200"
                        title="View required official documents & domicile criteria"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Docs</span>
                      </button>

                      {/* Compare Button */}
                      <button
                        type="button"
                        onClick={() => onAddToCompare(university, program)}
                        className={`p-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 border ${
                          isComparing
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                        title="Compare with another program"
                      >
                        <span>{isComparing ? 'Comparing ✓' : 'Compare'}</span>
                      </button>

                      {/* Shortlist Bookmark Button with Framer Motion animations */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                        onClick={() => onToggleShortlist(university, program)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 shadow-xs ${
                          isShortlisted
                            ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-amber-200/40'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                        }`}
                        title={isShortlisted ? 'Saved to My Shortlist (Click to remove)' : 'Save to My Shortlist'}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {isShortlisted ? (
                            <motion.span
                              key="saved"
                              initial={{ scale: 0.5, rotate: -25, opacity: 0 }}
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              exit={{ scale: 0.5, rotate: 25, opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                              className="flex items-center gap-1 text-amber-800"
                            >
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20 shrink-0" />
                              <span>Saved ★</span>
                            </motion.span>
                          ) : (
                            <motion.span
                              key="shortlist"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ duration: 0.15 }}
                              className="flex items-center gap-1 text-slate-700"
                            >
                              <Bookmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>Shortlist</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </div>

                    {/* Official Admission Portal Direct Link */}
                    <a
                      href={university.admissionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 underline underline-offset-2 mt-1"
                    >
                      <span>Apply on {university.shortName} Official Portal</span>
                      <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
