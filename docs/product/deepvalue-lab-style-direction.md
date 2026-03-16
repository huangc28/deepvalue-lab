# DeepValue Lab Style Direction

Purpose:
- define the visual and tonal direction for the DeepValue Lab web app
- translate external style references into a DeepValue-appropriate product language
- give future designers and AI agents a stable style context for implementation

Date:
- 2026-03-16

Status:
- draft

Reference:
- SkillsMP homepage style: [https://skillsmp.com/](https://skillsmp.com/)
- Daily Dip homepage style: [https://www.daily-dip.com/](https://www.daily-dip.com/)

## Current Direction Update

The first style pass borrowed too much from the SkillsMP interpretation:
- warmer accents
- a serif-heavy heading system
- a subtle background grid

After visual review, the current preferred direction is:
- keep the panel-based research cockpit structure
- keep the code/file labeling language in moderation
- shift typography and readability closer to Daily Dip

This means the current production direction is:
- mono-first typography
- calmer type scale
- cooler GitHub-dark-like palette
- higher text contrast
- no background grid

If old notes conflict with this update, follow this update.

## Core Style Decision

DeepValue Lab should not look like a generic fintech dashboard or broker interface.

The style direction should be:
- serious
- technical
- editorial
- research-first
- structured rather than flashy

The chosen direction is still:

`DeepValue Terminal Editorial`

But the current visual translation should be closer to Daily Dip than to SkillsMP.

This now means:
- use restrained editor and code-file language
- keep the interface productized and readable
- preserve a strong research-tool feeling
- avoid literal terminal cosplay
- bias toward readability over stylistic cleverness

## What We Are Borrowing From SkillsMP

SkillsMP is useful as a style reference because it combines:
- dark, focused interface mood
- strong monospace-led hierarchy
- panel-based information architecture
- code and file metaphors
- subtle grid-based background structure
- restrained warm accent colors instead of bright neon

These qualities fit a stock research product better than default SaaS styling.

## What We Are Not Copying

DeepValue Lab should not literally mimic a terminal product.

Do not copy:
- shell-command wording for every button
- excessive CLI jokes or gimmicks
- hacker-movie visual noise
- overly playful code metaphors that distract from financial analysis
- terminal aesthetics that weaken readability of dense research content

The goal is:
- research cockpit with technical flavor

Not:
- fake terminal app for investors

## Product Mood

DeepValue Lab should feel like:
- a professional investor's analysis workstation
- a disciplined internal memo system
- a product for careful judgment, not hype

The mood should communicate:
- rigor
- calm conviction
- analytical depth
- information density under control

## Visual Language

### Overall Character

The product should feel:
- dark
- sharp
- modular
- structured
- quiet but confident

This is a high-contrast interface, but not a loud one.

### Background

The default app background should be dark, flat, and calm.

Recommended treatment:
- near-black or GitHub-dark-like base
- no grid or blueprint pattern
- no decorative texture unless it clearly improves hierarchy
- optional very restrained tonal gradient in hero areas only

The background should reduce noise and improve long-session readability.

### Panels

Panels are central to the style system.

Most major modules should feel like:
- editor panes
- memo windows
- structured research blocks

Panel characteristics:
- thin, crisp borders
- soft corner radius
- dark surfaces with slight tonal separation
- light inner padding
- occasional top labels that resemble filenames, module names, or report sections

Panels should create order, not decoration.

## Typography

Typography should carry much of the product character.

### Type System Split

Use a mono-first system:
- monospace for labels, metrics, metadata, section names, badges, compact controls
- monospace can also be used for major headings when handled with calmer size steps
- do not rely on serif contrast as the main source of personality

Recommended role split:
- headings: larger, calmer monospace
- interface labels and data: compact monospace
- body copy: readable monospace with enough line-height

### Typography Intent

Monospace should signal:
- system structure
- exactness
- analytical discipline

The product should feel disciplined through hierarchy, spacing, and contrast rather than through a serif display face.

## Color System

The palette should be restrained and low-noise.

### Base Palette

Recommended base colors:
- charcoal / GitHub-dark-like background
- cooler dark gray surfaces
- high-contrast off-white text
- muted secondary grays

### Accent Palette

Accents should be cooler and clearer than the first pass.

Suggested accent families:
- muted blue for navigation, labels, and active controls
- disciplined green for constructive states
- amber for watch states
- restrained red for risk states
- optional purple for secondary accent use only

These accents should feel like GitHub-dark-style UI signals, not like trading heatmaps.

### Semantic Color Rules

Semantic colors still matter, but should stay disciplined:
- `cheap` and constructive states: muted green or sage
- `fair` and neutral states: slate or subdued gray
- `watch` states: amber or sand
- `rich`, `broken`, and risk states: muted terracotta or restrained red

Do not saturate these colors too heavily.

## Layout Principles

### Grid-Led Structure

The page should feel built on a clear grid.

Use:
- strong alignment
- clear column logic
- stacked modular panels
- predictable spacing rhythm

This reflects the analytical method and improves scanability.

### Hero Structure

Hero sections should feel like the first screen of a research file:
- large heading
- compact metadata row
- immediate key metrics
- one sentence of judgment

The hero should not feel like a marketing hero.

### Density

The product should support medium-high density.

That means:
- more information than a consumer app
- less overload than a data terminal

The interface should reward close reading without feeling cramped.

## UI Metaphors

The following metaphors are allowed and encouraged in moderation:
- file names
- section labels like `valuation.ts`, `thesis.md`, `scenario-model.json`
- module or report naming
- thin window headers
- memo-style captions

These metaphors should support clarity.

They should not replace plain language where plain language is more useful.

## Recommended Naming Style

Suitable examples:
- `valuation.ts`
- `thesis.md`
- `news-to-model.log`
- `pricing-context.json`
- `monitor-next.md`
- `sources.yml`

Use these as panel headers or metadata labels, not necessarily as the main section heading seen everywhere.

The main user-facing section name can stay plain:
- `Valuation`
- `Thesis`
- `What The Current Price Implies`

Then the file-style label can appear above it.

## Interaction Style

Interactions should feel crisp and quiet.

Recommended:
- subtle hover elevation
- thin border-color shifts
- short opacity and transform transitions
- light panel glow only when helpful

Avoid:
- bouncy animations
- exaggerated motion
- decorative micro-interactions

Motion should reinforce focus, not playfulness.

## Component Translation For DeepValue Lab

### Dashboard

Dashboard should feel like:
- a live research board
- a system of tracked analytical modules

Recommended treatment:
- cards as memo panes
- table view as structured terminal-style grid
- summary strip as status modules
- right rail as change log or signal log

### Company Cards

Cards should resemble:
- compact research dossiers
- not consumer product cards

Recommended card ingredients:
- top metadata row
- company name and ticker
- business type
- current price and base fair value
- one strong decision badge
- restrained state labels
- one concise judgment line

### Detail Page

Detail page should feel like:
- a layered research file
- not a tabbed profile page

Recommended treatment:
- top summary as executive memo
- lower sections as analysis modules
- each major section framed like a file or analytical pane

## Content Tone

The content tone should match the visual system.

Use:
- direct language
- memo-like summaries
- concise analytical phrasing
- explicit judgment

Avoid:
- generic fintech marketing copy
- emotional hype
- inflated investing language
- vague superlatives

The style should feel buy-side, not retail-promotional.

## Style Ratio

When implementing this direction, keep the balance at approximately:
- 70% research cockpit
- 20% editor / code metaphor
- 10% terminal flavor

This balance is important.

If the product leans too far into terminal flavor:
- it will become gimmicky
- it will reduce analytical credibility
- it will age poorly

## Do And Do Not

Do:
- use dark structured surfaces
- use crisp borders and panel framing
- use monospace intentionally
- use code-style metadata labels in moderation
- keep headings strong and editorial
- keep the mood serious and analytical

Do not:
- turn every control into a shell command
- overload the UI with neon colors
- use cyberpunk styling
- let the visual concept overpower the stock analysis content
- use terminal references where plain language is clearer

## One-Sentence Design Summary

DeepValue Lab should look like a disciplined investor research workstation with editor-grade structure and subtle terminal DNA, not a generic dashboard and not a literal terminal clone.
