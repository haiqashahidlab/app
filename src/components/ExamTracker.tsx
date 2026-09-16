import React, { useState } from 'react';
import {
  CalendarCheck,
  Clock,
  ExternalLink,
  Bell,
  BellRing,
  AlertCircle,
  HelpCircle,
  FileText,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { EntranceExam } from '../types';
import { formatPKR } from '../utils/aggregateCalculator';

interface ExamTrackerProps {
  exams: EntranceExam[];
  onToggleExamReminder: (examId: string) => void;
}

export const ExamTracker: React.FC<ExamTrackerProps> = ({
  exams,
  onToggleExamReminder
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Registration Open' | 'Upcoming'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamDetail, setSelectedExamDetail] = useState<EntranceExam | null>(null);

  // Calculate days remaining helper
  const getDaysRemaining = (targetDateStr: string): { days: number; text: string; isPast: boolean } => {
    const target = new Date(targetDateStr);
    const today = new Date();
    // Reset time part
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { days: Math.abs(diffDays), text: `${Math.abs(diffDays)} days ago`, isPast: true };
    } else if (diffDays === 0) {
      return { days: 0, text: 'Today!', isPast: false };
    } else {
      return { days: diffDays, text: `${diffDays} days left`, isPast: false };
    }
  };

  const filteredExams = exams.filter((exam) => {
    if (statusFilter !== 'All' && exam.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = exam.name.toLowerCase().includes(q);
      const matchUni = exam.universityOrBody.toLowerCase().includes(q);
      const matchSub = exam.testPattern.subjects.toLowerCase().includes(q);
      if (!matchName && !matchUni && !matchSub) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
              Pakistani University Entrance Exam Schedule
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track test dates, registration deadlines, syllabus patterns, and negative marking rules for NET, ECAT, MDCAT, NU Test & more.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Tests ({exams.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Registration Open')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'Registration Open'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Open Now ({exams.filter((e) => e.status === 'Registration Open').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('Upcoming')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'Upcoming'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by test name (NET, ECAT, MDCAT, NU Test, NAT)..."
          className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-emerald-500 shadow-xs"
        />
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExams.map((exam) => {
          const regDays = getDaysRemaining(exam.registrationEndDate);
          const examDays = getDaysRemaining(exam.examDate);

          return (
            <div
              key={exam.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Status & University Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {exam.universityOrBody}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-0.5 font-serif">
                      {exam.name}
                    </h3>
                    <span className="text-xs font-semibold text-emerald-700 block">
                      {exam.series}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                      exam.status === 'Registration Open'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : exam.status === 'Upcoming'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {exam.status}
                  </span>
                </div>

                {/* Deadlines Countdown Box */}
                <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Registration Deadline:</span>
                    </span>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">
                      {exam.registrationEndDate}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-0.5 inline-block ${
                        regDays.isPast ? 'text-slate-400' : 'text-rose-600'
                      }`}
                    >
                      {regDays.text}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Exam Date:</span>
                    </span>
                    <div className="font-bold text-slate-900 text-xs mt-0.5">
                      {exam.examDate}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-0.5 inline-block ${
                        examDays.isPast ? 'text-slate-400' : 'text-amber-600'
                      }`}
                    >
                      {examDays.text}
                    </span>
                  </div>
                </div>

                {/* Syllabus and Negative Marking alert */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-500 shrink-0">Negative Marking:</span>
                    <span
                      className={`font-bold ${
                        exam.testPattern.negativeMarking
                          ? 'text-rose-600'
                          : 'text-emerald-700'
                      }`}
                    >
                      {exam.testPattern.negativeMarking
                        ? 'Yes (-0.25 mark per wrong MCQ)'
                        : 'No Negative Marking'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Test Duration & Marks:</span>
                    <span className="font-semibold text-slate-800">
                      {exam.testPattern.durationMinutes} mins | {exam.testPattern.totalMarks} Marks
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Challan Fee:</span>
                    <span className="font-bold text-slate-900">
                      {formatPKR(exam.testFeePKR)}
                    </span>
                  </div>
                </div>

                {/* Subject coverage snippet */}
                <div className="mt-3 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-700">Subjects: </span>
                  <span>{exam.testPattern.subjects}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onToggleExamReminder(exam.id)}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                    exam.reminderSet
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {exam.reminderSet ? (
                    <>
                      <BellRing className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reminder Active</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5 text-slate-400" />
                      <span>Notify Me</span>
                    </>
                  )}
                </button>

                <a
                  href={exam.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <span>Register on Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
