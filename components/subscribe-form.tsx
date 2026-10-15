'use client'

import { useState } from 'react'

export function SubscribeForm({ source = 'website' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('loading')
    try {
      const response = await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, source }) })
      const result = await response.json().catch(() => null)
      setState(response.ok ? (result?.alreadySubscribed ? 'duplicate' : 'success') : 'error')
      if (response.ok) setEmail('')
    } catch { setState('error') }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex w-full max-w-md items-center rounded-full border border-[#b98a68]/45 bg-[#0b1727]/60 p-1.5 backdrop-blur-md">
        <label htmlFor={`${source}-email`} className="sr-only">Email address</label>
        <input id={`${source}-email`} type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setState('idle') }} placeholder="Your email address" aria-describedby={`${source}-status`} className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-[#f3eadc] outline-none placeholder:text-[#d9cbbd]/50" />
        <button type="submit" disabled={state === 'loading'} className="rounded-full bg-[#c28b61] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#101a2b] transition hover:bg-[#edb17a] disabled:opacity-60">{state === 'loading' ? 'Joining' : 'Join Echo'}</button>
      </div>
      <p id={`${source}-status`} aria-live="polite" className="min-h-5 text-xs text-[#d9cbbd]/75">{state === 'success' && "You're on the list. Welcome to the practice."}{state === 'duplicate' && 'Already on the list. Welcome back to the practice.'}{state === 'error' && 'We could not subscribe you. Please check your email and try again.'}</p>
      <p className="text-xs leading-6 text-[#d9cbbd]/55">No spam. No selling your information. Just Echo. Unsubscribe anytime.</p>
    </form>
  )
}

export function PrivacyNote() {
  return <div className="max-w-md border-t border-white/10 pt-5"><p className="text-[10px] uppercase tracking-[0.25em] text-[#c28b61]">Your Trust Matters.</p><p className="mt-3 text-xs leading-6 text-[#d9cbbd]/60">We don&apos;t sell your information or share it with third parties for their own marketing purposes. We use only the services necessary to operate Echo and deliver your subscription. Your inbox, your choice. Unsubscribe anytime.</p></div>
}

export function SubscriptionSection({ source = 'website' }: { source?: string }) {
  return <section className="border-t border-white/10 py-20"><p className="text-[10px] uppercase tracking-[0.3em] text-[#c28b61]">Stay Near the Story</p><h2 className="mt-5 font-serif text-4xl font-light italic tracking-tight text-[#f3eadc]">Receive new Echoes as they unfold.</h2><p className="mt-4 max-w-lg text-sm leading-7 text-[#d9cbbd]/65">Original writing, unexpected perspectives, and invitations to return.</p><div className="mt-8"><SubscribeForm source={source} /></div><div className="mt-8"><PrivacyNote /></div></section>
}

