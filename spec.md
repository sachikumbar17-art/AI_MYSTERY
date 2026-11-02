# AI MYSTERY ROOM
## Product Requirements & Technical Specification (SSOT)

**Document:** `spec.md`  
**Project:** AI Mystery Room  
**Version:** 1.0.0  
**Status:** Initial development specification  
**Architecture:** MERN Stack  
**AI Provider:** Google Gemini  
**Development Approach:** Spec-Driven Development (Codex)

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

AI Mystery Room is an AI-powered interactive detective investigation platform where users become investigators and solve fictional mystery cases generated using Artificial Intelligence.

The user provides a short scenario, story, or mystery idea. Based on this input, the AI generates a complete fictional investigation containing:

- A mystery case with a defined background.
- Multiple suspects with individual profiles and motives.
- One actual culprit.
- A timeline of events.
- Evidence and clues.
- Misleading information and red herrings.
- A final explanation of what actually happened.

The system then presents the investigation to the user through an interactive detective interface.

The user investigates the available evidence, analyzes the information, identifies contradictions, and ultimately selects the person they believe is responsible.

After submitting their answer, the system reveals the actual culprit and explains the complete investigation.

## 1.2 Core Concept

**User Story → AI Investigation → Evidence Collection → Detective Analysis → Culprit Selection → Case Resolution**

The primary objective is to create an engaging mystery-solving experience rather than a simple question-and-answer chatbot.

## 1.3 Product Goals

1. Generate unique mystery investigations from user-provided scenarios.
2. Create believable fictional suspects, motives, and timelines.
3. Generate different types of evidence using AI.
4. Allow users to investigate evidence independently.
5. Provide an interactive suspect-selection experience.
6. Reveal the correct culprit with a logical explanation.
7. Make each investigation self-contained and internally consistent.
8. Provide a polished, immersive detective-room user interface.

## 1.4 Target Users

- Mystery and detective story enthusiasts.
- Users interested in crime-solving games.
- Casual gamers.
- Students interested in logical reasoning.
- Users looking for AI-powered interactive entertainment.

---

# 2. TECHNOLOGY STACK

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Styling | Tailwind CSS |
| Backend | Node.js |
| Backend Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| AI | Google Gemini API |
| Authentication | Guest-based MVP |
| API Communication | REST API |
| State Management | React Context / appropriate local state |
| Routing | React Router |
| Environment Configuration | dotenv |
| HTTP Client | Axios or Fetch |
| Icons | Lucide React |

### 2.1 Architecture

The application must follow a modular MERN architecture.

**Frontend**
- React application.
- Pages and reusable components.
- API service layer.
- Investigation state management.
- Evidence viewer.
- Suspect selection interface.

**Backend**
- Express REST API.
- Authentication/session handling where required.
- Mystery generation service.
- Gemini integration.
- Evidence generation service.
- Investigation validation.
- Scoring and case resolution.

**Database**
- MongoDB collections for cases, suspects, evidence, investigations, and user progress.

**AI**
- Gemini API for generating structured mystery content.
- Separate evidence-generation adapters for visual assets where supported.

### 2.2 High-Level Architecture Flow

```text
                USER
                  |
                  v
           REACT FRONTEND
                  |
             REST API
                  |
                  v
          NODE + EXPRESS
                  |
          APPLICATION SERVICES
                  |
       +----------+-----------+
       |          |           |
       v          v           v
   GEMINI AI   MONGODB    ASSET SERVICE
       |          |           |
       v          v           v
  CASE DATA   CASE DATA   AI GENERATED
  GENERATION  STORAGE     EVIDENCE
       |          |           |
       +----------+-----------+
                  |
                  v
          INVESTIGATION UI
                  |
                  v
          USER SELECTS CULPRIT
                  |
                  v
           CASE REVEAL
```

---

# 3. USER EXPERIENCE AND APPLICATION FLOW

## 3.1 Overall User Journey

The application must follow this sequence:

1. User opens the website.
2. User reaches the landing page.
3. User clicks **Start Investigation**.
4. User enters a scenario or story.
5. User optionally selects difficulty.
6. User clicks **Generate Mystery**.
7. Backend sends the scenario to Gemini.
8. Gemini generates the complete mystery structure.
9. Backend validates the generated response.
10. Evidence assets are generated or rendered.
11. The complete case is saved in MongoDB.
12. User is redirected to the investigation room.
13. User explores the case and its evidence.
14. User selects a suspect as the culprit.
15. User submits their final accusation.
16. System reveals whether the accusation is correct.
17. System displays the actual culprit and case explanation.

## 3.2 Page Structure

The application must contain the following pages.

### Page 1: Landing Page

Purpose: Introduce the AI Mystery Room experience.

Required elements:

