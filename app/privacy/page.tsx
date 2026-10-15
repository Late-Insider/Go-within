import type { Metadata } from 'next'
import Link from 'next/link'
import { NavigationDrawer } from '@/components/navigation-drawer'

export const metadata: Metadata = {
  title: 'Privacy | GO WITHIN',
  description: 'The privacy statement for GO WITHIN and Echo subscribers.',
  alternates: { canonical: '/privacy' },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-svh bg-[#071525] text-[#f3eadc]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 sm:px-10 lg:px-16">
        <Link href="/" className="text-[11px] uppercase tracking-[0.34em]">GO WITHIN</Link>
        <NavigationDrawer />
      </header>
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-20 sm:px-10 lg:px-16">
        <p className="text-[10px] uppercase tracking-[0.42em] text-[#c28b61]">GO WITHIN / PRIVACY</p>
        <h1 className="mt-8 font-serif text-[clamp(4rem,10vw,7rem)] font-light italic leading-[.9] tracking-[-.06em]">Privacy</h1>
        <div className="mt-16 space-y-8 text-base leading-8 text-[#d9cbbd]/75">
          <h2 className="font-serif text-3xl font-light italic text-[#f3eadc]">Your Trust Matters.</h2>
          <p>Your curiosity belongs to you. So does your information.</p>
          <p>When you subscribe to Echo, we use your email address to deliver our writing and manage your subscription.</p>
          <p>We don&apos;t sell your information or share it with third parties for their own marketing purposes.</p>
          <p>We use service providers where necessary to operate our website, store subscriptions, and deliver emails.</p>
          <p>No unnecessary tracking. No advertising tricks.</p>
          <p>You can unsubscribe whenever you wish using the link in our emails.</p>
          <p>For privacy questions, contact:<br /><a href="mailto:privacy@gowithin.app" className="text-[#edb17a] underline underline-offset-4">privacy@gowithin.app</a></p>
          <p className="pt-8 font-serif text-2xl italic text-[#f3eadc]">Come curious. Stay because you wish to.</p>
          <p>We won&apos;t follow you home.</p>
        </div>
        <Link href="/" className="mt-14 inline-flex border-b border-[#c28b61] pb-2 text-[10px] uppercase tracking-[0.3em] text-[#edb17a]">Return to Go Within</Link>
      </article>
    </main>
  )
}
