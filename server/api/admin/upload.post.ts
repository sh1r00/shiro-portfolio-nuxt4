import { requireAdmin } from '../../utils/requireAdmin'
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import type { H3Event } from 'h3'
import { getRequestEnvironmentValue, isCloudflareRuntime } from '../../utils/runtime-env'

const MAX_SIZE = 2 * 1024 * 1024 // 2MB

// Magic-number validation — reject polyglots/renamed executables, not just the
// client-supplied MIME type. SVG is intentionally NOT allowed (inline-script XSS).
function detectImageType(buf: Buffer): 'png' | 'jpg' | 'webp' | 'gif' | null {
  if (buf.length >= 4 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png'
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg'
  if (buf.length >= 12 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'webp'
  if (buf.length >= 6 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38 && (buf[4] === 0x37 || buf[4] === 0x39)) return 'gif'
  return null
}

const EXT: Record<string, string> = { png: '.png', jpg: '.jpg', webp: '.webp', gif: '.gif' }

// ─── R2 (Cloudflare, S3-compatible) ─────────────────────────────────────────
// Durable production uploads on Netlify (serverless, read-only FS). Lazy singleton.
interface R2Config { bucket: string; publicUrl: string; client: S3Client }
let r2: R2Config | null = null

function r2Configured(event: H3Event): boolean {
  return !!(
    getRequestEnvironmentValue(event, 'R2_ACCOUNT_ID')
    && getRequestEnvironmentValue(event, 'R2_ACCESS_KEY_ID')
    && getRequestEnvironmentValue(event, 'R2_SECRET_ACCESS_KEY')
    && getRequestEnvironmentValue(event, 'R2_BUCKET')
    && getRequestEnvironmentValue(event, 'R2_PUBLIC_URL')
  )
}

function r2Client(event: H3Event): R2Config {
  if (!r2) {
    const accountId = getRequestEnvironmentValue(event, 'R2_ACCOUNT_ID')
    const accessKeyId = getRequestEnvironmentValue(event, 'R2_ACCESS_KEY_ID')
    const secretAccessKey = getRequestEnvironmentValue(event, 'R2_SECRET_ACCESS_KEY')
    const bucket = getRequestEnvironmentValue(event, 'R2_BUCKET')
    const publicUrl = getRequestEnvironmentValue(event, 'R2_PUBLIC_URL')
    if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
      throw createError({ statusCode: 503, statusMessage: 'Cloudflare R2 upload storage is not configured.' })
    }

    r2 = {
      bucket,
      publicUrl: publicUrl.replace(/\/+$/, ''),
      client: new S3Client({
        region: 'auto', // NOT a real region — required for R2
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true, // R2 requires path-style
      }),
    }
  }
  return r2
}

// Admin thumbnail upload. Production (R2 configured) → object storage → public URL;
// otherwise → local public/uploads/ (dev + persistent-disk hosts).
export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const parts = await readMultipartFormData(event)
  const file = parts?.find((p) => p.name === 'file' && p.filename)
  if (!file) throw createError({ statusCode: 400, statusMessage: 'No file uploaded (use field name "file")' })
  if (file.data.length > MAX_SIZE) throw createError({ statusCode: 413, statusMessage: 'Image too large (max 2MB)' })

  const kind = detectImageType(file.data)
  if (!kind) throw createError({ statusCode: 400, statusMessage: 'Invalid image — only png/jpg/webp/gif accepted' })

  const name = `${Date.now().toString(36)}-${randomBytes(4).toString('hex')}${EXT[kind]}`

  if (r2Configured(event)) {
    const cfg = r2Client(event)
    const key = `thumbnails/${name}`
    await cfg.client.send(new PutObjectCommand({ Bucket: cfg.bucket, Key: key, Body: file.data, ContentType: `image/${kind}` }))
    return { path: `${cfg.publicUrl}/${key}` }
  }

  if (isCloudflareRuntime(event)) {
    throw createError({ statusCode: 503, statusMessage: 'Cloudflare R2 upload storage is not configured.' })
  }

  const dir = resolve(process.cwd(), 'public', 'uploads')
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, name), file.data)
  return { path: `/uploads/${name}` }
})
