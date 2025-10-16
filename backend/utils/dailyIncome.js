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
    
    // Get all active plans
    const { data: activePlans, error: plansError } = await supabase
      .from('user_plans')
      .select(`
        *,
        users (id, name, mobile, balance)
      `)
      .eq('status', 'active');

    if (plansError) {
      console.error('Error fetching active plans:', plansError);
      throw new Error(`Database error when fetching active plans: ${plansError.message}`);
    }

    if (!activePlans || activePlans.length === 0) {
      console.log('No active plans found for daily income distribution');
      return { processed: 0, message: 'No active plans found' };
    }

    // Filter plans that are still valid (not expired) and haven't been paid today
    const validActivePlans = activePlans.filter(plan => {
      // Check if plan is not expired
      const endDate = new Date(plan.end_date);
      const now = new Date();
      if (now > endDate) {
        return false; // Plan is expired
      }
      
      // Check if income was already distributed today for this specific plan
      // This check is now done individually for each plan in the loop below
      return true;
    });

    let processedCount = 0;
    let errorCount = 0;

    for (const plan of validActivePlans) {
      try {
        // Check if user already received income today for this specific plan
        const todayStart = new Date(today + 'T00:00:00Z').toISOString();
        const todayEnd = new Date(today + 'T23:59:59Z').toISOString();
        
        const { data: todayIncome, error: incomeCheckError } = await supabase
          .from('transactions')
          .select('id')
          .eq('user_id', plan.user_id)
          .eq('type', 'daily_income')
          .eq('reference_id', plan.id) // Check for income for this specific plan
          .gte('created_at', todayStart)
          .lte('created_at', todayEnd);

        if (incomeCheckError) {
          console.error(`Error checking income for user ${plan.user_id}:`, incomeCheckError);
          errorCount++;
          continue;
        }

        if (todayIncome && todayIncome.length > 0) {
          // User already received daily income today for this plan
          continue;
        }

        // Check if the plan is still valid (not expired) at the time of processing
        const endDate = new Date(plan.end_date);
        const now = new Date();
        if (now > endDate) {
          continue; // Plan became expired since the filter step
        }

        // Add daily income to user's balance
        const newBalance = parseFloat(plan.users.balance) + parseFloat(plan.daily_income);

        // Update user balance
        const { error: updateError } = await supabase
          .from('users')
          .update({ 
            balance: parseFloat(newBalance).toFixed(2),
            updated_at: new Date().toISOString()
          })
          .eq('id', plan.user_id);

        if (updateError) {
          console.error(`Error updating balance for user ${plan.user_id}:`, updateError);
          errorCount++;
          continue;
        }

        // Create transaction record for daily income
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert([
            {
              id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`, // Better ID format
              user_id: plan.user_id,
              type: 'daily_income',
              amount: parseFloat(plan.daily_income).toFixed(2),
              description: `Daily income for ${plan.plan_name} plan`,
              balance_before: parseFloat(plan.users.balance).toFixed(2),
              balance_after: parseFloat(newBalance).toFixed(2),
              reference_id: plan.id,
              created_at: new Date().toISOString()
            }
          ]);

        if (transactionError) {
          console.error(`Error creating transaction for user ${plan.user_id}:`, transactionError);
          // Rollback balance update if transaction creation fails
          await supabase
            .from('users')
            .update({ 
              balance: plan.users.balance,
              updated_at: new Date().toISOString()
            })
            .eq('id', plan.user_id);
          errorCount++;
          continue;
        }

        console.log(`Daily income of ${plan.daily_income} added to user ${plan.user_id}`);
        processedCount++;
      } catch (individualError) {
        console.error(`Error processing plan ${plan.id} for user ${plan.user_id}:`, individualError);
        errorCount++;
      }
    }

    const result = {
      processed: processedCount,
      errors: errorCount,
      message: `Daily income distribution completed. Processed ${processedCount} users with ${errorCount} errors.`
    };
    
    console.log(result.message);
    return result;
  } catch (error) {
    console.error('Critical error in daily income distribution:', error);
    throw error; // Re-throw to be handled by calling function
  }
};

module.exports = { distributeDailyIncome };