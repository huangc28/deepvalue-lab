import type { DashboardBucket, StockDetail } from '../types/stocks'

export const mockStocks: StockDetail[] = [
  {
    id: 'tsm',
    ticker: 'TSM',
    companyName: 'Taiwan Semiconductor Manufacturing',
    businessType: 'Capital-Intensive Semiconductor Infrastructure',
    currentPrice: 338.31,
    valuationStatus: 'fair',
    newsImpactStatus: 'improving',
    thesisStatus: 'intact',
    technicalEntryStatus: 'neutral',
    actionState: 'fairly valued',
    dashboardBucket: 'needs-review',
    baseFairValue: 375,
    bearFairValue: 294,
    bullFairValue: 446,
    discountToBase: -9.8,
    summary:
      'Elite business quality remains intact, but the current price already underwrites a strong 2026 outcome.',
    lastUpdated: '2026-03-16',
    thesisStatement:
      'TSMC has become the bottleneck owner of leading-edge compute and advanced packaging, so it can compound earnings better than an old foundry framing suggests.',
    thesisBullets: [
      'TSMC owns the key manufacturing bottlenecks in advanced compute and packaging.',
      'AI and HPC demand can support faster and longer earnings compounding than a classic foundry model implies.',
      'The underwriting risk is whether overseas fab dilution and N2 ramp inefficiency offset that structural demand tailwind.',
    ],
    variantPerception:
      "The market is no longer missing TSMC's quality, but it may still underestimate how infrastructure-like the earnings base has become while overestimating how much near-term multiple expansion is left.",
    valuationLens: {
      primary: 'Forward P/E',
      crossCheck: 'Trailing FCF yield',
      rationale:
        'TSMC is profitable, net-cash, and structurally differentiated, so forward ADR P/E is the cleanest anchor while elevated capex makes FCF yield only a cautious cross-check.',
    },
    currentValuationSnapshot: {
      marketCap: '$1.75T',
      enterpriseValue: '$1.69T',
      multiples: ['31.7x trailing ADR P/E', '1.8% trailing FCF yield'],
      balanceSheetNote:
        'Net cash of about $65.6B cushions downside, but 2026 capex remains unusually elevated.',
    },
    newsToModel: [
      {
        event:
          '4Q25 results and 1Q26 guidance were stronger than a normal seasonal frame.',
        modelVariableChanged: 'Revenue growth and base-case confidence',
        impact:
          "Supports keeping 2026 revenue assumptions near management's full-year target instead of fading toward a low-20s growth setup.",
        affectedScenario: 'base',
      },
      {
        event:
          'Management guided for close to 30% 2026 US-dollar revenue growth and said AI accelerators were already a high-teens share of 2025 revenue.',
        modelVariableChanged: 'Scenario probability and multiple support',
        impact:
          'Confirms AI is already material, not just optional upside, and shifts probability toward base and bull.',
        affectedScenario: 'base / bull',
      },
      {
        event:
          'Management warned that overseas fab ramp and N2 start-up costs will dilute gross margin by roughly 4% to 6% combined in early periods.',
        modelVariableChanged: 'Gross margin',
        impact:
          'Caps base-case margin assumptions and keeps the bear case live even if revenue growth stays healthy.',
        affectedScenario: 'bear / base',
      },
      {
        event:
          'Management flagged tariff-policy and rising component-price risk in consumer-related and price-sensitive segments.',
        modelVariableChanged: 'Demand mix and valuation multiple',
        impact:
          'Reduces confidence in non-AI demand resilience and limits how far the market can re-rate TSM as a pure AI winner.',
        affectedScenario: 'bear / base',
      },
      {
        event:
          'February 2026 monthly revenue and January-February growth tracked at roughly +29.9% year over year.',
        modelVariableChanged: 'Near-term revenue confirmation',
        impact:
          'Provides real-time confirmation that the near-30% growth framework is not just conference-call language.',
        affectedScenario: 'base',
      },
      {
        event:
          'The board approved about $44.96B of capital appropriations and up to $30B of additional capital into TSMC Global.',
        modelVariableChanged: 'Capex intensity and FCF quality',
        impact:
          'Reinforces multi-year demand confidence, but also weakens any near-term bull case built mainly on free cash flow.',
        affectedScenario: 'base / bull',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption:
          '2026 revenue reaches about $149.4B, up roughly 22%, with net margin around 42.5%.',
        valuationAssumption: 'ADR EPS about $12.24 on a 24x target P/E',
        fairValue: '$294',
        whatMustBeTrue:
          'AI remains healthy, but consumer weakness, tariff friction, or worse-than-expected overseas and N2 dilution prevents margin leverage from matching revenue growth.',
      },
      {
        label: 'Base',
        operatingAssumption:
          '2026 revenue reaches about $157.9B, up roughly 29%, with net margin around 44.0%.',
        valuationAssumption: 'ADR EPS about $13.40 on a 28x target P/E',
        fairValue: '$375',
        whatMustBeTrue:
          "Management's near-30% revenue outlook broadly holds, advanced-node and CoWoS demand stay tight, and margin dilution stays manageable rather than thesis-changing.",
      },
      {
        label: 'Bull',
        operatingAssumption:
          '2026 revenue reaches about $164.0B, up roughly 34%, with net margin around 45.5%.',
        valuationAssumption: 'ADR EPS about $14.39 on a 31x target P/E',
        fairValue: '$446',
        whatMustBeTrue:
          "AI demand stays supply-constrained in a healthy way, packaging remains a bottleneck in TSMC's favor, and margin dilution proves milder than current guidance implies.",
      },
    ],
    currentPriceImplies:
      'At $338.31, the stock already underwrites something closer to base than to stress: roughly $13 of ADR EPS, about $153B of revenue, and around a 44% net margin if investors hold the name near 26x forward earnings.',
    currentPriceImpliedFacts: [
      {
        label: 'Implied Forward Multiple',
        value: 'About 26x forward earnings',
      },
      {
        label: 'Implied ADR EPS',
        value: 'About $13.0',
      },
      {
        label: 'Implied Revenue',
        value: 'About $153B',
      },
      {
        label: 'Implied Net Margin',
        value: 'About 44%',
      },
    ],
    provisionalConclusion:
      'TSM looks fair to slightly attractive, not cheap. The hidden support is that the business is more infrastructure-like than the old foundry label implies; the key risk is that investors treat that truth as a license to ignore capital intensity and margin dilution.',
    technicalCommentary:
      'The pullback has reduced heat, but the chart is not yet washed out enough to qualify as a favorable entry and has not confirmed a fresh momentum turn.',
    technicalSignals: [
      {
        label: 'RSI (22)',
        value: '47.3',
      },
      {
        label: 'RSI EMA (12)',
        value: '52.8',
      },
      {
        label: 'Price Vs 50DMA',
        value: '-2.0%',
      },
      {
        label: 'Price Vs 200DMA',
        value: '+20.3%',
      },
      {
        label: '200-Day Mean Deviation',
        value: '+1.2 standard deviations',
      },
    ],
    risks: [
      "Overseas fab ramp and N2 dilution prove worse than management's current warning bands.",
      'Tariff friction or higher component costs weaken non-AI demand more than expected.',
      'The premium multiple compresses if growth is merely good rather than exceptional.',
    ],
    catalysts: [
      "Advanced packaging remains supply-constrained in TSMC's favor.",
      'AI and HPC demand continue compounding faster than old foundry framing suggests.',
      "Margin dilution lands closer to the low end of management's warning range.",
    ],
    monitorNext: [
      'Whether 1Q26 revenue and gross margin land near the high end of guidance.',
      'Whether monthly revenue keeps tracking near the 30% full-year growth frame.',
      "Whether overseas fab ramp and N2 dilution land near the low or high end of management's warning bands.",
      'Whether advanced packaging capacity stays tight in a healthy way or begins to loosen.',
      'Whether tariff or component-cost pressure alters customer ordering behavior outside the AI buildout.',
    ],
    sourcesUsed: [
      {
        label: 'TSMC fundamentals',
        url: 'https://investor.tsmc.com/english/fundamentals',
      },
      {
        label: 'TSMC 2025 Q4 quarterly results page',
        url: 'https://investor.tsmc.com/english/quarterly-results/2025/q4',
      },
      {
        label: 'TSMC 4Q25 earnings release PDF',
        url: 'https://pr.tsmc.com/system/files/newspdf/attachment/8794aecab1dd085ed6e7360aadaa060f2a270ab3/4Q25%20%28E%29_with%20guidance_final_wmn.pdf',
      },
      {
        label: 'TSMC 4Q25 earnings call transcript PDF',
        url: 'https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-01/51d09df96cd89ac19d65af39032b038dc2896a24/TSMC%204Q25%20Transcript.pdf',
      },
      {
        label: 'TSMC board resolutions, 2026-02-10',
        url: 'https://pr.tsmc.com/english/news/3287',
      },
      {
        label: 'TSMC January 2026 revenue report',
        url: 'https://pr.tsmc.com/english/news/3284',
      },
      {
        label: 'TSMC February 2026 revenue report',
        url: 'https://pr.tsmc.com/english/news/3290',
      },
      {
        label: 'Stooq TSM daily history',
        url: 'https://stooq.com/q/d/l/?s=tsm.us&i=d',
      },
    ],
    history: [
      '2026-03-16: Replaced placeholder TSM mock with point-in-time data from the archived professional report.',
      '2026-03-16: Valuation status reset from cheap to fair after updating the price to $338.31 and the base fair value to $375.',
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
    risks: [
      'AI monetization fails to offset slower core growth.',
      'The market continues to compress software multiples despite stable execution.',
    ],
    catalysts: [
      'Higher monetization of AI features expands ARPU.',
      'Stable retention and cash generation support re-rating.',
    ],
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
    risks: [
      'AI revenue concentration proves less durable than expected.',
      'Leverage and valuation leave limited room for disappointment.',
    ],
    catalysts: [
      'Custom AI programs continue scaling faster than expected.',
      'Software resilience keeps the blended earnings profile stable.',
    ],
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
    risks: [
      'AI capex keeps rising without proportional monetization.',
      'Ad growth normalizes faster than the market expects.',
    ],
    catalysts: [
      'AI tools improve monetization and engagement faster than expected.',
      'Margin resilience sustains premium platform economics.',
    ],
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
    risks: [
      'Export controls continue to reduce order visibility.',
      'Customer capex pauses extend the timing discount.',
    ],
    catalysts: [
      'Order visibility improves as strategic EUV demand remains intact.',
      'Customers resume longer-horizon capacity planning.',
    ],
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
    risks: [
      'Competitive intensity slows margin progression.',
      'Regulatory or incentive pressure reduces operating leverage.',
    ],
    catalysts: [
      'Incremental margins continue to surprise positively.',
      'Marketplace discipline improves durability of the compounding case.',
    ],
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
    risks: [
      'AI traction fails to scale into durable profit conversion.',
      'Margin progression lags despite data center momentum.',
    ],
    catalysts: [
      'Data center momentum proves more durable than expected.',
      'AI product attach improves mix and earnings power.',
    ],
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
    risks: [
      'Traffic softness lasts longer than expected.',
      'Margin pressure compresses the premium multiple further.',
    ],
    catalysts: [
      'Comparable sales stabilize faster than feared.',
      'Inventory and margin discipline restore premium confidence.',
    ],
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
