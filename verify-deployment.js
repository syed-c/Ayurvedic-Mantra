#!/usr/bin/env node

// Deployment verification script for ayurvedicmantra.com
const https = require('https');
const http = require('http');

const DOMAIN = process.env.DOMAIN || 'ayurvedicmantra.com';
const BASE_URL = `https://${DOMAIN}`;

console.log('🔍 Starting deployment verification for', DOMAIN);

// Test cases
const tests = [
  {
    name: 'Homepage Load',
    url: '/',
    expectedStatus: 200,
    critical: true
  },
  {
    name: 'Admin Login Page',
    url: '/admin-login',
    expectedStatus: 200,
    critical: true
  },
  {
    name: 'Product Page',
    url: '/product',
    expectedStatus: 200,
    critical: true
  },
  {
    name: 'Checkout Page',
    url: '/checkout',
    expectedStatus: 200,
    critical: true
  },
  {
    name: 'Shiprocket Connection API',
    url: '/api/shiprocket/connection-status',
    expectedStatus: 200,
    critical: true
  },
  {
    name: 'Public Settings API',
    url: '/api/public/settings',
    expectedStatus: 200,
    critical: true
  },
  {
    name: 'Order Placement API (should require data)',
    url: '/api/orders/place',
    method: 'POST',
    expectedStatus: 400, // Expected to fail without data
    critical: true
  }
];

function makeRequest(test) {
  return new Promise((resolve) => {
    const url = BASE_URL + test.url;
    const method = test.method || 'GET';
    
    const options = {
      method: method,
      headers: {
        'User-Agent': 'Deployment-Verification/1.0'
      }
    };
    
    if (method === 'POST') {
      options.headers['Content-Type'] = 'application/json';
    }
    
    const req = https.request(url, options, (res) => {
      const passed = res.statusCode === test.expectedStatus;
      resolve({
        ...test,
        passed,
        actualStatus: res.statusCode,
        responseTime: Date.now() - startTime
      });
    });
    
    req.on('error', (error) => {
      resolve({
        ...test,
        passed: false,
        error: error.message,
        responseTime: Date.now() - startTime
      });
    });
    
    const startTime = Date.now();
    
    if (method === 'POST') {
      req.write('{}'); // Empty JSON body for POST tests
    }
    
    req.end();
  });
}

async function runTests() {
  console.log(`\n🧪 Running ${tests.length} verification tests...\n`);
  
  const results = [];
  
  for (const test of tests) {
    process.stdout.write(`Testing ${test.name}... `);
    const result = await makeRequest(test);
    results.push(result);
    
    if (result.passed) {
      console.log(`✅ PASS (${result.actualStatus}) ${result.responseTime}ms`);
    } else {
      console.log(`❌ FAIL (Expected: ${test.expectedStatus}, Got: ${result.actualStatus || 'ERROR'}) ${result.responseTime}ms`);
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    }
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const criticalFailed = results.filter(r => !r.passed && r.critical).length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Critical Failures: ${criticalFailed}`);
  
  if (criticalFailed > 0) {
    console.log('\n🚨 CRITICAL ISSUES DETECTED:');
    results
      .filter(r => !r.passed && r.critical)
      .forEach(r => {
        console.log(`  - ${r.name}: ${r.error || `HTTP ${r.actualStatus}`}`);
      });
  }
  
  // Integration status
  console.log('\n🔗 Integration Status:');
  console.log('='.repeat(50));
  
  const shiprocketTest = results.find(r => r.name === 'Shiprocket Connection API');
  console.log(`Shiprocket: ${shiprocketTest?.passed ? '✅ Connected' : '❌ Failed'}`);
  
  const apiTest = results.find(r => r.name === 'Public Settings API');
  console.log(`Settings API: ${apiTest?.passed ? '✅ Working' : '❌ Failed'}`);
  
  const orderTest = results.find(r => r.name === 'Order Placement API (should require data)');
  console.log(`Order API: ${orderTest?.passed ? '✅ Working' : '❌ Failed'}`);
  
  // Overall status
  console.log('\n🎯 Overall Status:');
  console.log('='.repeat(50));
  
  if (criticalFailed === 0) {
    console.log('✅ DEPLOYMENT SUCCESSFUL!');
    console.log('🎉 ayurvedicmantra.com is ready for production!');
    console.log('\n📋 Next Steps:');
    console.log('1. Test order placement manually');
    console.log('2. Verify admin panel access');
    console.log('3. Check email/SMS notifications');
    console.log('4. Monitor logs for any issues');
  } else {
    console.log('❌ DEPLOYMENT NEEDS ATTENTION');
    console.log('Please fix the critical issues before going live.');
  }
  
  process.exit(criticalFailed > 0 ? 1 : 0);
}

// Domain verification
console.log('🌐 Verifying domain:', DOMAIN);

// Check if domain resolves
require('dns').lookup(DOMAIN, (err, address) => {
  if (err) {
    console.log('❌ Domain does not resolve:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Domain resolves to:', address);
  runTests();
});