const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
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

// Get all available plans
router.get('/', async (req, res) => {
  try {
    const { data: plans, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch plans' });
    }

    res.status(200).json({ plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get plan by ID
router.get('/:planId', async (req, res) => {
  try {
    const planId = req.params.planId;

    const { data: plan, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (error || !plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.status(200).json({ plan });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// Purchase a plan (protected)
router.post('/purchase/:planId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const planId = req.params.planId;

    // Get user and plan details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (planError || !plan) {
      return res.status(404).json({ error: 'Plan not found or not active' });
    }

    // Check if user has enough balance
    if (user.balance < plan.price) {
      return res.status(400).json({ error: 'Insufficient balance to purchase this plan' });
    }

    // Check if user already has an active plan this month (enforce one plan per month rule)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const { data: existingActivePlans, error: activePlanError } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('created_at', startOfMonth.toISOString())
      .lte('created_at', endOfMonth.toISOString());

    if (activePlanError) {
      return res.status(500).json({ error: 'Failed to check existing plans' });
    }

    if (existingActivePlans && existingActivePlans.length > 0) {
      return res.status(400).json({ error: 'You already have an active plan this month. You can only purchase one plan per month.' });
    }

    // Deduct plan price from user balance
    const newBalance = user.balance - plan.price;

    // Update user balance
    const { error: updateBalanceError } = await supabase
      .from('users')
      .update({ 
        balance: newBalance,
        total_invested: user.total_invested + plan.price 
      })
      .eq('id', userId);

    if (updateBalanceError) {
      return res.status(500).json({ error: 'Failed to update user balance' });
    }

    // Create user plan record
    const { data: userPlan, error: insertError } = await supabase
      .from('user_plans')
      .insert([
        {
          id: Math.random().toString(36).substr(2, 9), // Simple ID generation
          user_id: userId,
          plan_id: planId,
          plan_name: plan.name,
          plan_price: plan.price,
          daily_income: plan.daily_income,
          duration_days: plan.duration_days,
          total_return: plan.total_return,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      // Rollback: restore user balance if plan creation fails
      await supabase
        .from('users')
        .update({ balance: user.balance })
        .eq('id', userId);
      
      return res.status(500).json({ error: 'Failed to create plan purchase' });
    }

    // Create transaction record
    await supabase
      .from('transactions')
      .insert([
        {
          id: Math.random().toString(36).substr(2, 9),
          user_id: userId,
          type: 'plan_purchase',
          amount: plan.price,
          description: `Purchased ${plan.name} plan`,
          balance_before: user.balance,
          balance_after: newBalance,
          reference_id: userPlan.id,
          created_at: new Date().toISOString()
        }
      ]);

    res.status(200).json({
      message: 'Plan purchased successfully',
      userPlan,
      newBalance
    });

  } catch (error) {
    console.error('Purchase plan error:', error);
    res.status(500).json({ error: 'Failed to purchase plan' });
  }
});

// Admin route: Get all plans (for admin panel)
router.get('/admin/all', authenticateToken, async (req, res) => {
  try {
    // In a real application, you'd check if the user is an admin here
    // For now, we'll assume any authenticated user can see all plans for simplicity
    // but in practice, you'd have role checks
    
    const { data: plans, error } = await supabase
      .from('plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch plans' });
    }

    res.status(200).json({ plans });
  } catch (error) {
    console.error('Get all plans error:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Admin route: Create a new plan (for admin panel)
router.post('/admin/create', authenticateToken, async (req, res) => {
  try {
    // In a real application, you'd check if the user is an admin here
    const { name, price, daily_income, duration_days, total_return, is_active = true } = req.body;

    if (!name || !price || !daily_income || !duration_days || !total_return) {
      return res.status(400).json({ error: 'All fields are required: name, price, daily_income, duration_days, total_return' });
    }

    const { data: newPlan, error } = await supabase
      .from('plans')
      .insert([
        {
          id: Math.random().toString(36).substr(2, 9),
          name,
          price,
          daily_income,
          duration_days,
          total_return,
          is_active,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to create plan' });
    }

    res.status(201).json({
      message: 'Plan created successfully',
      plan: newPlan
    });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

module.exports = router;