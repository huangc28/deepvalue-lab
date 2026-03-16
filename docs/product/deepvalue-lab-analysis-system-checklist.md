# DeepValue Lab Analysis System Checklist

Purpose:
- align on the work needed to make new AI agents produce stock analysis reports at DeepValue Lab quality
- convert the current method from tacit knowledge into repeatable execution

## Phase 1: Define The Quality Standard

- [ ] Create `DeepValue Lab Stock Analysis Standard`
- [ ] Define the minimum required sections of a valid report
- [ ] Define what each section must answer
- [ ] Define the required analytical order
- [ ] Define what counts as an incomplete report
- [ ] Define common failure modes
- [ ] Define when a report is good enough to be considered DeepValue Lab quality

Required report sections to standardize:
- [ ] business classification
- [ ] thesis
- [ ] variant perception
- [ ] valuation lens
- [ ] recent news and news-to-model translation
- [ ] bear / base / bull valuation
- [ ] what the current price implies
- [ ] provisional conclusion
- [ ] thesis status
- [ ] technical entry status
- [ ] what to monitor next

## Phase 2: Turn The Standard Into An Agent-Friendly Template

- [ ] Create `DeepValue Lab Report Contract`
- [ ] Create a reusable report template with fixed section order
- [ ] Define mandatory fields that cannot be skipped
- [ ] Define acceptable depth for each section
- [ ] Define expected conclusion style
- [ ] Define how technicals should appear in the report
- [ ] Define how news must be translated into model variables

Template requirements:
- [ ] the output should not stop at valuation only
- [ ] the output should not summarize news without model impact
- [ ] the output should not use technicals as a substitute for valuation
- [ ] the output should explicitly state whether thesis is intact, watch, or broken
- [ ] the output should explicitly state whether technical entry is favorable, neutral, or stretched

## Phase 3: Turn The Process Into Agent Operating Rules

- [ ] Create `DeepValue Lab Agent Execution SOP`
- [ ] Require the agent to query NotebookLM / second brain first
- [ ] Require the agent to use fresh official data after querying NotebookLM
- [ ] Require the agent to select valuation method based on business type
- [ ] Require the agent to apply the valuation-first, technicals-second rule
- [ ] Require the agent to complete all mandatory sections before treating the task as done
- [ ] Define default writeback behavior for second brain and archive

Execution rules to include:
- [ ] query second brain for framework, prior cases, and entry timing rules
- [ ] verify current facts using official and current sources
- [ ] produce the report in the required order
- [ ] do not auto-write each report into second brain by default
- [ ] write to second brain only when the user asks or when durable reusable insight is added

## Phase 4: Package The Process As A Skill

- [ ] Create a project skill for DeepValue Lab stock analysis
- [ ] Define the trigger conditions for when the skill should be used
- [ ] Encode the required workflow into the skill
- [ ] Encode the report contract into the skill
- [ ] Encode the guardrails into the skill
- [ ] Ensure the skill explicitly uses NotebookLM as the first context source
- [ ] Ensure the skill defaults to archive-first and selective second-brain writeback

Skill requirements:
- [ ] skill name decided
- [ ] `SKILL.md` created
- [ ] required workflow documented
- [ ] output contract documented
- [ ] guardrails documented
- [ ] references to relevant repo files and second-brain rules documented

## Phase 5: Validation And Review

- [ ] Create a review checklist for evaluating a generated analysis report
- [ ] Test a new agent on at least one stock using the standard
- [ ] Compare the generated report against DeepValue Lab expectations
- [ ] Identify gaps between the generated output and the target quality
- [ ] Refine the standard, template, SOP, or skill based on findings

Validation questions:
- [ ] did the agent query second brain first?
- [ ] did the report include all mandatory sections?
- [ ] did the report clearly separate valuation, thesis, news-to-model, and technical entry?
- [ ] did the conclusion reflect price versus value rather than business quality alone?
- [ ] did the report feel like a DeepValue Lab report rather than a generic AI summary?

## Current Alignment

Agreed direction:
- [x] use second brain as stable context, not the only execution mechanism
- [x] formalize the quality standard
- [x] formalize the output template
- [x] formalize the agent workflow
- [x] package the workflow as a reusable skill

Next implementation order:
- [ ] write the analysis standard
- [ ] write the report contract / template
- [ ] write the agent execution SOP
- [ ] create the DeepValue Lab stock analysis skill
- [ ] validate the skill on a fresh company analysis