- Application logo and name.
- Navigation bar.
- Hero section.
- Short project description.
- Start Investigation button.
- How It Works section.
- Features section.
- Footer.

Hero heading:

"Every Mystery Has a Truth. Can You Find It?"

Hero description:

"Create your own mystery, investigate AI-generated evidence, uncover hidden clues, and identify the culprit."

Primary CTA: `Start Investigation`

Secondary CTA: `How It Works`

### Page 2: Mystery Creation Page

Purpose: Collect the user's mystery scenario.

Required elements:

- Page heading: Create Your Mystery.
- Scenario input textarea.
- Scenario instructions and example.
- Difficulty selection.
- Generate Mystery button.
- Loading state.

Scenario input requirements:

- Minimum: 30 characters.
- Maximum: 2000 characters.
- Empty scenarios must not be accepted.
- Trim unnecessary whitespace.
- Validate all inputs on both frontend and backend.

Example scenario:

"A businessman is found dead inside his locked office. Three employees were present in the building that night. Everyone claims to have left before 10 PM, but the security camera shows something unusual."

Difficulty options:

- Easy: 3 suspects, simpler clues, fewer red herrings.
- Medium: 4 suspects, interconnected clues, moderate deception.
- Hard: 5 suspects, complex timeline, multiple misleading clues.

Default difficulty: Medium.

### Page 3: Mystery Loading Page

Purpose: Show progress while the investigation is being created.

Display stages such as:

1. Creating investigation.
2. Developing suspect profiles.
3. Establishing the crime timeline.
4. Generating evidence.
5. Preparing the investigation room.

Requirements:

- Show a loading animation.
- Show the current generation stage.
- Prevent duplicate generation requests.
- Display meaningful errors if generation fails.
- Never display a completed investigation until all mandatory data is validated and saved.

### Page 4: Investigation Room

This is the main application page.

The investigation room must have a detective-themed dashboard layout.

**Main layout:**

- Left sidebar: Case information and navigation.
- Main content: Selected investigation section.
- Right-side panel: Optional case notes or evidence details.

Sidebar navigation:

1. Case Overview
2. Suspects
3. Evidence
4. Timeline
5. Accusation

#### Case Overview

Display:

- Case title.
- Case ID.
- Case description.
- Crime type.
- Crime location.
- Date and time of incident.
- Difficulty.
- Number of suspects.
- Number of evidence items.
- Investigation status.

#### Suspects Section

Display suspect cards containing:

- Suspect photograph/avatar.
- Full name.
- Age.
- Occupation.
- Relationship to the victim.
- Short background.
- Possible motive.

Clicking a suspect opens a detailed profile containing:

- Full biography.
- Known relationships.
- Alibi.
- Statements.
- Motive.
- Relevant clues.

Important: Do not reveal whether a suspect is actually guilty in their profile.

#### Evidence Section

Evidence must be organized into categories.

**A. WhatsApp / Chat Evidence**

Display fictional chat conversations in a WhatsApp-inspired interface.

Each conversation must include:

- Sender name.
- Receiver name.
- Message content.
- Timestamp.
- Conversation participants.
- Relevant conversation context.

Requirements:

- Use a custom chat interface.
- Do not connect to the real WhatsApp service.
- Clearly treat all conversations as fictional investigation evidence.

**B. Image Evidence**

Display AI-generated fictional images such as:

- Crime scene photographs.
- Objects found at the location.
- Suspicious documents.
- Personal belongings.
- Environmental details.

Clicking an image should open an enlarged evidence viewer.

**C. CCTV Evidence**

Display fictional security-camera evidence.

Each CCTV item should contain:

- Camera ID.
- Location.
- Timestamp.
- Description.
- Generated visual or video asset.
- Important observations.

Where supported, generate short synthetic video clips. If video generation is unavailable, use AI-generated still frames with a timestamped event sequence and a CCTV-style viewer.

Do not present a static image as an actual video recording.

**D. Document Evidence**

Examples:

- Emails.
- Letters.
- Reports.
- Receipts.
- Security logs.
- Medical or forensic reports.

Documents should be displayed in a readable document viewer.

**E. Other Evidence**

The system may generate additional relevant evidence types, such as:

- Audio transcripts.
- Call records.
- Access logs.
- Maps.
- Handwritten notes.

Additional types must not compromise the core investigation flow.

#### Timeline Section

Display a chronological sequence of important events.

Each event must include:

- Date.
- Time.
- Event description.
- Associated suspect, if applicable.
- Related evidence references.

The timeline should allow users to identify contradictions between statements and available evidence.

#### Case Notes

Provide a simple investigation notes feature.

Users should be able to:

- Add notes.
- Edit notes.
- Delete notes.
- Save notes to their investigation.

