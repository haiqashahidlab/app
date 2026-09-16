import React, { useState } from 'react';
import {
  Scale,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  Award,
  DollarSign,
  GraduationCap,
  Sparkles,
  MapPin,
  PhoneCall,
  FileText,
  Star,
  Check
} from 'lucide-react';
import { University, ProgramOffering } from '../types';
import { formatPKR, getAdmissionChance } from '../utils/aggregateCalculator';

interface ProgramComparatorProps {
  universities: University[];
  userAggregate: number | null;
  comparingItems: Array<{ university: University; program: ProgramOffering }>;
  onRemoveFromCompare: (universityId: string, programId: string) => void;
  onAddOfferingToCompare: (university: University, program: ProgramOffering) => void;
  onClearComparison: () => void;
  interestedProgramIds?: string[];
  onToggleInterest?: (university: University, program: ProgramOffering) => void;
  onOpenDocsModal?: (university: University) => void;
}

export const ProgramComparator: React.FC<ProgramComparatorProps> = ({
  universities,
  userAggregate,
  comparingItems,
  onRemoveFromCompare,
  onAddOfferingToCompare,
  onClearComparison,
  interestedProgramIds = [],
  onToggleInterest,
  onOpenDocsModal
}) => {
  const [selectedAddUniId, setSelectedAddUniId] = useState<string>('');
  const [selectedAddProgId, setSelectedAddProgId] = useState<string>('');

  const currentAggregate = userAggregate ?? 78.5;

  // Find university selected in the addition dropdown
  const currentSelectedUni = universities.find((u) => u.id === selectedAddUniId);

  const handleAddCustom = () => {
    if (!currentSelectedUni || !selectedAddProgId) return;
    const prog = currentSelectedUni.programs.find((p) => p.id === selectedAddProgId);
    if (!prog) return;
    onAddOfferingToCompare(currentSelectedUni, prog);
    setSelectedAddProgId('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
              Multi-University Program Comparator
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare closing merits, semester fees, entrance test requirements, and document checklists side-by-side.
          </p>
        </div>

        {comparingItems.length > 0 && (
          <button
            type="button"
            onClick={onClearComparison}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
          >
            Clear All ({comparingItems.length})
          </button>
        )}
      </div>

      {/* Add University to Compare Bar */}
      <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-indigo-600" />
          <span>Add University to Compare:</span>
        </span>

        <select
          value={selectedAddUniId}
          onChange={(e) => {
            setSelectedAddUniId(e.target.value);
            setSelectedAddProgId('');
          }}
          className="px-3 py-2 bg-white rounded-lg border border-indigo-200 font-medium text-slate-800 focus:outline-indigo-500"
        >
          <option value="">Select University...</option>
          {universities.map((uni) => (
            <option key={uni.id} value={uni.id}>
              {uni.shortName} ({uni.city})
            </option>
          ))}
        </select>

        {currentSelectedUni && (
          <select
            value={selectedAddProgId}
            onChange={(e) => setSelectedAddProgId(e.target.value)}
            className="px-3 py-2 bg-white rounded-lg border border-indigo-200 font-medium text-slate-800 focus:outline-indigo-500"
          >
            <option value="">Select Program...</option>
            {currentSelectedUni.programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} (Closing: {p.closingMeritLastYear}%)
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          disabled={!selectedAddUniId || !selectedAddProgId}
          onClick={handleAddCustom}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add to Comparison
        </button>

        <span className="text-[11px] text-indigo-700 ml-auto hidden md:inline">
          {comparingItems.length} of 4 maximum slots selected
        </span>
      </div>

      {/* Comparison Table Matrix */}
      {comparingItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            No universities selected for comparison yet
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Choose universities from the dropdown above or click the "Scale" icon on any program card in the Uni Finder to see an authentic side-by-side comparison!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-44">
                  Criterion
                </th>
                {comparingItems.map(({ university, program }) => (
                  <th
                    key={`${university.id}_${program.id}`}
                    className="p-4 text-sm font-bold text-slate-900 border-l border-slate-200 min-w-[220px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-extrabold text-base text-slate-900 font-serif">
                          {university.shortName}
                        </div>
                        <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                          {program.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          <span>{university.city}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveFromCompare(university.id, program.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {/* Admission Probability */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                  Admission Chance
                </td>
                {comparingItems.map(({ university, program }) => {
                  const chance = getAdmissionChance(currentAggregate, program.closingMeritLastYear);
                  return (
                    <td
                      key={`${university.id}_${program.id}`}
                      className="p-4 border-l border-slate-200"
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${chance.badgeClass}`}
                      >
                        <span>{chance.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        Aggregate: <strong>{currentAggregate}%</strong> (Closing: {program.closingMeritLastYear}%)
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Entrance Exam & Formula */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                  Entrance Exam & Merit Formula
                </td>
                {comparingItems.map(({ university, program }) => (
                  <td
                    key={`${university.id}_${program.id}`}
                    className="p-4 border-l border-slate-200"
                  >
                    <div className="font-bold text-slate-900 text-sm">
                      {program.entryTestRequired}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Formula: <strong>{program.formulaDescription}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Subjects: {program.testSubjects}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Fee Per Semester */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                  Semester & Total Cost
                </td>
                {comparingItems.map(({ university, program }) => (
                  <td
                    key={`${university.id}_${program.id}`}
                    className="p-4 border-l border-slate-200"
                  >
                    <div className="font-extrabold text-sm text-emerald-700">
                      {formatPKR(program.perSemesterFeePKR)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Est. 4-Yr Total: {formatPKR(program.totalEstimatedCostPKR)}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Accreditation */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                  Accreditation & Sector
                </td>
                {comparingItems.map(({ university, program }) => (
                  <td
                    key={`${university.id}_${program.id}`}
                    className="p-4 border-l border-slate-200"
                  >
                    <span className="font-semibold text-slate-800">
                      {program.accreditation}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {university.sector} • {university.hecRanking}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Documents Checklist Requirement */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                  Scraped Documents List
                </td>
                {comparingItems.map(({ university, program }) => (
                  <td
                    key={`${university.id}_${program.id}`}
                    className="p-4 border-l border-slate-200"
                  >
                    <div className="text-[11px] text-slate-700 mb-1">
                      <strong>{university.documentsRequired.length}</strong> mandatory documents
                    </div>
                    {onOpenDocsModal && (
                      <button
                        type="button"
                        onClick={() => onOpenDocsModal(university)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span>View Verified Dossier</span>
                      </button>
                    )}
                  </td>
                ))}
              </tr>

              {/* Hostels & Transport */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                  Hostel & Transport
                </td>
                {comparingItems.map(({ university, program }) => (
                  <td
                    key={`${university.id}_${program.id}`}
                    className="p-4 border-l border-slate-200"
                  >
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      {university.hostelsAvailable ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Hostels: {university.hostelsAvailable ? 'Available' : 'No Hostels'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-800 mt-1">
                      {university.transportAvailable ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-400" />
                      )}
                      <span>Buses: {university.transportAvailable ? 'Available' : 'Independent'}</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Scholarships Available */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-700 bg-slate-50/30">
                  Scholarships & Aid
                </td>
                {comparingItems.map(({ university, program }) => (
                  <td
                    key={`${university.id}_${program.id}`}
                    className="p-4 border-l border-slate-200"
                  >
                    <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-600">
                      {university.scholarships.slice(0, 3).map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr className="bg-slate-50/80">
                <td className="p-4 font-bold text-slate-700">Actions & Connection</td>
                {comparingItems.map(({ university, program }) => (
                  <td
                    key={`${university.id}_${program.id}`}
                    className="p-4 border-l border-slate-200"
                  >
                    <div className="flex flex-col gap-2">
                      {onToggleInterest && (
                        <button
                          type="button"
                          onClick={() => onToggleInterest(university, program)}
                          className={`px-3 py-1.5 rounded-lg text-center text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition-colors ${
                            interestedProgramIds.includes(`${university.id}_${program.id}`)
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {interestedProgramIds.includes(`${university.id}_${program.id}`) ? (
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
                      )}

                      <a
                        href={university.admissionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-center hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span>Apply Online</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
