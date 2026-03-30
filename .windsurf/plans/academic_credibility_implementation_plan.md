# Academic Credibility Implementation Plan

## Executive Summary

This document provides a detailed, step-by-step implementation plan for transforming "Nagarjuna Quantum Reflections" into a credible Digital Humanities (DH) tool for academic circles. The plan addresses claim hygiene issues, establishes citable academic records, and initiates low-cost academic dissemination.

**Status:** Phase 1 implemented | Reviewer evidence documents created | External publication/dissemination and residual claim-hardening pending

---

## Phase 0: Deep Codebase Analysis Complete

### Files Requiring Claim Hygiene Fixes

| File Path | Issue | Current State | Required Fix |
|-----------|-------|---------------|--------------|
| `app/api/companion/chat/route.js:71` | API uses `gemini-2.5-flash` | Actual implementation | Sync UI labels to match |
| `components/verse/DesktopVerseLayout.tsx:449` | Shows `Gemini 1.5 Pro` | UI mismatch | Update to `Gemini 2.5 Flash` |
| `components/verse/MobileVerseLayout.tsx:240` | Shows `Gemini 1.5 Pro` | UI mismatch | Update to `Gemini 2.5 Flash` |
| `components/companion/QuantumCompanion.jsx:122` | Shows `gemini-1.5-flash-research` | UI mismatch | Update to `gemini-2.5-flash` |
| `app/research/data/page.tsx:5-30` | `MOCK_TELEMETRY` unlabeled | Prototype data | Add clear "PROTOTYPE" labeling |
| `app/page.tsx:143` | Hardcoded "2.1M Verses Read" | Unverifiable metric | Remove or add disclaimer |
| `app/pricing/page.tsx:259,261` | Hardcoded "12,000+ practitioners", "2.1M verses" | Unverifiable metrics | Remove or add disclaimer |
| `docs/paper.md` | Claims "five-layer deeperDive FAQ" | Actually 6 Q&A pairs | Fix to "six Q&A pairs" |
| `docs/paper.md` | Claims "Each verse displays Devanagari Sanskrit" | Incomplete coverage | Add caveat or fix data |
| `docs/zenodo_upload/Nagarjuna_Quantum_Reflections_Paper.md` | Same paper issues | Sync with paper.md | Apply same fixes |

### Verified Repository Assets (No Changes Needed)

- ✅ `/iks-conference` academic showcase route fully implemented
- ✅ `?showcase=true` paywall bypass working
- ✅ Research Mode HUD in DesktopVerseLayout and MobileVerseLayout
- ✅ AI companion research metadata in QuantumCompanion
- ✅ System prompt artifact exists: `docs/system_prompt_gemini_v2_enhanced.md`
- ✅ 27 canonical chapter files with structured pedagogy
- ✅ Zenodo upload package prepared in `docs/zenodo_upload/`
- ✅ OSF wiki template ready in `docs/osf_wiki_template.md`
- ✅ H-Buddhism announcement drafted in `docs/h_buddhism_announcement.md`

---

## Phase 1: High Priority Implementation (Week 0-2)

### Sprint 1A: Model Label Synchronization

**Objective:** Fix epistemic trust issue where UI shows incorrect AI model labels.

**Files to Edit:**

1. **DesktopVerseLayout.tsx:449**
   - Change: `Gemini 1.5 Pro` → `Gemini 2.5 Flash`
   - Rationale: Match actual API route implementation

2. **MobileVerseLayout.tsx:240**
   - Change: `Gemini 1.5 Pro` → `Gemini 2.5 Flash`
   - Rationale: Match actual API route implementation

3. **QuantumCompanion.jsx:122**
   - Change: `gemini-1.5-flash-research` → `gemini-2.5-flash`
   - Rationale: Match actual API route implementation

**Verification Command:**
```bash
grep -n "gemini-2.5-flash" app/api/companion/chat/route.js
grep -n "Gemini 1.5 Pro\|gemini-1.5" components/verse/DesktopVerseLayout.tsx components/verse/MobileVerseLayout.tsx components/companion/QuantumCompanion.jsx
```

