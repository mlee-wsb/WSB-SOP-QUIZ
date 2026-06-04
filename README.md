# Western Steel SOP Manual Quiz

A standalone web app version of the SOP Manual training quiz, ready to deploy to Vercel with a Supabase-backed leaderboard.

40 questions (20 multiple-choice + 20 true/false), randomized order each attempt.

---

## What's in this folder

| File / folder | What it is |
|---|---|
| `src/WesternSteelSopQuiz.jsx` | The main quiz component |
| `src/ScoreboardPage.jsx` | Standalone scoreboard at `/scoreboard` with sort options |
| `src/supabase.js` | Talks to Supabase for the leaderboard |
| `src/main.jsx`, `src/index.css` | React entry + Tailwind |
| `supabase/migration.sql` | SQL to create the **new** scoreboard table |
| `vercel.json` | SPA rewrite (needed so `/scoreboard` doesn't 404) |
| `.env.example` | Template for environment variables |

---

## Deployment guide

You've done this once before for the Project Spotlights quiz, so this should feel familiar. Three steps: Supabase → GitHub → Vercel.

### Step 1 — Add the new leaderboard table to Supabase

You can reuse the **same Supabase project** you set up for the Project Spotlights quiz. This quiz uses a different table (`sop_quiz_scores`) so the leaderboards stay independent.

1. Go to **supabase.com/dashboard** → your existing project (the one you set up for the Project Spotlights quiz)
2. Left sidebar → **SQL Editor** → **New query**
3. Open `supabase/migration.sql` from this folder, copy all of it, paste into the editor
4. Click **Run** (bottom right). If you get the "destructive operations" warning, click **Run this query** — it's safe (the script only creates new things)
5. You should see "Success. No rows returned." That means the new `sop_quiz_scores` table is created.

You don't need a new URL or anon key — they're the same as your existing project. Both quizzes share the same Supabase credentials but read from different tables.

### Step 2 — Push to GitHub

1. Go to **https://github.com/new**
2. Name it `WSB-SOP-QUIZ` (or whatever you prefer — just make it different from the existing `WSB-QUIZ`)
3. Set to Private if you'd like
4. Don't initialize with anything (no README, no .gitignore — we have those)
5. Click **Create repository**

Then push the files using GitHub Desktop:

1. Open GitHub Desktop
2. **File → Clone repository → URL** tab
3. Paste the URL of your new empty repo, e.g., `https://github.com/mlee-wsb/WSB-SOP-QUIZ`
4. Choose a local path (e.g., `Documents\GitHub\WSB-SOP-QUIZ`)
5. Click **Clone**
6. Open the cloned folder in File Explorer. It'll be empty.
7. Now copy **every file and folder** from this `wsb-sop-quiz` folder into that cloned folder. That includes:
   - `src/` folder (with all 4 files inside)
   - `supabase/` folder (with `migration.sql`)
   - `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`
   - `index.html`, `vercel.json`, `.env.example`, `.gitignore`, `README.md`
8. Switch back to GitHub Desktop. You should see all the files listed as changes.
9. Bottom left: commit message `Initial commit`
10. Click **Commit to main**
11. Click **Publish branch** (or **Push origin**)

### Step 3 — Deploy on Vercel

1. Go to **vercel.com/dashboard**
2. Click **Add New...** → **Project**
3. Find your new `WSB-SOP-QUIZ` repo and click **Import**
4. **Framework Preset**: should auto-detect as **Vite** (leave it)
5. Expand **Environment Variables** and add these two — **use the same values as your Project Spotlights quiz** (same Supabase project!):

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | Same as your existing quiz |
   | `VITE_SUPABASE_ANON_KEY` | Same as your existing quiz |

   (Quick way to get these: open your existing `wsb-quiz` Vercel project → Settings → Environment Variables → copy each value)

6. Click **Deploy**
7. Wait ~1 minute. When done, Vercel shows a URL like `wsb-sop-quiz.vercel.app`. That's your live SOP quiz.

---

## Using the SOP quiz

- **Take the quiz**: `https://your-url.vercel.app`
- **View scoreboard**: `https://your-url.vercel.app/scoreboard`

### The three scoreboard views

The scoreboard page has three view modes:

1. **Top Score** (default) — each person's best percentage, ranked highest to lowest. Same as what shows after the quiz.
2. **Most Recent** — every attempt, newest first. Useful for seeing who just took it.
3. **By Person** — every attempt, grouped alphabetically by name. Useful for seeing one specific person's history of attempts.

### What's different from the Project Spotlights quiz

- **No "How Western Steel Added Value" content** after each question. You just see "Correct" or "Incorrect" and move on.
- **Mix of question types**: multiple choice and true/false. The label above each question tells you which.
- **No random sampling** — every attempt sees all 40 questions in randomized order (since the bank is small enough). Order changes each attempt for retake variety.
- **Three sort modes** on the scoreboard page instead of two.

---

## Updating questions later

To change a question, fix a typo, or change the answer key:

1. Edit `src/WesternSteelSopQuiz.jsx` in your local folder. Search for the question text. Each question is a block like:
   ```jsx
   {
     type: "mc",
     prompt: "What system is the source of truth for pre-sale activity?",
     options: ["Shared Drive", "Zoho CRM", "Zoho Creator", "Email inbox"],
     correct: 1,    // 0=A, 1=B, 2=C, 3=D
   },
   ```
2. Change what you need. The `correct` field is the **index** of the right answer (0=first option, 1=second, etc.).
3. Save, commit in GitHub Desktop, push.

Vercel auto-redeploys within a minute.

---

## Resetting the SOP scoreboard

Different table than the Project Spotlights quiz, so use:

```sql
delete from public.sop_quiz_scores;
```

(Run in Supabase SQL Editor. The Project Spotlights scoreboard, in `quiz_scores`, is untouched by this.)
