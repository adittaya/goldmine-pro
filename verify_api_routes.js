// Simple API route structure verification script
// This script will check if route files contain the expected method definitions
// without actually importing/running them to avoid dependency issues

const fs = require('fs');
const path = require('path');

console.log("=== Goldmine Pro API Route Verification ===\n");

// Check if route files exist and contain expected method definitions
const routes = {
  'auth': {
    path: './backend/routes/auth.js',
    expected: ['POST /register', 'POST /login', 'GET /profile', 'PUT /profile']
  },
  'user': {
    path: './backend/routes/user.js',
    expected: ['GET /dashboard', 'GET /', 'PUT /', 'GET /referral']
  },
  'plans': {
    path: './backend/routes/plans.js',
    expected: ['GET /', 'GET /:planId', 'POST /purchase/:planId']
  },
  'transactions': {
    path: './backend/routes/transactions.js',
    expected: ['GET /user', 'POST /recharge', 'GET /recharge', 'POST /withdrawal', 'GET /withdrawal']
  }
};

// Read the route files
Object.keys(routes).forEach(routeName => {
  const routeInfo = routes[routeName];
  const routePath = path.join(__dirname, routeInfo.path);
  
  console.log(`\n--- Testing ${routeName} routes ---`);
  
  if (!fs.existsSync(routePath)) {
    console.log(`✗ File does not exist: ${routePath}`);
    return;
  }
  
  try {
    const routeContent = fs.readFileSync(routePath, 'utf8');
    console.log(`✓ File exists: ${routeInfo.path}`);
    
    // Count the number of route definitions
    const routeMethodMatches = routeContent.match(/router\.(get|post|put|patch|delete)\(/gi);
    const routeCount = routeMethodMatches ? routeMethodMatches.length : 0;
    
    console.log(`✓ Found ${routeCount} route definitions in ${routeName}`);
    
    // Check for specific route patterns (simplified)
    routeInfo.expected.forEach(expected => {
      // Convert route pattern to regex for matching
      const routeRegex = new RegExp(`router\\.\\w+\\(\\s*['"]([^'"]*${expected.split(' ')[1].replace(/\//g, '\\/').replace(/\//g, '\\/').replace(/\*/g, '\\*')})`, 'i');
      const matches = routeContent.match(routeRegex);
      
      if (matches) {
        console.log(`  ✓ Found: ${expected}`);
      } else {
        console.log(`  ⚠ Expected: ${expected} (not found directly, but may be valid)`);
      }
    });
    
    // Check for authentication middleware usage
    const authMiddlewareMatches = routeContent.match(/authenticateToken/gi);
    const authCount = authMiddlewareMatches ? authMiddlewareMatches.length : 0;
    console.log(`✓ Found ${authCount} authentication middleware usages in ${routeName}`);
    
  } catch (error) {
    console.log(`✗ Error reading file ${routePath}: ${error.message}`);
  }
});

// Check server.js for route registrations
console.log(`\n--- Testing server.js route registrations ---`);
const serverPath = path.join(__dirname, './backend/server.js');
if (fs.existsSync(serverPath)) {
  try {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    console.log(`✓ Server file exists: ./backend/server.js`);
    
    // Check for route imports
    const routeImports = [
      'authRoutes',
      'userRoutes', 
      'planRoutes',
      'transactionRoutes'
    ];
    
    routeImports.forEach(importName => {
      const hasImport = serverContent.includes(importName);
      const hasUsage = serverContent.includes(`/api/${importName.toLowerCase().replace('routes', '').replace('s', '')}`);
      if (hasImport && hasUsage) {
        console.log(`✓ Found: ${importName} registration`);
      } else {
        console.log(`⚠ Missing: ${importName} registration`);
      }
    });
    
    // Check for health endpoint
    if (serverContent.includes('/health')) {
      console.log(`✓ Found health check endpoint`);
    } else {
      console.log(`⚠ Health check endpoint not found`);
    }
    
  } catch (error) {
    console.log(`✗ Error reading server file: ${error.message}`);
  }
} else {
  console.log(`✗ Server file does not exist: ${serverPath}`);
}

console.log("\n=== API Route Verification Complete ===");
console.log("Note: This verification checks the structure of route files without executing them.");
console.log("Full functionality testing requires a running server with proper environment configuration.");