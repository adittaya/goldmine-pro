// This script will be run daily to distribute income to users
require('dotenv').config();
const { distributeDailyIncome } = require('../utils/dailyIncome');

console.log('Starting daily income distribution job...');

distributeDailyIncome()
  .then((result) => {
    console.log('Daily income distribution completed successfully:', result);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error in daily income distribution:', error);
    process.exit(1);
  });