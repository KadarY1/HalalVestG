import { useMemo, useState } from 'react'
import { COMPANIES, SECTORS } from '../data/companies.js'
import { screenStock, STATUS, STATUS_META } from '../lib/calculations.js'
import { fmtMoney, fmtPct, fmtMarketCap } from '../lib/format.js'
import { Card, StatusBadge, ChangePill, EmptyState, Disclaimer, Link } from '../components/ui.jsx'
import { useStore } from '../context/store.jsx'
import { Star, ArrowUpDown } from 'lucide-react'

const PAGE = 12
const CAP_BUCKETS = { all: 'All', small: 'Small (<$2B)', mid: 'Mid ($2–10B)', large: 'Large ($10–200B)', mega: 'Mega (>$200B)' }
const capBucket = (mc) => mc < 2000 ? 'small' : mc < 10000 ? 'mid' : mc < 200000 ? 'large' : 'mega'

const COLUMNS = [
  { key: 'ticker', label: 'Company' }, { key: 'price', label: 'Price' }, { key: 'changePct', label: '1D' },
  { key: 'marketCap', label: 'Mkt Cap' }, { key: 'pe', label: 'P/E' }, { key: 'revenueGrowth', label: 'Rev Growth' },
  { key: 'roe', label: 'ROE' }, { key: 'dividendYield', label: 'Div Yield' }, { key: 'status', label: 'Shariah' },
]

export default function Screener() {
  const { methodology, watchlist, toggleWatchlist } = useStore()
  const [status, setStatus] = useState('all')
  const [sector, setSector] = useState('all')
  const [cap, setCap] = useState('all')
  const [q, setQ] = useState('')
  const [flags, setFlags] = useState({ dividend: false, lowDebt: false, growth: false, profitable: false })
  const [sort, setSort] = useState({ key: 'marketCap', dir: -1 })
  const [page, setPage] = useState(0)

  const rows = useMemo(() => {
    let r = COMPANIES.map(c => ({ c, s: screenStock(c, methodology) }))
    if (status !== 'all') r = r.filter(({ s }) => s.status === status)
    if (sector !== 'all') r = r.filter(({ c }) => c.sector === sector)
    if (cap !== 'all') r = r.filter(({ c }) => capBucket(c.marketCap) === cap)
    if (q.trim()) {
      const s = q.toLowerCase()
      r = r.filter(({ c }) => c.name.toLowerCase().includes(s) || c.ticker.toLowerCase().includes(s))
    }
    if (flags.dividend) r = r.filter(({ c }) => c.dividendYield > 0)
    if (flags.lowDebt) r = r.filter(({ c }) => c.fin.debt / c.marketCap < 0.3)
    if (flags.growth) r = r.filter(({ c }) => c.revenueGrowth > 15)
    if (flags.profitable) r = r.filter(({ c }) => c.roe > 20)
    r.sort((a, b) => {
      const va = a.c[sort.key], vb = b.c[sort.key]
      return (typeof va === 'string' ? va.localeCompare(vb) : va - vb) * sort.dir
    })
    return r
  }, [status, sector, cap, q, flags, sort, methodology])

  const pages = Math.max(1, Math.ceil(rows.length / PAGE))
  const view = rows.slice(page * PAGE, page * PAGE + PAGE)
  const toggleSort = (key) => setSort(s => ({ key, dir: s.key === key ? -s.dir : -1 }))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Stock Screener</h1>
          <p className="text-sm text-slate-500">{rows.length} companies · prototype mock data · methodology: {methodology.name}</p>
        </div>
      </div>

      <Card className="space-y-3 p-4">
        <div className="flex flex-wrap gap-3">
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0) }} placeholder="Search name or ticker…"
            className="min-w-44 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100" aria-label="Search" />
          <select value={sector} onChange={(e) => { setSector(e.target.value); setPage(0) }} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" aria-label="Sector">
            <option value="all">All sectors</option>
            {SECTORS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={cap} onChange={(e) => { setCap(e.target.value); setPage(0) }} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" aria-label="Market cap">
            {Object.entries(CAP_BUCKETS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['all', STATUS.COMPLIANT, STATUS.REVIEW, STATUS.NON_COMPLIANT].map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(0) }}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${status === s ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {s === 'all' ? 'All statuses' : STATUS_META[s].label}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-slate-200 sm:block" />
          {[['dividend', 'Dividend paying'], ['lowDebt', 'Low debt'], ['growth', 'High growth'], ['profitable', 'High ROE']].map(([k, label]) => (
            <button key={k} onClick={() => setFlags(f => ({ ...f, [k]: !f[k] }))}
              className={`rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${flags[k] ? 'bg-gold-400/20 text-gold-600 ring-gold-400' : 'bg-white text-slate-500 ring-slate-200 hover:bg-slate-50'}`}>
              {label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
              {COLUMNS.map(col => (
                <th key={col.key} className="px-4 py-3 font-semibold">
                  {col.key === 'status' ? col.label : (
                    <button onClick={() => toggleSort(col.key)} className="inline-flex items-center gap-1 hover:text-slate-600">
                      {col.label} <ArrowUpDown className="h-3 w-3" />
                    </button>
                  )}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {view.map(({ c, s }) => (
              <tr key={c.ticker} className="hover:bg-brand-50/50">
                <td className="px-4 py-3">
                  <Link to={`/research/${c.ticker}`} className="block">
                    <p className="font-bold text-slate-900">{c.ticker}</p>
                    <p className="max-w-40 truncate text-xs text-slate-500">{c.name} · {c.sector}</p>
                  </Link>
                </td>
                <td className="px-4 py-3 font-semibold tabular-nums">{fmtMoney(c.price)}</td>
                <td className="px-4 py-3"><ChangePill value={c.changePct} /></td>
                <td className="px-4 py-3 tabular-nums text-slate-600">{fmtMarketCap(c.marketCap)}</td>
                <td className="px-4 py-3 tabular-nums text-slate-600">{c.pe.toFixed(1)}</td>
                <td className="px-4 py-3 tabular-nums text-slate-600">{fmtPct(c.revenueGrowth)}</td>
                <td className="px-4 py-3 tabular-nums text-slate-600">{fmtPct(c.roe, 0)}</td>
                <td className="px-4 py-3 tabular-nums text-slate-600">{c.dividendYield ? fmtPct(c.dividendYield) : '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleWatchlist(c.ticker)} aria-label="Toggle watchlist"
                    className={watchlist.includes(c.ticker) ? 'text-gold-500' : 'text-slate-300 hover:text-gold-400'}>
                    <Star className="h-4 w-4" fill={watchlist.includes(c.ticker) ? 'currentColor' : 'none'} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {view.length === 0 && (
          <div className="p-6"><EmptyState title="No matches" body="Adjust the filters to see more of the prototype dataset." /></div>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm">
          <span className="text-slate-500">Page {page + 1} of {pages}</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="rounded-lg px-3 py-1.5 font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-40">← Prev</button>
            <button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} className="rounded-lg px-3 py-1.5 font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-40">Next →</button>
          </div>
        </div>
      </Card>
      <Disclaimer />
    </div>
  )
}
