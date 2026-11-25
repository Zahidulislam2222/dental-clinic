# Source pattern scanner

`audit.js` scans the source for code patterns associated with HIPAA, FHIR, SOC 2 and general security controls, and writes a report. `registry.json` is a separate reference map from each control to the files that implement it.

```bash
npm run audit:compliance          # summary
npm run audit:json                # JSON output
npm run audit:security            # one category; also audit:hipaa, audit:fhir, audit:soc2
```

**What the score means.** It counts matching code patterns. It does not measure legal compliance, security, clinical safety or runtime behavior, and it is not a certification. A passing pattern never closes a [clinical release](../docs/CLINICAL-RELEASE.md) blocker.

`audit-report.json` is a historical report from April 2026, kept for reference; its `complianceScore` field is a pattern-match ratio, and it cites policy file paths from before the documentation was reorganized. Every run overwrites this file, so restore it afterwards with `git checkout -- compliance/audit-report.json` unless you mean to replace it.

A future version should map each control to its implementation, test, owner and review date.
