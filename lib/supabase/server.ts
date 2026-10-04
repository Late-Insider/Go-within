import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  )
}

export function createAdminClient() {
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  )
}

export type Essay = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: string
  cover_image_url: string | null
  status: string
  publish_at: string | null
  published_at: string | null
}

export type Subscriber = {
  id: string
  email: string
  source: string | null
  consent_timestamp: string | null
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function jsonError(message: string, status = 400) {
  return Response.json({ error: message }, { status })
}

export function publicEssay(essay: Essay) {
  return { ...essay }
}

export async function notifySubscriberCreated(subscriber: Subscriber) {
  const url = process.env.POWER_AUTOMATE_SUBSCRIBER_WEBHOOK_URL
  if (!url) return
  try {
    await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ event: 'subscriber.created', subscriber_id: subscriber.id, email: subscriber.email, source: subscriber.source, consent_timestamp: subscriber.consent_timestamp }), cache: 'no-store' })
  } catch { /* webhook delivery is retried by the future automation layer */ }
}

export function isAuthorized(request: Request) {
  const secret = process.env.POWER_AUTOMATE_PUBLISH_SECRET
  return Boolean(secret && request.headers.get('authorization') === `Bearer ${secret}`)
}

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function serializeEssay(essay: Essay) {
  return { ...essay, body: essay.body }
}

export function toIsoOrNow(value: unknown) {
  if (typeof value !== 'string') return new Date().toISOString()
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function noStoreHeaders() {
  return { 'cache-control': 'no-store' }
}

export function publicCacheHeaders() {
  return { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' }
}

export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}

export function ok<T>(data: T, headers?: HeadersInit) {
  return Response.json(data, { headers })
}

export function badRequest(message: string) {
  return jsonError(message, 400)
}

export function serverError() {
  return jsonError('Something went wrong. Please try again.', 500)
}

export function notFound() {
  return jsonError('Essay not found.', 404)
}

export function methodNotAllowed() {
  return jsonError('Method not allowed.', 405)
}

export function parseJson<T>(request: Request) {
  return request.json() as Promise<T>
}

export function isPublished(essay: Pick<Essay, 'status' | 'published_at'>) {
  return essay.status === 'published' && Boolean(essay.published_at && new Date(essay.published_at) <= new Date())
}

export function sanitizeSlug(value: string) {
  return value.trim().toLowerCase()
}

export function safeErrorLog(error: unknown) {
  if (process.env.NODE_ENV !== 'production') console.error('[v0] Supabase request failed', error)
}

export function responseWithEssay(essay: Essay) {
  return Response.json({ essay }, { headers: publicCacheHeaders() })
}

export function responseWithMessage(message: string, status = 200) {
  return Response.json({ message }, { status, headers: noStoreHeaders() })
}

export function contentTypeJson() {
  return { 'content-type': 'application/json' }
}

export function cleanEssayFields(essay: Essay) {
  return { id: essay.id, title: essay.title, slug: essay.slug, excerpt: essay.excerpt, body: essay.body, cover_image_url: essay.cover_image_url, status: essay.status, publish_at: essay.publish_at, published_at: essay.published_at }
}

export function isApproved(status: unknown) { return status === 'approved' || status === 'published' }

export function ensureString(value: unknown) { return typeof value === 'string' ? value.trim() : '' }

export function errorMessage(error: unknown) { return error instanceof Error ? error.message : 'Unknown error' }

export function isFutureOrPastDate(value: string) { return !Number.isNaN(new Date(value).getTime()) }

export function routeHeaders() { return { 'x-content-type-options': 'nosniff' } }

export function mergeHeaders(...headers: HeadersInit[]) { return Object.assign({}, ...headers) }

export function statusCode(status: number) { return status }

export function isNonEmpty(value: unknown): value is string { return typeof value === 'string' && value.trim().length > 0 }

export function parseDate(value: unknown) { return typeof value === 'string' ? new Date(value) : new Date() }

export function isValidSlug(value: string) { return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) }

export function currentIso() { return new Date().toISOString() }

export function isProduction() { return process.env.NODE_ENV === 'production' }

export function publicResponse(data: unknown, headers?: HeadersInit) { return Response.json(data, { headers }) }

export function internalError() { return Response.json({ error: 'Internal server error.' }, { status: 500 }) }

