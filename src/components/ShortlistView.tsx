import React, { useState } from 'react';
import {
  BookmarkCheck,
  Building,
  ExternalLink,
  Trash2,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  CheckCircle2,
  Clock,
  Edit3
} from 'lucide-react';
import { University, ProgramOffering, ShortlistItem, ApplicationStage } from '../types';
import { formatPKR, getAdmissionChance } from '../utils/aggregateCalculator';

interface ShortlistViewProps {
  universities: University[];
  shortlistItems: ShortlistItem[];
  userAggregate: number | null;
  onRemoveItem: (id: string) => void;
  onUpdateStage: (id: string, stage: ApplicationStage) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onSwitchToFinder: () => void;
}

const STAGES: ApplicationStage[] = [
  'Considering',
  'Form Incomplete',
  'Challan Paid',
  'Admit Card Issued',
  'Exam Done',
  'Merit Awaited',
  'Selected / Admitted'
];

export const ShortlistView: React.FC<ShortlistViewProps> = ({
  universities,
  shortlistItems,
  userAggregate,
  onRemoveItem,
  onUpdateStage,
  onUpdateNotes,
  onSwitchToFinder
}) => {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');

  const currentAggregate = userAggregate ?? 78.5;

  // Hydrate shortlist items with university & program data
  const hydratedItems = shortlistItems
    .map((item) => {
      const university = universities.find((u) => u.id === item.universityId);
      const program = university?.programs.find((p) => p.id === item.programId);
      if (!university || !program) return null;
      return { item, university, program };
    })
    .filter(Boolean) as Array<{
    item: ShortlistItem;
    university: University;
    program: ProgramOffering;
  }>;

  const handleStartEditNotes = (item: ShortlistItem) => {
    setEditingNotesId(item.id);
    setTempNotes(item.notes || '');
  };

  const handleSaveNotes = (id: string) => {
    onUpdateNotes(id, tempNotes);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
              My University Shortlist & Application Tracker
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your applied universities, fee challan payments, entry test status, and merit list results in one place.
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
          {hydratedItems.length} Universities Shortlisted
        </div>
      </div>

      {hydratedItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Your shortlist is currently empty</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Browse universities and programs in the Uni Finder and click "Shortlist" to save your favorite options here.
          </p>
          <button
            type="button"
            onClick={onSwitchToFinder}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs"
          >
            Explore University Finder
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {hydratedItems.map(({ item, university, program }) => {
            const chance = getAdmissionChance(currentAggregate, program.closingMeritLastYear);
            const isEditingNotes = editingNotesId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-lg text-slate-900 font-serif">
                        {university.name} ({university.shortName})
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        {university.sector}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                      <span className="font-bold text-emerald-700 text-sm">
                        {program.name}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {university.city}
                      </span>
                      <span className="text-slate-400">|</span>
                      <span>Closing Merit: <strong>{program.closingMeritLastYear}%</strong></span>
                      <span className="text-slate-400">|</span>
                      <span className="text-emerald-700 font-bold">
                        {formatPKR(program.perSemesterFeePKR)}/sem
                      </span>
                    </div>
                  </div>

                  {/* Right: Admission chance & Remove */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${chance.badgeClass}`}
                    >
                      {chance.label}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Application Stage Pipeline */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Application Progress Stage:</span>
                    </span>
                    <select
                      value={item.stage}
                      onChange={(e) =>
                        onUpdateStage(item.id, e.target.value as ApplicationStage)
                      }
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white text-emerald-800 focus:outline-emerald-500"
                    >
                      {STAGES.map((stg) => (
                        <option key={stg} value={stg}>
                          {stg}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Stage Visual Track */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 text-[11px] pt-1">
                    {STAGES.map((stg, idx) => {
                      const currentIdx = STAGES.indexOf(item.stage);
                      const isPastOrCurrent = idx <= currentIdx;
                      return (
                        <button
                          key={stg}
                          type="button"
                          onClick={() => onUpdateStage(item.id, stg)}
                          className={`p-1.5 text-center rounded-md font-semibold transition-all ${
                            isPastOrCurrent
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          {stg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Personal Student Notes */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Application Notes & Credentials:</span>
                    </span>
                    {!isEditingNotes && (
                      <button
                        type="button"
                        onClick={() => handleStartEditNotes(item)}
                        className="text-[11px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Note</span>
                      </button>
                    )}
                  </div>

                  {isEditingNotes ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Add your application ID, challan branch, test center chosen, or reminders..."
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-normal focus:outline-emerald-500"
                        rows={2}
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNotesId(null)}
                          className="px-2.5 py-1 text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(item.id)}
                          className="px-3 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 italic">
                      {item.notes || 'No notes added yet (click "Edit Note" to log challan number or test center).'}
                    </p>
                  )}
                </div>

                {/* Footer Portal Links */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500">
                    Required Test: <strong>{program.entryTestRequired}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={university.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      University Site
                    </a>
                    <a
                      href={university.admissionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center gap-1 shadow-xs"
                    >
                      <span>Open Application Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
