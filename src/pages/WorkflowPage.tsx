import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import WorkflowProgress from '../components/WorkflowProgress';
import ReportViewer from '../components/ReportViewer';
import { WorkflowStep, CampaignFormData } from '../types';
import { saveCampaignData, updateCampaignData, getCampaignData } from '../utils/firebase';
import { callGemini } from '../utils/gemini';
import { promptTemplates, populateTemplate } from '../utils/templates';
import { generateConsolidatedReport, formatConsolidatedReport } from '../utils/reportGenerator';
import { Leaf, FileText, Download, RefreshCw } from 'lucide-react';
import { generatePDF } from '../utils/pdf';

interface WorkflowPageProps {
  formData: CampaignFormData;
  userId: string;
  onReset: () => void;
}

const WorkflowPage: React.FC<WorkflowPageProps> = ({ formData, userId, onReset }) => {
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{ title: string; content: string } | null>(null);
  const [isGeneratingConsolidated, setIsGeneratingConsolidated] = useState(false);
  const [consolidatedReport, setConsolidatedReport] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [shouldStartAnalysis, setShouldStartAnalysis] = useState(false);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: 1,
      title: 'Political Context Analysis',
      description: 'Analyzing political narratives and stakeholder motivations',
      status: 'pending',
      template: promptTemplates.politicalContext,
      result: ''
    },
    {
      id: 2,
      title: 'Political Context Refinement',
      description: 'Deep-dive analysis of political influences and biases',
      status: 'pending',
      template: promptTemplates.politicalContextRefinement,
      result: ''
    },
    {
      id: 3,
      title: 'Economic Context Analysis',
      description: 'Analyzing economic implications and industry dynamics',
      status: 'pending',
      template: promptTemplates.economicContext,
      result: ''
    },
    {
      id: 4,
      title: 'Environmental Context Analysis',
      description: 'Examining environmental impacts and ecological framing',
      status: 'pending',
      template: promptTemplates.environmentalContext,
      result: ''
    },
    {
      id: 5,
      title: 'Stakeholder & Community Analysis',
      description: 'Mapping key actors and community dynamics',
      status: 'pending',
      template: promptTemplates.stakeholderCommunity,
      result: ''
    },
    {
      id: 6,
      title: 'Message Frame Analysis',
      description: 'Analyzing language, values, and narrative frames',
      status: 'pending',
      template: promptTemplates.messageFrameAnalysis,
      result: ''
    },
    {
      id: 7,
      title: 'Message Development',
      description: 'Creating targeted campaign messages and frames',
      status: 'pending',
      template: promptTemplates.messageDevelopment,
      result: ''
    },
    {
      id: 8,
      title: 'Strategic Campaign Plan',
      description: 'Developing comprehensive campaign strategy',
      status: 'pending',
      template: promptTemplates.campaignPlan,
      result: ''
    }
  ]);

  useEffect(() => {
    const initializeCampaign = async () => {
      try {
        // Save initial campaign data and get ID
        const id = await saveCampaignData(userId, formData);
        setCampaignId(id);

        // Fetch existing campaign data to check for analysis state
        const existingData = await getCampaignData(id);
        
        if (existingData.analysisState) {
          // Restore analysis state
          const { steps: savedSteps, currentStep: savedStep, isComplete: completed } = existingData.analysisState;
          
          if (savedSteps && savedSteps.length > 0) {
            setSteps(savedSteps);
            setCurrentStep(savedStep);
            setIsComplete(completed);
            setShouldStartAnalysis(!completed);
            
            if (completed) {
              setShowSummary(true);
              if (existingData.analysisState.consolidatedReport) {
                setConsolidatedReport(existingData.analysisState.consolidatedReport);
              }
            }
          } else {
            setShouldStartAnalysis(true);
          }
        } else {
          setShouldStartAnalysis(true);
        }
      } catch (error) {
        console.error('Error initializing campaign:', error);
        toast.error('Failed to initialize campaign');
      }
    };

    initializeCampaign();
  }, [userId, formData]);

  const processStep = async () => {
    if (!campaignId || isProcessing || currentStep > steps.length || isComplete) {
      return;
    }

    setIsProcessing(true);
    console.log('Processing step:', currentStep);

    try {
      const step = steps.find(s => s.id === currentStep);
      if (!step) throw new Error('Step not found');

      setSteps(prevSteps =>
        prevSteps.map(s =>
          s.id === currentStep ? { ...s, status: 'loading' } : s
        )
      );

      const prompt = populateTemplate(step.template, formData);
      console.log('Generated prompt for step:', currentStep);

      const previousStep = steps.find(s => s.id === currentStep - 1);
      const previousAnalysis = previousStep?.result || '';

      const fullPrompt = previousAnalysis 
        ? `${prompt}\n\nPrevious Analysis:\n${previousAnalysis}`
        : prompt;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      const response = await callGemini(fullPrompt, apiKey);

      if (response.error) {
        throw new Error(response.error);
      }

      const updatedSteps = steps.map(s =>
        s.id === currentStep 
          ? { ...s, status: 'completed', result: response.content }
          : s
      );
      setSteps(updatedSteps);

      // Update campaign data with new step results
      await updateCampaignData(campaignId, {
        analysisState: {
          steps: updatedSteps,
          currentStep: currentStep + 1,
          isComplete: currentStep === steps.length,
          stepResults: {
            ...updatedSteps.reduce((acc, step) => ({
              ...acc,
              [step.id]: step.result
            }), {})
          }
        }
      });

      if (currentStep === steps.length) {
        setIsComplete(true);
        setShowSummary(true);
        toast.success('Campaign analysis complete!');
      } else {
        setCurrentStep(prev => prev + 1);
      }
      
      setRetryCount(0);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing step:', error);
      
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          setIsProcessing(false);
        }, RETRY_DELAY);
      } else {
        setSteps(prevSteps =>
          prevSteps.map(s =>
            s.id === currentStep ? { ...s, status: 'error' } : s
          )
        );
        toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setRetryCount(0);
        setIsProcessing(false);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (campaignId && !isProcessing && !isComplete && currentStep <= steps.length && shouldStartAnalysis) {
        processStep();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [campaignId, currentStep, isProcessing, isComplete, shouldStartAnalysis]);

  const restartAnalysis = async () => {
    setCurrentStep(1);
    setIsComplete(false);
    setShowSummary(false);
    setSelectedReport(null);
    setConsolidatedReport(null);
    setSteps(steps.map(step => ({
      ...step,
      status: 'pending',
      result: ''
    })));
    setIsProcessing(false);
    setShouldStartAnalysis(true);

    // Reset analysis state in Firebase
    if (campaignId) {
      await updateCampaignData(campaignId, {
        analysisState: {
          steps: steps.map(step => ({
            ...step,
            status: 'pending',
            result: ''
          })),
          currentStep: 1,
          isComplete: false,
          stepResults: {},
          consolidatedReport: null
        }
      });
    }
  };

  const handleGenerateConsolidatedReport = async () => {
    setIsGeneratingConsolidated(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured');
      }

      const report = await generateConsolidatedReport(formData, steps, apiKey);
      const formattedReport = formatConsolidatedReport(report);

      setConsolidatedReport(formattedReport);
      setSelectedReport({
        title: report.title,
        content: formattedReport,
      });

      // Save consolidated report to Firebase
      if (campaignId) {
        await updateCampaignData(campaignId, {
          analysisState: {
            steps,
            currentStep,
            isComplete: true,
            stepResults: steps.reduce((acc, step) => ({
              ...acc,
              [step.id]: step.result
            }), {}),
            consolidatedReport: formattedReport
          }
        });
      }
    } catch (error) {
      console.error('Error generating consolidated report:', error);
      toast.error('Failed to generate consolidated report');
    } finally {
      setIsGeneratingConsolidated(false);
    }
  };

  const downloadAllReports = async () => {
    try {
      const container = document.createElement('div');
      container.className = 'reports-container';

      const titlePage = document.createElement('div');
      titlePage.innerHTML = `
        <h1 style="font-size: 24px; margin-bottom: 20px;">${formData.core_issue_details.project_name}</h1>
        <p style="margin-bottom: 10px;"><strong>Environmental Topic:</strong> ${formData.core_issue_details.environmental_topic}</p>
        <p style="margin-bottom: 10px;"><strong>Jurisdiction:</strong> ${formData.core_issue_details.jurisdiction}</p>
        <p style="margin-bottom: 10px;"><strong>Primary Goal:</strong> ${formData.campaign_outcome.primary_goal}</p>
        <p style="margin-bottom: 20px;"><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
      `;
      container.appendChild(titlePage);

      steps.forEach(step => {
        if (step.result) {
          const reportDiv = document.createElement('div');
          reportDiv.innerHTML = `
            <h2 style="font-size: 20px; margin-top: 30px; margin-bottom: 15px;">${step.title}</h2>
            <div style="white-space: pre-wrap;">${step.result}</div>
          `;
          container.appendChild(reportDiv);
        }
      });

      if (consolidatedReport) {
        const consolidatedDiv = document.createElement('div');
        consolidatedDiv.innerHTML = `
          <h2 style="font-size: 20px; margin-top: 30px; margin-bottom: 15px;">Consolidated Analysis Report</h2>
          <div style="white-space: pre-wrap;">${consolidatedReport}</div>
        `;
        container.appendChild(consolidatedDiv);
      }

      const fileName = `${formData.core_issue_details.project_name.toLowerCase().replace(/\s+/g, '-')}-complete-analysis.pdf`;
      await generatePDF(container, fileName);
      toast.success('All reports downloaded successfully');
    } catch (error) {
      console.error('Error downloading reports:', error);
      toast.error('Failed to download reports');
    }
  };

  const handleViewResult = (stepId: number) => {
    const step = steps.find(s => s.id === stepId);
    if (step?.result) {
      setSelectedReport({
        title: step.title,
        content: step.result
      });
    }
  };

  if (showSummary) {
    return (
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Leaf className="h-6 w-6 mr-2 text-primary-600" />
              <h2 className="text-xl font-semibold text-primary-800">Campaign Analysis Complete</h2>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={downloadAllReports}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                disabled={isGeneratingConsolidated}
              >
                <Download className="h-4 w-4 mr-2" />
                Download All Reports
              </button>
              {!consolidatedReport && (
                <button
                  onClick={handleGenerateConsolidatedReport}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  disabled={isGeneratingConsolidated}
                >
                  {isGeneratingConsolidated ? 'Generating...' : 'Generate Consolidated Report'}
                </button>
              )}
              <button
                onClick={restartAnalysis}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-run Analysis
              </button>
              <button
                onClick={onReset}
                className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition-colors"
              >
                Start New Campaign
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-medium text-neutral-700">Project Name</h3>
              <p className="text-neutral-900">{formData.core_issue_details.project_name}</p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-700">Environmental Topic</h3>
              <p className="text-neutral-900">{formData.core_issue_details.environmental_topic}</p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-700">Jurisdiction</h3>
              <p className="text-neutral-900">{formData.core_issue_details.jurisdiction}</p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-700">Primary Goal</h3>
              <p className="text-neutral-900">{formData.campaign_outcome.primary_goal}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => handleViewResult(step.id)}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-start mb-3">
                <FileText className="h-5 w-5 mr-2 text-primary-600 mt-1" />
                <h3 className="text-lg font-medium text-primary-800">{step.title}</h3>
              </div>
              <p className="text-sm text-neutral-600">{step.description}</p>
              <div className="mt-4 text-primary-600 text-sm font-medium">
                Click to view report →
              </div>
            </button>
          ))}

          {consolidatedReport && (
            <button
              onClick={() => setSelectedReport({
                title: 'Consolidated Campaign Analysis Report',
                content: consolidatedReport
              })}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-left"
            >
              <div className="flex items-start mb-3">
                <FileText className="h-5 w-5 mr-2 text-primary-600 mt-1" />
                <h3 className="text-lg font-medium text-primary-800">Consolidated Report</h3>
              </div>
              <p className="text-sm text-neutral-600">Complete analysis with executive summary and recommendations</p>
              <div className="mt-4 text-primary-600 text-sm font-medium">
                Click to view report →
              </div>
            </button>
          )}
        </div>

        {selectedReport && (
          <ReportViewer
            title={selectedReport.title}
            content={selectedReport.content}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-primary-800">Campaign Summary</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-neutral-700">Project Name</h3>
              <p className="text-neutral-900">{formData.core_issue_details.project_name}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-neutral-700">Environmental Topic</h3>
              <p className="text-neutral-900">{formData.core_issue_details.environmental_topic}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-neutral-700">Jurisdiction</h3>
              <p className="text-neutral-900">{formData.core_issue_details.jurisdiction}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-neutral-700">Primary Goal</h3>
              <p className="text-neutral-900">{formData.campaign_outcome.primary_goal}</p>
            </div>
            
            {isComplete && (
              <div className="mt-6">
                <h3 className="font-medium text-green-700 mb-2">Analysis Complete!</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  All reports are now available. Click below to view the summary page.
                </p>
                <button
                  onClick={() => setShowSummary(true)}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  View Summary Page
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <WorkflowProgress
            steps={steps}
            currentStep={currentStep}
            onViewResult={handleViewResult}
          />
        </div>
      </div>
      
      {selectedReport && (
        <ReportViewer
          title={selectedReport.title}
          content={selectedReport.content}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default WorkflowPage;