# Touheed's Local Verification Checklist (Master Copy)

Use this checklist to verify the **LiveBaz Platform** locally before delivering to the CTO.

---

## 🟢 Phase 1: Real-Time Data & API Verification

**Goal:** Confirm the new direct API-Sports connection is pushing live data correctly.

- [ ] **Action:** Go to [http://localhost:4005/admin/dashboard](http://localhost:4005/admin/dashboard).
- [ ] **Action:** Click the green **"📡 Sync Live Scores (API-Sports)"** button.
- [ ] **Verification:**
  - [ ] Does a success message appear showing "Updated Items"?
  - [ ] Go to [http://localhost:4005/en](http://localhost:4005/en). Do active matches show current scores?
  - [ ] Click a live match. Does the **minute display** (e.g., 65') appear next to the "LIVE" badge?

---

## 🟢 Phase 2: Multilingual & RTL Audit

**Goal:** Ensure the visual integrity of Persian and Arabic layouts.

- [ ] **Action:** Navigate to [http://localhost:4005/fa](http://localhost:4005/fa) (Persian) and [http://localhost:4005/ar](http://localhost:4005/ar) (Arabic).
- [ ] **Verification:**
  - [ ] **Logo Positioning:** Is the logo correctly aligned to the RIGHT (RTL mode)?
  - [ ] **Text Flow:** Do sentences read from right-to-left without overlapping?
  - [ ] **Search Bar:** Does the search bar move to the left side in RTL?
  - [ ] **Match Cards:** Are localized team names (e.g., منچستر یونایتد) showing correctly?

---

## 🟢 Phase 3: Content Management (Admin)

**Goal:** Confirm you can manage articles and leagues without technical errors.

- [ ] **Action:** Go to [Admin Articles](http://localhost:4005/admin/articles) and click "Create New".
- [ ] **Verification:**
  - [ ] **Rich Text:** Can you bold, italicize, and add links in the TipTap editor?
  - [ ] **Image Upload:** Upload a test image. Does it preview correctly (Cloudinary test)?
  - [ ] **Localization:** Create a Persian version of the article. Does it appear only on the `/fa/blog` page?

---

## 🟢 Phase 4: SEO & Technical Health

**Goal:** Confirm production readiness.

- [ ] **Action:** View the Page Source (Right-click > View Page Source) on a match detail page.
- [ ] **Verification:**
  - [ ] Is the `<title>` localized? (e.g., "پیش‌بینی مسابقه" instead of "Match Prediction").
  - [ ] Check the [robots.txt](http://localhost:4005/robots.txt) and [sitemap.xml](http://localhost:4005/sitemap.xml). Do they load without errors?

---

## 🏆 Final Delivery Confirmation

If all boxes are checked:

1. Open **`FINAL_HANDOVER_TO_CTO.md`**.
2. Send the file to your CTO.
3. Deploy the code from GitHub to Vercel (I have already fixed the environment variables and build scripts).

**Everything is ready!**
