const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to distribute daily income to users with active plans
const distributeDailyIncome = async () => {
  try {
    console.log('Starting daily income distribution...');

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Get all active plans that haven't received income for today yet
    const { data: activePlans, error: plansError } = await supabase
      .from('user_plans')
      .select(`
        *,
        users (id, name, mobile, balance)
      `)
      .eq('status', 'active')
      .gte('start_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Only check recent plans

    if (plansError) {
      console.error('Error fetching active plans:', plansError);
      return;
    }

    if (!activePlans || activePlans.length === 0) {
      console.log('No active plans found for daily income distribution');
      return;
    }

    // Filter plans that are still valid (not expired) and haven't been paid today
    const validActivePlans = activePlans.filter(plan => {
      // Check if plan is not expired
      const endDate = new Date(plan.end_date);
      const now = new Date();
      if (now > endDate) {
        return false; // Plan is expired
      }

      // Check if income was already distributed today
      // For simplicity, we'll check if there's a transaction for this user today with type 'daily_income'
      // This would require checking against a transaction record
      return true;
    });

    let processedCount = 0;

    for (const plan of validActivePlans) {
      try {
        // Check if user already received income today
        const todayStart = new Date(today + 'T00:00:00Z').toISOString();
        const todayEnd = new Date(today + 'T23:59:59Z').toISOString();
        
        const { data: todayIncome, error: incomeCheckError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', plan.user_id)
          .eq('type', 'daily_income')
          .gte('created_at', todayStart)
          .lte('created_at', todayEnd);

        if (incomeCheckError) {
          console.error(`Error checking income for user ${plan.user_id}:`, incomeCheckError);
          continue;
        }

        if (todayIncome && todayIncome.length > 0) {
          // User already received daily income today
          continue;
        }

        // Add daily income to user's balance
        const newBalance = plan.users.balance + plan.daily_income;

        // Update user balance
        const { error: updateError } = await supabase
          .from('users')
          .update({ balance: newBalance })
          .eq('id', plan.user_id);

        if (updateError) {
          console.error(`Error updating balance for user ${plan.user_id}:`, updateError);
          continue;
        }

        // Create transaction record for daily income
        await supabase
          .from('transactions')
          .insert([
            {
              id: Math.random().toString(36).substr(2, 9),
              user_id: plan.user_id,
              type: 'daily_income',
              amount: plan.daily_income,
              description: `Daily income for ${plan.plan_name} plan`,
              balance_before: plan.users.balance,
              balance_after: newBalance,
              reference_id: plan.id,
              created_at: new Date().toISOString()
            }
          ]);

        console.log(`Daily income of ${plan.daily_income} added to user ${plan.user_id}`);
        processedCount++;
      } catch (individualError) {
        console.error(`Error processing plan ${plan.id} for user ${plan.user_id}:`, individualError);
      }
    }

    console.log(`Daily income distribution completed. Processed ${processedCount} users.`);
  } catch (error) {
    console.error('Error in daily income distribution:', error);
  }
};

module.exports = { distributeDailyIncome };