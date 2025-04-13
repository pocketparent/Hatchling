#!/bin/bash
set -e

echo "🔍 Running pre-deployment validation for Hatchling..."
echo "======================================================"

# Navigate to frontend
cd frontend
echo "📂 Validating frontend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Run TypeScript type checking
echo "🔎 Running TypeScript type checking..."
npm run typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors detected! Fix them before deploying."
  exit 1
fi

# Run ESLint
echo "🧹 Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "⚠️ ESLint warnings/errors detected. Review them before deploying."
  # Not exiting with error since we may want to allow warnings
fi

# Run tests
echo "🧪 Running tests..."
npm test -- --watchAll=false
if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Fix them before deploying."
  exit 1
fi

# Build check
echo "🏗️ Performing build check..."
CI=false npm run build --dry-run
if [ $? -ne 0 ]; then
  echo "❌ Build check failed! Fix build issues before deploying."
  exit 1
fi

echo "✅ Frontend validation completed successfully!"

echo "✅ Pre-deployment validation completed successfully!"
echo "======================================================"
echo "🚀 Ready for deployment!"
