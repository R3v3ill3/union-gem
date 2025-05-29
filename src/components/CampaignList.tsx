import React, { useEffect, useState } from 'react';
import { getUserCampaigns } from '../utils/firebase';
import { CampaignFormData } from '../types';
import { Leaf, Calendar, MapPin } from 'lucide-react';

interface CampaignListProps {
  userId: string;
  onSelectCampaign: (campaign: CampaignFormData) => void;
}

interface Campaign extends CampaignFormData {
  id: string;
  createdAt: string;
}

const CampaignList: React.FC<CampaignListProps> = ({ userId, onSelectCampaign }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const userCampaigns = await getUserCampaigns(userId);
        setCampaigns(userCampaigns as Campaign[]);
      } catch (err) {
        setError('Failed to load campaigns');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 flex items-center text-primary-700">
        <Leaf className="h-6 w-6 mr-2" />
        Your Campaigns
      </h2>

      {campaigns.length === 0 ? (
        <p className="text-center text-neutral-500 py-8">
          No campaigns yet. Start by creating a new campaign.
        </p>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <button
              key={campaign.id}
              onClick={() => onSelectCampaign(campaign)}
              className="w-full text-left p-4 rounded-lg border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all duration-200"
            >
              <h3 className="font-medium text-lg text-primary-700">
                {campaign.core_issue_details.project_name}
              </h3>
              
              <div className="mt-2 space-y-1 text-sm text-neutral-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {campaign.core_issue_details.jurisdiction}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                  {campaign.core_issue_details.environmental_topic}
                </span>
                <span className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-full">
                  {campaign.core_issue_details.decision_type}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;