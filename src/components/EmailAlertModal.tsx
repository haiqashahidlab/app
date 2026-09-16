import React, { useState } from 'react';
import {
  Mail,
  X,
  BellRing,
  Phone,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  GraduationCap,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { UniversityEventType, StudentUser, EmailAlertSubscription } from '../types';

interface EmailAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser | null;
  onSaveSubscription: (subscription: EmailAlertSubscription) => void;
  onSendTestNotification: (email: string) => void;
}

export const EmailAlertModal: React.FC<EmailAlertModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveSubscription,
  onSendTestNotification
}) => {
  const [email, setEmail] = useState(
    currentUser?.contact.includes('@')
      ? currentUser.contact
      : 'haiqa.shahid6002@gmail.com'
  );
  const [whatsapp, setWhatsapp] = useState(
    currentUser?.contact.startsWith('03') || currentUser?.contact.startsWith('+92')
      ? currentUser.contact
      : '0300 1234567'
  );
  const [frequency, setFrequency] = useState<'immediate_48h' | '3_days_before' | 'weekly_digest'>('3_days_before');
  const [selectedTypes, setSelectedTypes] = useState<UniversityEventType[]>([
    'application_deadline',
    'entrance_exam',
    'scholarship',
    'open_house'
  ]);
  const [isTestSent, setIsTestSent] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const toggleType = (type: UniversityEventType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length === 1) return; // Keep at least one
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const subscription: EmailAlertSubscription = {
      email,
      whatsapp,
      frequency,
      selectedEventTypes: selectedTypes,
      preferredCities: ['Karachi', 'Islamabad', 'Lahore'],
      subscribedAt: new Date().toISOString(),
      active: true
    };

    onSaveSubscription(subscription);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const handleTestSend = () => {
    onSendTestNotification(email);
    setIsTestSent(true);
    setTimeout(() => setIsTestSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-emerald-200 border border-white/20 shadow-inner">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-400 text-emerald-950">
                  Automated Alerts
                </span>
                <span className="text-[11px] text-emerald-200">Zero Spam Guarantee</span>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight font-serif mt-0.5">
                Never Miss an Admission Deadline
              </h2>
            </div>
          </div>
          <p className="text-xs text-emerald-100/90 mt-2">
            Get automated reminders for entrance exams, application cutoffs, scholarships, and open house dates directly to your email or WhatsApp.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Notification Destination Inputs */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span>Primary Student Email Address</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="haiqa.shahid6002@gmail.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Number for Urgent Deadlines (Optional)</span>
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="0300 1234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Event Categories to Track */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select What You Want to Be Notified About:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => toggleType('application_deadline')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left font-semibold transition-all ${
                  selectedTypes.includes('application_deadline')
                    ? 'border-rose-400 bg-rose-50 text-rose-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600 opacity-60'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shrink-0">
                  ✓
                </div>
                <span>Application Deadlines</span>
              </button>

              <button
                type="button"
                onClick={() => toggleType('entrance_exam')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left font-semibold transition-all ${
                  selectedTypes.includes('entrance_exam')
                    ? 'border-amber-400 bg-amber-50 text-amber-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600 opacity-60'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shrink-0">
                  ✓
                </div>
                <span>Entrance Exam Dates</span>
              </button>

              <button
                type="button"
                onClick={() => toggleType('scholarship')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left font-semibold transition-all ${
                  selectedTypes.includes('scholarship')
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600 opacity-60'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shrink-0">
                  ✓
                </div>
                <span>Scholarships & Aid</span>
              </button>

              <button
                type="button"
                onClick={() => toggleType('open_house')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left font-semibold transition-all ${
                  selectedTypes.includes('open_house')
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-900'
                    : 'border-slate-200 bg-slate-50 text-slate-600 opacity-60'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] shrink-0">
                  ✓
                </div>
                <span>Open House & Expos</span>
              </button>
            </div>
          </div>

          {/* Frequency & Lead-time Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-600" />
              <span>When Should We Alert You?</span>
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFrequency('immediate_48h')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  frequency === 'immediate_48h'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black">48 Hours Before</div>
                <div className="text-[10px] text-slate-500 mt-0.5">High Urgency</div>
              </button>

              <button
                type="button"
                onClick={() => setFrequency('3_days_before')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  frequency === '3_days_before'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black">3 Days Prior</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Recommended</div>
              </button>

              <button
                type="button"
                onClick={() => setFrequency('weekly_digest')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  frequency === 'weekly_digest'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-400'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black">Sunday Digest</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Weekly Summary</div>
              </button>
            </div>
          </div>

          {/* Test Notification Banner */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-800">Want to verify alerts work?</div>
              <div className="text-[11px] text-slate-500">Dispatch an immediate test alert sample to your inbox.</div>
            </div>
            <button
              type="button"
              onClick={handleTestSend}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-slate-800 text-xs font-bold hover:text-emerald-700 flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
            >
              {isTestSent ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-slate-500" />
                  <span>Send Test Alert</span>
                </>
              )}
            </button>
          </div>

          {/* Footer CTAs */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaved}
              className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-75"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <BellRing className="w-4 h-4" />
                  <span>Save Alert Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
