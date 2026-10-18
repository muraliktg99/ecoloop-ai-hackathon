# EcoLoop AI — From Waste to Verified Value
> **AI-Powered Circular Economy & Verified Waste Recovery Platform**  
> *Developed for the AI Builder Cup Sustainability Hackathon*

[![Build & Test](https://img.shields.io/badge/build-passing-brightgreen.svg)](file:///home/krishnan/PROJECTS/antigravity%20projects/hackathon/package.json)
[![Tests](https://img.shields.io/badge/tests-10%20passed-emerald.svg)](file:///home/krishnan/PROJECTS/antigravity%20projects/hackathon/src/__tests__)
[![Framework](https://img.shields.io/badge/framework-Next.js%2014+-black.svg)](https://nextjs.org/)
[![Google AI](https://img.shields.io/badge/Google%20AI-Gemini%202.5%20Flash-4285F4.svg)](https://deepmind.google/technologies/gemini/)
[![Google Cloud](https://img.shields.io/badge/Deployment-Google%20Cloud%20Run-blue.svg)](https://cloud.google.com/run)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 1. Product Overview

Every year, millions of tonnes of recyclable materials end up in open landfills because households cannot decipher multi-layer packaging from rigid plastics, and cross-contamination ruins entire collection batches. Furthermore, most sustainability apps suffer from greenwashing—crediting users for simply snapping a photo or clicking a button.

**EcoLoop AI** changes this paradigm by introducing the **Verified Recovery Protocol**:
1. **Multimodal AI Classification**: Google Gemini 2.5 Flash analyzes waste photographs, identifies material resins (e.g. rigid PET vs multi-layer polymer film), and detects grease/food contamination.
2. **Honest Uncertainty Calibration**: If an image cannot definitively prove polymer layers, the AI explicitly states its uncertainty and mandates human physical inspection.
3. **Deterministic Kerala Guidance**: Rule engine grounded in Kerala Local Self Government Department (LSGD), **Suchitwa Mission**, and **Clean Kerala Company** protocols in both **English and Malayalam (മലയാളം)**.
4. **Physical Collector Verification**: Zero environmental credit is awarded on scans alone. Handover requires an authorized **Haritha Karma Sena** collector to weigh materials on a certified scale, deduct wet contamination, and issue a digital receipt.
5. **Auditable Impact Ledger**: Greenhouse gas (GHG) reductions and diverted landfill tonnages are calculated exclusively from verified handover receipts using Central Pollution Control Board (CPCB) India benchmarks.

---

## 2. System Architecture & Technology Stack

```
[ Household / Camera ]
         │
         ▼
[ AI Waste Scanner (Next.js 14 / React 19) ]
         │ (Base64 Image + Note)
         ▼
[ /api/classify ] ──► [ Google Gemini 2.5 Flash (@google/genai) ]
         │
         ▼
[ Kerala Municipal Rules Engine (Suchitwa Mission) ]
         │
         ▼
[ Handover Request Queue (Pending / Scheduled) ]
         │
         ▼
[ Haritha Karma Sena Collector Portal ] ──► (Physical Scale Weighing - Contamination)
         │
         ▼
[ Auditable Impact Ledger ] ──► (CPCB & EPA WARM Factors: Avoided CO2e, Water, Energy)
```

- **Frontend & Fullstack API**: Next.js 14 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React.
- **AI Vision Engine**: Google Gemini 2.5 Flash (`@google/genai` SDK) with calibrated fallback simulator.
- **Hosting & Infrastructure**: Google Cloud Run (Multi-stage `Dockerfile` provided).
- **Data Layer**: Dual-mode storage (Cloud Firestore compatible + in-memory auditable repository).
- **Testing**: Vitest 5 with automated unit and integration tests.

---

## 3. Quickstart & Local Setup

### Prerequisites
- Node.js v18.0.0 or higher (Tested on Node.js v22.23.2)
- npm v10+

### Installation & Execution
```bash
# 1. Clone repository and navigate to project folder
cd /home/krishnan/PROJECTS/antigravity\ projects/hackathon

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local

# 4. Run automated test suite
npm test

# 5. Build production bundle
npm run build

# 6. Start production server
npm run start
```
Visit **`http://localhost:3000`** in your browser.

---

## 4. Environment Variables Configuration

Copy `.env.example` to `.env.local`:

| Variable | Description | Default / Example |
|---|---|---|
| `GEMINI_API_KEY` | Google AI Studio or Vertex AI API Key | `your_key_here` (Optional for demo mode) |
| `GEMINI_MODEL` | Gemini vision model identifier | `gemini-2.5-flash` |
| `ENABLE_DEMO_MODE` | Enables local simulation when API key is unset | `true` |
| `COLLECTOR_ADMIN_PIN` | Authorization PIN for collector weighbridge portal | `1234` |
| `GOOGLE_CLOUD_PROJECT` | Google Cloud project ID for Cloud Run / Firestore | `ecoloop-ai-hackathon` |
| `PORT` | Web server listening port | `3000` |

> [!NOTE]
> **Zero-Friction Evaluator Mode**: If `GEMINI_API_KEY` is not provided in `.env.local`, the application automatically operates in **High-Fidelity Demo Simulation Mode**, returning calibrated Kerala waste classifications for test items with zero crashes. Adding your API key immediately switches the app to live Gemini 2.5 inference.

---

## 5. Automated Tests

EcoLoop AI includes automated unit and integration tests covering business logic, emission factor math, and status transitions:

```bash
npm test
```

### Test Coverage Highlights
- `src/__tests__/keralaWasteRules.test.ts`: Verifies Suchitwa Mission protocols, contamination alert triggers, and Haritha Karma Sena recovery partner routing.
- `src/__tests__/impactCalculator.test.ts`: Guarantees that pending, unverified, or rejected items yield 0.00 kg diverted mass and 0.00 kg avoided CO₂e.
- `src/__tests__/storage.test.ts`: Verifies request creation, status transitions, scale reading deductions, and evidence receipt generation.

---

## 6. Google Cloud Run Deployment

EcoLoop AI is packaged with a multi-stage production Dockerfile optimized for Google Cloud Run:

```bash
# 1. Build container image using Google Cloud Build
gcloud builds submit --tag gcr.io/[PROJECT_ID]/ecoloop-ai

# 2. Deploy to Google Cloud Run
gcloud run deploy ecoloop-ai \
  --image gcr.io/[PROJECT_ID]/ecoloop-ai \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_MODEL=gemini-2.5-flash,COLLECTOR_ADMIN_PIN=1234
```

---

## 7. Submission Artifacts & Deliverables

All required competition deliverables are included in the repository:
- **Architecture & Data Flow**: [`docs/architecture.md`](file:///home/krishnan/PROJECTS/antigravity%20projects/hackathon/docs/architecture.md)
- **Detailed Proposal Document**: [`docs/hackathon-proposal.md`](file:///home/krishnan/PROJECTS/antigravity%20projects/hackathon/docs/hackathon-proposal.md)
- **Submission-Ready Proposal PDF**: [`docs/EcoLoop_AI_Hackathon_Proposal.pdf`](file:///home/krishnan/PROJECTS/antigravity%20projects/hackathon/docs/EcoLoop_AI_Hackathon_Proposal.pdf) *(Generated via Headless Chrome, 114KB)*
- **3-Minute Video Demo Script**: [`docs/demo-script.md`](file:///home/krishnan/PROJECTS/antigravity%20projects/hackathon/docs/demo-script.md)
- **Judge Walkthrough & Demo Checklist**: [`docs/demo-checklist.md`](file:///home/krishnan/PROJECTS/antigravity%20projects/hackathon/docs/demo-checklist.md)
- **Implementation & Risk Plan**: [`IMPLEMENTATION_PLAN.md`](file:///home/krishnan/PROJECTS/antigravity%20projects/hackathon/IMPLEMENTATION_PLAN.md)

---

## 8. Known Limitations & Next Steps

1. **Physical Scale Hardware**: For the hackathon prototype, collector weighbridge scale readings are entered via the authenticated Collector Portal (`PIN: 1234`). Future iterations will connect directly to Bluetooth-enabled digital hanging scales used by Kudumbashree HKS members.
2. **Camera Hardware Constraints**: When scanning low-resolution or blurry packaging images, the AI intentionally triggers `requiresHumanReview: true` to prevent fraudulent recycling claims.
3. **Cloud Run Live URL**: The application is tested, built, containerized, and running locally on port 3000. Public Cloud Run deployment requires a linked Google Cloud billing account and authenticated `gcloud` CLI credentials.

---

## 9. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
