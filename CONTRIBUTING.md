# Contributing

Read [architecture](docs/ARCHITECTURE.md), [configuration](docs/CONFIGURATION.md) and [clinical gates](docs/CLINICAL-RELEASE.md) before changing behavior. Use synthetic data only.

1. Define acceptance criteria or a failing reproduction before implementation.
2. Work on a focused branch; preserve unrelated local changes.
3. Keep environment values in central settings, content in data files and secrets outside Git.
4. Run [tests and security checks](docs/TESTING.md); report scope and any missing gates.
5. Exercise the real affected UI/API flow and obtain fresh-context review.
6. Update relevant READMEs, contracts, evidence and changelog together. Record escaped bugs in DEFECT-LOG.md.
7. Review the staged diff and publish with a normal push. Never force-push shared history to avoid a conflict.

Backend activation, production migrations, paid resources and real payments are separate approvals. A documentation contribution must not silently change licensing, privacy promises or measured capacity claims. Keep signed agreements, patient records, private notes and credentials out of issues and pull requests.

The manual CI workflow is intentional; check available Actions usage before running it. See [licensing](docs/LICENSING.md) before contributing or reusing material.
