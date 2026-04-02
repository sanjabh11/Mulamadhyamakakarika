# Nagarjuna Quantum Reflections

Nagarjuna Quantum Reflections is a research-facing digital humanities web application for studying Nāgārjuna’s *Mūlamadhyamakakārikā* (MMK) through structured verse data, interactive 3D pedagogy, and AI-assisted explanation with explicit epistemic guardrails.

## What this project is

This project is best understood as:

- a digital humanities teaching and research tool
- a browser-based MMK exploration environment
- a transparency-oriented AI pedagogy experiment
- an outreach-ready academic platform for Buddhist studies, philosophy, contemplative science, and DH communities

It should **not** be framed as a claim that Buddhist philosophy predicted quantum physics. The quantum layer is used as a carefully labeled pedagogical analogy.

## Core scholarly contribution

The repository brings together five things in one system:

- the 27-chapter MMK corpus in structured verse data
- verse-level philosophical explanations and misconception warnings
- interactive 3D visualizations for difficult logical arguments
- AI-assisted explanation with documented prompt and source hierarchy
- a research-facing showcase route with visible epistemic framing

## What is implemented in the repo

Current repo-backed assets include:

- 27 canonical chapter data files in `data/chapters/`
- 448 configured verse slots across the MMK corpus
- verse pages with 3D visual experiences and structured metadata
- six-step `deeperDive` learning scaffolds and three-tier quizzes
- `quantumResonance.caveat` fields to prevent metaphysical overclaiming
- `/iks-conference` reviewer route for academic evaluation
- `?showcase=true` direct reviewer access on verse routes
- progress tracking, streaks, and certificate flows
- dissemination documents in `docs/` for Zenodo, outreach, and institutional pilots

## What remains prototype or research-stage

Several parts of the platform should be described carefully in academic materials:

- `/research/data` is a prototype-facing research surface, not a fully validated public analytics study
- current evidence in the paper is preliminary and directional, not yet a controlled educational trial
- Devanagari and text normalization coverage are improving, but should not be overstated as fully uniform
- the live product still contains a Whop-based consumer access architecture that is in tension with the stronger academic positioning

## Why the platform matters

The platform addresses a real pedagogical problem: MMK is philosophically central yet difficult to teach at scale to new learners. The app attempts to reduce that difficulty without flattening the tradition.

Its strongest differentiators are:

- explicit anti-pseudoscience guardrails
- inspectable research framing rather than opaque AI behavior
- verse-level interaction instead of only static text presentation
- DH-style structured content architecture rather than ad hoc commentary pages

## Intended audiences

The most credible audiences are:

- Buddhist studies faculty and students
- philosophy of religion and philosophy of science instructors
- digital humanities researchers
- contemplative science communities
- independent advanced learners looking for guided but non-reductive entry into MMK

## Dissemination strategy

The repository already supports academic dissemination through:

- Zenodo-based software citation
- conference/reviewer showcase access
- faculty outreach templates
- institutional pilot documentation
- H-Buddhism and related listserv outreach materials

The strongest next-step positioning is as a DH research and teaching platform, not as a commercial consumer subscription product.

## ORCID clarification

ORCID is **not** a journal, repository, or submission destination. The right use of ORCID for this project is:

- register or use your ORCID iD
- connect the Zenodo record and future publications to your ORCID profile
- use ORCID in outreach, grant applications, and author metadata

In other words, the question is not whether this paper should be submitted to ORCID. The question is whether the paper, Zenodo record, and repository are strong enough to be linked from an ORCID profile as part of a coherent scholarly portfolio.

## Recommended next steps

- strengthen `docs/paper.md` with repo-verifiable claims only
- align all submission-facing docs around the DH framing
- add ORCID to author metadata once available
- use Zenodo, OSF, conference submission, and academic outreach as the real dissemination path
- treat ORCID as identity infrastructure layered on top of those outputs

## E2E smoke suite

The repo now includes a Playwright smoke suite for the two public academic routes:

- `/iks-conference`
- `/research/data`

Run it locally with:

```bash
PATH=/opt/homebrew/bin:/usr/local/bin:$PATH npm run test:e2e
```

Operational notes:

- the Playwright config starts Next.js on an isolated local port (`3104`) to avoid collisions with other local processes
- the suite seeds a returning-user state before page load so the onboarding modal does not block the public smoke flows
- the runner is intentionally single-worker with longer timeouts because these pages compile slowly enough in dev mode to make default parallel settings flaky
- GitHub Actions runs the same smoke suite via `.github/workflows/e2e-smoke.yml` on relevant pull requests and manual dispatch
