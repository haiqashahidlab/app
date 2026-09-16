import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { UniFinder } from './components/UniFinder';
import { ProgramComparator } from './components/ProgramComparator';
import { DeadlineTracker } from './components/DeadlineTracker';
import { EmailAlertModal } from './components/EmailAlertModal';
import { ShortlistView } from './components/ShortlistView';
import { BlogSection } from './components/BlogSection';
import { OnboardingModal } from './components/OnboardingModal';
import { PricingModal } from './components/PricingModal';
import { UniversityDocsModal } from './components/UniversityDocsModal';
import { AggregateCalculatorModal } from './components/AggregateCalculatorModal';
import { DocChecklistModal } from './components/DocChecklistModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { AdminDashboard } from './components/AdminDashboard';

import { PAKISTANI_UNIVERSITIES } from './data/universities';
import { PAKISTANI_ENTRANCE_EXAMS } from './data/exams';
import { PAKISTANI_UNIVERSITY_EVENTS } from './data/universityEvents';
import { INITIAL_ALERTS } from './data/alerts';
import { INITIAL_BLOG_POSTS } from './data/blogs';
import {
  University,
  ProgramOffering,
  ShortlistItem,
  NotificationItem,
  EntranceExam,
  UniversityEvent,
  EmailAlertSubscription,
  ApplicationStage,
  StudentUser,
  StudentProfile,
  EducationSystem,
  IntermediateStream,
  UniversityLead,
  BlogPost,
  FeeBudgetPreference,
  NavigationTab
} from './types';
import {
  CheckCircle2,
  ExternalLink,
  Users,
  ShieldCheck,
  Building2,
  Lock
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('finder');

  // User & Onboarding State
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    const saved = localStorage.getItem('pakuni_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('pakuni_profile');
    return saved
      ? JSON.parse(saved)
      : {
          educationSystem: 'fsc',
          intermediateStream: 'pre_medical',
          hasAdditionalMath: false,
          matricPercentage: 86.0,
          fscPercentage: 82.0,
          calculatedAggregate: 81.2,
          preferredCity: 'Any',
          preferredProgram: 'Computing & IT',
          sectorPreference: 'All',
          budgetPreference: 'Any'
        };
  });

  // Open onboarding automatically on first visit if no user is registered
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    return !localStorage.getItem('pakuni_user');
  });

  // Stored state with local storage fallback
  const [userAggregate, setUserAggregate] = useState<number | null>(() => {
    const saved = localStorage.getItem('pakuni_user_aggregate');
    return saved ? parseFloat(saved) : 81.2;
  });

  const [marksProfile, setMarksProfile] = useState<{
    matricObt?: number;
    matricTot?: number;
    fscObt?: number;
    fscTot?: number;
    testObt?: number;
    testTot?: number;
    formulaName?: string;
  }>(() => {
    const saved = localStorage.getItem('pakuni_marks_profile');
    return saved
      ? JSON.parse(saved)
      : { matricObt: 950, matricTot: 1100, fscObt: 450, fscTot: 550, testObt: 140, testTot: 200 };
  });

  const [shortlist, setShortlist] = useState<ShortlistItem[]>(() => {
    const saved = localStorage.getItem('pakuni_shortlist');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'init-1',
            universityId: 'nust-isb',
            programId: 'nust-cs',
            addedAt: new Date().toISOString(),
            notes: 'Aiming for NET Series 3 or 4. Need 138+ in NET.',
            stage: 'Considering'
          },
          {
            id: 'init-2',
            universityId: 'ned-khi',
            programId: 'ned-cs',
            addedAt: new Date().toISOString(),
            notes: 'Verified formula: 60% Entry test + 40% HSC. Highly affordable Rs. 44,500/sem.',
            stage: 'Considering'
          }
        ];
  });

  const [comparingItems, setComparingItems] = useState<
    Array<{ university: University; program: ProgramOffering }>
  >(() => {
    const nust = PAKISTANI_UNIVERSITIES.find((u) => u.id === 'nust-isb');
    const fast = PAKISTANI_UNIVERSITIES.find((u) => u.id === 'fast-isb');
    const ned = PAKISTANI_UNIVERSITIES.find((u) => u.id === 'ned-khi');
    const nustProg = nust?.programs.find((p) => p.id === 'nust-cs');
    const fastProg = fast?.programs.find((p) => p.id === 'fast-isb-cs');
    const nedProg = ned?.programs.find((p) => p.id === 'ned-cs');

    const list = [];
    if (nust && nustProg) list.push({ university: nust, program: nustProg });
    if (fast && fastProg) list.push({ university: fast, program: fastProg });
    if (ned && nedProg) list.push({ university: ned, program: nedProg });
    return list;
  });

  const [alerts, setAlerts] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('pakuni_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [exams, setExams] = useState<EntranceExam[]>(() => {
    const saved = localStorage.getItem('pakuni_exams');
    return saved ? JSON.parse(saved) : PAKISTANI_ENTRANCE_EXAMS;
  });

  // Comprehensive University Deadlines & Events State (Owner managed & Google Sheets synced)
  const [events, setEvents] = useState<UniversityEvent[]>(() => {
    const saved = localStorage.getItem('pakuni_university_events');
    return saved ? JSON.parse(saved) : PAKISTANI_UNIVERSITY_EVENTS;
  });
  const [isSyncingFeeds, setIsSyncingFeeds] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState('Today, 12:40 PM');
  const [isEmailAlertModalOpen, setIsEmailAlertModalOpen] = useState(false);

  // Leads CRM State
  const [leads, setLeads] = useState<UniversityLead[]>(() => {
    const saved = localStorage.getItem('pakuni_leads');
    return saved ? JSON.parse(saved) : [];
  });

  // Custom Blogs State (Owner editable)
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('pakuni_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOG_POSTS;
  });

  const [budgetPreference, setBudgetPreference] = useState<FeeBudgetPreference>(
    studentProfile?.budgetPreference || 'Any'
  );

  // Modal open states
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // Scraped Docs Modal Target
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [docsTargetUni, setDocsTargetUni] = useState<University | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to local storage
  useEffect(() => {
    if (userAggregate !== null) {
      localStorage.setItem('pakuni_user_aggregate', String(userAggregate));
    }
  }, [userAggregate]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pakuni_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if (studentProfile) {
      localStorage.setItem('pakuni_profile', JSON.stringify(studentProfile));
    }
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('pakuni_shortlist', JSON.stringify(shortlist));
  }, [shortlist]);

  useEffect(() => {
    localStorage.setItem('pakuni_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('pakuni_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('pakuni_university_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('pakuni_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('pakuni_blogs', JSON.stringify(blogs));
  }, [blogs]);

  // Onboarding Complete Handler
  const handleOnboardingComplete = (user: StudentUser, profile: StudentProfile) => {
    setCurrentUser(user);
    setStudentProfile(profile);
    setUserAggregate(profile.calculatedAggregate);
    setBudgetPreference(profile.budgetPreference);
    setIsOnboardingOpen(false);

    showToast(`Welcome ${user.name}! Your personalized university matches are ready.`);
    setActiveTab('finder');
  };

  // Pro Pass Upgrade Handler
  const handleUpgradeToPro = (tier: 'EarlyBird900' | 'Tier1000' | 'Standard1500') => {
    const updatedUser: StudentUser = {
      ...(currentUser || {
        id: `usr-${Date.now()}`,
        name: 'Pro Student',
        contact: '0300 1234567',
        provider: 'guest',
        registeredAt: new Date().toISOString()
      }),
      isPro: true,
      tier: tier === 'EarlyBird900' ? 'EarlyBird900' : tier === 'Tier1000' ? 'Tier1000' : 'Standard1500'
    };

    setCurrentUser(updatedUser);
    setIsPricingOpen(false);
    showToast('Congratulations! PakUni Pro Admission Pass activated.');
  };

  // Kollegio-Style 1-Click "Interested" Toggle (Seamless Lead Generation)
  const handleToggleInterest = (university: University, program: ProgramOffering) => {
    const existingIndex = leads.findIndex(
      (l) => l.universityId === university.id && l.programId === program.id
    );

    if (existingIndex > -1) {
      // Remove interest
      setLeads((prev) => prev.filter((_, idx) => idx !== existingIndex));
      showToast(`Removed interest in ${university.shortName} - ${program.name}`);
    } else {
      // Add interest lead
      const studentName = currentUser?.name || 'Pakistani Student Candidate';
      const studentContact = currentUser?.contact || 'Interested Candidate (Via App)';
      const newLead: UniversityLead = {
        id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        studentName,
        studentContact,
        studentCity: studentProfile?.preferredCity || university.city,
        universityId: university.id,
        universityName: university.name,
        programId: program.id,
        programName: program.name,
        userAggregate: userAggregate || 80.0,
        matricPct: studentProfile?.matricPercentage || 85,
        fscPct: studentProfile?.fscPercentage || 80,
        source: 'Finder 1-Click Interest',
        intentType: 'Interested',
        createdDate: new Date().toISOString(),
        status: 'Fresh Lead'
      };

      setLeads((prev) => [newLead, ...prev]);

      // Create confirmation notification
      const alert: NotificationItem = {
        id: `alert-lead-${Date.now()}`,
        title: `Program Bookmarked: ${university.shortName}`,
        message: `You expressed interest in ${program.name}. We'll keep you posted with upcoming deadlines and prospectus updates.`,
        date: new Date().toISOString().split('T')[0],
        type: 'info',
        priority: 'medium',
        read: false
      };
      setAlerts((prev) => [alert, ...prev]);
      showToast(`Marked interest in ${university.shortName} - ${program.name}! ✓`);
    }
  };

  // Open Scraped Docs Modal
  const handleOpenDocsModal = (university: University) => {
    setDocsTargetUni(university);
    setIsDocsModalOpen(true);
  };

  // Add Guest / Sponsored Post
  const handleAddGuestPost = (post: BlogPost) => {
    setBlogs((prev) => [post, ...prev]);
    showToast(`Article "${post.title.slice(0, 30)}..." published!`);
  };

  // Handler for applying aggregate from calculator
  const handleApplyAggregate = (
    aggregate: number,
    data: {
      matricObt: number;
      matricTot: number;
      fscObt: number;
      fscTot: number;
      testObt: number;
      testTot: number;
      formulaName: string;
    }
  ) => {
    setUserAggregate(aggregate);
    setMarksProfile(data);
    localStorage.setItem('pakuni_marks_profile', JSON.stringify(data));
    showToast(`Calculated Aggregate: ${aggregate}% applied successfully!`);
    setActiveTab('finder');
  };

  // Shortlist toggle
  const handleToggleShortlist = (university: University, program: ProgramOffering) => {
    const existingIndex = shortlist.findIndex(
      (item) => item.universityId === university.id && item.programId === program.id
    );

    if (existingIndex > -1) {
      setShortlist((prev) => prev.filter((_, idx) => idx !== existingIndex));
      showToast(`Removed ${university.shortName} - ${program.name} from Shortlist`);
    } else {
      const newItem: ShortlistItem = {
        id: `item-${Date.now()}`,
        universityId: university.id,
        programId: program.id,
        addedAt: new Date().toISOString(),
        notes: '',
        stage: 'Considering'
      };
      setShortlist((prev) => [newItem, ...prev]);
      showToast(`Added ${university.shortName} - ${program.name} to My Shortlist!`);
    }
  };

  const handleRemoveShortlistItem = (id: string) => {
    setShortlist((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed from Shortlist');
  };

  const handleUpdateShortlistStage = (id: string, stage: ApplicationStage) => {
    setShortlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stage } : item))
    );
    showToast(`Updated stage to: ${stage}`);
  };

  const handleUpdateShortlistNotes = (id: string, notes: string) => {
    setShortlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
    showToast('Application notes saved');
  };

  // Comparison handler
  const handleAddToCompare = (university: University, program: ProgramOffering) => {
    const exists = comparingItems.some(
      (ci) => ci.university.id === university.id && ci.program.id === program.id
    );

    if (exists) {
      showToast('Already added to comparison matrix');
      setActiveTab('compare');
      return;
    }

    if (comparingItems.length >= 4) {
      showToast('Comparison limit reached (max 4). Remove one first.');
      setActiveTab('compare');
      return;
    }

    setComparingItems((prev) => [...prev, { university, program }]);
    showToast(`Added ${university.shortName} to comparison`);
    setActiveTab('compare');
  };

  const handleRemoveFromCompare = (universityId: string, programId: string) => {
    setComparingItems((prev) =>
      prev.filter(
        (ci) => !(ci.university.id === universityId && ci.program.id === programId)
      )
    );
    showToast('Removed from comparison');
  };

  const handleClearComparison = () => {
    setComparingItems([]);
    showToast('Cleared comparison matrix');
  };

  // Comprehensive Event Tracker Handlers
  const handleToggleEventReminder = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const nextState = !e.reminderSet;
          if (nextState) {
            showToast(`Alert enabled for ${e.universityShortName}: ${e.title}`);
            const newAlert: NotificationItem = {
              id: `alert-event-${Date.now()}`,
              title: `Deadline Alert: ${e.universityShortName}`,
              message: `${e.title} is scheduled for ${e.date}. Venue/Portal: ${e.venueOrLink}`,
              date: new Date().toISOString().split('T')[0],
              type: e.type === 'application_deadline' ? 'deadline' : e.type === 'entrance_exam' ? 'exam' : 'info',
              priority: 'high',
              link: e.officialPortalUrl,
              read: false
            };
            setAlerts((a) => [newAlert, ...a]);
          } else {
            showToast(`Alert removed for ${e.universityShortName}`);
          }
          return { ...e, reminderSet: nextState };
        }
        return e;
      })
    );
  };

  const handleEnableAllMatchedReminders = () => {
    let count = 0;
    setEvents((prev) =>
      prev.map((e) => {
        const studentCity = studentProfile?.preferredCity || 'Any';
        const studentProgram = studentProfile?.preferredProgram || 'All';
        const cityMatch =
          studentCity === 'Any' ||
          !studentCity ||
          e.city.toLowerCase().includes(studentCity.toLowerCase()) ||
          e.mode === 'Online';
        const fieldMatch =
          !studentProgram ||
          studentProgram === 'All' ||
          e.relevantFields.some((f) => studentProgram.toLowerCase().includes(f.toLowerCase()));

        if (cityMatch || fieldMatch) {
          if (!e.reminderSet) count++;
          return { ...e, reminderSet: true };
        }
        return e;
      })
    );

    const newAlert: NotificationItem = {
      id: `alert-bulk-${Date.now()}`,
      title: 'Profile-Matched Deadlines Alerts Enabled',
      message: `Activated automated reminders for university deadlines and exams matching your profile in ${studentProfile?.preferredCity || 'Pakistan'}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'alert',
      priority: 'medium',
      read: false
    };
    setAlerts((a) => [newAlert, ...a]);
    showToast(`Enabled alerts for ${count > 0 ? count : 'all'} relevant university deadlines!`);
  };

  const handleSyncFeeds = async () => {
    setIsSyncingFeeds(true);
    showToast('Connecting to NUST, NED, FAST, PMDC & HEC admission portals...');
    await new Promise((res) => setTimeout(res, 1200));

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSyncedTime(`Today, ${timeStr}`);
    setIsSyncingFeeds(false);
    showToast('Successfully synced official Pakistani university portal feeds!');
  };

  const handleSaveEmailSubscription = (sub: EmailAlertSubscription) => {
    localStorage.setItem('pakuni_email_subscription', JSON.stringify(sub));
    const newAlert: NotificationItem = {
      id: `alert-sub-${Date.now()}`,
      title: 'Automated Email & WhatsApp Alerts Configured',
      message: `Upcoming deadlines will be dispatched to ${sub.email}${sub.whatsapp ? ` and WhatsApp ${sub.whatsapp}` : ''}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'info',
      priority: 'medium',
      read: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Alert preferences registered for ${sub.email}!`);
  };

  const handleSendTestNotification = (targetEmail: string) => {
    const testAlert: NotificationItem = {
      id: `alert-test-${Date.now()}`,
      title: 'Urgent Test Alert: NUST & NED Cutoffs Approaching',
      message: `[Email sent to ${targetEmail}] This is a test notification. NUST NET-1 closes in 14 days; NED Portal closes in 10 days. All tracking systems active.`,
      date: new Date().toISOString().split('T')[0],
      type: 'deadline',
      priority: 'high',
      read: false
    };
    setAlerts((a) => [testAlert, ...a]);
    showToast(`Test deadline notification dispatched to ${targetEmail}!`);
  };

  // Admin Event Handlers
  const handleAddEvent = (event: UniversityEvent) => {
    setEvents((prev) => [event, ...prev]);
    showToast(`Deadline for ${event.universityShortName} added!`);
  };

  const handleUpdateEvent = (updatedEvent: UniversityEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    showToast(`Event updated for ${updatedEvent.universityShortName}`);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    showToast('Event removed from platform');
  };

  const handleImportEvents = (imported: UniversityEvent[]) => {
    setEvents(imported);
    showToast(`Imported ${imported.length} events from Google Sheets!`);
  };

  // Admin Lead Handlers
  const handleUpdateLeadStatus = (leadId: string, status: UniversityLead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    showToast(`Lead status marked as ${status}`);
  };

  const handleExportLeadsCSV = () => {
    if (leads.length === 0) {
      showToast('No leads available to export yet.');
      return;
    }
    const headers = ['Date', 'Student Name', 'Contact', 'City', 'University', 'Program', 'Aggregate', 'Status'];
    const rows = leads.map((l) => [
      l.createdDate ? l.createdDate.split('T')[0] : new Date().toISOString().split('T')[0],
      `"${l.studentName}"`,
      `"${l.studentContact}"`,
      `"${l.studentCity}"`,
      `"${l.universityName}"`,
      `"${l.programName}"`,
      l.userAggregate || (l.matricPct * 0.5 + l.fscPct * 0.5),
      l.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pakuni_student_leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported leads to CSV file!');
  };

  // Admin Blog Handlers
  const handleAddBlog = (post: BlogPost) => {
    setBlogs((prev) => [post, ...prev]);
    showToast(`Article "${post.title.slice(0, 25)}..." published!`);
  };

  const handleUpdateBlog = (updated: BlogPost) => {
    setBlogs((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    showToast(`Article "${updated.title.slice(0, 25)}..." updated!`);
  };

  const handleDeleteBlog = (blogId: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== blogId));
    showToast('Article deleted');
  };

  // Stream & Academic Profile update
  const handleUpdateProfileStream = (
    system: EducationSystem,
    stream: IntermediateStream,
    hasAddMath?: boolean,
    alevelSubjects?: string[]
  ) => {
    setStudentProfile((prev) => {
      if (!prev) return null;
      const updated: StudentProfile = {
        ...prev,
        educationSystem: system,
        intermediateStream: stream,
        hasAdditionalMath: hasAddMath ?? prev.hasAdditionalMath,
        alevelSubjects: alevelSubjects ?? prev.alevelSubjects
      };
      localStorage.setItem('pakuni_profile', JSON.stringify(updated));
      return updated;
    });
    showToast(`Updated academic stream to ${stream.replace('_', ' ').toUpperCase()}`);
  };

  // Alert handlers
  const handleMarkAlertAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const handleMarkAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    showToast('All notifications marked as read');
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;
  const shortlistedKeys = shortlist.map((s) => `${s.universityId}_${s.programId}`);
  const comparingKeys = comparingItems.map((c) => `${c.university.id}_${c.program.id}`);
  const interestedKeys = useMemo(() => {
    return leads.map((l) => `${l.universityId}_${l.programId}`);
  }, [leads]);

  const userMatric = studentProfile?.matricPercentage || 85;
  const userFsc = studentProfile?.fscPercentage || 80;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Enhanced Animated Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl text-xs font-semibold border border-slate-700/80 shadow-emerald-950/20"
          >
            <motion.div
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.05 }}
              className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </motion.div>
            <span className="leading-snug">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shortlistCount={shortlist.length}
        unreadAlertsCount={unreadAlertsCount}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onToggleAlerts={() => setIsAlertsOpen(!isAlertsOpen)}
        calculatedAggregate={userAggregate}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        currentUser={currentUser}
        isPro={currentUser?.isPro || false}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'finder' && (
          <UniFinder
            universities={PAKISTANI_UNIVERSITIES}
            userAggregate={userAggregate}
            userMatric={userMatric}
            userFsc={userFsc}
            studentProfile={studentProfile}
            onUpdateProfileStream={handleUpdateProfileStream}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            shortlistedIds={shortlistedKeys}
            onToggleShortlist={handleToggleShortlist}
            onAddToCompare={handleAddToCompare}
            comparingIds={comparingKeys}
            interestedProgramIds={interestedKeys}
            onToggleInterest={handleToggleInterest}
            onOpenDocsModal={handleOpenDocsModal}
            budgetPreference={budgetPreference}
            onBudgetChange={setBudgetPreference}
            isPro={currentUser?.isPro || false}
            onOpenPricing={() => setIsPricingOpen(true)}
          />
        )}

        {activeTab === 'compare' && (
          <ProgramComparator
            universities={PAKISTANI_UNIVERSITIES}
            userAggregate={userAggregate}
            comparingItems={comparingItems}
            onRemoveFromCompare={handleRemoveFromCompare}
            onAddOfferingToCompare={handleAddToCompare}
            onClearComparison={handleClearComparison}
            interestedProgramIds={interestedKeys}
            onToggleInterest={handleToggleInterest}
            onOpenDocsModal={handleOpenDocsModal}
          />
        )}

        {activeTab === 'exams' && (
          <DeadlineTracker
            events={events}
            studentProfile={studentProfile}
            currentUser={currentUser}
            onToggleEventReminder={handleToggleEventReminder}
            onOpenEmailModal={() => setIsEmailAlertModalOpen(true)}
            onEnableAllMatchedReminders={handleEnableAllMatchedReminders}
            onSyncFeeds={handleSyncFeeds}
            isSyncing={isSyncingFeeds}
            lastSyncedTime={lastSyncedTime}
          />
        )}

        {activeTab === 'blogs' && (
          <BlogSection
            posts={blogs}
          />
        )}

        {activeTab === 'shortlist' && (
          <ShortlistView
            universities={PAKISTANI_UNIVERSITIES}
            shortlistItems={shortlist}
            userAggregate={userAggregate}
            onRemoveItem={handleRemoveShortlistItem}
            onUpdateStage={handleUpdateShortlistStage}
            onUpdateNotes={handleUpdateShortlistNotes}
            onSwitchToFinder={() => setActiveTab('finder')}
          />
        )}

        {/* OWNER RESTRICTED ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onImportEventsFromGoogleSheets={handleImportEvents}
            leads={leads}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onExportLeadsCSV={handleExportLeadsCSV}
            blogs={blogs}
            onAddBlog={handleAddBlog}
            onUpdateBlog={handleUpdateBlog}
            onDeleteBlog={handleDeleteBlog}
          />
        )}
      </main>

      {/* Student Onboarding & Sign-Up Flow */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        onClose={() => setIsOnboardingOpen(false)}
        canCloseWithoutComplete={!!currentUser}
      />

      {/* Pricing & Pro Pass Modal (Tiered Pricing Model: 900 -> 1000 -> 1500) */}
      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentUser={currentUser}
        onUpgradeToPro={handleUpgradeToPro}
      />

      {/* University Scraped Documents Modal */}
      <UniversityDocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        university={docsTargetUni}
      />

      {/* Merit Calculator Modal */}
      <AggregateCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onApplyAggregate={handleApplyAggregate}
        initialAggregate={userAggregate}
      />

      {/* Scraped Document Checklist Modal */}
      <DocChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onMarkAsRead={handleMarkAlertAsRead}
        onMarkAllAsRead={handleMarkAllAlertsAsRead}
      />

      {/* Automated Email & SMS Alerts Modal */}
      <EmailAlertModal
        isOpen={isEmailAlertModalOpen}
        onClose={() => setIsEmailAlertModalOpen(false)}
        currentUser={currentUser}
        onSaveSubscription={handleSaveEmailSubscription}
        onSendTestNotification={handleSendTestNotification}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-serif font-bold text-xs">
              🇵🇰
            </div>
            <span className="font-bold text-slate-800 font-serif">
              PakUni Admissions Hub
            </span>
            <span>— Empowering Pakistani Undergraduate Aspirants</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-600 font-medium">
            <a
              href="https://hec.gov.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-700 flex items-center gap-1"
            >
              <span>HEC Pakistan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://pmdc.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-700 flex items-center gap-1"
            >
              <span>PMDC (Medical)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://pec.org.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-700 flex items-center gap-1"
            >
              <span>PEC (Engineering)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://ibcc.edu.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-700 flex items-center gap-1"
            >
              <span>IBCC Equivalence</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
