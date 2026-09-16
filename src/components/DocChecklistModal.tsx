import React, { useState } from 'react';
import { X, FileCheck, CheckSquare, Square, Info, ShieldAlert } from 'lucide-react';

interface DocChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  category: 'Mandatory' | 'O/A-Levels' | 'Result Awaiting' | 'Special';
  detail: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'ssc',
    title: 'Matric / SSC Certificate & Sanad',
    category: 'Mandatory',
    detail: 'Original marksheet and passing certificate (attested copies by Grade-17+ gazetted officer).'
  },
  {
    id: 'hssc',
    title: 'FSc / HSSC Part-1 (or Part-2) Marksheet',
    category: 'Mandatory',
    detail: 'Official board marksheet showing physics, math/biology, chemistry/computer marks.'
  },
  {
    id: 'cnic',
    title: 'Candidate CNIC / NADRA B-Form Copy',
    category: 'Mandatory',
    detail: 'Photocopy of national identity card or child registration certificate (B-Form).'
  },
  {
    id: 'father_cnic',
    title: 'Father / Guardian CNIC Copy',
    category: 'Mandatory',
    detail: 'Required on admission forms and financial aid/Ehsaas application forms.'
  },
  {
    id: 'domicile',
    title: 'District Domicile Certificate & PRC',
    category: 'Mandatory',
    detail: 'Essential for provincial medical (MDCAT Punjab/Sindh/KPK) and government engineering (UET/NED) quota seats.'
  },
  {
    id: 'ibcc',
    title: 'IBCC Equivalence Certificate (O / A-Levels)',
    category: 'O/A-Levels',
    detail: 'Must be issued by Inter Board Coordination Commission (IBCC) with converted Pakistani percentages.'
  },
  {
    id: 'hope_cert',
    title: 'College Hope Certificate (If Result Awaiting)',
    category: 'Result Awaiting',
    detail: 'Signed by your college principal stating you will achieve minimum required marks (e.g. 60% or 65%).'
  },
  {
    id: 'hafiz',
    title: 'Hafiz-e-Quran Sanad (Wafaq-ul-Madaris)',
    category: 'Special',
    detail: 'Allows you to appear in the 20-mark oral Hifz test conducted by public universities.'
  },
  {
    id: 'challan',
    title: 'Stamped Bank Challan Copy / Online Receipt',
    category: 'Mandatory',
    detail: 'Keep the Student Copy of paid application fees (HBL, Askari Bank, Meezan, or 1Link Kuickpay).'
  }
];

export const DocChecklistModal: React.FC<DocChecklistModalProps> = ({ isOpen, onClose }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    ssc: true,
    cnic: true
  });

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const total = CHECKLIST_ITEMS.length;
  const readyCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPct = Math.round((readyCount / total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                Pakistani Admissions Document Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Track required verifications, domicile & IBCC equivalence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
          <div className="text-xs font-semibold text-emerald-900">
            Document Readiness: {readyCount} of {total} completed ({progressPct}%)
          </div>
          <div className="w-32 bg-emerald-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* List of documents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5 text-emerald-600">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${
                        isChecked ? 'text-emerald-900 line-through decoration-emerald-500' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        item.category === 'Mandatory'
                          ? 'bg-rose-100 text-rose-700'
                          : item.category === 'O/A-Levels'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Attestation Tip:</strong> Keep 8-10 passport-sized blue-background photos and 4 sets of attested photocopies ready. Once admitted, universities will require physical verification of original documents.
          </span>
        </div>
      </div>
    </div>
  );
};