Notes must be separate from the actual AI-generated evidence.

### Page 5: Accusation Page

Purpose: Allow the user to select the culprit.

Display:

- Heading: Who Is The Culprit?
- List of all suspects.
- Suspect photographs.
- Suspect names.
- Optional accusation reasoning textarea.
- Submit Accusation button.

Rules:

- The user must select exactly one suspect.
- The selected suspect must belong to the current case.
- The user must explicitly confirm their accusation.
- Only one final accusation is allowed in the MVP.
- The server must determine whether the selected suspect matches the stored culprit ID.
- The actual culprit must never be exposed through frontend API responses before submission.

### Page 6: Case Resolution Page

After the user submits an accusation, display the final results.

**If the answer is correct:**

- Display a success animation.
- Show "Case Solved!"
- Display the actual culprit.
- Display the explanation.
- Display the clues that identified the culprit.

**If the answer is incorrect:**

- Display "Investigation Failed" or "Incorrect Accusation".
- Reveal the actual culprit.
- Explain why the selected suspect was incorrect.
- Explain the actual sequence of events.

Both outcomes must provide the complete solution.

Additional information:

- User's selected suspect.
- Actual culprit.
- Difficulty.
- Evidence count.
- Investigation completion status.

A Play Again / Create Another Mystery button must be provided.

---

# 4. AI MYSTERY GENERATION ENGINE

## 4.1 Primary Responsibility

Gemini is responsible for generating a complete fictional investigation from the user's scenario.

The AI must generate structured information rather than unstructured story text.

## 4.2 Input to Gemini

The backend sends:

- User scenario.
- Selected difficulty.
- Expected suspect count.
- Expected evidence categories.
- Generation instructions.
- Output JSON schema.

## 4.3 Mystery Generation Rules

Every mystery must contain:

1. A unique case title.
2. A case description.
3. A victim, if the scenario involves a crime against a person.
4. A crime or central mystery.
5. A crime location.
6. A complete list of suspects.
7. Exactly one actual culprit.
8. A motive for every suspect.
9. An alibi for every suspect.
10. A chronological event timeline.
11. A collection of evidence.
12. A logical explanation of the investigation.
13. A final solution.

### Difficulty Rules

| Parameter | Easy | Medium | Hard |
|---|---:|---:|---:|
| Suspects | 3 | 4 | 5 |
| Evidence items | 5–6 | 7–9 | 10–12 |
| Red herrings | 0–1 | 2–3 | 3–4 |
| Timeline complexity | Low | Medium | High |

The generated content must remain logically consistent at every difficulty level.

## 4.4 Culprit Selection Logic

The culprit must be selected during initial mystery generation.

The AI must establish the culprit before generating the supporting evidence.

Rules:

- Exactly one culprit must exist.
- The culprit must be one of the generated suspects.
- Evidence must support the actual culprit.
- At least two independent clues must help establish the culprit's guilt.
- Every suspect must have a believable reason to be investigated.
- Red herrings must be misleading but explainable.
- The final solution must explain all important contradictions.

The culprit ID must be stored securely on the backend.

**Critical:** The frontend must never receive the culprit ID, secret solution, or private reasoning before the user submits their accusation.

## 4.5 Evidence Generation Logic

Evidence must be generated based on the already established investigation.

The AI must not randomly generate unrelated evidence.

Every evidence item must have:

- Unique evidence ID.
- Evidence title.
- Evidence category.
- Evidence description.
- Timestamp.
- Related suspect IDs.
- Related timeline event IDs.
- Relevance level.
- Generated content or asset reference.
- Investigation significance.

Relevance levels:

- Critical: Directly helps establish the culprit.
- Supporting: Provides useful supporting information.
- Misleading: Creates a reasonable but explainable false lead.

A red herring must never contradict the final solution without an explanation.

## 4.6 AI Output Format

Gemini must return valid structured JSON.

The backend must validate the response against a defined schema before saving it.

Illustrative output structure:

```json
{
  "case": {
    "title": "The Midnight Office",
    "description": "A mysterious incident...",
    "difficulty": "medium",
    "location": "Corporate Office",
    "incidentDate": "2026-10-20T22:00:00Z"
  },
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Alex Morgan",
      "age": 32,
      "occupation": "Manager",
      "motive": "Financial dispute",
      "alibi": "Claims to have left at 9 PM",
      "background": "..."
    }
  ],
  "culpritId": "suspect_1",
  "timeline": [
    {
      "id": "event_1",
      "timestamp": "2026-10-20T20:00:00Z",
      "description": "The victim enters the office."
    }
  ],
  "evidence": [
    {
      "id": "evidence_1",
      "type": "chat",
      "title": "Suspicious Conversation",
      "description": "A conversation between two employees.",
      "content": {},
      "relatedSuspectIds": ["suspect_1"],
      "relevance": "critical"
    }
  ],
  "solution": {
    "culpritExplanation": "...",
    "motiveExplanation": "...",
    "eventSequence": "...",
    "evidenceReasoning": [
      {
        "evidenceId": "evidence_1",
        "explanation": "..."
      }
    ]
  }
}
```

