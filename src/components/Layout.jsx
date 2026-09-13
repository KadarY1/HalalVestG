import { useState, useRef, useEffect } from 'react'
import {
  LayoutDashboard, LineChart as LineChartIcon, Search as SearchIcon, Briefcase,
  Calculator, Droplets, GraduationCap, ScrollText, Settings, Menu, X, MoonStar,
} from 'lucide-react'
import { Link, useRoute, navigate } from '../lib/router.jsx'
import { useStore } from '../context/store.jsx'
import { searchCompanies, DATA_AS_OF } from '../data/companies.js'
import { screenStock } from '../lib/calculations.js'
import { STATUS_META } from '../lib/calculations.js'
import { fmtMoney, fmtMarketCap } from '../lib/format.js'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/screener', label: 'Stock Screener', icon: SearchIcon },
  { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/zakat', label: 'Zakat', icon: Calculator },
  { to: '/purification', label: 'Purification', icon: Droplets },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/methodology', label: 'Methodology', icon: ScrollText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm">
        <MoonStar className="h-5 w-5" aria-hidden />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-slate-900">
        Halal<span className="text-brand-700">Vest</span>
      </span>
    </Link>
  )
}

function GlobalSearch({ className = '' }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const boxRef = useRef(null)
  const { methodology } = useStore()
  const results = searchCompanies(q)

  useEffect(() => {
    const onDoc = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const go = (ticker) => {
    setOpen(false); setQ(''); setActive(-1)
    navigate(`/research/${ticker}`)
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
      <input
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open || !results.length) return
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => (a + 1) % results.length) }
          if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => (a - 1 + results.length) % results.length) }
          if (e.key === 'Enter' && active >= 0) go(results[active].ticker)
        }}
        placeholder="Search companies — try “NVDA” or “Apple”…"
        aria-label="Search companies"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
      />
      {open && q.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.length === 0 && (
            <p className="px-4 py-3 text-sm text-slate-500">
              No matches in the prototype dataset for “{q}”.
            </p>
          )}
          {results.map((c, i) => {
            const s = screenStock(c, methodology)
            const tone = STATUS_META[s.status].tone
            return (
              <button key={c.ticker} onClick={() => go(c.ticker)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-brand-50 ${i === active ? 'bg-brand-50' : ''}`}>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-slate-900">{c.name} <span className="font-normal text-slate-400">({c.ticker})</span></span>
                  <span className="block text-xs text-slate-500">{c.sector} · {fmtMarketCap(c.marketCap)}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold tabular-nums text-slate-800">{fmtMoney(c.price)}</span>
                  <span className={`h-2 w-2 rounded-full ${{ green: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500' }[tone]}`}
                    title={STATUS_META[s.status].label} />
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Layout({ children }) {
  const route = useRoute()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { methodology } = useStore()
  const onLanding = route === '/'

  const navItems = (
    <>
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = route === to || route.startsWith(to + '/')
        return (
          <Link key={to} to={to} onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white shadow-sm' : 'text-slate-600 hover:bg-brand-50 hover:text-brand-800'}`}>
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </Link>
        )
      })}
    </>
  )

  if (onLanding) return <>{children}</>

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="px-5 pb-5 pt-6"><Logo /></div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">{navItems}</nav>
        <div className="space-y-2 border-t border-slate-100 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Prototype</p>
          <p className="text-xs leading-relaxed text-slate-400">Not financial or religious advice. Mock data as of {DATA_AS_OF}.</p>
          <p className="text-xs text-slate-400">Methodology: <span className="font-semibold text-slate-500">{methodology.name}</span></p>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>
      {mobileOpen && (
        <nav className="fixed inset-x-0 top-[57px] z-40 space-y-1 border-b border-slate-200 bg-white p-3 shadow-lg lg:hidden">
          {navItems}
        </nav>
      )}

      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:pb-10">
          <div className="mb-6 hidden lg:block"><GlobalSearch className="max-w-xl" /></div>
          <div className="mb-6 lg:hidden"><GlobalSearch /></div>
          <main>{children}</main>
        </div>
      </div>
    </div>
  )
}
