# Contributing

Thanks for your interest in improving Everyday Dental. Please read the [development guide](docs/DEVELOPMENT.md) and [architecture](docs/ARCHITECTURE.md) before making changes.

## Workflow

1. **Open an issue first** for anything beyond a small fix, describing the problem and the expected behavior.
2. **Branch** from `master` with a short descriptive name (`fix/booking-form-focus`, `docs/api-errors`).
3. **Write the test first** when fixing a bug, or define acceptance criteria for a feature.
4. **Keep changes focused.** One concern per pull request; unrelated cleanup goes in its own PR.
5. **Run the checks:** `npm run check`, and `npm run test:browser` for UI changes.
6. **Update the docs** affected by your change, and add an entry to the [changelog](CHANGELOG.md).
7. **Open a pull request** explaining what changed, why, and how you tested it.

## Guidelines

- Use sample data only, in code, tests, screenshots and issues.
- Keep settings in the configuration files listed in the [development guide](docs/DEVELOPMENT.md#configuration) and secrets out of Git.
- Follow the [design system](DESIGN.md) and the bilingual text convention.
- Do not remove the clinical backend guard or enable payments, messaging or intake in a contribution; those require the [clinical release](docs/CLINICAL-RELEASE.md) process.
- Never force-push to shared branches.

Report security issues privately as described in [SECURITY.md](SECURITY.md).