This is an illustrative schema. The actual implementation must define and validate all fields, data types, enums, required properties, and relationships.

The secret fields (`culpritId` and `solution`) must be stored separately from publicly accessible case data.

## 4.7 AI Consistency Validation

The backend must validate:

- Suspect count matches difficulty.
- Exactly one culprit exists.
- Culprit ID references an existing suspect.
- Evidence IDs are unique.
- Timeline IDs are unique.
- Evidence references valid suspects and events.
- Required evidence categories are represented.
- Timestamps are valid.
- Critical evidence supports the final explanation.
- Every major contradiction is resolved in the solution.

If Gemini returns invalid JSON or inconsistent data:

1. Attempt structured JSON parsing.
2. Validate against the schema.
3. Request a correction from Gemini when appropriate.
4. Retry generation a limited number of times.
5. Return a clear error if generation still fails.

Never save an incomplete or invalid investigation.

---

# 5. AI EVIDENCE GENERATION

## 5.1 WhatsApp Evidence

The AI generates fictional conversation data.

The frontend renders it using a custom chat interface.

Example:

```json
{
  "participants": ["Alex", "Daniel"],
  "messages": [
    {
      "sender": "Alex",
      "timestamp": "2026-10-20T20:30:00Z",
      "message": "Did you delete the office records?"
    },
    {
      "sender": "Daniel",
      "timestamp": "2026-10-20T20:32:00Z",
      "message": "I told you I would handle it."
    }
  ]
}
```

Requirements:

- Realistic conversation structure.
- Chronologically ordered messages.
- Consistent participants.
- Relevant clues.
- No real WhatsApp API integration.

## 5.2 Image Evidence

Image evidence should be generated from descriptions established by Gemini.

Generation process:

1. Gemini creates the evidence description.
2. Backend passes the description to the configured image generation adapter.
3. The image provider generates the asset.
4. The backend stores the image reference.
5. MongoDB stores its metadata.

Use Gemini image-generation capabilities when the configured model and account support them. Otherwise, use a compatible image-generation provider through the same adapter interface.

All images must be fictional and generated for the current investigation.

## 5.3 CCTV Evidence

CCTV generation must support:

- Camera location.
- Recording timestamp.
- Event description.
- Visual observations.
- Synthetic video or timestamped still frames.

MVP fallback:

When video generation is unavailable, generate one or more still frames and render them in a CCTV-style player with a timestamped event log.

The system must never imply that an actual security-camera recording exists.

## 5.4 Document Evidence

The AI can generate fictional:

- Emails.
- Reports.
- Receipts.
- Letters.
- Logs.

These should be rendered as realistic document interfaces.

All assets must be marked internally as AI-generated fictional content.

---

# 6. DATABASE DESIGN

Use MongoDB with Mongoose.

The following collections define the initial database structure.

## 6.1 Cases Collection

Stores the main investigation data.

