# EcoLoop AI — Demo Runbook & Judge Checklist
## AI Builder Cup Sustainability Hackathon

This checklist guides evaluators and judges through testing the complete EcoLoop AI application locally or in a deployed container.

---

## 1. System Requirements & Environment
- **Node.js**: v18.0.0 or higher (Tested on Node.js v22.23.2).
- **Package Manager**: `npm` (v10+).
- **Browser**: Modern Chromium, Firefox, or Safari with JavaScript enabled.
- **Port**: `http://localhost:3000` (or `PORT` defined in `.env.local`).

---

## 2. Quickstart Execution
```bash
# 1. Install dependencies
npm install

# 2. Run automated verification test suite
npm test

# 3. Build production bundle
npm run build

# 4. Start production server
npm run start
```
Open **`http://localhost:3000`** in your browser.

---

## 3. Evaluator Walkthrough (5-Minute Test Run)

### Step 1: Multimodal AI Waste Classification
1. Navigate to the **"AI Scanner"** tab.
2. Under *"Try Curated Kerala Demonstration Items"*, click on **"Milma Milk Pouch (Empty)"** (or upload your own photo).
3. Click **"Classify with Google Gemini AI"**.
4. Observe:
   - Live multi-stage analysis ticker.
   - Classification result: Category is accurately classified as **Multilayer Packaging / Flexible Plastic (MLP)**.
   - Contamination alert: Warns of sour milk residue.
   - Suchitwa Mission Kerala guidance and Clean Kerala Company road-tarring rules.

### Step 2: Bilingual Rendering Test
1. Click the language button **"മലയാളം"** at the top right.
2. Confirm that all categories, descriptions, preparation protocols, and municipal rules seamlessly switch to Malayalam script.
3. Toggle back to **"English"**.

### Step 3: Create a Handover Request
1. On the Guidance Card, click **"Schedule Handover Request"**.
2. Notice the form is pre-filled with the scanned category and target partner (Haritha Karma Sena).
3. Click **"Submit Request"**.
4. The app transitions to the **"Handover Requests"** tab where your new item appears with status **"Pending Pickup"**.

### Step 4: Collector Scale Verification (The Differentiator)
1. Click on the **"Collector Portal"** tab.
2. Note that Demo Mode is enabled with PIN `1234`.
3. In the left queue, select your pending request.
4. On the right, enter the physical scale readings:
   - Scale reading: `3.5` kg
   - Contamination deduction: `0.3` kg (wet silt or dirty caps)
   - Calculated Net Diverted Weight: `3.20` kg
5. Click **"Verify & Issue Receipt"**.
6. Enjoy the confetti animation and confirm the tamper-evident digital receipt (`RCP-XXXXXX`) is generated.

### Step 5: Verify the Auditable Impact Ledger
1. Click on the **"Impact Dashboard"** tab.
2. Confirm that:
   - **Landfill Diverted** and **Avoided GHG (kg CO₂e)** have incremented in real time.
   - The verified handover event appears in the **Auditable Verified Handover Ledger** at the bottom with its receipt number and net weight.

---

## 4. Fallback & Resilience Strategy
- **If `GEMINI_API_KEY` is not provided**: The application automatically runs in **High-Fidelity Simulated Demo Mode**, returning calibrated resin taxonomies and Suchitwa Mission rules for test images and curated sample items. No evaluation is ever blocked by missing API keys.
- **When `GEMINI_API_KEY` is provided in `.env.local`**: The application seamlessly connects to the live `gemini-2.5-flash` endpoint via `@google/genai`.
- **Database Fallback**: Runs in self-contained state storage pre-seeded with realistic Ernakulam/Trivandrum municipal records. Can be configured to persist to Google Cloud Firestore by adding `GOOGLE_CLOUD_PROJECT`.

---

## 5. Security & Authorization
- **Collector Portal PIN**: Default is `1234` (configurable via `COLLECTOR_ADMIN_PIN` in `.env.local`).
- **Environment Isolation**: Never commit `.env.local` to version control.
