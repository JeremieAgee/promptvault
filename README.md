# PromptVault

A general-purpose app for creating, organizing, and sharing AI prompts.
Stack: React + TypeScript + Vite, Tailwind CSS, Supabase (Postgres, Auth, RLS). Deploys to Vercel.

**Status:** Phase 1 (foundation) in progress. Prompts, organization, and sharing come in later phases.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your Supabase project URL and publishable (anon) key.
3. `npm run dev`

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public key, safe for browsers because RLS protects the data |

Never put the service-role key in any `VITE_` variable.

## Database

Schema lives in `supabase/migrations/` and is applied in filename order. The migrations were applied to the
`promptvault` Supabase project (ref `toaqkwrtxbxmoxrywdjk`) through the Supabase MCP connector, which records its
own migration versions, so the timestamps in these filenames may differ from the project's migration history.
To rebuild elsewhere: `supabase link --project-ref <ref>` then `supabase db push`.

Every table has Row Level Security enabled with owner-only policies, and the `anon` role has no table access.

## Supabase Auth settings (set in the dashboard)

- **Authentication → URL Configuration:** set Site URL to your deployed origin and add
  `http://localhost:5173/reset-password` and `<your-origin>/reset-password` to Redirect URLs.
- Email confirmation is a project setting; the app handles both on and off.

## Deployment (Vercel)

Import the repo, set the two env vars above, and deploy. `vercel.json` rewrites all routes to `index.html` for client routing.

## Phase 1 test results

- Cross-user RLS test (two users, run in a rolled-back transaction): passed. User B could not read, update, delete,
  tag, add to collections, share, or steal anything of User A's, and anon reads were denied.
- Supabase security advisor: no findings.
- Frontend: written but **not yet installed, type-checked, or run** (no network in the authoring sandbox).
