// ============================================================================
// Calculation engine — kept strictly separate from UI components.
// All Shariah-related logic is methodology-driven so thresholds can change
// without touching the interface. None of this constitutes a religious ruling.
// ============================================================================

export const STATUS = { COMPLIANT: 'COMPLIANT', REVIEW: 'REVIEW', NON_COMPLIANT: 'NON_COMPLIANT' }

export const STATUS_META = {
  COMPLIANT:      { label: 'Compliant',            short: 'Compliant',      tone: 'green' },
  REVIEW:         { label: 'Requires Review',      short: 'Review',        tone: 'amber' },
  NON_COMPLIANT:  { label: 'Non-Compliant',        short: 'Non-Compliant', tone: 'red'   },
}

// ---------------------------------------------------------------------------
// Shariah screening
// ---------------------------------------------------------------------------

const PROHIBITED_ACTIVITY_LABELS = {
  'conventional banking': 'Conventional interest-based banking',
  'conventional lending': 'Conventional interest-based lending',
  'conventional insurance': 'Conventional insurance',
  'conventional investment banking': 'Conventional investment banking',
  'alcohol': 'Alcohol production or distribution',
  'pork': 'Pork-related products',
  'gambling': 'Gambling operations',
  'adult entertainment': 'Adult entertainment',
  'tobacco': 'Tobacco products',
  'weapons': 'Weapons manufacturing',
  'reit': 'Interest-driven REIT structure',
}

export const businessActivityLabel = (flag) => PROHIBITED_ACTIVITY_LABELS[flag] || flag

// Returns { pass, flags } for the business-activity screen.
export function screenBusinessActivity(company) {
  const flags = (company.businessFlags || []).map(businessActivityLabel)
  return { pass: flags.length === 0, flags }
}

// Returns individual financial screens with values, thresholds and pass/fail.
export function screenFinancialRatios(company, m) {
  const mc = company.marketCap || 1 // $M
  const f = company.fin
  const debtRatio = f.debt / mc
  const cashLike = (f.cash + f.interestSecurities + f.receivables) / mc
  const intSecRatio = f.interestSecurities / mc
  return [
    {
      key: 'debt', label: 'Debt Ratio',
      hint: 'Compares the company’s qualifying interest-bearing debt with the market-value benchmark used by the selected screening methodology.',
      value: debtRatio, display: pct(debtRatio), threshold: `< ${pct(m.debtMax)}`,
      pass: debtRatio < m.debtMax, source: `$${fmtB(f.debt)} debt / $${fmtB(mc)} market cap`,
    },
    {
      key: 'cash', label: 'Cash & Receivables',
      hint: 'Cash, short-term interest-bearing securities and receivables measured against market capitalization.',
      value: cashLike, display: pct(cashLike), threshold: `< ${pct(m.cashMax)}`,
      pass: cashLike < m.cashMax, source: `$${fmtB(f.cash + f.interestSecurities + f.receivables)} / $${fmtB(mc)} market cap`,
    },
    {
      key: 'intsec', label: 'Interest-Bearing Securities',
      hint: 'Short-term securities that generate interest income, as a share of market capitalization.',
      value: intSecRatio, display: pct(intSecRatio), threshold: `< ${pct(m.interestSecMax)}`,
      pass: intSecRatio < m.interestSecMax, source: `$${fmtB(f.interestSecurities)} / $${fmtB(mc)} market cap`,
    },
    {
      key: 'intinc', label: 'Interest Income',
      hint: 'Interest and other prohibited income as a percentage of total revenue.',
      value: f.interestIncomePct, display: pct(f.interestIncomePct), threshold: `< ${pct(m.interestIncomeMax)}`,
      pass: f.interestIncomePct < m.interestIncomeMax, source: `${pct(f.interestIncomePct)} of total revenue`,
    },
    {
      key: 'nonperm', label: 'Non-Permissible Income',
      hint: 'Total non-permissible income (including interest) as a percentage of total revenue. Also drives the purification estimate.',
      value: f.nonPermIncomePct, display: pct(f.nonPermIncomePct), threshold: `< ${pct(m.nonPermIncomeMax)}`,
      pass: f.nonPermIncomePct < m.nonPermIncomeMax, source: `${pct(f.nonPermIncomePct)} of total revenue`,
    },
  ]
}

