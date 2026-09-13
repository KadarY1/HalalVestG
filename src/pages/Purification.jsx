import { useState } from 'react'
import { useStore } from '../context/store.jsx'
import { summarizePortfolio, calculatePurification } from '../lib/calculations.js'
import { fmtMoney, fmtPct } from '../lib/format.js'
import { Card, SectionTitle, Disclaimer, Link } from '../components/ui.jsx'

export default function Purification() {
  const { portfolios, getCompany, methodology } = useStore()
  const [pfId, setPfId] = useState(portfolios[0]?.id)
  const [dividends, setDividends] = useState({})
  const pf = portfolios.find(p => p.id === pfId) || portfolios[0]
  const sum = pf ? summarizePortfolio(pf.holdings, pf.cash, getCompany, methodology) : null

  const rows = (sum?.rows || []).filter(r => r.company.dividendYield > 0).map(r => {
    const est = dividends[r.ticker] != null && dividends[r.ticker] !== ''
      ? Number(dividends[r.ticker]) || 0
      : r.value * (r.company.dividendYield / 100)
    return { ...r, divInput: est, ...calculatePurification({ dividends: est, nonPermIncomePct: r.company.fin.nonPermIncomePct }) }
  })
  const totalDiv = rows.reduce((s, r) => s + r.dividends, 0)
  const totalPur = rows.reduce((s, r) => s + r.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Purification Calculator</h1>
        <p className="text-sm text-slate-500">Estimate the portion of dividend income attributable to non-permissible revenue. Prototype estimate — methodologies differ.</p>
      </div>

      <Card className="p-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          Portfolio:
          <select value={pf?.id} onChange={(e) => setPfId(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm" aria-label="Portfolio">
            {portfolios.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
      </Card>

      <Card className="p-5">
        <SectionTitle title="Holdings with dividends" />
        {rows.length === 0 && <p className="py-6 text-sm text-slate-400">No dividend-paying holdings in this portfolio.</p>}
        {rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 pr-4 font-semibold">Company</th>
                  <th className="py-2 pr-4 font-semibold">Purification ratio</th>
                  <th className="py-2 pr-4 font-semibold">Dividends received (est.)</th>
                  <th className="py-2 font-semibold">Est. purification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map(r => (
                  <tr key={r.ticker}>
                    <td className="py-2.5 pr-4">
                      <Link to={`/research/${r.ticker}`} className="font-bold text-slate-900 hover:text-brand-700">{r.ticker}</Link>
                      <span className="ml-2 text-xs text-slate-400">{r.company.name}</span>
                    </td>
                    <td className="py-2.5 pr-4 tabular-nums text-slate-600">{fmtPct(r.ratio * 100, 2)}</td>
                    <td className="py-2.5 pr-4">
                      <input type="number" min="0" value={dividends[r.ticker] ?? r.divInput.toFixed(2)}
                        onChange={(e) => setDividends(d => ({ ...d, [r.ticker]: e.target.value }))}
                        className="w-32 rounded-lg border border-slate-200 px-2 py-1 text-sm tabular-nums" aria-label={`Dividends for ${r.ticker}`} />
                    </td>
                    <td className="py-2.5 font-bold tabular-nums text-gold-600">{fmtMoney(r.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 flex justify-end gap-8 rounded-xl bg-slate-50 px-4 py-3 text-sm">
          <span>Total dividends: <strong className="tabular-nums">{fmtMoney(totalDiv)}</strong></span>
          <span>Estimated purification: <strong className="tabular-nums text-gold-600">{fmtMoney(totalPur)}</strong></span>
        </div>
      </Card>
      <Disclaimer />
    </div>
  )
}
