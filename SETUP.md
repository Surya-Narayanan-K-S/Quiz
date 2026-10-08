# Setup (about 10 minutes)

## 1. Google Sheet + script
1. Create a new Google Sheet (e.g. "EEE Quiz Data").
2. **Extensions → Apps Script**, delete the sample code, paste all of `Code.gs`, save.
3. Select the `setup` function and click **Run**. Allow permissions. This creates the `Questions` and `Results` tabs and sets the teacher password to `ChangeMe123`.
4. **Change the password:** Project Settings (gear icon) → Script Properties → edit `TEACHER_PASSWORD`.
5. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and copy the Web app URL.

## 2. Website
1. Open `index.html`, set `const API="<your Web app URL>"` (and optionally `SHEET_URL` to your sheet's link).
2. Upload the folder to Netlify, Vercel or GitHub Pages.
3. Add the custom domain `quiz.srecieee.org` in the host's dashboard, then add a `CNAME` record for `quiz` at your domain registrar pointing to the host's address.

## Using it
- Students open `https://quiz.srecieee.org`, enter name and register number, take the quiz. Each attempt becomes a row in the `Results` tab.
- Teachers click **Teacher**, sign in, then add/edit/delete questions (saved into the `Questions` tab) and view results, a score chart and CSV export. You can also edit the sheet directly.
- With `API` left empty the site runs in demo mode (browser storage, password `admin123`).

## Notes
- Questions, including correct answers, are sent to the student's browser, so a technical student could find them. That's fine for a classroom quiz; it is not exam-grade security.
- After changing `Code.gs`, use Deploy → Manage deployments → Edit → New version.
