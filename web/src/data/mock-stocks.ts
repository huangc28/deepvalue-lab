import type { DashboardBucket, StockDetail } from '../types/stocks'

export const mockStocks: StockDetail[] = [
  {
    id: 'tsm',
    ticker: 'TSM',
    companyName: 'Taiwan Semiconductor',
    businessType: 'Semicap / Foundry Compounder',
    currentPrice: 171.4,
    valuationStatus: 'cheap',
    newsImpactStatus: 'improving',
    thesisStatus: 'intact',
    technicalEntryStatus: 'neutral',
    actionState: 'watch for confirmation',
    dashboardBucket: 'needs-review',
    baseFairValue: 210,
    bearFairValue: 184,
    bullFairValue: 245,
    discountToBase: -18.4,
    summary:
      'Base valuation still suggests upside, but entry timing has not fully stabilized.',
    lastUpdated: '2026-03-16',
    thesisStatement:
      'Leadership in advanced nodes and packaging keeps TSM central to AI compute demand.',
    thesisBullets: [
      'Advanced packaging demand remains supply-constrained in a constructive way.',
      'Margin profile depends on execution against overseas fab dilution.',
      'The market still discounts geopolitical and capital intensity risks aggressively.',
    ],
    variantPerception:
      'The market may be over-penalizing TSM for capex intensity while underestimating packaging bottlenecks as a durable support.',
    valuationLens: {
      primary: 'Forward P/E',
      crossCheck: 'Normalized FCF yield',
      rationale:
        'TSM behaves like a high-quality foundry compounder with strong cash generation, but capex intensity still warrants a cross-check.',
    },
    currentValuationSnapshot: {
      marketCap: '$890B',
      enterpriseValue: '$845B',
      multiples: ['19.8x forward P/E', '3.2% normalized FCF yield'],
      balanceSheetNote: 'Net cash remains a support against cyclical downside.',
    },
    newsToModel: [
      {
        event:
          'Advanced packaging capacity expansion stayed sold out through next year.',
        modelVariableChanged: 'Revenue mix and scenario probability',
        impact:
          'Raises confidence in the base and bull cases because high-value AI packaging remains capacity-constrained.',
        affectedScenario: 'base / bull',
      },
      {
        event:
          'Overseas fab ramp commentary points to near-term margin dilution.',
        modelVariableChanged: 'Gross margin',
        impact:
          'Keeps the bear case relevant and caps multiple expansion near term.',
        affectedScenario: 'bear / base',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption:
          'AI demand moderates and overseas dilution drags margins.',
        valuationAssumption: '17x forward earnings',
        fairValue: '$184',
        whatMustBeTrue:
          'Packaging constraints ease faster than expected and macro stays soft.',
      },
      {
        label: 'Base',
        operatingAssumption:
          'AI-related demand stays robust with manageable overseas dilution.',
        valuationAssumption: '19x forward earnings',
        fairValue: '$210',
        whatMustBeTrue:
          'Management executes node and packaging ramps without major geopolitical disruption.',
      },
      {
        label: 'Bull',
        operatingAssumption:
          'AI demand and pricing power persist, while margins recover faster.',
        valuationAssumption: '21x forward earnings',
        fairValue: '$245',
        whatMustBeTrue:
          'Advanced nodes and packaging remain bottlenecked in a constructive way.',
      },
    ],
    currentPriceImplies:
      'The current price implies the market is underwriting only moderate AI upside and a prolonged capex penalty.',
    monitorNext: [
      'Quarterly revenue against management guidance',
      'Advanced packaging utilization and pricing commentary',
      'Margin dilution from overseas fabs',
    ],
    sourcesUsed: [
      'Latest earnings release',
      'Latest investor presentation',
      'Recent management guidance commentary',
    ],
    history: [
      '2026-03-12: Fair value range widened after packaging capacity update.',
      '2026-03-16: Technical status moved from stretched to neutral.',
    ],
  },
  {
    id: 'adbe',
    ticker: 'ADBE',
    companyName: 'Adobe',
    businessType: 'Mature Compounder',
    currentPrice: 482.1,
    valuationStatus: 'cheap',
    newsImpactStatus: 'unchanged',
    thesisStatus: 'intact',
    technicalEntryStatus: 'favorable',
    actionState: 'strong accumulation',
    dashboardBucket: 'now-actionable',
    baseFairValue: 620,
    bearFairValue: 520,
    bullFairValue: 690,
    discountToBase: -22.2,
    summary:
      'Valuation support and favorable technical setup align, while the core thesis remains intact.',
    lastUpdated: '2026-03-16',
    thesisStatement:
      'Adobe remains a strong software franchise with high cash conversion and durable pricing power.',
    thesisBullets: [
      'Creative and Document clouds still form a sticky recurring revenue base.',
      'The market remains skeptical on AI monetization, which creates room for re-rating.',
      'Execution risk is more about growth re-acceleration than business fragility.',
    ],
    variantPerception:
      'The market may be treating Adobe as a no-growth software asset even though monetization levers remain underappreciated.',
    valuationLens: {
      primary: 'Forward P/E',
      crossCheck: 'FCF yield',
      rationale:
        'Adobe is a mature, cash-generative software company, so earnings and free cash flow both matter.',
    },
    currentValuationSnapshot: {
      marketCap: '$215B',
      enterpriseValue: '$210B',
      multiples: ['21.5x forward P/E', '4.4% FCF yield'],
      balanceSheetNote:
        'Balance sheet is not a primary risk driver in the current setup.',
    },
    newsToModel: [
      {
        event:
          'Recent quarterly print showed stable core demand with no major guidance downgrade.',
        modelVariableChanged: 'Scenario probability',
        impact:
          'Supports the base case without materially changing near-term fair value.',
        affectedScenario: 'base',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption:
          'Creative pricing weakens and AI monetization disappoints.',
        valuationAssumption: '20x forward earnings',
        fairValue: '$520',
        whatMustBeTrue: 'Growth remains muted for multiple quarters.',
      },
      {
        label: 'Base',
        operatingAssumption:
          'Core products compound steadily and AI monetization ramps gradually.',
        valuationAssumption: '24x forward earnings',
        fairValue: '$620',
        whatMustBeTrue:
          'Retention stays high and pricing power remains intact.',
      },
      {
        label: 'Bull',
        operatingAssumption: 'AI monetization expands faster than expected.',
        valuationAssumption: '26x forward earnings',
        fairValue: '$690',
        whatMustBeTrue:
          'New AI features convert into higher ARPU meaningfully.',
      },
    ],
    currentPriceImplies:
      'The market appears to be underwriting structurally lower growth and limited AI monetization.',
    monitorNext: [
      'Net new ARR momentum',
      'AI feature monetization uptake',
      'Free cash flow durability',
    ],
    sourcesUsed: ['Latest earnings release', 'Recent earnings call transcript'],
    history: ['2026-03-14: Action state upgraded to strong accumulation.'],
  },
  {
    id: 'avgo',
    ticker: 'AVGO',
    companyName: 'Broadcom',
    businessType: 'Capital-Intensive Hybrid',
    currentPrice: 1412,
    valuationStatus: 'fair',
    newsImpactStatus: 'improving',
    thesisStatus: 'intact',
    technicalEntryStatus: 'neutral',
    actionState: 'fairly valued',
    dashboardBucket: 'needs-review',
    baseFairValue: 1450,
    bearFairValue: 1220,
    bullFairValue: 1620,
    discountToBase: -2.6,
    summary:
      'The AI story remains supportive, but the current price already discounts a solid portion of that upside.',
    lastUpdated: '2026-03-16',
    thesisStatement:
      'Broadcom is a hybrid semiconductor and infrastructure software business with meaningful AI optionality.',
    thesisBullets: [
      'Custom AI silicon remains the key support for a premium narrative.',
      'Software resilience helps cushion cyclicality elsewhere in the portfolio.',
      'Multiple expansion is vulnerable if AI growth broadens more slowly than expected.',
    ],
    variantPerception:
      'The debate is less about quality and more about how much AI upside is already embedded in the multiple.',
    valuationLens: {
      primary: 'Forward EV/EBITDA',
      crossCheck: 'Forward P/E',
      rationale:
        'Broadcom blends capital intensity, acquisition history, and cash generation, so EV-based valuation is the cleaner anchor.',
    },
    currentValuationSnapshot: {
      marketCap: '$655B',
      enterpriseValue: '$705B',
      multiples: ['24.0x forward EV/EBITDA', '28.1x forward P/E'],
      balanceSheetNote:
        'Leverage remains relevant after large capital allocation moves.',
    },
    newsToModel: [
      {
        event: 'Management reiterated strong custom AI demand.',
        modelVariableChanged: 'Revenue growth and multiple support',
        impact:
          'Supports the upper half of the base case, but does not yet justify a large step-up in fair value.',
        affectedScenario: 'base / bull',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption:
          'AI custom silicon demand normalizes faster than expected.',
        valuationAssumption: '20x forward EV/EBITDA',
        fairValue: '$1220',
        whatMustBeTrue:
          'AI revenue concentration proves less durable than the market hopes.',
      },
      {
        label: 'Base',
        operatingAssumption:
          'AI demand remains healthy and software stays resilient.',
        valuationAssumption: '23x forward EV/EBITDA',
        fairValue: '$1450',
        whatMustBeTrue: 'Execution stays balanced across semi and software.',
      },
      {
        label: 'Bull',
        operatingAssumption:
          'AI programs scale faster and deserve a higher blended multiple.',
        valuationAssumption: '25x forward EV/EBITDA',
        fairValue: '$1620',
        whatMustBeTrue:
          'Customer AI programs expand with less cyclicality than expected.',
      },
    ],
    currentPriceImplies:
      'The market already prices in continued AI strength and a stable software contribution.',
    monitorNext: [
      'Quarterly AI semiconductor revenue',
      'Software renewal stability',
      'Leverage trajectory',
    ],
    sourcesUsed: ['Latest earnings release', 'Recent investor commentary'],
    history: [
      '2026-03-15: News impact moved to improving after AI demand update.',
    ],
  },
  {
    id: 'meta',
    ticker: 'META',
    companyName: 'Meta Platforms',
    businessType: 'High-Growth Platform',
    currentPrice: 612.5,
    valuationStatus: 'rich',
    newsImpactStatus: 'unchanged',
    thesisStatus: 'intact',
    technicalEntryStatus: 'stretched',
    actionState: 'trim zone',
    dashboardBucket: 'at-risk',
    baseFairValue: 565,
    bearFairValue: 480,
    bullFairValue: 645,
    discountToBase: 8.4,
    summary:
      'Execution remains strong, but the stock price has moved ahead of the base case.',
    lastUpdated: '2026-03-16',
    thesisStatement:
      'Meta remains a highly efficient ad platform with significant AI leverage, but valuation already reflects much of that strength.',
    thesisBullets: [
      'Ad efficiency remains the core economic engine.',
      'AI investment may still pay off, but the market is already rewarding that view aggressively.',
      'Risk-reward depends more on expectations than on business quality alone.',
    ],
    variantPerception:
      'The market may now be too optimistic on the speed at which AI investment translates into durable upside beyond current expectations.',
    valuationLens: {
      primary: 'Forward P/E',
      crossCheck: 'FCF yield',
      rationale:
        'Meta remains a scaled, highly profitable digital platform with strong cash generation.',
    },
    currentValuationSnapshot: {
      marketCap: '$1.55T',
      enterpriseValue: '$1.48T',
      multiples: ['25.8x forward P/E', '3.6% FCF yield'],
      balanceSheetNote:
        'Net cash provides flexibility, but does not make the stock cheap.',
    },
    newsToModel: [
      {
        event:
          'Recent ad checks remained solid with no major surprise to consensus.',
        modelVariableChanged: 'Scenario probability',
        impact:
          'Keeps the base case intact rather than materially changing fair value.',
        affectedScenario: 'base',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption:
          'AI capex stays elevated while ad growth normalizes.',
        valuationAssumption: '21x forward earnings',
        fairValue: '$480',
        whatMustBeTrue: 'Return on AI investment takes longer to materialize.',
      },
      {
        label: 'Base',
        operatingAssumption:
          'Ad engine remains healthy and AI investment is absorbed.',
        valuationAssumption: '24x forward earnings',
        fairValue: '$565',
        whatMustBeTrue: 'Margins remain resilient despite elevated AI capex.',
      },
      {
        label: 'Bull',
        operatingAssumption:
          'AI drives stronger monetization and engagement upside.',
        valuationAssumption: '26x forward earnings',
        fairValue: '$645',
        whatMustBeTrue:
          'AI spend generates higher monetization faster than expected.',
      },
    ],
    currentPriceImplies:
      'The current price implies that the market is already underwriting strong execution and meaningful AI payoff.',
    monitorNext: [
      'Ad pricing and impression trends',
      'Capex discipline versus AI spend',
      'Evidence of AI-driven monetization',
    ],
    sourcesUsed: [
      'Latest earnings release',
      'Recent capex guidance discussion',
    ],
    history: [
      '2026-03-16: Technical entry status remains stretched after sharp run-up.',
    ],
  },
  {
    id: 'asml',
    ticker: 'ASML',
    companyName: 'ASML',
    businessType: 'Semicap',
    currentPrice: 934.8,
    valuationStatus: 'cheap',
    newsImpactStatus: 'deteriorating',
    thesisStatus: 'watch',
    technicalEntryStatus: 'favorable',
    actionState: 'watch for confirmation',
    dashboardBucket: 'needs-review',
    baseFairValue: 1045,
    bearFairValue: 860,
    bullFairValue: 1180,
    discountToBase: -10.5,
    summary:
      'Valuation is attractive, but export and order-visibility risks keep the thesis in watch mode.',
    lastUpdated: '2026-03-16',
    thesisStatement:
      'ASML remains strategically critical, but near-term visibility can still be distorted by export restrictions and timing noise.',
    thesisBullets: [
      'EUV franchise remains unique.',
      'Order timing noise can create valuation opportunities.',
      'Geopolitical restrictions can compress confidence and multiples.',
    ],
    variantPerception:
      'The market may be overly focused on short-cycle order visibility while missing the strategic durability of EUV leadership.',
    valuationLens: {
      primary: 'Forward P/E',
      crossCheck: 'EV/EBIT',
      rationale:
        'ASML is a high-quality semicap business where earnings power is the cleanest anchor, with EBIT as a cross-check.',
    },
    currentValuationSnapshot: {
      marketCap: '$370B',
      enterpriseValue: '$365B',
      multiples: ['27.2x forward P/E', '23.0x forward EV/EBIT'],
      balanceSheetNote:
        'Balance sheet is solid; the debate is demand visibility, not solvency.',
    },
    newsToModel: [
      {
        event: 'Export control uncertainty intensified.',
        modelVariableChanged: 'Scenario probability and multiple',
        impact:
          'Raises the probability of the bear case and limits multiple expansion near term.',
        affectedScenario: 'bear',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption:
          'Export restrictions weigh on order visibility for longer.',
        valuationAssumption: '24x forward earnings',
        fairValue: '$860',
        whatMustBeTrue:
          'Customer spending cadence remains uneven and uncertainty persists.',
      },
      {
        label: 'Base',
        operatingAssumption:
          'Strategic demand remains intact despite timing noise.',
        valuationAssumption: '27x forward earnings',
        fairValue: '$1045',
        whatMustBeTrue:
          'Long-cycle demand remains durable and timing issues normalize.',
      },
      {
        label: 'Bull',
        operatingAssumption:
          'Order visibility improves and demand inflects faster.',
        valuationAssumption: '29x forward earnings',
        fairValue: '$1180',
        whatMustBeTrue: 'Customers resume aggressive capacity planning.',
      },
    ],
    currentPriceImplies:
      'The market is pricing a prolonged visibility discount despite continued strategic importance.',
    monitorNext: [
      'Order intake versus expectations',
      'Export restriction developments',
      'Customer capex commentary',
    ],
    sourcesUsed: [
      'Latest quarterly update',
      'Relevant industry policy coverage',
    ],
    history: ['2026-03-16: Thesis status moved from intact to watch.'],
  },
  {
    id: 'uber',
    ticker: 'UBER',
    companyName: 'Uber Technologies',
    businessType: 'Platform Compounder',
    currentPrice: 93.4,
    valuationStatus: 'fair',
    newsImpactStatus: 'improving',
    thesisStatus: 'intact',
    technicalEntryStatus: 'neutral',
    actionState: 'fairly valued',
    dashboardBucket: 'now-actionable',
    baseFairValue: 97,
    bearFairValue: 78,
    bullFairValue: 112,
    discountToBase: -3.7,
    summary:
      'Operational execution remains solid, but upside from here depends on continued margin progression.',
    lastUpdated: '2026-03-16',
    thesisStatement:
      'Uber is transitioning from a story stock into a more disciplined platform compounder with operating leverage.',
    thesisBullets: [
      'Mobility and delivery scale create network and operating leverage.',
      'Margin progression is central to the re-rating case.',
      'The market now gives more credit for cash generation than before.',
    ],
    variantPerception:
      'The market is less wrong than before; the main debate is now durability of margin expansion.',
    valuationLens: {
      primary: 'Forward EV/EBITDA',
      crossCheck: 'FCF yield',
      rationale:
        'Uber’s platform economics and evolving profitability make EV/EBITDA the cleaner primary anchor today.',
    },
    currentValuationSnapshot: {
      marketCap: '$195B',
      enterpriseValue: '$201B',
      multiples: ['23.5x forward EV/EBITDA', '2.9% FCF yield'],
      balanceSheetNote:
        'Balance sheet is manageable; valuation sensitivity is more about execution than leverage.',
    },
    newsToModel: [
      {
        event: 'Recent profitability commentary remained constructive.',
        modelVariableChanged: 'Margin trajectory',
        impact:
          'Improves confidence in the base case without creating a large valuation gap.',
        affectedScenario: 'base',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption:
          'Competition intensifies and margin expansion slows.',
        valuationAssumption: '20x forward EV/EBITDA',
        fairValue: '$78',
        whatMustBeTrue: 'Incentives or regulation pressure economics.',
      },
      {
        label: 'Base',
        operatingAssumption:
          'Mobility and delivery continue compounding with modest margin gains.',
        valuationAssumption: '23x forward EV/EBITDA',
        fairValue: '$97',
        whatMustBeTrue:
          'Operating leverage continues on both sides of the marketplace.',
      },
      {
        label: 'Bull',
        operatingAssumption: 'Margin inflection proves stronger than expected.',
        valuationAssumption: '25x forward EV/EBITDA',
        fairValue: '$112',
        whatMustBeTrue:
          'Execution remains disciplined and incremental margins stay high.',
      },
    ],
    currentPriceImplies:
      'The market is already underwriting a meaningful part of the profitability transition.',
    monitorNext: [
      'Adjusted EBITDA progression',
      'Competitive intensity',
      'Mobility versus delivery contribution margins',
    ],
    sourcesUsed: ['Latest earnings release', 'Recent management commentary'],
    history: ['2026-03-15: News impact moved to improving.'],
  },
  {
    id: 'amd',
    ticker: 'AMD',
    companyName: 'Advanced Micro Devices',
    businessType: 'Semicap / Hybrid Growth',
    currentPrice: 162.7,
    valuationStatus: 'cheap',
    newsImpactStatus: 'improving',
    thesisStatus: 'watch',
    technicalEntryStatus: 'favorable',
    actionState: 'watch for confirmation',
    dashboardBucket: 'needs-review',
    baseFairValue: 188,
    bearFairValue: 145,
    bullFairValue: 220,
    discountToBase: -13.5,
    summary:
      'The setup is getting more attractive, but the thesis still needs stronger proof on AI scale and margins.',
    lastUpdated: '2026-03-16',
    thesisStatement:
      'AMD has real AI and data center upside, but the market still needs clearer evidence on durable profit conversion.',
    thesisBullets: [
      'Data center momentum remains the central support for the case.',
      'AI acceleration can improve mix, but scale still needs to prove itself.',
      'Margin durability remains a key watch item.',
    ],
    variantPerception:
      'The market may still be too skeptical on long-term AI relevance, but not enough evidence exists yet for a full thesis-intact call.',
    valuationLens: {
      primary: 'Forward P/E',
      crossCheck: 'EV/Sales',
      rationale:
        'AMD is a hybrid growth semiconductor business where earnings power matters, but revenue scale is still part of the narrative.',
    },
    currentValuationSnapshot: {
      marketCap: '$265B',
      enterpriseValue: '$258B',
      multiples: ['26.4x forward P/E', '7.4x forward EV/Sales'],
      balanceSheetNote: 'Balance sheet is not the main risk driver here.',
    },
    newsToModel: [
      {
        event: 'Data center demand commentary improved.',
        modelVariableChanged: 'Revenue growth and thesis quality',
        impact:
          'Supports the base case, but does not fully eliminate execution risk.',
        affectedScenario: 'base / bull',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption:
          'AI ramp remains slower and gross margins disappoint.',
        valuationAssumption: '23x forward earnings',
        fairValue: '$145',
        whatMustBeTrue:
          'Execution fails to translate into sustainable AI economics.',
      },
      {
        label: 'Base',
        operatingAssumption:
          'Data center and AI continue ramping with stable margins.',
        valuationAssumption: '25x forward earnings',
        fairValue: '$188',
        whatMustBeTrue: 'Management proves sustained data center traction.',
      },
      {
        label: 'Bull',
        operatingAssumption:
          'AI contribution scales meaningfully and mix improves faster.',
        valuationAssumption: '28x forward earnings',
        fairValue: '$220',
        whatMustBeTrue:
          'AI product traction persists beyond early deployments.',
      },
    ],
    currentPriceImplies:
      'The market is still skeptical on AI scale economics, but not fully dismissive.',
    monitorNext: [
      'Data center segment growth',
      'Gross margin progression',
      'AI product attach and visibility',
    ],
    sourcesUsed: [
      'Latest quarterly update',
      'Recent product and management commentary',
    ],
    history: ['2026-03-16: Technical entry improved to favorable.'],
  },
  {
    id: 'lulu',
    ticker: 'LULU',
    companyName: 'Lululemon',
    businessType: 'Consumer Compounder',
    currentPrice: 337.2,
    valuationStatus: 'fair',
    newsImpactStatus: 'deteriorating',
    thesisStatus: 'watch',
    technicalEntryStatus: 'neutral',
    actionState: 'needs review',
    dashboardBucket: 'at-risk',
    baseFairValue: 345,
    bearFairValue: 285,
    bullFairValue: 392,
    discountToBase: -2.3,
    summary:
      'Brand strength remains meaningful, but growth and margin questions require a closer review.',
    lastUpdated: '2026-03-16',
    thesisStatement:
      'Lululemon still has brand equity, but the current setup depends on proving that growth softness is temporary rather than structural.',
    thesisBullets: [
      'Brand strength remains a real asset.',
      'North America growth trajectory needs renewed confidence.',
      'Margin pressure can compress what still looks like a quality multiple.',
    ],
    variantPerception:
      'The market may be right to reduce the premium if growth normalization lasts longer than expected.',
    valuationLens: {
      primary: 'Forward P/E',
      crossCheck: 'EBIT margin trend',
      rationale:
        'Lululemon is a quality consumer compounder, but multiple support depends on maintaining premium economics.',
    },
    currentValuationSnapshot: {
      marketCap: '$41B',
      enterpriseValue: '$39B',
      multiples: ['22.1x forward P/E'],
      balanceSheetNote:
        'Balance sheet remains healthy; the pressure is operational, not financial.',
    },
    newsToModel: [
      {
        event: 'Recent traffic and inventory commentary softened.',
        modelVariableChanged: 'Revenue trajectory and margin assumptions',
        impact:
          'Pushes the thesis into watch mode and increases the relevance of the bear case.',
        affectedScenario: 'bear / base',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption: 'Traffic weakness and inventory pressure persist.',
        valuationAssumption: '19x forward earnings',
        fairValue: '$285',
        whatMustBeTrue: 'Consumer softness lasts longer than expected.',
      },
      {
        label: 'Base',
        operatingAssumption:
          'Growth normalizes gradually with manageable margin pressure.',
        valuationAssumption: '21x forward earnings',
        fairValue: '$345',
        whatMustBeTrue:
          'Brand retains premium positioning while execution stabilizes.',
      },
      {
        label: 'Bull',
        operatingAssumption:
          'Growth re-accelerates and premium brand economics recover.',
        valuationAssumption: '23x forward earnings',
        fairValue: '$392',
        whatMustBeTrue: 'Traffic and margin concerns prove temporary.',
      },
    ],
    currentPriceImplies:
      'The market is now underwriting lower growth and less confidence in premium resilience.',
    monitorNext: [
      'Comparable sales progression',
      'Gross margin recovery',
      'Inventory normalization',
    ],
    sourcesUsed: [
      'Latest earnings release',
      'Recent retail channel commentary',
    ],
    history: ['2026-03-16: News impact downgraded to deteriorating.'],
  },
]

export function getStockByTicker(ticker: string) {
  return mockStocks.find(
    (stock) => stock.ticker.toLowerCase() === ticker.toLowerCase(),
  )
}

export function getDashboardCounts() {
  return mockStocks.reduce<Record<DashboardBucket, number>>(
    (counts, stock) => {
      counts[stock.dashboardBucket] += 1
      return counts
    },
    {
      'now-actionable': 0,
      'needs-review': 0,
      'at-risk': 0,
    },
  )
}
