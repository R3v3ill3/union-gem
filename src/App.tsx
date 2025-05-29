import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Users } from 'lucide-react';
import { auth, logoutUser } from './utils/firebase';
import CampaignForm from './components/CampaignForm';
import ApiKeyForm from './components/ApiKeyForm';
import CampaignList from './components/CampaignList';
import WorkflowPage from './pages/WorkflowPage';
import { CampaignFormData } from './types';

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CampaignFormData | null>(null);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  
  const handleAuthSubmit = (uid: string) => {
    setUserId(uid);
  };
  
  const handleFormSubmit = (data: CampaignFormData) => {
    setFormData(data);
    localStorage.setItem('campaign_form_data', JSON.stringify(data));
  };
  
  const handleReset = () => {
    if (confirm('Are you sure you want to start a new campaign? This will clear all current data.')) {
      setFormData(null);
      setShowNewCampaign(false);
      localStorage.removeItem('campaign_form_data');
    }
  };

  const handleSelectCampaign = (campaign: CampaignFormData) => {
    setFormData(campaign);
    localStorage.setItem('campaign_form_data', JSON.stringify(campaign));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUserId(null);
      setFormData(null);
      setShowNewCampaign(false);
      localStorage.removeItem('campaign_form_data');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setFormData(null);
        setShowNewCampaign(false);
      }
    });
    
    // Try to get form data from local storage
    const storedFormData = localStorage.getItem('campaign_form_data');
    if (storedFormData) {
      try {
        setFormData(JSON.parse(storedFormData));
      } catch (e) {
        console.error('Error parsing stored form data', e);
        localStorage.removeItem('campaign_form_data');
      }
    }
    
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-primary-800 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">Union Campaign Planner</h1>
          </div>
          <div className="flex items-center space-x-4">
            {userId && !showNewCampaign && !formData && (
              <button
                onClick={() => setShowNewCampaign(true)}
                className="px-4 py-2 bg-primary-700 hover:bg-primary-600 rounded-md transition-colors"
              >
                New Campaign
              </button>
            )}
            {userId && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-primary-700 hover:bg-primary-600 rounded-md transition-colors"
              >
                Sign Out
              </button>
            )}
            {formData && (
              <button
                onClick={handleReset}
                className="px-3 py-1 text-sm bg-primary-700 hover:bg-primary-600 rounded"
              >
                New Campaign
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4">
        {!userId ? (
          <div className="max-w-md mx-auto">
            <ApiKeyForm onSubmit={handleAuthSubmit} />
          </div>
        ) : showNewCampaign ? (
          <CampaignForm onSubmit={handleFormSubmit} />
        ) : !formData ? (
          <CampaignList userId={userId} onSelectCampaign={handleSelectCampaign} />
        ) : (
          <WorkflowPage 
            formData={formData} 
            userId={userId}
            onReset={handleReset}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-neutral-800 text-neutral-400 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                <span className="text-white font-medium">Union Campaign Planner</span>
              </div>
              <p className="text-sm mt-1">A tool for union campaign strategy and planning</p>
            </div>
            <div className="text-sm">
              <p>© 2025 Union Campaign Planner</p>
              <p>Powered by Gemini AI</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;