# GoodHand

Clickable front end prototype of GoodHand, an AI powered headhunting service for skilled trades.
First market: licensed electricians in Texas, hired by electrical subcontractors building data
centers.

Live: https://romygreenwald.github.io/goodhand/

Every push to `main` rebuilds and redeploys it through GitHub Actions
(`.github/workflows/deploy.yml`).

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (http://localhost:5181 by default).

## What this is

React, TypeScript, Tailwind and shadcn style components built on Radix. Front end only. All data
is mock data held in React state, labelled "Sample data" in a banner on every screen. Nothing is
emailed, scraped, stored or charged. AI actions are simulated with short loading states and
pre written results.

The prototype runs off a fixed "today" of November 2, 2026 (`src/lib/format.ts`) so the sample
data does not drift. Reload the page to reset any changes you make.

## Screens

| Route | Screen |
| --- | --- |
| `/` | Home dashboard, summary cards and "Needs your attention" |
| `/request` | Request a hire, the core flow, with live fee estimate and simulated sourcing |
| `/roles` | Roles list, table on desktop and cards on a phone |
| `/roles/:roleId` | Role detail, funnel strip and candidate board |
| `/candidates` | Every candidate across roles |
| `/outreach` | The job offer emails, editable, with a locked footer |
| `/billing` | Hires, fees, guarantee countdowns and payment options |
| `/settings` | Company profile, team and contract terms |

The candidate profile opens as a right hand drawer on desktop and full screen on a phone.

## How the numbers work

Every count is derived from one candidate list, so moving someone between stages updates the
home cards, the roles table, the funnel and the board at the same time. Marking a candidate
hired creates a billing row; marking them started sends the invoice.

First year pay is the hourly rate times 2,080 hours. The placement fee is 15 to 20 percent of
that, due when the hire starts. The estimate on the request form uses the low end of the pay
range and updates as you type.

## Layout

| File | What is in it |
| --- | --- |
| `src/data/types.ts` | Domain types, stages, license types, requirement lists |
| `src/data/mock.ts` | The sample company, 6 roles, 42 candidates, 3 hires, email templates |
| `src/store/AppStore.tsx` | All app state and the derived counts |
| `src/components/ui/` | shadcn style primitives |
| `src/components/` | Shell, navigation, candidate card and candidate drawer |
| `src/screens/` | One file per screen |

## Notes on the sample data

Every person, license number, phone number and company is invented. License numbers use a
`TX-XX-NNNNNN` shape that no real Texas licence uses, phone numbers sit in the reserved 555-01xx
range and email addresses use `example.com`.
