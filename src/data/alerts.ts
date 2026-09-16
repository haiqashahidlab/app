import { NotificationItem } from '../types';

export const INITIAL_ALERTS: NotificationItem[] = [
  {
    id: 'alert-1',
    title: 'NUST NET Series-3 Registration Closing Soon!',
    message: 'NUST entry test series 3 online registration closes on April 10. Ensure your fee challan is stamped at Habib Bank (HBL) or paid via 1Link before 5:00 PM.',
    date: '2026-04-05',
    type: 'deadline',
    priority: 'high',
    link: 'https://ugadmissions.nust.edu.pk',
    read: false
  },
  {
    id: 'alert-2',
    title: 'FAST-NUCES Fall 2026 Admissions Portal Opens',
    message: 'Online application submissions for FAST Islamabad, Lahore, Karachi, and Peshawar campuses begin May 20. Note that NU Test is mandatory unless applying on NAT/SAT basis.',
    date: '2026-04-02',
    type: 'info',
    priority: 'medium',
    link: 'https://admissions.nu.edu.pk',
    read: false
  },
  {
    id: 'alert-3',
    title: 'UET Lahore Combined ECAT 2026 Admit Cards',
    message: 'Download your ECAT 2026 test center roll number slips from the admission portal. Computer-based test begins April 3.',
    date: '2026-03-28',
    type: 'exam',
    priority: 'high',
    link: 'https://admission.uet.edu.pk',
    read: false
  },
  {
    id: 'alert-4',
    title: 'HEC Need-Based & Ehsaas Scholarships Update',
    message: 'Phase VIII application guidelines released for undergraduate students enrolled in public sector universities. Prepare father/guardian salary slips and electricity bills.',
    date: '2026-03-25',
    type: 'alert',
    priority: 'medium',
    link: 'https://hec.gov.pk',
    read: true
  },
  {
    id: 'alert-5',
    title: 'PMDC National MDCAT 2026 Syllabus Notification',
    message: 'PMDC has reiterated that MDCAT questions will strictly align with the core national curriculum across provincial textbook boards (Punjab, Sindh, KPK, Federal).',
    date: '2026-03-20',
    type: 'info',
    priority: 'low',
    link: 'https://pmdc.pk',
    read: true
  }
];