### Sprint 1B: Prototype Labeling

**Objective:** Clearly label mock/prototype data to maintain academic honesty.

**Files to Edit:**

1. **app/research/data/page.tsx:55-62**
   - Current: Green "All data is aggregated & anonymized" badge
   - Add: "PROTOTYPE DATA — Illustrative Only" indicator
   - Add: Subtext explaining "Real telemetry aggregation pending IRB approval"

2. **app/research/data/page.tsx:201-203** (footer)
   - Add: Clear statement that dashboard displays mock data for demonstration

### Sprint 1C: Remove Hardcoded Metrics

**Objective:** Eliminate unverifiable adoption metrics from public surfaces.

**Files to Edit:**

1. **app/page.tsx:140-145**
   - Remove or replace: "2.1M Verses Read" social proof
   - Alternative: Remove entire social proof block or replace with feature highlights

2. **app/pricing/page.tsx:257-262**
   - Remove: "12,000+ practitioners" and "2.1M verses explored"
   - Keep: "Cancel anytime" and "Powered by Whop" (verifiable)

### Sprint 1D: Documentation Accuracy Fixes

**Objective:** Align paper claims with actual implementation.

**Files to Edit:**

1. **docs/paper.md:11,27,89,91,106,143-144**
   - Change all instances of "five-layer deeperDive FAQ" → "six Q&A pairs"
   - Rationale: Actual data structure has 6 Q&A per verse

2. **docs/paper.md:87**
   - Change: "Each verse displays Devanagari Sanskrit"
   - To: "Verses include Devanagari Sanskrit where available (coverage expanding)"
   - Rationale: Devanagari coverage is not universal across all 448 verses

3. **docs/zenodo_upload/Nagarjuna_Quantum_Reflections_Paper.md**
   - Apply same fixes as docs/paper.md

---

## Phase 2: Citable Scholarly Record (Week 1-3)

### Sprint 2A: Zenodo Publication

