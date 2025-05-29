import { CampaignFormData } from '../types';

// Template prompts for each step in the workflow
export const promptTemplates = {
  politicalContext: `
Objective:

Generate a preliminary political analysis of the {decision_status} of the {project_name} in {jurisdiction}, identifying the key narratives, stakeholders, and implicit subtexts involved in the decision.

Prompt:

You are a senior strategist specializing in union, industrial, and political campaigns, with deep expertise in corporate behavior, government labor policy, and power mapping in {jurisdiction}. Perform a detailed exploratory analysis of the {decision_type} regarding the {campaign_target} campaign led by {union_name}.

Tasks (Provide detailed and structured responses):
1. Explicit Political Narratives:
Clearly outline the explicit reasons provided for the {decision_status} of the {project_name}. Summarize the stated justification given by {decision_makers} and any official communications.

2. Implicit Political Subtexts:
Identify underlying political motivations, subtexts, or strategic considerations that might have influenced this decision but were not explicitly stated.

3. Key Political Stakeholders and Positions:
List key stakeholders (e.g., {decision_makers}, opposition leaders, {industry_actors}, {advocacy_groups}) and clearly outline their positions and motivations.

4. Initial Exploration of Potential Influences:
Provide a preliminary exploration of any implicit influence or alignment between the {jurisdiction} decision-making process and powerful economic interests such as {economic_interests}.

5. Major Narrative Frames:
Identify the dominant narrative frames used by both supporters and opponents of the {project_name} (e.g., "community control vs corporate capture", "clean future vs jobs risk").

6. Potential Areas for Deeper Investigation:
Identify areas where further analysis may reveal ideological bias or economic dependency (e.g., fossil fuel lobbying, planning override mechanisms).
`,

  politicalContextRefinement: `
Objective:

Perform an in-depth refinement of the political analysis, explicitly probing deeper into identified implicit motivations, fossil-fuel industry influence, and ideological biases using the output from Stage 1.

Prompt:

You are now tasked to refine and deepen the strategic campaign analysis based on the exploratory report from Stage 1 (provided below). Your objective is to probe deeply into corporate-government relations, anti-union strategies, and political biases shaping the campaign environment.

Stage 1 Analysis (for context):
{previous_analysis}

Refinement Tasks (Provide thorough and detailed responses):
1. Deep-Dive into Fossil-Fuel Sector Influence:
Examine any political donations, lobbying relationships, industry affiliations, or appointments linking {decision_makers} to {economic_interests}. Consider historical patterns and recent disclosures.

2. Ideological Analysis:
Assess the worldview, rhetoric, and decision-making history of key actors (e.g., {decision_makers}) regarding environmental protection, industry regulation, and market intervention.

3. Stakeholder Influence Mapping:
Map the power and influence of key players, including corporate interests, media platforms, unions, communities, and political operatives.

4. Historical and Comparative Analysis:
Identify 1–2 precedent cases in {jurisdiction} or similar contexts where environmental or infrastructure decisions appeared influenced by entrenched fossil-fuel interests.

5. Strategic Implications and Recommendations:
Outline the implications of these findings for advocacy. What openings, contradictions, or leverage points exist? Recommend investigative or communications strategies accordingly.
`,

  economicContext: `
Objective:

Provide a thorough economic analysis of the {decision_status} of the {project_name} in {jurisdiction}, focusing on direct, indirect, and strategic implications for investment, pricing, and competition.

Prompt:

You are a senior economic analyst specializing in environmental infrastructure and regional development. Provide a structured economic analysis of the {decision_type} regarding the {project_name}.

Tasks (Detailed and structured responses required):
1. Direct Economic Impacts:
Outline the immediate economic consequences of the {decision_status}. Include job creation or loss estimates, impact on local suppliers, construction sector spillovers, and potential GDP contributions.

2. Indirect Economic Impacts:
Assess effects on investor confidence in {jurisdiction}, potential chilling effect on green finance, and implications for long-term energy pricing and grid reliability.

3. Economic Influence of Fossil-Fuel Interests:
Analyze how the decision may favor {economic_interests}, either via market share protection, policy delay, or subsidy advantage. Assess any direct or indirect public support received by these sectors.

4. Comparative Economic Analysis:
Reference comparable cases (domestic or international) where renewable projects were blocked or cancelled, noting economic arguments used and subsequent outcomes.

5. Secondary Economic Beneficiaries:
Identify other sectors (e.g., real estate, mining logistics, infrastructure) that may benefit economically from the project's cancellation.

6. Recommendations for Economic Advocacy:
Develop clear, publicly understandable economic arguments in favor of reinstating or supporting the {project_name}. Focus on jobs, savings, and future competitiveness.
`,

  environmentalContext: `
Objective:

Provide a comprehensive environmental analysis of the {decision_status} of the {project_name}, clearly distinguishing genuine ecological concerns from politically framed objections.

Prompt:

You are a senior environmental analyst specializing in infrastructure ecology and energy policy. Evaluate the environmental dimensions of the {decision_type} of the {project_name} in {jurisdiction}.

Tasks (Detailed and structured responses required):
1. Environmental Benefits of the Project:
Quantify the projected emissions reductions, biodiversity offsets, land-use rehabilitation, or climate contributions lost as a result of the {decision_status}.

2. Environmental Concerns Raised:
Summarize key ecological objections (e.g., habitat fragmentation, visual impacts). Evaluate each based on scientific validity and proportionality.

3. Politically Driven Environmental Arguments:
Identify cases where ecological language was used to mask economic, political, or ideological motivations—particularly by fossil-aligned actors.

4. Environmental Impact Comparison:
Compare the environmental footprint of the cancelled project with ongoing operations by {economic_interests} (e.g., emissions, water use, species impact).

5. Potential Policy Precedent:
Discuss the precedent this sets for future environmental assessments or renewable approvals—e.g., will it incentivize NIMBYism or empower anti-renewable actors?

6. Strategic Recommendations:
Recommend frames, visuals, or talking points for public communication about ecological trade-offs and green hypocrisy.
`,

  stakeholderCommunity: `
Objective:

Perform an in-depth analysis of stakeholders and community dynamics relating to the {decision_status} of the {project_name} in {jurisdiction}.

Prompt:

You are a stakeholder engagement strategist specializing in high-conflict infrastructure campaigns. Provide a full analysis of stakeholder positions and influence dynamics surrounding the {project_name}.

Tasks (Detailed and structured responses required):
1. Explicit Stakeholder Mapping:
List and describe the positions of:
• {decision_makers}
• {industry_actors}
• {advocacy_groups}
• Local councils, community orgs, and regional leaders
• Media outlets

2. Implicit or Hidden Stakeholder Interests:
Identify political patrons, consultants, landholders, or corporate actors not publicly visible but likely influential.

3. Community Consultation and Sentiment Analysis:
Assess the robustness and representativeness of consultation processes. Cross-reference objections with broader community sentiment and demographic data.

4. Stakeholder Influence Mapping:
Create a structured map showing stakeholder alignment, conflict, and power asymmetries.

5. Assessment of Alliance Potential:
Identify possible strategic alliances (e.g., between environmental orgs and farmers, or youth groups and unions) to shift the power balance.

6. Recommendations for Engagement Strategy:
Suggest actionable steps for building support, defusing opposition, and spotlighting captured or illegitimate actors.
`,

  messageFrameAnalysis: `
Objective:
Perform a deep analysis of the language, values, and frames used in discourse around the {decision_status} of the {project_name} in {jurisdiction}.

Prompt:
You are a cognitive linguist and expert in progressive political communications. Your task is to deeply analyse and synthesise the dominant language, values, and frames used both for and against the {project_name}.

Campaign Context:
- Issue: {environmental_topic}
- Geographic context: {jurisdiction}
- Proposed change: {decision_type} regarding {project_name}
- Desired outcome: {primary_goal}
- Primary audience: {primary_audience}
- Campaign objective: {primary_goal}
- Known comparisons: Similar environmental infrastructure decisions in {jurisdiction}

Analysis Tasks:

1. Frames
Identify 4–6 of the most common frames used to support the project, and 4–6 used to oppose it.
- Name each frame
- Give a short description or example of its use
- Note how these frames appear in public discourse

2. Values Mapping
Map the dominant Schwartz values evoked in both supporting and opposing frames, particularly examining:
- Values expressed by {decision_makers}
- Values emphasized by {advocacy_groups}
- Values prioritized by {industry_actors}
- Community values reflected in {community_dynamics}

3. Narrative and Linguistic Devices
Identify recurring rhetorical features in the discourse around {project_name}, such as:
- Metaphors
- Similes, personifications, or analogies
- Use of moral, economic, organic, or identity-based themes
- Common lexical clusters and phrases
Consider especially the language used in:
- {political_motivations}
- {ideological_framing}
- {corporate_influence}

4. Comparative Case Analysis
Find 2–3 similar campaigns based on:
- Similar environmental topics ({environmental_topic})
- Similar jurisdiction context ({jurisdiction})
- Similar stakeholder dynamics ({industry_actors}, {advocacy_groups})
For each case:
- Briefly describe
- Identify narrative parallels
- Note framing strategies that succeeded or failed

5. Counter-Narratives
Predict 2–3 common oppositional responses to pro-change messaging.
For each:
- Analyze the underlying values and assumptions
- Identify potential weaknesses or contradictions
- Recommend narrative reframing or inoculation tactics
`,

  messageDevelopment: `
Objective:
Using the frame analysis, develop targeted campaign messages for achieving {primary_goal} regarding the {project_name} in {jurisdiction}.

Prompt:
You are a cognitive linguist and progressive communications strategist. Synthesize the previous analysis into concrete messaging recommendations.

Campaign Context:
- Issue: {environmental_topic}
- Geographic context: {jurisdiction}
- Proposed change: {decision_type} regarding {project_name}
- Desired outcome: {primary_goal}
- Primary audience: {primary_audience}

Message Development Tasks:

1. Four 150-word Pro-Change Messages

A. Values-Based Message
- Focus on shared values and moral clarity
- Draw from community values identified in {community_dynamics}
- Address core concerns of {primary_audience}

B. Identity-Based Message
- Anchor in local/regional identity and pride
- Reference {jurisdiction}'s environmental leadership potential
- Connect to community aspirations and history

C. Urgency-Solution Message
- Drive urgency around {environmental_topic}
- Present clear pathway to {primary_goal}
- Emphasize immediate benefits and consequences

D. Accountability-Driven Message
- Focus on political corruption and undue influence
- Highlight improper relationships between {decision_makers} and {industry_actors}
- Frame the {decision_status} as a betrayal of public trust
- Emphasize regulatory capture by {economic_interests}

2. Opposition Message Simulation
Create one persuasive opposition message that:
- Reflects concerns of {industry_actors}
- Uses frames identified in analysis
- Incorporates {political_motivations} and {ideological_framing}

3. Message Matrix
For each message provide:
- Title
- Primary frame used
- Key Schwartz values evoked
- Suggested format (e.g., video, social, speech)
- Efficacy score (0-100)
- Detailed scoring explanation considering:
  * Value alignment with {primary_audience}
  * Emotional resonance
  * Call to action clarity
  * Risk assessment
- Specific improvement suggestions

4. Implementation Guidance
- Recommend message sequence and timing
- Suggest specific channels and formats
- Provide guidelines for messenger selection
- Note potential risks and mitigation strategies
`,

  campaignPlan: `
Objective:

Translate the messaging guide into a full-spectrum campaign strategy aligned to the goal of {primary_goal} related to the {decision_type} of the {project_name}.

Prompt:

You are a senior political campaign strategist specializing in environmental and infrastructure advocacy. Develop a strategy to achieve the campaign's objective of {primary_goal}.

Campaign Plan Tasks:
1. Campaign Goals:
Define 2–3 SMART objectives directly tied to influence, visibility, or pressure outcomes.

2. Strategic Narrative & Timeline:
Outline the overarching narrative arc and key time-sensitive moments (e.g., parliament sittings, approvals, community events).

3. Audience Segmentation:
Profile and segment your target audiences, including:
• {primary_audience}
• Community supporters
• Political influencers
• Media channels

4. Tactics & Actions:
Suggest campaign actions such as:
• Message dissemination strategies
• Stunt planning or symbolic actions
• Stakeholder engagement series

5. Opposition Risk Analysis:
Anticipate likely counter-moves and prepare narrative defences using inoculation techniques derived from earlier prompts.

6. Budget Framework:
Provide a high-level estimate of campaign costs categorized by channel, coordination, and contingency reserves.
`,

  consolidatedReport: `
# {project_name} - Campaign Analysis Report
Date: ${new Date().toLocaleDateString()}

## Executive Summary

Project Overview:
- Environmental Topic: {environmental_topic}
- Jurisdiction: {jurisdiction}
- Primary Goal: {primary_goal}
- Target Audience: {primary_audience}

## Table of Contents

1. Executive Summary
2. Project Context
3. Methodology
4. Detailed Analysis Reports
5. Synthesis & Recommendations
6. Next Steps

## Project Context

Issue Description:
{issue_description}

Decision Status: {decision_status}
Decision Type: {decision_type}

## Methodology

This analysis was conducted through a series of specialized assessments covering:
- Political context and dynamics
- Economic implications
- Environmental impacts
- Stakeholder relationships
- Message framing and communication strategy

## Detailed Analysis Reports

### 1. Political Context Analysis
{step_1_result}

### 2. Political Context Refinement
{step_2_result}

### 3. Economic Context Analysis
{step_3_result}

### 4. Environmental Context Analysis
{step_4_result}

### 5. Stakeholder & Community Analysis
{step_5_result}

### 6. Message Frame Analysis
{step_6_result}

### 7. Message Development
{step_7_result}

### 8. Strategic Campaign Plan
{step_8_result}

## Synthesis & Recommendations

[Generated synthesis based on all analyses]

## Next Steps

[Strategic recommendations and action items]
`,
};

