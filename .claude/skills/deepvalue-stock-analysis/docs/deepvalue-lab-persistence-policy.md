# Stock Research Persistence Policy

Date: 2026-03-15

## Policy

Use a two-layer persistence model for stock analysis.

## Layer 1: Second Brain (Obsidian / NotebookLM)

The second brain stores reusable frameworks, distilled reasoning patterns, concise company summaries, validated case takeaways, and durable lessons that should improve future analysis.

Do not store every full report verbatim, repetitive price snapshots, or raw news dumps.

## Layer 2: Research Archive

The repo research archive stores full time-stamped reports, point-in-time prices, source links, detailed news interpretation, scenario tables, and provisional conclusions.

Default archive root: research/archive/
Recommended path pattern: research/archive/YYYY/MM/DD/<ticker>-analysis.md

## Default workflow

Build the full report in the research archive.
Extract the durable parts into the second brain.
Keep the second brain short, opinionated, and reusable.

## Extract into second brain only

  business classification
  valuation lens
  key assumptions
  how recent news changed the model
  provisional conclusion
  what to monitor next
  reusable lesson for future stock work

This policy exists so future agents can recover the full historical report from the archive while recovering the reusable analytical pattern from the second brain.
