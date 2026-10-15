import type { Metadata } from 'next'
import Link from 'next/link'
import { NavigationDrawer } from '@/components/navigation-drawer'
import { SubscribeForm } from '@/components/subscribe-form'
import { createAdminClient, publicEssayFields } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Echo | Original Essays & Literary Fiction — Go Within',
  description: "Explore Echo, Go Within's literary publication featuring reflective essays, original fiction and questions worth carrying beyond the page.",
  alternates: { canonical: '/echo' },
}

export default async function EchoPage() {
  const canReadEssays = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY)
  const { data: essays, error } = canReadEssays
    ? await createAdminClient().from('essays').select(publicEssayFields()).eq('status', 'published').not('published_at', 'is', null).lte('published_at', new Date().toISOString()).order('published_at', { ascending: false })
    : { data: [], error: null }
  const latest = essays?.[0]
  return (
    <main className="min-h-svh bg-[#071525] text-[#f3eadc]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 sm:px-10 lg:px-16"><Link href="/" className="text-[11px] uppercase tracking-[0.34em]">GO WITHIN</Link><NavigationDrawer /></header>
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:px-10 lg:px-16">
        <p className="text-[10px] uppercase tracking-[0.42em] text-[#c28b61]">GO WITHIN / ORIGINAL WRITING</p>
        <h1 className="mt-8 font-serif text-[clamp(4rem,11vw,9rem)] font-light italic leading-[.88] tracking-[-.07em]">Echo</h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-[#d9cbbd]/72">Stories to enter. Questions to carry.</p>
        {error ? <div className="mt-20 border border-[#c28b61]/40 p-8"><h2 className="font-serif text-3xl font-light italic">Echo is briefly out of reach.</h2><p className="mt-4 text-sm leading-7 text-[#d9cbbd]/70">The publication could not be retrieved. Please return shortly.</p></div> : latest ? <>
          <section className="mt-20 max-w-3xl border-t border-[#c28b61]/50 pt-8"><p className="text-[10px] uppercase tracking-[0.3em] text-[#c28b61]">Latest Echo</p><h2 className="mt-6 font-serif text-4xl font-light italic sm:text-6xl">{latest.title}</h2>{latest.excerpt && <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d9cbbd]/72">{latest.excerpt}</p>}<Link href={`/${latest.slug}`} className="mt-8 inline-flex border-b border-[#c28b61] pb-2 text-[10px] uppercase tracking-[0.3em] text-[#edb17a]">Read the Echo</Link></section>
          {essays.length > 1 && <section className="mt-24 border-t border-white/10 pt-8"><p className="text-[10px] uppercase tracking-[0.3em] text-[#c28b61]">Explore the Archive</p><div className="mt-8 grid gap-6 sm:grid-cols-2">{essays.slice(1).map((essay) => <Link key={essay.id} href={`/${essay.slug}`} className="border-b border-white/10 pb-6 transition hover:border-[#c28b61]"><h3 className="font-serif text-2xl italic">{essay.title}</h3><p className="mt-3 text-sm leading-6 text-[#d9cbbd]/60">{essay.excerpt}</p></Link>)}</div></section>}
        </> : <section className="mt-20 max-w-2xl border-t border-[#c28b61]/50 pt-8"><h2 className="font-serif text-4xl font-light italic">The First Echo Is on Its Way.</h2><p className="mt-6 text-base leading-8 text-[#d9cbbd]/72">Some stories arrive quietly.<br />Our first Echo is preparing to find its way to you.<br />Join us, and be among the first to discover what unfolds.</p><div className="mt-8"><SubscribeForm source="echo" /></div></section>}
        <Link href="/" className="mt-20 inline-flex text-[10px] uppercase tracking-[0.3em] text-white/50">Return to Go Within</Link>
      </section>
    </main>
  )
}
