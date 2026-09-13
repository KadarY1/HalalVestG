import { METHODOLOGIES } from '../data/methodologies.js'
import { useStore } from '../context/store.jsx'
import { fmtMoney } from '../lib/format.js'
import { Card, SectionTitle, Button, Disclaimer } from '../components/ui.jsx'
import { DATA_AS_OF } from '../data/companies.js'

export default function Settings() {
  const { methodology, update } = useStore()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>

      <Card className="p-6">
        <SectionTitle title="Default screening methodology" />
        <select value={methodology.id} onChange={(e) => update({ methodology: e.target.value })}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm" aria-label="Default methodology">
          {Object.values(METHODOLOGIES).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </Card>

      <Card className="p-6">
        <SectionTitle title="Reference prices" sub={`Prototype prices — not live · ${methodology.priceAsOf}`} />
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p className="rounded-xl bg-slate-50 p-3">Gold: <strong>{fmtMoney(methodology.goldPricePerGram)}/g</strong></p>
          <p className="rounded-xl bg-slate-50 p-3">Silver: <strong>{fmtMoney(methodology.silverPricePerGram)}/g</strong></p>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Live gold/silver pricing can be connected later by replacing the methodology config — no UI changes required.
        </p>
      </Card>

      <Card className="p-6">
        <SectionTitle title="Data & demo" />
        <p className="text-sm text-slate-600">All prices, financials, and screening inputs are <strong>mock prototype data</strong> (as of {DATA_AS_OF}). State is stored locally in your browser only.</p>
        <Button variant="secondary" className="mt-4" onClick={() => { localStorage.clear(); sessionStorage.clear(); location.reload() }}>
          Reset demo data
        </Button>
      </Card>

      <Disclaimer />
    </div>
  )
}
