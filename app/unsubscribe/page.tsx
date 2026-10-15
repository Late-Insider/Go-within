import type { Metadata } from 'next'
import Link from 'next/link'
import { NavigationDrawer } from '@/components/navigation-drawer'
import { UnsubscribeConfirmation } from '@/components/unsubscribe-confirmation'

export const metadata: Metadata = { title: 'Unsubscribe | GO WITHIN', robots: { index: false, follow: false } }

export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  return (
    <main className="min-h-svh bg-[#071525] text-[#f3eadc]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 sm:px-10 lg:px-16"><Link href="/" className="text-[11px] uppercase tracking-[0.34em]">GO WITHIN</Link><NavigationDrawer /></header>
      <section className="mx-auto max-w-2xl px-6 pb-24 pt-24 sm:px-10 lg:px-16">
        <p className="text-[10px] uppercase tracking-[0.42em] text-[#c28b61]">GO WITHIN / ECHO</p>
        <h1 className="mt-8 font-serif text-[clamp(3.5rem,9vw,6.5rem)] font-light italic leading-[.92] tracking-[-.06em]">Your Journey, Your Choice.</h1>
        <p className="mt-10 max-w-xl text-lg leading-8 text-[#d9cbbd]/75">Every invitation should leave room for a choice.</p>
        <p className="mt-4 max-w-xl text-lg leading-8 text-[#d9cbbd]/75">If you no longer wish to receive Echo by email, you can unsubscribe here.</p>
        <UnsubscribeConfirmation token={token ?? ''} />
      </section>
    </main>
  )
}
