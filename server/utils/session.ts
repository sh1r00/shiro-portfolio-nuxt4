// Single source of truth for the admin session secret.
// `useRuntimeConfig()` is resolved before Nitro plugins run, so the manual `.env`
// loader in init-db may set `process.env` without `useRuntimeConfig()` seeing it —
// read `process.env` first (host env / Netlify env wins).
export function getAdminSecret(): string {
  return process.env.NUXT_ADMIN_SECRET || (useRuntimeConfig().adminSecret as string)
}

// Shared session helper — one place to enforce the cookie security flags.
// Stateless signed-cookie session (h3 `useSession`) — no server store, so it works
// on serverless (Netlify Functions). Named `getAdminSession` to avoid colliding with
// h3's auto-imported `getSession`.
export function getAdminSession(event: any) {
  return useSession(event, {
    password: getAdminSecret(),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  })
}
