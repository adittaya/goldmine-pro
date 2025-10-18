// Comprehensive API Structure Verification
// This script verifies that all API routes are properly defined in the codebase

const fs = require('fs');
const path = require('path');

console.log("=== Goldmine Pro API Structure Verification ===\n");

// Define expected routes for each module
const expectedRoutes = {
  'auth': {
    path: './backend/routes/auth.js',
    routes: [
      { method: 'POST', path: '/register', description: 'User registration' },
      { method: 'POST', path: '/login', description: 'User login' },
      { method: 'GET', path: '/profile', description: 'Get user profile' },
      { method: 'PUT', path: '/profile', description: 'Update user profile' }
    ]
  },
  'user': {
    path: './backend/routes/user.js',
    routes: [
      { method: 'GET', path: '/dashboard', description: 'User dashboard data' },
      { method: 'GET', path: '/', description: 'Get user profile' },
      { method: 'PUT', path: '/', description: 'Update user profile' },
      { method: 'GET', path: '/referral', description: 'Get referral link' }
    ]
  },
  'plans': {
    path: './backend/routes/plans.js',
    routes: [
      { method: 'GET', path: '/', description: 'Get all plans' },
      { method: 'GET', path: '/:planId', description: 'Get specific plan' },
      { method: 'POST', path: '/purchase/:planId', description: 'Purchase a plan' },
      { method: 'GET', path: '/admin/all', description: 'Get all plans (admin)' },
      { method: 'POST', path: '/admin/create', description: 'Create a new plan (admin)' }
    ]
  },
  'transactions': {
    path: './backend/routes/transactions.js',
    routes: [
      { method: 'GET', path: '/user', description: 'Get user transactions' },
      { method: 'POST', path: '/recharge', description: 'Create recharge request' },
      { method: 'GET', path: '/recharge', description: 'Get user recharges' },
      { method: 'POST', path: '/withdrawal', description: 'Create withdrawal request' },
      { method: 'GET', path: '/withdrawal', description: 'Get user withdrawals' },
      { method: 'GET', path: '/admin/recharges', description: 'Get all recharges (admin)' },
      { method: 'GET', path: '/admin/withdrawals', description: 'Get all withdrawals (admin)' },
      { method: 'PATCH', path: '/admin/recharges/:rechargeId/approve', description: 'Approve recharge (admin)' },
      { method: 'PATCH', path: '/admin/recharges/:rechargeId/reject', description: 'Reject recharge (admin)' },
      { method: 'PATCH', path: '/admin/withdrawals/:withdrawalId/approve', description: 'Approve withdrawal (admin)' },
      { method: 'PATCH', path: '/admin/withdrawals/:withdrawalId/reject', description: 'Reject withdrawal (admin)' }
    ]
  }
};

let allRoutesExist = true;

// Check each route file
Object.keys(expectedRoutes).forEach(moduleName => {
  const moduleInfo = expectedRoutes[moduleName];
  const fullPath = path.join(__dirname, moduleInfo.path);
  
  console.log(`\n--- ${moduleName.toUpperCase()} Routes ---`);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`✗ File does not exist: ${fullPath}`);
    allRoutesExist = false;
    return;
  }
  
  const fileContent = fs.readFileSync(fullPath, 'utf8');
  console.log(`✓ File exists: ${moduleInfo.path}`);
  
  // Extract actual routes from the file
  const routeMatches = fileContent.match(/router\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/gi);
  if (!routeMatches) {
    console.log(`✗ No routes found in ${moduleName}`);
    allRoutesExist = false;
    return;
  }
  
  // Parse the actual routes
  const actualRoutes = routeMatches.map(match => {
    const parts = match.match(/router\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/i);
    if (parts) {
      return { method: parts[1].toUpperCase(), path: parts[2] };
    }
    return null;
  }).filter(Boolean);
  
  console.log(`✓ Found ${actualRoutes.length} routes in ${moduleName}`);
  
  // Verify each expected route exists in the file
  let allExpectedRoutesFound = true;
  moduleInfo.routes.forEach(expectedRoute => {
    const found = actualRoutes.some(actualRoute => 
      actualRoute.method === expectedRoute.method && 
      actualRoute.path === expectedRoute.path
    );
    
    if (found) {
      console.log(`  ✓ ${expectedRoute.method} /api/${moduleName}${expectedRoute.path} - ${expectedRoute.description}`);
    } else {
      console.log(`  ✗ ${expectedRoute.method} /api/${moduleName}${expectedRoute.path} - ${expectedRoute.description} (NOT FOUND)`);
      allExpectedRoutesFound = false;
      allRoutesExist = false;
    }
  });
  
  if (allExpectedRoutesFound) {
    console.log(`  ✓ All ${moduleInfo.routes.length} expected routes found in ${moduleName}`);
  } else {
    console.log(`  ✗ Some expected routes missing in ${moduleName}`);
  }
});

// Check main server file for route registrations
console.log(`\n--- Server Route Registrations ---`);
const serverPath = path.join(__dirname, './backend/server.js');
if (fs.existsSync(serverPath)) {
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  console.log(`✓ Server file exists: ./backend/server.js`);
  
  // Check for each module registration
  const registrations = [
    { module: 'auth', pattern: "/api/auth" },
    { module: 'user', pattern: "/api/user" },
    { module: 'plans', pattern: "/api/plans" },
    { module: 'transactions', pattern: "/api/transactions" }
  ];
  
  let allRegistrationsFound = true;
  registrations.forEach(reg => {
    const hasRegistration = serverContent.includes(`app.use('${reg.pattern}'`);
    if (hasRegistration) {
      console.log(`  ✓ ${reg.module} routes registered at ${reg.pattern}`);
    } else {
      console.log(`  ✗ ${reg.module} routes NOT registered at ${reg.pattern}`);
      allRegistrationsFound = false;
      allRoutesExist = false;
    }
  });
  
  // Check for health endpoint
  if (serverContent.includes('/health')) {
    console.log(`  ✓ Health check endpoint (/health) found`);
  } else {
    console.log(`  ⚠ Health check endpoint (/health) not found`);
  }
  
  if (allRegistrationsFound) {
    console.log(`  ✓ All route registrations found in server.js`);
  } else {
    console.log(`  ✗ Some route registrations missing in server.js`);
  }
} else {
  console.log(`✗ Server file does not exist: ${serverPath}`);
  allRoutesExist = false;
}

console.log(`\n--- Summary ---`);
if (allRoutesExist) {
  console.log("✓ ALL API ROUTES ARE PROPERLY DEFINED AND REGISTERED");
  console.log("✓ The API structure is complete and ready for implementation");
  console.log("  (Note: Full functionality requires proper environment configuration and database connection)");
} else {
  console.log("✗ SOME API ROUTES ARE MISSING OR INCORRECTLY CONFIGURED");
  console.log("  (This may affect application functionality)");
}

console.log("\n=== Verification Complete ===");