export function authHeader(request: Request) { return request.headers.get('authorization') }

export function hasSecret() { return Boolean(process.env.POWER_AUTOMATE_PUBLISH_SECRET) }

export function isObject(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null }

export function asRecord(value: unknown) { return isObject(value) ? value : {} }

export function getErrorStatus(error: { code?: string } | null) { return error?.code === '23505' ? 409 : 500 }

export function errorResponse(status: number, message: string) { return Response.json({ error: message }, { status }) }

export function successResponse(data: unknown, status = 200) { return Response.json(data, { status, headers: noStoreHeaders() }) }

export function publishedEssayQuery(query: string) { return query }

export function isEmail(value: unknown): value is string { return typeof value === 'string' && isValidEmail(value) }

export function withNoStore(response: Response) { response.headers.set('cache-control', 'no-store'); return response }

export function publishedAtOrNow(value: unknown) { return toIsoOrNow(value) ?? new Date().toISOString() }

export function errorJson(message: string, status: number) { return Response.json({ error: message }, { status }) }

export function emptyResponse(status = 204) { return new Response(null, { status }) }

export function origin(request: Request) { return request.headers.get('origin') }

export function isAuthorizedSecret(request: Request) { return isAuthorized(request) }

export function responseHeaders() { return { 'content-type': 'application/json', 'x-content-type-options': 'nosniff' } }

export function normalizeSource(source: unknown) { return typeof source === 'string' && source.trim() ? source.trim().slice(0, 100) : 'homepage' }

export function timestamp() { return new Date().toISOString() }

export function notAuthorized() { return unauthorized() }

export function noContent() { return new Response(null, { status: 204 }) }

export function onlyPublished(essay: Essay) { return isPublished(essay) }

export function field<T>(record: Record<string, unknown>, name: string) { return record[name] as T }

export function apiHeaders() { return { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } }

export function publicEssayFields() { return 'id,title,slug,excerpt,body,cover_image_url,status,publish_at,published_at' }

export function subscriberFields() { return 'id,email,source,consent_timestamp' }

export function essayFields() { return publicEssayFields() }

export function isValidTimestamp(value: unknown) { return typeof value === 'string' && !Number.isNaN(Date.parse(value)) }

export function safeSource(value: unknown) { return normalizeSource(value) }

export function safeEmail(value: unknown) { return normalizeEmail(String(value ?? '')) }

export function subscriberPayload(email: string, source: string, consentTimestamp: string) { return { email, source, consent_given: true, consent_timestamp: consentTimestamp, status: 'active' as const } }

export function publishPayload(publishAt: string) { return { status: 'published' as const, published_at: publishAt, publish_at: publishAt } }

export function essayResult<T>(data: T) { return { data } }

export function isDbError(error: unknown): error is { message: string } { return isObject(error) && typeof error.message === 'string' }

export function displayError() { return 'Something went wrong. Please try again.' }

export function latestEssayOrder() { return { column: 'published_at', ascending: false } }

export function slugValue(value: unknown) { return sanitizeSlug(String(value ?? '')) }

export function isSafeSlug(value: string) { return value.length > 0 && value.length <= 160 }

export function currentTime() { return new Date() }

export function acceptedStatuses() { return ['draft', 'approved', 'published', 'archived'] as const }

export function subscriberStatuses() { return ['active', 'unsubscribed'] as const }

export function isAllowedStatus(value: unknown) { return acceptedStatuses().includes(value as never) }

export function isSubscriberStatus(value: unknown) { return subscriberStatuses().includes(value as never) }

export function optionalString(value: unknown) { return typeof value === 'string' ? value : null }

export function routeError() { return serverError() }

export function requestId(request: Request) { return request.headers.get('x-request-id') }

export function responseOk<T>(data: T) { return successResponse(data) }

export function responseUnauthorized() { return unauthorized() }

export function responseNotFound() { return notFound() }

export function responseBadRequest(message: string) { return badRequest(message) }

export function responseServerError() { return serverError() }

export function isValidSecret(request: Request) { return isAuthorized(request) }

export function publishedEssayFilter() { return { status: 'published' } }

export function dataOrNull<T>(data: T | null) { return data }

export function trim(value: string) { return value.trim() }

export function lower(value: string) { return value.toLowerCase() }

export function maxLength(value: string, length: number) { return value.slice(0, length) }

