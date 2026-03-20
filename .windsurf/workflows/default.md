---
description: "Default workflow for all tasks - planning, subagents, verification, and self-improvement"
triggers:
  - always
---

# Default Workflow Rules

## 1. Plan Node Default

**Enter plan mode for ANY non-trivial task:**
- 3+ steps or architectural decisions
- If something goes sideways, STOP and re-plan immediately — don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

**Planning Checklist:**
- [ ] Break task into discrete, verifiable steps
- [ ] Identify potential risks and failure points
- [ ] Determine if subagents are needed
- [ ] Define "done" criteria before starting

---

## 2. Subagent Strategy

**Use subagents liberally to keep main context window clean:**
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- **One task per subagent** for focused execution

**When to use subagents:**
- Codebase exploration and mapping
- Parallel analysis of multiple files
- Research that requires reading many documents
- Testing and verification tasks
- Any task that can be isolated and parallelized

**Subagent Best Practices:**
- Give clear, specific instructions
- Define expected output format
- Set reasonable scope boundaries
- Don't micromanage — let them work autonomously

---

## 3. Self-Improvement Loop

**After ANY correction from the user:**
- Update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

**Lessons.md Format:**
```markdown
## YYYY-MM-DD: [Brief Description]
**Mistake:** [What went wrong]
**Root Cause:** [Why it happened]
**Fix Applied:** [How it was resolved]
**Prevention Rule:** [Rule to prevent recurrence]
```

---

## 4. Verification Before Done

**Never mark a task complete without proving it works:**
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

**Verification Checklist:**
- [ ] Code compiles/builds without errors
- [ ] Tests pass (if test suite exists)
- [ ] Manual verification performed for UI changes
- [ ] Edge cases considered and tested
- [ ] No regressions in related functionality
- [ ] User can see/verify the change works

---

## 5. Demand Elegance (Balanced)

**For non-trivial changes, pause and ask: "Is there a more elegant way?"**
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- **Skip this for simple, obvious fixes** — don't over-engineer
- Challenge your own work before presenting it

**Elegance Indicators:**
- Minimal code changes for maximum impact
- Clear, readable, maintainable code
- Follows existing patterns in the codebase
- No unnecessary abstractions or complexity

---

## 6. Autonomous Bug Fixing

**When given a bug report, just fix it — don't ask for hand-holding:**
- Point at logs, errors, failing tests, then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

**Autonomous Bug Fix Process:**
1. Identify the error/failure
2. Trace to root cause (not symptoms)
3. Implement minimal, correct fix
4. Verify the fix works
5. Report what was found and fixed

---

# Task Management

## Standard Process

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Todo.md Template

```markdown
# Task: [Name]

## Plan
- [ ] Step 1: [Description]
- [ ] Step 2: [Description]
- [ ] Step 3: [Description]

## Progress Notes
- [Timestamp]: [What was done]

## Results
- [Summary of outcome]
- [Links to relevant changes]

## Lessons Learned
- [Link to lessons.md entry if applicable]
```

---

# Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Context Preservation**: Never waste user's context. Keep history, build on it.
- **Proactive Communication**: Surface blockers, risks, and trade-offs immediately.
- **Ownership**: Treat the codebase as your own. Leave it better than you found it.

---

# Quick Reference

| Situation | Action |
|-----------|--------|
| 3+ steps or architecture | Enter plan mode |
| Need to explore code | Use subagent |
| User corrects me | Update lessons.md |
| Task "complete" | Verify it actually works |
| Fix feels hacky | Pause, find elegant solution |
| Bug report | Fix autonomously, show proof |
| Multiple parallel tasks | Spawn subagents |
