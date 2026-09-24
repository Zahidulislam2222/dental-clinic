# Historical source-pattern scanner

This directory contains a JavaScript pattern scanner, control registry, historical JSON report and [progress summary](PROGRESS.md). Its output counts source patterns; it cannot determine legal compliance, clinical safety, deployed control behavior or security certification.

The committed audit-report.json is dated 2026-04-03. Its complianceScore field is a historical schema label, not a current compliance percentage. It predates the synthetic release and must not appear as a badge or production acceptance result.

Commands in package.json include audit:compliance, audit:json, audit:ci and category filters. Inspect audit.js before running report-writing modes so historical evidence is not overwritten accidentally. Prefer current [verification](../docs/VERIFICATION.md), real backend tests and [clinical gates](../docs/CLINICAL-RELEASE.md) for decisions.

A future replacement should map each control to implementation, test, operator evidence, applicability, owner and review date; retain historical results with explicit scope. Passing a regex check must never close an authorization or legal blocker.
