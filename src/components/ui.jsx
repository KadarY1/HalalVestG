import { Link } from '../lib/router.jsx'

export const tones = {
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  red: 'bg-red-50 text-red-700 ring-red-200',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200',
  gold: 'bg-yellow-50 text-yellow-800 ring-yellow-200',
}
export const dotTones = { green: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500', slate: 'bg-slate-400', gold: 'bg-yellow-500' }

export function Card({ children, className = '', as: Tag = 'div' }) {
  return (
    <Tag className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </Tag>
  )
}

export function Badge({ tone = 'slate', children, dot = false }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotTones[tone]}`} />}
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const meta = { COMPLIANT: ['Compliant', 'green'], REVIEW: ['Requires Review', 'amber'], NON_COMPLIANT: ['Non-Compliant', 'red'] }[status] || ['Unknown', 'slate']
  return <Badge tone={meta[1]} dot>{meta[0]}</Badge>
}

export function SectionTitle({ title, sub, right }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export function Stat({ label, value, sub, tone = 'slate', tip }) {
  const color = tone === 'up' ? 'text-emerald-600' : tone === 'down' ? 'text-red-600' : 'text-slate-900'
  return (
    <div className="hv-tooltip" data-tip={tip || undefined}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
    </div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-sm',
    secondary: 'bg-white text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50',
    ghost: 'text-brand-700 hover:bg-brand-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }
  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between text-sm font-medium text-slate-700">
        {label}
        {hint && <span className="text-xs font-normal text-slate-400">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

export const inputCls = 'w-full rounded-xl border border-slate-300 px-3 py-2 text-sm tabular-nums focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100'

export function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
      {Icon && <Icon className="mb-3 h-8 w-8 text-slate-300" aria-hidden />}
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Disclaimer({ className = '' }) {
  return (
    <p className={`rounded-xl bg-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-500 ${className}`}>
      <strong className="font-semibold text-slate-600">Prototype — not advice.</strong> HalalVestss is a research and
      educational prototype. Shariah classifications are estimates produced by the selected screening methodology and
      the mock data available to the platform. They are not a fatwa, religious ruling, financial advice, or inVestsment
      recommendation. Prices and financials are mock data, not live market data. Consult qualified Islamic finance
      scholars and licensed financial professionals for individual guidance.
    </p>
  )
}

export function TrustRow({ updated, methodology, confidence }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
      {updated && <span>Data updated: <strong className="font-semibold text-slate-700">{updated}</strong></span>}
      {methodology && <span>Methodology: <strong className="font-semibold text-slate-700">{methodology}</strong></span>}
      {confidence && <span>Data confidence: <Badge tone={confidence === 'High' ? 'green' : 'amber'}>{confidence}</Badge></span>}
    </div>
  )
}

export function ChangePill({ value, className = '' }) {
  const up = value >= 0
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
      {up ? '▲' : '▼'} {up ? '+' : ''}{value.toFixed(2)}%
    </span>
  )
}

export { Link }
