# Goldmine Pro - Investment Platform

A full-stack investment platform with user authentication, product plans, daily income, withdrawals, and recharges.

## 🚀 Tech Stack

- **Frontend**: React.js + Vite (hosted on Netlify)
- **Backend**: Node.js + Express.js (hosted on Render)
- **Database**: Supabase (PostgreSQL + Auth)
- **Authentication**: JWT
- **Repo**: GitHub

## ✨ Features

1. **User Authentication**
   - Simple registration and login (name, mobile, password)
   - Secure JWT-based authentication
   - Password hashing

2. **Product Plans**
   - Multiple investment plans with different returns
   - One plan per user per month rule
   - Admin can manage plans

3. **Daily Income**
   - Automatic daily income credits to user wallets
   - No duplicate credits

4. **Withdrawals**
   - Easy withdrawal process with bank/UPI details
   - 18% GST automatically deducted
   - Admin approval system

5. **Recharges**
   - UPI payment system with QR code
   - UPI ID for payment: 7047571829@yespop
   - Admin approval for recharge credits

6. **Sharing System**
   - Easy referral link sharing

7. **Admin Panel**
   - Approve recharges and withdrawals
   - View user transactions

## 📱 Mobile-First UI
- Responsive design
- Premium, clean interface
- Intuitive navigation

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd goldmine-pro
```

### 2. Setup Environment Variables

Create `.env` files in both the backend and frontend directories based on the provided examples:

**Backend** (`/backend/.env`):
```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_API_KEY=YOUR_SUPABASE_API_KEY
JWT_SECRET=YOUR_JWT_SECRET
FRONTEND_URL=YOUR_FRONTEND_URL
```

**Frontend** (`/frontend/.env`):
```env
VITE_API_URL=YOUR_BACKEND_URL
```

**Note**: The actual values are stored in `.env.example` files for reference. You need to create your own `.env` files with your actual values. The `.env` files are in `.gitignore` for security.

Default values for development:
- Use `http://localhost:3000` for `FRONTEND_URL` during development
- Use `http://localhost:5000` for `VITE_API_URL` during development

### 3. Setup Database Schema

Execute the SQL schema found in `database-schema.sql` in your Supabase SQL editor to create all required tables.

### 4. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 5. Run the Application

**Backend (in one terminal):**
```bash
cd backend
npm run dev
```

**Frontend (in another terminal):**
```bash
cd frontend
npm run dev
```

## 🚀 Deployment

### Backend Deployment to Render
1. Push your code to a GitHub repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables in Render dashboard:
   - SUPABASE_URL
   - SUPABASE_API_KEY
   - JWT_SECRET
   - NODE_VERSION: 18
5. Deploy your service

### Frontend Deployment to Netlify
1. Push your code to a GitHub repository
2. Create a new site on Netlify
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
5. Deploy your site

## 🔒 Security Features
- JWT-based authentication
- Passwords are hashed using bcrypt
- Input validation and sanitization
- Rate limiting to prevent abuse

## 📊 Default Investment Plans
- Plan 1: ₹500 → Daily Income ₹50 → 10 Days → ₹650 Return
- Plan 2: ₹1000 → Daily Income ₹120 → 10 Days → ₹2200 Return
- Plan 3: ₹5000 → Daily Income ₹700 → 15 Days → ₹15500 Return
- Plan 4: ₹10000 → Daily Income ₹1600 → 20 Days → ₹42000 Return

## 🤖 Daily Income Distribution
The system automatically processes daily income for users with active investment plans. This can be set up as a daily cron job using the script in `/backend/cron/dailyIncomeJob.js`.

## 📁 Project Structure
```
goldmine-pro/
├── backend/              # Node.js/Express backend
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── cron/             # Cron jobs
│   ├── server.js         # Main server file
│   └── package.json
├── frontend/             # React/Vite frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── utils/        # Utility functions
│   │   └── App.jsx       # Main app component
│   ├── package.json
│   └── vite.config.js
├── database-schema.sql   # Supabase database schema
├── Dockerfile            # Docker configuration
├── netlify.toml          # Netlify configuration
├── render.yml            # Render configuration
├── setup.sh              # Setup script
└── deploy.sh             # Deployment script
```

## 📞 Support
For support, please contact the development team or create an issue in the repository.