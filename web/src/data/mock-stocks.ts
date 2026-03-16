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
