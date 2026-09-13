import { getZakatResult, clearZakatResult } from '../lib/zakatSession.js'
import { fmtMoney, fmtGrams } from '../lib/format.js'
import { Card, Button, Disclaimer } from '../components/ui.jsx'
import { navigate } from '../lib/router.jsx'

export default function ZakatResults() {
  const r = getZakatResult()
  if (!r) { navigate('/zakat'); return null }

  const download = () => {
    const lines = [
      'HalalVestss — Zakat Calculation (Prototype, educational estimate)', '',
      `Methodology: ${r.methodology} · Rate: ${(r.rate * 100).toFixed(1)}%`, '',
      'Breakdown:', ...r.wealth.lines.map(l => `  ${l.label}: ${fmtMoney(l.amount)}`),
      `  Subtotal: ${fmtMoney(r.wealth.subtotal)}`,
      `  Eligible liabilities: -${fmtMoney(r.wealth.liabilities)}`,
      `  Estimated zakatable wealth: ${fmtMoney(r.wealth.zakatable)}`, '',
      `Nisab (${r.nisab.metal}): ${fmtGrams(r.nisab.grams)} = ${fmtMoney(r.nisab.value)}`,
      `Status: ${r.zakat.aboveNisab ? 'Above Nisab' : 'Below Nisab'}`,
      `Estimated Zakat: ${fmtMoney(r.zakat.amount)}`, '',
      'Not a religious ruling. Consult qualified scholars.',
    ].join('\n')
    const url = URL.createObjectURL(new Blob([lines], { type: 'text/plain' }))
    const a = Object.assign(document.createElement('a'), { href: url, download: 'HalalVestss-zakat.txt' })
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Your Estimated Zakat</p>
        <p className="mt-2 text-5xl font-extrabold tabular-nums text-brand-700">{fmtMoney(r.zakat.amount)}</p>
        <p className="mt-2 text-sm text-slate-500">Zakatable wealth {fmtMoney(r.wealth.zakatable)} × {(r.rate * 100).toFixed(1)}%</p>
        <div className="mx-auto mt-4 grid max-w-sm grid-cols-3 gap-3 text-sm">
          <div><p className="text-slate-400">Nisab</p><p className="font-bold tabular-nums">{fmtMoney(r.nisab.value)}</p></div>
          <div><p className="text-slate-400">Basis</p><p className="font-bold">{r.nisab.metal}</p></div>
          <div><p className="text-slate-400">Status</p><p className={`font-bold ${r.zakat.aboveNisab ? 'text-emerald-700' : 'text-slate-500'}`}>{r.zakat.aboveNisab ? 'Above Nisab' : 'Below'}</p></div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-3 font-bold text-slate-900">Detailed calculation</h2>
        <div className="space-y-2 text-sm">
          {r.wealth.lines.map(l => (
            <div key={l.label} className="flex justify-between">
              <span className="text-slate-600">{l.label}</span>
              <span className="tabular-nums">{fmtMoney(l.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-slate-100 pt-2"><span>Subtotal</span><span className="tabular-nums">{fmtMoney(r.wealth.subtotal)}</span></div>
          <div className="flex justify-between text-red-600"><span>Eligible liabilities</span><span className="tabular-nums">−{fmtMoney(r.wealth.liabilities)}</span></div>
          <div className="flex justify-between border-t border-slate-100 pt-2 font-bold"><span>Estimated zakatable wealth</span><span className="tabular-nums">{fmtMoney(r.wealth.zakatable)}</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Nisab ({r.nisab.metal}, {fmtGrams(r.nisab.grams)})</span><span className="tabular-nums">{fmtMoney(r.nisab.value)}</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Rate</span><span>{(r.rate * 100).toFixed(1)}%</span></div>
          <div className="flex justify-between text-base font-extrabold text-brand-700"><span>Estimated Zakat</span><span className="tabular-nums">{fmtMoney(r.zakat.amount)}</span></div>
        </div>
      </Card>

      <Disclaimer />
      <p className="text-xs text-slate-500">
        <strong>Important:</strong> Zakat calculations depend on asset type, ownership, liabilities, inVestsment
        structure, and scholarly methodology. This is an educational estimate, not a religious ruling.
      </p>
      <div className="flex gap-3">
        <Button onClick={download}>Download calculation</Button>
        <Button variant="secondary" onClick={() => { clearZakatResult(); navigate('/zakat') }}>Start over</Button>
      </div>
    </div>
  )
}
