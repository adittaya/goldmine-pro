# Goldmine Pro - Developer Guide

## Overview

Goldmine Pro is a premium investment platform with a mobile-friendly UI/UX. The application consists of a React.js frontend and a Node.js/Express backend, integrated with Supabase for database management.

## Project Structure

```
goldmine-pro/
├── backend/                 # Node.js/Express API server
│   ├── routes/              # API route definitions
│   ├── utils/               # Utility functions
│   ├── cron/                # Cron job scripts
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
├── frontend/                # React.js application
│   ├── src/                 # Source code
│   │   ├── App.js           # Main application component
│   │   ├── index.css        # Global styles
│   │   └── main.jsx         # Application entry point
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── index.html           # HTML template
├── database-schema.sql      # Database schema
├── netlify.toml             # Netlify configuration
├── render.yml               # Render deployment configuration
├── Dockerfile              # Docker configuration for backend
├── deploy.sh               # Deployment script
└── setup.sh                # Setup script
```

## Frontend Architecture

### Technology Stack
- **React.js** (v19.1.1) - Component-based UI library
- **Vite** - Build tool and development server
- **styled-components** - CSS-in-JS styling solution
- **React Router** - Client-side routing
- **Axios** - HTTP client (though fetch is used directly in App.js)

### Main Components

#### App.js
The main application component handles:
- Authentication state management
- Routing between pages
- API communication
- Caching mechanism
- Global loading and error states

#### Page Components
- `LoginPage` - User authentication
- `RegisterPage` - User registration
- `DashboardPage` - Main dashboard with statistics
- `PlansPage` - Investment plan selection
- `ProfilePage` - User profile management
- `RechargePage` - Account recharge functionality
- `WithdrawalPage` - Fund withdrawal
- `TransactionsPage` - Transaction history
- `BottomNavigation` - Mobile-friendly navigation

### API Service

The application uses a dedicated API service with the following methods:

```javascript
// Authentication
api.login(mobile, password)
api.register(name, mobile, password)

// User endpoints
api.getProfile(token)
api.getDashboard(token)
api.getReferral(token)

// Investment Plans
api.getPlans()
api.purchasePlan(planId, token)

// Transactions
api.getTransactions(token)
api.createRecharge(amount, utr, token)
api.createWithdrawal(data, token)
```

### Caching Strategy

The application implements a caching mechanism to reduce API calls:

```javascript
const getCachedOrFetch = async (key, fetchFn, cacheTime = 300000) // 5 minutes default
```

### Timeout Handling

All API calls include a 10-second timeout implemented with Promise.race:

```javascript
const timeoutFetch = (url, options = {}, timeout = 10000)
```

## Backend Architecture

### Technology Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Supabase** - Database and authentication
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Security headers
- **Express-rate-limit** - Rate limiting

### API Routes

#### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - User registration

#### User Management (`/api/user`)
- `GET /` - Get user profile
- `GET /dashboard` - Get dashboard data
- `GET /referral` - Get referral information

#### Investment Plans (`/api/plans`)
- `GET /` - Get all available plans
- `POST /purchase/:planId` - Purchase a plan

#### Transactions (`/api/transactions`)
- `GET /user` - Get user transactions
- `POST /recharge` - Create recharge transaction
- `POST /withdrawal` - Create withdrawal request

### Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:
- `users` - User accounts
- `investment_plans` - Available investment plans
- `user_investments` - User's active investments
- `transactions` - All financial transactions
- `referrals` - Referral tracking

## Styling

The application uses a mobile-first approach with a premium design:

### Color Palette
- Primary: `#0ea5e9` (blue)
- Secondary: `#14b8a6` (teal)
- Success: `#10b981` (green)
- Warning: `#f59e0b` (amber)
- Danger: `#ef4444` (red)

### Responsive Design
- Uses CSS Grid and Flexbox for responsive layouts
- Bottom navigation for mobile devices
- Appropriate spacing and typography for mobile screens

