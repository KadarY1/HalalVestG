import { useState } from 'react'
import { useStore } from '../context/store.jsx'
import { summarizePortfolio } from '../lib/calculations.js'
import { fmtMoney, fmtPct } from '../lib/format.js'
import { Card, Stat, SectionTitle, StatusBadge, Button, EmptyState, inputCls } from '../components/ui.jsx'
import { AllocationPie, SectorBar } from '../components/Charts.jsx'
import { COMPANIES } from '../data/companies.js'
import { Link } from '../lib/router.jsx'
import { Plus, Trash2 } from 'lucide-react'

export default function PortfolioDetail({ id }) {
  const { portfolios, getCompany, methodology, addHolding, removeHolding, setShares, updatePortfolio } = useStore()
  const pf = portfolios.find(p => p.id === id)
  const [ticker, setTicker] = useState('')
  const [sharesIn, setSharesIn] = useState(1)

  if (!pf) return <Card className="p-10 text-center"><p className="font-bold">Portfolio not found.</p><Link to="/portfolio" className="text-sm text-brand-700">← All portfolios</Link></Card>

  const sum = summarizePortfolio(pf.holdings, pf.cash, getCompany, methodology)
  const pie = [...sum.rows.map(r => ({ name: r.ticker, value: r.value })), { name: 'Cash', value: sum.cash }]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link to="/portfolio" className="text-xs font-bold text-brand-700">← Portfolios</Link>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">{pf.name}</h1>
          <p className="text-sm text-slate-500">Hypothetical portfolio · {methodology.name}</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Cash: $
          <input type="number" min="0" value={pf.cash} onChange={(e) => updatePortfolio(pf.id, { cash: Math.max(0, Number(e.target.value) || 0) })}
            className={`${inputCls} w-32`} aria-label="Cash balance" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5"><Stat label="Total Value" value={fmtMoney(sum.total)} /></Card>
        <Card className="p-5"><Stat label="Day Change" value={`${sum.dayChange >= 0 ? '+' : ''}${fmtMoney(sum.dayChange)}`} tone={sum.dayChange >= 0 ? 'up' : 'down'} /></Card>
        <Card className="p-5"><Stat label="Total Gain/Loss" value={`${sum.gain >= 0 ? '+' : ''}${fmtMoney(sum.gain)}`} sub={fmtPct(sum.gainPct)} tone={sum.gain >= 0 ? 'up' : 'down'} /></Card>
        <Card className="p-5">
          <Stat label="Screening Health Score" value={`${sum.health.score} / 100`} sub={sum.health.label} />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Allocation" />
          <AllocationPie data={pie} />
        </Card>
        <Card className="p-5">
          <SectionTitle title="Sector Exposure" />
          {sum.sectorBreakdown.length ? <SectorBar data={sum.sectorBreakdown} /> : <p className="py-8 text-center text-sm text-slate-400">Add holdings to see sector exposure.</p>}
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle title="Holdings" />
        {sum.rows.length === 0 && <EmptyState title="No holdings yet" body="Add a stock below to start tracking it." />}
        {sum.rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 pr-4 font-semibold">Holding</th><th className="py-2 pr-4 font-semibold">Shares</th>
                  <th className="py-2 pr-4 font-semibold">Price</th><th className="py-2 pr-4 font-semibold">Value</th>
                  <th className="py-2 pr-4 font-semibold">Weight</th><th className="py-2 pr-4 font-semibold">Day</th>
                  <th className="py-2 pr-4 font-semibold">Shariah</th><th className="py-2 font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sum.rows.map(r => (
                  <tr key={r.ticker}>
                    <td className="py-2.5 pr-4">
                      <Link to={`/research/${r.ticker}`} className="font-bold text-slate-900 hover:text-brand-700">{r.ticker}</Link>
                      <span className="ml-2 text-xs text-slate-400">{r.company.sector}</span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <input type="number" min="0" value={r.shares} aria-label={`Shares of ${r.ticker}`}
                        onChange={(e) => setShares(pf.id, r.ticker, Math.max(0, Number(e.target.value) || 0))}
                        className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm tabular-nums" />
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums">{fmtMoney(r.company.price)}</td>
                    <td className="py-2.5 pr-4 font-semibold tabular-nums">{fmtMoney(r.value)}</td>
                    <td className="py-2.5 pr-4 tabular-nums text-slate-600">{fmtPct(r.weight * 100)}</td>
                    <td className={`py-2.5 pr-4 tabular-nums ${r.dayChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{fmtMoney(r.dayChange)}</td>
                    <td className="py-2.5 pr-4"><StatusBadge status={r.screening.status} /></td>
                    <td className="py-2.5 text-right">
                      <button onClick={() => removeHolding(pf.id, r.ticker)} aria-label={`Remove ${r.ticker}`} className="text-slate-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <form className="mt-4 flex flex-wrap items-center gap-2"
          onSubmit={(e) => { e.preventDefault(); if (ticker && getCompany(ticker)) { addHolding(pf.id, ticker.toUpperCase(), sharesIn); setTicker('') } }}>
          <input list="hv-tickers" value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Ticker (e.g. NVDA)"
            className="w-44 rounded-xl border border-slate-300 px-3 py-2 text-sm uppercase" aria-label="Ticker to add" />
          <datalist id="hv-tickers">{COMPANIES.map(c => <option key={c.ticker} value={c.ticker}>{c.name}</option>)}</datalist>
          <input type="number" min="1" value={sharesIn} onChange={(e) => setSharesIn(Math.max(1, Number(e.target.value) || 1))}
            className="w-24 rounded-xl border border-slate-300 px-3 py-2 text-sm" aria-label="Shares" />
          <Button type="submit"><Plus className="h-4 w-4" /> Add holding</Button>
        </form>
      </Card>
    </div>
  )
}
