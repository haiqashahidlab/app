import React, { useState, useEffect } from 'react';
import { X, Calculator, ArrowRight, HelpCircle, Sparkles, Check } from 'lucide-react';
import { FORMULA_PRESETS, calculateAggregate } from '../utils/aggregateCalculator';
import { FormulaConfig } from '../types';

interface AggregateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyAggregate: (aggregate: number, marksData: {
    matricObt: number;
    matricTot: number;
    fscObt: number;
    fscTot: number;
    testObt: number;
    testTot: number;
    formulaName: string;
  }) => void;
  initialAggregate?: number | null;
}

export const AggregateCalculatorModal: React.FC<AggregateCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyAggregate
}) => {
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('nust');
  const [matricObt, setMatricObt] = useState<number>(980);
  const [matricTot, setMatricTot] = useState<number>(1100);
  const [fscObt, setFscObt] = useState<number>(470);
  const [fscTot, setFscTot] = useState<number>(550); // HSSC-1 or 1100
  const [testObt, setTestObt] = useState<number>(142);
  const [appliedNotification, setAppliedNotification] = useState(false);

  const activeFormula: FormulaConfig =
    FORMULA_PRESETS.find((f) => f.id === selectedFormulaId) || FORMULA_PRESETS[0];

  // Update test max marks when formula changes
  const testTot = activeFormula.testMaxMarks;

  const currentAggregate = calculateAggregate(
    matricObt,
    matricTot,
    fscObt,
    fscTot,
    testObt,
    testTot,
    activeFormula
  );

  const matricPct = matricTot > 0 ? ((matricObt / matricTot) * 100).toFixed(1) : '0';
  const fscPct = fscTot > 0 ? ((fscObt / fscTot) * 100).toFixed(1) : '0';
  const testPct = testTot > 0 ? ((testObt / testTot) * 100).toFixed(1) : '0';

  if (!isOpen) return null;

  const handleApply = () => {
    onApplyAggregate(currentAggregate, {
      matricObt,
      matricTot,
      fscObt,
      fscTot,
      testObt,
      testTot,
      formulaName: activeFormula.name
    });
    setAppliedNotification(true);
    setTimeout(() => {
      setAppliedNotification(false);
      onClose();
    }, 600);
  };

  const handleQuickPreset = (type: 'nust-high' | 'fast-target' | 'mdcat') => {
    if (type === 'nust-high') {
      setSelectedFormulaId('nust');
      setMatricObt(1010);
      setMatricTot(1100);
      setFscObt(495);
      setFscTot(550);
      setTestObt(152);
    } else if (type === 'fast-target') {
      setSelectedFormulaId('fast');
      setMatricObt(950);
      setMatricTot(1100);
      setFscObt(890);
      setFscTot(1100);
      setTestObt(78);
    } else {
      setSelectedFormulaId('pmdc');
      setMatricObt(1035);
      setMatricTot(1100);
      setFscObt(1015);
      setFscTot(1100);
      setTestObt(178);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-serif">
                Pakistani University Merit Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Official weighting formulas for NUST, FAST, UET, PMDC & COMSATS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Preset Buttons */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Example Profiles:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset('nust-high')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                NUST NET CS Profile (~81%)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('fast-target')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                FAST NU Test Profile (~74%)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('mdcat')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                Medical PMDC MDCAT (~90%)
              </button>
            </div>
          </div>

          {/* Formula Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select University Formula:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FORMULA_PRESETS.map((formula) => (
                <button
                  key={formula.id}
                  type="button"
                  onClick={() => setSelectedFormulaId(formula.id)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    selectedFormulaId === formula.id
                      ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-semibold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold text-slate-900">{formula.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{formula.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            {/* Matric Row */}
            {activeFormula.matricWeight > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-800">
                    Matric / O-Level ({activeFormula.matricWeight}%)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {matricPct}% achieved
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    value={matricObt}
                    onChange={(e) => setMatricObt(Number(e.target.value))}
                    max={matricTot}
                    min={0}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={matricTot}
                    onChange={(e) => setMatricTot(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-emerald-500"
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 italic py-1">
                ℹ️ Matric marks are not weighted in this university's undergraduate formula.
              </div>
            )}

            {/* FSc Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  FSc / ICS / A-Level ({activeFormula.fscWeight}%)
                </label>
                <span className="text-[11px] text-slate-500">
                  {fscPct}% (Part-1 or Total)
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Marks Obtained</label>
                <input
                  type="number"
                  value={fscObt}
                  onChange={(e) => setFscObt(Number(e.target.value))}
                  max={fscTot}
                  min={0}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold focus:outline-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Total Marks</label>
                <input
                  type="number"
                  value={fscTot}
                  onChange={(e) => setFscTot(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm focus:outline-emerald-500"
                />
              </div>
            </div>

            {/* Entry Test Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-800">
                  {activeFormula.testName} ({activeFormula.testWeight}%)
                </label>
                <span className="text-[11px] text-slate-500">
                  {testPct}% achieved
                </span>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Marks Obtained</label>
                <input
                  type="number"
                  value={testObt}
                  onChange={(e) => setTestObt(Number(e.target.value))}
                  max={testTot}
                  min={0}
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-sm font-semibold focus:outline-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Total Marks</label>
                <input
                  type="number"
                  value={testTot}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 rounded-lg border border-slate-200 text-sm text-slate-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Aggregate Result Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-100 font-medium">
                Calculated Admission Aggregate
              </div>
              <div className="text-4xl font-extrabold tracking-tight mt-1 flex items-baseline gap-2">
                <span>{currentAggregate}%</span>
                <span className="text-xs font-normal text-emerald-200">
                  ({activeFormula.name.split('(')[0]})
                </span>
              </div>
              <div className="text-xs text-emerald-100/90 mt-1">
                {activeFormula.description}
              </div>
            </div>

            <button
              type="button"
              id="btn-apply-aggregate-modal"
              onClick={handleApply}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-emerald-800 font-bold text-sm hover:bg-emerald-50 transition-colors shadow flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {appliedNotification ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Applied!</span>
                </>
              ) : (
                <>
                  <span>Apply to Uni Finder</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Guidance Note */}
          <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              <strong>Pakistani Board Tip:</strong> If your FSc Part-2 final result is awaiting, most universities calculate preliminary admission merit on your FSc Part-1 marks (550 total) or 1st year equivalent, and confirm admission subject to minimum 60% in final board results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
