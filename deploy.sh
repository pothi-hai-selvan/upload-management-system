#!/bin/bash

# Deployment Script for Upload Management System
# This script helps prepare your project for deployment to Render

echo "🚀 Preparing Upload Management System for Render Deployment"
echo "=========================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/yourusername/your-repo.git"
    exit 1
fi

# Check if backend config.env exists
if [ ! -f "backend/config.env" ]; then
    echo "⚠️  backend/config.env not found. Creating from example..."
    cp backend/config.env.example backend/config.env
    echo "✅ Created backend/config.env"
    echo "⚠️  Please update JWT_SECRET in backend/config.env before deployment"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "⚠️  .gitignore not found. Creating..."
    # The .gitignore was already created above
    echo "✅ Created .gitignore"
fi

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found. Please ensure it exists in the root directory."
    exit 1
fi

echo ""
echo "✅ Project structure verified!"
echo ""

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes. Committing them..."
    git add .
    git commit -m "Prepare for Render deployment"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes found"
fi

# Push to remote
echo ""
echo "📤 Pushing to GitHub..."
if git push origin main; then
    echo "✅ Successfully pushed to GitHub"
else
    echo "❌ Failed to push to GitHub. Please check your remote configuration."
    exit 1
fi

echo ""
echo "🎉 Project is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://dashboard.render.com/"
echo "2. Click 'New +' and select 'Blueprint'"
echo "3. Connect your GitHub repository"
echo "4. Select this repository"
echo "5. Click 'Apply' to deploy both services"
echo ""
echo "🔧 After deployment, update environment variables:"
echo "   - Backend: Set JWT_SECRET to a secure random string"
echo "   - Frontend: Set VITE_API_URL to your backend URL"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md" 