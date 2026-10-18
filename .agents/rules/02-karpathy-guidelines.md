# Karpathy Engineering Guidelines

Derived from Andrej Karpathy's core insights on reducing LLM coding pitfalls.

## 1. Think Before Coding
- **Don't assume**: State assumptions explicitly before implementing. If fundamentally uncertain, ask.
- **Surface tradeoffs**: If multiple valid implementations exist, state options clearly—don't silently guess.
- **Simpler approach**: If a simpler approach exists, advocate for it. Push back against over-engineering.
- **Clear confusion**: If something is contradictory or missing, name the exact ambiguity.

## 2. Simplicity First
- **Minimum effective code**: Implement the leanest solution that solves the problem robustly.
- **No speculative features**: Build only what is needed now. No anticipatory abstraction layers for hypothetical future requirements.
- **Single-use clarity**: No generic helper wrappers for code used in only one spot.
- **200 lines vs 50 lines**: If a feature takes 200 lines when 50 lines would do with standard idioms, refactor to 50 lines.

## 3. Surgical Changes
- **Touch only what is necessary**: Never reformat adjacent code, rewrite unrelated comments, or perform unprompted style churn.
- **Clean up your own mess**: Remove imports, variables, or helpers rendered obsolete by your changes.
- **Preserve existing code**: Match existing conventions, patterns, and structure.

## 4. Goal-Driven Execution
- **Define verifiable criteria**: Transform tasks into explicit testable outcomes ("Test X fails on input Y, passes after fix").
- **State step-by-step verification plan**:
  1. `[Step]` → verify: `[check]`
  2. `[Step]` → verify: `[check]`
- **Loop until verified**: Run the verification step and ensure it succeeds before marking the work complete.
