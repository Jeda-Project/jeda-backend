# /plan

Produce a structured implementation plan for a backend feature or task.

## Steps

1. Read SSOT.md §4 (architecture) and the relevant SSOT section for the task type
2. Identify the closest existing module to mirror (`entries`, `summaries`, or `safety`)
3. Define the vertical slice: all files to create or modify across
   `routes → service → repository → schema → errors → index → __tests__`
4. Note DB/migration impact (schema change? `db:generate` + `db:migrate`?)
5. Note OpenAPI/contract impact (new operations? Swift client regen needed?)
6. Identify risks (auth, validation, safety implications, backward compat)
7. Output a phased task list ordered TDD-first

## Output Format

```
## Plan: <feature>
### Pattern to follow: <module>
### Files (by layer)
- routes:      src/modules/<m>/<m>.routes.ts
- service:     src/modules/<m>/<m>.service.ts
- repository:  src/modules/<m>/<m>.repository.ts
- schema:      src/modules/<m>/<m>.schema.ts
- errors:      src/modules/<m>/<m>.errors.ts  (if new domain errors)
- index:       src/modules/<m>/<m>.index.ts
- tests:       src/modules/<m>/__tests__/<m>.service.test.ts
               src/modules/<m>/__tests__/<m>.routes.test.ts
### DB / migration
### OpenAPI / client
### Risks
### Phases
1. Write tests (RED)
2. Implement (GREEN)
3. Code review (jb-api-reviewer + code-reviewer)
4. Quality gates (check + lint + format + test)
5. Commit
```

Keep it scannable. Reference exact file paths. No implementation code.
