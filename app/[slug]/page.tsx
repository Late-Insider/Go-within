import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NavigationDrawer } from '@/components/navigation-drawer'
import { createAdminClient, hasSupabaseConfig, publicEssayFields } from '@/lib/supabase/server'

const pages: Record<string, string> = {
  'our-story': 'Our Story',
  echo: 'Echo (Daily Essay)',
  gallery: 'The Gallery',
  initiatives: 'Initiatives',
  partnerships: 'Partnerships',
}

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export const dynamic = 'force-dynamic'

async function getPublishedEssay(slug: string) {
  if (!hasSupabaseConfig()) return null
  const { data, error } = await createAdminClient()
    .from('essays')
    .select(publicEssayFields())
    .eq('slug', slug)
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .maybeSingle()

  if (error) throw error
  return data
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!pages[slug]) {
    const essay = await getPublishedEssay(slug)
    if (!essay) return { title: 'Not found | GO WITHIN' }
    return {
      title: `${essay.title} | Echo — GO WITHIN`,
      description: essay.excerpt ?? `Read ${essay.title} in Echo, the literary publication from GO WITHIN.`,
      alternates: { canonical: `/${essay.slug}` },
      openGraph: { title: essay.title, description: essay.excerpt ?? undefined, url: `/${essay.slug}`, type: 'article' },
    }
  }
  if (slug === 'echo') {
    return {
      title: 'Echo — Stories to enter. Questions to carry. | GO WITHIN',
      description: 'Original fiction and reflective essays from the unfolding universe of GO WITHIN.',
      alternates: { canonical: '/echo' },
      openGraph: {
        title: 'Echo — Stories to enter. Questions to carry.',
        description: 'Original fiction and reflective essays from GO WITHIN.',
        url: '/echo',
        type: 'article',
      },
    }
  }
  return { title: `${pages[slug] ?? 'The Practice'} | GO WITHIN`, alternates: { canonical: `/${slug}` } }
}

export default async function PlaceholderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const title = pages[slug] ?? 'The Practice'
  const essay = !pages[slug] ? await getPublishedEssay(slug) : slug === 'echo' && hasSupabaseConfig()
    ? (await createAdminClient()
        .from('essays')
        .select(publicEssayFields())
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle()).data
    : null

  if (!pages[slug] && !essay) notFound()

  return (
    <main className="relative flex min-h-svh overflow-hidden bg-[#071525] text-white">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,100,61,0.18),transparent_32%),linear-gradient(135deg,#071525_0%,#10162c_55%,#24152a_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-30 bg-[url('/images/go-within-ocean.png')] bg-cover bg-center mix-blend-screen" />
      <header className="relative z-10 flex w-full items-center justify-between self-start px-6 py-7 sm:px-10 lg:px-16 lg:py-9">
        <Link href="/" className="text-[11px] font-medium uppercase tracking-[0.34em] text-white/90 transition hover:text-[#edb17a]">Go Within</Link>
        <NavigationDrawer />
      </header>
      <section className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl items-center px-6 pb-20 pt-32 sm:px-10 lg:px-16">
        <div className="hero-content w-full">
          <p className="mb-8 text-[10px] uppercase tracking-[0.42em] text-[#d7a47a]">Echo / Original writing</p>
          {essay ? (
            <article className="max-w-3xl">
              <h1 className="font-serif text-[clamp(3.25rem,8vw,7.5rem)] font-light italic leading-[0.9] tracking-[-0.06em] text-white">{essay.title}</h1>
              {essay.excerpt ? <p className="mt-9 max-w-2xl border-l border-[#c28b61] pl-5 text-lg font-light leading-8 text-white/75 sm:text-xl sm:leading-9">{essay.excerpt}</p> : null}
              <div className="mt-12 max-w-2xl whitespace-pre-wrap text-base font-light leading-8 text-white/78 sm:text-lg sm:leading-9">{essay.body}</div>
            </article>
          ) : (
            <article className="max-w-2xl">
              <h1 className="font-serif text-[clamp(4rem,10vw,8rem)] font-light italic leading-[0.9] tracking-[-0.06em]">Echo</h1>
              <p className="mt-8 max-w-lg text-lg font-light leading-8 text-white/70">Stories to enter. Questions to carry.</p>
              <p className="mt-4 max-w-lg text-sm font-light leading-7 text-white/55">Original fiction and reflective essays are finding their way here.</p>
            </article>
          )}
          <Link href="/" className="mt-14 inline-flex border-b border-[#c28b61] pb-2 text-[10px] uppercase tracking-[0.3em] text-[#edb17a] transition hover:text-white">Return to Go Within</Link>
        </div>
      </section>
    </main>
  )
}
