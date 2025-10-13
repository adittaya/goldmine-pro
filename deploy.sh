#!/bin/bash

# Deployment script for Goldmine Pro

echo "Deploying Goldmine Pro application..."

# Build the frontend
cd frontend
echo "Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "Frontend build successful!"
else
    echo "Frontend build failed!"
    exit 1
fi

cd ..

echo "Deployment preparation completed!"
echo "You can now deploy the backend to Render and frontend to Netlify"
echo ""
echo "For Render backend deployment:"
echo "- Push your code to a GitHub repository"
echo "- Connect your repository to Render"
echo "- Set environment variables in Render dashboard:"
echo "  - SUPABASE_URL"
echo "  - SUPABASE_API_KEY" 
echo "  - JWT_SECRET"
echo ""
echo "For Netlify frontend deployment:"
echo "- Push your code to a GitHub repository"
echo "- Connect your repository to Netlify"
echo "- Set build command: cd frontend && npm run build"
echo "- Set publish directory: frontend/dist"