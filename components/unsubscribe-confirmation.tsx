'use client'

import { useState } from 'react'

export function UnsubscribeConfirmation({ token }: { token: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  async function confirm() {
    setState('loading')
    const response = await fetch('/api/unsubscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token }) })
    setState(response.ok ? 'success' : 'error')
  }
  if (state === 'success') return <div className="mt-12 border-t border-[#c28b61]/50 pt-8"><h2 className="font-serif text-3xl font-light italic">You&apos;ve Unsubscribed.</h2><p className="mt-4 text-base leading-8 text-[#d9cbbd]/75">You won&apos;t receive further Echo subscription emails.</p><p className="mt-2 text-base leading-8 text-[#d9cbbd]/75">The door remains open whenever you wish to return.</p></div>
  return <div className="mt-12"><button type="button" onClick={confirm} disabled={!token || state === 'loading'} className="border border-[#c28b61] px-6 py-4 text-[10px] uppercase tracking-[0.25em] text-[#edb17a] transition hover:bg-[#c28b61] hover:text-[#071525] disabled:cursor-not-allowed disabled:opacity-50">{state === 'loading' ? 'Unsubscribing' : 'Unsubscribe from Echo'}</button>{state === 'error' && <p className="mt-4 text-sm text-[#edb17a]" role="alert">This unsubscribe link is invalid or expired. Please use the latest link from your email.</p>}</div>
}
