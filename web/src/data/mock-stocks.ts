import type { DashboardBucket, StockDetail } from '../types/stocks'

export const mockStocks: StockDetail[] = [
  {
    id: 'tsm',
    ticker: 'TSM',
    companyName: 'Taiwan Semiconductor Manufacturing',
    businessType: {
      en: 'Capital-Intensive Semiconductor Infrastructure',
      'zh-TW': '高資本密集半導體基礎設施',
    },
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
    summary: {
      en: 'Elite business quality remains intact, but the current price already underwrites a strong 2026 outcome.',
      'zh-TW':
        '企業品質依然非常強，但目前股價其實已經反映了一個相當強勁的 2026 年結果。',
    },
    lastUpdated: '2026-03-16',
    thesisStatement: {
      en: 'TSMC has become the bottleneck owner of leading-edge compute and advanced packaging, so it can compound earnings better than an old foundry framing suggests.',
      'zh-TW':
        'TSMC 已經成為先進運算與先進封裝瓶頸資產的擁有者，因此它的盈餘複利能力其實比傳統 foundry 框架所暗示的更強。',
    },
    thesisBullets: [
      {
        en: 'TSMC owns the key manufacturing bottlenecks in advanced compute and packaging.',
        'zh-TW': 'TSMC 掌握了先進運算與封裝最關鍵的製造瓶頸。',
      },
      {
        en: 'AI and HPC demand can support faster and longer earnings compounding than a classic foundry model implies.',
        'zh-TW':
          'AI 與 HPC 需求有機會支撐比傳統 foundry 更快、也更持久的盈餘複利。',
      },
      {
        en: 'The underwriting risk is whether overseas fab dilution and N2 ramp inefficiency offset that structural demand tailwind.',
        'zh-TW':
          '真正的 underwriting risk 在於海外廠稀釋與 N2 爬坡效率不佳，是否會抵消這個結構性需求順風。',
      },
    ],
    variantPerception: {
      en: "The market is no longer missing TSMC's quality, but it may still underestimate how infrastructure-like the earnings base has become while overestimating how much near-term multiple expansion is left.",
      'zh-TW':
        '市場已經不再忽略 TSMC 的品質，但它可能仍低估了這套獲利基礎有多像 infrastructure，同時高估了短期還剩多少倍數擴張空間。',
    },
    valuationLens: {
      primary: {
        en: 'Forward P/E',
        'zh-TW': '遠期本益比（Forward P/E）',
      },
      crossCheck: {
        en: 'Trailing FCF yield',
        'zh-TW': '過去十二個月自由現金流殖利率',
      },
      rationale: {
        en: 'TSMC is profitable, net-cash, and structurally differentiated, so forward ADR P/E is the cleanest anchor while elevated capex makes FCF yield only a cautious cross-check.',
        'zh-TW':
          'TSMC 具備高獲利、淨現金與結構性差異化，因此用 ADR 遠期本益比作為主要錨點最乾淨；但因 capex 異常偏高，FCF yield 只適合作為保守的交叉檢查。',
      },
    },
    currentValuationSnapshot: {
      marketCap: { en: '$1.75T', 'zh-TW': '$1.75T' },
      enterpriseValue: { en: '$1.69T', 'zh-TW': '$1.69T' },
      multiples: [
        { en: '31.7x trailing ADR P/E', 'zh-TW': '31.7 倍 ADR 過去本益比' },
        { en: '1.8% trailing FCF yield', 'zh-TW': '1.8% 過去 FCF 殖利率' },
      ],
      balanceSheetNote: {
        en: 'Net cash of about $65.6B cushions downside, but 2026 capex remains unusually elevated.',
        'zh-TW':
          '大約 656 億美元的淨現金提供下檔緩衝，但 2026 年 capex 仍明顯偏高。',
      },
    },
    newsToModel: [
      {
        event: {
          en: '4Q25 results and 1Q26 guidance were stronger than a normal seasonal frame.',
          'zh-TW': '4Q25 結果與 1Q26 指引都比一般季節性框架更強。',
        },
        modelVariableChanged: {
          en: 'Revenue growth and base-case confidence',
          'zh-TW': '營收成長與 base case 信心',
        },
        impact: {
          en: "Supports keeping 2026 revenue assumptions near management's full-year target instead of fading toward a low-20s growth setup.",
          'zh-TW':
            '這支持把 2026 年營收假設放在更接近管理層全年目標的位置，而不是滑落到低 20% 成長的框架。',
        },
        affectedScenario: { en: 'base', 'zh-TW': 'base' },
      },
      {
        event: {
          en: 'Management guided for close to 30% 2026 US-dollar revenue growth and said AI accelerators were already a high-teens share of 2025 revenue.',
          'zh-TW':
            '管理層指引 2026 年美元營收成長接近 30%，並指出 AI 加速器已經占 2025 年營收的 high-teens 比例。',
        },
        modelVariableChanged: {
          en: 'Scenario probability and multiple support',
          'zh-TW': '情境機率與倍數支撐',
        },
        impact: {
          en: 'Confirms AI is already material, not just optional upside, and shifts probability toward base and bull.',
          'zh-TW':
            '這確認 AI 已經是實質性貢獻，而不是可有可無的額外上行，並把情境機率往 base 與 bull 移動。',
        },
        affectedScenario: { en: 'base / bull', 'zh-TW': 'base / bull' },
      },
      {
        event: {
          en: 'Management warned that overseas fab ramp and N2 start-up costs will dilute gross margin by roughly 4% to 6% combined in early periods.',
          'zh-TW':
            '管理層提醒海外廠爬坡與 N2 起始成本在初期合計可能稀釋毛利率約 4% 到 6%。',
        },
        modelVariableChanged: {
          en: 'Gross margin',
          'zh-TW': '毛利率',
        },
        impact: {
          en: 'Caps base-case margin assumptions and keeps the bear case live even if revenue growth stays healthy.',
          'zh-TW':
            '這限制了 base case 的毛利率假設，也讓 bear case 即使在營收成長仍然健康時依舊成立。',
        },
        affectedScenario: { en: 'bear / base', 'zh-TW': 'bear / base' },
      },
      {
        event: {
          en: 'Management flagged tariff-policy and rising component-price risk in consumer-related and price-sensitive segments.',
          'zh-TW':
            '管理層指出關稅政策與零組件成本上升，對消費相關與價格敏感區隔帶來風險。',
        },
        modelVariableChanged: {
          en: 'Demand mix and valuation multiple',
          'zh-TW': '需求組成與估值倍數',
        },
        impact: {
          en: 'Reduces confidence in non-AI demand resilience and limits how far the market can re-rate TSM as a pure AI winner.',
          'zh-TW':
            '這降低了市場對非 AI 需求韌性的信心，也限制了 TSM 被當成純 AI 贏家的重評空間。',
        },
        affectedScenario: { en: 'bear / base', 'zh-TW': 'bear / base' },
      },
      {
        event: {
          en: 'February 2026 monthly revenue and January-February growth tracked at roughly +29.9% year over year.',
          'zh-TW':
            '2026 年 2 月單月營收與 1-2 月累計營收年增率大約都落在 +29.9% 左右。',
        },
        modelVariableChanged: {
          en: 'Near-term revenue confirmation',
          'zh-TW': '近端營收確認',
        },
        impact: {
          en: 'Provides real-time confirmation that the near-30% growth framework is not just conference-call language.',
          'zh-TW':
            '這提供了即時證據，證明接近 30% 成長的框架不只是電話會議上的說法。',
        },
        affectedScenario: { en: 'base', 'zh-TW': 'base' },
      },
      {
        event: {
          en: 'The board approved about $44.96B of capital appropriations and up to $30B of additional capital into TSMC Global.',
          'zh-TW':
            '董事會核准大約 449.6 億美元的資本支出與最多 300 億美元注資到 TSMC Global。',
        },
        modelVariableChanged: {
          en: 'Capex intensity and FCF quality',
          'zh-TW': 'Capex 強度與 FCF 品質',
        },
        impact: {
          en: 'Reinforces multi-year demand confidence, but also weakens any near-term bull case built mainly on free cash flow.',
          'zh-TW':
            '這強化了市場對多年度需求的信心，但同時也削弱了任何主要依賴自由現金流的短期 bull case。',
        },
        affectedScenario: { en: 'base / bull', 'zh-TW': 'base / bull' },
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption: {
          en: '2026 revenue reaches about $149.4B, up roughly 22%, with net margin around 42.5%.',
          'zh-TW': '2026 年營收約 1,494 億美元，年增約 22%，淨利率約 42.5%。',
        },
        valuationAssumption: {
          en: 'ADR EPS about $12.24 on a 24x target P/E',
          'zh-TW': 'ADR EPS 約 12.24 美元，目標本益比 24 倍',
        },
        fairValue: { en: '$294', 'zh-TW': '$294' },
        whatMustBeTrue: {
          en: 'AI remains healthy, but consumer weakness, tariff friction, or worse-than-expected overseas and N2 dilution prevents margin leverage from matching revenue growth.',
          'zh-TW':
            'AI 需求仍健康，但消費性需求疲弱、關稅摩擦，或海外廠與 N2 稀釋比預期更差，讓利潤槓桿跟不上營收成長。',
        },
      },
      {
        label: 'Base',
        operatingAssumption: {
          en: '2026 revenue reaches about $157.9B, up roughly 29%, with net margin around 44.0%.',
          'zh-TW': '2026 年營收約 1,579 億美元，年增約 29%，淨利率約 44.0%。',
        },
        valuationAssumption: {
          en: 'ADR EPS about $13.40 on a 28x target P/E',
          'zh-TW': 'ADR EPS 約 13.40 美元，目標本益比 28 倍',
        },
        fairValue: { en: '$375', 'zh-TW': '$375' },
        whatMustBeTrue: {
          en: "Management's near-30% revenue outlook broadly holds, advanced-node and CoWoS demand stay tight, and margin dilution stays manageable rather than thesis-changing.",
          'zh-TW':
            '管理層接近 30% 的營收指引大致成立，先進製程與 CoWoS 需求維持緊俏，且毛利率稀釋雖存在但尚未嚴重到改變 thesis。',
        },
      },
      {
        label: 'Bull',
        operatingAssumption: {
          en: '2026 revenue reaches about $164.0B, up roughly 34%, with net margin around 45.5%.',
          'zh-TW': '2026 年營收約 1,640 億美元，年增約 34%，淨利率約 45.5%。',
        },
        valuationAssumption: {
          en: 'ADR EPS about $14.39 on a 31x target P/E',
          'zh-TW': 'ADR EPS 約 14.39 美元，目標本益比 31 倍',
        },
        fairValue: { en: '$446', 'zh-TW': '$446' },
        whatMustBeTrue: {
          en: "AI demand stays supply-constrained in a healthy way, packaging remains a bottleneck in TSMC's favor, and margin dilution proves milder than current guidance implies.",
          'zh-TW':
            'AI 需求持續健康地供不應求，封裝瓶頸仍偏向 TSMC 有利，而且毛利率稀釋比目前指引語氣所暗示的更輕微。',
        },
      },
    ],
    currentPriceImplies: {
      en: 'At $338.31, the stock already underwrites something closer to base than to stress: roughly $13 of ADR EPS, about $153B of revenue, and around a 44% net margin if investors hold the name near 26x forward earnings.',
      'zh-TW':
        '在 338.31 美元時，這檔股票其實已經反映了一個更接近 base 而不是 stress 的結果：如果市場給它大約 26 倍遠期本益比，代表隱含 ADR EPS 約 13 美元、營收約 1,530 億美元、淨利率約 44%。',
    },
    currentPriceImpliedFacts: [
      {
        label: {
          en: 'Implied Forward Multiple',
          'zh-TW': '隱含遠期倍數',
        },
        value: {
          en: 'About 26x forward earnings',
          'zh-TW': '約 26 倍遠期本益比',
        },
      },
      {
        label: { en: 'Implied ADR EPS', 'zh-TW': '隱含 ADR EPS' },
        value: { en: 'About $13.0', 'zh-TW': '約 13.0 美元' },
      },
      {
        label: { en: 'Implied Revenue', 'zh-TW': '隱含營收' },
        value: { en: 'About $153B', 'zh-TW': '約 1,530 億美元' },
      },
      {
        label: { en: 'Implied Net Margin', 'zh-TW': '隱含淨利率' },
        value: { en: 'About 44%', 'zh-TW': '約 44%' },
      },
    ],
    provisionalConclusion: {
      en: 'TSM looks fair to slightly attractive, not cheap. The hidden support is that the business is more infrastructure-like than the old foundry label implies; the key risk is that investors treat that truth as a license to ignore capital intensity and margin dilution.',
      'zh-TW':
        'TSM 看起來是合理到略具吸引力，但不是便宜。真正的隱性支撐在於這門生意比舊式 foundry 標籤更像 infrastructure；真正的風險則是投資人因為看懂這點，就忽略資本密集度與毛利率稀釋。',
    },
    technicalCommentary: {
      en: 'The pullback has reduced heat, but the chart is not yet washed out enough to qualify as a favorable entry and has not confirmed a fresh momentum turn.',
      'zh-TW':
        '這次回檔已經降低了過熱程度，但圖形還沒有回到足以稱為 favorable entry 的洗出區，也尚未確認新的動能轉折。',
    },
    technicalSignals: [
      {
        label: { en: 'RSI (22)', 'zh-TW': 'RSI (22)' },
        value: { en: '47.3', 'zh-TW': '47.3' },
      },
      {
        label: { en: 'RSI EMA (12)', 'zh-TW': 'RSI EMA (12)' },
        value: { en: '52.8', 'zh-TW': '52.8' },
      },
      {
        label: { en: 'Price Vs 50DMA', 'zh-TW': '價格相對 50 日均線' },
        value: { en: '-2.0%', 'zh-TW': '-2.0%' },
      },
      {
        label: { en: 'Price Vs 200DMA', 'zh-TW': '價格相對 200 日均線' },
        value: { en: '+20.3%', 'zh-TW': '+20.3%' },
      },
      {
        label: {
          en: '200-Day Mean Deviation',
          'zh-TW': '相對 200 日均值偏離',
        },
        value: { en: '+1.2 standard deviations', 'zh-TW': '+1.2 個標準差' },
      },
    ],
    risks: [
      {
        en: "Overseas fab ramp and N2 dilution prove worse than management's current warning bands.",
        'zh-TW':
          '海外廠爬坡與 N2 稀釋若比管理層目前的警示區間更差，會直接壓縮回報。',
      },
      {
        en: 'Tariff friction or higher component costs weaken non-AI demand more than expected.',
        'zh-TW':
          '若關稅摩擦或零組件成本上升讓非 AI 需求比預期更弱，base case 需要下修。',
      },
      {
        en: 'The premium multiple compresses if growth is merely good rather than exceptional.',
        'zh-TW':
          '如果成長只是「不錯」而不是「非常強」，高估值倍數就可能被壓縮。',
      },
    ],
    catalysts: [
      {
        en: "Advanced packaging remains supply-constrained in TSMC's favor.",
        'zh-TW': '先進封裝若持續供不應求且瓶頸站在 TSMC 這邊，估值支撐會更強。',
      },
      {
        en: 'AI and HPC demand continue compounding faster than old foundry framing suggests.',
        'zh-TW':
          '如果 AI 與 HPC 需求持續以舊 foundry 框架低估的速度複利，市場認知會進一步修正。',
      },
      {
        en: "Margin dilution lands closer to the low end of management's warning range.",
        'zh-TW':
          '若毛利率稀釋落在管理層警示區間的低端，base 與 bull 的機率都會上升。',
      },
    ],
    monitorNext: [
      {
        en: 'Whether 1Q26 revenue and gross margin land near the high end of guidance.',
        'zh-TW': '1Q26 營收與毛利率是否落在指引高端附近。',
      },
      {
        en: 'Whether monthly revenue keeps tracking near the 30% full-year growth frame.',
        'zh-TW': '單月營收是否持續跟上接近全年 30% 成長的框架。',
      },
      {
        en: "Whether overseas fab ramp and N2 dilution land near the low or high end of management's warning bands.",
        'zh-TW': '海外廠與 N2 稀釋最終落在管理層警示區間的低端還是高端。',
      },
      {
        en: 'Whether advanced packaging capacity stays tight in a healthy way or begins to loosen.',
        'zh-TW': '先進封裝產能是否仍健康地維持緊俏，或開始鬆動。',
      },
      {
        en: 'Whether tariff or component-cost pressure alters customer ordering behavior outside the AI buildout.',
        'zh-TW': '關稅與零組件成本壓力是否改變 AI 以外客戶的下單行為。',
      },
    ],
    sourcesUsed: [
      {
        label: {
          en: 'TSMC fundamentals',
          'zh-TW': 'TSMC 基本面頁面',
        },
        url: 'https://investor.tsmc.com/english/fundamentals',
      },
      {
        label: {
          en: 'TSMC 2025 Q4 quarterly results page',
          'zh-TW': 'TSMC 2025 Q4 季度結果頁面',
        },
        url: 'https://investor.tsmc.com/english/quarterly-results/2025/q4',
      },
      {
        label: {
          en: 'TSMC 4Q25 earnings release PDF',
          'zh-TW': 'TSMC 4Q25 財報新聞稿 PDF',
        },
        url: 'https://pr.tsmc.com/system/files/newspdf/attachment/8794aecab1dd085ed6e7360aadaa060f2a270ab3/4Q25%20%28E%29_with%20guidance_final_wmn.pdf',
      },
      {
        label: {
          en: 'TSMC 4Q25 earnings call transcript PDF',
          'zh-TW': 'TSMC 4Q25 法說會逐字稿 PDF',
        },
        url: 'https://investor.tsmc.com/english/encrypt/files/encrypt_file/reports/2026-01/51d09df96cd89ac19d65af39032b038dc2896a24/TSMC%204Q25%20Transcript.pdf',
      },
      {
        label: {
          en: 'TSMC board resolutions, 2026-02-10',
          'zh-TW': 'TSMC 董事會決議，2026-02-10',
        },
        url: 'https://pr.tsmc.com/english/news/3287',
      },
      {
        label: {
          en: 'TSMC January 2026 revenue report',
          'zh-TW': 'TSMC 2026 年 1 月營收公告',
        },
        url: 'https://pr.tsmc.com/english/news/3284',
      },
      {
        label: {
          en: 'TSMC February 2026 revenue report',
          'zh-TW': 'TSMC 2026 年 2 月營收公告',
        },
        url: 'https://pr.tsmc.com/english/news/3290',
      },
      {
        label: {
          en: 'Stooq TSM daily history',
          'zh-TW': 'Stooq TSM 日線歷史資料',
        },
        url: 'https://stooq.com/q/d/l/?s=tsm.us&i=d',
      },
    ],
    history: [
      {
        en: '2026-03-16: Replaced placeholder TSM mock with point-in-time data from the archived professional report.',
        'zh-TW':
          '2026-03-16：以 archive 中的專業分析報告取代原本的 placeholder TSM mock。',
      },
      {
        en: '2026-03-16: Valuation status reset from cheap to fair after updating the price to $338.31 and the base fair value to $375.',
        'zh-TW':
          '2026-03-16：在把價格更新為 338.31 美元、base fair value 更新為 375 美元後，valuation status 從 cheap 調整為 fair。',
      },
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
    businessType: 'Hybrid Mature Compounder',
    currentPrice: 322.16,
    valuationStatus: 'rich',
    newsImpactStatus: 'improving',
    thesisStatus: 'intact',
    technicalEntryStatus: 'neutral',
    actionState: 'trim zone',
    dashboardBucket: 'at-risk',
    baseFairValue: 250,
    bearFairValue: 204,
    bullFairValue: 334,
    discountToBase: 28.9,
    summary:
      'The business remains high quality, but the current price is already underwriting something close to a bull-path outcome.',
    lastUpdated: '2026-03-16',
    thesisStatement:
      'Broadcom is one of the few scaled platforms monetizing AI infrastructure from both the compute-network side and the enterprise software side.',
    thesisBullets: [
      'AI semiconductor and networking demand remains the main driver of premium growth expectations.',
      'Infrastructure software provides a steadier cash-flow floor than a pure semiconductor business would have.',
      'The stock now requires continued high-margin AI execution plus software stability, not just a good business narrative.',
    ],
    variantPerception:
      'The market is right to award Broadcom a premium to traditional semis, but it may be overpaying for a narrow outcome where AI stays explosive, software remains stable, and the multiple stays unusually rich despite leverage.',
    valuationLens: {
      primary: 'Forward non-GAAP P/E',
      crossCheck: 'EV / adjusted EBITDA',
      rationale:
        'Forward non-GAAP P/E is the cleanest primary lens because acquisition-related amortization heavily distorts GAAP earnings, while EV / adjusted EBITDA remains the right cross-check because leverage still matters.',
    },
    currentValuationSnapshot: {
      marketCap: '$1.52T',
      enterpriseValue: '$1.58T',
      multiples: [
        '1.4% trailing FCF yield',
        '38.2x EV / FY2025 adjusted EBITDA',
      ],
      balanceSheetNote:
        'Net debt is still about $63.1B, which supports the quality case less than a simple net-cash AI leader would.',
    },
    newsToModel: [
      {
        event:
          'Q1 FY2026 revenue rose 25% year over year to $14.92B, with adjusted EBITDA margin at 68%.',
        modelVariableChanged: 'Margin resilience and base-case confidence',
        impact:
          'This supports the idea that Broadcom is converting AI excitement into real earnings and keeps the base case above a normal mature-chip framework.',
        affectedScenario: 'base / bull',
      },
      {
        event:
          'AI semiconductor revenue reached $4.1B in Q1, and management guided to $4.4B in Q2.',
        modelVariableChanged:
          'Semiconductor growth assumptions and scenario probability',
        impact:
          'This raises growth assumptions and improves the probability of the bull case, while also increasing reliance on hyperscaler AI capex.',
        affectedScenario: 'base / bull',
      },
      {
        event:
          'Infrastructure software revenue reached $6.7B in Q1, up 47% year over year.',
        modelVariableChanged: 'Cash-flow stability and multiple durability',
        impact:
          'This strengthens the stabilizer case for software and supports a premium multiple versus a pure semi name, but it should not be mistaken for AI-like growth across the whole company.',
        affectedScenario: 'base',
      },
      {
        event:
          'Q2 FY2026 guidance called for about $15.0B of revenue and adjusted EBITDA margin of about 66%.',
        modelVariableChanged: 'Near-term floor and multiple support',
        impact:
          'This gives Broadcom a solid near-term floor, but it is not strong enough by itself to justify the current stock price unless investors keep paying a very high multiple.',
        affectedScenario: 'base',
      },
      {
        event:
          'Q1 cash from operations was $6.1B and free cash flow was $6.0B, while net debt remains about $63.1B.',
        modelVariableChanged: 'Cash conversion and valuation ceiling',
        impact:
          'Cash generation remains strong enough to support the quality case and gradual deleveraging, but leverage still caps how far the multiple should stretch.',
        affectedScenario: 'base / bear',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption:
          'FY2026 revenue of about $61.5B; adjusted EBITDA margin about 65.5%; non-GAAP EPS about $6.80.',
        valuationAssumption: '30x forward non-GAAP P/E',
        fairValue: '$204',
        whatMustBeTrue:
          'AI demand remains good but not exceptional, software behaves mainly as a stabilizer, and the market stops paying an AI-platform multiple to a leveraged hybrid.',
      },
      {
        label: 'Base',
        operatingAssumption:
          'FY2026 revenue of about $64.0B; adjusted EBITDA margin about 66.5%; non-GAAP EPS about $7.35.',
        valuationAssumption: '34x forward non-GAAP P/E',
        fairValue: '$250',
        whatMustBeTrue:
          'AI networking and custom silicon keep expanding, software revenue remains durable, and investors continue to grant Broadcom a premium multiple well above a standard mature semi peer set.',
      },
      {
        label: 'Bull',
        operatingAssumption:
          'FY2026 revenue of about $68.5B; adjusted EBITDA margin about 67.5%; non-GAAP EPS about $8.35.',
        valuationAssumption: '40x forward non-GAAP P/E',
        fairValue: '$334',
        whatMustBeTrue:
          'Hyperscaler AI spending stays very strong, Broadcom captures more wallet share in custom accelerators and networking, software retention holds, and the market remains willing to value the company like a durable AI platform despite leverage.',
      },
    ],
    currentPriceImplies:
      'At $322.16, the market is not merely underwriting a good year. It is underwriting something close to a bull path: about $8.05 of EPS if investors keep paying 40x forward earnings, or about $9.48 of EPS if the multiple slips to 34x.',
    currentPriceImpliedFacts: [
      {
        label: 'Implied forward multiple',
        value: '40x on about $8.05 of EPS',
      },
      {
        label: 'Implied EPS at 34x',
        value: 'about $9.48',
      },
      {
        label: 'Base-case EV / EBITDA',
        value: 'about 37x',
      },
      {
        label: 'What that means',
        value:
          'The stock already needs very strong AI-driven earnings growth or an unusually rich multiple to hold up.',
      },
    ],
    provisionalConclusion:
      'AVGO looks rich. The business is high quality, but the stock already prices in a great deal of good news and appears to require something near a bull-case combination of earnings and multiple support to work from here.',
    technicalCommentary:
      'The stock has corrected from recent highs, but it is not washed out enough to qualify as a clearly favorable entry, and valuation is too demanding to let a middling technical setup do the work.',
    technicalSignals: [
      {
        label: 'RSI (22)',
        value: '45.7',
      },
      {
        label: 'RSI EMA (12)',
        value: '48.3',
      },
      {
        label: 'Price vs 50-day average',
        value: '-3.1%',
      },
      {
        label: 'Price vs 200-day average',
        value: 'about flat',
      },
      {
        label: '200-day z-score',
        value: 'near 0',
      },
    ],
    risks: [
      'Customer concentration around hyperscaler AI capex becomes a bigger issue if one or two large customers slow custom-accelerator deployment.',
      'The market stops valuing Broadcom like a durable AI platform and falls back toward a still-premium, but more ordinary, hybrid multiple.',
      'Leverage remains meaningful enough to cap valuation support relative to net-cash AI leaders.',
    ],
    catalysts: [
      'AI semiconductor revenue keeps stepping up beyond the $4.4B Q2 guide.',
      'Infrastructure software remains durable after the VMware integration settles into a steadier base.',
      'Net debt begins to fall more visibly, making a premium EV-based valuation easier to defend.',
    ],
    monitorNext: [
      'Whether AI semiconductor revenue keeps stepping up beyond the $4.4B Q2 guide.',
      'Whether infrastructure software stays durable after the VMware integration settles into a steadier base.',
      'Whether adjusted EBITDA margin can stay in the mid-to-high 60s as revenue mix evolves.',
      'Whether net debt begins to fall more visibly.',
      'Whether hyperscaler AI capex concentration becomes a bigger risk.',
    ],
    sourcesUsed: [
      {
        label: 'Broadcom Q1 FY2026 earnings release',
        url: 'https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-first-quarter-fiscal-year-2026-financial',
      },
      {
        label: 'Broadcom Q1 FY2026 earnings call transcript PDF',
        url: 'https://investors.broadcom.com/static-files/687f8f31-c645-43f8-bf60-b00e73e8954f',
      },
      {
        label: 'Broadcom Q1 FY2026 10-Q filing',
        url: 'https://www.sec.gov/Archives/edgar/data/1730168/000173016826000027/avgo-20260201.htm',
      },
      {
        label: 'Broadcom Q4 FY2025 earnings call transcript PDF',
        url: 'https://investors.broadcom.com/static-files/ca0fe149-c0cd-4748-8183-f897f42a64f8',
      },
      {
        label: 'Nasdaq AVGO quote page',
        url: 'https://www.nasdaq.com/market-activity/stocks/avgo',
      },
      {
        label: 'Nasdaq AVGO quote API reference',
        url: 'https://api.nasdaq.com/api/quote/AVGO/info?assetclass=stocks',
      },
      {
        label: 'Yahoo Finance AVGO chart API',
        url: 'https://query1.finance.yahoo.com/v8/finance/chart/AVGO?range=1y&interval=1d&includePrePost=false',
      },
    ],
    history: [
      '2026-03-16: Replaced the placeholder AVGO mock with the archived professional analysis report.',
      '2026-03-16: Valuation status moved to rich after updating the point-in-time price to $322.16 and base fair value to $250.',
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
    businessType:
      'High-growth semiconductor compounder / AI infrastructure challenger',
    currentPrice: 193,
    valuationStatus: 'fair',
    newsImpactStatus: 'unchanged',
    thesisStatus: 'watch',
    technicalEntryStatus: 'neutral',
    actionState: 'needs review',
    dashboardBucket: 'needs-review',
    baseFairValue: 184,
    bearFairValue: 98,
    bullFairValue: 292,
    discountToBase: 4.9,
    summary:
      'AMD is fair to slightly expensive on the base case and only becomes clearly attractive if the dual-source AI GPU thesis validates more strongly.',
    lastUpdated: '2026-03-17',
    thesisStatement:
      "AMD is the only credible merchant challenger to NVIDIA in AI GPU compute, but today's price already requires substantial execution on AI GPU ramp, ROCm adoption, and continued EPYC stability.",
    thesisBullets: [
      'MI350 volume production, MI450 roadmap cadence, and ongoing EPYC share gains keep the structural AI and data center case alive.',
      'The main upside is hyperscaler and enterprise dual-sourcing that drives AI GPU share from low-single digits toward the mid-teens over three to five years.',
      'The main watch item is whether ROCm adoption and hyperscaler wins are strong enough to overcome NVIDIA CUDA switching costs.',
    ],
    variantPerception:
      'The market may be overweighting near-term margin noise and guidance disappointment while underweighting the structural diversification of AI GPU demand away from a single vendor.',
    valuationLens: {
      primary: 'Forward non-GAAP EPS x target P/E',
      crossCheck: 'EV/Sales',
      rationale:
        'AMD is a profitable high-growth semiconductor platform whose economics are best judged on forward earnings power, while EV/Revenue helps anchor sector-relative positioning during the ramp phase.',
    },
    currentValuationSnapshot: {
      marketCap: '~$314B',
      enterpriseValue: '~$312.5B',
      multiples: [
        '~29x forward P/E on 2026E non-GAAP EPS',
        '~6.7x EV / 2026E revenue',
      ],
      balanceSheetNote:
        'AMD carries about $1.5B of net cash, so leverage is not the key underwriting risk.',
    },
    newsToModel: [
      {
        event:
          'Q4 2025 beat on revenue and EPS, but Q1 2026 guidance and gross margin came in below elevated whisper expectations.',
        modelVariableChanged: 'H1 revenue sequencing and near-term EPS',
        impact:
          'This pressures near-term earnings but looks more like timing and mix than a structural break in the AI GPU story.',
        affectedScenario: 'base',
      },
      {
        event:
          'MI308 China export license remains only partially restored, with Q1 assumptions far below the Q4 shipping run rate.',
        modelVariableChanged: 'China revenue optionality and downside risk',
        impact:
          'License resolution is meaningful upside, while broader restrictions on MI350 and MI450 class products remain a real bear-case risk.',
        affectedScenario: 'bear / bull',
      },
      {
        event:
          'MI350 entered volume production and MI450 gained an early Oracle commitment for 2026 deployment.',
        modelVariableChanged: 'AI GPU ramp confidence and multiple ceiling',
        impact:
          'This raises confidence that AMD can sustain an annual accelerator cadence and modestly narrows the execution discount versus NVIDIA.',
        affectedScenario: 'base / bull',
      },
      {
        event:
          'EPYC share gains continue while Client remains supported by Ryzen AI PC demand.',
        modelVariableChanged: 'Earnings floor stability',
        impact:
          'CPU and client strength help support the base case even if the AI GPU ramp is not perfectly smooth.',
        affectedScenario: 'base',
      },
      {
        event:
          'Embedded recovery remains slower than expected after the prior inventory digestion cycle.',
        modelVariableChanged: 'Revenue mix and margin recovery',
        impact:
          'Embedded is a mix-positive recovery lever, so prolonged stagnation caps upside and keeps the margin profile more dependent on Data Center execution.',
        affectedScenario: 'bear / base',
      },
    ],
    scenarios: [
      {
        label: 'Bear',
        operatingAssumption:
          'FY2026 revenue of about $40B, with AI ramp disappointment, slower embedded recovery, and non-GAAP net margin around 20%.',
        valuationAssumption: '20x forward non-GAAP EPS',
        fairValue: '$98',
        whatMustBeTrue:
          'Export controls broaden, hyperscaler training wins remain elusive, ROCm adoption stalls, and AMD fails to translate AI demand into durable economics.',
      },
      {
        label: 'Base',
        operatingAssumption:
          'FY2026 revenue of about $46.5B, AI GPU roughly doubles, embedded normalizes gradually, and non-GAAP net margin reaches about 23%.',
        valuationAssumption: '28x forward non-GAAP EPS',
        fairValue: '$184',
        whatMustBeTrue:
          'Data Center scales toward roughly $20B+, gross margin stabilizes around 55-57%, and export controls do not worsen from the current framework.',
      },
      {
        label: 'Bull',
        operatingAssumption:
          'FY2026 revenue reaches about $54B, Data Center GPU scales toward $25B, embedded recovery accelerates, and non-GAAP net margin reaches about 26%.',
        valuationAssumption: '34x forward non-GAAP EPS',
        fairValue: '$292',
        whatMustBeTrue:
          'Two to three hyperscalers commit to MI450 at scale, ROCm reaches meaningful adoption, and China license treatment improves instead of tightening.',
      },
    ],
    currentPriceImplies:
      'At about $193, the market is effectively underwriting the full consensus 2026 path without paying for much upside surprise. It assumes about 34% revenue growth, AI GPU revenue roughly doubling, gross margin stability around 55-57%, and no meaningful re-rating beyond the current 29x forward multiple.',
    currentPriceImpliedFacts: [
      {
        label: '2026 revenue growth implied',
        value: 'about +34%, from $34.6B to roughly $46.5B',
      },
      {
        label: 'AI GPU revenue implied',
        value: 'roughly $18-20B in 2026, up from about $9.5B in 2025',
      },
      {
        label: 'Embedded recovery implied',
        value: 'slow normalization, not a return to peak embedded levels',
      },
      {
        label: 'Multiple assumption',
        value:
          'around 29x forward P/E, which implies sustained execution but not a full NVIDIA-style premium',
      },
    ],
    provisionalConclusion:
      'AMD looks fair to slightly expensive on the base case. The setup becomes attractive only if you believe the dual-source AI GPU thesis is still underpriced and that MI450 plus ROCm traction can push results beyond consensus.',
    technicalCommentary:
      'The post-earnings selloff has removed some froth, but the stock is still in a multi-month consolidation and does not yet show a clearly favorable momentum-turn setup. Better risk/reward would likely come closer to $175-185 with improving confirmation.',
    technicalSignals: [
      {
        label: 'Drawdown from 52-week high',
        value: 'about -28% from $267.08',
      },
      {
        label: 'Recent character',
        value: 'multi-month consolidation after a post-earnings selloff',
      },
      {
        label: 'Preferred accumulation zone',
        value: '$175-185 with stronger momentum confirmation',
      },
    ],
    risks: [
      'CUDA switching costs and hyperscaler inertia keep AMD share gains narrower than the bull case assumes.',
      'Export controls expand to MI350 or MI450 class products, reducing one of the most important upside levers.',
      'Embedded recovery remains slow, capping margin expansion and making the AI ramp carry too much of the valuation burden.',
    ],
    catalysts: [
      'Additional hyperscaler MI450 commitments would materially improve confidence that AMD becomes a real dual-source AI GPU supplier.',
      'Clearer China license treatment or a return toward prior MI308 shipping levels would lift revenue assumptions without changing the core roadmap.',
      'ROCm ecosystem progress that is visible in cloud instances, framework support, or named customer adoption would help narrow the software moat discount.',
    ],
    monitorNext: [
      'Q1 2026 earnings: whether gross margin stabilizes and Data Center re-accelerates.',
      'Hyperscaler procurement signals for MI350 and MI450 in both training and inference workloads.',
      'Export control and China license developments around MI308, MI350, and MI450 class products.',
      'ROCm ecosystem momentum, including cloud marketplace presence and framework adoption.',
      'Embedded segment recovery trajectory and whether it returns to a more meaningful mix-positive contributor.',
    ],
    sourcesUsed: [
      'AMD Q4 2025 Press Release, AMD Investor Relations, February 3, 2026',
      'AMD Q4 2025 Earnings Call Transcript, The Motley Fool, February 3, 2026',
      'AMD Q4 2025 Earnings Summary, CNBC, February 3, 2026',
      'AMD Q4 2025 Record Revenue and Earnings, Investing.com, February 2026',
      'AMD Q4 2025 Beats Forecasts, StockTitan, February 2026',
      'AMD 2026 Consensus Analyst Estimates, MarketBeat',
      'AMD Export Controls Revenue Impact, The Register and NextPlatform, May 2025',
      'AMD MI350 and MI450 roadmap coverage, September 2025 to March 2026',
      'AMD balance sheet data, StockAnalysis.com',
      'AMD forward P/E reference, ValueInvesting.io',
      'AMD 52-week price history, MacroTrends',
    ],
    history: [
      '2026-03-17: Replaced the placeholder AMD mock with the archived professional analysis report.',
      '2026-03-17: Valuation moved to fair with base fair value reset to $184 against a point-in-time price of about $193.',
    ],
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
