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

// Get user transactions
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Get user transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create a recharge request
router.post('/recharge', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, utr, payment_method = 'upi' } = req.body;

    if (!amount || !utr) {
      return res.status(400).json({ error: 'Amount and UTR are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    // Create recharge request
    const { data: recharge, error: insertError } = await supabase
      .from('recharges')
      .insert([
        {
          id: Math.random().toString(36).substr(2, 9),
          user_id: userId,
          amount,
          utr,
          payment_method,
          status: 'pending', // waiting for admin approval
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: 'Failed to create recharge request' });
    }

    res.status(201).json({
      message: 'Recharge request submitted successfully',
      recharge
    });
  } catch (error) {
    console.error('Create recharge request error:', error);
    res.status(500).json({ error: 'Failed to create recharge request' });
  }
});

// Get user's recharge history
router.get('/recharge', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: recharges, error } = await supabase
      .from('recharges')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch recharges' });
    }

    res.status(200).json({ recharges });
  } catch (error) {
    console.error('Get user recharges error:', error);
    res.status(500).json({ error: 'Failed to fetch recharges' });
  }
});

// Create a withdrawal request
router.post('/withdrawal', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount, method, bank_name, account_holder_name, ifsc_code, account_number, upi_id } = req.body;

    if (!amount || !method) {
      return res.status(400).json({ error: 'Amount and method are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Get user details to check balance
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    // Check if user has sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance for withdrawal' });
    }

    // Check if user already made a withdrawal in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: recentWithdrawals, error: recentError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', twentyFourHoursAgo)
      .in('status', ['pending', 'approved']);

    if (recentError) {
      return res.status(500).json({ error: 'Failed to check recent withdrawals' });
    }

    if (recentWithdrawals && recentWithdrawals.length > 0) {
      return res.status(400).json({ error: 'You can only make one withdrawal every 24 hours' });
    }

    // Calculate amount after 18% GST
    const gstAmount = amount * 0.18;
    const netAmount = amount - gstAmount;

    // Create withdrawal request
    const { data: withdrawal, error: insertError } = await supabase
      .from('withdrawals')
      .insert([
        {
          id: Math.random().toString(36).substr(2, 9),
          user_id: userId,
          amount: amount, // original amount
          net_amount: netAmount, // amount after GST
          gst_amount: gstAmount,
          method,
          bank_name: method === 'bank' ? bank_name : null,
          account_holder_name: method === 'bank' ? account_holder_name : null,
          ifsc_code: method === 'bank' ? ifsc_code : null,
          account_number: method === 'bank' ? account_number : null,
          upi_id: method === 'upi' ? upi_id : null,
          status: 'pending', // waiting for admin approval
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: 'Failed to create withdrawal request' });
    }

    res.status(201).json({
      message: 'Withdrawal request submitted successfully',
      withdrawal
    });
  } catch (error) {
    console.error('Create withdrawal request error:', error);
    res.status(500).json({ error: 'Failed to create withdrawal request' });
  }
});

// Get user's withdrawal history
router.get('/withdrawal', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch withdrawals' });
    }

    res.status(200).json({ withdrawals });
  } catch (error) {
    console.error('Get user withdrawals error:', error);
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
});

// Admin route: Get all recharges (for admin panel)
router.get('/admin/recharges', authenticateToken, async (req, res) => {
  try {
    const { data: recharges, error } = await supabase
      .from('recharges')
      .select(`
        *,
        users (name, mobile)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch recharges' });
    }

    res.status(200).json({ recharges });
  } catch (error) {
    console.error('Get all recharges error:', error);
    res.status(500).json({ error: 'Failed to fetch recharges' });
  }
});

// Admin route: Get all withdrawals (for admin panel)
router.get('/admin/withdrawals', authenticateToken, async (req, res) => {
  try {
    const { data: withdrawals, error } = await supabase
      .from('withdrawals')
      .select(`
        *,
        users (name, mobile)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch withdrawals' });
    }

    res.status(200).json({ withdrawals });
  } catch (error) {
    console.error('Get all withdrawals error:', error);
    res.status(500).json({ error: 'Failed to fetch withdrawals' });
  }
});

