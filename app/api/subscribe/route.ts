import { createAdminClient, isValidEmail, normalizeEmail, normalizeSource, notifySubscriberCreated, safeErrorLog } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const email = normalizeEmail(typeof body?.email === 'string' ? body.email : '')

    if (!isValidEmail(email) || email.length > 254) {
      return Response.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    const source = normalizeSource(body?.source)
    const consentTimestamp = new Date().toISOString()
    const supabase = createAdminClient()
    const { data: existing, error: lookupError } = await supabase
      .from('subscribers')
      .select('id,email,status,source,consent_timestamp')
      .eq('email', email)
      .maybeSingle()

    if (lookupError) throw lookupError

    if (existing) {
      const { data: subscriber, error } = await supabase
        .from('subscribers')
        .update({ status: 'active', consent_given: true, consent_timestamp: consentTimestamp, source, unsubscribe_at: null })
        .eq('id', existing.id)
        .select('id,email,source,consent_timestamp')
        .single()

      if (error) throw error
      return Response.json({ subscribed: true, created: false, subscriber }, { headers: { 'cache-control': 'no-store' } })
    }

    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .insert({ email, status: 'active', consent_given: true, consent_timestamp: consentTimestamp, source })
      .select('id,email,source,consent_timestamp')
      .single()

    if (error) throw error
    await notifySubscriberCreated(subscriber)
    return Response.json({ subscribed: true, created: true }, { status: 201, headers: { 'cache-control': 'no-store' } })
  } catch (error) {
    safeErrorLog(error)
    return Response.json({ error: 'Unable to subscribe right now. Please try again.' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
