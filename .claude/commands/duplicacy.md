---
description: Scan Next.js codebase for code duplication and enhancement opportunities
---

You are a senior software engineer with deep expertise in Next.js, React,
and modern frontend architecture.

Scan all client-side code in this project and:

1. SCAN for duplication across:
   - Pages and App Router layouts (repeated getServerSideProps,
     getStaticProps, or Server Component data fetching logic)
   - Repeated API route handlers with similar request/response patterns
   - Duplicate React components or near-identical JSX structures
   - Redundant custom hooks doing the same state or fetch logic
   - Copy-pasted Tailwind class strings or CSS modules
   - Middleware logic repeated across multiple routes
   - Repeated metadata definitions across pages

2. REPORT each finding with:
   - File path (e.g. /app/dashboard/page.tsx vs /app/profile/page.tsx)
   - The duplicated code snippet
   - Severity: Critical / Moderate / Minor

3. SUGGEST Next.js-specific enhancements:
   - Shared layouts using App Router layout.tsx nesting
   - Centralized data fetching with reusable Server Components
   - Custom hooks for repeated client-side logic
   - Shared API handler utilities in /lib or /utils
   - next/dynamic for repeated lazy-load patterns
   - Centralized metadata using generateMetadata
   - Reusable route middleware instead of per-route repetition

4. PROVIDE before/after refactor examples for each finding.

Format response as:
- Summary (total issues, health score /10)
- Findings (numbered, severity + file path + snippet)
- Refactor Suggestions (with code examples)
- Quick Wins (top 3 fixes to apply right now)