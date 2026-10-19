# Governor campaign site

Multi-page React site (Home, Achievements, Vision, News & Gallery, Contact) with a
hidden admin dashboard at `/admin`. No donations or payments.

- Achievements are stored once. The **Achievements page and the Home carousel read the same list**, so adding or editing one in the dashboard updates both.
- Without Firebase the site shows sample `[placeholder]` content, so you can preview everything first.

```bash
npm install
cp .env.example .env     # then fill it in (step 1)
npm run dev              # http://localhost:5173
npm run build            # output in dist/
```

## 1. Connect Firebase (one time, free plan is enough)

1. Go to https://console.firebase.google.com, **Add project**.
2. **Build > Firestore Database > Create database** (production mode, any region).
3. **Build > Authentication > Get started > Email/Password > Enable**.
4. **Project settings > Your apps > Web (`</>`)**, register an app, and copy `apiKey`, `authDomain`, `projectId`, `appId` into `.env` (`VITE_FIREBASE_...`).
5. **Firestore > Rules**: paste the contents of `firestore.rules` and **Publish**. This is what keeps the public out of the dashboard; do not skip it.
6. **Authentication > Users > Add user**: create the admin's email and password. Copy that user's **User UID**.
7. **Firestore > Start collection** named `admins`. Use the **UID as the Document ID**, add any one field (for example `email` = the admin's email). Repeat for each extra administrator.
8. In `.env` also set `VITE_SITE_URL`, `VITE_CANDIDATE_NAME`, `VITE_COUNTY` (used for Google and link previews).

Then open `/admin`, sign in, and use **Load sample placeholders** or add real content.

## 2. Publish

Any static host works. Two requirements: `/admin` must serve `admin/index.html` (already built), and unknown paths should show `404.html`.
With Firebase Hosting: `npm i -g firebase-tools`, `firebase login`, `firebase init hosting` (keep `dist` and the existing `firebase.json`), `npm run build`, `firebase deploy`.
Firebase Authentication also needs your live domain added under **Authentication > Settings > Authorized domains**.

## What the dashboard edits

| Screen | Controls |
|---|---|
| Achievements | Add, edit, delete, reorder (top item shows first on Home), photo. Home shows the first 9 |
| Site pages | Name, county, hero sentence, portrait, headline numbers, About, manifesto priorities, first 100 days, pledge, contact and social links |
| News, Events, Gallery | Posts, dated events (with Add to calendar), photos |
| Messages | Everything sent through the Contact form; reply, mark read, delete |

## Notes

- **Photos** are shrunk in the browser (about 150 KB) and stored in the database, so no paid Firebase Storage is needed. Large galleries can be moved to Storage later.
- **Security**: only users listed in `admins` can write; the contact form can only create size-limited messages. `/admin` is not linked anywhere, is `noindex`, and is blocked in `robots.txt`. Use a strong password.
- **Contact email**: messages always land in the dashboard. To also get an email, create a Formspree form and set `VITE_FORMSPREE_ID`.
- Sample content lives in `src/data/defaults.js`; colours and fonts in `src/styles/global.css` (`:root`).