```js
{
  _id: ObjectId,
  caseTitle: String,
  scenario: String,
  description: String,
  difficulty: String,
  location: String,
  incidentDate: Date,
  status: String,
  suspectIds: [ObjectId],
  evidenceIds: [ObjectId],
  timelineIds: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

## 6.2 Suspects Collection

```js
{
  _id: ObjectId,
  caseId: ObjectId,
  name: String,
  age: Number,
  occupation: String,
  background: String,
  motive: String,
  alibi: String,
  relationshipToVictim: String,
  avatarUrl: String,
  createdAt: Date
}
```

## 6.3 Evidence Collection

```js
{
  _id: ObjectId,
  caseId: ObjectId,
  title: String,
  type: String,
  description: String,
  content: Mixed,
  assetUrl: String,
  timestamp: Date,
  relatedSuspectIds: [ObjectId],
  relatedTimelineIds: [ObjectId],
  relevance: String,
  createdAt: Date
}
```

## 6.4 Timeline Collection

```js
{
  _id: ObjectId,
  caseId: ObjectId,
  timestamp: Date,
  description: String,
  relatedSuspectIds: [ObjectId],
  relatedEvidenceIds: [ObjectId]
}
```

## 6.5 Investigation Collection

Stores user progress.

```js
{
  _id: ObjectId,
  sessionId: String,
  caseId: ObjectId,
  status: String,
  viewedEvidenceIds: [ObjectId],
  notes: [
    {
      content: String,
      createdAt: Date,
      updatedAt: Date
    }
  ],
  selectedSuspectId: ObjectId,
  accusationSubmitted: Boolean,
  isCorrect: Boolean,
  startedAt: Date,
  completedAt: Date
}
```

## 6.6 Case Secrets Collection

This collection must be inaccessible to public case retrieval endpoints.

```js
{
  _id: ObjectId,
  caseId: ObjectId,
  culpritSuspectId: ObjectId,
  solution: Mixed,
  createdAt: Date
}
```

### Database Rules

- Every evidence item must reference a valid case.
- Every suspect must belong to a valid case.
- Every timeline event must belong to a valid case.
- The case secret must be stored separately.
- Never return secrets from public endpoints.
- Use appropriate MongoDB indexes for case IDs, session IDs, and related queries.
- Use Mongoose validation for required fields and enums.

---

# 7. BACKEND API SPECIFICATION

Base URL:

`/api/v1`

All APIs must use JSON unless the endpoint explicitly handles file uploads.

## 7.1 Case APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/cases/generate` | Generate a mystery |
| GET | `/cases/:caseId` | Get public case information |
| GET | `/cases/:caseId/suspects` | Get all suspects |
| GET | `/cases/:caseId/timeline` | Get investigation timeline |
| GET | `/cases/:caseId/evidence` | Get case evidence |
| GET | `/cases/:caseId/evidence/:evidenceId` | Get individual evidence |

### Generate Mystery

Request:

```json
{
  "scenario": "A businessman is found dead...",
  "difficulty": "medium"
}
```

Response:

```json
{
  "success": true,
  "caseId": "case_id",
  "status": "ready"
}
```

The actual response must not contain the culprit ID or solution.

### Get Case

Returns:

- Case title.
- Description.
- Difficulty.
- Location.
- Incident date.
- Number of suspects.
- Number of evidence items.
- Case status.

Must exclude:

- Culprit ID.
- Secret solution.
- Private AI reasoning.

## 7.2 Investigation APIs

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/investigations` | Start investigation |
| GET | `/investigations/:id` | Retrieve investigation |
| PATCH | `/investigations/:id/notes` | Update notes |
| POST | `/investigations/:id/accuse` | Submit accusation |
| GET | `/investigations/:id/result` | Get completed result |

### Submit Accusation

Request:

```json
{
  "suspectId": "suspect_id",
  "reasoning": "The evidence suggests..."
}
```

Backend process:

1. Verify investigation exists.
2. Verify investigation is not already completed.
3. Verify suspect belongs to the investigation's case.
4. Retrieve the actual culprit from the protected Case Secrets collection.
5. Compare selected suspect ID with actual culprit ID.
6. Save the accusation.
7. Mark investigation completed.
8. Return the result and appropriate explanation.

Response:

```json
{
  "success": true,
  "result": {
    "correct": true,
    "message": "Case Solved!",
    "selectedSuspect": "Alex Morgan",
    "actualCulprit": "Alex Morgan",
    "explanation": "..."
  }
}
```

## 7.3 API Standards

Every endpoint must:

- Validate incoming data.
- Return appropriate HTTP status codes.
- Handle errors consistently.
- Avoid exposing internal stack traces.
- Check case and investigation ownership.
- Prevent unauthorized access to secret data.

Standard error response:

```json
{
  "success": false,
  "message": "Unable to process request",
  "code": "VALIDATION_ERROR"
}
```

---

# 8. FRONTEND DESIGN SYSTEM

## 8.1 Design Direction

The interface must look like a modern detective investigation platform.

Visual direction:

- Dark detective-room atmosphere.
- Professional dashboard layout.
- Glassmorphism used selectively.
- Subtle shadows.
- Clean typography.
- Evidence-board-inspired elements.
- Smooth transitions.
- Responsive layouts.

The website must not look like a generic AI chatbot.

## 8.2 Color Palette

| Purpose | Color |
|---|---|
| Main background | `#0B0F14` |
| Secondary background | `#111820` |
| Card background | `#17212B` |
| Primary accent | `#C9A45C` |
| Secondary accent | `#8B1E2D` |
| Main text | `#F3F4F6` |
| Muted text | `#9CA3AF` |
| Success | `#22C55E` |
| Error | `#EF4444` |

Use gold for important actions and evidence highlights.

Use red sparingly for danger or suspicious information.

## 8.3 Typography

Suggested fonts:

- Headings: Playfair Display.
- Body: Inter.

## 8.4 Component Requirements

Reusable React components must include:

