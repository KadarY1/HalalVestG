import { METHODOLOGIES } from '../data/methodologies.js'
import { fmtPct } from '../lib/format.js'
import { Card, SectionTitle } from '../components/ui.jsx'
import { useStore } from '../context/store.jsx'
import { ShieldAlert } from 'lucide-react'

export default function Methodology() {
  const { methodology, update } = useStore()
  const pct = (x) => fmtPct(x * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Methodology</h1>
        <p className="text-sm text-slate-500">How HalalVests arrives at its screening results — fully transparent and configurable.</p>
      </div>

      <Card className="flex gap-3 border-amber-200 bg-amber-50 p-4">
        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm leading-relaxed text-amber-800">
          <strong>Different scholars, institutions, and Shariah standards may reach different conclusions regarding
          individual securities.</strong> HalalVests's prototype classifications should be treated as research outputs
          rather than religious rulings.
        </p>
      </Card>

      <Card className="p-6">
        <SectionTitle title="What is Shariah screening?" />
        <p className="leading-relaxed text-slate-700">
          Islamic inVestsing generally restricts certain business activities (what a company sells) and certain financial
          structures (how a company is financed). Screening applies two layers of checks: a business-activity screen and
          a financial-ratio screen. Securities that pass may still carry a small non-permissible income share — handled
          through purification — and wealth held above nisab may be subject to Zakat.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <SectionTitle title="Business Activity Screening" />
          <p className="text-sm leading-relaxed text-slate-600">
            Companies whose primary activity involves conventional interest-based banking or insurance, alcohol, pork,
            gambling, adult entertainment, tobacco, or weapons are flagged. A flagged primary activity fails the screen
            regardless of financial ratios.
          </p>
        </Card>
        <Card className="p-6">
          <SectionTitle title="Financial Ratio Screening" />
          <p className="text-sm text-slate-600">Active thresholds under <strong>{methodology.name}</strong>:</p>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
            <li>· Debt / market cap must be below <strong>{pct(methodology.debtMax)}</strong></li>
            <li>· Cash + receivables + interest securities / market cap below <strong>{pct(methodology.cashMax)}</strong></li>
            <li>· Interest-bearing securities / market cap below <strong>{pct(methodology.interestSecMax)}</strong></li>
            <li>· Interest income / revenue below <strong>{pct(methodology.interestIncomeMax)}</strong></li>
            <li>· Non-permissible income / revenue below <strong>{pct(methodology.nonPermIncomeMax)}</strong></li>
          </ul>
          <p className="mt-3 text-xs text-slate-400">Zero financial fails → Compliant. One fail → Requires Review. A business-activity flag or 2+ fails → Non-Compliant.</p>
        </Card>
        <Card className="p-6">
          <SectionTitle title="Purification" />
          <p className="text-sm leading-relaxed text-slate-600">
            Passing companies may still earn a small share of non-permissible income. The estimated portion of your
            dividends attributable to it is earmarked for purification (charity), calculated as dividends × the
            company's non-permissible income ratio.
          </p>
        </Card>
        <Card className="p-6">
          <SectionTitle title="Zakat & Nisab" />
          <p className="text-sm leading-relaxed text-slate-600">
            Nisab is {methodology.nisabGoldGrams} g of gold or {methodology.nisabSilverGrams} g of silver (prototype
            prices — not live). Zakatable wealth above nisab held for a lunar year is estimated at {(methodology.zakatRate * 100).toFixed(1)}%.
            Retirement-account treatment is user-configured, never assumed.
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <SectionTitle title="Select methodology" sub="Every screen and calculator updates immediately" />
        <div className="space-y-3">
          {Object.values(METHODOLOGIES).map(mm => (
            <label key={mm.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${methodology.id === mm.id ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:bg-slate-50'}`}>
              <input type="radio" name="meth" checked={methodology.id === mm.id} onChange={() => update({ methodology: mm.id })} className="mt-1" />
              <span>
                <span className="font-bold text-slate-900">{mm.name}</span>
                <span className="block text-sm text-slate-500">{mm.tagline}</span>
                <span className="mt-1 block text-xs text-slate-400">Debt {pct(mm.debtMax)} · Cash {pct(mm.cashMax)} · Int. income {pct(mm.interestIncomeMax)} · Non-perm {pct(mm.nonPermIncomeMax)}</span>
              </span>
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <SectionTitle title="Shariah Governance" />
        <p className="text-sm leading-relaxed text-slate-600">
          Future versions of HalalVests could incorporate review from qualified Islamic finance scholars and a formal
          Shariah advisory board. <strong>No such board currently exists</strong> for this prototype, and no result
          displayed here should be treated as a religious determination.
        </p>
      </Card>
    </div>
  )
}