// Full screening result for a company under a methodology config.
export function screenStock(company, methodology) {
  if (!company) return null
  const business = screenBusinessActivity(company)
  const financials = screenFinancialRatios(company, methodology)
  const fails = financials.filter(f => !f.pass)
  let status
  if (!business.pass) status = STATUS.NON_COMPLIANT
  else if (fails.length === 0) status = STATUS.COMPLIANT
  else if (fails.length === 1) status = STATUS.REVIEW
  else status = STATUS.NON_COMPLIANT
  const purificationRequired = business.pass && company.fin.nonPermIncomePct > 0
  return {
    status, business, financials, purificationRequired,
    // rough confidence signal: more borderline metrics => lower confidence
    confidence: status === STATUS.COMPLIANT && fails.length === 0
      ? (financials.some(f => f.value > 0.8 * thresholdValue(f)) ? 'Medium' : 'High')
      : status === STATUS.REVIEW ? 'Medium' : 'High',
  }
}

function thresholdValue(f) {
  return parseFloat(f.threshold.replace(/[^0-9.]/g, '')) / 100
}

const pct = (x) => `${(x * 100).toFixed(1)}%`
const fmtB = (millions) => `${millions >= 1000 ? (millions / 1000).toFixed(1) + 'B' : millions.toFixed(0) + 'M'}`

// ---------------------------------------------------------------------------
// Purification
// ---------------------------------------------------------------------------

// Estimates the amount of dividend income attributable to non-permissible
// sources and therefore eligible for purification under this methodology.
export function calculatePurification({ dividends, nonPermIncomePct }) {
  const d = Math.max(0, Number(dividends) || 0)
  const r = Math.min(Math.max(0, Number(nonPermIncomePct) || 0), 1)
  return { ratio: r, amount: d * r, dividends: d }
}

// ---------------------------------------------------------------------------
// Zakat
// ---------------------------------------------------------------------------

export function calculateNisab(metal, methodology) {
  const m = methodology
  if (metal === 'gold') {
    return { grams: m.nisabGoldGrams, value: m.nisabGoldGrams * m.goldPricePerGram, metal: 'Gold' }
  }
  return { grams: m.nisabSilverGrams, value: m.nisabSilverGrams * m.silverPricePerGram, metal: 'Silver' }
}

/**
 * Zakat input model (all USD):
 *  cash: { checking, savings, physical }
 *  investments: { stocks, etfs, mutualFunds, other }
 *  retirement: { k401, ira, other, accessibility: 'full'|'partial'|'none' }
 *  metals: { goldGrams, silverGrams }
 *  business: { inventory, receivables, cash }
 *  liabilities (short-term, eligible)
 */
