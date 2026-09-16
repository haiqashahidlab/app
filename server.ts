import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// AI Admission Counselor Endpoint
app.post('/api/counselor', async (req, res) => {
  try {
    const { prompt, studentProfile } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGeminiClient();

    // Contextual system prompt specialized in Pakistani university admissions
    const systemInstruction = `You are "PakUni Counselor", an expert academic advisor specialized in Pakistani University Admissions (Undergraduate).
You provide accurate, realistic, encouraging, and detailed guidance to Pakistani matric, FSc (Pre-Engineering, Pre-Medical, ICS, I.Com), and O/A Level students.

Key Knowledge Base:
- Top Pakistani Universities: NUST (Islamabad), FAST-NUCES (ISB, LHR, KHI, PWR, CFD), LUMS (Lahore), GIKI (Topi/Swabi), COMSATS (Islamabad, Lahore), UET Lahore, ITU (Lahore), IBA Karachi, NED UET (Karachi), Dow University (DUHS), King Edward Medical University (KEMU), Aga Khan University (AKU), PIEAS (Islamabad), Air University, Bahria University, NUTECH, Quaid-i-Azam University (QAU), PU (Punjab University).
- Entry Tests: NUST NET (Series 1, 2, 3, 4 - 75% NET weightage), FAST NU Test (50% test + 50% FSc or NAT/SAT), UET ECAT (33% ECAT + 67% FSc), National MDCAT (PMDC 50% test + 40% FSc + 10% Matric), GIKI Test (85% test + 15% FSc), NTS-NAT (COMSATS), HEC USAT, LUMS LCAT / SAT.
- Typical Closing Merits (Estimates):
  - NUST BS CS/SE: ~79% - 82% aggregate (Islamabad campus)
  - FAST BS CS/SE (Lahore/Islamabad): ~73% - 78% aggregate
  - FAST Karachi/Peshawar: ~67% - 72% aggregate
  - UET Lahore BS CS/EE: ~78% - 81% aggregate
  - COMSATS Islamabad BS CS: ~86% - 88% (based on NTS formula)
  - Public Sector Medical (Punjab/Sindh): ~90.5% - 93.5% aggregate
- Scholarships in Pakistan: HEC Need-Based Scholarships, Ehsaas Undergraduate Scholarship Project, PEEF (Punjab Educational Endowment Fund), Sindh Educational Endowment Fund, University internal merit-based waivers (e.g. NUST Financial Aid, LUMS NOP - National Outreach Programme, FAST Financial Aid, GIKI Financial Assistance).
- Answer clearly using bullet points, honest evaluation of admission probability, fee estimates (PKR), and actionable preparation advice.
- When relevant, you may mention Roman Urdu terms commonly used by Pakistani students (e.g., "Aggregate", "Merit List", "Challan form", "Admit Card", "IBCC Equivalence") but keep the core advice highly structured and professional in English or bilingual if asked.
- Avoid recommending illegal shortcuts or past paper leak sites. Encourage standard syllabus prep (Punjab Textbook Board, Sindh Textbook Board, Federal Board books, KIPS, STEP, Dogar Brothers books).`;

    let profileContext = '';
    if (studentProfile) {
      profileContext = `\n\nStudent Profile Provided:
- Matric/O-Level: ${studentProfile.matricMarks ? studentProfile.matricMarks + '%' : 'Not specified'}
- FSc/A-Level/ICS: ${studentProfile.fscMarks ? studentProfile.fscMarks + '%' : 'Not specified'}
- Entry Test: ${studentProfile.entryTestScore ? studentProfile.entryTestScore : 'Not taken yet'} (${studentProfile.entryTestName || 'General'})
- Calculated Aggregate: ${studentProfile.calculatedAggregate ? studentProfile.calculatedAggregate + '%' : 'Pending'}
- Desired Program: ${studentProfile.targetProgram || 'Open'}
- Desired City: ${studentProfile.preferredCity || 'Any in Pakistan'}`;
    }

    if (!ai) {
      // High-quality deterministic fallback response if no API key is set
      const fallbackResponse = `**PakUni AI Advisory (Offline Mode):**\n\nBased on your query: "${prompt}"${profileContext ? '\n' + profileContext : ''}\n\n` +
        `**Key Recommendations for Pakistani University Admissions:**\n` +
        `1. **Aggregate Benchmark:** For competitive programs like BS Computer Science and Software Engineering in top-tier universities (NUST, FAST, COMSATS Islamabad), strive for an aggregate of 76%+ to be in the safe zone.\n` +
        `2. **Entry Test Weight:** Most universities give 50% to 75% weightage to their own entrance exams (NUST NET gives 75%, FAST NU gives 50%, GIKI gives 85%). Preparing specifically for the university's test format is far more impactful than waiting on FSc improvement.\n` +
        `3. **Alternative Safe Options:** If your aggregate falls between 65% and 72%, excellent alternatives in major cities include Air University, Bahria University, COMSATS (Wah/Lahore/Abbottabad), ITU, and leading provincial universities.\n` +
        `4. **Financial Aid:** Both NUST and FAST offer robust internal interest-free loans and HEC need-based scholarships. Always apply for financial aid in the first semester as deadlines coincide with admission forms.\n\n` +
        `*Tip: Use the PakUni Aggregate Calculator and Program Comparator in the tabs above to see your exact chances!*`;

      return res.json({
        response: fallbackResponse,
        offlineMode: true
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\n${profileContext}\n\nStudent Question: ${prompt}` }] }
      ]
    });

    const text = response.text || 'No response generated. Please try again.';
    res.json({ response: text, offlineMode: false });

  } catch (error: any) {
    console.error('Error in /api/counselor:', error);
    res.status(500).json({
      error: 'Failed to generate advisory response',
      details: error.message || 'Internal server error'
    });
  }
});

// Vite Middleware / Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PakUni Admissions Hub server running on http://localhost:${PORT}`);
  });
}

startServer();
