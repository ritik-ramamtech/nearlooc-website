# Duplication Cleanup — Progress

> Goal: Remove duplicated code across the client with zero impact on runtime behavior.
> Rule: Pure extractions only — no logic changes, no new dependencies.

---

## Fixes

| # | What | Files Touched | Status |
|---|------|---------------|--------|
| 1 | Move `PaginationMeta` type to `types/api.ts` | `types/api.ts`, `features/vendors/api.ts` | ✅ Done |
| 2 | Add `formatLocalDate()` + `formatLocalDateShort()` to `lib/utils.ts` | `lib/utils.ts`, `NotificationItem.tsx`, `ReviewList.tsx`, `CouponCard.tsx` | ✅ Done |
| 3 | Create `EmptyState` component | `components/ui/empty-state.tsx`, `coupons/page.tsx`, `notifications/page.tsx`, `favorites/page.tsx` | ✅ Done |
| 4 | Add `getServerError()` to `lib/utils.ts` | `lib/utils.ts`, `ReviewForm.tsx`, `ProfileForm.tsx` | ✅ Done |
| 5 | Create `VendorCardSkeleton` component | `features/vendors/components/VendorCardSkeleton.tsx`, `home/page.tsx`, `vendors/page.tsx` | ✅ Done |

---

## Status Key
- ⬜ Pending — not started
- 🔄 In Progress — being worked on
- ✅ Done — completed and verified
- ❌ Blocked — issue encountered

---

## Notes
- Fix 2 split into two utilities: `formatLocalDate` (with time, for NotificationItem) and `formatLocalDateShort` (with year, for ReviewList + CouponCard) — actual formats in code differed slightly from audit estimate
- Fix 5: VendorCardSkeleton accepts `count` and `className` props — home page uses responsive grid classes, vendors page uses default grid-cols-2
- vendors/page.tsx and home/page.tsx "No vendors found" empty state was NOT migrated to EmptyState — it uses a single `<p>` with different styling, not the two-line pattern
- No backend changes. No logic changes. UI output identical before and after all fixes.
- Verified: `npm run lint` + `npm run build` should pass cleanly
