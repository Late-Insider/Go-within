import {
  createAdminClient,
  isValidSlug,
  safeErrorLog,
} from '@/lib/supabase/server'

const essayFields = 'id,title,slug,excerpt,body,cover_image_url,status,publish_at,published_at'

type IngestPayload = {
  title?: unknown
  slug?: unknown
  excerpt?: unknown
  body?: unknown
  publish_at?: unknown
}

function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

function normalizeSlug(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim().toLowerCase()
}

function parsePublishAt(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  if (typeof value !== 'string') return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export async function POST(request: Request) {
  const secret = process.env.POWER_AUTOMATE_INGEST_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return unauthorized()
  }

  try {
    const payload = (await request.json()) as IngestPayload
    const title = typeof payload.title === 'string' ? payload.title.trim() : ''
    const body = typeof payload.body === 'string' ? payload.body.trim() : ''
    const slug = normalizeSlug(payload.slug)
    const excerpt = typeof payload.excerpt === 'string' ? payload.excerpt.trim() || null : null
    const publishAt = parsePublishAt(payload.publish_at)

    if (!title || !body || !slug || !isValidSlug(slug) || slug.length > 200) {
      return Response.json(
        { error: 'title, body, and a valid slug are required.' },
        { status: 400 },
      )
    }

    if (publishAt === undefined) {
      return Response.json({ error: 'publish_at must be a valid date or null.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data: existing, error: existingError } = await supabase
      .from('essays')
      .select(essayFields)
      .eq('slug', slug)
      .limit(1)

    if (existingError) throw existingError

    if (existing?.[0]) {
      return Response.json(
        { already_exists: true, message: 'An essay with this slug already exists.', essay: existing[0] },
        { status: 200, headers: { 'cache-control': 'no-store' } },
      )
    }

    const { data: essay, error: insertError } = await supabase
      .from('essays')
      .insert({
        title,
        slug,
        excerpt,
        body,
        status: 'approved',
        publish_at: publishAt,
      })
      .select(essayFields)
      .single()

    if (insertError) {
      if (insertError.code === '23505') {
        const { data: duplicate, error: duplicateError } = await supabase
          .from('essays')
          .select(essayFields)
          .eq('slug', slug)
          .limit(1)

        if (duplicateError) throw duplicateError
        return Response.json(
          { already_exists: true, message: 'An essay with this slug already exists.', essay: duplicate?.[0] ?? null },
          { status: 200, headers: { 'cache-control': 'no-store' } },
        )
      }
      throw insertError
    }

    return Response.json({ already_exists: false, essay }, { status: 201, headers: { 'cache-control': 'no-store' } })
  } catch (error) {
    safeErrorLog(error)
    return Response.json({ error: 'Unable to ingest essay.' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

