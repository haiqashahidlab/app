import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Calendar,
  CalendarCheck,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Users,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  DollarSign,
  Search,
  Filter,
  Save,
  X,
  Building2,
  BookOpen,
  ArrowRight,
  ClipboardCopy,
  Sliders,
  Flame,
  Check
} from 'lucide-react';
import {
  UniversityEvent,
  UniversityEventType,
  UniversityLead,
  BlogPost,
  StudentUser
} from '../types';
import { formatPKR } from '../utils/aggregateCalculator';

interface AdminDashboardProps {
  events: UniversityEvent[];
  onUpdateEvents: (events: UniversityEvent[]) => void;
  leads: UniversityLead[];
  onUpdateLeads: (leads: UniversityLead[]) => void;
  blogs: BlogPost[];
  onUpdateBlogs: (blogs: BlogPost[]) => void;
  currentUser: StudentUser | null;
  onNavigateTab: (tab: 'finder' | 'compare' | 'exams' | 'shortlist' | 'blogs') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  events,
  onUpdateEvents,
  leads,
  onUpdateLeads,
  blogs,
  onUpdateBlogs,
  currentUser,
  onNavigateTab
}) => {
  // Admin authentication state
  const OWNER_EMAIL = 'haiqa.shahid6002@gmail.com';
  const OWNER_PASSCODE = 'pakuni2026';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // If logged in as owner email or admin flag stored
    if (currentUser?.contact === OWNER_EMAIL) return true;
    return localStorage.getItem('pakuni_owner_auth') === 'true';
  });

  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [authError, setAuthError] = useState('');

  // Active sub-tab in Admin Dashboard: 'deadlines' | 'leads' | 'blogs' | 'sheets'
  const [adminTab, setAdminTab] = useState<'deadlines' | 'leads' | 'blogs' | 'sheets'>('deadlines');

  // Search & Filters for Admin Tables
  const [eventSearch, setEventSearch] = useState('');
  const [eventFilterType, setEventFilterType] = useState<string>('all');
  const [leadFilterUni, setLeadFilterUni] = useState<string>('all');

  // Edit / Create Deadline State
  const [editingEvent, setEditingEvent] = useState<UniversityEvent | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // New Event Form State
  const [eventForm, setEventForm] = useState<Partial<UniversityEvent>>({
    universityName: '',
    universityShortName: '',
    city: 'Islamabad',
    title: '',
    type: 'application_deadline',
    date: new Date().toISOString().split('T')[0],
    time: '11:59 PM PST',
    mode: 'Online',
    venueOrLink: '',
    relevantFields: ['Computing & IT'],
    description: '',
    eligibilityOrRequirement: '',
    feePKR: 3000,
    officialPortalUrl: '',
    status: 'Open / Active',
    isVerified: true
  });

  // Google Sheets Sync State
  const [sheetUrl, setSheetUrl] = useState<string>(() => {
    return (
      localStorage.getItem('pakuni_google_sheet_url') ||
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-sample-pakuni-admissions/pub?output=csv'
    );
  });
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<string | null>(null);
  const [rawCsvText, setRawCsvText] = useState('');
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  // Custom Blog Creation & Editing State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    category: 'Admission Strategy',
    author: 'Haiqa Shahid',
    authorRole: 'Founder & Admissions Lead',
    readTime: '4 min read',
    excerpt: '',
    content: ''
  });

  // Feedback Toast
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Authenticate owner handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeAttempt === OWNER_PASSCODE || passcodeAttempt.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      localStorage.setItem('pakuni_owner_auth', 'true');
      setAuthError('');
      triggerToast('Welcome back, Owner Haiqa Shahid! Full administrative control active.');
    } else {
      setAuthError('Incorrect passcode. Please enter the authorized owner passcode.');
    }
  };

  const handleOneClickOwnerAuth = () => {
    setIsAuthenticated(true);
    localStorage.setItem('pakuni_owner_auth', 'true');
    setAuthError('');
    triggerToast('Authenticated as Owner (haiqa.shahid6002@gmail.com).');
  };

  const handleLockAdmin = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('pakuni_owner_auth');
    triggerToast('Admin session locked.');
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      if (eventFilterType !== 'all' && ev.type !== eventFilterType) return false;
      if (eventSearch.trim()) {
        const q = eventSearch.toLowerCase();
        return (
          ev.universityName.toLowerCase().includes(q) ||
          ev.title.toLowerCase().includes(q) ||
          ev.city.toLowerCase().includes(q) ||
          ev.universityShortName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, eventFilterType, eventSearch]);

  // Lead Analytics per University
  const leadStats = useMemo(() => {
    const uniMap: { [uniName: string]: { count: number; uniId: string; programs: Set<string> } } = {};
    leads.forEach((l) => {
      const name = l.universityName || 'Other University';
      if (!uniMap[name]) {
        uniMap[name] = { count: 0, uniId: l.universityId, programs: new Set() };
      }
      uniMap[name].count += 1;
      if (l.programName) uniMap[name].programs.add(l.programName);
    });

    const uniList = Object.entries(uniMap).map(([name, data]) => ({
      name,
      count: data.count,
      uniId: data.uniId,
      programsCount: data.programs.size
    }));

    return {
      total: leads.length,
      byUniversity: uniList.sort((a, b) => b.count - a.count)
    };
  }, [leads]);

  // Save or Add Event
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.universityName || !eventForm.date) {
      alert('Please fill out University Name, Title, and Date.');
      return;
    }

    if (editingEvent) {
      // Update existing
      const updated = events.map((ev) =>
        ev.id === editingEvent.id
          ? ({
              ...ev,
              ...eventForm,
              universityShortName: eventForm.universityShortName || eventForm.universityName?.slice(0, 10)
            } as UniversityEvent)
          : ev
      );
      onUpdateEvents(updated);
      triggerToast(`Successfully updated deadline: ${eventForm.title}`);
    } else {
      // Add new
      const newEv: UniversityEvent = {
        id: `custom-event-${Date.now()}`,
        universityId: eventForm.universityId || `custom-uni-${Date.now()}`,
        universityName: eventForm.universityName || '',
        universityShortName: eventForm.universityShortName || eventForm.universityName?.slice(0, 10) || '',
        city: eventForm.city || 'Pakistan',
        title: eventForm.title || '',
        type: eventForm.type || 'application_deadline',
        date: eventForm.date || new Date().toISOString().split('T')[0],
        time: eventForm.time || '11:59 PM PST',
        mode: eventForm.mode || 'Online',
        venueOrLink: eventForm.venueOrLink || eventForm.officialPortalUrl || 'https://pakuni.edu.pk',
        relevantFields: eventForm.relevantFields || ['Computing & IT'],
        description: eventForm.description || 'Verified university admission milestone.',
        eligibilityOrRequirement: eventForm.eligibilityOrRequirement || 'HSSC/FSc Part-1 / Equivalence required.',
        feePKR: Number(eventForm.feePKR) || 3000,
        officialPortalUrl: eventForm.officialPortalUrl || 'https://pakuni.edu.pk',
        status: (eventForm.status as any) || 'Open / Active',
        isVerified: true
      };
      onUpdateEvents([newEv, ...events]);
      triggerToast(`Added new deadline: ${eventForm.title}`);
    }

    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete deadline: "${title}"?`)) {
      const updated = events.filter((ev) => ev.id !== id);
      onUpdateEvents(updated);
      triggerToast(`Deleted deadline: ${title}`);
    }
  };

  const handleOpenEditEvent = (ev: UniversityEvent) => {
    setEditingEvent(ev);
    setEventForm({ ...ev });
    setIsEventModalOpen(true);
  };

  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      universityName: '',
      universityShortName: '',
      city: 'Islamabad',
      title: '',
      type: 'application_deadline',
      date: new Date().toISOString().split('T')[0],
      time: '11:59 PM PST',
      mode: 'Online',
      venueOrLink: '',
      relevantFields: ['Computing & IT'],
      description: '',
      eligibilityOrRequirement: '',
      feePKR: 3000,
      officialPortalUrl: '',
      status: 'Open / Active',
      isVerified: true
    });
    setIsEventModalOpen(true);
  };

  // Google Sheets / CSV Parser
  const parseCsvIntoEvents = (csvContent: string): UniversityEvent[] => {
    const lines = csvContent
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (lines.length < 2) return [];

    const parsed: UniversityEvent[] = [];
    // Assume header row is line 0
    for (let i = 1; i < lines.length; i++) {
      // Split by comma ignoring commas inside quotes
      const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((val) =>
        val.replace(/^"|"$/g, '').trim()
      );

      if (row.length >= 4) {
        const uniName = row[0] || 'Pakistani University';
        const shortName = row[1] || uniName.slice(0, 10);
        const title = row[2] || 'Admission Deadline';
        const typeRaw = (row[3] || 'application_deadline').toLowerCase();
        let eventType: UniversityEventType = 'application_deadline';
        if (typeRaw.includes('exam') || typeRaw.includes('test')) eventType = 'entrance_exam';
        else if (typeRaw.includes('scholar')) eventType = 'scholarship';
        else if (typeRaw.includes('open') || typeRaw.includes('house')) eventType = 'open_house';

        const date = row[4] || new Date().toISOString().split('T')[0];
        const city = row[5] || 'Pakistan';
        const officialUrl = row[6] || 'https://pakuni.edu.pk';
        const description = row[7] || 'Official verified date synchronized from Google Sheet.';
        const fee = Number(row[8]) || 3000;
        const statusRaw = row[9] || 'Open / Active';

        parsed.push({
          id: `sheet-event-${i}-${Date.now()}`,
          universityId: `uni-${shortName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          universityName: uniName,
          universityShortName: shortName,
          city,
          title,
          type: eventType,
          date,
          time: '11:59 PM PST',
          mode: 'Online',
          venueOrLink: officialUrl,
          relevantFields: ['Computing & IT', 'Engineering'],
          description,
          feePKR: fee,
          officialPortalUrl: officialUrl,
          status: (statusRaw as any) || 'Open / Active',
          isVerified: true
        });
      }
    }
    return parsed;
  };

  // Sync from Google Sheet URL
  const handleSyncGoogleSheet = async () => {
    if (!sheetUrl.trim()) {
      alert('Please enter your published Google Sheet CSV URL.');
      return;
    }

    setIsSyncingSheet(true);
    setSheetSyncStatus('Connecting to Google Sheet...');

    try {
      localStorage.setItem('pakuni_google_sheet_url', sheetUrl);
      const res = await fetch(sheetUrl);
      if (!res.ok) {
        throw new Error(`Google Sheet responded with status ${res.status}`);
      }
      const csvData = await res.text();
      const parsed = parseCsvIntoEvents(csvData);

      if (parsed.length === 0) {
        setSheetSyncStatus('No valid event rows found. Please check template format.');
        setIsSyncingSheet(false);
        return;
      }

      // Merge with existing or replace
      onUpdateEvents(parsed);
      setSheetSyncStatus(`Successfully synced ${parsed.length} deadlines from Google Sheet!`);
      triggerToast(`Live sync complete! Loaded ${parsed.length} deadlines.`);
    } catch (err: any) {
      setSheetSyncStatus(
        `Direct fetch encountered CORS: You can paste your Google Sheet CSV directly below to import immediately.`
      );
    } finally {
      setIsSyncingSheet(false);
    }
  };

  // Import raw CSV text directly
  const handleImportRawCsv = () => {
    if (!rawCsvText.trim()) {
      alert('Please paste your Google Sheet CSV data into the box.');
      return;
    }
    const parsed = parseCsvIntoEvents(rawCsvText);
    if (parsed.length === 0) {
      alert('Could not parse any rows. Ensure format matches the template.');
      return;
    }
    onUpdateEvents(parsed);
    setRawCsvText('');
    setSheetSyncStatus(`Successfully imported ${parsed.length} deadlines from pasted data!`);
    triggerToast(`Imported ${parsed.length} deadlines.`);
  };

  // Copy Template Format
  const handleCopyTemplate = () => {
    const template =
      'University Name,Short Name,Title,Type,Date,City,Official Portal URL,Description,Fee,Status\n' +
      'Bahria University,Bahria,Fall 2026 Admissions Cutoff,application_deadline,2026-07-15,Islamabad,https://cms.bahria.edu.pk/admissions,Online application deadline,3000,Open / Active\n' +
      'NED University,NED UET,Sindh Pre-Admission Test,entrance_exam,2026-07-28,Karachi,https://www.neduet.edu.pk,Official Pre-Admission Test,4000,Upcoming\n' +
      'NUST Islamabad,NUST,NET Series-4 Final,entrance_exam,2026-07-05,Islamabad,https://ugadmissions.nust.edu.pk,Final NET Session,5000,Open / Active';

    navigator.clipboard.writeText(template);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 3000);
    triggerToast('Google Sheet CSV template copied to clipboard!');
  };

  // Export Leads to CSV
  const handleExportLeadsCsv = () => {
    if (leads.length === 0) {
      alert('No student leads recorded yet.');
      return;
    }

    const headers = [
      'Lead ID',
      'Student Name',
      'Contact (WhatsApp/Email)',
      'City',
      'University',
      'Target Program',
      'Matric %',
      'FSc %',
      'Status',
      'Generated Date'
    ];

    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.studentName}"`,
      `"${l.studentContact}"`,
      `"${l.studentCity}"`,
      `"${l.universityName}"`,
      `"${l.programName}"`,
      l.matricPct,
      l.fscPct,
      `"${l.status}"`,
      `"${new Date(l.createdDate).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PakUni_Admissions_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`Exported ${leads.length} student leads to CSV!`);
  };

  // Update Lead Status
  const handleUpdateLeadStatus = (leadId: string, newStatus: UniversityLead['status']) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l));
    onUpdateLeads(updated);
    triggerToast(`Updated lead status to: ${newStatus}`);
  };

  // Blog Management: Save / Add Blog
  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) {
      alert('Please fill out the article title and content.');
      return;
    }

    if (editingBlog) {
      const updated = blogs.map((b) =>
        b.id === editingBlog.id
          ? ({
              ...b,
              ...blogForm,
              slug: blogForm.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            } as BlogPost)
          : b
      );
      onUpdateBlogs(updated);
      triggerToast(`Updated article: "${blogForm.title}"`);
    } else {
      const newPost: BlogPost = {
        id: `owner-blog-${Date.now()}`,
        title: blogForm.title || '',
        slug: blogForm.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        author: blogForm.author || 'Haiqa Shahid',
        authorRole: blogForm.authorRole || 'Founder & Admissions Lead',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: blogForm.readTime || '4 min read',
        category: (blogForm.category as any) || 'Admission Strategy',
        excerpt: blogForm.excerpt || blogForm.content?.slice(0, 160) + '...',
        content: blogForm.content || ''
      };
      onUpdateBlogs([newPost, ...blogs]);
      triggerToast(`Published owner article: "${newPost.title}"`);
    }

    setIsBlogModalOpen(false);
    setEditingBlog(null);
  };

  const handleDeleteBlog = (blogId: string, title: string) => {
    if (confirm(`Are you sure you want to delete article: "${title}"?`)) {
      const updated = blogs.filter((b) => b.id !== blogId);
      onUpdateBlogs(updated);
      triggerToast(`Deleted article: "${title}"`);
    }
  };

  const handleOpenAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      category: 'Admission Strategy',
      author: 'Haiqa Shahid',
      authorRole: 'Founder & Admissions Lead',
      readTime: '4 min read',
      excerpt: '',
      content: ''
    });
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlog = (b: BlogPost) => {
    setEditingBlog(b);
    setBlogForm({ ...b });
    setIsBlogModalOpen(true);
  };

  // If NOT Authenticated, show Owner Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 font-serif mb-2">
            Owner & Administrator Portal
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Restricted access for platform owner (<span className="font-bold text-slate-900">haiqa.shahid6002@gmail.com</span>).
            From here you can modify university deadlines, sync live Google Sheets, view all generated student leads, and publish verified blogs.
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left max-w-sm mx-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Owner Passcode / Secret Key
              </label>
              <input
                type="password"
                value={passcodeAttempt}
                onChange={(e) => setPasscodeAttempt(e.target.value)}
                placeholder="Enter owner passcode"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                autoFocus
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Default Master Passcode: <code className="text-emerald-700 font-bold">pakuni2026</code>
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleOneClickOwnerAuth}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline underline-offset-4"
            >
              Quick Sign-in as Haiqa Shahid (Owner)
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('finder')}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              ← Back to Student View
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Authenticated Admin Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 text-sm font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Top Header & Owner Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 rounded-lg bg-emerald-700 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight">
              Owner Management Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
              Active Control
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Authenticated as <strong className="text-slate-900">{OWNER_EMAIL}</strong>. Real-time control over deadlines, leads CRM, Google Sheet synchronization, and custom blog articles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigateTab('finder')}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>Preview Student View</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={handleLockAdmin}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-bold transition-colors flex items-center gap-1 border border-slate-200"
            title="Lock administrative session"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-4 mb-6 border-b border-slate-200">
        <button
          onClick={() => setAdminTab('deadlines')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            adminTab === 'deadlines'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Deadlines & Dates Manager ({events.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('sheets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            adminTab === 'sheets'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Google Sheet Live Sync</span>
          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-900 text-[10px] font-black">
            Automated
          </span>
        </button>

        <button
          onClick={() => setAdminTab('leads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            adminTab === 'leads'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Leads & Monetization ({leads.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('blogs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            adminTab === 'blogs'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Owner Blog & Guide Publisher ({blogs.length})</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. DEADLINES & DATES MANAGER TAB */}
      {/* ======================================================== */}
      {adminTab === 'deadlines' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter deadlines by university or title..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={eventFilterType}
                onChange={(e) => setEventFilterType(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="all">All Event Types</option>
                <option value="application_deadline">Application Deadlines</option>
                <option value="entrance_exam">Entrance Exams</option>
                <option value="scholarship">Scholarships</option>
                <option value="open_house">Open House</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddEvent}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Deadline Manually</span>
            </button>
          </div>

          {/* Deadlines Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold">
                  <tr>
                    <th className="px-4 py-3.5">University</th>
                    <th className="px-4 py-3.5">Title & Type</th>
                    <th className="px-4 py-3.5">Cutoff Date</th>
                    <th className="px-4 py-3.5">City / Mode</th>
                    <th className="px-4 py-3.5">Fee</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{ev.universityName}</div>
                        <span className="text-[10px] text-slate-500">{ev.universityShortName}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-slate-800 line-clamp-1 max-w-xs" title={ev.title}>
                          {ev.title}
                        </div>
                        <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-600 mt-0.5">
                          {ev.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-900">{ev.date}</div>
                        <span className="text-[10px] text-slate-500">{ev.time || '11:59 PM'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>{ev.city}</div>
                        <span className="text-[10px] text-slate-500">{ev.mode}</span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {ev.feePKR ? formatPKR(ev.feePKR) : 'Free'}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            ev.status === 'Open / Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.status === 'Closing Soon'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditEvent(ev)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                            title="Edit date & details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(ev.id, ev.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete deadline"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. GOOGLE SHEETS LIVE SYNC TAB */}
      {/* ======================================================== */}
      {adminTab === 'sheets' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-serif">
                  Automated Google Sheets Synchronization
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Keep deadlines 100% up-to-date without touching any code. Whenever you update your Google Sheet with new dates or universities, click "Sync Now" or paste the CSV to immediately push the updates into the live student app.
                </p>
              </div>
            </div>

            {/* URL Input & Sync Row */}
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Published Google Sheet CSV / Web Link
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleSyncGoogleSheet}
                    disabled={isSyncingSheet}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 shadow-xs"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingSheet ? 'animate-spin' : ''}`} />
                    <span>{isSyncingSheet ? 'Syncing...' : 'Sync from Google Sheet Now'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  How to get link in Google Sheets: <span className="font-semibold text-slate-700">File → Share → Publish to web → Select 'Entire Document' & 'Comma-separated values (.csv)'</span>.
                </p>
              </div>

              {sheetSyncStatus && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sheetSyncStatus}</span>
                </div>
              )}

              {/* Template Helper */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Required columns: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-800">University, ShortName, Title, Type, Date, City, OfficialURL, Description, Fee, Status</code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTemplate}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
                  <span>{copiedTemplate ? 'Copied Template!' : 'Copy Sample Template'}</span>
                </button>
              </div>
            </div>

            {/* Direct Paste Fallback */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <span>Direct CSV Paste (Bypasses Google Sheet Sharing Restrictions)</span>
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                If your sheet is private or direct fetch is blocked, copy all cells from Google Sheets and paste them here:
              </p>
              <textarea
                value={rawCsvText}
                onChange={(e) => setRawCsvText(e.target.value)}
                placeholder="Paste CSV rows here (University Name, Short Name, Title, Type, Date, City...)"
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="mt-2.5 flex justify-end">
                <button
                  type="button"
                  onClick={handleImportRawCsv}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Parse & Replace App Deadlines</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. STUDENT LEADS & MONETIZATION TAB */}
      {/* ======================================================== */}
      {adminTab === 'leads' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Total Leads Generated
              </div>
              <div className="text-3xl font-black text-slate-900 font-serif">
                {leads.length}
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                High-intent prospective students
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Universities with Demand
              </div>
              <div className="text-3xl font-black text-slate-900 font-serif">
                {leadStats.byUniversity.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Ready to be monetized & forwarded
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Lead Batch Export
                </div>
                <div className="text-xs text-slate-600">
                  Ready to send to university admissions offices.
                </div>
              </div>
              <button
                type="button"
                onClick={handleExportLeadsCsv}
                disabled={leads.length === 0}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Leads (Excel / CSV)</span>
              </button>
            </div>
          </div>

          {/* Demand Breakdown per University */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 font-serif">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Student Leads Breakdown by University</span>
            </h3>

            {leadStats.byUniversity.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-4">
                No student leads recorded yet. When students click "Interested" on any university or program card, their convertible profile will appear here.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {leadStats.byUniversity.map((item) => (
                  <div
                    key={item.name}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 line-clamp-1">{item.name}</div>
                      <span className="text-[10px] text-slate-500">
                        {item.programsCount} {item.programsCount === 1 ? 'Program' : 'Programs'}
                      </span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-mono font-extrabold text-xs">
                      {item.count} {item.count === 1 ? 'Lead' : 'Leads'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Student Leads Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                Individual Student Applicant Records
              </h3>
              <select
                value={leadFilterUni}
                onChange={(e) => setLeadFilterUni(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700"
              >
                <option value="all">All Universities</option>
                {leadStats.byUniversity.map((u) => (
                  <option key={u.name} value={u.name}>
                    {u.name} ({u.count})
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-extrabold">
                  <tr>
                    <th className="px-4 py-3.5">Student Name</th>
                    <th className="px-4 py-3.5">WhatsApp / Contact</th>
                    <th className="px-4 py-3.5">City</th>
                    <th className="px-4 py-3.5">Target University & Program</th>
                    <th className="px-4 py-3.5">Academic Marks</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads
                    .filter((l) => leadFilterUni === 'all' || l.universityName === leadFilterUni)
                    .map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">{l.studentName}</td>
                        <td className="px-4 py-3 font-mono text-emerald-800 font-bold">{l.studentContact}</td>
                        <td className="px-4 py-3">{l.studentCity}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{l.universityName}</div>
                          <span className="text-[10px] text-slate-500">{l.programName}</span>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          Matric: {l.matricPct}% | FSc: {l.fscPct}%
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={l.status}
                            onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value as any)}
                            className="px-2 py-1 rounded-lg border border-slate-300 text-[11px] font-bold bg-white"
                          >
                            <option value="Fresh Lead">Fresh Lead</option>
                            <option value="Forwarded to Admissions">Forwarded to Admissions</option>
                            <option value="Connected">Connected</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                          {new Date(l.createdDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic">
                        No leads in database. Student interest clicks will appear here automatically.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. OWNER BLOG & GUIDE PUBLISHER TAB */}
      {/* ======================================================== */}
      {adminTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-serif">
                Owner-Authored Guides & Blogs CMS
              </h2>
              <p className="text-xs text-slate-500">
                Write authentic, high-value guidance articles directly. These appear directly in the student Guides & Blogs view.
              </p>
            </div>

            <button
              onClick={handleOpenAddBlog}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Write & Publish New Article</span>
            </button>
          </div>

          {/* Article List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {blogs.map((b) => (
                <div key={b.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                        {b.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">• {b.readTime}</span>
                      <span className="text-xs text-slate-400 font-medium">• {b.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {b.excerpt}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-2">
                      Author: <strong className="text-slate-800">{b.author}</strong> ({b.authorRole})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleOpenEditBlog(b)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(b.id, b.title)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT DEADLINE EVENT */}
      {/* ======================================================== */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-base font-black text-slate-900 font-serif">
                {editingEvent ? 'Edit University Deadline' : 'Add New University Deadline'}
              </h3>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">University Name *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.universityName || ''}
                    onChange={(e) => setEventForm({ ...eventForm, universityName: e.target.value })}
                    placeholder="e.g. Bahria University"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Short Name</label>
                  <input
                    type="text"
                    value={eventForm.universityShortName || ''}
                    onChange={(e) => setEventForm({ ...eventForm, universityShortName: e.target.value })}
                    placeholder="e.g. Bahria"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event / Deadline Title *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title || ''}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Fall 2026 Online Application Submission Deadline"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Event Type</label>
                  <select
                    value={eventForm.type || 'application_deadline'}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="application_deadline">Application Deadline</option>
                    <option value="entrance_exam">Entrance Exam</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="open_house">Open House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date || ''}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={eventForm.city || ''}
                    onChange={(e) => setEventForm({ ...eventForm, city: e.target.value })}
                    placeholder="e.g. Islamabad / Karachi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Portal URL</label>
                  <input
                    type="url"
                    value={eventForm.officialPortalUrl || ''}
                    onChange={(e) => setEventForm({ ...eventForm, officialPortalUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Processing Fee (PKR)</label>
                  <input
                    type="number"
                    value={eventForm.feePKR || 0}
                    onChange={(e) => setEventForm({ ...eventForm, feePKR: Number(e.target.value) })}
                    placeholder="e.g. 3000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description / Instructions</label>
                <textarea
                  rows={3}
                  value={eventForm.description || ''}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Official instructions for candidates (e.g. Challan submission details, late fee cutoff)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <select
                  value={eventForm.status || 'Open / Active'}
                  onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as any })}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value="Open / Active">Status: Open / Active</option>
                  <option value="Closing Soon">Status: Closing Soon</option>
                  <option value="Upcoming">Status: Upcoming</option>
                  <option value="Closed">Status: Closed</option>
                </select>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEventModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm"
                  >
                    {editingEvent ? 'Save Changes' : 'Add Deadline'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: WRITE / EDIT BLOG POST */}
      {/* ======================================================== */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-base font-black text-slate-900 font-serif">
                {editingBlog ? 'Edit Owner Guide / Blog' : 'Write Owner Guide / Blog'}
              </h3>
              <button
                onClick={() => setIsBlogModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={blogForm.title || ''}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  placeholder="e.g. The Honest Comparison: FAST vs NUST vs Bahria for Computer Science"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={blogForm.category || 'Admission Strategy'}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  >
                    <option value="Admission Strategy">Admission Strategy</option>
                    <option value="University Comparison">University Comparison</option>
                    <option value="Merit & Tests">Merit & Tests</option>
                    <option value="Scholarships">Scholarships</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={blogForm.author || ''}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    placeholder="Haiqa Shahid"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={blogForm.readTime || '4 min read'}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Excerpt / Hook</label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt || ''}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  placeholder="Summary shown on the article preview card..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Article Body *</label>
                <textarea
                  rows={8}
                  required
                  value={blogForm.content || ''}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  placeholder="Write your advice, verified closing merits breakdown, preparation recommendations, and tips for Pakistani students..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm"
                >
                  {editingBlog ? 'Save Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