- Navbar
- Footer
- PrimaryButton
- SecondaryButton
- LoadingScreen
- CaseCard
- SuspectCard
- EvidenceCard
- EvidenceViewer
- ChatViewer
- ImageViewer
- CCTVViewer
- DocumentViewer
- Timeline
- CaseNotes
- AccusationPanel
- ResultPanel
- ErrorMessage
- ConfirmationModal

Components should be modular and reusable.

## 8.5 Responsive Design

Support:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

The investigation room must adapt its sidebar into a mobile-friendly navigation interface.

---

# 9. SECURITY AND DATA PROTECTION

Security requirements:

1. Store Gemini API keys only on the backend.
2. Use environment variables.
3. Never expose secrets in frontend code.
4. Validate all user input.
5. Sanitize user-generated content.
6. Prevent MongoDB injection.
7. Apply rate limiting to mystery generation.
8. Prevent repeated accusation submissions.
9. Validate suspect and case ownership.
10. Restrict access to secret solutions.
11. Use secure session handling.
12. Apply appropriate CORS configuration.
13. Avoid logging API keys or sensitive internal AI responses.

### Fictional Content Safety

The application is a fictional mystery-solving game.

- Generated evidence must be clearly fictional.
- Do not connect to actual WhatsApp accounts.
- Do not access real CCTV systems.
- Do not generate or imply authentic police or forensic records.
- Do not use real people's private information as evidence.

---

# 10. ERROR HANDLING

The system must handle the following situations:

| Situation | Expected Behavior |
|---|---|
| Empty scenario | Show validation error |
| Scenario too short | Request more details |
| Scenario too long | Show character limit |
| Gemini API failure | Show retry option |
| Invalid AI JSON | Validate and retry |
| Inconsistent mystery | Regenerate or repair |
| Image generation failure | Use a clearly labeled placeholder |
| Video generation unavailable | Use synthetic still-frame fallback |
| Database failure | Show a server error |
| Invalid case ID | Return 404 |
| Invalid suspect ID | Reject accusation |
| Duplicate accusation | Return conflict error |
| Missing evidence asset | Show fallback viewer |

Never crash the entire application because one optional evidence asset fails.

---

# 11. PROJECT FOLDER STRUCTURE

The repository must follow a clean separation between frontend and backend.

```text
AI-MYSTERY-ROOM/
│
├── client/
│   ├── public/
│   │
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── layout/
│       │   ├── evidence/
│       │   └── investigation/
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── CreateMystery.jsx
│       │   ├── Loading.jsx
│       │   ├── InvestigationRoom.jsx
│       │   ├── Accusation.jsx
│       │   └── CaseResult.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       ├── context/
│       ├── hooks/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── gemini.js
│   │
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   │   ├── mysteryService.js
│   │   ├── evidenceService.js
│   │   ├── geminiService.js
│   │   ├── validationService.js
│   │   └── assetService.js
│   │
│   ├── prompts/
│   │   ├── mysteryPrompt.js
│   │   └── evidencePrompt.js
│   │
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── spec.md
├── README.md
├── .gitignore
└── package.json
```

Additional files may be introduced when necessary, but existing responsibilities must not be mixed unnecessarily.

---

# 12. ENVIRONMENT VARIABLES

Create separate `.env` files for client and server where necessary.

Backend `.env`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=

GEMINI_API_KEY=
GEMINI_MODEL=

CLIENT_URL=http://localhost:5173

SESSION_SECRET=

