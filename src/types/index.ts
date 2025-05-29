// Define types for our campaign planning app

export interface CoreIssueDetails {
  project_name: string;
  decision_type: 'Political' | 'Corporate' | 'Legislative' | 'Regulatory' | 'Hybrid' | 'Other';
  decision_status: 'Proposed' | 'Under Review' | 'Cancelled' | 'Delayed' | 'Approved' | 'Other';
  decision_date?: string;
  jurisdiction: string;
  environmental_topic: string;
  issue_description: string;
}

export interface DocumentsAndLinks {
  news_links: string[];
  reference_links: string[];
  uploaded_documents: UploadedDocument[];
}

export interface UploadedDocument {
  id: string;
  name: string;
  content: string;
  type: 'news' | 'report' | 'other';
}

export interface Stakeholders {
  decision_makers: string[];
  industry_actors: string[];
  advocacy_groups: string[];
  economic_interests: string[];
  community_dynamics: string;
}

export interface PoliticalAndStrategic {
  political_motivations: string;
  ideological_framing: string;
  corporate_influence: string;
}

export interface CampaignOutcome {
  primary_goal: string;
  primary_audience: string;
}

export interface CampaignFormData {
  core_issue_details: CoreIssueDetails;
  documents_and_links: DocumentsAndLinks;
  stakeholders: Stakeholders;
  political_and_strategic: PoliticalAndStrategic;
  campaign_outcome: CampaignOutcome;
  isNewCampaign?: boolean;
  analysisState?: {
    steps: WorkflowStep[];
    currentStep: number;
    isComplete: boolean;
  };
}

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'loading' | 'completed' | 'error';
  result?: string;
  template: string;
}

export interface OpenAIResponse {
  id: string;
  content: string;
  error?: string;
}

export interface PromptTemplates {
  [key: string]: string;
}