# Business Associate Agreement (BAA) Checklist

**Everyday Dental Surgery & Implant Center**
**HIPAA: 164.308(b), 164.314(a)**
**Version:** 1.0 | **Last Updated:** 2026-04-02

---

## Required BAAs

| Vendor | Service | PHI Processed | BAA Status | Signed Date | Review Date |
|--------|---------|---------------|------------|-------------|-------------|
| Supabase | Database, Auth, Edge Functions | Yes | REQUIRED | ___________ | Annual |
| Resend | Email notifications | No (email addr only) | RECOMMENDED | ___________ | Annual |
| Cloudflare | CDN/Static hosting | No | Not required | N/A | N/A |
| Google | Fonts, Maps | No | Not required | N/A | N/A |

## BAA Must Include

Per HIPAA 164.314(a)(2)(i), each BAA must address:

- [x] Permitted and required uses/disclosures of PHI
- [x] Business Associate will not use or disclose PHI other than as permitted
- [x] Appropriate safeguards to prevent unauthorized use/disclosure
- [x] Business Associate will report any unauthorized use/disclosure
- [x] Business Associate will ensure subcontractors agree to same restrictions
- [x] Business Associate will make PHI available to individuals (Right of Access)
- [x] Business Associate will make PHI available for amendment
- [x] Business Associate will provide accounting of disclosures
- [x] Business Associate will make practices available to HHS for compliance
- [x] Business Associate will return or destroy PHI at termination
- [x] Authorized termination if Business Associate violates agreement

## Annual Review Process

1. **Q1 each year:** Review all active BAAs
2. Verify vendor still meets security requirements
3. Check for changes in vendor terms of service
4. Confirm BAA covers current data processing scope
5. Update signed BAA if terms have changed
6. Document review in this checklist

## BAA Storage

All signed BAAs are stored in `docs/baa/` directory:
- Digital copies: PDF scans in this directory
- Physical copies: Clinic secure filing cabinet
- Access: Clinic Administrator and Security Officer only

## Vendor Incident Notification

Per BAA terms, vendors must notify us of breaches involving our data:
- Within 24-72 hours of discovery (per agreement)
- Include: nature of breach, data involved, mitigation steps
- Clinic must then follow Incident Response Plan
