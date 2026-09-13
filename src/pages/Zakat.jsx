import { useMemo, useState } from 'react'
import { useStore } from '../context/store.jsx'
import { calculateNisab, calculateZakatableWealth, calculateZakat } from '../lib/calculations.js'
import { fmtMoney, fmtGrams } from '../lib/format.js'
import { Card, SectionTitle, Button, Field, inputCls, Disclaimer } from '../components/ui.jsx'
import { saveZakatResult } from '../lib/zakatSession.js'
import { navigate } from '../lib/router.jsx'

const empty = {
  cash: { checking: '', savings: '', physical: '' },
  investments: { stocks: '', etfs: '', mutualFunds: '', other: '' },
  retirement: { k401: '', ira: '', other: '', accessibility: 'none' },
  metals: { goldGrams: '', silverGrams: '' },
  business: { inventory: '', receivables: '', cash: '' },
  liabilities: '',
}

const Num = ({ value, onChange, ...props }) => (
  <input type="number" min="0" inputMode="decimal" value={value}
    onChange={(e) => onChange(e.target.value < 0 ? '0' : e.target.value)}
    className={inputCls} {...props} />
)

function numObj(o) { return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, Number(v) || 0])) }

export default function Zakat() {
  const { methodology } = useStore()
  const [form, setForm] = useState(empty)
  const [basis, setBasis] = useState('gold')
  const m = methodology

  const set = (section, key) => (v) => setForm(f => ({ ...f, [section]: { ...f[section], [key]: v } }))

  const wealth = useMemo(() => calculateZakatableWealth({
    cash: numObj(form.cash), investments: numObj(form.investments),
    retirement: { ...form.retirement, ...numObj({ k401: form.retirement.k401, ira: form.retirement.ira, other: form.retirement.other }) },
    metals: numObj(form.metals), business: numObj(form.business),
    liabilities: Number(form.liabilities) || 0,
  }, m), [form, m])

  const nisab = calculateNisab(basis, m)
  const zakat = calculateZakat(wealth.zakatable, nisab.value, m)

  const submit = () => {
    saveZakatResult({ inputs: form, basis, wealth, nisab, zakat, methodology: m.name, rate: m.zakatRate })
    navigate('/zakat/results')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Zakat Calculator</h1>
        <p className="text-sm text-slate-500">Educational estimate. Assumptions are shown at every step.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card className="p-5"><SectionTitle title="Cash" />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Checking"><Num value={form.cash.checking} onChange={set('cash', 'checking')} aria-label="Checking" /></Field>
              <Field label="Savings"><Num value={form.cash.savings} onChange={set('cash', 'savings')} aria-label="Savings" /></Field>
              <Field label="Physical cash"><Num value={form.cash.physical} onChange={set('cash', 'physical')} aria-label="Physical cash" /></Field>
            </div>
          </Card>

          <Card className="p-5"><SectionTitle title="investments" sub="Current market value" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Stocks"><Num value={form.investments.stocks} onChange={set('investments', 'stocks')} aria-label="Stocks" /></Field>
              <Field label="ETFs"><Num value={form.investments.etfs} onChange={set('investments', 'etfs')} aria-label="ETFs" /></Field>
              <Field label="Mutual funds"><Num value={form.investments.mutualFunds} onChange={set('investments', 'mutualFunds')} aria-label="Mutual funds" /></Field>
              <Field label="Other investments"><Num value={form.investments.other} onChange={set('investments', 'other')} aria-label="Other investments" /></Field>
            </div>
          </Card>

          <Card className="p-5"><SectionTitle title="Retirement Accounts" />
            <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-inset ring-amber-200">
              Treatment of retirement accounts for Zakat can differ depending on scholarly methodology and
              circumstances. Choose how accessible these assets are to you — the calculator never assumes for you.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="401(k)"><Num value={form.retirement.k401} onChange={set('retirement', 'k401')} aria-label="401k" /></Field>
              <Field label="IRA"><Num value={form.retirement.ira} onChange={set('retirement', 'ira')} aria-label="IRA" /></Field>
              <Field label="Other retirement"><Num value={form.retirement.other} onChange={set('retirement', 'other')} aria-label="Other retirement" /></Field>
              <Field label="Accessibility">
                <select value={form.retirement.accessibility} onChange={(e) => set('retirement', 'accessibility')(e.target.value)}
                  className={inputCls} aria-label="Retirement accessibility">
                  <option value="full">Fully accessible (count 100%)</option>
                  <option value="partial">Partially accessible (count 50%)</option>
                  <option value="none">Not currently accessible (count 0%)</option>
                </select>
              </Field>
            </div>
          </Card>

          <Card className="p-5"><SectionTitle title="Precious Metals" sub={`${fmtMoney(m.goldPricePerGram)}/g gold · ${fmtMoney(m.silverPricePerGram)}/g silver — prototype price, not live`} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Gold (grams)"><Num value={form.metals.goldGrams} onChange={set('metals', 'goldGrams')} aria-label="Gold grams" /></Field>
              <Field label="Silver (grams)"><Num value={form.metals.silverGrams} onChange={set('metals', 'silverGrams')} aria-label="Silver grams" /></Field>
            </div>
          </Card>

          <Card className="p-5"><SectionTitle title="Business Assets" />
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Inventory"><Num value={form.business.inventory} onChange={set('business', 'inventory')} aria-label="Inventory" /></Field>
              <Field label="Receivables"><Num value={form.business.receivables} onChange={set('business', 'receivables')} aria-label="Receivables" /></Field>
              <Field label="Business cash"><Num value={form.business.cash} onChange={set('business', 'cash')} aria-label="Business cash" /></Field>
            </div>
          </Card>

          <Card className="p-5"><SectionTitle title="Short-Term Liabilities" sub="Deducted only up to the total of zakatable assets" />
            <Field label="Eligible liabilities"><Num value={form.liabilities} onChange={(v) => setForm(f => ({ ...f, liabilities: v }))} aria-label="Liabilities" /></Field>
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <Card className="space-y-4 p-5">
            <SectionTitle title="Nisab" />
            <div className="flex gap-2">
              {[['gold', 'Gold basis'], ['silver', 'Silver basis']].map(([v, l]) => (
                <button key={v} onClick={() => setBasis(v)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${basis === v ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'}`}>{l}</button>
              ))}
            </div>
            <p className="text-sm text-slate-600">{fmtGrams(nisab.grams)} {nisab.metal} × {fmtMoney(basis === 'gold' ? m.goldPricePerGram : m.silverPricePerGram)}/g</p>
            <p className="text-xl font-extrabold tabular-nums">{fmtMoney(nisab.value)}</p>
            <p className="text-xs text-slate-400">{m.priceAsOf}</p>

            <hr className="border-slate-100" />
            <SectionTitle title="Live Estimate" />
            {wealth.lines.filter(l => l.amount > 0).map(l => (
              <div key={l.label} className="flex justify-between text-sm">
                <span className="text-slate-500">{l.label}</span>
                <span className="font-semibold tabular-nums">{fmtMoney(l.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="tabular-nums">{fmtMoney(wealth.subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Liabilities</span><span className="tabular-nums text-red-600">−{fmtMoney(wealth.liabilities)}</span></div>
            <div className="flex justify-between border-t border-slate-100 pt-2 font-bold">
              <span>Zakatable wealth</span><span className="tabular-nums">{fmtMoney(wealth.zakatable)}</span>
            </div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Status</span>
              <span className={`font-bold ${zakat.aboveNisab ? 'text-emerald-700' : 'text-slate-500'}`}>{zakat.aboveNisab ? 'Above Nisab' : 'Below Nisab'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Rate</span><span>{(zakat.rate * 100).toFixed(1)}%</span></div>
            <div className="flex justify-between text-lg font-extrabold"><span>Est. Zakat</span><span className="tabular-nums text-brand-700">{fmtMoney(zakat.amount)}</span></div>

            <Button className="w-full" onClick={submit}>Calculate & view breakdown →</Button>
            <Button variant="secondary" className="w-full" onClick={() => setForm(empty)}>Start over</Button>
          </Card>
        </div>
      </div>
      <Disclaimer />
    </div>
  )
}
