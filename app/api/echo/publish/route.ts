import { createAdminClient, isAuthorized, publicEssayFields, safeErrorLog } from '@/lib/supabase/server'

export async function POST(request: Request) {
  if (!isAuthorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json().catch(() => null)
    const id = typeof body?.id === 'string' ? body.id : null
    const slug = typeof body?.slug === 'string' ? body.slug.trim().toLowerCase() : null
    if (!id && !slug) return Response.json({ error: 'An essay id or slug is required.' }, { status: 400 })

    const publishedAt = typeof body?.published_at === 'string' && !Number.isNaN(Date.parse(body.published_at))
      ? new Date(body.published_at).toISOString()
      : new Date().toISOString()
    const supabase = createAdminClient()
    const query = supabase.from('essays').update({ status: 'published', published_at: publishedAt, publish_at: publishedAt }).select(publicEssayFields()).limit(1)
    const { data, error } = id ? await query.eq('id', id) : await query.eq('slug', slug)
    if (error) throw error
    const essay = data?.[0]
    if (!essay) return Response.json({ error: 'Essay not found.' }, { status: 404 })
    return Response.json({ essay }, { headers: { 'cache-control': 'no-store' } })
  } catch (error) {
    safeErrorLog(error)
    return Response.json({ error: 'Unable to publish the essay.' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
