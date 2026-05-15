# portal-web

Central launcher UI for the platform. Lists the other apps (community, knowledge, language) and silently logs the user into each via hidden iframes that hit `/api/auth/silent` on each sibling, which forwards `prompt=none` to `auth-server`.

## Stack
- Next.js 16, React 19, Bun, Tailwind 4
- `better-auth` with `genericOAuth` against `auth-server` (provider id `auth-server`)

## Boundary
- Owns: launcher UI, the silent-SSO fan-out trigger, post-login UX.
- Does not own: identity (auth-server), per-app data (each `*-api`).
- For non-identity user data (usage stats, pinned apps, last-used), call `portal-api`.

## Notes
- This is NOT the Next.js you may know from training data — check `node_modules/next/dist/docs/` for current patterns before writing code.
- Port: 3009. OAuth client id: `portal-web`. Callback: `/api/auth/oauth2/callback/auth-server`.
