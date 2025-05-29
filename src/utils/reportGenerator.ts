import { CampaignFormData, WorkflowStep } from '../types';
import { callGemini } from './gemini';

interface ReportSection {
  title: string;
  content: string;
}

interface ConsolidatedReport {
  title: string;
  executiveSummary: string;
  sections: ReportSection[];
  recommendations: string;
  nextSteps: string;
}

export async function generateConsolidatedReport(
  formData: CampaignFormData,
  steps: WorkflowStep[],
  apiKey: string
): Promise<ConsolidatedReport> {
  try {
    // Generate executive summary prompt
    const executiveSummaryPrompt = `
Generate a concise executive summary for the environmental campaign analysis of ${formData.core_issue_details.project_name}.

Context:
- Environmental Topic: ${formData.core_issue_details.environmental_topic}
- Jurisdiction: ${formData.core_issue_details.jurisdiction}
- Primary Goal: ${formData.campaign_outcome.primary_goal}
- Target Audience: ${formData.campaign_outcome.primary_audience}

Include:
1. Brief overview of the campaign context
2. Key findings from the analysis
3. Critical success factors
4. Major risks and challenges
5. Primary recommendations

Format the response as a professional executive summary of 2-3 paragraphs.`;

    // Generate recommendations prompt
    const recommendationsPrompt = `
Based on the complete analysis of the ${formData.core_issue_details.project_name} campaign, generate strategic recommendations.

Analysis Context:
${steps.map(step => `- ${step.title}: ${step.result}`).join('\n')}

Provide:
1. Top 3-5 strategic priorities
2. Specific tactical recommendations
3. Risk mitigation strategies
4. Success metrics and KPIs

Format as clear, actionable recommendations with bullet points.`;

    // Generate next steps prompt
    const nextStepsPrompt = `
Create a detailed next steps plan for the ${formData.core_issue_details.project_name} campaign.

Campaign Goal: ${formData.campaign_outcome.primary_goal}
Target Audience: ${formData.campaign_outcome.primary_audience}

Include:
1. Immediate actions (next 30 days)
2. Medium-term priorities (60-90 days)
3. Long-term strategic initiatives
4. Key milestones and deadlines
5. Resource requirements

Format as a clear timeline with specific actions and owners.`;

    // Execute all prompts in parallel
    const [executiveSummary, recommendations, nextSteps] = await Promise.all([
      callGemini(executiveSummaryPrompt, apiKey),
      callGemini(recommendationsPrompt, apiKey),
      callGemini(nextStepsPrompt, apiKey)
    ]);

    // Validate responses
    if (executiveSummary.error || recommendations.error || nextSteps.error) {
      throw new Error('Failed to generate one or more report sections');
    }

    // Compile report sections
    const sections: ReportSection[] = steps.map(step => ({
      title: step.title,
      content: step.result || 'Analysis pending'
    }));

    return {
      title: `${formData.core_issue_details.project_name} - Campaign Analysis Report`,
      executiveSummary: executiveSummary.content,
      sections,
      recommendations: recommendations.content,
      nextSteps: nextSteps.content
    };
  } catch (error) {
    console.error('Error generating consolidated report:', error);
    throw error;
  }
}

export function formatConsolidatedReport(report: ConsolidatedReport): string {
  return `# ${report.title}
Date: ${new Date().toLocaleDateString()}

## Executive Summary

${report.executiveSummary}

## Table of Contents

1. Executive Summary
2. Analysis Reports
3. Strategic Recommendations
4. Next Steps & Implementation Plan

## Analysis Reports

${report.sections.map((section, index) => `
### ${index + 1}. ${section.title}

${section.content}
`).join('\n')}

## Strategic Recommendations

${report.recommendations}

## Next Steps & Implementation Plan

${report.nextSteps}
`;
}