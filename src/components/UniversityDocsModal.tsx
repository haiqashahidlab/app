import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Circle,
  Building,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Printer,
  X
} from 'lucide-react';
import { University } from '../types';

interface UniversityDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  university: University | null;
}

export const UniversityDocsModal: React.FC<UniversityDocsModalProps> = ({
  isOpen,
  onClose,
  university
}) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  if (!isOpen || !university) return null;

  const toggleCheck = (idx: number) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [`${university.id}-${idx}`]: !prev[`${university.id}-${idx}`]
    }));
  };

  const totalDocs = university.documentsRequired.length;
  const readyCount = university.documentsRequired.filter((_, idx) => checkedDocs[`${university.id}-${idx}`]).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/40">
              Official Scraped Requirements
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black mt-2 font-serif">
            {university.name}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Mandatory admission dossier and document verification list for undergraduate applicants in {university.city}.
          </p>

          {/* Progress Bar */}
          <div className="mt-4 bg-white/10 rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-300">
              Document Readiness: <strong className="text-white">{readyCount} of {totalDocs} prepared</strong>
            </span>
            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all"
                style={{ width: `${(readyCount / totalDocs) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Documents Checklist List */}
        <div className="p-6 overflow-y-auto space-y-3 text-slate-800 text-xs flex-1">
          <div className="text-slate-500 text-[11px] mb-2">
            Tick the items you have already arranged or attested:
          </div>

          {university.documentsRequired.map((doc, idx) => {
            const isChecked = !!checkedDocs[`${university.id}-${idx}`];
            return (
              <div
                key={idx}
                onClick={() => toggleCheck(idx)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-white'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                <div className="leading-relaxed font-medium flex-1">
                  <span>{doc}</span>
                </div>
              </div>
            );
          })}

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Important Attestation Protocol:</span>
            </div>
            <p className="leading-relaxed">
              All photocopies must be attested by a Gazetted Officer (Grade 17 or above). Result-awaiting applicants must attach a verified <strong>Hope Certificate</strong> signed by their college principal.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href={university.admissionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Visit {university.shortName} Admissions Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
