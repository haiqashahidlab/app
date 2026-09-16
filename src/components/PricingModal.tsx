import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Lock,
  Zap,
  ShieldCheck,
  CreditCard,
  PhoneCall,
  Flame,
  X
} from 'lucide-react';
import { StudentUser } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  onUpgradeToPro: (tier: 'EarlyBird900' | 'Tier1000' | 'Standard1500') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradeToPro
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'easypaisa' | 'jazzcash' | 'raast'>('jazzcash');
  const [claimedCount] = useState<number>(76); // 76 out of 100 early birds claimed

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    onUpgradeToPro('EarlyBird900');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Early Bird Admission Pass</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black mt-3 font-serif">
            Upgrade to PakUni Pro Pass
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            Ensure your seat in top Pakistani universities. Get precise entry test target scores, official document checklists, and 1-on-1 AI counseling.
          </p>

          {/* Slots counter */}
          <div className="mt-4 bg-white/10 rounded-2xl p-3 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-slate-300">First 100 Students Offer: </span>
              <strong className="text-amber-300 font-extrabold text-sm">Rs. 900 PKR</strong>
              <span className="text-slate-400 line-through ml-2">Rs. 1,500</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-white/20">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${claimedCount}%` }}
                />
              </div>
              <span className="text-emerald-300 font-bold text-[11px]">
                {100 - claimedCount} slots left!
              </span>
            </div>
          </div>
        </div>

        {/* Comparison Tier Grid */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Free Tier */}
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 flex flex-col justify-between">
              <div>
                <div className="font-extrabold text-sm text-slate-700 uppercase tracking-wider">
                  Free Student Tier
                </div>
                <div className="text-2xl font-black text-slate-900 mt-1 font-serif">
                  Rs. 0
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Ideal for initial browsing and basic orientation.
                </p>

                <ul className="mt-4 space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Basic university search & filters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Entrance exam dates & registration calendar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>General merit aggregate calculator</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Free access to admissions guidance blogs</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-400">
                    <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Locked target test score predictor</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-400">
                    <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Locked university scraped document checklists</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200 text-slate-500 font-semibold text-center">
                Current Plan
              </div>
            </div>

            {/* Pro Pass (Current Offer: Rs. 900) */}
            <div className="rounded-2xl border-2 border-emerald-500 p-4 bg-emerald-50/50 shadow-md relative flex flex-col justify-between">
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <div className="font-extrabold text-sm text-emerald-900 uppercase tracking-wider">
                  PakUni Pro Pass
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 font-serif">
                    Rs. 900
                  </span>
                  <span className="text-slate-500 font-semibold">one-time</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Full 2026 admissions cycle access. No subscriptions.
                </p>

                <ul className="mt-4 space-y-2 text-slate-700 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Required Test Score Calculator:</strong> Exact marks required in NET, NU Test, NED Test to secure admission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Official Document Checklists:</strong> Scraped directly from NED, NUST, FAST, PU, GIKI, Habib prospectuses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Multi-University Program Comparator:</strong> 4-way side-by-side fee & merit matrix</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Priority Lead Generation:</strong> University admissions staff callbacks & free PDF prospectuses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>PakUni AI Admission Counselor:</strong> Unlimited 24/7 personalized academic strategy</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-emerald-200">
                <div className="text-[11px] text-emerald-900 font-bold mb-2">
                  Pricing Schedule:
                </div>
                <div className="text-[10px] text-slate-600 space-y-0.5">
                  <div>• First 100 students: <strong>Rs. 900 PKR</strong> (Current)</div>
                  <div>• Next 100 students: <strong>Rs. 1,000 PKR</strong></div>
                  <div>• Future applicants: <strong>Rs. 1,500 PKR</strong></div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Options Simulation */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <span className="font-bold text-slate-700 block">
              Choose Payment Method (Pakistan Instant Transfers):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('jazzcash')}
                className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                  selectedMethod === 'jazzcash'
                    ? 'border-red-600 bg-red-50 text-red-700 ring-2 ring-red-500/20'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                JazzCash
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('easypaisa')}
                className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                  selectedMethod === 'easypaisa'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                Easypaisa
              </button>
              <button
                type="button"
                onClick={() => setSelectedMethod('raast')}
                className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all ${
                  selectedMethod === 'raast'
                    ? 'border-orange-600 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                Raast / 1Link
              </button>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
              <div>
                <strong>Account Title:</strong> PakUni Education Services
              </div>
              <div>
                <strong>Account / Mobile No:</strong> 0300-9876543 (JazzCash / Easypaisa / Raast ID)
              </div>
              <div className="text-slate-500 italic">
                *Click below to activate instant access!
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Continue with Free Tier
          </button>

          <button
            type="button"
            onClick={handleSimulatePayment}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span>Activate Pro Pass (Rs. 900)</span>
            <Zap className="w-4 h-4 text-emerald-200 fill-emerald-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