**Pre-requisites:**
- Zenodo account created (https://zenodo.org)
- Final paper.md reviewed and corrected

**Steps:**

1. **Prepare Upload Package**
   - Source files: `docs/zenodo_upload/`
   - Files to upload:
     - `Nagarjuna_Quantum_Reflections_Paper.md` (methodological paper)
     - Optional: Screenshots of key UI components
     - `metadata.txt` (for reference, not upload)

2. **Zenodo Form Fields**
   
   | Field | Value |
   |-------|-------|
   | Upload Type | Software |
   | Title | Nagarjuna Quantum Reflections: An Interactive AI & 3D WebGL Platform for Teaching the Mūlamadhyamakakārikā |
   | Creators | Sanjay Bhargava |
   | Description | [Use metadata.txt content] |
   | Keywords | Buddhist Studies, Digital Humanities, Madhyamaka, Quantum Physics, EdTech, Artificial Intelligence, Indian Knowledge Systems |
   | License | Creative Commons Attribution 4.0 International (CC-BY 4.0) |

3. **Post-Publication Actions**
   - Copy assigned DOI
   - Create file: `docs/zenodo_doi.txt` containing the DOI
   - Update OSF wiki template with actual DOI

### Sprint 2B: OSF Project Setup

**Pre-requisites:**
- OSF account created (https://osf.io)
- Zenodo DOI obtained

**Steps:**

1. **Create Project**
   - Title: "Nagarjuna Quantum Reflections: AI & WebGL in Digital Humanities"
   - Category: Software
   - Visibility: Public

2. **Configure Wiki**
   - Navigate to Wiki section
   - Paste content from `docs/osf_wiki_template.md`
   - Replace `[INSERT ZENODO DOI HERE]` with actual DOI

3. **Add Links**
   - Add link to live site: https://mulamadhyamakarika-quanta.netlify.app/iks-conference
   - Add link to GitHub repository
   - Add link to Zenodo record

4. **Generate DOI**
   - Use OSF's DOI generation feature
   - Record OSF DOI for cross-linking

### Sprint 2C: Cross-Linking

**Update locations:**

1. **docs/zenodo_upload/metadata.txt**
   - Add: "OSF Project: [OSF DOI/URL]"

2. **docs/osf_wiki_template.md** (future copies)
   - Zenodo DOI already inserted

3. **docs/top20.md** (if it has references section)
   - Add both DOIs

---

## Phase 3: Academic Dissemination (Week 2-4)

### Sprint 3A: H-Buddhism Submission

**Pre-requisites:**
- H-Net account (https://networks.h-net.org)
- Zenodo/OSF records live
- Claim hygiene fixes complete

**Steps:**

1. **Review Draft**
   - Source: `docs/h_buddhism_announcement.md`
   - Verify all links work
   - Ensure non-commercial tone

2. **Submit Post**
   - Navigate to H-Buddhism network
   - Create new discussion post
   - Paste announcement text
   - Tag appropriately: #DigitalHumanities #BuddhistStudies #Pedagogy

3. **Monitor Responses**
   - Set notification for replies
   - Prepare to respond to academic feedback
   - Document feedback for future iterations

### Sprint 3B: Direct Faculty Outreach

**Target List (20-30 contacts):**

**Buddhist Studies Professors:**
- Top 10 Buddhist Studies programs in North America/Europe
- Look for professors teaching MMK, Madhyamaka, or Indian philosophy
- Focus on those with DH or technology interests

**Digital Humanities Centers:**
- 5-10 university DH centers with religion/philosophy focus
- Contemplative science hubs (ETSI, LTWA, Science & Wisdom LIVE)

**Subject Librarians:**
- 5-10 South Asian studies librarians
- Religion/philosophy subject specialists

**Outreach Template:**
```
Subject: Digital Humanities Tool for Teaching MMK — Feedback Requested

Dear Professor [Name],

I am writing to share a new open-access digital humanities tool designed for teaching Nāgārjuna's Mūlamadhyamakakārikā.

Nagarjuna Quantum Reflections ([showcase URL]) combines:
- Structured pedagogy for all 27 MMK chapters
- AI companion with transparent, inspectable prompts
- 3D WebGL visualizations with epistemic guardrails
- Research Mode for academic evaluation

The platform is entirely free for academic use. We are actively seeking feedback from scholars in Buddhist studies regarding its philosophical accuracy and classroom utility.

Citable record: [Zenodo DOI]
Academic showcase: [URL]/iks-conference

Would you be willing to review the platform or share it with colleagues who teach MMK?

With regards,
[Name]
[Affiliation]
```

### Sprint 3C: Humanities Commons & PhilPeople

**Humanities Commons:**
- Create profile at https://hcommons.org
- Post project description linking to Zenodo/OSF
- Join relevant groups (Buddhist Studies, Digital Humanities)

**PhilPeople:**
- Add project entry at https://philpeople.org
- Categorize under: Buddhist Philosophy, Philosophy of Religion, Digital Humanities
- Link to all citable resources

---

## Phase 4: Reviewer Evidence Pack (Week 3-6)

### Sprint 4A: Methods Summary Document

**Create:** `docs/reviewer_methods_summary.md`

**Sections:**
1. **Data Architecture**
   - Canonical data structure explanation
   - 27 chapters, ~448 verses
   - Philosophy fields, quantumResonance, animation, deeperDive, quiz

2. **AI Methodology**
   - Model: Gemini 2.5 Flash
   - System prompt location and version
   - Epistemic guardrails implementation
   - Context injection from verse data

3. **Caveat Policy**
   - Anti-pseudoscience framing
   - RESONANCE scoring explanation
   - quantumResonance.caveat field usage

4. **Limitations (Honest Disclosure)**
   - Devanagari coverage incomplete
   - Telemetry dashboard is prototype
   - 3D animations vary in sophistication

5. **Evaluation Guide**
   - How to access Research Mode
   - How to inspect system prompts
   - How to verify claims in codebase

### Sprint 4B: Institutional Pilot Brief

**Create:** `docs/institutional_pilot_brief.md`

**One-page document covering:**
- What the platform offers for classrooms
- Technical requirements (browser-based, zero-install)
- Pedagogical scaffolding (3-tier quizzes, AI companion)
- Access options (free academic showcase, full tier structure)
- Feedback collection mechanism
- Contact for pilot coordination

---

## Phase 5: Real Telemetry Implementation (Week 4-8)

### Sprint 5A: Analytics Schema Definition

**Create:** `docs/analytics_schema.md`

**Events to Track:**
```javascript
VERSE_VIEW: { chapterId, verseId, timestamp, sessionId }
TIME_ON_VERSE: { chapterId, verseId, durationSeconds }
QUIZ_ATTEMPT: { chapterId, verseId, tier, correct, timestamp }
ANIMATION_INTERACTION: { chapterId, verseId, interactionType }
SHOWCASE_VISIT: { referrer, timestamp, featuresAccessed }
RESEARCH_MODE_TOGGLE: { chapterId, verseId, enabled }
COMPANION_MESSAGE: { chapterId, verseId, messageCount, tier }
```

### Sprint 5B: Aggregation Pipeline

**Implementation:**
1. Export raw events from analytics provider
2. Aggregate into daily/weekly summaries
3. Calculate metrics:
   - Total unique sessions
   - Average time per verse
   - Quiz pass rates by tier
   - Animation interaction rates

### Sprint 5C: Dashboard Update

**Update:** `app/research/data/page.tsx`

1. Replace `MOCK_TELEMETRY` with real aggregated data
2. Add date range selector
3. Add "Last updated: [timestamp]" indicator
4. Add methodology note explaining aggregation
5. Add download link for raw anonymized data (if appropriate)

---

## Phase 6: Low Priority / Future (Week 8+)

### Sprint 6A: Broader Social Amplification

**Timing:** Only after scholarly record is established

**Channels:**
- Reddit (r/Buddhism, r/philosophy, r/DigitalHumanities)
- Hacker News (Show HN)
- LinkedIn (academic/professional network)

### Sprint 6B: Grant Pipeline Preparation

**Potential Funding Sources:**
- Templeton Foundation (science & religion)
- NEH Digital Humanities Advancement
- Contemplative science grants
- Fiscal sponsorship through educational 501(c)(3)

**Preparation:**
- Compile pilot feedback
- Document pedagogical outcomes (post-telemetry)
- Draft grant narratives
- Identify potential fiscal sponsors

---

## Implementation Checklist

### Immediate (High Priority)

- [x] Fix model labels in DesktopVerseLayout.tsx
- [x] Fix model labels in MobileVerseLayout.tsx
- [x] Fix model labels in QuantumCompanion.jsx
- [x] Add prototype labeling to research/data page
- [x] Remove hardcoded metrics from page.tsx
- [x] Remove hardcoded metrics from pricing/page.tsx
- [x] Fix paper.md "five-layer" → "six Q&A pairs"
- [x] Fix paper.md Devanagari claim with caveat
- [x] Sync zenodo_upload paper with fixes
- [ ] Publish Zenodo package
- [ ] Create OSF project
- [ ] Submit H-Buddhism announcement
- [ ] Send first batch of faculty outreach (10 contacts)

### Medium Priority

- [x] Create reviewer_methods_summary.md
- [x] Create institutional_pilot_brief.md
- [ ] Complete faculty outreach (30 contacts total)
- [ ] Create Humanities Commons profile
- [ ] Create PhilPeople entry
- [ ] Implement real telemetry aggregation
- [ ] Update dashboard with real data
- [ ] Contact contemplative science hubs

### Low Priority

- [ ] Broader social platform launches
- [ ] Course/cohort experiments
- [ ] Grant narrative preparation
- [ ] Fiscal sponsorship outreach

---

## Success Metrics

### Phase 1 Success
- Zero model label mismatches in codebase
- All prototype data clearly labeled
- No unverifiable metrics in public UI
- Paper claims aligned with implementation

### Phase 2 Success
- Zenodo DOI obtained and saved
- OSF project public with DOI
- Cross-linking complete between platforms

### Phase 3 Success
- H-Buddhism post live with engagement
- 20+ faculty members contacted
- 5+ academic responses/feedback received
- Humanities Commons profile active

### Phase 4 Success
- Reviewer packet accessible at `/iks-conference`
- Methods summary downloadable
- Pilot brief available for distribution

### Phase 5 Success
- Real telemetry replacing mock data
- Aggregated metrics with methodology notes
- Data export capability for researchers

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Academic skepticism about "quantum mysticism" | Emphasize anti-pseudoscience guardrails, explicit caveats, structural analogy framing only |
| H-Buddhism post rejected as commercial | Ensure non-commercial tone, focus on pedagogical utility, request feedback |
| Faculty outreach ignored | Personalize each email, reference their specific research interests, offer concise value proposition |
| Zenodo/OSF technical issues | Prepare backup documentation, test uploads before final submission |
| Telemetry privacy concerns | Ensure anonymization, add clear privacy notices, consider IRB guidance |

---

## Dependencies and Prerequisites

### User Actions Required

1. **Zenodo Account**: Create at https://zenodo.org (free)
2. **OSF Account**: Create at https://osf.io (free)
3. **H-Net Account**: Create at https://networks.h-net.org (free)
4. **Faculty Target List**: Identify 20-30 specific professors/librarians to contact
5. **Affiliation Decision**: Determine institutional affiliation for author metadata

### Technical Dependencies

- All fixes are documentation/UI text changes (no new dependencies)
- Telemetry implementation requires analytics provider configuration
- No backend changes required for Phase 1-4

---

## Appendix A: Quick Reference Commands

### Verify Model Label Sync
```bash
grep -rn "gemini-2.5-flash\|Gemini 1.5 Pro\|gemini-1.5" app/ components/ --include="*.tsx" --include="*.jsx" --include="*.js"
```

### Find All "Five-Layer" Claims
```bash
grep -rn "five.layer\|five layer\|5.layer\|5 layer" docs/ --include="*.md"
```

### Find Devanagari Claims
```bash
grep -rn "Each verse.*Devanagari\|Every verse.*Sanskrit\|all verses.*Devanagari" docs/ --include="*.md"
```

### Find Hardcoded Metrics
```bash
grep -rn "12,000\|2\.1M\|practitioners\|verses explored" app/ --include="*.tsx"
```

---

## Appendix B: File Inventory

### Files to Edit (Phase 1)

1. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/components/verse/DesktopVerseLayout.tsx` (line ~449)
2. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/components/verse/MobileVerseLayout.tsx` (line ~240)
3. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/components/companion/QuantumCompanion.jsx` (line ~122)
4. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/app/research/data/page.tsx` (lines ~55-62, ~201-203)
5. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/app/page.tsx` (line ~143)
6. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/app/pricing/page.tsx` (lines ~259, ~261)
7. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/docs/paper.md` (multiple locations)
8. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/docs/zenodo_upload/Nagarjuna_Quantum_Reflections_Paper.md` (sync with paper.md)

### Files to Create (Phase 2-4)

1. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/docs/zenodo_doi.txt`
2. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/docs/reviewer_methods_summary.md`
3. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/docs/institutional_pilot_brief.md`
4. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/docs/analytics_schema.md`

### Existing Files to Use (No Changes)

1. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/docs/zenodo_upload/metadata.txt` (reference)
2. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/docs/osf_wiki_template.md` (copy to OSF)
3. `/Users/sanjayb/Documents/newrepo/Mulamadhyamakakarika/docs/h_buddhism_announcement.md` (copy to H-Net)

---

**Plan Version:** 1.0  
**Created:** March 26, 2026  
**Status:** Awaiting User Approval  
**Next Action:** User confirmation to proceed with implementation
