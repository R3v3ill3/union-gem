import React, { useState } from 'react';
import { Users } from 'lucide-react';
import FormInput from './FormInput';
import MultiItemInput from './MultiItemInput';
import SelectInput from './SelectInput';
import DocumentUpload from './DocumentUpload';
import { CampaignFormData, UploadedDocument } from '../types';

interface CampaignFormProps {
  onSubmit: (data: CampaignFormData) => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<CampaignFormData>({
    core_issue_details: {
      project_name: '',
      union_name: '',
      campaign_target: '',
      decision_type: 'Industrial',
      decision_status: 'Planning',
      decision_date: '',
      jurisdiction: '',
      campaign_topic: '',
      issue_description: '',
    },
    documents_and_links: {
      news_links: [],
      reference_links: [],
      uploaded_documents: [],
    },
    stakeholders: {
      decision_makers: [],
      industry_actors: [],
      advocacy_groups: [],
      economic_interests: [],
      community_dynamics: '',
      union_density: '',
      worker_demographics: '',
    },
    political_and_strategic: {
      political_motivations: '',
      ideological_framing: '',
      corporate_influence: '',
      union_strategy: '',
      industrial_leverage: '',
    },
    campaign_outcome: {
      primary_goal: '',
      primary_audience: '',
      worker_demands: [],
      success_metrics: [],
    },
  });
  
