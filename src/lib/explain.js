// ============================================================================
// Plain-English explanation engine — turns screening output into sentences
// a beginner can understand. This is the "why" layer of the product.
// ============================================================================

const fmtB = (millions) => millions >= 1000 ? `$${(millions / 1000).toFixed(1)} billion` : `$${millions.toFixed(0)} million`
const pct = (x) => `${(x * 100).toFixed(1)}%`

// One-sentence, plain-language summary of the full screening result.
export function explainVerdict(company, screening, methodology) {
  const m = methodology
  if (!screening) return ''
  if (!screening.business.pass) {
    return `${company.name}'s core business is ${screening.business.flags[0].toLowerCase()}, which this methodology does not allow — so it fails the screen regardless of its finances.`
  }
  const failed = screening.financials.filter(f => !f.pass)
  if (failed.length === 0) {
    const tightest = screening.financials
      .map(f => ({ ...f, headroom: thresholdOf(f) - f.value }))
      .sort((a, b) => a.headroom - b.headroom)[0]
    return `${company.name} appears compliant under the ${m.name} methodology. The closest screen is ${tightest.label.toLowerCase()} at ${tightest.display} (limit ${tightest.threshold}), so it passes with some room to spare.`
  }
  if (failed.length === 1) {
    const f = failed[0]
    return `${company.name} mostly looks fine, but its ${f.label.toLowerCase()} is ${f.display} — just past the ${f.threshold} limit under the ${m.name} methodology. That's why it needs review rather than a clean pass or fail.`
  }
  return `${company.name} fails ${failed.length} financial screens under the ${m.name} methodology — ${failed.map(f => f.label.toLowerCase()).join(' and ')} — so it screens as non-compliant.`
}

// "What would change this result?" — the anxiety-killer panel.
export function explainTriggers(company, screening, methodology) {
  const m = methodology
  if (!screening) return []
  const mc = company.marketCap
  const f = company.fin
  const out = []
  if (!screening.business.pass) {
    out.push(`Only a change in the company's core business would change this — financial ratios don't rescue a prohibited primary activity.`)
    return out
  }
  screening.financials.forEach((s) => {
    if (s.key === 'debt') {
      out.push(`If total debt rose above ${fmtB(m.debtMax * mc)} (currently ${fmtB(f.debt)}), the debt screen would fail.`)
    } else if (s.key === 'cash') {
      out.push(`If cash-like assets exceeded ${fmtB(m.cashMax * mc)}, the cash screen would fail.`)
    } else if (s.key === 'intsec') {
      out.push(`If interest-bearing securities passed ${fmtB(m.interestSecMax * mc)}, this screen would fail.`)
    } else if (s.key === 'intinc') {
      out.push(`If interest income reached ${pct(m.interestIncomeMax)} of revenue, this screen would fail.`)
    } else if (s.key === 'nonperm') {
      out.push(`If non-permissible income reached ${pct(m.nonPermIncomeMax)} of revenue, purification would rise and the screen could fail.`)
    }
  })
  return out.slice(0, 3)
}

function thresholdOf(f) {
  return parseFloat(f.threshold.replace(/[^0-9.]/g, '')) / 100
}

// The "30-Second Brief" — what the company actually IS, before any numbers.
export function companyBrief(company) {
  const size = company.marketCap >= 200000 ? 'one of the largest companies in the world'
    : company.marketCap >= 10000 ? 'a large, established company'
    : company.marketCap >= 2000 ? 'a mid-sized company'
    : 'a smaller company'
  const dividendLine = company.dividendYield > 0
    ? `It pays a dividend (about ${company.dividendYield.toFixed(1)}% per year).`
    : `It doesn't currently pay a dividend — returns come from the share price.`
  const growthLine = company.revenueGrowth > 10 ? `Revenue is growing quickly (${company.revenueGrowth.toFixed(0)}% per year).`
    : company.revenueGrowth > 0 ? `Revenue is growing modestly (${company.revenueGrowth.toFixed(0)}% per year).`
    : `Revenue has recently been shrinking (${company.revenueGrowth.toFixed(0)}%).`
  return {
    whatItIs: company.description,
    context: `${company.name} is ${size} in the ${company.sector.toLowerCase()} sector, valued at ${fmtB(company.marketCap)}.`,
    growthLine,
    dividendLine,
  }
}