ASSET_PROVIDER=
ASSET_API_KEY=
ASSET_STORAGE_BASE_URL=
```

Frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Rules:

- Never commit `.env` files.
- Provide `.env.example` with empty placeholder values.
- All API credentials must remain on the backend.
- The application must fail with a clear configuration error if required environment variables are missing.
- `GEMINI_MODEL` must be configurable rather than hardcoded throughout the application.

---

# 13. GENERATION PERFORMANCE AND RELIABILITY

AI generation may take time. The system must handle long-running requests appropriately.

Requirements:

- Use a clear generation status.
- Set appropriate API timeouts.
- Avoid duplicate case generation.
- Save the case only after mandatory validation.
- Use bounded retries with backoff for transient provider failures.
- Store generated asset references instead of repeatedly generating assets.
- Avoid sending unnecessarily large prompts.
- Track generation failures for debugging.

Suggested case statuses:

- `generating`
- `ready`
- `failed`

Suggested investigation statuses:

- `active`
- `completed`

The backend must distinguish between required content generation and optional asset generation.

A case can become ready with an explicitly labeled fallback asset if an optional image or video provider fails, provided the required investigation data is valid.

---

# 14. TESTING REQUIREMENTS

## 14.1 Frontend Testing

Test:

- Landing page rendering.
- Scenario input validation.
- Difficulty selection.
- Generation loading states.
- Suspect card rendering.
- Evidence viewer.
- Timeline rendering.
- Accusation selection.
- Result display.
- Responsive layouts.

## 14.2 Backend Testing

Test:

- Mystery generation.
- Gemini response validation.
- Case creation.
- Database relationships.
- Evidence retrieval.
- Timeline retrieval.
- Secret-data isolation.
- Invalid accusation rejection.
- Correct culprit detection.
- Duplicate accusation prevention.
- Error handling.

## 14.3 End-to-End Testing

Complete the following scenarios:

**Test 1: Successful investigation**

1. User enters a scenario.
2. AI generates a mystery.
3. User examines evidence.
4. User identifies the correct culprit.
5. User submits accusation.
6. Case is marked solved.

**Test 2: Incorrect accusation**

1. User creates a mystery.
2. User selects an incorrect suspect.
3. User submits accusation.
4. System identifies the answer as incorrect.
5. System reveals the correct culprit.

**Test 3: Generation failure**

1. User submits a scenario.
2. Gemini API fails.
3. System displays an error.
4. User can retry.

**Test 4: Security**

1. User retrieves public case data.
2. System returns case details.
3. System does not expose the actual culprit.
4. User submits accusation.
5. Server evaluates the answer.

---

# 15. IMPLEMENTATION PHASES

Codex must implement the project incrementally.

## Phase 1: Project Setup

- Initialize MERN project.
- Configure frontend and backend.
- Connect MongoDB.
- Configure environment variables.
- Set up routing.
- Establish API communication.

Deliverable: Running MERN application.

## Phase 2: Frontend Foundation

- Implement landing page.
- Implement navigation.
- Implement mystery creation page.
- Implement difficulty selection.
- Implement loading page.
- Create reusable components.

Deliverable: Complete frontend navigation and page structure.

## Phase 3: AI Integration

- Integrate Gemini API.
- Create mystery generation prompt.
- Define structured JSON schema.
- Implement response validation.
- Implement retry logic.

Deliverable: AI-generated structured mystery.

## Phase 4: Database Integration

- Implement Mongoose models.
- Save cases.
- Save suspects.
- Save evidence.
- Save timeline.
- Store secret solutions separately.

Deliverable: Persistent investigation data.

## Phase 5: Evidence Generation

- Generate fictional chat evidence.
- Generate image evidence.
- Generate CCTV-style evidence.
- Generate documents.
- Implement evidence viewers.

Deliverable: Functional investigation evidence system.

## Phase 6: Investigation Room

- Implement case overview.
- Implement suspect profiles.
- Implement evidence section.
- Implement timeline.
- Implement notes.

Deliverable: Interactive investigation interface.

## Phase 7: Accusation and Results

- Implement suspect selection.
- Implement accusation submission.
- Validate answer on backend.
- Reveal the correct culprit.
- Display explanation.

Deliverable: Complete mystery-solving workflow.

## Phase 8: Testing and Refinement

- Test complete user journey.
- Fix functional bugs.
- Improve responsive design.
- Validate security.
- Optimize AI generation.
- Prepare deployment documentation.

Deliverable: Stable MVP.

---

# 16. FUNCTIONAL REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | User can enter a mystery scenario | Must |
| FR-02 | User can select difficulty | Must |
| FR-03 | AI generates a complete investigation | Must |
| FR-04 | Investigation contains multiple suspects | Must |
| FR-05 | Exactly one culprit is selected | Must |
| FR-06 | AI generates supporting evidence | Must |
| FR-07 | Evidence is organized by category | Must |
| FR-08 | User can inspect evidence | Must |
| FR-09 | User can view the event timeline | Must |
| FR-10 | User can take investigation notes | Should |
| FR-11 | User can select a culprit | Must |
| FR-12 | Backend validates the accusation | Must |
| FR-13 | System reveals the actual solution | Must |
| FR-14 | Investigation data persists in MongoDB | Must |
| FR-15 | User can create another mystery | Must |
| FR-16 | User can view synthetic CCTV evidence | Should |
| FR-17 | User can access optional AI-generated images | Should |

# 17. NON-FUNCTIONAL REQUIREMENTS

- Performance: UI interactions should feel responsive.
- Reliability: Invalid AI output must not produce broken investigations.
- Security: Secret investigation data must remain backend-only.
- Scalability: Services should be modular and independently maintainable.
- Usability: Users should understand how to navigate the investigation.
- Accessibility: Use readable contrast, semantic controls, and keyboard navigation.
- Maintainability: Keep business logic out of React components.
- Responsiveness: Support common desktop and mobile screen sizes.
- Consistency: Every clue must support the same underlying mystery solution.

---

# 18. MVP SCOPE AND FUTURE ENHANCEMENTS

## 18.1 MVP — Mandatory Features

The initial release must include:

1. Landing page.
2. Scenario submission.
3. Difficulty selection.
4. Gemini mystery generation.
5. Suspect generation.
6. One predefined culprit per case.
7. Fictional chat evidence.
8. Image evidence with provider or placeholder fallback.
9. CCTV-style evidence.
10. Timeline.
11. Investigation room.
12. Culprit selection.
13. Result and solution reveal.
14. MongoDB persistence.

The MVP must prioritize a complete working investigation over advanced visual effects.

## 18.2 Future Enhancements

These are not part of the initial MVP unless explicitly approved.

- User registration and login.
- User profile.
- Investigation history dashboard.
- Multiple investigation difficulty levels.
- Multiplayer detective mode.
- Real-time collaborative investigation.
- Leaderboards.
- Investigation scoring.
- Hints system.
- AI detective assistant.
- Voice-based interrogation.
- Interactive suspect interrogation.
- Fully AI-generated CCTV videos.
- PDF case-file export.
- Community-created mystery challenges.

---

# 19. CODEX DEVELOPMENT INSTRUCTIONS

This section defines how Codex must work with this specification.

## 19.1 Single Source of Truth

`spec.md` is the authoritative reference for the entire project.

Codex must:

1. Read the complete `spec.md` before making changes.
2. Follow the architecture and functional requirements.
3. Respect the defined database schema.
4. Follow the API contracts.
5. Follow the defined UI and design system.
6. Implement features according to the specified phases.
7. Avoid introducing unnecessary dependencies.
8. Avoid creating unrelated features.
9. Maintain consistency across frontend, backend, and database.
10. Update this specification when an approved requirement changes.

If existing code conflicts with this specification, follow `spec.md` unless the user explicitly approves changing the specification.

## 19.2 Development Workflow

For every development task:

**Step 1: Understand**

Read the relevant specification sections and inspect the existing codebase.

**Step 2: Plan**

Identify files that need modification and explain the implementation approach.

**Step 3: Implement**

Write modular, maintainable code following the defined architecture.

**Step 4: Validate**

Run relevant tests and verify the implementation.

**Step 5: Report**

Summarize:

- What was implemented.
- Files created or modified.
- Tests performed.
- Any known issues.
- Any deviations from the specification.

## 19.3 Coding Rules

- Use functional React components.
- Use async/await for asynchronous operations.
- Keep controllers thin.
- Place business logic inside services.
- Keep API routes organized.
- Use Mongoose models for database operations.
- Keep Gemini prompts separate from controller logic.
- Validate all Gemini-generated data.
- Use reusable UI components.
- Avoid duplicate code.
- Avoid hardcoding API keys.
- Avoid unnecessary packages.
- Do not use mock data as a substitute for real Gemini integration in the completed MVP.
- Temporary mocks are allowed during isolated UI development but must be clearly identified and replaced before final integration.
- Do not silently remove existing functionality.

## 19.4 Change Management

If a requirement needs to change:

1. Identify the affected specification section.
2. Explain why the change is needed.
3. Update `spec.md`.
4. Check for conflicts with other requirements.
5. Implement the updated requirement.

No major architectural or functional change should be made without updating the SSOT.

## 19.5 Definition of Done

A feature is considered complete only when:

- It follows the specification.
- It works with the intended API.
- It handles expected errors.
- It has been tested.
- It does not expose protected data.
- It does not break existing features.
- Its implementation is maintainable.

The entire project is complete when a user can submit a scenario, receive a valid AI-generated mystery, investigate the evidence, select a culprit, and receive a complete and logically consistent case resolution.

---

# 20. FINAL PROJECT ACCEPTANCE CRITERIA

The project will be accepted as a functional MVP only if all the following conditions are satisfied:

- [ ] MERN application runs successfully.
- [ ] MongoDB connection works.
- [ ] Gemini integration works through the backend.
- [ ] User can submit a custom scenario.
- [ ] Difficulty selection works.
- [ ] AI generates the required suspects.
- [ ] Exactly one culprit is established.
- [ ] AI-generated evidence is consistent with the case.
- [ ] Evidence can be viewed and explored.
- [ ] Timeline is displayed correctly.
- [ ] Investigation data is saved.
- [ ] Culprit selection works.
- [ ] Correct and incorrect accusations are handled.
- [ ] Final solution is revealed.
- [ ] Secret solution is protected before accusation.
- [ ] Responsive design works.
- [ ] Error handling works.
- [ ] No critical frontend or backend errors remain.

---

# END OF SPECIFICATION

**Document Authority:** This document is the Single Source of Truth for AI Mystery Room.

**Primary Development Objective:** Build a complete, functional, AI-powered mystery investigation platform using MERN and Gemini, following this specification without unnecessary scope expansion.