import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Scale,
  CalendarCheck,
  BookmarkCheck,
  Calculator,
  Bell,
  FileCheck2,
  BookOpen,
  User,
  Flame,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { StudentUser, NavigationTab } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  shortlistCount: number;
  unreadAlertsCount: number;
  onOpenCalculator: () => void;
  onOpenChecklist: () => void;
  onToggleAlerts: () => void;
  calculatedAggregate: number | null;
  onOpenPricing: () => void;
  onOpenOnboarding: () => void;
  currentUser: StudentUser | null;
  isPro: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  shortlistCount,
  unreadAlertsCount,
  onOpenCalculator,
  onOpenChecklist,
  onToggleAlerts,
  calculatedAggregate,
  onOpenPricing,
  onOpenOnboarding,
  currentUser,
  isPro
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('finder')}
            className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight font-serif">
                  PakUni
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Admissions
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden xl:block">
                Verified Formulas & Entry Test Targets
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              id="nav-finder-btn"
              onClick={() => setActiveTab('finder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'finder'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Uni Finder</span>
            </button>

            <button
              id="nav-compare-btn"
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'compare'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>Compare</span>
            </button>

            <button
              id="nav-exams-btn"
              onClick={() => setActiveTab('exams')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'exams'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <CalendarCheck className="w-4 h-4 text-amber-600" />
              <span>Deadlines & Events</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </button>

            <button
              id="nav-blogs-btn"
              onClick={() => setActiveTab('blogs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'blogs'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Guides & Blogs</span>
            </button>

            <button
              id="nav-shortlist-btn"
              onClick={() => setActiveTab('shortlist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'shortlist'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-rose-600" />
              <span>Shortlist</span>
              <AnimatePresence mode="popLayout">
                {shortlistCount > 0 && (
                  <motion.span
                    key={shortlistCount}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-rose-500 text-white"
                  >
                    {shortlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Owner Admin Dashboard Button */}
            <button
              id="nav-admin-btn"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black transition-all ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-emerald-50'
              }`}
              title="Restricted platform administrator and owner portal"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Quick Utility Tools & Monetization CTA */}
          <div className="flex items-center gap-2">
            {/* Pro Upgrade / Badge Button */}
            {isPro ? (
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-black border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pro Member</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-extrabold shadow-sm transition-all"
              >
                <Flame className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                <span className="hidden sm:inline">Pro Pass:</span>
                <span>Rs. 900</span>
              </button>
            )}

            {/* Quick Calculator */}
            <button
              id="btn-open-calculator"
              onClick={onOpenCalculator}
              title="Pakistani Merit Aggregate Calculator"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">Calculator</span>
            </button>

            {/* Document Checklist */}
            <button
              id="btn-open-checklist"
              onClick={onOpenChecklist}
              title="Official Scraped Documents Checklist"
              className="p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <FileCheck2 className="w-4 h-4 text-slate-700" />
            </button>

            {/* Notification Bell */}
            <button
              id="btn-toggle-notifications"
              onClick={onToggleAlerts}
              className="relative p-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              title="Admissions Alerts & Deadlines"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-bold ring-2 ring-white">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* User Profile / Onboarding Trigger */}
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 transition-colors"
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline truncate max-w-[90px]">
                {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center justify-between border-t border-slate-200 py-2 overflow-x-auto gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab('finder')}
            className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap ${
              activeTab === 'finder' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Uni Finder
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap ${
              activeTab === 'compare' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap ${
              activeTab === 'exams' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Deadlines & Events
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap ${
              activeTab === 'blogs' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Guides & Blogs
          </button>
          <button
            onClick={() => setActiveTab('shortlist')}
            className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'shortlist' ? 'bg-emerald-600 text-white' : 'text-slate-600 bg-slate-100'
            }`}
          >
            Shortlist ({shortlistCount})
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'admin' ? 'bg-slate-900 text-white' : 'text-slate-700 bg-emerald-50 border border-emerald-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
