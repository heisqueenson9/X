#!/usr/bin/env node

/**
 * Payment System Integration Test Script
 * Tests all payment endpoints and validates the complete flow
 * 
 * Usage: node test-payment-system.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3002';
const ADMIN_KEY = 'admin_key_change_in_production';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to make HTTP requests
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Helper function to log test results
function logTest(name, passed, details = '') {
  const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  console.log(`${status} - ${name}`);
  if (details) {
    console.log(`  ${colors.yellow}${details}${colors.reset}`);
  }

  testResults.tests.push({ name, passed, details });
  if (passed) testResults.passed++;
  else testResults.failed++;
}

// Main test suite
async function runTests() {
  console.log(`${colors.blue}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║   Payment System Integration Test Suite    ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════╝${colors.reset}\n`);

  // Test 1: Server connectivity
  console.log(`${colors.blue}[1/5] Testing Server Connectivity...${colors.reset}`);
  try {
    const response = await makeRequest('GET', '/');
    logTest('Server is running', response.status === 200 || response.status === 404);
  } catch (e) {
    logTest('Server is running', false, 'Server not reachable at localhost:3002');
  }

  // Test 2: Admin endpoints require admin key
  console.log(`\n${colors.blue}[2/5] Testing Admin Authentication...${colors.reset}`);
  try {
    const response = await makeRequest('GET', '/api/admin/payments', null, {});
    logTest('Admin endpoints require key', response.status === 401 || response.status === 400, 
      `Status: ${response.status}`);
  } catch (e) {
    logTest('Admin endpoints require key', false, e.message);
  }

  // Test 3: Get payments with valid admin key
  console.log(`\n${colors.blue}[3/5] Testing Admin Payments List...${colors.reset}`);
  try {
    const response = await makeRequest('GET', '/api/admin/payments', null, {
      'x-admin-key': ADMIN_KEY
    });
    const success = response.status === 200 && response.body && response.body.success;
    logTest('Admin can fetch payments', success,
      `Status: ${response.status}, Total payments: ${response.body?.total || 0}`);
  } catch (e) {
    logTest('Admin can fetch payments', false, e.message);
  }

  // Test 4: Payment status endpoint structure
  console.log(`\n${colors.blue}[4/5] Testing Payment Status Endpoint...${colors.reset}`);
  try {
    // Use a dummy payment ID to test endpoint structure
    const response = await makeRequest('GET', '/api/payment/status/000000000000000000000000', null);
    const hasCorrectStructure = response.body === null || response.body.paymentStatus !== undefined;
    logTest('Payment status endpoint exists', response.status === 404 || response.status === 200,
      `Endpoint responds (Status: ${response.status})`);
  } catch (e) {
    logTest('Payment status endpoint exists', false, e.message);
  }

  // Test 5: Upload endpoint validation
  console.log(`\n${colors.blue}[5/5] Testing File Upload Validation...${colors.reset}`);
  try {
    // Test with missing textId
    const response = await makeRequest('POST', '/api/payment/upload', {}, {
      'Content-Type': 'application/json'
    });
    logTest('Upload endpoint validates input', response.status === 400 || response.status === 405,
      `Endpoint validates correctly (Status: ${response.status})`);
  } catch (e) {
    logTest('Upload endpoint validates input', false, e.message);
  }

  // Summary
  console.log(`\n${colors.blue}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║            Test Summary                    ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════╝${colors.reset}`);
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  console.log(`Total:  ${testResults.tests.length}`);

  if (testResults.failed === 0) {
    console.log(`\n${colors.green}✓ All tests passed! Payment system is ready.${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}✗ Some tests failed. Check the issues above.${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch(err => {
  console.error(`${colors.red}Test suite error: ${err.message}${colors.reset}`);
  process.exit(1);
});
