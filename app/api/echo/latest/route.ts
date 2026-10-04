import { createAdminClient, publicEssayFields, safeErrorLog } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { data: essay, error } = await createAdminClient()
      .from('essays')
      .select(publicEssayFields())
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return Response.json({ essay: essay ?? null }, { headers: { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' } })
  } catch (error) {
    safeErrorLog(error)
    return Response.json({ error: 'Unable to load the latest essay.' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
