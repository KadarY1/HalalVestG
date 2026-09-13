// Screening methodology configurations.
// Thresholds are illustrative prototype values, NOT religious rulings.
// Swap or extend this map to plug in a formal Shariah advisory framework later.

export const METHODOLOGIES = {
  illustrative: {
    id: 'illustrative',
    name: 'Illustrative / Prototype',
    tagline: 'Default prototype methodology. Balanced thresholds for demonstration.',
    debtMax: 0.33,          // total debt / market cap
    cashMax: 0.67,          // (cash + interest-bearing securities + receivables) / market cap
    interestSecMax: 0.33,   // interest-bearing securities / market cap
    interestIncomeMax: 0.05,// interest income / total revenue
    nonPermIncomeMax: 0.05, // non-permissible income / total revenue
    zakatRate: 0.025,
    nisabGoldGrams: 87.48,
    nisabSilverGrams: 612.36,
    goldPricePerGram: 118.0,
    silverPricePerGram: 1.42,
    priceAsOf: '2026-09-12 (prototype price — not live)',
    purificationBasis: 'nonPermIncome',
  },
  aaoifi: {
    id: 'aaoifi',
    name: 'AAOIFI-inspired',
    tagline: 'Approximation inspired by commonly cited AAOIFI screening ratios. Simplified for the prototype.',
    debtMax: 0.30,
    cashMax: 0.67,
    interestSecMax: 0.30,
    interestIncomeMax: 0.05,
    nonPermIncomeMax: 0.05,
    zakatRate: 0.025,
    nisabGoldGrams: 87.48,
    nisabSilverGrams: 612.36,
    goldPricePerGram: 118.0,
    silverPricePerGram: 1.42,
    priceAsOf: '2026-09-12 (prototype price — not live)',
    purificationBasis: 'nonPermIncome',
  },
  strict: {
    id: 'strict',
    name: 'Strict / Custom',
    tagline: 'A deliberately conservative custom configuration for comparison.',
    debtMax: 0.25,
    cashMax: 0.50,
    interestSecMax: 0.20,
    interestIncomeMax: 0.03,
    nonPermIncomeMax: 0.03,
    zakatRate: 0.025,
    nisabGoldGrams: 87.48,
    nisabSilverGrams: 612.36,
    goldPricePerGram: 118.0,
    silverPricePerGram: 1.42,
    priceAsOf: '2026-09-12 (prototype price — not live)',
    purificationBasis: 'nonPermIncome',
  },
}

export const DEFAULT_METHODOLOGY = 'illustrative'
