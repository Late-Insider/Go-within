import { createAdminClient, publicEssayFields, safeErrorLog } from '@/lib/supabase/server'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const { data: essay, error } = await createAdminClient()
      .from('essays')
      .select(publicEssayFields())
      .eq('slug', slug.trim().toLowerCase())
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .maybeSingle()

    if (error) throw error
    if (!essay) return Response.json({ error: 'Essay not found.' }, { status: 404 })
    return Response.json({ essay }, { headers: { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' } })
  } catch (error) {
    safeErrorLog(error)
    return Response.json({ error: 'Unable to load this essay.' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