// Admin route: Approve recharge
router.patch('/admin/recharges/:rechargeId/approve', authenticateToken, async (req, res) => {
  try {
    const rechargeId = req.params.rechargeId;

    // Get recharge details
    const { data: recharge, error: rechargeError } = await supabase
      .from('recharges')
      .select(`
        *,
        users (id, balance, total_invested)
      `)
      .eq('id', rechargeId)
      .single();

    if (rechargeError || !recharge) {
      return res.status(404).json({ error: 'Recharge request not found' });
    }

    if (recharge.status !== 'pending') {
      return res.status(400).json({ error: 'Recharge request is not pending' });
    }

    // Update user balance
    const newBalance = recharge.users.balance + recharge.amount;
    const newTotalInvested = recharge.users.total_invested + recharge.amount;

    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ 
        balance: newBalance,
        total_invested: newTotalInvested
      })
      .eq('id', recharge.users.id);

    if (userUpdateError) {
      return res.status(500).json({ error: 'Failed to update user balance' });
    }

    // Update recharge status to approved
    const { data: updatedRecharge, error: updateError } = await supabase
      .from('recharges')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', rechargeId)
      .select()
      .single();

    if (updateError) {
      // Rollback user balance if recharge update fails
      await supabase
        .from('users')
        .update({ 
          balance: recharge.users.balance,
          total_invested: recharge.users.total_invested
        })
        .eq('id', recharge.users.id);
      
      return res.status(500).json({ error: 'Failed to approve recharge' });
    }

    // Create transaction record
    await supabase
      .from('transactions')
      .insert([
        {
          id: Math.random().toString(36).substr(2, 9),
          user_id: recharge.user_id,
          type: 'recharge',
          amount: recharge.amount,
          description: `Recharge approved via ${recharge.payment_method}`,
          balance_before: recharge.users.balance,
          balance_after: newBalance,
          reference_id: rechargeId,
          created_at: new Date().toISOString()
        }
      ]);

    res.status(200).json({
      message: 'Recharge approved successfully',
      recharge: updatedRecharge
    });
  } catch (error) {
    console.error('Approve recharge error:', error);
    res.status(500).json({ error: 'Failed to approve recharge' });
  }
});

// Admin route: Reject recharge
router.patch('/admin/recharges/:rechargeId/reject', authenticateToken, async (req, res) => {
  try {
    const rechargeId = req.params.rechargeId;

    const { data: recharge, error: rechargeError } = await supabase
      .from('recharges')
      .select('*')
      .eq('id', rechargeId)
      .single();

    if (rechargeError || !recharge) {
      return res.status(404).json({ error: 'Recharge request not found' });
    }

    if (recharge.status !== 'pending') {
      return res.status(400).json({ error: 'Recharge request is not pending' });
    }

    // Update recharge status to rejected
    const { data: updatedRecharge, error: updateError } = await supabase
      .from('recharges')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', rechargeId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to reject recharge' });
    }

    res.status(200).json({
      message: 'Recharge rejected successfully',
      recharge: updatedRecharge
    });
  } catch (error) {
    console.error('Reject recharge error:', error);
    res.status(500).json({ error: 'Failed to reject recharge' });
  }
});

// Admin route: Approve withdrawal
router.patch('/admin/withdrawals/:withdrawalId/approve', authenticateToken, async (req, res) => {
  try {
    const withdrawalId = req.params.withdrawalId;

    // Get withdrawal details
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .select(`
        *,
        users (id, balance, total_withdrawn)
      `)
      .eq('id', withdrawalId)
      .single();

    if (withdrawalError || !withdrawal) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal request is not pending' });
    }

    // Update user balance (deduct withdrawal amount)
    const newBalance = withdrawal.users.balance - withdrawal.amount;
    const newTotalWithdrawn = withdrawal.users.total_withdrawn + withdrawal.amount;

    const { error: userUpdateError } = await supabase
      .from('users')
      .update({ 
        balance: newBalance,
        total_withdrawn: newTotalWithdrawn
      })
      .eq('id', withdrawal.users.id);

    if (userUpdateError) {
      return res.status(500).json({ error: 'Failed to update user balance' });
    }

    // Update withdrawal status to approved
    const { data: updatedWithdrawal, error: updateError } = await supabase
      .from('withdrawals')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', withdrawalId)
      .select()
      .single();

    if (updateError) {
      // Rollback user balance if withdrawal update fails
      await supabase
        .from('users')
        .update({ 
          balance: withdrawal.users.balance,
          total_withdrawn: withdrawal.users.total_withdrawn
        })
        .eq('id', withdrawal.users.id);
      
      return res.status(500).json({ error: 'Failed to approve withdrawal' });
    }

    // Create transaction record
    await supabase
      .from('transactions')
      .insert([
        {
          id: Math.random().toString(36).substr(2, 9),
          user_id: withdrawal.user_id,
          type: 'withdrawal',
          amount: withdrawal.amount,
          description: `Withdrawal approved via ${withdrawal.method}`,
          balance_before: withdrawal.users.balance,
          balance_after: newBalance,
          reference_id: withdrawalId,
          created_at: new Date().toISOString()
        }
      ]);

    res.status(200).json({
      message: 'Withdrawal approved successfully',
      withdrawal: updatedWithdrawal
    });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({ error: 'Failed to approve withdrawal' });
  }
});

// Admin route: Reject withdrawal
router.patch('/admin/withdrawals/:withdrawalId/reject', authenticateToken, async (req, res) => {
  try {
    const withdrawalId = req.params.withdrawalId;

    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawalId)
      .single();

    if (withdrawalError || !withdrawal) {
      return res.status(404).json({ error: 'Withdrawal request not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal request is not pending' });
    }

    // Update withdrawal status to rejected
    const { data: updatedWithdrawal, error: updateError } = await supabase
      .from('withdrawals')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', withdrawalId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: 'Failed to reject withdrawal' });
    }

    res.status(200).json({
      message: 'Withdrawal rejected successfully',
      withdrawal: updatedWithdrawal
    });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({ error: 'Failed to reject withdrawal' });
  }
});

module.exports = router;