import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Atom,
  Stethoscope,
  Laptop,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Check
} from 'lucide-react';
import {
  StudentUser,
  FeeBudgetPreference,
  StudentProfile,
  EducationSystem,
  IntermediateStream
} from '../types';
import { COMMON_ALEVEL_SUBJECTS } from '../utils/eligibilityChecker';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (user: StudentUser, profile: StudentProfile) => void;
  onClose?: () => void;
  canCloseWithoutComplete?: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onClose,
  canCloseWithoutComplete = false
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Sign Up / Authentication
  const [authProvider, setAuthProvider] = useState<'google' | 'whatsapp' | 'guest'>('whatsapp');
  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState(''); // WhatsApp phone number or Gmail

  // Step 2: Education Background & Scores
  const [educationSystem, setEducationSystem] = useState<EducationSystem>('fsc');
  const [intermediateStream, setIntermediateStream] = useState<IntermediateStream>('pre_medical');
  const [hasAdditionalMath, setHasAdditionalMath] = useState<boolean>(false);
  const [alevelSubjects, setAlevelSubjects] = useState<string[]>([
    'Biology',
    'Chemistry',
    'Physics'
  ]);

  const [matricPercentage, setMatricPercentage] = useState<string>('85');
  const [fscPercentage, setFscPercentage] = useState<string>('80');
  const [hasTakenTest, setHasTakenTest] = useState<boolean>(false);
  const [testScore, setTestScore] = useState<string>('');
  const [testMax, setTestMax] = useState<string>('200');

  // Step 3: Preferences
  const [preferredCity, setPreferredCity] = useState<string>('Any');
  const [preferredProgram, setPreferredProgram] = useState<string>('Computing & IT');
  const [budgetPreference, setBudgetPreference] = useState<FeeBudgetPreference>('Any');

  if (!isOpen) return null;

  const toggleALevelSubject = (subj: string) => {
    setAlevelSubjects((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  };

  const handleQuickAuth = (provider: 'google' | 'whatsapp' | 'guest') => {
    setAuthProvider(provider);
    if (provider === 'google' && !contactInfo) {
      setFullName('Ahmed Khan');
      setContactInfo('ahmed.student@gmail.com');
    } else if (provider === 'whatsapp' && !contactInfo) {
      setFullName('Muhammad Ali');
      setContactInfo('+92 300 1234567');
    } else if (provider === 'guest') {
      setFullName('Student Guest');
      setContactInfo('guest@pakuni.pk');
    }
  };

  const handleFinish = () => {
    const matric = parseFloat(matricPercentage) || 80;
    const fsc = parseFloat(fscPercentage) || 75;
    const parsedTestScore = hasTakenTest && testScore ? parseFloat(testScore) : null;
    const parsedTestMax = hasTakenTest && testMax ? parseFloat(testMax) : 200;

    // Calculate approximate baseline aggregate for initial recommendation
    let baselineAggregate: number;
    if (parsedTestScore) {
      const testPct = (parsedTestScore / parsedTestMax) * 100;
      baselineAggregate = parseFloat((matric * 0.1 + fsc * 0.4 + testPct * 0.5).toFixed(2));
    } else {
      baselineAggregate = parseFloat((matric * 0.15 + fsc * 0.45 + fsc * 0.4).toFixed(2));
    }

    const user: StudentUser = {
      id: `usr-${Date.now()}`,
      name: fullName.trim() || 'Aspiring Student',
      contact: contactInfo.trim() || '+92 300 0000000',
      provider: authProvider,
      isPro: false,
      tier: 'Free',
      registeredAt: new Date().toISOString()
    };

    const profile: StudentProfile = {
      educationSystem,
      intermediateStream,
      hasAdditionalMath: intermediateStream === 'pre_medical' ? hasAdditionalMath : false,
      alevelSubjects: educationSystem === 'alevels' ? alevelSubjects : undefined,
      matricPercentage: matric,
      fscPercentage: fsc,
      entryTestScore: parsedTestScore,
      entryTestMax: parsedTestMax,
      calculatedAggregate: baselineAggregate,
      preferredCity,
      preferredProgram,
      sectorPreference: 'All',
      budgetPreference
    };

    onComplete(user, profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-700/60 flex items-center justify-center border border-emerald-500/40 text-sm">
                🇵🇰
              </div>
              <span className="font-black tracking-wide font-serif text-lg">
                PakUni Admissions Portal
              </span>
            </div>

            {canCloseWithoutComplete && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-emerald-200 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-emerald-900/60 transition-colors"
              >
                Skip / Close
              </button>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black mt-3 font-serif">
            {step === 1 && 'Welcome! Fast Sign-In'}
            {step === 2 && 'Your Educational Stream & Marks'}
            {step === 3 && 'Desired City, Program & Budget'}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            {step === 1 && 'Sign in to unlock personalized university recommendations & test target formulas.'}
            {step === 2 && 'Tell us if you are Pre-Med, Pre-Engineering, ICS or A-Levels so we can verify exact eligibility rules!'}
            {step === 3 && 'Customize your search preferences to find universities that match your career goals and budget.'}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`h-1.5 rounded-full transition-all ${
                step === 1 ? 'w-8 bg-emerald-300' : 'w-4 bg-emerald-600'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all ${
                step === 2 ? 'w-8 bg-emerald-300' : 'w-4 bg-emerald-600'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all ${
                step === 3 ? 'w-8 bg-emerald-300' : 'w-4 bg-emerald-600'
              }`}
            />
            <span className="text-[11px] font-semibold text-emerald-200 ml-auto">
              Step {step} of 3
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 text-sm flex-1">
          {/* STEP 1: Authentication */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                Choose Instant Sign-In Method:
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleQuickAuth('whatsapp')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    authProvider === 'whatsapp'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Phone className="w-4 h-4" />
                    <span className="font-bold text-xs">WhatsApp</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2">
                    Get test dates & alerts via WhatsApp
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickAuth('google')}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    authProvider === 'google'
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2 text-teal-700">
                    <Mail className="w-4 h-4" />
                    <span className="font-bold text-xs">Google Account</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-2">
                    Sync shortlist with Google
                  </span>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Muhammad Ali / Sarah Khan"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-emerald-500 focus:bg-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {authProvider === 'whatsapp' ? 'WhatsApp Mobile Number' : 'Email Address'}
                  </label>
                  <div className="relative">
                    {authProvider === 'whatsapp' ? (
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    ) : (
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    )}
                    <input
                      type="text"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      placeholder={
                        authProvider === 'whatsapp'
                          ? '0300 1234567'
                          : 'student@example.com'
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-emerald-500 focus:bg-white font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  100% Free exploration tier. No spam. You will immediately see university options tailored to your marks.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Background & Intermediate Stream */}
          {step === 2 && (
            <div className="space-y-4">
              {/* System Selector: FSc vs A-Levels */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select Educational System:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEducationSystem('fsc')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      educationSystem === 'fsc'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>FSc / Intermediate (HSSC)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEducationSystem('alevels')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      educationSystem === 'alevels'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>A-Levels (Cambridge / Edexcel)</span>
                  </button>
                </div>
              </div>

              {/* FSc Intermediate Streams */}
              {educationSystem === 'fsc' ? (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Choose Your Intermediate Stream:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIntermediateStream('pre_medical')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        intermediateStream === 'pre_medical'
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">FSc Pre-Medical</div>
                        <div className="text-[11px] text-slate-500">Biology, Chemistry, Physics</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIntermediateStream('pre_engineering')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        intermediateStream === 'pre_engineering'
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Atom className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">FSc Pre-Engineering</div>
                        <div className="text-[11px] text-slate-500">Math, Chemistry, Physics</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIntermediateStream('ics')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        intermediateStream === 'ics'
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">ICS (Computer Science)</div>
                        <div className="text-[11px] text-slate-500">CS, Math, Physics / Stats</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIntermediateStream('general_science')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        intermediateStream === 'general_science'
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">General Science</div>
                        <div className="text-[11px] text-slate-500">Math, Stats, Economics</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIntermediateStream('icom')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        intermediateStream === 'icom'
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">I.Com / Commerce</div>
                        <div className="text-[11px] text-slate-500">Accounting, Banking, Business</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIntermediateStream('fa_humanities')}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        intermediateStream === 'fa_humanities'
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">FA / Humanities</div>
                        <div className="text-[11px] text-slate-500">Arts, Civics, Education</div>
                      </div>
                    </button>
                  </div>

                  {/* Pre-Medical Special Options & HEC CS Rule Alert */}
                  {intermediateStream === 'pre_medical' && (
                    <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl space-y-2.5 text-xs">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-teal-900">
                            Pre-Medical to Computer Science (HEC Policy):
                          </span>
                          <p className="text-teal-800 text-[11px] mt-0.5 leading-relaxed">
                            Under revised HEC rules, Pre-Medical students are eligible for <strong>BS Computer Science, Software Engineering & AI</strong> at top universities (FAST, NUST, COMSATS, Bahria, ITU, Salim Habib, etc.) by taking 2 deficiency math courses in their 1st year!
                          </p>
                        </div>
                      </div>

                      <label className="flex items-center gap-2.5 pt-1.5 border-t border-teal-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hasAdditionalMath}
                          onChange={(e) => setHasAdditionalMath(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                        />
                        <span className="text-xs font-semibold text-slate-800">
                          I am taking or have passed <strong>Additional Mathematics</strong> from Board
                        </span>
                      </label>
                      {hasAdditionalMath && (
                        <p className="text-[11px] text-emerald-800 font-medium pl-6">
                          ✓ Having Additional Math unlocks all PEC-accredited Engineering (BE) programs as well!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* A-Levels Subject Selection */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Select Your A-Level Subjects:
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Select at least 3 subjects
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {COMMON_ALEVEL_SUBJECTS.map((subj) => {
                      const selected = alevelSubjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => toggleALevelSubject(subj)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            selected
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5" />}
                          <span>{subj}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>
                      For admission in Pakistani universities, you will need an <strong>IBCC Equivalence Certificate</strong>. Minimum 60% for Engineering and 65% for Medical (MDCAT required).
                    </span>
                  </div>
                </div>
              )}

              {/* Marks Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {educationSystem === 'alevels' ? 'O-Level Equivalence / %' : 'Matric Percentage (%)'}
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    step="0.1"
                    value={matricPercentage}
                    onChange={(e) => setMatricPercentage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-emerald-500 focus:bg-white font-bold"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    e.g. 88.5% (approx 975/1100)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {educationSystem === 'alevels' ? 'A-Level / AS-Level %' : 'FSc Part-1 / Total %'}
                  </label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    step="0.1"
                    value={fscPercentage}
                    onChange={(e) => setFscPercentage(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-emerald-500 focus:bg-white font-bold"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Part-1 or Total FSc marks
                  </span>
                </div>
              </div>

              {/* Optional Entry Test Score */}
              <div className="bg-amber-50/80 border border-amber-200 p-3.5 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Have you already taken any entrance exam?</span>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasTakenTest}
                      onChange={(e) => setHasTakenTest(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-700 text-xs">Yes, I have</span>
                  </label>
                </div>

                {!hasTakenTest ? (
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    <strong>Test score is completely optional!</strong> Since you are exploring universities, our system will automatically calculate the <strong>exact score you need in NET, NED Test, ECAT, or NU Test</strong> to secure admission!
                  </p>
                ) : (
                  <div className="pt-2 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Test Obtained Marks
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 142"
                        value={testScore}
                        onChange={(e) => setTestScore(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold focus:outline-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Total Test Marks
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 200"
                        value={testMax}
                        onChange={(e) => setTestMax(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-bold focus:outline-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Preferences (City, Program, and Semester Budget) */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Preferred City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preferred Campus City
                </label>
                <select
                  value={preferredCity}
                  onChange={(e) => setPreferredCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-500"
                >
                  <option value="Any">Any City in Pakistan (Show Best Matches)</option>
                  <option value="Karachi">Karachi (NED, Dawood, Habib, Salim Habib, DUHS, IBA)</option>
                  <option value="Islamabad">Islamabad (NUST, FAST, COMSATS, PIEAS, Al-Kauthar)</option>
                  <option value="Lahore">Lahore (PU, FAST, UET, LUMS, KEMU, COMSATS)</option>
                  <option value="Topi">Topi / Swabi (GIKI)</option>
                </select>
              </div>

              {/* Preferred Program */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Field of Study
                </label>
                <select
                  value={preferredProgram}
                  onChange={(e) => setPreferredProgram(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-500"
                >
                  <option value="Computing & IT">Computing & IT (BS CS, Software Engg, AI, Cyber Security)</option>
                  <option value="Engineering">Engineering (Mechanical, Electrical, Civil, Chemical)</option>
                  <option value="Medical & Health">Medical & Health (MBBS, BDS, Pharm-D)</option>
                  <option value="Business & Management">Business & Management (BBA, Accounting & Finance)</option>
                  <option value="Law & Humanities">Social Sciences & Humanities</option>
                </select>
              </div>

              {/* Background Compatibility Notice */}
              {educationSystem === 'fsc' && intermediateStream === 'pre_medical' && preferredProgram === 'Computing & IT' && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Pre-Med Match:</strong> We will highlight Pakistani universities admitting Pre-Med students for Computing & IT under HEC deficiency math rules!
                  </span>
                </div>
              )}

              {/* Preferred Semester Fee Budget */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Preferred Semester Fee Budget (Optional)
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Optional — Leave as Any if open
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setBudgetPreference('Any')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      budgetPreference === 'Any'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>Any Budget Range</div>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Show both public and private universities
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBudgetPreference('below_50k')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      budgetPreference === 'below_50k'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>Below Rs. 50,000 / semester</div>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Public subsidized: NED, PU, UET, DUET, DUHS
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBudgetPreference('below_100k')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      budgetPreference === 'below_100k'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>Below Rs. 100,000 / semester</div>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Mid-range public & affordable private
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBudgetPreference('below_150k')}
                    className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                      budgetPreference === 'below_150k'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>Below Rs. 150,000 / semester</div>
                    <span className="text-[11px] text-slate-500 font-normal">
                      COMSATS, Salim Habib, Air, Bahria
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-colors"
            >
              <span>Find My Best-Fit Universities</span>
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