// This function replaces placeholders in templates with actual data
export function populateTemplate(template: string, data: any): string {
  let populatedTemplate = template;
  
  // Handle step results for consolidated report
  if (template === promptTemplates.consolidatedReport && data.steps) {
    data.steps.forEach((step: any, index: number) => {
      populatedTemplate = populatedTemplate.replace(
        `{step_${index + 1}_result}`,
        step.result || '[Analysis pending]'
      );
    });
  }

  // Core issue details
  if (data.core_issue_details) {
    populatedTemplate = populatedTemplate
      .replace(/{project_name}/g, data.core_issue_details.project_name)
      .replace(/{decision_type}/g, data.core_issue_details.decision_type)
      .replace(/{decision_status}/g, data.core_issue_details.decision_status)
      .replace(/{decision_date}/g, data.core_issue_details.decision_date || 'Not specified')
      .replace(/{jurisdiction}/g, data.core_issue_details.jurisdiction)
      .replace(/{environmental_topic}/g, data.core_issue_details.environmental_topic)
      .replace(/{issue_description}/g, data.core_issue_details.issue_description);
  }
  
  // Stakeholders
  if (data.stakeholders) {
    populatedTemplate = populatedTemplate
      .replace(/{decision_makers}/g, data.stakeholders.decision_makers.join(', '))
      .replace(/{industry_actors}/g, data.stakeholders.industry_actors.join(', '))
      .replace(/{advocacy_groups}/g, data.stakeholders.advocacy_groups.join(', '))
      .replace(/{economic_interests}/g, data.stakeholders.economic_interests.join(', '))
      .replace(/{community_dynamics}/g, data.stakeholders.community_dynamics);
  }
  
  // Political & Strategic
  if (data.political_and_strategic) {
    populatedTemplate = populatedTemplate
      .replace(/{political_motivations}/g, data.political_and_strategic.political_motivations)
      .replace(/{ideological_framing}/g, data.political_and_strategic.ideological_framing)
      .replace(/{corporate_influence}/g, data.political_and_strategic.corporate_influence);
  }
  
  // Campaign Outcome
  if (data.campaign_outcome) {
    populatedTemplate = populatedTemplate
      .replace(/{primary_goal}/g, data.campaign_outcome.primary_goal)
      .replace(/{primary_audience}/g, data.campaign_outcome.primary_audience);
  }
  
  return populatedTemplate;
}