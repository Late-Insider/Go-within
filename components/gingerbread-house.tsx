'use client'

import { useRef, useState } from 'react'

export function GingerbreadHouse() {
  const [open, setOpen] = useState(false)
  const [reveal, setReveal] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  function toggle() { setOpen((value) => !value); setReveal(false) }
  function close() { setOpen(false); setReveal(false); closeRef.current?.focus() }
  return <>
    <button type="button" onClick={toggle} aria-label="Discover a small house from the woods" className="group relative mt-8 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#edb17a] focus-visible:ring-offset-4 focus-visible:ring-offset-[#071525]"><img src="/images/gingerbread-house.png" alt="" className="h-20 w-24 object-contain opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /></button>
    {open && <div role="dialog" aria-modal="true" aria-labelledby="woods-note-title" className="fixed inset-0 z-[120] flex items-center justify-center bg-[#030b17]/75 px-6 py-10 backdrop-blur-sm" onKeyDown={(event) => { if (event.key === 'Escape') close() }}><div className="w-full max-w-md border border-[#c28b61]/45 bg-[#0b1727] p-8 text-[#f3eadc] shadow-2xl sm:p-10"><p className="text-[10px] uppercase tracking-[0.3em] text-[#c28b61]">A Note from the Woods</p><h2 id="woods-note-title" className="mt-5 font-serif text-3xl font-light italic">Oh, you found the house.</h2><p className="mt-5 text-sm leading-7 text-[#d9cbbd]/75">The internet has enough gingerbread houses.<br />We prefer open doors.<br /><br />No candy-coated traps. No breadcrumbs tracking you home.<br />Just stories worth getting lost in.</p>{!reveal ? <button type="button" onClick={() => setReveal(true)} className="mt-8 border-b border-[#c28b61] pb-1 text-xs text-[#edb17a] transition hover:text-white">Wait... was that all?</button> : <p className="mt-8 text-sm italic text-[#edb17a]">We won&apos;t follow you home.</p>}<div><button ref={closeRef} type="button" onClick={close} className="mt-10 text-[10px] uppercase tracking-[0.25em] text-white/50 transition hover:text-white">Close the door</button></div></div></div>}
  </>
}