## Build Process

### Frontend
- Uses Vite for building and development
- Compiles React code with JSX transformation
- Bundles and minifies assets for production
- Implements code splitting for faster loading

### Environment Variables
- Frontend: `VITE_API_URL` for backend API endpoint
- Backend: `SUPABASE_URL`, `SUPABASE_API_KEY`, `JWT_SECRET`, `FRONTEND_URL`

## Deployment

### Frontend (Netlify)
- Build command: `cd frontend && npm run build`
- Publish directory: `frontend/dist`
- Environment: `VITE_API_URL`

### Backend (Render)
- Docker deployment using provided Dockerfile
- Environment variables: SUPABASE credentials and JWT secret
- Health checks enabled

## Security Measures

1. **Authentication**:
   - JWT tokens for stateless authentication
   - Secure token storage in localStorage
   - Protected routes

2. **API Security**:
   - Rate limiting
   - CORS restrictions
   - Input validation
   - Helmet.js security headers

3. **Database Security**:
   - Supabase Row Level Security (RLS)
   - Parameterized queries
   - Authentication required for sensitive operations

## Performance Optimizations

1. **Frontend**:
   - Client-side caching (5-minute default)
   - Loading states and spinners
   - Request timeout handling (10 seconds)
   - Component-based architecture

2. **Backend**:
   - Efficient database queries
   - Connection pooling via Supabase
   - Rate limiting to prevent abuse
   - Proper error handling

## Error Handling

### Frontend Error Handling
- Network timeout errors (10 seconds)
- API response error handling
- User-friendly error messages
- Graceful failure states

### Backend Error Handling
- Comprehensive error middleware
- Detailed logging for debugging
- Proper HTTP status codes
- CORS error handling

## Development Workflow

### Local Development
1. Clone the repository
2. Run `./setup.sh` to install dependencies
3. Set up environment variables in `.env` files
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `cd frontend && npm run dev`

### Testing
1. Verify API endpoints are working
2. Test all user flows
3. Check responsive design on different screen sizes
4. Verify authentication and authorization

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
  - Request: `{mobile, password}`
  - Response: `{token, user}`

- `POST /api/auth/register` - Register user
  - Request: `{name, mobile, password}`
  - Response: `{token, user}`

### User Management
- `GET /api/user` - Get user profile
  - Headers: `Authorization: Bearer {token}`
  - Response: `{user_data}`

- `GET /api/user/dashboard` - Get dashboard data
  - Headers: `Authorization: Bearer {token}`
  - Response: `{user, activePlans, transactions}`

### Investment Plans
- `GET /api/plans` - Get all investment plans
  - Response: `{plans: [{id, name, price, daily_income, duration_days, total_return}]}`

- `POST /api/plans/purchase/:planId` - Purchase investment plan
  - Headers: `Authorization: Bearer {token}`
  - Response: `{message}`

### Transactions
- `GET /api/transactions/user` - Get user transactions
  - Headers: `Authorization: Bearer {token}`
  - Response: `{transactions: [{id, type, amount, description, created_at}]}`

- `POST /api/transactions/recharge` - Create recharge
  - Headers: `Authorization: Bearer {token}`
  - Request: `{amount, utr}`
  - Response: `{message}`

- `POST /api/transactions/withdrawal` - Create withdrawal
  - Headers: `Authorization: Bearer {token}`
  - Request: `{amount, method, bank_details_or_upi_id}`
  - Response: `{message}`

## Troubleshooting

### Common Issues
1. **CORS errors**: Verify FRONTEND_URL in backend environment variables
2. **Authentication failures**: Check JWT_SECRET is consistent between frontend and backend
3. **Database connection**: Verify Supabase credentials
4. **Build failures**: Ensure all dependencies are installed and environment variables are set

### Debugging Tips
1. Check browser console for frontend issues
2. Check server logs for backend issues
3. Verify API endpoints with tools like Postman
4. Test database queries directly in Supabase SQL Editor