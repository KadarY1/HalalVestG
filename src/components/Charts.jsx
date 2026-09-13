import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
         PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { fmtMoney } from '../lib/format.js'

const GREEN = '#047857', GOLD = '#d4a017', SLATE = '#94a3b8', AMBER = '#f59e0b', RED = '#ef4444'
export const PIE_COLORS = [GREEN, GOLD, '#0ea5e9', '#8b5cf6', '#f97316', '#14b8a6', '#64748b', AMBER]

export function PriceChart({ history, height = 240 }) {
  const data = (history || []).map((p, i) => ({ i, p }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="hv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GREEN} stopOpacity={0.25} />
            <stop offset="100%" stopColor={GREEN} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="i" hide />
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Tooltip formatter={(v) => [fmtMoney(v), 'Price']} labelFormatter={() => 'Mock 90-session history'}
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
        <Area type="monotone" dataKey="p" stroke={GREEN} strokeWidth={2} fill="url(#hv)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function Sparkline({ history, up = true, height = 40 }) {
  const data = (history || []).map((p, i) => ({ i, p }))
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <Area type="monotone" dataKey="p" stroke={up ? GREEN : RED} strokeWidth={1.5}
          fill={up ? GREEN : RED} fillOpacity={0.08} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function AllocationPie({ data, height = 260 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}
          paddingAngle={2} strokeWidth={0}>
          {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => fmtMoney(v)}
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function SectorBar({ data, height = 240 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="sector" width={110} tick={{ fontSize: 12, fill: '#475569' }} />
        <Tooltip formatter={(v) => [fmtMoney(v), 'Value']}
          contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
        <Bar dataKey="value" fill={GREEN} radius={[0, 6, 6, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  )
}
