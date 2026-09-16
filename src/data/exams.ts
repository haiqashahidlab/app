import { EntranceExam } from '../types';

export const PAKISTANI_ENTRANCE_EXAMS: EntranceExam[] = [
  {
    id: 'nust-net-3',
    name: 'NUST Entry Test (NET Series-3)',
    universityOrBody: 'National University of Sciences & Technology (NUST)',
    series: 'Series 3 (Spring Cycle)',
    registrationStartDate: '2026-03-01',
    registrationEndDate: '2026-04-10',
    examDate: '2026-04-18',
    resultDate: '2026-05-02',
    testFeePKR: 5000,
    eligibilityCriteria: 'Minimum 60% marks in SSC (Matric) and HSSC (FSc Pre-Engineering / Pre-Medical with Add. Math / ICS) or IBCC Equivalence.',
    testPattern: {
      subjects: 'Mathematics (80 MCQs), Physics (60 MCQs), Chemistry/CS (30 MCQs), English (20 MCQs), Intelligence (10 MCQs)',
      totalMarks: 200,
      durationMinutes: 180,
      negativeMarking: false
    },
    officialPortalUrl: 'https://ugadmissions.nust.edu.pk',
    status: 'Registration Open',
    reminderSet: true
  },
  {
    id: 'nust-net-4',
    name: 'NUST Entry Test (NET Series-4 Final)',
    universityOrBody: 'NUST Islamabad',
    series: 'Series 4 (Final Summer Cycle)',
    registrationStartDate: '2026-05-15',
    registrationEndDate: '2026-06-25',
    examDate: '2026-07-05',
    resultDate: '2026-07-28',
    testFeePKR: 5000,
    eligibilityCriteria: 'Minimum 60% marks in FSc/ICS or A-Levels with relevant subject combinations.',
    testPattern: {
      subjects: 'Math (40%), Physics (30%), Chemistry/CS (15%), English (10%), Intelligence (5%)',
      totalMarks: 200,
      durationMinutes: 180,
      negativeMarking: false
    },
    officialPortalUrl: 'https://ugadmissions.nust.edu.pk',
    status: 'Upcoming',
    reminderSet: false
  },
  {
    id: 'fast-nu-test',
    name: 'FAST-NUCES Admission Test (NU Test 2026)',
    universityOrBody: 'National University of Computer & Emerging Sciences',
    series: 'Annual Undergraduate Fall Session',
    registrationStartDate: '2026-05-20',
    registrationEndDate: '2026-07-08',
    examDate: '2026-07-16',
    resultDate: '2026-07-25',
    testFeePKR: 3500,
    eligibilityCriteria: 'Minimum 50% in Intermediate / HSSC or A-Levels for Computing degrees (Math mandatory in FSc/ICS or Pre-Medical with Deficiency).',
    testPattern: {
      subjects: 'Advanced Math (50 marks), Basic Math (20 marks), Analytical Reasoning & IQ (20 marks), English (30 marks)',
      totalMarks: 120,
      durationMinutes: 120,
      negativeMarking: true
    },
    officialPortalUrl: 'https://admissions.nu.edu.pk',
    status: 'Upcoming',
    reminderSet: true
  },
  {
    id: 'uet-ecat',
    name: 'Combined Entry Test (ECAT 2026)',
    universityOrBody: 'University of Engineering and Technology (UET) Lahore',
    series: 'Main Punjab Engineering Entry Test',
    registrationStartDate: '2026-02-15',
    registrationEndDate: '2026-03-24',
    examDate: '2026-04-03',
    resultDate: '2026-04-12',
    testFeePKR: 2500,
    eligibilityCriteria: 'Minimum 60% marks in FSc Pre-Engineering / ICS / DAE or equivalent from recognized board.',
    testPattern: {
      subjects: 'Mathematics (30 MCQs), Physics (30 MCQs), Chemistry/Computer (30 MCQs), English (10 MCQs)',
      totalMarks: 400,
      durationMinutes: 100,
      negativeMarking: true
    },
    officialPortalUrl: 'https://admission.uet.edu.pk',
    status: 'Registration Open',
    reminderSet: true
  },
  {
    id: 'pmdc-mdcat',
    name: 'National MDCAT 2026 (Medical & Dental Colleges Admission Test)',
    universityOrBody: 'Pakistan Medical & Dental Council (PMDC) & Provincial Universities',
    series: 'National Medical Admission Cycle',
    registrationStartDate: '2026-06-10',
    registrationEndDate: '2026-07-25',
    examDate: '2026-08-23',
    resultDate: '2026-09-08',
    testFeePKR: 6000,
    eligibilityCriteria: 'Minimum 60% marks in FSc Pre-Medical or IBCC Equivalent with Biology and Chemistry.',
    testPattern: {
      subjects: 'Biology (68 MCQs), Chemistry (54 MCQs), Physics (54 MCQs), English (18 MCQs), Logical Reasoning (6 MCQs)',
      totalMarks: 200,
      durationMinutes: 210,
      negativeMarking: false
    },
    officialPortalUrl: 'https://pmdc.pk',
    status: 'Upcoming',
    reminderSet: false
  },
  {
    id: 'giki-test',
    name: 'GIKI Undergraduate Admission Test',
    universityOrBody: 'Ghulam Ishaq Khan Institute (GIKI)',
    series: 'Annual Engineering & CS Intake',
    registrationStartDate: '2026-04-01',
    registrationEndDate: '2026-06-12',
    examDate: '2026-07-02',
    resultDate: '2026-07-15',
    testFeePKR: 4500,
    eligibilityCriteria: 'Minimum 60% in HSSC Pre-Engineering / ICS or O/A-Levels with Math & Physics.',
    testPattern: {
      subjects: 'Mathematics (30 MCQs), Physics (30 MCQs), English Comprehension (20 MCQs)',
      totalMarks: 80,
      durationMinutes: 120,
      negativeMarking: true
    },
    officialPortalUrl: 'https://admissions.giki.edu.pk',
    status: 'Upcoming',
    reminderSet: false
  },
  {
    id: 'iba-aptitude-round1',
    name: 'IBA Karachi Undergraduate Aptitude Test (Round 1 & 2)',
    universityOrBody: 'Institute of Business Administration (IBA Karachi)',
    series: 'Round 1 / Round 2 Selection',
    registrationStartDate: '2026-01-10',
    registrationEndDate: '2026-02-18',
    examDate: '2026-03-01',
    resultDate: '2026-03-15',
    testFeePKR: 4500,
    eligibilityCriteria: 'Minimum 65% in HSSC / Intermediate or equivalent grades (BBC in A-Levels). SAT 1350+ exempts test.',
    testPattern: {
      subjects: 'Mathematics Section (Quantitative), English Section (Vocabulary, Reading Comprehension, Grammar)',
      totalMarks: 100,
      durationMinutes: 120,
      negativeMarking: true
    },
    officialPortalUrl: 'https://admissions.iba.edu.pk',
    status: 'Result Announced',
    reminderSet: false
  },
  {
    id: 'nts-nat-monthly',
    name: 'NTS National Aptitude Test (NAT-IE / NAT-ICS / NAT-IM)',
    universityOrBody: 'National Testing Service (NTS Pakistan)',
    series: 'Monthly Rollout (Accepted by COMSATS, Air, etc.)',
    registrationStartDate: '2026-03-05',
    registrationEndDate: '2026-03-22',
    examDate: '2026-04-05',
    resultDate: '2026-04-15',
    testFeePKR: 1200,
    eligibilityCriteria: '12 years of education or result awaiting students in Pre-Eng, Pre-Med, ICS, I.Com, or Arts.',
    testPattern: {
      subjects: 'Verbal (20 MCQs), Analytical (20 MCQs), Quantitative (20 MCQs), Subject Specific (30 MCQs)',
      totalMarks: 90,
      durationMinutes: 120,
      negativeMarking: false
    },
    officialPortalUrl: 'https://nts.org.pk',
    status: 'Registration Open',
    reminderSet: true
  },
  {
    id: 'pieas-test',
    name: 'PIEAS Written Admission Test',
    universityOrBody: 'Pakistan Institute of Engineering & Applied Sciences (PIEAS)',
    series: 'Annual BS Engineering & CS',
    registrationStartDate: '2026-04-15',
    registrationEndDate: '2026-06-15',
    examDate: '2026-06-28',
    resultDate: '2026-07-12',
    testFeePKR: 3500,
    eligibilityCriteria: 'Minimum 60% in SSC & HSSC Pre-Engineering / ICS with Physics and Math.',
    testPattern: {
      subjects: 'Mathematics (30), Physics (30), Chemistry/CS (20), General Comprehension (10)',
      totalMarks: 90,
      durationMinutes: 180,
      negativeMarking: true
    },
    officialPortalUrl: 'https://admissions.pieas.edu.pk',
    status: 'Upcoming',
    reminderSet: false
  },
  {
    id: 'bahria-cbt-2026',
    name: 'Bahria University Computer-Based Test (CBT)',
    universityOrBody: 'Bahria University (Islamabad, Karachi & Lahore)',
    series: 'Fall 2026 Admissions Session',
    registrationStartDate: '2026-05-01',
    registrationEndDate: '2026-07-15',
    examDate: '2026-07-22',
    resultDate: '2026-08-05',
    testFeePKR: 3000,
    eligibilityCriteria: 'Minimum 50% for Computing/CS and 60% for Engineering in Intermediate / HSSC or IBCC Equivalence.',
    testPattern: {
      subjects: 'Mathematics (30), Physics/CS (30), English (30), General Knowledge (10)',
      totalMarks: 100,
      durationMinutes: 90,
      negativeMarking: false
    },
    officialPortalUrl: 'https://cms.bahria.edu.pk/admissions',
    status: 'Upcoming',
    reminderSet: true
  }
];
