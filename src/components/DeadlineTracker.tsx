import React, { useState, useMemo } from 'react';
import {
  CalendarCheck,
  Clock,
  ExternalLink,
  Bell,
  BellRing,
  AlertCircle,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  RefreshCw,
  Filter,
  GraduationCap,
  Award,
  Users,
  Building2,
  Mail,
  Share2,
  MapPin,
  ChevronRight,
  Flame,
  Download,
  Info
} from 'lucide-react';
import {
  UniversityEvent,
  UniversityEventType,
  StudentProfile,
  StudentUser
} from '../types';
import { formatPKR } from '../utils/aggregateCalculator';

interface DeadlineTrackerProps {
  events: UniversityEvent[];
  studentProfile: StudentProfile | null;
  currentUser: StudentUser | null;
  onToggleEventReminder: (eventId: string) => void;
  onOpenEmailModal: () => void;
  onEnableAllMatchedReminders: () => void;
  onSyncFeeds: () => Promise<void>;
  isSyncing: boolean;
  lastSyncedTime: string;
}

export const DeadlineTracker: React.FC<DeadlineTrackerProps> = ({
  events,
  studentProfile,
  currentUser,
  onToggleEventReminder,
  onOpenEmailModal,
  onEnableAllMatchedReminders,
  onSyncFeeds,
  isSyncing,
  lastSyncedTime
}) => {
  // State for active tab / category filter
  const [selectedType, setSelectedType] = useState<'all' | UniversityEventType>('all');
  const [onlyMatched, setOnlyMatched] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'urgent' | 'active' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetailEvent, setSelectedDetailEvent] = useState<UniversityEvent | null>(null);

  // Helper to calculate days remaining
  const getDaysRemaining = (targetDateStr: string) => {
    const target = new Date(targetDateStr);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { days: Math.abs(diffDays), text: `${Math.abs(diffDays)} days ago`, isPast: true, isUrgent: false };
    } else if (diffDays === 0) {
      return { days: 0, text: 'Deadline Today!', isPast: false, isUrgent: true };
    } else if (diffDays === 1) {
      return { days: 1, text: 'Ends Tomorrow!', isPast: false, isUrgent: true };
    } else if (diffDays <= 7) {
      return { days: diffDays, text: `${diffDays} days left`, isPast: false, isUrgent: true };
    } else {
      return { days: diffDays, text: `${diffDays} days left`, isPast: false, isUrgent: false };
    }
  };

  // Profile match checking function
  const checkProfileMatch = (event: UniversityEvent): { isMatch: boolean; reason?: string } => {
    if (!studentProfile) return { isMatch: true };

    const studentCity = studentProfile.preferredCity;
    const studentProgram = studentProfile.preferredProgram;

    const cityMatch =
      studentCity === 'Any' ||
      !studentCity ||
      event.city.toLowerCase().includes(studentCity.toLowerCase()) ||
      event.venueOrLink.toLowerCase().includes(studentCity.toLowerCase()) ||
      event.mode === 'Online';

    const fieldMatch =
      !studentProgram ||
      studentProgram === 'All Programs' ||
      event.relevantFields.some((f) => studentProgram.toLowerCase().includes(f.toLowerCase())) ||
      (studentProgram.includes('Computing') && event.relevantFields.includes('Computing & IT')) ||
      (studentProgram.includes('Engineering') && event.relevantFields.includes('Engineering')) ||
      (studentProgram.includes('Medical') && event.relevantFields.includes('Medical & Health'));

    if (cityMatch && fieldMatch) {
      return {
        isMatch: true,
        reason: `Matches ${studentProgram || 'your field'} in ${event.city}`
      };
    }
    if (fieldMatch) {
      return {
        isMatch: true,
        reason: `Matches your field: ${studentProgram}`
      };
    }
    if (cityMatch) {
      return {
        isMatch: true,
        reason: `Located in your preferred city: ${event.city}`
      };
    }

    return { isMatch: false };
  };

  // Event category counts
  const counts = useMemo(() => {
    return {
      all: events.length,
      application_deadline: events.filter((e) => e.type === 'application_deadline').length,
      entrance_exam: events.filter((e) => e.type === 'entrance_exam').length,
      scholarship: events.filter((e) => e.type === 'scholarship').length,
      open_house: events.filter((e) => e.type === 'open_house').length,
      matched: events.filter((e) => checkProfileMatch(e).isMatch).length
    };
  }, [events, studentProfile]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // Type Filter
      if (selectedType !== 'all' && event.type !== selectedType) return false;

      // Profile Match Filter
      const match = checkProfileMatch(event);
      if (onlyMatched && !match.isMatch) return false;

      // City Filter
      if (selectedCity !== 'All' && !event.city.toLowerCase().includes(selectedCity.toLowerCase())) {
        return false;
      }

      // Status Filter
      const remaining = getDaysRemaining(event.date);
      if (statusFilter === 'urgent' && !remaining.isUrgent) return false;
      if (statusFilter === 'active' && (remaining.isPast || event.status === 'Closed')) return false;
      if (statusFilter === 'upcoming' && event.status !== 'Upcoming') return false;

      // Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = event.title.toLowerCase().includes(q);
        const inUni = event.universityName.toLowerCase().includes(q) || event.universityShortName.toLowerCase().includes(q);
        const inDesc = event.description.toLowerCase().includes(q);
        const inCity = event.city.toLowerCase().includes(q);
        if (!inTitle && !inUni && !inDesc && !inCity) return false;
      }

      return true;
    });
  }, [events, selectedType, onlyMatched, selectedCity, statusFilter, searchQuery, studentProfile]);

  // Generate Google Calendar Link
  const generateGoogleCalendarUrl = (event: UniversityEvent) => {
    const title = encodeURIComponent(`${event.universityShortName}: ${event.title}`);
    const details = encodeURIComponent(`${event.description}\n\nOfficial Portal: ${event.officialPortalUrl}\nVenue: ${event.venueOrLink}`);
    const location = encodeURIComponent(event.venueOrLink || event.city);
    // Format YYYYMMDD
    const dateFormatted = event.date.replace(/-/g, '');
    const dates = `${dateFormatted}T090000Z/${dateFormatted}T170000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
  };

  // Generate .ics download
  const handleDownloadIcs = (event: UniversityEvent) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//PakUni Admissions//Deadline Tracker//EN
BEGIN:VEVENT
SUMMARY:${event.universityShortName}: ${event.title}
DESCRIPTION:${event.description}\\nPortal: ${event.officialPortalUrl}
LOCATION:${event.venueOrLink || event.city}
DTSTART:${event.date.replace(/-/g, '')}T090000Z
DTEND:${event.date.replace(/-/g, '')}T170000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.universityShortName}_${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTypeBadge = (type: UniversityEventType) => {
    switch (type) {
      case 'application_deadline':
        return {
          label: 'Application Deadline',
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: Clock
        };
      case 'entrance_exam':
        return {
          label: 'Entrance Exam',
          bg: 'bg-amber-100 text-amber-900 border-amber-200',
          icon: CalendarCheck
        };
      case 'scholarship':
        return {
          label: 'Scholarship & Aid',
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          icon: Award
        };
      case 'open_house':
        return {
          label: 'Open House & Tour',
          bg: 'bg-indigo-100 text-indigo-900 border-indigo-200',
          icon: Users
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Center */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background accent */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Feed Tracker</span>
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <span>Last Synced: {lastSyncedTime}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-serif">
              Pakistani Universities Deadlines & Events
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Real-time monitoring across 15+ official university portals for <strong>Application Deadlines</strong>, <strong>Entrance Exam Schedules</strong> (NET, ECAT, MDCAT, NU), <strong>Scholarships</strong> (HEC Ehsaas, PEEF, SEEF, TOPS), and <strong>Open House Campus Expos</strong>.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            {/* Sync Feeds Button */}
            <button
              type="button"
              onClick={onSyncFeeds}
              disabled={isSyncing}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs disabled:opacity-50"
              title="Query official university admission servers for updated deadlines"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
              <span>{isSyncing ? 'Fetching Feeds...' : 'Fetch & Sync Portals'}</span>
            </button>

            {/* Email / WhatsApp Alert Setup */}
            <button
              type="button"
              onClick={onOpenEmailModal}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Email & SMS Alerts</span>
            </button>

            {/* Bulk Alert Enable */}
            <button
              type="button"
              onClick={onEnableAllMatchedReminders}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 transition-all shadow-sm shadow-emerald-600/20"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Alert All My Matches</span>
            </button>
          </div>
        </div>

        {/* Profile Relevance Indicator Banner */}
        {studentProfile && (
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[11px]">
                🎯
              </div>
              <span>
                Active Profile: <strong>{studentProfile.preferredProgram || 'All Programs'}</strong> in{' '}
                <strong>{studentProfile.preferredCity || 'All Cities'}</strong> ({counts.matched} relevant dates detected)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setOnlyMatched(!onlyMatched)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 border ${
                onlyMatched
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{onlyMatched ? 'Showing Only Profile Matches' : 'Filter by My Profile Matches'}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${onlyMatched ? 'bg-emerald-700 text-white' : 'bg-emerald-200 text-emerald-900'}`}>
                {counts.matched}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Category Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
            selectedType === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>All Events & Deadlines</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200/50 text-inherit">
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType('application_deadline')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
            selectedType === 'application_deadline'
              ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-rose-500" />
          <span>Application Deadlines</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-900">
            {counts.application_deadline}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType('entrance_exam')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
            selectedType === 'entrance_exam'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Entrance Exam Schedules</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900">
            {counts.entrance_exam}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType('scholarship')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
            selectedType === 'scholarship'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-500" />
          <span>Scholarships & Aid</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900">
            {counts.scholarship}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedType('open_house')}
          className={`px-4 py-2.5 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
            selectedType === 'open_house'
              ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span>Open House & Expos</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-900">
            {counts.open_house}
          </span>
        </button>
      </div>

      {/* Search & Secondary Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deadlines (e.g. NUST NET, NED form, HEC Ehsaas, FAST open house)..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 focus:bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-bold shrink-0">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent focus:outline-none text-xs font-bold cursor-pointer"
            >
              <option value="All">All Cities</option>
              <option value="Karachi">Karachi</option>
              <option value="Islamabad">Islamabad / Pindi</option>
              <option value="Lahore">Lahore</option>
              <option value="Topi">GIKI / Swabi</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 font-bold">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('urgent')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'urgent' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Closing Soon (&lt; 7d)</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('upcoming')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                statusFilter === 'upcoming' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-slate-800 font-serif">No Events Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No events match your current filters. Try resetting the filters or clearing the search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedType('all');
              setOnlyMatched(false);
              setSelectedCity('All');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEvents.map((event) => {
            const daysInfo = getDaysRemaining(event.date);
            const badge = getTypeBadge(event.type);
            const Icon = badge.icon;
            const matchInfo = checkProfileMatch(event);

            return (
              <div
                key={event.id}
                className={`bg-white rounded-3xl border transition-all p-6 flex flex-col justify-between relative overflow-hidden group ${
                  daysInfo.isUrgent
                    ? 'border-rose-300 shadow-xs hover:border-rose-400'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Urgent top accent bar */}
                {daysInfo.isUrgent && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
                )}

                <div>
                  {/* Top Badges Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${badge.bg}`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>

                      {/* City Badge */}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{event.city}</span>
                      </span>

                      {/* Profile Match Pill */}
                      {matchInfo.isMatch && studentProfile && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Profile Match</span>
                        </span>
                      )}
                    </div>

                    {/* Countdown Pill */}
                    <div
                      className={`px-3 py-1 rounded-xl text-xs font-black shrink-0 flex items-center gap-1 ${
                        daysInfo.isUrgent
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                          : daysInfo.isPast
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{daysInfo.text}</span>
                    </div>
                  </div>

                  {/* University & Title */}
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      {event.universityName}
                    </span>
                    <h3
                      onClick={() => setSelectedDetailEvent(event)}
                      className="text-base font-black text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors mt-0.5 font-serif leading-snug"
                    >
                      {event.title}
                    </h3>
                  </div>

                  {/* Date & Mode Banner */}
                  <div className="mt-3 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Official Date / Deadline
                      </span>
                      <div className="font-extrabold text-slate-900 text-xs mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        <span>{event.date}</span>
                      </div>
                      {event.time && (
                        <span className="text-[10px] text-slate-500 mt-0.5 block">{event.time}</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Mode & Location
                      </span>
                      <div className="font-bold text-slate-800 text-xs mt-0.5 truncate">
                        {event.mode} • {event.city}
                      </div>
                      <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                        {event.venueOrLink}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  {/* Scholarship coverage or Fee highlight if present */}
                  {event.scholarshipCoverage && (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                      <Award className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold block">Coverage:</span>
                        <span className="text-[11px] font-medium">{event.scholarshipCoverage}</span>
                      </div>
                    </div>
                  )}

                  {event.feePKR !== undefined && event.feePKR > 0 && !event.scholarshipCoverage && (
                    <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                      <span>Registration Challan Fee:</span>
                      <span className="font-bold text-slate-900">{formatPKR(event.feePKR)}</span>
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Toggle Alert Reminder */}
                    <button
                      type="button"
                      onClick={() => onToggleEventReminder(event.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                        event.reminderSet
                          ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                      title={event.reminderSet ? 'Reminder is enabled' : 'Click to enable in-app notification'}
                    >
                      {event.reminderSet ? (
                        <>
                          <BellRing className="w-3.5 h-3.5 text-amber-700" />
                          <span>Alert On</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5 text-slate-400" />
                          <span>Alert Me</span>
                        </>
                      )}
                    </button>

                    {/* Google Calendar Link */}
                    <a
                      href={generateGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                      title="Add to Google Calendar"
                    >
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    </a>

                    {/* Download .ics */}
                    <button
                      type="button"
                      onClick={() => handleDownloadIcs(event)}
                      className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                      title="Export .ics file for Apple Calendar or Outlook"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDetailEvent(event)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                    >
                      Details
                    </button>

                    <a
                      href={event.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Apply on Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Inspection Modal */}
      {selectedDetailEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  {selectedDetailEvent.universityName}
                </span>
                <h3 className="text-lg font-black text-slate-900 font-serif mt-0.5">
                  {selectedDetailEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetailEvent(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Important Date / Cutoff:</span>
                  <span className="font-extrabold text-slate-900">{selectedDetailEvent.date}</span>
                </div>
                {selectedDetailEvent.time && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Timing:</span>
                    <span className="font-bold text-slate-800">{selectedDetailEvent.time}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">City & Venue:</span>
                  <span className="font-bold text-slate-800">{selectedDetailEvent.city} • {selectedDetailEvent.mode}</span>
                </div>
                {selectedDetailEvent.feePKR !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Fee:</span>
                    <span className="font-bold text-slate-900">{formatPKR(selectedDetailEvent.feePKR)}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-900 block mb-1">Full Description:</span>
                <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  {selectedDetailEvent.description}
                </p>
              </div>

              {selectedDetailEvent.eligibilityOrRequirement && (
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Eligibility & Pattern:</span>
                  <p className="text-slate-600 leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                    {selectedDetailEvent.eligibilityOrRequirement}
                  </p>
                </div>
              )}

              {selectedDetailEvent.scholarshipCoverage && (
                <div>
                  <span className="font-bold text-emerald-900 block mb-1">Scholarship Award:</span>
                  <p className="text-emerald-800 leading-relaxed bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                    {selectedDetailEvent.scholarshipCoverage}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  onToggleEventReminder(selectedDetailEvent.id);
                  setSelectedDetailEvent((prev) => prev ? { ...prev, reminderSet: !prev.reminderSet } : null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  selectedDetailEvent.reminderSet
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BellRing className="w-3.5 h-3.5 text-amber-600" />
                <span>{selectedDetailEvent.reminderSet ? 'Reminder Active' : 'Set In-App Alert'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={generateGoogleCalendarUrl(selectedDetailEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Google Cal</span>
                </a>

                <a
                  href={selectedDetailEvent.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Go to Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
