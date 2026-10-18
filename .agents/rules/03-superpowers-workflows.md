# Superpowers Engineering Workflows

Discipline and rigor from Claude Superpowers (`obra/superpowers`).

## 1. Skill Invocations
- When a workflow, debugging session, test setup, or plan is needed, invoke the corresponding skill.
- Skills override generic guesses with proven engineering runbooks.
- **Brainstorming first**: Before writing an implementation plan or jumping straight into a new feature, invoke `brainstorming` to explore approaches, identify risks, and clarify user desires.
- **Systematic Debugging**: When an issue arises, follow systematic debugging: isolate the symptom, reproduce it with a minimal test case, form a hypothesis, verify the cause, apply a surgical fix, and re-verify.
- **Test-Driven Development (TDD)**: Write the test first, verify failure, implement minimal code to pass, and refactor.
- **Verification before completion**: Never claim a task is done without executing the test, build, or runtime command to verify it.

## 2. Task Tracking & Checklists
- For multi-step tasks, maintain a task checklist.
- Keep the task checklist updated as steps complete (`- [x]`).
- Do not lose state or abandon unfinished items.
