import { useState } from 'react'
import { useStore } from '../context/store.jsx'
import { summarizePortfolio } from '../lib/calculations.js'
import { fmtMoney, fmtPct } from '../lib/format.js'
import { Card, Button, EmptyState, Link } from '../components/ui.jsx'
import { Plus, Briefcase, Trash2 } from 'lucide-react'

export default function Portfolio() {
  const { portfolios, getCompany, methodology, createPortfolio, deletePortfolio } = useStore()
  const [name, setName] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Portfolios</h1>
          <p className="text-sm text-slate-500">Hypothetical portfolios — no real money is held or traded.</p>
        </div>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { createPortfolio(name.trim()); setName('') } }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New portfolio name…"
            className="rounded-xl border border-slate-300 px-3 py-2 text-sm" aria-label="Portfolio name" />
          <Button type="submit"><Plus className="h-4 w-4" /> Create</Button>
        </form>
      </div>

      {portfolios.length === 0 && (
        <EmptyState icon={Briefcase} title="No portfolio yet"
          body="Create your first portfolio to track holdings and Shariah screening results."
          action={<Button onClick={() => createPortfolio('My Halal Portfolio')}>Create Portfolio</Button>} />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {portfolios.map(p => {
          const sum = summarizePortfolio(p.holdings, p.cash, getCompany, methodology)
          return (
            <Card key={p.id} className="card-hover p-5">
              <div className="flex items-start justify-between">
                <Link to={`/portfolio/${p.id}`}><h2 className="font-bold text-slate-900 hover:text-brand-700">{p.name}</h2></Link>
                <button onClick={() => { if (confirm(`Delete “${p.name}”?`)) deletePortfolio(p.id) }}
                  className="text-slate-300 hover:text-red-500" aria-label="Delete portfolio"><Trash2 className="h-4 w-4" /></button>
              </div>
              <p className="mt-2 text-2xl font-extrabold tabular-nums">{fmtMoney(sum.total)}</p>
              <p className={`text-sm font-semibold ${sum.gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {sum.gain >= 0 ? '+' : ''}{fmtMoney(sum.gain)} ({fmtPct(sum.gainPct)})
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-slate-400">{sum.rows.length} holdings · {fmtMoney(sum.cash)} cash · Screening health {sum.health.score}/100</span>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
