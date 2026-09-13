import { MoonStar, Search, ShieldCheck, Calculator, Eye, ArrowRight } from 'lucide-react'
import { Link } from '../lib/router.jsx'
import { Disclaimer } from '../components/ui.jsx'

const FEATURES = [
  { icon: Search, title: 'Research', body: 'Understand individual investments through financial metrics and transparent Shariah screening breakdowns.' },
  { icon: ShieldCheck, title: 'Shariah Screening', body: 'See how securities perform under a selected methodology — with every threshold and number visible.' },
  { icon: Calculator, title: 'Zakat', body: 'Estimate your annual Zakat obligation across cash, investments, metals, and business assets.' },
  { icon: Eye, title: 'Transparency', body: 'Every result shows its methodology, timestamp, and assumptions. Research output — never a fatwa.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 text-white"><MoonStar className="h-5 w-5" /></span>
          <span className="text-xl font-extrabold text-slate-900">Halal<span className="text-brand-700">Vests</span></span>
        </span>
        <Link to="/dashboard" className="text-sm font-semibold text-brand-700 hover:text-brand-800">Launch App →</Link>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pt-24">
        <p className="mb-4 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-700 ring-1 ring-inset ring-brand-200">
          Prototype — invest With Clarity. invest With Purpose.
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Understand your investments<br className="hidden sm:block" /> through a Shariah-conscious lens.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Research investments, understand Shariah screening, and estimate your Zakat — all in one place.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/screener" className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-800">
            Explore Research <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/zakat" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
            Calculate Zakat
          </Link>
          <Link to="/dashboard" className="text-sm font-semibold text-brand-700 hover:underline">Open demo dashboard →</Link>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card-hover rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5" /></span>
              <h3 className="font-bold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-4xl px-6 py-12">
        <Disclaimer />
        <p className="mt-4 text-center text-xs text-slate-400">Halalvests prototype · mock data · not a brokerage, adviser, or religious authority</p>
      </footer>
    </div>
  )
}
