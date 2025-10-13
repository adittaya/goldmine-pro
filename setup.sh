#!/bin/bash

echo "Setting up Goldmine Pro investment platform..."

# Setup backend
cd backend
echo "Installing backend dependencies..."
npm install

# Setup frontend
cd ../frontend
echo "Installing frontend dependencies..."
npm install

echo "Setup completed! You can now run the application."
echo ""
echo "To run the backend: cd backend && npm run dev"
echo "To run the frontend: cd frontend && npm run dev"
echo ""
echo "Make sure to set up your environment variables in .env files"