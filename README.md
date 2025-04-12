# Hatchling MVP Implementation

This repository contains the implementation of the Hatchling MVP, a memory logging app for parents that allows them to capture and document their parenting journey through SMS-first capture, with natural language processing for tagging and categorizing memories.

## Project Structure

```
hatchling-app/
├── backend/               # Flask backend
│   ├── api/               # API endpoints
│   ├── models/            # Data models
│   ├── services/          # Service integrations
│   ├── tests/             # Unit tests
│   ├── utils/             # Utility functions
│   ├── venv/              # Virtual environment
│   ├── .env               # Environment variables
│   └── app.py             # Main application file
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── tests/         # Component tests
│   │   └── App.tsx        # Main application component
│   ├── .env               # Environment variables
│   └── package.json       # Dependencies
└── run_tests.sh           # Test runner script
```

## Features Implemented

- **SMS-First Capture**: Users can send text, photo, voice, or video memories via SMS
- **Journal View**: Chronological display of memory entries with search and filtering
- **Entry Editing**: Create, view, edit, and delete memory entries
- **Co-Parent/Caregiver Invites**: Invite others to view and contribute to the journal
- **User Authentication**: Secure login via SMS magic links
- **Subscription Management**: Trial and paid subscription handling via Stripe

## Technology Stack

- **Backend**: Flask (Python)
- **Frontend**: React with TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **SMS Integration**: Twilio
- **Voice Transcription**: OpenAI Whisper
- **Payment Processing**: Stripe

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 16+
- Firebase account
- Twilio account
- OpenAI API key
- Stripe account

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd hatchling-app/backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

5. Run the development server:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd hatchling-app/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. Run the development server:
   ```
   npm start
   ```

## Testing

Run the automated tests with:
```
./run_tests.sh
```

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect to your GitHub repository
3. Set the build command: `pip install -r requirements.txt`
4. Set the start command: `gunicorn app:app`
5. Add environment variables from your .env file

### Frontend Deployment

1. Build the production version:
   ```
   cd frontend
   npm run build
   ```

2. Deploy the build directory to your hosting service of choice (Render, Netlify, Vercel, etc.)

## API Documentation

The API follows RESTful principles and includes the following endpoints:

- `POST /api/entry` - Create new memory entry
- `GET /api/entries` - Retrieve entries by journal
- `GET /api/entry/:id` - Retrieve specific entry
- `PATCH /api/entry/:id` - Update entry
- `DELETE /api/entry/:id` - Delete entry
- `POST /api/sms/webhook` - Handle SMS entries
- `POST /api/auth/login` - Generate and send magic link
- `GET /api/auth/verify` - Verify magic link token
- `POST /api/auth/create-account` - Create new user account
- `POST /api/stripe/webhook` - Handle Stripe events

For detailed API documentation, see the [API Docs](docs/api.md).

## License

This project is proprietary and confidential.
