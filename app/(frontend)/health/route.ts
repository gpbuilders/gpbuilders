/**
 * Temporary runtime diagnostic.
 *
 * The admin and every API route return 500 on Amplify while the build
 * succeeds, and the hosting logs are not reachable from here. This reports
 * what the *runtime* can see so the cause is identified from the outside.
 *
 * Deliberately reports no secret values — only whether a name is set, its
 * length, and the first line of any error. Remove once the cause is known.
 */
export const dynamic = 'force-dynamic'

const EXPECTED = [
  'DATABASE_URI',
  'DATABASE_URI_DIRECT',
  'DATABASE_CA_CERT_VALUE',
  'DATABASE_CA_CERT',
  'PAYLOAD_SECRET',
  'NEXT_PUBLIC_SERVER_URL',
  'S3_BUCKET',
  'S3_ENDPOINT',
  'S3_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'S3_PUBLIC_URL',
  'S3_FORCE_PATH_STYLE',
]

// Values never leave the server; a connection string would expose the
// password and the certificate is 1.8KB of noise.
const describe = (name: string) => {
  const v = process.env[name]
  if (v === undefined) return 'unset'
  if (v === '') return 'empty'
  return `set (${v.length} chars)`
}

const firstLine = (e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e)
  // Strip anything resembling a connection string before it is returned.
  return msg.split('\n')[0].replace(/postgres(ql)?:\/\/[^\s]+/gi, '<connection-string>').slice(0, 300)
}

export async function GET() {
  const report: Record<string, unknown> = {
    node: process.version,
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd(),
    env: Object.fromEntries(EXPECTED.map((n) => [n, describe(n)])),
  }

  // Does an .env.production written during the build actually reach here?
  try {
    const { existsSync } = await import('fs')
    report.envProductionFilePresent = existsSync(process.cwd() + '/.env.production')
  } catch (e) {
    report.envProductionFilePresent = `check failed: ${firstLine(e)}`
  }

  // sharp is a native binary and a classic casualty of serverless bundling.
  try {
    const sharp = (await import('sharp')).default
    report.sharp = `ok (${sharp.versions?.vips ?? 'unknown vips'})`
  } catch (e) {
    report.sharp = `FAILED: ${firstLine(e)}`
  }

  // The most likely failure: the config throws on a missing certificate or
  // bucket, which is exactly what the guards are meant to do.
  try {
    const config = (await import('@payload-config')).default
    await config
    report.payloadConfig = 'ok'
  } catch (e) {
    report.payloadConfig = `FAILED: ${firstLine(e)}`
  }

  // And finally the database itself.
  try {
    const config = (await import('@payload-config')).default
    const { getPayload } = await import('payload')
    const payload = await getPayload({ config })
    const { totalDocs } = await payload.count({ collection: 'projects' })
    report.database = `ok (${totalDocs} projects)`
  } catch (e) {
    report.database = `FAILED: ${firstLine(e)}`
  }

  return Response.json(report, {
    headers: { 'cache-control': 'no-store' },
  })
}
