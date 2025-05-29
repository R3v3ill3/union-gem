import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import type { CampaignFormData } from '../types';

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication functions
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Failed to login');
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Failed to register');
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Failed to logout');
  }
};

// Database functions with error handling
export const saveCampaignData = async (userId: string, campaignData: CampaignFormData, isNewCampaign: boolean = true) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const campaignRef = doc(collection(db, 'campaigns'));
    const data = {
      ...campaignData,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      isNewCampaign,
      campaignType: 'union', // Add campaign type identifier
      analysisState: isNewCampaign ? {
        steps: [],
        currentStep: 1,
        isComplete: false,
        stepResults: {},
        consolidatedReport: null
      } : campaignData.analysisState
    };

    await setDoc(campaignRef, data);
    return campaignRef.id;
  } catch (error: any) {
    console.error('Save campaign error:', error);
    throw new Error(error.message || 'Failed to save campaign data');
  }
};

export const getCampaignData = async (campaignId: string) => {
  try {
    if (!campaignId) throw new Error('Campaign ID is required');
    
    const campaignRef = doc(db, 'campaigns', campaignId);
    const campaignSnap = await getDoc(campaignRef);
    
    if (!campaignSnap.exists()) {
      throw new Error('Campaign not found');
    }
    
    return campaignSnap.data() as CampaignFormData & {
      isNewCampaign?: boolean;
      analysisState?: {
        steps: any[];
        currentStep: number;
        isComplete: boolean;
        stepResults: Record<string, string>;
        consolidatedReport: string | null;
      };
    };
  } catch (error: any) {
    console.error('Get campaign error:', error);
    throw new Error(error.message || 'Failed to get campaign data');
  }
};

export const updateCampaignData = async (campaignId: string, updates: any) => {
  try {
    if (!campaignId) throw new Error('Campaign ID is required');
    
    const campaignRef = doc(db, 'campaigns', campaignId);
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // If updating analysis state, merge with existing state
    if (updates.analysisState) {
      const currentData = await getDoc(campaignRef);
      if (currentData.exists()) {
        const existingState = currentData.data().analysisState || {};
        updateData.analysisState = {
          ...existingState,
          ...updates.analysisState,
          stepResults: {
            ...(existingState.stepResults || {}),
            ...(updates.analysisState.stepResults || {})
          }
        };
      }
    }

    await updateDoc(campaignRef, updateData);
  } catch (error: any) {
    console.error('Update campaign error:', error);
    throw new Error(error.message || 'Failed to update campaign data');
  }
};

export const getUserCampaigns = async (userId: string) => {
  try {
    if (!userId) throw new Error('User ID is required');
    
    const campaignsQuery = query(
      collection(db, 'campaigns'),
      where('userId', '==', userId),
      where('status', '==', 'active'),
      where('campaignType', '==', 'union') // Only fetch union campaigns
    );
    
    const querySnapshot = await getDocs(campaignsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error: any) {
    console.error('Get user campaigns error:', error);
    throw new Error(error.message || 'Failed to get user campaigns');
  }
};