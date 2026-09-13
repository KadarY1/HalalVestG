// Shared formatting helpers.

export const fmtMoney = (n, opts = {}) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 2, maximumFractionDigits: 2, ...opts,
  }).format(Number.isFinite(n) ? n : 0)

export const fmtNum = (n, digits = 2) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 }).format(Number.isFinite(n) ? n : 0)

export const fmtPct = (n, digits = 1) =>
  `${Number.isFinite(n) ? n.toFixed(digits) : '0.0'}%`

export const fmtCompact = (n) => {
  if (!Number.isFinite(n)) return '—'
  const abs = Math.abs(n)
  if (abs >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (abs >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (abs >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return fmtMoney(n, { maximumFractionDigits: 0 })
}

// marketCap in the mock dataset is stored in $ millions.
export const fmtMarketCap = (millions) => fmtCompact(millions * 1e6)

export const fmtGrams = (g) => `${Number.isFinite(g) ? g.toFixed(2) : '0.00'} g`

export const parseAmount = (raw) => {
  const n = parseFloat(String(raw).replace(/[$,\s]/g, ''))
  return Number.isFinite(n) && n >= 0 ? n : NaN
}


