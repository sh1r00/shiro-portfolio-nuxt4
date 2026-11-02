import type { H3Event } from 'h3'

type CloudflareRequest = H3Event['req'] & {
  runtime?: {
    cloudflare?: {
      env?: Record<string, unknown>
    }
  }
}

export function getRequestEnvironmentValue(event: H3Event, name: string): string | undefined {
  const request = event.req as CloudflareRequest
  const value = request.runtime?.cloudflare?.env?.[name]
  return typeof value === 'string' ? value : process.env[name]
}

export function isCloudflareRuntime(event: H3Event): boolean {
  const request = event.req as CloudflareRequest
  return request.runtime?.cloudflare !== undefined
}