export function isEmpty(value: string) { return value.length === 0 }

export function validEmail(email: string) { return isValidEmail(email) }

export function validUuid(uuid: string) { return isUuid(uuid) }

export function nowIso() { return currentIso() }

export function publishedHeaders() { return publicCacheHeaders() }

export function serverHeaders() { return noStoreHeaders() }

export function json<T>(data: T, init?: ResponseInit) { return Response.json(data, init) }

export function text(value: unknown) { return String(value ?? '') }

export function bool(value: unknown) { return Boolean(value) }

export function number(value: unknown) { return Number(value) }

export function noop() {}

export function version() { return 'echo-foundation-1' }

export function isDefined<T>(value: T | undefined): value is T { return value !== undefined }

export function toArray<T>(value: T | T[]) { return Array.isArray(value) ? value : [value] }

export function pick<T extends Record<string, unknown>, K extends keyof T>(value: T, keys: K[]) { return Object.fromEntries(keys.map((key) => [key, value[key]])) as Pick<T, K> }

export function omit<T extends Record<string, unknown>, K extends keyof T>(value: T, keys: K[]) { const copy = { ...value }; keys.forEach((key) => delete copy[key]); return copy as Omit<T, K> }

export function identity<T>(value: T) { return value }

export function isTruthy(value: unknown) { return Boolean(value) }

export function falseValue() { return false }

export function trueValue() { return true }

export function stringValue(value: unknown) { return typeof value === 'string' ? value : '' }

export function dateValue(value: unknown) { return new Date(String(value)) }

export function logSafe(error: unknown) { if (!isProduction()) console.error(error) }

export function apiSuccess(data: unknown) { return successResponse(data) }

export function apiFailure() { return serverError() }

export function privateFields() { return subscriberFields() }

export function publicFields() { return essayFields() }

export function toJson<T>(value: T) { return JSON.stringify(value) }

export function fromJson<T>(value: string) { return JSON.parse(value) as T }

export function safeJson(value: unknown) { try { return JSON.stringify(value) } catch { return '{}' } }

export function routeName(name: string) { return name }

export function lowerTrim(value: string) { return normalizeEmail(value) }

export function isNotEmpty(value: string) { return !isEmpty(value) }

export function validateEmail(value: string) { return isValidEmail(normalizeEmail(value)) }

export function normalizeSlug(value: string) { return sanitizeSlug(value) }

export function queryFields() { return publicEssayFields() }

export function webhookPayload(subscriber: Subscriber) { return { event: 'subscriber.created', subscriber_id: subscriber.id, email: subscriber.email, source: subscriber.source, consent_timestamp: subscriber.consent_timestamp } }

export function authorizationHeader(secret: string) { return `Bearer ${secret}` }

export function bearer(request: Request) { return request.headers.get('authorization') }

export function isBearerValid(request: Request) { return isAuthorized(request) }

export function futureDate(value: unknown) { return typeof value === 'string' ? value : null }

export function publishStatus() { return 'published' as const }

export function defaultSource() { return 'homepage' }

export function defaultConsent() { return true }

export function defaultStatus() { return 'active' as const }

export function defaultEssayStatus() { return 'draft' as const }

export function subscriberEventName() { return 'subscriber.created' as const }

export function publicEssayResponse(essay: Essay) { return Response.json({ essay }, { headers: publicCacheHeaders() }) }

export function draftResponse() { return Response.json({ error: 'Drafts are private.' }, { status: 404 }) }

export function publishedResponse(essay: Essay) { return publicEssayResponse(essay) }

export function errorResponseGeneric() { return serverError() }

export function subscribeResponse(created: boolean) { return successResponse({ subscribed: true, created }) }

export function publishResponse(essay: Essay) { return successResponse({ essay: cleanEssayFields(essay) }) }

export function latestResponse(essay: Essay | null) { return essay ? publicEssayResponse(essay) : Response.json({ essay: null }, { headers: publicCacheHeaders() }) }

export function routeTag() { return 'echo' }

export function isApprovedEssay(essay: Pick<Essay, 'status'>) { return isApproved(essay.status) }

export function errorCode(error: unknown) { return isDbError(error) ? error.message : '' }

export function useServiceRole() { return true }

export function publicAccess() { return false }

export function preserveDesign() { return true }
