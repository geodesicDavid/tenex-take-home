#!/bin/bash

# Google OAuth Setup Script for Tenex Take Home
# This script helps you set up Google OAuth for the application

echo "🔐 Google OAuth Setup for Tenex Take Home"
echo "=========================================="
echo ""

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

echo "📋 Please follow these steps to set up Google OAuth:"
echo ""
echo "1. Go to https://console.cloud.google.com/"
echo "2. Create a new project or select an existing one"
echo "3. Go to 'APIs & Services' > 'Credentials'"
echo "4. Click 'Create Credentials' > 'OAuth client ID'"
echo "5. Select 'Web application' as application type"
echo "6. Add authorized redirect URI: http://localhost:8001/api/v1/auth/google/callback"
echo "7. Copy the Client ID and Client Secret"
echo ""

# Prompt for OAuth credentials
read -p "Enter your Google OAuth Client ID: " client_id
read -p "Enter your Google OAuth Client Secret: " client_secret

# Generate a secure session secret
session_secret=$(openssl rand -hex 32)

# Create .env file
cat > .env << EOF
# Google OAuth Configuration
GOOGLE_OAUTH_CLIENT_ID=$client_id
GOOGLE_OAUTH_CLIENT_SECRET=$client_secret
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:8001/api/v1/auth/google/callback

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_CLOUD_CREDENTIALS_PATH=

# Application Configuration
APP_NAME=Tenex Take Home API
APP_VERSION=0.1.0
DEBUG=true

# Session Configuration
SESSION_SECRET_KEY=$session_secret
SESSION_EXPIRE_HOURS=24
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "🔧 Your backend should automatically restart with the new configuration."
echo "🌐 Frontend: http://localhost:3001"
echo "🔗 Backend: http://localhost:8001"
echo "📚 API Docs: http://localhost:8001/docs"
echo ""
echo "🚀 You can now test the Google OAuth login flow!"
echo ""
echo "Note: Make sure you've added the redirect URI in your Google Cloud Console:"
echo "http://localhost:8001/api/v1/auth/google/callback"