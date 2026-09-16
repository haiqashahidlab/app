import { University } from '../types';

export const PAKISTANI_UNIVERSITIES: University[] = [
  // 1. NED University of Engineering & Technology (Karachi) - CRITICAL REQUESTED
  {
    id: 'ned-khi',
    name: 'NED University of Engineering and Technology',
    shortName: 'NED UET',
    city: 'Karachi',
    province: 'Sindh',
    sector: 'Public',
    hecRanking: 'Top Engineering University in Sindh (#1 Public Tech Institute in Karachi)',
    establishedYear: 1921,
    officialWebsite: 'https://www.neduet.edu.pk',
    admissionsUrl: 'https://www.neduet.edu.pk/admission',
    feeStructureUrl: 'https://www.neduet.edu.pk/fee_structure',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: false,
    scholarships: [
      'NED Alumni Association of Southern California (NEDASC) Aid',
      'Sindh Educational Endowment Fund (SEEF)',
      'HEC Need-Based Undergraduate Scholarship',
      'PEEF Punjab/Sindh Inter-provincial Merit Scholarship',
      'K-Electric & Engro STEM Excellence Fellowships'
    ],
    badgeColor: 'emerald',
    summary: 'One of the oldest and most prestigious engineering institutions in Pakistan, located on University Road, Karachi. Highly respected for producing top-tier software and civil/mechanical engineers with very low subsidized tuition.',
    documentsRequired: [
      'HSC (Pre-Engineering / Computer Science) Marks Certificate (Original + 3 attested photocopies)',
      'SSC (Matriculation) Certificate & Marksheet showing Date of Birth (attested)',
      'Domicile Certificate (Form-C) of Karachi or Interior Sindh District',
      'Permanent Residence Certificate (PRC Form-D)',
      'Candidate CNIC or NADRA Smart Card / B-Form (attested photocopy)',
      'Father / Guardian CNIC photocopy',
      '6 recent passport-size photographs with sky-blue background',
      'Medical Fitness Certificate from registered MBBS Doctor',
      'Undertaking on Rs. 100 non-judicial stamp paper as per NED prospectus template',
      'Original paid bank deposit receipt for Pre-Admission Entry Test & Form'
    ],
    programs: [
      {
        id: 'ned-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 44500, // Below 50k band
        totalEstimatedCostPKR: 356000,
        closingMeritLastYear: 84.85,
        entryTestRequired: 'NED Pre-Admission Entry Test',
        formulaId: 'ned',
        formulaDescription: '60% NED Entry Test + 40% HSC / FSc (or 50/50 standard quota)',
        testSubjects: 'Mathematics (50%), Physics (30%), English (20%) / Computer Science',
        accreditation: 'NCEAC W-Category (Highest tier)',
        keyFeatures: ['Historic CS Department', 'Subsidized Government Fee', 'Strong Karachi Tech Corporate Network']
      },
      {
        id: 'ned-se',
        name: 'BE Software Engineering',
        degreeType: 'BE',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 46000, // Below 50k band
        totalEstimatedCostPKR: 368000,
        closingMeritLastYear: 85.90,
        entryTestRequired: 'NED Pre-Admission Entry Test',
        formulaId: 'ned',
        formulaDescription: '60% NED Entry Test + 40% HSC / FSc',
        testSubjects: 'Mathematics (50%), Physics (30%), English (20%)',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['Full PEC Engineering License', 'Hands-on Software Labs', '100% On-Campus Placement']
      },
      {
        id: 'ned-ai',
        name: 'BS Artificial Intelligence',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 48000,
        totalEstimatedCostPKR: 384000,
        closingMeritLastYear: 82.40,
        entryTestRequired: 'NED Pre-Admission Entry Test',
        formulaId: 'ned',
        formulaDescription: '60% NED Entry Test + 40% HSC / FSc',
        testSubjects: 'Mathematics (50%), Physics (30%), English (20%)',
        accreditation: 'NCEAC Accredited',
        keyFeatures: ['National Center of AI (NCAI) Lab', 'Computer Vision Sandbox', 'Deep Learning Workstations']
      },
      {
        id: 'ned-civil',
        name: 'BE Civil Engineering',
        degreeType: 'BE',
        field: 'Engineering',
        durationYears: 4,
        perSemesterFeePKR: 42000,
        totalEstimatedCostPKR: 336000,
        closingMeritLastYear: 76.50,
        entryTestRequired: 'NED Pre-Admission Entry Test',
        formulaId: 'ned',
        formulaDescription: '60% NED Entry Test + 40% HSC / FSc',
        testSubjects: 'Mathematics (50%), Physics (30%), English (20%)',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['Most Renowned Civil Faculty in Pakistan', 'Structural Testing Laboratories', 'Government & International Placements']
      },
      {
        id: 'ned-electrical',
        name: 'BE Electrical Engineering',
        degreeType: 'BE',
        field: 'Engineering',
        durationYears: 4,
        perSemesterFeePKR: 43500,
        totalEstimatedCostPKR: 348000,
        closingMeritLastYear: 78.20,
        entryTestRequired: 'NED Pre-Admission Entry Test',
        formulaId: 'ned',
        formulaDescription: '60% NED Entry Test + 40% HSC / FSc',
        testSubjects: 'Mathematics (50%), Physics (30%), English (20%)',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['Power Systems Lab', 'K-Electric & Siemens Linkage', 'Smart Grid Technology Research']
      }
    ]
  },

  // 2. Dawood University of Engineering & Technology (DUET Karachi) - USER REQUESTED
  {
    id: 'duet-khi',
    name: 'Dawood University of Engineering and Technology',
    shortName: 'DUET Karachi',
    city: 'Karachi',
    province: 'Sindh',
    sector: 'Public',
    hecRanking: 'Public Sector Engineering University in Sindh',
    establishedYear: 1962,
    officialWebsite: 'https://duet.edu.pk',
    admissionsUrl: 'https://admissions.duet.edu.pk',
    feeStructureUrl: 'https://duet.edu.pk/fee-structure',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: false,
    scholarships: [
      'Sindh Educational Endowment Fund (SEEF)',
      'HEC Need-Based Scholarship',
      'Mora / Zakat Scholarship for Deserving Students',
      'Dawood Foundation Financial Assistance'
    ],
    badgeColor: 'blue',
    summary: 'A public sector university established in 1962 located near New M.A. Jinnah Road, Karachi, specializing in core engineering and modern computing disciplines with highly subsidized fee structures.',
    documentsRequired: [
      'SSC / Matriculation Pass Certificate & Marks Sheet (Attested Photocopies)',
      'HSC / Intermediate Part-I & Part-II Marksheet (Pre-Engineering / ICS)',
      'Domicile Certificate (Form-C) & PRC (Form-D) of Sindh Province',
      'Candidate CNIC or NADRA B-Form (Attested Copy)',
      'Father / Guardian CNIC copy',
      '5 recent passport-size color photographs with white background',
      'Character Certificate from head of institution last attended',
      'Affidavit / Undertaking on Rs. 100 Stamp Paper attested by Oath Commissioner',
      'Original Paid Bank Challan of DUET Admission Processing'
    ],
    programs: [
      {
        id: 'duet-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 38000, // Below 50k
        totalEstimatedCostPKR: 304000,
        closingMeritLastYear: 74.20,
        entryTestRequired: 'DUET Pre-Admission Test',
        formulaId: 'duet',
        formulaDescription: '50% Pre-Admission Test + 50% HSC Pre-Engineering/ICS',
        testSubjects: 'Mathematics (40%), Physics (30%), English (20%), Chemistry/CS (10%)',
        accreditation: 'NCEAC Recognized',
        keyFeatures: ['Very Affordable Fee', 'Central City Location', 'Specialized Software Development Labs']
      },
      {
        id: 'duet-cyber',
        name: 'BS Cyber Security',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 39500,
        totalEstimatedCostPKR: 316000,
        closingMeritLastYear: 72.80,
        entryTestRequired: 'DUET Pre-Admission Test',
        formulaId: 'duet',
        formulaDescription: '50% Pre-Admission Test + 50% HSC Pre-Engineering/ICS',
        testSubjects: 'Mathematics (40%), Physics (30%), English (20%), Computer (10%)',
        accreditation: 'NCEAC Accredited',
        keyFeatures: ['Dedicated Cybersecurity Sandbox', 'Ethical Hacking Modules', 'Defensive Security Training']
      },
      {
        id: 'duet-chemical',
        name: 'BE Chemical Engineering',
        degreeType: 'BE',
        field: 'Engineering',
        durationYears: 4,
        perSemesterFeePKR: 36000,
        totalEstimatedCostPKR: 288000,
        closingMeritLastYear: 67.50,
        entryTestRequired: 'DUET Pre-Admission Test',
        formulaId: 'duet',
        formulaDescription: '50% Pre-Admission Test + 50% HSC Pre-Engineering',
        testSubjects: 'Mathematics (40%), Physics (30%), Chemistry (20%), English (10%)',
        accreditation: 'PEC Accredited (Level-II)',
        keyFeatures: ['Industrial Petrochemical Lab', 'Heavy Plant Simulation', 'Internships in Port Qasim & SITE']
      }
    ]
  },

  // 3. Habib University (Karachi) - USER REQUESTED (Top Private)
  {
    id: 'habib-khi',
    name: 'Habib University',
    shortName: 'Habib Uni',
    city: 'Karachi',
    province: 'Sindh',
    sector: 'Private',
    hecRanking: 'Leading Liberal Arts & STEM Institution in Pakistan',
    establishedYear: 2014,
    officialWebsite: 'https://habib.edu.pk',
    admissionsUrl: 'https://eapplication.habib.edu.pk',
    feeStructureUrl: 'https://habib.edu.pk/admissions/fees-and-financial-aid',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: true, // Enables lead generation
    admissionHelpline: '+92 (21) 1110 42242 (HABIB)',
    scholarships: [
      'HU Yohsin Scholarship (Up to 100% Tuition & Fee Waiver)',
      'Dean’s Merit Scholarship (60% to 80% Tuition Waiver)',
      'Comprehensive Need-Based Financial Aid Packages',
      'Al-Ghurair STEM Scholars Program'
    ],
    badgeColor: 'purple',
    summary: 'A world-class private liberal arts and science university in Karachi, modelled after top American universities with global faculty, award-winning campus architecture, and massive financial aid programs.',
    documentsRequired: [
      'Official Secondary School (SSC / O-Level) Transcripts & Certificates',
      'HSSC / Intermediate Part-I Marksheet or A-Level Predicted Grades Form',
      'IBCC Equivalence Certificate (Mandatory for O/A-Levels and American Diploma)',
      'Admissions Essay / Statement of Purpose (500 words)',
      'Two Confidential Letters of Academic Recommendation',
      'Copy of Candidate CNIC / NADRA Smart Card / Passport',
      'Father / Guardian’s CNIC and proof of income (for Yohsin Scholarship)',
      'Passport size photographs on white background'
    ],
    programs: [
      {
        id: 'habib-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 460000, // Above 150k band
        totalEstimatedCostPKR: 3680000,
        closingMeritLastYear: 78.00,
        entryTestRequired: 'Habib Admissions Test or SAT (1250+)',
        formulaId: 'habib',
        formulaDescription: '60% Entrance Test & Interview + 40% High School / Inter',
        testSubjects: 'Advanced Quantitative Reasoning (50%), Critical Reading & Writing (50%)',
        accreditation: 'NCEAC W-Category & International Global Linkage',
        keyFeatures: ['Exchange with UC Berkeley & Stanford', 'Liberal Arts Core', 'Over 85% Students on Financial Aid']
      },
      {
        id: 'habib-ce',
        name: 'BS Computer Engineering',
        degreeType: 'BE',
        field: 'Engineering',
        durationYears: 4,
        perSemesterFeePKR: 460000,
        totalEstimatedCostPKR: 3680000,
        closingMeritLastYear: 76.50,
        entryTestRequired: 'Habib Admissions Test or SAT',
        formulaId: 'habib',
        formulaDescription: '60% Entrance Test & Interview + 40% High School / Inter',
        testSubjects: 'Mathematics, Physics Fundamentals, Critical Logic',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['Embedded Robotics Hardware Labs', 'VLSI Design Modules', 'Silicon Valley Direct Pipeline']
      }
    ]
  },

  // 4. Salim Habib University (SHU Karachi) - USER REQUESTED (Private)
  {
    id: 'shu-khi',
    name: 'Salim Habib University (formerly Barrett Hodgson)',
    shortName: 'Salim Habib (SHU)',
    city: 'Karachi',
    province: 'Sindh',
    sector: 'Private',
    hecRanking: 'Chartered Private University in Korangi Creek, Karachi',
    establishedYear: 2015,
    officialWebsite: 'https://shu.edu.pk',
    admissionsUrl: 'https://admissions.shu.edu.pk',
    feeStructureUrl: 'https://shu.edu.pk/fee-structure',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: true, // Enables lead generation
    admissionHelpline: '+92 (21) 111-000-748',
    scholarships: [
      'Salim Habib Merit Scholarships (Up to 100% Tuition Concession)',
      'Need-Based Fee Assistance for Underprivileged Students',
      'Kinship Concession (20% tuition off for siblings)',
      'Sports & Extra-Curricular Talent Awards'
    ],
    badgeColor: 'emerald',
    summary: 'A fast-growing modern private university located at Korangi Creek Karachi, endowed by the Salim Habib Trust, with cutting-edge laboratories in Pharmaceutical Sciences, Biomedical Engineering, and Computer Science.',
    documentsRequired: [
      'HSC / Intermediate Marksheet (Part-I or Part-II) with minimum 50% (60% for Pharmacy)',
      'Matric / SSC Certificate showing Date of Birth (attested copy)',
      'Copy of Candidate’s CNIC or NADRA B-Form',
      'Father / Guardian’s CNIC copy',
      '4 recent passport-size photographs (white background)',
      'Hope Certificate from College Principal (if awaiting HSSC Part-2 result)',
      'Original Paid Fee Challan / Online Payment Receipt for Application'
    ],
    programs: [
      {
        id: 'shu-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 125000, // Below 150k band
        totalEstimatedCostPKR: 1000000,
        closingMeritLastYear: 62.00,
        entryTestRequired: 'SHU Aptitude Test / NTS-NAT',
        formulaId: 'salim_habib',
        formulaDescription: '50% Aptitude Test + 50% Intermediate / HSSC',
        testSubjects: 'Analytical Reasoning (30%), Mathematics (40%), English (30%)',
        accreditation: 'NCEAC Approved & HEC Recognized',
        keyFeatures: ['Modern Apple iMac Labs', 'Corporate Mentorship Program', 'Generous Merit Scholarships']
      },
      {
        id: 'shu-pharmd',
        name: 'Pharm-D (Doctor of Pharmacy)',
        degreeType: 'Pharm-D',
        field: 'Medical & Health',
        durationYears: 5,
        perSemesterFeePKR: 145000, // Below 150k band
        totalEstimatedCostPKR: 1450000,
        closingMeritLastYear: 68.50,
        entryTestRequired: 'SHU Pharmacy Aptitude Test',
        formulaId: 'salim_habib',
        formulaDescription: '50% Aptitude Test + 50% FSc Pre-Medical',
        testSubjects: 'Biology (40%), Chemistry (30%), English (20%), General Science (10%)',
        accreditation: 'Pharmacy Council of Pakistan (PCP) Approved',
        keyFeatures: ['Direct Link with Barrett Hodgson Pharma', 'Formulation Research Labs', 'Hospital Residency Attachments']
      },
      {
        id: 'shu-bba',
        name: 'BBA (Hons)',
        degreeType: 'BBA',
        field: 'Business & Management',
        durationYears: 4,
        perSemesterFeePKR: 110000, // Below 150k band
        totalEstimatedCostPKR: 880000,
        closingMeritLastYear: 58.00,
        entryTestRequired: 'SHU Aptitude Test / NTS-NAT',
        formulaId: 'salim_habib',
        formulaDescription: '50% Aptitude Test + 50% HSSC',
        testSubjects: 'English Proficiency, Basic Math, General Knowledge',
        accreditation: 'National Business Education Accreditation Council (NBEAC)',
        keyFeatures: ['Fintech & Marketing Specializations', 'Business Incubation Center', 'Industry Live Projects']
      }
    ]
  },

  // 5. Al-Kauthar University (Islamabad) - USER REQUESTED
  {
    id: 'alkauthar-isb',
    name: 'Al-Kauthar University',
    shortName: 'Al-Kauthar',
    city: 'Islamabad',
    province: 'Islamabad Capital',
    sector: 'Private',
    hecRanking: 'Higher Education Institute in Islamabad',
    establishedYear: 2002,
    officialWebsite: 'https://alkauthar.edu.pk',
    admissionsUrl: 'https://alkauthar.edu.pk/admissions',
    feeStructureUrl: 'https://alkauthar.edu.pk/fees',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: true, // Enables lead generation
    admissionHelpline: '+92 (51) 444-1234',
    scholarships: [
      'Al-Kauthar Endowment Trust Merit Stipend',
      'Need-Based Fee Subsidies and Free Boarding for Deserving Students',
      'Hafiz-e-Quran Full Tuition Waiver'
    ],
    badgeColor: 'amber',
    summary: 'A distinguished educational complex in Sector H-8/2 Islamabad combining classical scholarship with modern IT and social sciences, featuring peaceful on-campus residential facilities and high moral grooming.',
    documentsRequired: [
      'Matriculation / SSC Sanad & Marksheet (Attested photocopies)',
      'HSSC / Intermediate Part-I & II Detailed Marks Sheet',
      'Candidate CNIC / NADRA B-Form copy',
      'Father / Guardian CNIC copy',
      '4 recent passport size photographs with blue background',
      'Character Certificate from head of previous educational institution',
      'Affidavit of Good Conduct and adherence to campus discipline'
    ],
    programs: [
      {
        id: 'alkauthar-cs',
        name: 'BS Computer Science & Data Analytics',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 65000, // Below 100k band
        totalEstimatedCostPKR: 520000,
        closingMeritLastYear: 58.00,
        entryTestRequired: 'Al-Kauthar Aptitude Test',
        formulaId: 'alkauthar',
        formulaDescription: '50% Aptitude Test + 40% FSc + 10% Matric',
        testSubjects: 'Mathematics (40%), English Comprehension (30%), General Science & Logic (30%)',
        accreditation: 'HEC Recognized',
        keyFeatures: ['Affordable Capital City Tuition', 'Free Hostel for Top Scorers', 'Modern Computing Laboratories']
      },
      {
        id: 'alkauthar-is',
        name: 'BS Islamic Thought & Comparative Humanities',
        degreeType: 'BS',
        field: 'Law & Humanities',
        durationYears: 4,
        perSemesterFeePKR: 45000, // Below 50k band
        totalEstimatedCostPKR: 360000,
        closingMeritLastYear: 52.00,
        entryTestRequired: 'Al-Kauthar Aptitude Test',
        formulaId: 'alkauthar',
        formulaDescription: '50% Aptitude Test + 50% Academic Record',
        testSubjects: 'Arabic / Urdu Linguistics, General Knowledge, Islamic History',
        accreditation: 'HEC Approved',
        keyFeatures: ['Bilingual Arabic & English Training', 'Full Research Library', 'International Faculty Exchange']
      }
    ]
  },

  // 6. University of the Punjab (PU Lahore - PUCIT & College of Engineering) - USER REQUESTED
  {
    id: 'pu-lhr',
    name: 'University of the Punjab',
    shortName: 'Punjab University (PU)',
    city: 'Lahore',
    province: 'Punjab',
    sector: 'Public',
    hecRanking: '#1 General University in Pakistan (Oldest University in Pakistan, Estd 1882)',
    establishedYear: 1882,
    officialWebsite: 'https://pu.edu.pk',
    admissionsUrl: 'https://admissions.pu.edu.pk',
    feeStructureUrl: 'https://pu.edu.pk/page/show/Fee-Structure.html',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: false,
    scholarships: [
      'Punjab Educational Endowment Fund (PEEF) Scholarships',
      'PU Need-Based Student Financial Aid Office (SFAO) Fee Waivers',
      'Ehsaas Undergraduate Scholarship Scheme',
      'Hafiz-e-Quran 20 Bonus Marks & Merit Stipends'
    ],
    badgeColor: 'emerald',
    summary: 'The mother of all Pakistani universities, sprawling across Quaid-e-Azam (New) Campus and Allama Iqbal (Old) Campus Lahore. Home to PUCIT (Punjab University College of Information Technology), producing thousands of software leaders at a tiny fraction of private university fees.',
    documentsRequired: [
      'Matriculation / SSC Sanad & Marksheet (Original + 3 attested photocopies)',
      'Intermediate / FSc Part-I or Part-II Detailed Marks Certificate',
      'PU Admission Entry Test Roll Number Slip & Verified Result Card',
      'Domicile Certificate of Punjab Province (or respective quota domicile)',
      'CNIC or NADRA B-Form of applicant and Father/Guardian (attested copy)',
      '4 recent passport-size photographs with blue background attested on reverse',
      'Character Certificate from head of college last attended',
      'Hafiz-e-Quran Sanad from registered Wafaq (if claiming 20 bonus marks)',
      'Original Paid Fee Deposit Slip / Challan of Habib Bank Limited (HBL)'
    ],
    programs: [
      {
        id: 'pucit-cs',
        name: 'BS Computer Science (FCIT / PUCIT)',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 39500, // Below 50k band
        totalEstimatedCostPKR: 316000,
        closingMeritLastYear: 89.45,
        entryTestRequired: 'PU Admission Test',
        formulaId: 'pu',
        formulaDescription: '25% PU Entry Test + 75% Academic Record (FSc & Matric)',
        testSubjects: 'Mathematics (40%), Physics (30%), English (20%), General (10%)',
        accreditation: 'NCEAC W-Category (Highest Accreditation Tier)',
        keyFeatures: ['PUCIT Old & New Campus Legacy', 'Unmatched Alumni Network in Lahore Tech Industry', 'Subsidized Nominal Fee']
      },
      {
        id: 'pucit-se',
        name: 'BS Software Engineering (FCIT / PUCIT)',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 41000, // Below 50k band
        totalEstimatedCostPKR: 328000,
        closingMeritLastYear: 88.80,
        entryTestRequired: 'PU Admission Test',
        formulaId: 'pu',
        formulaDescription: '25% PU Entry Test + 75% Academic Record',
        testSubjects: 'Mathematics (40%), Physics (30%), English (20%), General (10%)',
        accreditation: 'NCEAC W-Category',
        keyFeatures: ['Software Architecture Focus', 'Direct Placements in Systems Ltd, Netsol & Devsinc', 'High Academic Rigor']
      },
      {
        id: 'pu-chem-eng',
        name: 'BSc Chemical Engineering',
        degreeType: 'BE',
        field: 'Engineering',
        durationYears: 4,
        perSemesterFeePKR: 43000,
        totalEstimatedCostPKR: 344000,
        closingMeritLastYear: 78.60,
        entryTestRequired: 'PU Admission Test',
        formulaId: 'pu',
        formulaDescription: '25% PU Entry Test + 75% Academic Record',
        testSubjects: 'Mathematics (40%), Physics (30%), Chemistry (20%), English (10%)',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['Institute of Chemical Engineering & Tech (ICET)', 'Pilot Scale Industrial Plant', 'Fertilizer & Refinery Placements']
      }
    ]
  },

  // 7. NUST (Islamabad) - USER REQUESTED
  {
    id: 'nust-isb',
    name: 'National University of Sciences and Technology',
    shortName: 'NUST',
    city: 'Islamabad',
    province: 'Islamabad Capital',
    sector: 'Public',
    hecRanking: '#1 in Engineering & Technology (QS #353 Worldwide)',
    establishedYear: 1991,
    officialWebsite: 'https://nust.edu.pk',
    admissionsUrl: 'https://ugadmissions.nust.edu.pk',
    feeStructureUrl: 'https://nust.edu.pk/admissions/fee-structure',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: false,
    scholarships: [
      'NUST Need-Based Scholarship (100% Tuition & Hostel waiver)',
      'HEC Need-Based Scholarship',
      'Ehsaas Undergraduate Scholarship',
      'PEEF / Chief Minister Merit Scholarship',
      'Alumni Endowed Trust Fund'
    ],
    badgeColor: 'emerald',
    summary: 'Pakistan\'s premier science and technology university located in H-12 Islamabad, renowned for state-of-the-art research facilities, technology incubation, and highest corporate placement rates.',
    documentsRequired: [
      'SSC (Matriculation) Certificate & Detailed Marks Certificate (Attested)',
      'HSSC / Intermediate Part-I or Part-II Marks Sheet (Attested)',
      'Candidate CNIC / NADRA Smart Card / B-Form (Attested Copy)',
      'Father / Guardian CNIC photocopy',
      'Original Paid Bank Challan of Habib Bank Limited (HBL) for NET',
      'Equivalence Certificate from IBCC (Mandatory for O/A-Levels)',
      'Medical Fitness Certificate from registered Medical Officer',
      'Undertaking on Rs. 100 non-judicial stamp paper'
    ],
    programs: [
      {
        id: 'nust-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 198000, // Above 150k
        totalEstimatedCostPKR: 1650000,
        closingMeritLastYear: 80.25,
        entryTestRequired: 'NUST Entry Test (NET)',
        formulaId: 'nust',
        formulaDescription: '75% NET + 15% FSc/HSSC + 10% Matric/SSC',
        testSubjects: 'Mathematics (80 MCQs), Physics (60 MCQs), Chemistry/CS (30 MCQs), English (20 MCQs), Intelligence (10 MCQs)',
        accreditation: 'NCEAC W-Category (Highest tier)',
        keyFeatures: ['SEECS Flagship Faculty', 'Direct Google/Meta Tech Placements', 'High-Performance Computing Lab']
      },
      {
        id: 'nust-se',
        name: 'BS Software Engineering',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 198000,
        totalEstimatedCostPKR: 1650000,
        closingMeritLastYear: 79.10,
        entryTestRequired: 'NUST Entry Test (NET)',
        formulaId: 'nust',
        formulaDescription: '75% NET + 15% FSc/HSSC + 10% Matric/SSC',
        testSubjects: 'Mathematics (80), Physics (60), Chemistry/CS (30), English (20), Intelligence (10)',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['Agile Industry Sandbox', 'Silicon Valley Exchange Programs', 'Top Startup Incubator NSTP']
      },
      {
        id: 'nust-ee',
        name: 'BE Electrical Engineering',
        degreeType: 'BE',
        field: 'Engineering',
        durationYears: 4,
        perSemesterFeePKR: 198000,
        totalEstimatedCostPKR: 1650000,
        closingMeritLastYear: 72.40,
        entryTestRequired: 'NUST Entry Test (NET)',
        formulaId: 'nust',
        formulaDescription: '75% NET + 15% FSc/HSSC + 10% Matric/SSC',
        testSubjects: 'Mathematics (80), Physics (60), Chemistry/CS (30), English (20), Intelligence (10)',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['National Center for Robotics & Automation (NCRA)', 'Power & Telecom Labs', 'Worldwide IEEE Recognition']
      }
    ]
  },

  // 8. FAST-NUCES (Islamabad, Lahore, Karachi campuses) - USER REQUESTED
  {
    id: 'fast-isb',
    name: 'National University of Computer and Emerging Sciences',
    shortName: 'FAST-NUCES',
    city: 'Islamabad / Lahore / Karachi',
    province: 'Islamabad Capital',
    sector: 'Private',
    hecRanking: '#1 Computing & Software Development Institution in Pakistan',
    establishedYear: 2000,
    officialWebsite: 'https://nu.edu.pk',
    admissionsUrl: 'https://admissions.nu.edu.pk',
    feeStructureUrl: 'https://nu.edu.pk/Admissions/FeeStructure',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: true, // Enables lead generation
    admissionHelpline: '+92 (51) 111-128-128',
    scholarships: [
      'FAST Need-Based Financial Assistance (Fee waivers up to 100%)',
      'PEEF / Chief Minister Special Scholarships',
      'Sindh Educational Endowment Fund (SEEF)',
      'HEC Need-Based Program',
      'Academic Semester Merit Positions (Top 3 students per batch)'
    ],
    badgeColor: 'blue',
    summary: 'The gold standard for Computer Science education in Pakistan. FAST graduates dominate the national and international tech scene, Silicon Valley startups, and algorithmic programming competitions.',
    documentsRequired: [
      'Matriculation / SSC Marksheet and Certificate (Attested copy)',
      'HSSC / Intermediate Part-I Marksheet (minimum 50% for Computing)',
      'Hope Certificate signed by College Principal (if awaiting Part-2)',
      'Candidate CNIC or NADRA B-Form (Attested Copy)',
      'Father / Guardian CNIC copy',
      '4 recent passport-size photographs (blue background)',
      'Original Paid Bank Challan of FAST Admission Application Fee',
      'IBCC Equivalence Certificate (if O/A-Levels applicant)'
    ],
    programs: [
      {
        id: 'fast-isb-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 215000, // Above 150k
        totalEstimatedCostPKR: 1720000,
        closingMeritLastYear: 76.80,
        entryTestRequired: 'FAST NU Test / NTS-NAT / SAT',
        formulaId: 'fast',
        formulaDescription: '50% NU Entry Test + 50% FSc/HSSC (Part-1 / Total)',
        testSubjects: 'Advanced Math (50 MCQs), Basic Math (20 MCQs), English (30 MCQs), Analytical Reasoning (20 MCQs) - With -0.25 Negative Marking',
        accreditation: 'NCEAC W-Category',
        keyFeatures: ['Industry Benchmark Coding Rigor', 'Highest Average Starting Salaries in Pakistan', 'Competitive Programming Culture']
      },
      {
        id: 'fast-se',
        name: 'BS Software Engineering',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 215000,
        totalEstimatedCostPKR: 1720000,
        closingMeritLastYear: 74.90,
        entryTestRequired: 'FAST NU Test',
        formulaId: 'fast',
        formulaDescription: '50% NU Entry Test + 50% FSc/HSSC',
        testSubjects: 'Advanced Math (50), Basic Math (20), English (30), Analytical (20) [-0.25 neg]',
        accreditation: 'NCEAC W-Category & PEC Level-II',
        keyFeatures: ['Large-scale Software Architectures', 'Enterprise DevOps Practicums', 'Direct Tech Hiring']
      },
      {
        id: 'fast-ai',
        name: 'BS Artificial Intelligence',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 215000,
        totalEstimatedCostPKR: 1720000,
        closingMeritLastYear: 75.10,
        entryTestRequired: 'FAST NU Test',
        formulaId: 'fast',
        formulaDescription: '50% NU Entry Test + 50% FSc/HSSC',
        testSubjects: 'Advanced Math (50), Basic Math (20), English (30), Analytical (20)',
        accreditation: 'NCEAC Accredited',
        keyFeatures: ['Machine Learning Engineering', 'GPU Clusters Access', 'Computer Vision Labs']
      }
    ]
  },

  // 9. GIKI (Topi, KP) - USER REQUESTED
  {
    id: 'giki-topi',
    name: 'Ghulam Ishaq Khan Institute of Engineering Sciences and Technology',
    shortName: 'GIKI Topi',
    city: 'Topi',
    province: 'Khyber Pakhtunkhwa',
    sector: 'Private',
    hecRanking: 'Top Ranked Engineering & Technology Institute in Pakistan',
    establishedYear: 1993,
    officialWebsite: 'https://giki.edu.pk',
    admissionsUrl: 'https://admissions.giki.edu.pk',
    feeStructureUrl: 'https://giki.edu.pk/admissions/admissions-undergraduates/ug-fees-and-expenses',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: true, // Enables lead generation
    admissionHelpline: '+92 (938) 271858',
    scholarships: [
      'GIKI Alumni Association Financial Assistance',
      'Khyber Pakhtunkhwa Free Education Scheme',
      'Need-Based Fee Concession (Up to 100% Tuition Waiver)',
      'Top 20 Merit Board Scholarships'
    ],
    badgeColor: 'amber',
    summary: 'A residential engineering university nestled in the foothills of Topi, Swabi. Renowned for its tight-knit campus life, cutting-edge engineering labs, and prominent corporate alumni across the world.',
    documentsRequired: [
      'Matric / O-Level Certificate and Marks Sheet (Attested copy)',
      'HSSC / Intermediate Part-I Marksheet or A-Level Statement of Results',
      'Candidate CNIC / NADRA B-Form photocopy',
      'Father / Guardian CNIC photocopy',
      'Paid Bank Challan of GIKI Admission Processing Fee',
      'IBCC Equivalence Certificate (if applicable for foreign system)',
      'Medical Fitness Certificate signed by Civil Surgeon'
    ],
    programs: [
      {
        id: 'giki-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 440000, // Above 150k band
        totalEstimatedCostPKR: 3520000,
        closingMeritLastYear: 81.50,
        entryTestRequired: 'GIKI Admission Test',
        formulaId: 'giki',
        formulaDescription: '85% GIKI Entrance Test + 15% FSc / O-Levels',
        testSubjects: 'Mathematics (35 MCQs), Physics (35 MCQs), English (10 MCQs)',
        accreditation: 'NCEAC W-Category',
        keyFeatures: ['100% Residential Campus Life', 'Unmatched Alumni Networking in Multi-Nationals', 'High-end Computing Labs']
      },
      {
        id: 'giki-me',
        name: 'BS Mechanical Engineering',
        degreeType: 'BE',
        field: 'Engineering',
        durationYears: 4,
        perSemesterFeePKR: 440000,
        totalEstimatedCostPKR: 3520000,
        closingMeritLastYear: 73.20,
        entryTestRequired: 'GIKI Admission Test',
        formulaId: 'giki',
        formulaDescription: '85% GIKI Entrance Test + 15% FSc / O-Levels',
        testSubjects: 'Mathematics (35), Physics (35), English (10)',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['Advanced Robotics & Thermo Labs', 'Formula Student Racing Team', 'International Aerospace Links']
      }
    ]
  },

  // 10. PIEAS (Islamabad) - USER REQUESTED
  {
    id: 'pieas-isb',
    name: 'Pakistan Institute of Engineering and Applied Sciences',
    shortName: 'PIEAS',
    city: 'Islamabad',
    province: 'Islamabad Capital',
    sector: 'Public',
    hecRanking: '#1 Ranked University in Pakistan by HEC (Multiple Cycles)',
    establishedYear: 1967,
    officialWebsite: 'https://pieas.edu.pk',
    admissionsUrl: 'https://admissions.pieas.edu.pk',
    feeStructureUrl: 'https://pieas.edu.pk/admissions/fees',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: false,
    scholarships: [
      'PIEAS Fellowship & IT Endowment Fund',
      'PAEC Merit Stipends & Tuition Concessions',
      'HEC Need-Based Undergraduate Scholarship',
      'Pakistan Bait-ul-Mal Educational Assistance'
    ],
    badgeColor: 'emerald',
    summary: 'The educational powerhouse affiliated with the Pakistan Atomic Energy Commission (PAEC). Known for the most rigorous academic standards in Pakistan, high faculty-to-student ratio, and immense research output.',
    documentsRequired: [
      'Matriculation / SSC Certificate & DMC (Attested Copy)',
      'HSSC / Intermediate Part-I or Part-II Detailed Marksheet (minimum 60%)',
      'Candidate CNIC / B-Form copy',
      'Father / Guardian CNIC photocopy',
      'Paid Bank Challan of Askari Bank / National Bank of Pakistan (NBP)',
      'Domicile Certificate of Candidate',
      'Passport size photographs with blue background'
    ],
    programs: [
      {
        id: 'pieas-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 98000, // Below 100k band
        totalEstimatedCostPKR: 784000,
        closingMeritLastYear: 78.90,
        entryTestRequired: 'PIEAS Written Admission Test',
        formulaId: 'pieas',
        formulaDescription: '60% PIEAS Test + 25% FSc + 15% Matric / SSC',
        testSubjects: 'Mathematics (30%), Physics (30%), Chemistry/CS (20%), English (20%)',
        accreditation: 'NCEAC W-Category Tier',
        keyFeatures: ['Highest Faculty PhD Ratio in Pakistan', 'Access to National Supercomputers', 'Government Strategic Placements']
      },
      {
        id: 'pieas-ee',
        name: 'BS Electrical Engineering',
        degreeType: 'BE',
        field: 'Engineering',
        durationYears: 4,
        perSemesterFeePKR: 98000,
        totalEstimatedCostPKR: 784000,
        closingMeritLastYear: 75.40,
        entryTestRequired: 'PIEAS Written Admission Test',
        formulaId: 'pieas',
        formulaDescription: '60% PIEAS Test + 25% FSc + 15% Matric / SSC',
        testSubjects: 'Mathematics (30%), Physics (30%), Chemistry/CS (20%), English (20%)',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['Nuclear Instrumentation Labs', 'Advanced Signal Processing', 'PAEC / NESCOM Direct Pathways']
      }
    ]
  },

  // 11. COMSATS University Islamabad (Islamabad & Lahore) - USER REQUESTED
  {
    id: 'comsats-isb',
    name: 'COMSATS University Islamabad',
    shortName: 'COMSATS (CUI)',
    city: 'Islamabad / Lahore',
    province: 'Islamabad Capital',
    sector: 'Public',
    hecRanking: 'Top 3 in Computer Science & Research Citations in Pakistan',
    establishedYear: 1998,
    officialWebsite: 'https://comsats.edu.pk',
    admissionsUrl: 'https://admissions.comsats.edu.pk',
    feeStructureUrl: 'https://comsats.edu.pk/admissions/fee-structure',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: false,
    scholarships: [
      'COMSATS Need-Based Financial Assistance',
      'Ehsaas Undergraduate Scholarship Scheme',
      'PEEF Scholarships for Punjab & KP Domicile',
      'HEC Need-Based Program'
    ],
    badgeColor: 'blue',
    summary: 'A public sector degree-awarding institute with major campuses across Islamabad, Lahore, Abbottabad, and Wah. Very popular for Computer Science and Software Engineering with multiple entry test chances via NTS-NAT.',
    documentsRequired: [
      'Matriculation / SSC Result Card & Certificate (Attested)',
      'HSSC / Intermediate Part-I Marksheet (minimum 50% for IT, 60% for Engg)',
      'NTS-NAT Result Card (Valid score)',
      'Candidate CNIC / NADRA B-Form (Attested Copy)',
      'Father / Guardian CNIC photocopy',
      'Candidate Domicile Certificate',
      '4 recent passport-size photographs with blue background',
      'Original Paid Bank Challan of HBL / Allied Bank'
    ],
    programs: [
      {
        id: 'cui-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 125000, // Below 150k band
        totalEstimatedCostPKR: 1000000,
        closingMeritLastYear: 84.10,
        entryTestRequired: 'NTS-NAT (NAT-ICS / Pre-Engg)',
        formulaId: 'comsats',
        formulaDescription: '50% NTS NAT + 40% FSc + 10% Matric',
        testSubjects: 'English (20%), Analytical Reasoning (20%), Quantitative Math (20%), Subject Physics/Math (30%), General (10%)',
        accreditation: 'NCEAC W-Category',
        keyFeatures: ['Multiple NTS NAT test chances', 'Large IT Faculty', 'Modern Park Road Islamabad Campus']
      },
      {
        id: 'cui-se',
        name: 'BS Software Engineering',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 125000,
        totalEstimatedCostPKR: 1000000,
        closingMeritLastYear: 82.50,
        entryTestRequired: 'NTS-NAT',
        formulaId: 'comsats',
        formulaDescription: '50% NTS NAT + 40% FSc + 10% Matric',
        testSubjects: 'English (20%), Analytical (20%), Quantitative (20%), Subject (30%), General (10%)',
        accreditation: 'NCEAC W-Category',
        keyFeatures: ['Software Quality Engineering Labs', 'Active Tech Clubs', 'High Graduation Rate']
      }
    ]
  },

  // 12. UET Lahore (Punjab) - PUBLIC
  {
    id: 'uet-lhr',
    name: 'University of Engineering and Technology Lahore',
    shortName: 'UET Lahore',
    city: 'Lahore',
    province: 'Punjab',
    sector: 'Public',
    hecRanking: 'Premier Public Engineering University in Punjab (Estd. 1921)',
    establishedYear: 1921,
    officialWebsite: 'https://uet.edu.pk',
    admissionsUrl: 'https://admission.uet.edu.pk',
    feeStructureUrl: 'https://uet.edu.pk/admission/fee-structure',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: false,
    scholarships: [
      'PEEF Undergraduate Scholarships',
      'HEC Need-Based Financial Aid',
      'Alumni Reunion Endowed Scholarships',
      'Ehsaas Scholarship Scheme'
    ],
    badgeColor: 'emerald',
    summary: 'The historic bedrock of engineering education in Punjab, located on Grand Trunk Road Lahore. Renowned for low subsidized fees, huge campus infrastructure, and generations of engineering pioneers.',
    documentsRequired: [
      'Matriculation / SSC Sanad & Marksheet (Original + 3 attested photocopies)',
      'Intermediate / FSc (Pre-Engineering / ICS) Detailed Marks Sheet',
      'UET ECAT Entrance Test Admit Card and Result Card',
      'Domicile Certificate of Punjab (or respective district/province quota)',
      'Candidate CNIC / NADRA B-Form (Attested copy)',
      'Father / Guardian CNIC photocopy',
      '6 passport-size photographs with light blue background',
      'Medical Fitness Certificate by UET Medical Officer or MS Govt Hospital',
      'Affidavit on Rs. 100 Stamp Paper'
    ],
    programs: [
      {
        id: 'uet-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 48000, // Below 50k band
        totalEstimatedCostPKR: 384000,
        closingMeritLastYear: 82.35,
        entryTestRequired: 'UET Combined ECAT',
        formulaId: 'uet',
        formulaDescription: '33% ECAT + 67% FSc / Intermediate',
        testSubjects: 'Mathematics (30 MCQs), Physics (30 MCQs), Chemistry/CS (30 MCQs), English (10 MCQs) - With -1 Negative Marking',
        accreditation: 'NCEAC W-Category',
        keyFeatures: ['Subsidized Government Fee', 'Central Lahore Campus', 'Active Alumni Network']
      },
      {
        id: 'uet-mech',
        name: 'BSc Mechanical Engineering',
        degreeType: 'BE',
        field: 'Engineering',
        durationYears: 4,
        perSemesterFeePKR: 48000,
        totalEstimatedCostPKR: 384000,
        closingMeritLastYear: 74.80,
        entryTestRequired: 'UET ECAT',
        formulaId: 'uet',
        formulaDescription: '33% ECAT + 67% FSc / Intermediate',
        testSubjects: 'Mathematics (30), Physics (30), Chemistry (30), English (10)',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['Historic Heavy Machinery Workshop', 'Turbine & Thermal Labs', 'WAPDA & Heavy Industries Link']
      }
    ]
  },

  // 13. LUMS (Lahore) - TOP PRIVATE
  {
    id: 'lums-lhr',
    name: 'Lahore University of Management Sciences',
    shortName: 'LUMS',
    city: 'Lahore',
    province: 'Punjab',
    sector: 'Private',
    hecRanking: '#1 Business & Management School in Pakistan (AACSB Accredited)',
    establishedYear: 1985,
    officialWebsite: 'https://lums.edu.pk',
    admissionsUrl: 'https://admission.lums.edu.pk',
    feeStructureUrl: 'https://lums.edu.pk/programmes/undergraduate-fee-structure',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: true, // Enables lead generation
    admissionHelpline: '+92 (42) 3560-8000',
    scholarships: [
      'National Outreach Programme (NOP) - 100% Free Education & Living',
      'LUMS Merit Scholarship (Top 100 Ranked Applicants)',
      'Extensive Need-Based Financial Aid (Over 35% Students receive aid)',
      'Shahid Hussain Foundation Grants'
    ],
    badgeColor: 'purple',
    summary: 'Pakistan\'s internationally renowned private research university located in DHA Lahore. Exceptional academic rigor, Harvard-case pedagogy, high foreign master\'s placements, and massive financial aid via the NOP program.',
    documentsRequired: [
      'Secondary School Certificate / O-Level Statement of Results',
      'HSSC / Intermediate Part-I or A-Level Predicted Grades',
      'Official SAT Score Report (or LUMS LCAT Registration)',
      'Personal Statement / Admission Essay (demonstrating leadership & vision)',
      'Extra-Curricular Achievements & Honors Portfolio',
      'Two Confidential Teacher Evaluation Forms',
      'Candidate & Guardian CNIC / Passport copies',
      'Detailed Financial Aid Documents (if applying for aid)'
    ],
    programs: [
      {
        id: 'lums-cs',
        name: 'BS Computer Science (SBASSE)',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 590000, // Above 150k band
        totalEstimatedCostPKR: 4720000,
        closingMeritLastYear: 86.50,
        entryTestRequired: 'SAT (1350+ Recommended) or LCAT + SSE Test',
        formulaId: 'general',
        formulaDescription: 'Holistic Evaluation: Test Scores + Academic Record + Essays & Extracurriculars',
        testSubjects: 'SAT Math (800) & Evidence-Based Reading/Writing (800) or SSE Scientific Aptitude',
        accreditation: 'NCEAC W-Category & Global Accreditations',
        keyFeatures: ['Syed Babar Ali School of Science and Engineering', 'Ivy League PhD Faculty', 'Top US/Europe PhD Placements']
      },
      {
        id: 'lums-bba',
        name: 'BSc (Hons) Management Science (SDSB)',
        degreeType: 'BBA',
        field: 'Business & Management',
        durationYears: 4,
        perSemesterFeePKR: 590000,
        totalEstimatedCostPKR: 4720000,
        closingMeritLastYear: 84.20,
        entryTestRequired: 'SAT or LCAT',
        formulaId: 'general',
        formulaDescription: 'Holistic Evaluation (SAT + O/A-Levels or Matric/FSc + Essay)',
        testSubjects: 'SAT Reasoning (English & Math)',
        accreditation: 'AACSB Accredited (Top 5% Business Schools Worldwide)',
        keyFeatures: ['Harvard Business School Case Method', 'McKinsey, BCG & Unilever Direct Recruits', 'Billion-Rupee Incubator LHI']
      }
    ]
  },

  // 14. IBA Karachi - TOP PUBLIC/AUTONOMOUS
  {
    id: 'iba-khi',
    name: 'Institute of Business Administration Karachi',
    shortName: 'IBA Karachi',
    city: 'Karachi',
    province: 'Sindh',
    sector: 'Semi-Government',
    hecRanking: 'Premier Business & Computer Science Institute in Karachi (AACSB Member)',
    establishedYear: 1955,
    officialWebsite: 'https://iba.edu.pk',
    admissionsUrl: 'https://admissions.iba.edu.pk',
    feeStructureUrl: 'https://iba.edu.pk/fee_structure.php',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: true, // Enables lead generation
    admissionHelpline: '+92 (21) 111-422-422',
    scholarships: [
      'IBA National Talent Hunt Program (NTHP) - 100% Free Tuition & Stipend',
      'IBA Need-Based Financial Aid & Endowed Scholarships',
      'Sindh Educational Endowment Fund (SEEF)',
      'Alumni Supported Tuition Waivers'
    ],
    badgeColor: 'purple',
    summary: 'Founded in 1955 in partnership with Wharton School of Finance, IBA Karachi is renowned for shaping Pakistan\'s corporate, banking, and tech leadership across its Main Campus (Karachi University) and City Campus (Garden).',
    documentsRequired: [
      'SSC / Matriculation or O-Level Marks Sheet and Certificate',
      'HSSC / Intermediate Part-I or A-Level Statement of Results (minimum 60%)',
      'Admit Card of IBA Aptitude Test',
      'Candidate CNIC / Smart Card / B-Form copy',
      'Father / Guardian CNIC photocopy',
      '2 passport-size photographs on white background',
      'Paid Fee Voucher of IBA Admission Application',
      'IBCC Equivalence Certificate (for O/A-Level candidates)'
    ],
    programs: [
      {
        id: 'iba-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 345000, // Above 150k band
        totalEstimatedCostPKR: 2760000,
        closingMeritLastYear: 79.50,
        entryTestRequired: 'IBA Aptitude Test (or SAT 1270+ with 600+ Math)',
        formulaId: 'general',
        formulaDescription: 'IBA Aptitude Test Cut-off Score + Interview + HSSC/Matric record',
        testSubjects: 'Mathematics (45 MCQs), English (45 MCQs) - Strict Sectional Cutoffs',
        accreditation: 'NCEAC W-Category Tier',
        keyFeatures: ['City Campus Tech Hub', 'Direct Multi-National Banking & FMCG Placements', 'Rigorous Math & Algo Training']
      },
      {
        id: 'iba-bba',
        name: 'BBA (Bachelor of Business Administration)',
        degreeType: 'BBA',
        field: 'Business & Management',
        durationYears: 4,
        perSemesterFeePKR: 345000,
        totalEstimatedCostPKR: 2760000,
        closingMeritLastYear: 80.80,
        entryTestRequired: 'IBA Aptitude Test (or SAT 1270+)',
        formulaId: 'general',
        formulaDescription: 'IBA Aptitude Test Score + Interview',
        testSubjects: 'English Vocabulary & Comprehension, Quantitative Math, Logic',
        accreditation: 'NBEAC & AACSB Member',
        keyFeatures: ['Oldest Business School outside North America', 'Unrivaled Corporate C-Suite Alumni', 'Wharton Heritage']
      }
    ]
  },

  // 15. Dow University of Health Sciences (DUHS Karachi) - MEDICAL
  {
    id: 'duhs-khi',
    name: 'Dow University of Health Sciences',
    shortName: 'DUHS Karachi',
    city: 'Karachi',
    province: 'Sindh',
    sector: 'Public',
    hecRanking: 'Top Ranked Public Medical University in Sindh',
    establishedYear: 1945,
    officialWebsite: 'https://duhs.edu.pk',
    admissionsUrl: 'https://admissions.duhs.edu.pk',
    feeStructureUrl: 'https://duhs.edu.pk/fee-structure',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: false,
    scholarships: [
      'Sindh Educational Endowment Fund (SEEF)',
      'HEC Need-Based Medical Scholarships',
      'Dow Alumni Association of North America (DOGANA) Financial Aid'
    ],
    badgeColor: 'rose',
    summary: 'The premier public healthcare and medical education institution in Sindh, encompassing Dow Medical College (DMC) and Dr. Ruth K.M. Pfau Civil Hospital Karachi.',
    documentsRequired: [
      'Matriculation / SSC Certificate & Detailed Marks Certificate',
      'FSc (Pre-Medical) Detailed Marks Sheet with minimum 60% marks',
      'National MDCAT Result Card (Valid PMDC score with minimum 55% for MBBS / 50% for BDS)',
      'Domicile Certificate (Form-C) & PRC (Form-D) of Karachi / Sindh',
      'Candidate CNIC / NADRA B-Form copy',
      'Father / Guardian CNIC photocopy',
      '6 passport size photographs with blue background',
      'Original Paid Bank Challan for DUHS MBBS/BDS Admission Form',
      'Affidavit on Rs. 100 Stamp Paper as per PMDC regulations'
    ],
    programs: [
      {
        id: 'duhs-mbbs',
        name: 'MBBS (Bachelor of Medicine & Surgery)',
        degreeType: 'MBBS',
        field: 'Medical & Health',
        durationYears: 5,
        perSemesterFeePKR: 35000, // Below 50k (subsidized open merit)
        totalEstimatedCostPKR: 350000,
        closingMeritLastYear: 90.85,
        entryTestRequired: 'PMDC National MDCAT',
        formulaId: 'pmdc',
        formulaDescription: '50% MDCAT + 40% FSc Pre-Medical + 10% Matric',
        testSubjects: 'Biology (68 MCQs), Chemistry (54 MCQs), Physics (54 MCQs), English (18 MCQs), Logical Reasoning (6 MCQs)',
        accreditation: 'PMDC & World Federation for Medical Education (WFME)',
        keyFeatures: ['Civil Hospital Karachi Clinical Training', 'Global USMLE/PLAB Recognition', 'Nominal Open-Merit Fees']
      }
    ]
  },

  // 16. King Edward Medical University (KEMU Lahore) - MEDICAL
  {
    id: 'kemu-lhr',
    name: 'King Edward Medical University',
    shortName: 'KEMU Lahore',
    city: 'Lahore',
    province: 'Punjab',
    sector: 'Public',
    hecRanking: '#1 Ranked Medical Institution in Pakistan (Highest Cutoff in MDCAT)',
    establishedYear: 1860,
    officialWebsite: 'https://kemu.edu.pk',
    admissionsUrl: 'https://uhs.edu.pk',
    feeStructureUrl: 'https://kemu.edu.pk/fees',
    hostelsAvailable: true,
    transportAvailable: true,
    isPrivatePartner: false,
    scholarships: [
      'Punjab Government Free Medical Education / Need-Based Stipends',
      'KEMCAANA (North America Alumni) Student Endowment',
      'PEEF Medical Merit Scholarships'
    ],
    badgeColor: 'rose',
    summary: 'The oldest medical university in Pakistan and the crown jewel of Punjab healthcare education, attached to historic Mayo Hospital Lahore. Commands the highest closing merit in Pakistan.',
    documentsRequired: [
      'Matriculation / SSC Result Card & Certificate (Original + attested copies)',
      'FSc Pre-Medical Detailed Marks Certificate (minimum 60%)',
      'UHS / PMDC National MDCAT Result Card',
      'Domicile Certificate of Punjab Province',
      'Candidate CNIC / NADRA B-Form copy',
      'Father / Guardian CNIC copy',
      '6 passport-size photographs with light blue background',
      'Medical Fitness Certificate',
      'Hafiz-e-Quran Sanad (if claiming 20 bonus marks verified by UHS)'
    ],
    programs: [
      {
        id: 'kemu-mbbs',
        name: 'MBBS (Medicine & Surgery)',
        degreeType: 'MBBS',
        field: 'Medical & Health',
        durationYears: 5,
        perSemesterFeePKR: 32000, // Below 50k
        totalEstimatedCostPKR: 320000,
        closingMeritLastYear: 93.65,
        entryTestRequired: 'PMDC National MDCAT',
        formulaId: 'pmdc',
        formulaDescription: '50% MDCAT + 40% FSc Pre-Medical + 10% Matric',
        testSubjects: 'Biology (68 MCQs), Chemistry (54 MCQs), Physics (54 MCQs), English (18 MCQs), Logical Reasoning (6 MCQs)',
        accreditation: 'PMDC Recognized & WHO Directory',
        keyFeatures: ['Mayo Hospital Lahore (3,000+ Beds)', 'Highest MDCAT Cutoff Nationwide', 'Elite Doctor Placement Globally']
      }
    ]
  },
  // 14. Bahria University (Islamabad, Karachi, Lahore) - SEMI-GOVERNMENT / NAVAL CONSTITUENT
  {
    id: 'bahria-isb',
    name: 'Bahria University (Islamabad / Karachi / Lahore)',
    shortName: 'Bahria University',
    city: 'Islamabad / Karachi / Lahore',
    province: 'Islamabad Capital',
    sector: 'Semi-Government',
    hecRanking: 'Top 15 General Category (W4 Category)',
    establishedYear: 2000,
    officialWebsite: 'https://bahria.edu.pk',
    admissionsUrl: 'https://cms.bahria.edu.pk/admissions',
    feeStructureUrl: 'https://bahria.edu.pk/fee-structure',
    hostelsAvailable: true,
    transportAvailable: true,
    admissionHelpline: '+92-51-9260002 / admissions@bahria.edu.pk',
    badgeColor: 'bg-teal-700 text-white',
    summary:
      'Federally chartered university established by the Pakistan Navy with campuses in Islamabad (E-8 & H-11), Karachi (National Stadium Road), and Lahore. Renowned for its Computer Science, AI, and Software Engineering faculties.',
    isPrivatePartner: true,
    scholarships: [
      'Pakistan Navy Welfare & Shaheed Concessions',
      'Bahria Advance Merit Scholarship (80%+ Aggregate)',
      'HEC Need-Based Financial Assistance',
      'Kinship Fee Concession (Siblings Discount)'
    ],
    documentsRequired: [
      'Original Paid Bahria University Admission Processing Bank Challan',
      'Matric / SSC Detailed Marks Sheet & Certificate (Attested Copy)',
      'HSSC / FSc Part-1 Result Card or A-Level Equivalence from IBCC',
      'Candidate CNIC / NADRA B-Form (Attested Copy)',
      'Father / Guardian CNIC (Attested Copy)',
      '4 Passport-Size Photographs with White / Blue Background',
      'Bahria CBT Computer-Based Entry Test Admit Card / Slip'
    ],
    programs: [
      {
        id: 'bahria-cs',
        name: 'BS Computer Science',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 138000,
        totalEstimatedCostPKR: 1104000,
        closingMeritLastYear: 74.20,
        entryTestRequired: 'Bahria CBT Entry Test / NTS-NAT',
        formulaId: 'bahria',
        formulaDescription: '50% Bahria CBT Entry Test + 40% Intermediate (HSSC/FSc) + 10% Matric',
        testSubjects: 'Mathematics (30 MCQs), Physics/CS (30 MCQs), English (30 MCQs), General Knowledge (10 MCQs)',
        accreditation: 'NCEAC W-Category & HEC Recognized',
        keyFeatures: ['State-of-the-Art Computing Labs', 'Pakistan Navy IT Directorate Projects', 'High Industry Placement in Tech Houses']
      },
      {
        id: 'bahria-se',
        name: 'BS Software Engineering',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 138000,
        totalEstimatedCostPKR: 1104000,
        closingMeritLastYear: 72.80,
        entryTestRequired: 'Bahria CBT Entry Test / NTS-NAT',
        formulaId: 'bahria',
        formulaDescription: '50% Bahria CBT Entry Test + 40% Intermediate (HSSC/FSc) + 10% Matric',
        testSubjects: 'Mathematics (30), Physics/CS (30), English (30), General Knowledge (10)',
        accreditation: 'PEC Accredited & NCEAC',
        keyFeatures: ['DevOps Sandbox', 'Software Architecture Labs', 'Annual FinTech Hackathons']
      },
      {
        id: 'bahria-ai',
        name: 'BS Artificial Intelligence',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 142000,
        totalEstimatedCostPKR: 1136000,
        closingMeritLastYear: 73.50,
        entryTestRequired: 'Bahria CBT Entry Test / NTS-NAT',
        formulaId: 'bahria',
        formulaDescription: '50% Bahria CBT Entry Test + 40% Intermediate (HSSC/FSc) + 10% Matric',
        testSubjects: 'Mathematics (30), Physics/CS (30), English (30), Analytical Reasoning (10)',
        accreditation: 'HEC & NCEAC Approved',
        keyFeatures: ['GPU Deep Learning Lab', 'Naval Autonomous Drone Systems', 'Predictive Analytics']
      },
      {
        id: 'bahria-it',
        name: 'BS Information Technology',
        degreeType: 'BS',
        field: 'Computing & IT',
        durationYears: 4,
        perSemesterFeePKR: 125000,
        totalEstimatedCostPKR: 1000000,
        closingMeritLastYear: 69.80,
        entryTestRequired: 'Bahria CBT Entry Test / NTS-NAT',
        formulaId: 'bahria',
        formulaDescription: '50% Bahria CBT Entry Test + 40% Intermediate (HSSC/FSc) + 10% Matric',
        testSubjects: 'Mathematics (30), Physics/CS (30), English (30), General Knowledge (10)',
        accreditation: 'HEC & NCEAC Approved',
        keyFeatures: ['Cloud Computing & Virtualization', 'Cyber Defense Infrastructure']
      },
      {
        id: 'bahria-bba',
        name: 'Bachelor of Business Administration (BBA)',
        degreeType: 'BBA',
        field: 'Business & Management',
        durationYears: 4,
        perSemesterFeePKR: 128000,
        totalEstimatedCostPKR: 1024000,
        closingMeritLastYear: 67.50,
        entryTestRequired: 'Bahria CBT / NTS-NAT',
        formulaId: 'bahria',
        formulaDescription: '50% Bahria CBT Entry Test + 40% Intermediate (HSSC) + 10% Matric',
        testSubjects: 'English (40 MCQs), Mathematics / Quantitative (30 MCQs), General Knowledge (30 MCQs)',
        accreditation: 'NBEAC (HEC) W-Category',
        keyFeatures: ['Maritime Logistics & Corporate Trade', 'Direct Karachi Port Trust & Banking Internships']
      },
      {
        id: 'bahria-ee',
        name: 'BE Electrical Engineering',
        degreeType: 'BE',
        field: 'Engineering',
        durationYears: 4,
        perSemesterFeePKR: 142000,
        totalEstimatedCostPKR: 1136000,
        closingMeritLastYear: 66.80,
        entryTestRequired: 'Bahria CBT Entry Test',
        formulaId: 'bahria',
        formulaDescription: '50% Bahria CBT Entry Test + 40% Intermediate (HSSC) + 10% Matric',
        testSubjects: 'Mathematics (40), Physics (40), English (20)',
        accreditation: 'PEC Level-II (Washington Accord)',
        keyFeatures: ['Power Electronics & Communications Lab', 'Naval Radar Systems Research']
      }
    ]
  }
];
