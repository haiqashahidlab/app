import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, Loader2, User, HelpCircle, ExternalLink } from 'lucide-react';

interface AiCounselorModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: {
    matricPercentage?: number;
    fscPercentage?: number;
    entryTestScore?: number;
    calculatedAggregate?: number | null;
    targetProgram?: string;
    preferredCity?: string;
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const PRESET_QUESTIONS = [
  'Can I get into FAST or NUST with my current marks?',
  'What is the difference between FAST, NUST, and COMSATS for CS?',
  'How do I apply for HEC Need-Based or Ehsaas scholarship?',
  'I am waiting for my FSc 2nd year result. How do I apply?',
  'Which entry tests should I prepare for if I want to study in Islamabad?'
];

export const AiCounselorModal: React.FC<AiCounselorModalProps> = ({
  isOpen,
  onClose,
  studentProfile
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        `Assalam-o-Alaikum! I am your **PakUni Admissions Counselor**. 🎓\n\n` +
        `I can help you analyze your admission chances, compare universities (like NUST, FAST, LUMS, GIKI, UET, COMSATS, IBA), guide you on Pakistani entry tests (NET, NU Test, ECAT, MDCAT), and explain scholarships like Ehsaas & PEEF.\n\n` +
        `What would you like to ask today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          studentProfile: {
            matricMarks: studentProfile.matricPercentage,
            fscMarks: studentProfile.fscPercentage,
            entryTestScore: studentProfile.entryTestScore,
            calculatedAggregate: studentProfile.calculatedAggregate,
            targetProgram: studentProfile.targetProgram,
            preferredCity: studentProfile.preferredCity
          }
        })
      });

      const data = await response.json();
      const botResponse: Message = {
        role: 'assistant',
        content: data.response || 'Sorry, I could not generate an answer right now. Please try again.'
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Network connection error. Please make sure the dev server is active and try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-serif">
                  PakUni AI Admission Advisor
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/30 text-emerald-100 border border-emerald-400/40">
                  Gemini 3.8
                </span>
              </div>
              <p className="text-xs text-emerald-100/80">
                Pakistani university merits, tests & scholarship guidance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Context Pill */}
        {studentProfile.calculatedAggregate && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-100 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Your Profile Active:</span>
              <span className="px-2 py-0.5 bg-white rounded border border-emerald-200 font-bold">
                Aggregate: {studentProfile.calculatedAggregate}%
              </span>
              {studentProfile.preferredCity && (
                <span className="text-slate-600">({studentProfile.preferredCity})</span>
              )}
            </div>
            <span className="text-[11px] text-emerald-700">AI considers your marks</span>
          </div>
        )}

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-emerald-700 border border-slate-200 shadow-xs'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs prose prose-sm max-w-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white text-emerald-600 border border-slate-200 flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>Consulting Pakistani university admission database...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-200 overflow-x-auto">
          <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex gap-2 pb-1">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Pakistani university cutoffs, tests, hostel life..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-emerald-500 focus:border-emerald-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
