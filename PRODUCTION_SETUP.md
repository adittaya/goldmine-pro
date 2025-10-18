# Goldmine Pro - Production Setup Guide

This document provides comprehensive instructions for deploying the Goldmine Pro investment platform to production environments.

## Architecture Overview

The Goldmine Pro platform consists of:
- **Frontend**: React.js application (hosted on Netlify)
- **Backend**: Node.js/Express API server (hosted on Render)
- **Database**: Supabase (PostgreSQL)

## Environment Configuration

### Backend (.env)

Create a `.env` file in the `backend/` directory with the following variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_api_key
JWT_SECRET=your_jwt_secret
FRONTEND_URL=your_frontend_url
NODE_ENV=production
```

#### Generating Environment Variables

1. **SUPABASE_URL and SUPABASE_API_KEY**:
   - Sign up at [Supabase](https://supabase.com)
   - Create a new project
   - Find these values in Project Settings > API

2. **JWT_SECRET**:
   ```bash
   # Generate a strong secret (at least 32 characters)
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **FRONTEND_URL**:
   - For Netlify deployment: `https://your-site-name.netlify.app`
   - For local development: `http://localhost:3000`

### Frontend (.env)

Create a `.env` file in the `frontend/` directory with:

```env
VITE_API_URL=your_backend_url
```

- For deployment: `https://your-backend-name.onrender.com`
- For local development: `http://localhost:5000`

## Deployment Instructions

### Backend (to Render)

1. Create a GitHub repository with your code
2. Sign up/Sign in to [Render](https://render.com)
3. Create a new Web Service
4. Connect to your GitHub repository
5. Use the following settings:
   - Environment: Docker
   - Dockerfile path: `Dockerfile`
   - Branch: `main`
   - Region: Choose your preference

6. Add the following environment variables:
   - SUPABASE_URL
   - SUPABASE_API_KEY
   - JWT_SECRET
   - NODE_ENV (value: production)

7. Click "Create Web Service"

### Frontend (to Netlify)

1. Create a GitHub repository with your code
2. Sign up/Sign in to [Netlify](https://netlify.com)
3. Click "Add new site"
4. Choose "Deploy with GitHub"
5. Select your repository
6. Configure build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
   - Environment variables:
     - `VITE_API_URL` (set to your backend URL)

7. Click "Deploy site"

## Production Optimizations

### Frontend Optimizations
- Bundle splitting implemented
- Code minification enabled via Vite
- Asset compression enabled
- Modern JavaScript syntax
- Tree-shaking for smaller bundle sizes

### Backend Optimizations
- Helmet for security headers
- CORS configured for production origins
- Rate limiting to prevent abuse
- Proper error handling and logging
- Connection pooling via Supabase

### Performance Settings

#### Netlify Settings
- Enable Gzip compression (default)
- Enable HTTPS (default)
- Set up custom domain if needed
- Configure redirects in `netlify.toml`

#### Render Settings
- Choose appropriate instance type based on expected load
- Enable SSL certificate (automatically provided)
- Configure health checks
- Set up custom domain if needed

## Security Best Practices

1. **Never commit sensitive data to version control**
   - Use environment variables for secrets
   - .env files are already in .gitignore

2. **API Security**
   - JWT tokens for authentication
   - Rate limiting to prevent abuse
   - CORS restrictions
   - Input validation

3. **Environment Security**
   - Strong JWT secrets (at least 32 characters)
   - HTTPS for all communications
   - Regular dependency updates

## Database Schema

The database schema is defined in `database-schema.sql`. Make sure your Supabase project has the required tables:

1. Run the SQL commands in `database-schema.sql` in your Supabase SQL Editor
2. Or use the Supabase CLI to set up the schema

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure your FRONTEND_URL matches exactly what users access
   - Check that the URL is included in server.js CORS configuration

2. **Database Connection Issues**:
   - Verify SUPABASE_URL and SUPABASE_API_KEY are correct
   - Check that your Supabase project is active

3. **JWT Authentication Issues**:
   - Ensure JWT_SECRET is the same on both frontend and backend
   - Verify tokens are properly stored and sent with requests

4. **Build Failures**:
   - Check that all dependencies are properly defined
   - Verify environment variables are set in build environment

### Monitoring

- Monitor your Render dashboard for backend logs
- Check Netlify build logs for frontend issues
- Use Supabase Dashboard for database insights
- Set up alerts for critical failures

## Maintenance

### Regular Tasks

1. **Dependency Updates**:
   - Update frontend dependencies: `cd frontend && npm update`
   - Update backend dependencies: `cd backend && npm update`
   - Test thoroughly after updates

2. **Security Audits**:
   - Run `npm audit` in both frontend and backend directories
   - Address any security vulnerabilities

3. **Performance Monitoring**:
   - Monitor response times
   - Check for memory leaks
   - Analyze database query performance

## Rollback Strategy

1. Maintain version control with Git tags for each production release
2. Use Render's manual deploys to control when changes go live
3. Keep a backup of your Supabase database
4. Test rollback procedures in staging environment

## Support

For technical support:
- Check the logs in your hosting platforms
- Verify environment variables are correctly set
- Ensure all dependencies are up to date
- Confirm that your Supabase database is properly configured