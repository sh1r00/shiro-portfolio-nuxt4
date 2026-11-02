import type { H3Event } from 'h3'
import { getRequestEnvironmentValue } from './runtime-env'

// Single source of truth for the admin session secret.
export function getAdminSecret(event: H3Event): string {
  return getRequestEnvironmentValue(event, 'NUXT_ADMIN_SECRET')
    || (useRuntimeConfig(event).adminSecret as string)
}

// Shared session helper — one place to enforce the cookie security flags.
// Stateless signed-cookie session (h3 `useSession`) — no server store.
export function getAdminSession(event: H3Event) {
  return useSession(event, {
    password: getAdminSecret(event),
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: getRequestEnvironmentValue(event, 'NODE_ENV') === 'production',
    },
  })
}
