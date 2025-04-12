# CI/CD Pipeline Documentation

## Overview
This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline implemented for the Hatchling application using GitHub Actions and Render.

## Pipeline Components

### GitHub Actions Workflow
Located at `.github/workflows/ci-cd.yml`, this workflow automates testing and deployment:

1. **Trigger Events**
   - Push to main branch
   - Pull requests to main branch

2. **Jobs**
   - **test-backend**: Tests the Flask backend
   - **test-frontend**: Tests the React frontend
   - **deploy**: Deploys to Render when tests pass (only on main branch)

### Backend Testing
The backend testing job:
1. Sets up Python 3.10
2. Installs dependencies from requirements.txt
3. Runs unit tests using the unittest framework

### Frontend Testing
The frontend testing job:
1. Sets up Node.js
2. Installs dependencies using npm
3. Runs tests using Jest and React Testing Library

### Deployment
The deployment job:
1. Only runs when tests pass and code is pushed to main branch
2. Uses Render's API to trigger a deployment

## Setup Instructions

### GitHub Repository Setup

1. **Create GitHub Secrets**
   - Go to your repository's Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `RENDER_API_KEY`: Your Render API key
     - `RENDER_SERVICE_ID`: The ID of your Render service

2. **Branch Protection**
   - Go to your repository's Settings > Branches
   - Add a branch protection rule for the main branch
   - Require status checks to pass before merging
   - Select the backend and frontend test jobs as required status checks

### Render Setup

1. **Backend Service**
   - Create a Web Service in Render
   - Connect to your GitHub repository
   - Set the build command: `pip install -r backend/requirements.txt`
   - Set the start command: `cd backend && gunicorn app:app`
   - Add environment variables from your .env file

2. **Frontend Service**
   - Create a Static Site in Render
   - Connect to your GitHub repository
   - Set the build command: `cd frontend && npm install && npm run build`
   - Set the publish directory: `frontend/build`
   - Add environment variables from your .env file

## Workflow Diagram

```
GitHub Push/PR → GitHub Actions → Tests → (if tests pass & main branch) → Render Deployment
```

## Usage

The CI/CD pipeline runs automatically when:
1. You push code to the main branch
2. You create a pull request targeting the main branch

To manually trigger a deployment:
1. Go to the Actions tab in your GitHub repository
2. Select the CI/CD workflow
3. Click "Run workflow"
4. Select the branch to run the workflow on
5. Click "Run workflow"

## Monitoring

1. **GitHub Actions**
   - Go to the Actions tab in your GitHub repository
   - View the status and logs of workflow runs

2. **Render Dashboard**
   - Go to your Render dashboard
   - View the status and logs of deployments

## Troubleshooting

### Common Issues

1. **Tests Failing**
   - Check the test logs in GitHub Actions
   - Run tests locally to debug

2. **Deployment Failing**
   - Check the deployment logs in Render
   - Verify that environment variables are set correctly
   - Ensure build commands are correct

3. **API Key Issues**
   - Verify that GitHub Secrets are set correctly
   - Regenerate API keys if necessary

## Future Enhancements

1. **Code Quality Checks**
   - Add ESLint, Prettier, and Black for code formatting
   - Add SonarQube for code quality analysis

2. **Performance Testing**
   - Add Lighthouse CI for frontend performance testing
   - Add load testing for backend API endpoints

3. **Security Scanning**
   - Add dependency vulnerability scanning
   - Add SAST (Static Application Security Testing)

4. **Environment Staging**
   - Add staging environment for pre-production testing
   - Implement blue-green deployments
