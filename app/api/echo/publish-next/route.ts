import { createAdminClient, isAuthorized, publicEssayFields, safeErrorLog } from '@/lib/supabase/server'

export async function POST(request: Request) {
  if (!isAuthorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const supabase = createAdminClient()
    const now = new Date().toISOString()
    const readyFilter = `publish_at.is.null,publish_at.lte.${now}`

    const { data: candidates, error: selectError } = await supabase
      .from('essays')
      .select(`${publicEssayFields()},created_at`)
      .eq('status', 'approved')
      .or(readyFilter)
      .order('publish_at', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true })
      .limit(1)

    if (selectError) throw selectError

    const candidate = candidates?.[0]
    if (!candidate) {
      return Response.json({ error: 'No approved essay is ready to publish.' }, { status: 404 })
    }

    const { data: published, error: updateError } = await supabase
      .from('essays')
      .update({ status: 'published', published_at: now, publish_at: now })
      .eq('id', candidate.id)
      .eq('status', 'approved')
      .or(readyFilter)
      .select(publicEssayFields())
      .limit(1)

    if (updateError) throw updateError

    const essay = published?.[0]
    if (!essay) {
      return Response.json({ error: 'No approved essay is ready to publish.' }, { status: 404 })
    }

    return Response.json({ essay }, { headers: { 'cache-control': 'no-store' } })
  } catch (error) {
    safeErrorLog(error)
    return Response.json({ error: 'Unable to publish the next essay.' }, { status: 500 })
  }
}

export const runtime = 'nodejs'

export const dynamic = 'force-dynamic'
