import { useStore } from '../context/store.jsx'
import { summarizePortfolio, STATUS, STATUS_META } from '../lib/calculations.js'
import { fmtMoney, fmtPct } from '../lib/format.js'
import { Card, SectionTitle, Stat, StatusBadge, Disclaimer, TrustRow, ChangePill, Link } from '../components/ui.jsx'
import { AllocationPie } from '../components/Charts.jsx'
import { DATA_AS_OF } from '../data/companies.js'
import { ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const { portfolios, watchlist, recent, getCompany, methodology, toggleWatchlist } = useStore()
  const pf = portfolios[0]
  const sum = pf ? summarizePortfolio(pf.holdings, pf.cash, getCompany, methodology) : null
  const nisabValue = methodology.nisabGoldGrams * methodology.goldPricePerGram
  const zakatable = sum ? sum.invested + sum.cash : 0
  const zakat = zakatable >= nisabValue ? zakatable * methodology.zakatRate : 0
  const dividends = sum ? sum.rows.reduce((s, r) => s + r.value * (r.company.dividendYield / 100), 0) : 0
  const purification = sum ? sum.rows.reduce((s, r) => s + r.value * (r.company.dividendYield / 100) * r.company.fin.nonPermIncomePct, 0) : 0
  const compliantPct = sum && sum.invested > 0
    ? Math.round(sum.rows.filter(r => r.screening.status === STATUS.COMPLIANT).reduce((s, r) => s + r.value, 0) / sum.invested * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Assalamu alaikum 👋</h1>
          <p className="text-sm text-slate-500">Here is your demo portfolio at a glance.</p>
        </div>
        <TrustRow updated={DATA_AS_OF} methodology={methodology.name} confidence="Medium" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><Stat label="Total Portfolio" value={fmtMoney(sum?.total ?? 0)}
          sub={pf ? pf.name : 'No portfolio'} /></Card>
        <Card className="p-5"><Stat label="Day Change" value={`${sum?.dayChange >= 0 ? '+' : ''}${fmtMoney(sum?.dayChange ?? 0)}`}
          tone={sum?.dayChange >= 0 ? 'up' : 'down'}
          sub={sum?.total ? fmtPct(sum.dayChange / (sum.total - sum.dayChange) * 100) : '—'} /></Card>
        <Card className="p-5"><Stat label="Overall Gain" value={`${sum?.gain >= 0 ? '+' : ''}${fmtMoney(sum?.gain ?? 0)}`}
          tone={sum?.gain >= 0 ? 'up' : 'down'} sub={fmtPct(sum?.gainPct ?? 0)} /></Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Shariah Compliance" sub="Share of invested value passing the selected screening methodology" />
          <div className="flex items-center gap-5">
            <div className="relative h-28 w-28 shrink-0">
              <AllocationPie data={[{ name: 'Compliant', value: Math.max(compliantPct, 1) }, { name: 'Other', value: Math.max(100 - compliantPct, 0) }]} height={112} />
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-slate-900">{compliantPct}%</span>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(sum?.counts ?? {}).map(([k, v]) => (
                <p key={k} className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${{ green: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500' }[STATUS_META[k].tone]}`} />
                  <span className="text-slate-600">{STATUS_META[k].label}:</span>
                  <strong className="tabular-nums text-slate-900">{v}</strong>
                </p>
              ))}
              <p className="pt-1 text-xs text-slate-400">Screening result, not a religious ruling.</p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Zakat Snapshot" sub="Based on the demo portfolio only — open the calculator for a full estimate"
            right={<Link to="/zakat" className="text-xs font-bold text-brand-700 hover:underline">Open calculator →</Link>} />
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Est. Zakatable Assets" value={fmtMoney(zakatable)} />
            <Stat label="Est. Zakat (2.5%)" value={fmtMoney(zakat)} tone="up" />
            <Stat label="Nisab (gold basis)" value={fmtMoney(nisabValue)} sub="87.48 g · prototype price" />
            <Stat label="Status" value={zakatable >= nisabValue ? 'Above Nisab' : 'Below Nisab'} tone={zakatable >= nisabValue ? 'up' : 'down'} />
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
            <span className="text-slate-500">Estimated annual purification on dividends:</span>{' '}
            <strong className="tabular-nums text-slate-900">{fmtMoney(purification)}</strong>
            <span className="text-slate-400"> on est. dividends of {fmtMoney(dividends)}</span>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Watchlist" right={<Link to="/screener" className="text-xs font-bold text-brand-700 hover:underline">Screener →</Link>} />
          <div className="divide-y divide-slate-100">
            {watchlist.length === 0 && <p className="py-6 text-sm text-slate-400">No watchlist items yet — star a stock in the screener.</p>}
            {watchlist.map(t => {
              const c = getCompany(t); if (!c) return null
              return (
                <div key={t} className="flex items-center justify-between gap-3 py-2.5">
                  <Link to={`/research/${t}`} className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{c.ticker} <span className="font-normal text-slate-400">{c.name}</span></p>
                    <p className="text-xs text-slate-500">{c.sector}</p>
                  </Link>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold tabular-nums">{fmtMoney(c.price)}</p>
                      <ChangePill value={c.changePct} />
                    </div>
                    <button onClick={() => toggleWatchlist(t)} aria-label={`Remove ${t} from watchlist`}
                      className="text-slate-300 hover:text-red-500">✕</button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Recent Research" />
          <div className="space-y-2">
            {recent.length === 0 && <p className="py-6 text-sm text-slate-400">Companies you view will appear here.</p>}
            {recent.map(t => {
              const c = getCompany(t); if (!c) return null
              return (
                <Link key={t} to={`/research/${t}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-slate-50">
                  <span className="text-sm font-semibold text-slate-800">{c.name} <span className="text-slate-400">{c.ticker}</span></span>
                  <span className="flex items-center gap-2 text-xs text-slate-400">Open <ArrowRight className="h-3 w-3" /></span>
                </Link>
              )
            })}
          </div>
          <div className="mt-4"><Disclaimer /></div>
        </Card>
      </div>
    </div>
  )
}
