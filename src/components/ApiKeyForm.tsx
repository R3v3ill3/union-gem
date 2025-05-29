import React, { useState } from 'react';
import { Key } from 'lucide-react';
import { loginUser, registerUser } from '../utils/firebase';

interface ApiKeyFormProps {
  onSubmit: (userId: string) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const user = isRegistering 
        ? await registerUser(email, password)
        : await loginUser(email, password);
      
      if (user) {
        onSubmit(user.uid);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4 text-primary-700">
        <Key className="h-6 w-6 mr-2" />
        <h2 className="text-xl font-semibold">
          {isRegistering ? 'Create Account' : 'Sign In'}
        </h2>
      </div>
      
      <p className="mb-4 text-neutral-600">
        {isRegistering 
          ? 'Create an account to start planning your environmental campaign.'
          : 'Sign in to access your environmental campaign planner.'}
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Email Address
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className={`w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-neutral-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            required
          />
        </div>

        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Password
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            className={`w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-neutral-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500`}
            required
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          {isRegistering ? 'Create Account' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-primary-600 hover:text-primary-700 text-sm"
        >
          {isRegistering 
            ? 'Already have an account? Sign in'
            : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
};

export default ApiKeyForm;