  const [activeSection, setActiveSection] = useState('core_issue_details');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (section: keyof CampaignFormData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: '',
      }));
    }
  };

  const handleArrayInputChange = (section: keyof CampaignFormData, field: string, value: string[]) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleDocumentUpload = (document: UploadedDocument) => {
    setFormData(prev => ({
      ...prev,
      documents_and_links: {
        ...prev.documents_and_links,
        uploaded_documents: [...prev.documents_and_links.uploaded_documents, document],
      },
    }));
  };

  const handleDocumentRemove = (documentId: string) => {
    setFormData(prev => ({
      ...prev,
      documents_and_links: {
        ...prev.documents_and_links,
        uploaded_documents: prev.documents_and_links.uploaded_documents.filter(
          doc => doc.id !== documentId
        ),
      },
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.core_issue_details.project_name) {
      newErrors['core_issue_details.project_name'] = 'Campaign name is required';
    }
    
    if (!formData.core_issue_details.union_name) {
      newErrors['core_issue_details.union_name'] = 'Union name is required';
    }

    if (!formData.core_issue_details.campaign_target) {
      newErrors['core_issue_details.campaign_target'] = 'Campaign target is required';
    }
    
    if (!formData.core_issue_details.jurisdiction) {
      newErrors['core_issue_details.jurisdiction'] = 'Jurisdiction is required';
    }
    
    if (!formData.core_issue_details.campaign_topic) {
      newErrors['core_issue_details.campaign_topic'] = 'Campaign topic is required';
    }
    
    if (!formData.core_issue_details.issue_description) {
      newErrors['core_issue_details.issue_description'] = 'Issue description is required';
    }
    
    if (!formData.campaign_outcome.primary_goal) {
      newErrors['campaign_outcome.primary_goal'] = 'Primary goal is required';
    }
    
    if (!formData.campaign_outcome.primary_audience) {
      newErrors['campaign_outcome.primary_audience'] = 'Primary audience is required';
    }

    if (formData.campaign_outcome.worker_demands.length === 0) {
      newErrors['campaign_outcome.worker_demands'] = 'At least one worker demand is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
        setIsSubmitting(false);
      }
    } else {
      const errorSections = Object.keys(errors).map(key => key.split('.')[0]);
      if (errorSections.length > 0) {
        const firstErrorSection = errorSections[0] as keyof CampaignFormData;
        setActiveSection(firstErrorSection);
      }
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'core_issue_details':
        return (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Campaign Details</h3>
            
            <FormInput
              id="project_name"
              label="Campaign Name"
              value={formData.core_issue_details.project_name}
              onChange={(e) => handleInputChange('core_issue_details', 'project_name', e.target.value)}
              required
              error={errors['core_issue_details.project_name']}
            />

            <FormInput
              id="union_name"
              label="Union Name"
              value={formData.core_issue_details.union_name}
              onChange={(e) => handleInputChange('core_issue_details', 'union_name', e.target.value)}
              required
              error={errors['core_issue_details.union_name']}
            />

            <FormInput
              id="campaign_target"
              label="Campaign Target"
              placeholder="e.g., Company name, government department, industry sector"
              value={formData.core_issue_details.campaign_target}
              onChange={(e) => handleInputChange('core_issue_details', 'campaign_target', e.target.value)}
              required
              error={errors['core_issue_details.campaign_target']}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
                id="decision_type"
                label="Campaign Type"
                options={['Industrial', 'Political', 'Legal', 'Community', 'Corporate', 'Other']}
                value={formData.core_issue_details.decision_type}
                onChange={(e) => handleInputChange('core_issue_details', 'decision_type', e.target.value)}
              />
              
              <SelectInput
                id="decision_status"
                label="Campaign Status"
                options={['Planning', 'Active', 'Escalating', 'Resolving', 'Victory', 'Defeat']}
                value={formData.core_issue_details.decision_status}
                onChange={(e) => handleInputChange('core_issue_details', 'decision_status', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="decision_date"
                label="Campaign Start Date"
                type="date"
                value={formData.core_issue_details.decision_date || ''}
                onChange={(e) => handleInputChange('core_issue_details', 'decision_date', e.target.value)}
              />
              
              <FormInput
                id="jurisdiction"
                label="Location/Region"
                value={formData.core_issue_details.jurisdiction}
                onChange={(e) => handleInputChange('core_issue_details', 'jurisdiction', e.target.value)}
                required
                error={errors['core_issue_details.jurisdiction']}
              />
            </div>
            
            <FormInput
              id="campaign_topic"
              label="Key Campaign Issue"
              placeholder="e.g., wage theft, safety violations, job security"
              value={formData.core_issue_details.campaign_topic}
              onChange={(e) => handleInputChange('core_issue_details', 'campaign_topic', e.target.value)}
              required
              error={errors['core_issue_details.campaign_topic']}
            />
            
            <FormInput
              id="issue_description"
              label="Campaign Description"
              placeholder="Provide 1-3 paragraphs describing the campaign issues and context"
              value={formData.core_issue_details.issue_description}
              onChange={(e) => handleInputChange('core_issue_details', 'issue_description', e.target.value)}
              multiline
              rows={5}
              required
              error={errors['core_issue_details.issue_description']}
            />
          </div>
        );
      
      case 'documents_and_links':
        return (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Key Documents & Links</h3>
            
            <MultiItemInput
              id="news_links"
              label="Relevant News Articles or Media Coverage"
              placeholder="Enter URL and press Enter or Add"
              items={formData.documents_and_links.news_links}
              onChange={(items) => handleArrayInputChange('documents_and_links', 'news_links', items)}
            />
            
            <MultiItemInput
              id="reference_links"
              label="Links to Reports or Official Documents"
              placeholder="Enter URL and press Enter or Add"
              items={formData.documents_and_links.reference_links}
              onChange={(items) => handleArrayInputChange('documents_and_links', 'reference_links', items)}
            />

            <DocumentUpload
              onDocumentUpload={handleDocumentUpload}
              onDocumentRemove={handleDocumentRemove}
              documents={formData.documents_and_links.uploaded_documents}
              className="mt-6"
            />
          </div>
        );
      
      case 'stakeholders':
        return (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Stakeholders & Demographics</h3>
            
            <MultiItemInput
              id="decision_makers"
              label="Key Decision-Makers"
              placeholder="e.g., CEO, HR Director, Minister"
              items={formData.stakeholders.decision_makers}
              onChange={(items) => handleArrayInputChange('stakeholders', 'decision_makers', items)}
            />
            
            <MultiItemInput
              id="industry_actors"
              label="Industry Players Involved"
              placeholder="e.g., Industry associations, competitor companies"
              items={formData.stakeholders.industry_actors}
              onChange={(items) => handleArrayInputChange('stakeholders', 'industry_actors', items)}
            />
            
            <MultiItemInput
              id="advocacy_groups"
              label="Allied Organizations"
              placeholder="e.g., Other unions, community groups, NGOs"
              items={formData.stakeholders.advocacy_groups}
              onChange={(items) => handleArrayInputChange('stakeholders', 'advocacy_groups', items)}
            />
            
            <MultiItemInput
              id="economic_interests"
              label="Economic Stakeholders"
              placeholder="e.g., Investors, suppliers, customers"
              items={formData.stakeholders.economic_interests}
              onChange={(items) => handleArrayInputChange('stakeholders', 'economic_interests', items)}
            />
            
            <FormInput
              id="union_density"
              label="Union Density"
              placeholder="Describe current union membership and density in workplace/sector"
              value={formData.stakeholders.union_density}
              onChange={(e) => handleInputChange('stakeholders', 'union_density', e.target.value)}
              multiline
              rows={3}
            />

            <FormInput
              id="worker_demographics"
              label="Worker Demographics"
              placeholder="Describe key worker demographics (age, gender, ethnicity, skills, etc.)"
              value={formData.stakeholders.worker_demographics}
              onChange={(e) => handleInputChange('stakeholders', 'worker_demographics', e.target.value)}
              multiline
              rows={3}
            />
            
            <FormInput
              id="community_dynamics"
              label="Community Context"
              placeholder="Describe any relevant community dynamics or relationships"
              value={formData.stakeholders.community_dynamics}
              onChange={(e) => handleInputChange('stakeholders', 'community_dynamics', e.target.value)}
              multiline
              rows={4}
            />
          </div>
        );
      
      case 'political_and_strategic':
        return (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Strategic Analysis</h3>
            
            <FormInput
              id="political_motivations"
              label="Political Context"
              placeholder="Describe relevant political factors affecting the campaign"
              value={formData.political_and_strategic.political_motivations}
              onChange={(e) => handleInputChange('political_and_strategic', 'political_motivations', e.target.value)}
              multiline
              rows={3}
            />
            
            <FormInput
              id="ideological_framing"
              label="Opposition Messaging"
              placeholder="Describe how opponents frame the issues"
              value={formData.political_and_strategic.ideological_framing}
              onChange={(e) => handleInputChange('political_and_strategic', 'ideological_framing', e.target.value)}
              multiline
              rows={3}
            />
            
            <FormInput
              id="corporate_influence"
              label="Corporate/Industry Influence"
              placeholder="Describe any known corporate influence or relationships"
              value={formData.political_and_strategic.corporate_influence}
              onChange={(e) => handleInputChange('political_and_strategic', 'corporate_influence', e.target.value)}
              multiline
              rows={3}
            />

            <FormInput
              id="union_strategy"
              label="Union Strategy"
              placeholder="Outline current union strategy and approach"
              value={formData.political_and_strategic.union_strategy}
              onChange={(e) => handleInputChange('political_and_strategic', 'union_strategy', e.target.value)}
              multiline
              rows={3}
            />

            <FormInput
              id="industrial_leverage"
              label="Industrial Leverage"
              placeholder="Describe points of industrial leverage or pressure"
              value={formData.political_and_strategic.industrial_leverage}
              onChange={(e) => handleInputChange('political_and_strategic', 'industrial_leverage', e.target.value)}
              multiline
              rows={3}
            />
          </div>
        );
      
      case 'campaign_outcome':
        return (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Campaign Goals & Metrics</h3>
            
            <FormInput
              id="primary_goal"
              label="Primary Campaign Goal"
              placeholder="What is the main outcome you want to achieve?"
              value={formData.campaign_outcome.primary_goal}
              onChange={(e) => handleInputChange('campaign_outcome', 'primary_goal', e.target.value)}
              required
              error={errors['campaign_outcome.primary_goal']}
            />
            
            <FormInput
              id="primary_audience"
              label="Primary Target Audience"
              placeholder="Who are the key people you need to influence?"
              value={formData.campaign_outcome.primary_audience}
              onChange={(e) => handleInputChange('campaign_outcome', 'primary_audience', e.target.value)}
              required
              error={errors['campaign_outcome.primary_audience']}
            />

            <MultiItemInput
              id="worker_demands"
              label="Worker Demands"
              placeholder="Enter each specific demand"
              items={formData.campaign_outcome.worker_demands}
              onChange={(items) => handleArrayInputChange('campaign_outcome', 'worker_demands', items)}
              required
              error={errors['campaign_outcome.worker_demands']}
            />

            <MultiItemInput
              id="success_metrics"
              label="Success Metrics"
              placeholder="Enter measurable indicators of success"
              items={formData.campaign_outcome.success_metrics}
              onChange={(items) => handleArrayInputChange('campaign_outcome', 'success_metrics', items)}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const sections = [
    { id: 'core_issue_details', label: 'Campaign Details' },
    { id: 'documents_and_links', label: 'Documents & Links' },
    { id: 'stakeholders', label: 'Stakeholders' },
    { id: 'political_and_strategic', label: 'Strategic Analysis' },
    { id: 'campaign_outcome', label: 'Goals & Metrics' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6 text-primary-700">
        <Users className="h-6 w-6 mr-2" />
        <h2 className="text-xl font-semibold">Campaign Intake Form</h2>
      </div>
      
      <div className="mb-8">
        <div className="flex overflow-x-auto">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                activeSection === section.id
                  ? 'text-primary-700 border-b-2 border-primary-500'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {index + 1}. {section.label}
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {renderSection()}
        
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={() => {
              const currentIndex = sections.findIndex(s => s.id === activeSection);
              if (currentIndex > 0) {
                setActiveSection(sections[currentIndex - 1].id);
              }
            }}
            className={`px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50 ${
              activeSection === sections[0].id ? 'invisible' : ''
            }`}
            disabled={isSubmitting}
          >
            Previous
          </button>
          
          {activeSection === sections[sections.length - 1].id ? (
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const currentIndex = sections.findIndex(s => s.id === activeSection);
                if (currentIndex < sections.length - 1) {
                  setActiveSection(sections[currentIndex + 1].id);
                }
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={isSubmitting}
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CampaignForm;