import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
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
      decision_type: 'Political',
      decision_status: 'Under Review',
      decision_date: '',
      jurisdiction: '',
      environmental_topic: '',
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
    },
    political_and_strategic: {
      political_motivations: '',
      ideological_framing: '',
      corporate_influence: '',
    },
    campaign_outcome: {
      primary_goal: '',
      primary_audience: '',
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
      newErrors['core_issue_details.project_name'] = 'Project name is required';
    }
    
    if (!formData.core_issue_details.jurisdiction) {
      newErrors['core_issue_details.jurisdiction'] = 'Jurisdiction is required';
    }
    
    if (!formData.core_issue_details.environmental_topic) {
      newErrors['core_issue_details.environmental_topic'] = 'Environmental topic is required';
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
            <h3 className="text-lg font-medium mb-4">Core Issue Details</h3>
            
            <FormInput
              id="project_name"
              label="Project/Campaign Name"
              value={formData.core_issue_details.project_name}
              onChange={(e) => handleInputChange('core_issue_details', 'project_name', e.target.value)}
              required
              error={errors['core_issue_details.project_name']}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectInput
                id="decision_type"
                label="Type of Decision Being Targeted"
                options={['Political', 'Corporate', 'Legislative', 'Regulatory', 'Hybrid', 'Other']}
                value={formData.core_issue_details.decision_type}
                onChange={(e) => handleInputChange('core_issue_details', 'decision_type', e.target.value)}
              />
              
              <SelectInput
                id="decision_status"
                label="Current Decision Status"
                options={['Proposed', 'Under Review', 'Cancelled', 'Delayed', 'Approved', 'Other']}
                value={formData.core_issue_details.decision_status}
                onChange={(e) => handleInputChange('core_issue_details', 'decision_status', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                id="decision_date"
                label="Date of Decision/Trigger Event (if applicable)"
                type="date"
                value={formData.core_issue_details.decision_date || ''}
                onChange={(e) => handleInputChange('core_issue_details', 'decision_date', e.target.value)}
              />
              
              <FormInput
                id="jurisdiction"
                label="Jurisdiction/Region Involved"
                value={formData.core_issue_details.jurisdiction}
                onChange={(e) => handleInputChange('core_issue_details', 'jurisdiction', e.target.value)}
                required
                error={errors['core_issue_details.jurisdiction']}
              />
            </div>
            
            <FormInput
              id="environmental_topic"
              label="Key Environmental Topic"
              placeholder="e.g., biodiversity loss, emissions, land clearing, renewable energy"
              value={formData.core_issue_details.environmental_topic}
              onChange={(e) => handleInputChange('core_issue_details', 'environmental_topic', e.target.value)}
              required
              error={errors['core_issue_details.environmental_topic']}
            />
            
            <FormInput
              id="issue_description"
              label="Brief Description of the Issue"
              placeholder="Provide 1-3 paragraphs describing the issue"
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
              label="Relevant News Articles or Official Statements"
              placeholder="Enter URL and press Enter or Add"
              items={formData.documents_and_links.news_links}
              onChange={(items) => handleArrayInputChange('documents_and_links', 'news_links', items)}
            />
            
            <MultiItemInput
              id="reference_links"
              label="Links to Reports or Consultation Documents"
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
            <h3 className="text-lg font-medium mb-4">Stakeholders</h3>
            
            <MultiItemInput
              id="decision_makers"
              label="Key Decision-Makers"
              placeholder="e.g., Minister Smith, CEO Johnson"
              items={formData.stakeholders.decision_makers}
              onChange={(items) => handleArrayInputChange('stakeholders', 'decision_makers', items)}
            />
            
            <MultiItemInput
              id="industry_actors"
              label="Industry Players Involved (pro or con)"
              placeholder="e.g., ABC Mining Corp, Renewable Energy Association"
              items={formData.stakeholders.industry_actors}
              onChange={(items) => handleArrayInputChange('stakeholders', 'industry_actors', items)}
            />
            
            <MultiItemInput
              id="advocacy_groups"
              label="Community or Advocacy Groups Involved"
              placeholder="e.g., Friends of the Forest, Local Community Alliance"
              items={formData.stakeholders.advocacy_groups}
              onChange={(items) => handleArrayInputChange('stakeholders', 'advocacy_groups', items)}
            />
            
            <MultiItemInput
              id="economic_interests"
              label="Any Known Economic Interests"
              placeholder="e.g., coal, gas, real estate, tourism"
              items={formData.stakeholders.economic_interests}
              onChange={(items) => handleArrayInputChange('stakeholders', 'economic_interests', items)}
            />
            
            <FormInput
              id="community_dynamics"
              label="Local Community Dynamics or Conflicts"
              placeholder="Describe any relevant community dynamics or tensions"
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
            <h3 className="text-lg font-medium mb-4">Political & Strategic Dimensions</h3>
            
            <FormInput
              id="political_motivations"
              label="Known or Suspected Political Motivations"
              placeholder="Describe any political factors driving this issue"
              value={formData.political_and_strategic.political_motivations}
              onChange={(e) => handleInputChange('political_and_strategic', 'political_motivations', e.target.value)}
              multiline
              rows={3}
            />
            
            <FormInput
              id="ideological_framing"
              label="Any Ideological Framing Observed"
              placeholder="e.g., 'red tape', 'community rights', 'economic growth'"
              value={formData.political_and_strategic.ideological_framing}
              onChange={(e) => handleInputChange('political_and_strategic', 'ideological_framing', e.target.value)}
              multiline
              rows={3}
            />
            
            <FormInput
              id="corporate_influence"
              label="Any History of Donations, Lobbying, or Corporate Influence Suspected"
              placeholder="Describe any known influence activities"
              value={formData.political_and_strategic.corporate_influence}
              onChange={(e) => handleInputChange('political_and_strategic', 'corporate_influence', e.target.value)}
              multiline
              rows={3}
            />
          </div>
        );
      
      case 'campaign_outcome':
        return (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium mb-4">Desired Campaign Outcome</h3>
            
            <FormInput
              id="primary_goal"
              label="What is your primary campaign goal?"
              placeholder="e.g., reverse decision, gain support, raise public opposition"
              value={formData.campaign_outcome.primary_goal}
              onChange={(e) => handleInputChange('campaign_outcome', 'primary_goal', e.target.value)}
              required
              error={errors['campaign_outcome.primary_goal']}
            />
            
            <FormInput
              id="primary_audience"
              label="Who is your primary target audience?"
              placeholder="e.g., swing voters, local community, media, politicians"
              value={formData.campaign_outcome.primary_audience}
              onChange={(e) => handleInputChange('campaign_outcome', 'primary_audience', e.target.value)}
              required
              error={errors['campaign_outcome.primary_audience']}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  const sections = [
    { id: 'core_issue_details', label: 'Core Issue Details' },
    { id: 'documents_and_links', label: 'Documents & Links' },
    { id: 'stakeholders', label: 'Stakeholders' },
    { id: 'political_and_strategic', label: 'Political & Strategic' },
    { id: 'campaign_outcome', label: 'Campaign Outcome' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6 text-primary-700">
        <Leaf className="h-6 w-6 mr-2" />
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