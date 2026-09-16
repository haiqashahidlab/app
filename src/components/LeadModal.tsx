import React, { useState } from 'react';
import {
  Sparkles,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Building,
  FileText,
  ShieldCheck,
  Download,
  Share2,
  X
} from 'lucide-react';
import { University, ProgramOffering, StudentUser, UniversityLead } from '../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  university: University | null;
  program: ProgramOffering | null;
  currentUser: StudentUser | null;
  userMatric: number;
  userFsc: number;
  onSubmitLead: (lead: UniversityLead) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  university,
  program,
  currentUser,
  userMatric,
  userFsc,
  onSubmitLead
}) => {
  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [contact, setContact] = useState(currentUser?.contact || '');
  const [studentCity, setStudentCity] = useState(university?.city || 'Karachi');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !university || !program) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: UniversityLead = {
      id: `lead-${Date.now()}`,
      studentName: studentName.trim() || 'Aspiring Student',
      studentContact: contact.trim() || '+92 300 1234567',
      studentCity,
      universityId: university.id,
      universityName: university.name,
      programName: program.name,
      matricPct: userMatric,
      fscPct: userFsc,
      createdDate: new Date().toISOString(),
      status: 'Fresh Lead'
    };

    onSubmitLead(newLead);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 relative">
          <button
            type="button"
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/40">
              Direct Admission Connection
            </span>
          </div>

          <h3 className="text-xl font-extrabold mt-2 font-serif">
            Express Interest in {university.shortName}
          </h3>
          <p className="text-xs text-emerald-100 mt-1">
            Request an official prospectus, scholarship counseling, and fast-track callback for <strong>{program.name}</strong>.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 font-serif">
                  Interest Successfully Registered!
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Your academic profile for <strong>{program.name}</strong> has been logged. The admissions team at <strong>{university.name}</strong> has been notified to send fee details & scholarship guidelines to <strong>{contact}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs text-slate-700 text-left space-y-1">
                <div className="font-bold text-slate-900">What happens next?</div>
                <div className="text-[11px] text-slate-600">
                  • 2026 Admissions Prospectus dispatched via WhatsApp/Email.
                </div>
                <div className="text-[11px] text-slate-600">
                  • Guidance on entrance test syllabus & scholarship eligibility.
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Target Program:</span>
                  <span className="font-bold text-slate-800">{program.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Estimated Fee:</span>
                  <span className="font-bold text-emerald-700">Rs. {program.perSemesterFeePKR.toLocaleString()}/sem</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Ali Ahmed"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Number (For Prospectus & Test Updates)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="0300 1234567"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Living City / Domicile
                </label>
                <input
                  type="text"
                  required
                  value={studentCity}
                  onChange={(e) => setStudentCity(e.target.value)}
                  placeholder="e.g. Karachi, Rawalpindi, Lahore"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:outline-emerald-500 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2 text-xs text-indigo-900">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                <span className="text-[11px] leading-relaxed">
                  Your academic record (Matric: {userMatric}% | FSc: {userFsc}%) will be forwarded so counselors can pre-evaluate your scholarship bracket!
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <span>Submit Interest & Request Official Callback</span>
                <Sparkles className="w-4 h-4 text-emerald-200" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
