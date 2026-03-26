# DeepValue Lab Technicals Guide

## Entry Timing Rule

Date: 2026-03-16

### Core Rule

Use valuation and business analysis first. Use technical indicators second.

Professional ordering:
  Thesis: decide whether the business is attractive and why the market may be mispricing it.
  Valuation: decide whether the current price is cheap, fair, or expensive relative to a reasoned value range.
  Catalyst and risk: decide what could unlock value and what could invalidate the thesis.
  Execution timing: use technical indicators only to improve entry quality.

Correct use:
  If valuation is attractive, RSI and MRC can help identify better timing.
  If valuation is unattractive, RSI and MRC should not override the fundamental conclusion.
  Technicals are a confirmation layer, not the thesis itself.

Important warning:
  The setup should not be interpreted as proof of a bottom. It should be interpreted as evidence that the stock may be entering a more favorable accumulation zone.

Meta-principle:
  A professional process does not let technicals decide what is cheap. It lets technicals help decide when to act on a valuation view.

---

## TradingView Indicator Reference

Date: 2026-03-16

### Indicator 1: RSI plus EMA

Observed configuration: RSI plus EMA with parameters 22 and 12.

Most likely interpretation:
  RSI length = 22
  EMA length = 12, applied to RSI rather than price

What it does:
  RSI measures momentum on a 0-100 scale.
  The EMA smooths RSI so momentum shifts are easier to read.
  RSI above its EMA suggests improving momentum.
  RSI below its EMA suggests weakening momentum.
  RSI crossing above its EMA after weakness can act as a short-term recovery signal.
  RSI crossing below its EMA after strength can act as a short-term weakening signal.

How to use it in practice:
  RSI near low levels plus upward cross through EMA can suggest selling pressure is easing.
  RSI near high levels plus downward cross through EMA can suggest momentum is fading.
  This is better treated as momentum confirmation than as a valuation tool.

### Indicator 2: MRC hlc3 SuperSmoother 200 1 2.415 60

Parameter interpretation:
  hlc3: input price is the average of high, low, and close
  SuperSmoother: smoothing method used to reduce noise while keeping the channel responsive
  200: long lookback, so the channel reflects a medium-to-long-term mean
  1: inner channel multiplier, representing a more normal deviation zone
  2.415: outer channel multiplier, representing a more stretched deviation zone

What it does:
  Estimates a central mean line and surrounding deviation bands.
  Price near the center implies more normal positioning.
  Price near or beyond upper outer band implies an extended condition above mean.
  Price near or beyond lower outer band implies an extended condition below mean.

How to use it in practice:
  It is a location tool, not a value tool.
  It helps answer whether the current price is far from its recent mean.
  It works best when combined with momentum confirmation.

### How the Two Indicators Work Together

  MRC answers: is price stretched relative to its mean?
  RSI plus EMA answers: is momentum starting to reverse or continue?

Useful combinations:
  Price near lower outer MRC band plus RSI crossing above EMA: possible improving entry zone
  Price near upper outer MRC band plus RSI crossing below EMA: possible weakening zone
  Price stretched but RSI still deteriorating: avoid assuming the bottom is already in
  Price stretched upward with still-rising RSI: avoid assuming the top is already in during strong trends

### Decision Framework

  Valuation cheap plus technical oversold: strongest candidate for entry or scaling in.
  Valuation cheap plus technical breakdown still ongoing: potentially attractive, but entry timing may still be poor.
  Valuation fair plus technical oversold: acceptable tactical setup, but conviction should be lower.
  Valuation expensive plus technical euphoric or extended: weakest risk-reward.
  Valuation expensive plus technical pullback: not automatically attractive, because the stock may still be expensive on fundamentals.

Main warning:
  Do not use RSI or MRC to claim a stock is intrinsically cheap. Use them only to improve timing around a valuation view.
