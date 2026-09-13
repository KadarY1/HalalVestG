// Static educational content for the Learn section. Prototype copy — educational
// only, not religious rulings. Readers should consult qualified scholars.

export const LEARN_TOPICS = [
  {
    slug: 'what-makes-an-investment-shariah-compliant',
    title: 'What Makes an Investment Shariah-Compliant?',
    minutes: 5,
    summary: 'The two layers of screening: what a company does, and how it finances itself.',
    body: [
      `Shariah-conscious investing typically looks at two separate questions. The first is the business-activity screen: what does the company actually do to earn money? Activities widely regarded as impermissible include conventional interest-based banking and insurance, alcohol, pork, gambling, adult entertainment, tobacco, and weapons manufacturing.`,
      `The second is the financial screen: even a permissible business can fail if it relies too heavily on interest-bearing debt, holds large amounts of interest-generating cash, or earns a meaningful share of revenue from prohibited sources. Different standards set different thresholds — which is why HalalVest lets you switch methodologies and shows every number behind a result.`,
      `A company that passes both layers is typically described as "appearing compliant under the selected methodology." That phrasing matters: it is a research output, not a fatwa.`,
    ],
  },
  {
    slug: 'what-is-zakat-on-stocks',
    title: 'What Is Zakat on Stocks?',
    minutes: 4,
    summary: 'How zakatable value of shares is generally estimated, and where opinions differ.',
    body: [
      `Zakat is generally due on wealth that has remained above the nisab threshold for one lunar year. For publicly traded shares, a common approach is to treat the current market value of shares held for investment as zakatable wealth at the 2.5% rate.`,
      `Some scholars distinguish between shares bought for long-term investment (zakatable on underlying assets) and shares held for trading (zakatable on market value), and some look through to the company's assets and liabilities. HalalVest's calculator uses market value as its default educational approach and always shows its assumptions.`,
      `Retirement accounts are handled separately: treatment varies depending on accessibility and scholarly methodology, so the calculator asks you rather than assuming.`,
    ],
  },
  {
    slug: 'what-is-nisab',
    title: 'What Is Nisab?',
    minutes: 3,
    summary: 'The minimum wealth threshold that makes Zakat obligatory — in gold or silver.',
    body: [
      `Nisab is the minimum amount of wealth a person must possess before Zakat becomes due. It is traditionally defined in terms of precious metals: 87.48 grams of gold, or 612.36 grams of silver.`,
      `Because gold and silver prices move, the dollar value of nisab changes over time. Using the silver nisab generally produces a lower threshold, which means more people become eligible to pay Zakat — a choice many scholars encourage for the benefit of recipients.`,
      `HalalVest lets you choose the basis, shows the metal quantity, the reference price, and its date, and clearly labels prototype prices as non-live.`,
    ],
  },
  {
    slug: 'what-is-purification',
    title: 'What Is Purification?',
    minutes: 4,
    summary: 'Why some compliant holdings still require donating a small portion of income.',
    body: [
      `A company can pass financial screening yet still earn a small amount of non-permissible income — interest on cash balances, for example. Purification is the practice of donating the portion of your dividend income attributable to that non-permissible revenue, so you do not personally benefit from it.`,
      `The estimate is straightforward: if a company's non-permissible income is 0.8% of revenue, roughly 0.8% of your dividend from that company is earmarked for purification under that methodology.`,
      `Methodologies differ on the details. HalalVest labels every purification figure as a prototype estimate and shows the exact ratio used.`,
    ],
  },
  {
    slug: 'can-muslims-invest-in-etfs',
    title: 'Can Muslims Invest in ETFs?',
    minutes: 4,
    summary: 'Index funds, halal-labeled funds, and the screening questions to ask.',
    body: [
      `A conventional index ETF holds whatever the index holds — including banks, insurers, and other non-compliant companies — so it will generally fail Shariah screening even if many of its holdings pass.`,
      `Halal-labeled ETFs exist that apply their own screening methodology. When evaluating one, look for transparency: which standard is used, how often holdings are re-screened, whether purification ratios are published, and who the Shariah advisers are.`,
      `HalalVest's research pages apply the same transparent breakdown to individual companies so you can understand what any fund you hold is actually invested in.`,
    ],
  },
  {
    slug: 'what-makes-a-business-non-compliant',
    title: 'What Makes a Business Non-Compliant?',
    minutes: 4,
    summary: 'Business-activity failures versus financial-structure failures.',
    body: [
      `There are two distinct routes to a non-compliant screening result. The first is the business model itself: a bank whose core revenue is interest, a brewer, a casino operator. No financial ratio can fix a prohibited primary activity.`,
      `The second is financial structure: a fundamentally permissible business that carries too much interest-bearing debt, parks too much cash in interest-bearing instruments, or earns too much prohibited income relative to revenue. These cases are where thresholds and methodologies genuinely matter, and where two reputable standards can reach different conclusions.`,
      `This is why HalalVest distinguishes "Requires Review" from "Non-Compliant" and shows exactly which screens failed.`,
    ],
  },
  {
    slug: 'why-screening-methodologies-differ',
    title: 'Why Do Halal Screening Methodologies Differ?',
    minutes: 5,
    summary: 'Debt ratios, market cap vs total assets, interest income — and honest disagreement.',
    body: [
      `Reasonable, qualified scholars and institutions genuinely differ on screening details. Should debt be measured against market capitalization or total assets? Is the cash ceiling 33% or 67%? Does interest income matter at 1% or 5% of revenue? Should receivables count as cash-like?`,
      `Well-known standards — AAOIFI, Dow Jones Islamic, FTSE Shariah, and others — answer these questions differently, which is why the same stock can be compliant in one halal index and excluded from another.`,
      `HalalVest treats methodology as configuration, not dogma. You can compare results under different thresholds, and every screen shows its number, its threshold, and its pass/fail result.`,
    ],
  },
  {
    slug: 'zakat-vs-taxes',
    title: 'How Does Zakat Differ From Taxes?',
    minutes: 3,
    summary: 'Wealth-based obligation, individual duty, and who receives it.',
    body: [
      `Taxes are obligations to a government, calculated under statutes and owed regardless of your wealth level. Zakat is an individual religious obligation calculated on qualifying wealth that has been held for a lunar year and exceeds the nisab threshold.`,
      `Zakat is generally 2.5% of zakatable wealth, while tax rates vary by income type and jurisdiction. Paying one does not ordinarily cancel the other — they operate on different bases and for different purposes.`,
      `Zakat funds are directed to specific categories of recipients described in classical texts. A financial calculator like HalalVest's can help you estimate the amount, but distribution and individual circumstances are matters for personal scholarly guidance.`,
    ],
  },
]

export const getTopic = (slug) => LEARN_TOPICS.find(t => t.slug === slug) || null
