import { createAdminClient, noStoreHeaders, verifyUnsubscribeToken } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const subscriberId = verifyUnsubscribeToken(typeof body?.token === 'string' ? body.token : '')
  if (!subscriberId) return Response.json({ error: 'Invalid or expired unsubscribe link.' }, { status: 400, headers: noStoreHeaders() })

  const { error } = await createAdminClient().from('subscribers').update({ status: 'unsubscribed', unsubscribe_at: new Date().toISOString() }).eq('id', subscriberId)
  if (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[v0] Unsubscribe failed', error)
    return Response.json({ error: 'Unable to unsubscribe right now.' }, { status: 500, headers: noStoreHeaders() })
  }
  return Response.json({ unsubscribed: true }, { headers: noStoreHeaders() })
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
