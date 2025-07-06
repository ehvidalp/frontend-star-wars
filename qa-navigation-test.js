// Navigation QA Test Script
// Run this in the browser console to test navigation behavior

console.log('=== Navigation QA Test ===');

// Test 1: Check initial state (should be home page)
console.log('Test 1: Initial state');
console.log('Current URL:', window.location.href);
console.log('Should show navigation:', document.querySelector('nav[role="navigation"]') !== null);
console.log('Navigation visible:', document.querySelector('nav[role="navigation"]')?.offsetParent !== null);

// Test 2: Navigate to planets
console.log('\nTest 2: Navigate to planets');
setTimeout(() => {
  window.location.href = '/planets';
  setTimeout(() => {
    console.log('Current URL:', window.location.href);
    console.log('Should show navigation:', document.querySelector('nav[role="navigation"]') !== null);
    console.log('Navigation visible:', document.querySelector('nav[role="navigation"]')?.offsetParent !== null);
    console.log('Back button present:', document.querySelector('[aria-label*="Back"]') !== null);
  }, 1000);
}, 2000);

// Test 3: Navigate to planet detail
console.log('\nTest 3: Navigate to planet detail');
setTimeout(() => {
  window.location.href = '/planets/1';
  setTimeout(() => {
    console.log('Current URL:', window.location.href);
    console.log('Should show navigation:', document.querySelector('nav[role="navigation"]') !== null);
    console.log('Navigation visible:', document.querySelector('nav[role="navigation"]')?.offsetParent !== null);
    console.log('Back button present:', document.querySelector('[aria-label*="Back"]') !== null);
  }, 1000);
}, 4000);

// Test 4: Navigate back to home
console.log('\nTest 4: Navigate back to home');
setTimeout(() => {
  window.location.href = '/';
  setTimeout(() => {
    console.log('Current URL:', window.location.href);
    console.log('Should show navigation:', document.querySelector('nav[role="navigation"]') !== null);
    console.log('Navigation visible:', document.querySelector('nav[role="navigation"]')?.offsetParent !== null);
    console.log('Back button present:', document.querySelector('[aria-label*="Back"]') !== null);
  }, 1000);
}, 6000);

console.log('\n=== Tests will run automatically ===');
