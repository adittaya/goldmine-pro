const express = require('express');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, mobile, balance, total_invested, total_withdrawn, created_at')
      .eq('id', userId)
      .single();

    if (userError) {
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }

    // Get active plans
    const { data: activePlans, error: plansError } = await supabase
      .from('user_plans')
      .select(`
        *,
        plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    if (plansError) {
      return res.status(500).json({ error: 'Failed to fetch active plans' });
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transactionsError) {
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    // Get recent withdrawals
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (withdrawalsError) {
      return res.status(500).json({ error: 'Failed to fetch withdrawals' });
    }

    res.status(200).json({
      user,
      activePlans,
      transactions,
      withdrawals
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, mobile, balance, total_invested, total_withdrawn, created_at, last_login')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', userId)
      .select('id, name, mobile, balance, total_invested, total_withdrawn, created_at, last_login')
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update user profile' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get referral link
router.get('/referral', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Generate referral link
    const referralLink = `${process.env.FRONTEND_URL}/register?ref=${userId}`;

    res.status(200).json({
      referralLink
    });
  } catch (error) {
    console.error('Get referral link error:', error);
    res.status(500).json({ error: 'Failed to generate referral link' });
  }
});

module.exports = router;