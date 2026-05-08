TODO
====

Tests
-----

This project has no automated tests. The original CareerFoundry-era codebase shipped with none, and nothing existed to migrate.

If/when tests are added, the modern stack would be:

-   `supertest` for HTTP-level integration tests against the Express app
-   `mongodb-memory-server` for an in-process Mongo instance, so tests don't depend on Atlas or a local mongod
-   `jest` or `vitest` as the runner

Suggested first targets:

-   Auth flow: register → login → use JWT to read `/movies`
-   `DEMO_MODE` smoke: every read endpoint returns mock data, every write returns `503`
-   Validation: `POST /users` rejects bad usernames / emails
-   Mongoose query shape: confirm `findOneAndUpdate({ new: true })` returns the updated doc (regression guard against the v7 callback-API break that this project recently survived)
