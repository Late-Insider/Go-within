import { createAdminClient, isAuthorized, publicEssayFields, safeErrorLog, subscriberUnsubscribeUrl } from '@/lib/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gowithin.app'

function plainTextPreview(excerpt: unknown, body: unknown) {
  const preferred = typeof excerpt === 'string' ? excerpt : ''
  const source = preferred.trim() || (typeof body === 'string' ? body : '')
  const text = source
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()

  if (preferred.trim() && text.length >= 60 && text.length <= 240) return text
  if (text.length <= 520) return text
  const clipped = text.slice(0, 520)
  const boundary = clipped.lastIndexOf(' ')
  return `${clipped.slice(0, boundary > 300 ? boundary : 520).replace(/[.,;:!?-]+$/, '')}…`
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const essayId = new URL(request.url).searchParams.get('essay_id')
    if (!essayId) return Response.json({ error: 'essay_id is required.' }, { status: 400 })

    const supabase = createAdminClient()
    const { data: essay, error: essayError } = await supabase
      .from('essays')
      .select(publicEssayFields())
      .eq('id', essayId)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (essayError) throw essayError
    if (!essay) return Response.json({ error: 'No published essay is available.' }, { status: 404 })

    const { data: subscribers, error: subscriberError } = await supabase
      .from('subscribers')
      .select('id,email')
      .eq('status', 'active')
      .order('id', { ascending: true })

    if (subscriberError) throw subscriberError

    return Response.json({
      essay: {
        id: essay.id,
        title: essay.title,
        url: `${siteUrl}/${essay.slug}`,
        preview: plainTextPreview(essay.excerpt, essay.body),
      },
      recipients: (subscribers ?? []).map((subscriber) => ({
        id: subscriber.id,
        email: subscriber.email,
        unsubscribe_url: subscriberUnsubscribeUrl(subscriber),
        privacy_url: `${siteUrl}/privacy`,
      })),
      eligibility: {
        recheck_required_before_send: true,
        rule: 'subscribers.status = active',
      },
    }, { headers: { 'cache-control': 'no-store' } })
  } catch (error) {
    safeErrorLog(error)
    return Response.json({ error: 'Unable to prepare newsletter data.' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export { plainTextPreview }
