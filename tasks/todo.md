# Execution Checklist: Sprint 1 & 2 (Academic Dissemination)

## Sprint 1: Fix URLs and H-Buddhism
- [/] **Agent:** Check `git status` for `app/iks-conference/` and `app/research/data/`.
- [ ] **Agent:** Commit these directories to git and push to `origin main` to trigger Netlify.
- [ ] **Agent:** Verify live URLs (`/iks-conference` and `/research/data`) return HTTP 200.
- [ ] **Agent:** Generate exact text block for the H-Buddhism announcement (no commercial language).
- [ ] **User:** Submit the generated announcement text to the H-Net Commons portal.

## Sprint 2: Create Citable Academic Record
- [ ] **Agent:** Create `docs/zenodo_upload/` directory.
- [ ] **Agent:** Copy `docs/paper.md` into the Zenodo folder as `Nagarjuna_Quantum_Reflections_Paper.md/pdf`.
- [ ] **Agent:** Generate `metadata.txt` with Title, Description, Keywords, Authors, and License.
- [ ] **User:** Upload the folder to `https://zenodo.org/uploads/new` and retrieve DOI.
- [ ] **Agent:** Generate OSF Wiki text incorporating the new Zenodo DOI.
- [ ] **User:** Create OSF project at `https://osf.io` and paste Wiki text.
- [ ] **User:** Add app to "Digital Projects" on `https://philpeople.org`.

## Ongoing Tracking
- [ ] **Lessons Learned:** Capture any workflow friction or success into `tasks/lessons.md`.
