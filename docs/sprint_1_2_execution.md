# 🚀 Execution Plan: Sprints 1 & 2 (Academic Dissemination)

This document breaks down the mechanical, step-by-step execution required to complete Sprint 1 and Sprint 2 of the Dissemination Strategy. Because several of these steps require authenticated access to third-party academic platforms (Netlify, H-Net, Zenodo, OSF), this plan clearly delineates what the AI Agent will do autonomously and what the User will need to copy/paste.

---

## 🏃‍♂️ SPRINT 1: Fix URLs + H-Buddhism Announcement

### Step 1.1: Trigger Netlify Deployment (Agent-Led)
**Objective:** Ensure `https://mulamadhyamakarika-quanta.netlify.app/iks-conference` and `/research/data` return HTTP 200.
- **Agent Action 1:** Run `git status` to check for uncommitted changes in `app/iks-conference/` and `app/research/data/`.
- **Agent Action 2:** Stage and commit these specific directories with message: `feat: add academic showcase and telemetry routes for reviewer access`.
- **Agent Action 3:** Run `git push origin main` (or the relevant default branch) to trigger the Netlify continuous deployment pipeline.
- **Agent Action 4:** Wait 2 minutes, then use an HTTP request (or browser tool) to confirm the live URL resolves successfully.

### Step 1.2: Prepare H-Buddhism Announcement (Agent-Led)
**Objective:** Finalize the exact text for the listserv submission.
- **Agent Action:** Generate a polished, ready-to-paste text block formatted specifically for the H-Net interface, ensuring zero commercial language (removing any mention of "Whop" or "Pricing").

### Step 1.3: Submit to H-Buddhism (User-Led)
**Objective:** Post the announcement.
- **User Action:** Log in to `https://networks.h-net.org/h-buddhism`.
- **User Action:** Create a new "Discussion" or "Resource" post and paste the text provided by the Agent in Step 1.2.

---

## 🏃‍♂️ SPRINT 2: Create Citable Academic Record

To achieve this sprint, we need to create profiles on three distinct academic repositories. The Agent will prepare an "Upload Package" locally so the User has everything perfectly formatted.

### Step 2.1: Prepare the "Zenodo Release Package" (Agent-Led)
**Objective:** Gather the required files and metadata for the Zenodo DOI generation.
- **Agent Action 1:** Create a local directory: `docs/zenodo_upload/`.
- **Agent Action 2:** Copy `docs/paper.md` into this folder as `Nagarjuna_Quantum_Reflections_Paper.pdf` (or formatted md).
- **Agent Action 3:** Generate a `metadata.txt` file containing the exact text to copy-paste into Zenodo:
  - **Upload Type:** Software / Digital Humanities Tool
  - **Title:** Nagarjuna Quantum Reflections: An Interactive AI & 3D WebGL Platform for Teaching the Mūlamadhyamakakārikā
  - **Creators:** Sanjay Bhargava
  - **Description:** A highly polished academic abstract describing the platform, the ATOM framework, and the RESONANCE metric.
  - **Keywords:** Buddhist Studies, Digital Humanities, Madhyamaka, Quantum Physics, EdTech.
  - **License:** Creative Commons Attribution 4.0 International

### Step 2.2: Execute Zenodo Upload (User-Led)
**Objective:** Get the DOI.
- **User Action:** Go to `https://zenodo.org/uploads/new`.
- **User Action:** Drag and drop the files from `docs/zenodo_upload/`.
- **User Action:** Copy/paste the metadata from `metadata.txt`.
- **User Action:** Click Publish and retrieve the **DOI link** (e.g., `10.5281/zenodo.xxxxxxx`). Give this DOI back to the Agent.

### Step 2.3: OSF (Open Science Framework) Setup (Agent + User)
**Objective:** Create the canonical project anchor.
- **Agent Action:** Generate the OSF Wiki markdown text (incorporating the new Zenodo DOI).
- **User Action:** Log in to `https://osf.io` and create a new project.
- **User Action:** Paste the Wiki text and link the Zenodo repository.

### Step 2.4: PhilPeople Profile (User-Led)
**Objective:** List the tool on the largest philosophy registry.
- **User Action:** Log in to `https://philpeople.org`.
- **User Action:** Navigate to your profile -> Publications/Works -> Add Work.
- **User Action:** Enter the platform details, pasting the OSF or Zenodo DOI link into the external links section.

---

## 🚀 Readiness Check

If you approve this execution plan, I will immediately begin executing **Step 1.1** (Git Push & Netlify Verification) and **Step 1.2/2.1** (Generating the exact copy-paste templates and the Zenodo upload folder). 
