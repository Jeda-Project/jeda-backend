# /plan-api

Scaffold a plan for a new API endpoint or module — from HTTP contract down to the DB.

## Steps

1. Define the HTTP contract: method, path, request body/query params, response shape,
   status codes (200/201/204/401/404/422)
2. Identify Zod schemas needed in `<m>.schema.ts` (input + output, `.meta({ id })` for OpenAPI)
3. Map the route handler: `describeRoute` metadata + `validator()` + service call + response
4. Define the service method: business logic, domain errors to throw
5. Define the repository method: Drizzle query (table, filter, returning columns)
6. Note DB schema changes: new columns? new table? → `db:generate` + `db:migrate`
7. Plan `describeRoute` completeness: all responses documented, `security: [{ Bearer: [] }]`
8. Note OpenAPI regeneration step: `rtk bun run openapi:generate`

## Output Format

```
## API Plan: <METHOD> /api/<path>

### Contract
- Request: <body/query schema>
- Response 2xx: <shape>
- Errors: 401 (no auth), 404 (not found), 422 (validation)

### Schemas (schema.ts)
- <SchemaName>: <fields>

### Route (routes.ts)
- describeRoute: summary, request, responses
- validator: <schema ref>
- handler: calls <serviceName>.<method>()

### Service (service.ts)
- <method>(input): <return type>
- Throws: <ErrorClass>

### Repository (repository.ts)
- <method>(params): Drizzle query on `<table>`

### DB Change
- [ ] Schema edit: <file>
- [ ] rtk bun run db:generate
- [ ] rtk bun run db:migrate

### OpenAPI
- [ ] rtk bun run openapi:generate
- [ ] Verify diff — new operation present

### Tests
- Unit: service happy path + each error case
- Integration (gated): route 201/404/422/401
```
