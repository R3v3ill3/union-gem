# Union Campaign Planning Web App

A comprehensive web application for planning and managing union campaigns using AI-powered analysis and Firebase integration.

## Features

- User authentication and campaign management
- AI-powered campaign analysis and strategy generation
- Real-time updates and data persistence
- PDF report generation and export
- Multi-step workflow management

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Firebase Authentication and Firestore
- Google's Gemini AI for analysis
- TailwindCSS for styling
- Lucide React for icons

## Prerequisites

- Node.js 18.x or newer
- npm 9.x or newer
- Firebase project
- Gemini API key

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/union-campaign-planner.git
cd union-campaign-planner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root:
```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server:
```bash
npm run dev
```

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)

2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

3. Enable Firestore:
   - Go to Firestore Database
   - Create database in production mode
   - Choose a location closest to your users

4. Set up Security Rules:
   - Copy the contents of `firestore.rules` to your Firebase security rules

## Project Structure

```
src/
├── components/          # React components
├── pages/              # Page components
├── utils/              # Utility functions
│   ├── firebase.ts     # Firebase configuration and helpers
│   ├── gemini.ts       # Gemini API integration
│   ├── pdf.ts         # PDF generation utilities
│   └── templates.ts    # AI prompt templates
├── types/              # TypeScript type definitions
└── App.tsx            # Main application component
```

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Deployment

1. Set up hosting in Firebase:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

2. Deploy to Firebase:
```bash
firebase deploy
```

## Environment Variables

Required environment variables:

- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Firebase app ID
- `VITE_GEMINI_API_KEY`: Gemini API key

## Security Considerations

1. Ensure Firebase security rules are properly configured
2. Keep API keys and sensitive data in environment variables
3. Implement proper user authentication checks
4. Use HTTPS for all API communications
5. Regular security audits and dependency updates

## Maintenance

- Update dependencies regularly:
```bash
npm update
```

- Check for security vulnerabilities:
```bash
npm audit
```

## Troubleshooting

Common issues and solutions:

1. Authentication errors:
   - Verify Firebase configuration
   - Check if email/password authentication is enabled
   - Ensure environment variables are set correctly

2. Database access issues:
   - Verify Firestore security rules
   - Check user authentication status
   - Confirm database exists and is accessible

3. Gemini API errors:
   - Verify API key is valid and active
   - Check API rate limits
   - Ensure proper error handling

## Support

For issues or questions:
1. Check the GitHub Issues
2. Review Firebase documentation
3. Contact support@yourdomain.com

## License

MIT License - see LICENSE file for details