export function calculateZakatableWealth(inputs, methodology) {
  const m = methodology
  const c = inputs.cash, inv = inputs.investments, ret = inputs.retirement,
        met = inputs.metals, biz = inputs.business
  const num = (v) => Math.max(0, Number(v) || 0)

  const cashTotal = num(c.checking) + num(c.savings) + num(c.physical)

  const invTotal = num(inv.stocks) + num(inv.etfs) + num(inv.mutualFunds) + num(inv.other)

  // Retirement accessibility is user-configurable on purpose — scholarly
  // treatment differs. We apply a configurable weight, never a hidden default.
  const RETIREMENT_ACCESS_FACTOR = { full: 1, partial: 0.5, none: 0 }
  const retFactor = RETIREMENT_ACCESS_FACTOR[ret.accessibility] ?? 0
  const retRaw = num(ret.k401) + num(ret.ira) + num(ret.other)
  const retTotal = retRaw * retFactor

  const metalValue =
    num(met.goldGrams) * m.goldPricePerGram + num(met.silverGrams) * m.silverPricePerGram

  const bizTotal = num(biz.inventory) + num(biz.receivables) + num(biz.cash)

  const liabilities = Math.min(num(inputs.liabilities), cashTotal + invTotal + retTotal + metalValue + bizTotal)
  const subtotal = cashTotal + invTotal + retTotal + metalValue + bizTotal
  const zakatable = Math.max(0, subtotal - liabilities)
  return {
    lines: [
      { label: 'Cash & Equivalents', amount: cashTotal },
      { label: 'Investments', amount: invTotal },
      { label: `Retirement (${ret.accessibility === 'full' ? 'fully accessible' : ret.accessibility === 'partial' ? 'partially accessible' : 'not currently accessible'})`, amount: retTotal, note: retRaw !== retTotal ? `Raw total $${retRaw.toLocaleString()} × ${retFactor}` : undefined },
      { label: 'Precious Metals', amount: metalValue },
      { label: 'Business Assets', amount: bizTotal },
    ],
    subtotal, liabilities, zakatable,
  }
}

export function calculateZakat(zakatable, nisabValue, methodology) {
  const aboveNisab = zakatable >= nisabValue
  return {
    aboveNisab,
    rate: methodology.zakatRate,
    amount: aboveNisab ? zakatable * methodology.zakatRate : 0,
  }
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

// holdings: [{ ticker, shares }]; cash in USD.
export function summarizePortfolio(holdings, cash, getCompany, methodology) {
  const rows = holdings.map(h => {
    const c = getCompany(h.ticker)
    if (!c) return null
    const value = c.price * h.shares
    const dayChange = c.change * h.shares
    const screening = screenStock(c, methodology)
    return { ...h, company: c, value, dayChange, cost: h.costBasis != null ? h.costBasis * h.shares : value, screening }
  }).filter(Boolean)
  const invested = rows.reduce((s, r) => s + r.value, 0)
  const total = invested + Math.max(0, cash || 0)
  const dayChange = rows.reduce((s, r) => s + r.dayChange, 0)
  const cost = rows.reduce((s, r) => s + r.cost, 0)
  const gain = invested - cost
  rows.forEach(r => { r.weight = total > 0 ? r.value / total : 0 })
  const counts = { COMPLIANT: 0, REVIEW: 0, NON_COMPLIANT: 0 }
  rows.forEach(r => counts[r.screening.status]++)
  return {
    rows, total, invested, cash: Math.max(0, cash || 0), dayChange,
    gain, gainPct: cost > 0 ? (gain / cost) * 100 : 0,
    counts, health: calculatePortfolioShariahHealth(rows),
    sectorBreakdown: sectorBreakdown(rows, total),
  }
}

function sectorBreakdown(rows, total) {
  const map = {}
  rows.forEach(r => { map[r.company.sector] = (map[r.company.sector] || 0) + r.value })
  return Object.entries(map).map(([sector, value]) => ({ sector, value, weight: total > 0 ? value / total : 0 }))
       .sort((a, b) => b.value - a.value)
}

// A transparent, clearly-labeled heuristic — NOT a religious verdict.
export function calculatePortfolioShariahHealth(rows) {
  if (!rows.length) return { score: 0, label: 'No holdings' }
  const invested = rows.reduce((s, r) => s + r.value, 0) || 1
  const weighted = rows.reduce((s, r) => {
    const w = r.value / invested
    if (r.screening.status === STATUS.COMPLIANT) return s + w * 100
    if (r.screening.status === STATUS.REVIEW) return s + w * 55
    return s + w * 0
  }, 0)
  const score = Math.round(weighted)
  return {
    score,
    label: score >= 90 ? 'Strong screening health' : score >= 70 ? 'Good screening health' : score >= 40 ? 'Mixed — several holdings need review' : 'Low — most holdings fail the selected methodology',
  }
}
