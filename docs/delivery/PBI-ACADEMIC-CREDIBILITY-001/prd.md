# PBI-ACADEMIC-CREDIBILITY-001

## Title
Academic credibility, dissemination readiness, and public trust-surface alignment

## Status
InProgress

## Problem
The repository already contains substantial scholarly, pedagogical, and reviewer-facing assets, but the public trust surface is not yet aligned with them. The main homepage and pricing flow still foreground consumer SaaS / Whop framing. Research-facing UI labels are partly inconsistent. The telemetry dashboard is explicitly prototype-grade but not yet packaged as an evidence methodology surface. The repo also lacks canonical delivery metadata for this initiative.

## Vision alignment
The platform should present itself first as:
- a digital humanities environment for studying the MMK
- a pedagogical bridge between Madhyamaka and carefully caveated quantum analogies
- a transparent research prototype suitable for researchers, teachers, students, and serious public learners

Quantum material must remain explicitly subordinate to epistemic discipline:
- structural analogy, not metaphysical proof
- anti-pseudoscience guardrails visible in public surfaces
- prototype claims clearly labeled

## Verified findings from code audit
- `app/page.tsx` still leads with premium-tier / consumer-upgrade language.
- `app/pricing/page.tsx` and `components/whop/MembershipTiers.jsx` still frame the product primarily as a subscription app.
- `app/iks-conference/page.tsx` is a real academic showcase route and is a strong reviewer entry point.
- `app/research/data/page.tsx` is clearly prototype / illustrative, but it still needs cleaner methodological framing.
- `app/api/companion/chat/route.js` uses `gemini-2.5-flash`.
- `components/verse/DesktopVerseLayout.tsx`, `components/verse/MobileVerseLayout.tsx`, and `components/companion/QuantumCompanion.jsx` expose research-mode telemetry / metadata and should be synchronized to a canonical research metadata source.
- `components/verse/VersePageClient.tsx` and `app/verse/[id]/page.tsx` confirm the showcase bypass exists.
- No existing `docs/delivery/...` PBI/task structure was present for this scope.

## Adversarial gap analysis
### High priority
1. Public homepage signaling undercuts academic trust.
2. SEO / metadata is too generic for scholarly discovery and citation-minded audiences.
3. Research-mode metadata is duplicated across multiple UI surfaces and lacks a single canonical source.
4. Prototype-evidence boundaries need stronger, repeated labeling.
5. Academic entry points are not sufficiently surfaced from the main public route.

### Medium priority
1. Reviewer and educator navigation should be easier from the main site.
2. Pricing should be de-emphasized as the primary identity of the project.
3. Institutional / pilot materials should be better linked from reviewer surfaces.
4. A clearer audience segmentation model is needed: researchers, educators, students, public learners.

### Deferred / external
1. Zenodo and OSF publication.
2. Fiscal sponsorship outreach.
3. H-Buddhism / faculty outreach execution.
4. Real telemetry aggregation and publication pipeline.

## Goals
- Align public-facing product messaging with the app’s strongest validated assets.
- Improve academic credibility without breaking existing monetization infrastructure.
- Make prototype status and epistemic guardrails legible.
- Surface a clearer researcher / educator / learner pathway.
- Establish canonical delivery metadata and checkpoints for follow-on work.

## Non-goals
- Remove Whop entirely in this task.
- Implement real telemetry warehousing in this task.
- Publish external Zenodo / OSF records from inside the repo.
- Build full institutional licensing or SSO in this task.

## Architecture plan
### Phase 1: Trust-surface foundation
Checkpoint 1.1
- Create canonical delivery metadata and scoped task records.

Checkpoint 1.2
- Centralize research metadata constants used by API and research-mode UI.

Checkpoint 1.3
- Strengthen prototype / illustrative labeling where needed.

### Phase 2: Public academic repositioning
Checkpoint 2.1
- Rework homepage hero and free-user messaging to foreground DH, pedagogy, and audience segmentation.

Checkpoint 2.2
- Add explicit anti-pseudoscience / structural-analogy framing to major public entry points.

Checkpoint 2.3
- Expose reviewer and research pathways directly from the public homepage.

### Phase 3: Discovery and reviewer readiness
Checkpoint 3.1
- Upgrade root metadata for discoverability and academic framing.

Checkpoint 3.2
- Improve `app/iks-conference/page.tsx` CTA language toward evaluator / educator usage.

Checkpoint 3.3
- Ensure prototype dashboard language is methodologically conservative.

### Phase 4: Validation
Checkpoint 4.1
- Verify build integrity.

Checkpoint 4.2
- Manually inspect `/`, `/iks-conference`, `/research/data`, and a showcase verse route.

## Acceptance criteria
- Homepage no longer presents the product primarily as a consumer premium upgrade funnel.
- Academic, educator, and learner use cases are visible from `/`.
- Public-facing copy explicitly distinguishes structural analogy from metaphysical identity.
- Research-mode labels are driven by a canonical internal source instead of copy-pasted strings.
- Reviewer-facing routes remain intact and are easier to discover.
- Root metadata better reflects scholarly / DH positioning.
- All changed files are listed in the active task record.

## Initial implementation scope
- `app/layout.tsx`
- `app/page.tsx`
- `app/iks-conference/page.tsx`
- `app/research/data/page.tsx`
- `app/api/companion/chat/route.js`
- `components/verse/DesktopVerseLayout.tsx`
- `components/verse/MobileVerseLayout.tsx`
- `components/companion/QuantumCompanion.jsx`
- `lib/research-metadata.ts`
