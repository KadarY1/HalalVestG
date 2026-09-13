import { useEffect, useMemo, useState } from 'react'
import { getCompany, DATA_AS_OF } from '../data/companies.js'
import { METHODOLOGIES } from '../data/methodologies.js'
import { screenStock, STATUS_META } from '../lib/calculations.js'
import { fmtMoney, fmtMarketCap, fmtPct } from '../lib/format.js'
import { explainVerdict, explainTriggers, companyBrief } from '../lib/explain.js'
import { Card, Stat, StatusBadge, ChangePill, Button, Badge, Disclaimer, TrustRow, Link } from '../components/ui.jsx'
import { PriceChart } from '../components/Charts.jsx'
import { useStore } from '../context/store.jsx'
import { Star, ShieldCheck, ShieldAlert, AlertTriangle, Plus } from 'lucide-react'

const toneText = { green: 'text-emerald-700', amber: 'text-amber-700', red: 'text-red-600' }

export default function Research({ ticker }) {
  const store = useStore()
  const { watchlist, toggleWatchlist, portfolios, addHolding, pushRecent } = store
  const [methId, setMethId] = useState(store.methodology.id)
  const [addOpen, setAddOpen] = useState(false)
  const [shares, setShares] = useState(1)
  const [pfId, setPfId] = useState(portfolios[0]?.id)
  const [added, setAdded] = useState(false)

  const company = getCompany(ticker)
  useEffect(() => { if (company) pushRecent(company.ticker) }, [ticker]) // eslint-disable-line

  const m = METHODOLOGIES[methId]
  const s = useMemo(() => company ? screenStock(company, m) : null, [company, m])
  const brief = company ? companyBrief(company) : null
  const verdictLine = company && s ? explainVerdict(company, s, m) : ''
  const triggers = company && s ? explainTriggers(company, s, m) : []

  if (!company) {
    return (
      <Card className="p-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">Unknown ticker: “{ticker}”</h1>
        <p className="mt-2 text-sm text-slate-500">This ticker isn't in the prototype dataset (mock data only).</p>
        <Link to="/screener" className="mt-4 inline-block text-sm font-bold text-brand-700">← Back to screener</Link>
      </Card>
    )
  }

  const estAnnualDivPerShare = company.price * (company.dividendYield / 100)
  const estPurificationPerShare = estAnnualDivPerShare * company.fin.nonPermIncomePct

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900">{company.name}</h1>
            <Badge tone="slate">{company.ticker}</Badge>
            <button onClick={() => toggleWatchlist(company.ticker)} aria-label="Toggle watchlist"
              className={watchlist.includes(company.ticker) ? 'text-gold-500' : 'text-slate-300 hover:text-gold-400'}>
              <Star className="h-5 w-5" fill={watchlist.includes(company.ticker) ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="mt-1 max-w-xl text-sm text-slate-500">{company.description}</p>
          <p className="mt-2 text-xs text-slate-400">{company.sector} · Mock quote, not live data</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-extrabold tabular-nums text-slate-900">{fmtMoney(company.price)}</p>
          <ChangePill value={company.changePct} />
        </div>
      </div>
      {/* 30-Second Brief — what this company actually IS */}
      <Card className="border-brand-100 bg-gradient-to-br from-brand-50/60 to-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-700">The 30-Second Brief</p>
            <h2 className="mt-1.5 text-xl font-extrabold text-slate-900">What is {company.name}?</h2>
            <p className="mt-2 leading-relaxed text-slate-700">{brief.whatItIs}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{brief.context} {brief.growthLine} {brief.dividendLine}</p>
          </div>
          <div className="w-full max-w-sm rounded-xl bg-white/80 p-4 ring-1 ring-inset ring-slate-200 lg:w-72">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">The short answer</p>
            <p className="mt-1.5 text-sm font-semibold leading-relaxed text-slate-800">{verdictLine}</p>
          </div>
        </div>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <p className="mb-2 text-sm font-semibold text-slate-700">90-session mock price history</p>
          <PriceChart history={company.history} />
        </Card>

        <Card className="grid grid-cols-2 gap-4 p-5">
          <Stat label="Market Cap" value={fmtMarketCap(company.marketCap)} />
          <Stat label="P/E" value={company.pe.toFixed(1)} />
          <Stat label="Rev Growth" value={fmtPct(company.revenueGrowth)} />
          <Stat label="EPS Growth" value={fmtPct(company.epsGrowth)} />
          <Stat label="ROE" value={fmtPct(company.roe, 0)} />
          <Stat label="Div Yield" value={company.dividendYield ? fmtPct(company.dividendYield) : '—'} />
        </Card>
      </div>

      <Card className="flex flex-wrap items-center gap-3 p-4">
        <span className="text-sm font-semibold text-slate-700">Screening methodology:</span>
        <select value={methId} onChange={(e) => setMethId(e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm" aria-label="Screening methodology">
          {Object.values(METHODOLOGIES).map(mm => <option key={mm.id} value={mm.id}>{mm.name}</option>)}
        </select>
        <span className="text-xs text-slate-400">{m.tagline}</span>
      </Card>

      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Shariah Status</p>
            <p className={`mt-1 text-4xl font-extrabold ${toneText[STATUS_META[s.status].tone]}`}>
              {STATUS_META[s.status].label.toUpperCase()}
            </p>
            <p className="mt-1 text-sm text-slate-500">Appears {s.status === 'COMPLIANT' ? 'compliant' : s.status === 'REVIEW' ? 'to require review' : 'non-compliant'} under the selected methodology.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={s.status} />
            <Badge tone={s.purificationRequired ? 'gold' : 'slate'}>
              Purification: {s.purificationRequired ? 'REQUIRED' : 'NOT REQUIRED'}
            </Badge>
            <TrustRow updated={DATA_AS_OF} methodology={m.name} confidence={s.confidence} />
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2">
            {s.business.pass ? <ShieldCheck className="h-5 w-5 text-emerald-600" /> : <ShieldAlert className="h-5 w-5 text-red-500" />}
            <h3 className="font-bold text-slate-900">Business Activity Screen — {s.business.pass ? 'PASS' : 'FAIL'}</h3>
          </div>
          {s.business.pass ? (
            <p className="mt-2 text-sm text-slate-500">
              No prohibited primary-activity flags under this methodology
              (banking, insurance, alcohol, pork, gambling, adult entertainment, tobacco, weapons).
            </p>
          ) : (
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-700">
              {s.business.flags.map(f => <li key={f}>Flagged: {f}</li>)}
            </ul>
          )}
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2">
            {s.financials.every(f => f.pass) ? <ShieldCheck className="h-5 w-5 text-emerald-600" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}
            <h3 className="font-bold text-slate-900">Financial Screening</h3>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 pr-4 font-semibold">Screen</th>
                  <th className="py-2 pr-4 font-semibold">Value</th>
                  <th className="py-2 pr-4 font-semibold">Threshold</th>
                  <th className="py-2 pr-4 font-semibold">Basis</th>
                  <th className="py-2 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {s.financials.map(f => (
                  <tr key={f.key}>
                    <td className="py-2.5 pr-4">
                      <span className="hv-tooltip font-semibold text-slate-800 underline decoration-dotted decoration-slate-300" data-tip={f.hint}>
                        {f.label}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums text-slate-700">{f.display}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-slate-500">{f.threshold}</td>
                    <td className="py-2.5 pr-4 text-xs text-slate-400">{f.source}</td>
                    <td className="py-2.5">
                      <Badge tone={f.pass ? 'green' : 'red'}>{f.pass ? 'PASS' : 'FAIL'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 rounded-xl bg-brand-50/60 p-4 text-sm ring-1 ring-inset ring-brand-100">
          <p className="font-semibold text-brand-800">What would change this result?</p>
          <ul className="mt-1.5 list-inside list-disc space-y-1 text-slate-600">
            {triggers.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm">
          <p className="font-semibold text-slate-800">Estimated purification (prototype)</p>
          <p className="mt-1 text-slate-500">
            Non-permissible income ratio <strong>{fmtPct(company.fin.nonPermIncomePct)}</strong> of revenue.
            Estimated annual dividend per share {fmtMoney(estAnnualDivPerShare)} → purification ≈{' '}
            <strong className="text-slate-800">{fmtMoney(estPurificationPerShare)}</strong> per share per year.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
          {!addOpen ? (
            <Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add to portfolio</Button>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <select value={pfId} onChange={(e) => setPfId(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" aria-label="Portfolio">
                {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="number" min="1" value={shares} onChange={(e) => setShares(Math.max(1, Number(e.target.value)))}
                className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-sm" aria-label="Shares" />
              <Button onClick={() => { addHolding(pfId, company.ticker, shares); setAdded(true); setAddOpen(false) }}>Confirm</Button>
              <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            </div>
          )}
          {added && !addOpen && <span className="text-sm font-semibold text-emerald-700">✓ Added to portfolio</span>}
          <Link to="/methodology" className="ml-auto text-xs font-bold text-brand-700 hover:underline">How is this calculated? →</Link>
        </div>
      </Card>
      <Disclaimer />
    </div>
  )
}
