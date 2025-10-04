// Test script for SoftWire India Authentication System
// Run this in browser console to test authentication functionality

console.log('🚀 Testing SoftWire India Authentication System...');

// Test 1: Check if AuthManager is loaded
function testAuthManagerLoaded() {
    if (typeof window.authManager !== 'undefined') {
        console.log('✅ AuthManager loaded successfully');
        return true;
    } else {
        console.log('❌ AuthManager not found');
        return false;
    }
}

// Test 2: Check form elements
function testFormElements() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginEmail = document.getElementById('loginEmail');
    const registerEmail = document.getElementById('registerEmail');
    
    let passed = 0;
    let total = 4;
    
    if (loginForm) {
        console.log('✅ Login form found');
        passed++;
    } else {
        console.log('❌ Login form not found');
    }
    
    if (registerForm) {
        console.log('✅ Register form found');
        passed++;
    } else {
        console.log('❌ Register form not found');
    }
    
    if (loginEmail) {
        console.log('✅ Login email field found');
        passed++;
    } else {
        console.log('❌ Login email field not found');
    }
    
    if (registerEmail) {
        console.log('✅ Register email field found');
        passed++;
    } else {
        console.log('❌ Register email field not found');
    }
    
    console.log(`Form elements test: ${passed}/${total} passed`);
    return passed === total;
}

// Test 3: Test email validation
function testEmailValidation() {
    if (!window.authManager) {
        console.log('❌ Cannot test email validation - AuthManager not loaded');
        return false;
    }
    
    const testEmails = [
        { email: 'test@example.com', expected: true },
        { email: 'invalid-email', expected: false },
        { email: 'test@', expected: false },
        { email: 'user@domain.co.uk', expected: true }
    ];
    
    let passed = 0;
    
    testEmails.forEach(test => {
        const mockInput = document.createElement('input');
        mockInput.value = test.email;
        mockInput.id = 'testEmail';
        
        const result = window.authManager.validateEmail(mockInput);
        
        if (result === test.expected) {
            console.log(`✅ Email validation: "${test.email}" - ${result ? 'valid' : 'invalid'}`);
            passed++;
        } else {
            console.log(`❌ Email validation failed: "${test.email}" - expected ${test.expected}, got ${result}`);
        }
    });
    
    console.log(`Email validation test: ${passed}/${testEmails.length} passed`);
    return passed === testEmails.length;
}

// Test 4: Test password validation
function testPasswordValidation() {
    if (!window.authManager) {
        console.log('❌ Cannot test password validation - AuthManager not loaded');
        return false;
    }
    
    const testPasswords = [
        { password: 'Password123!', expected: true },
        { password: 'weak', expected: false },
        { password: 'NoNumbersOrSpecial', expected: false },
        { password: 'Strong123', expected: true }
    ];
    
    let passed = 0;
    
    testPasswords.forEach(test => {
        const mockInput = document.createElement('input');
        mockInput.value = test.password;
        mockInput.id = 'testPassword';
        
        const result = window.authManager.validatePassword(mockInput);
        
        if (result === test.expected) {
            console.log(`✅ Password validation: "${test.password}" - ${result ? 'strong' : 'weak'}`);
            passed++;
        } else {
            console.log(`❌ Password validation failed: "${test.password}" - expected ${test.expected}, got ${result}`);
        }
    });
    
    console.log(`Password validation test: ${passed}/${testPasswords.length} passed`);
    return passed === testPasswords.length;
}

// Test 5: Test form switching
function testFormSwitching() {
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');
    
    if (!loginForm || !registerForm) {
        console.log('❌ Cannot test form switching - forms not found');
        return false;
    }
    
    // Test switching to register
    if (typeof showRegister === 'function') {
        showRegister();
        if (registerForm.classList.contains('active') && !loginForm.classList.contains('active')) {
            console.log('✅ Switch to register form works');
        } else {
            console.log('❌ Switch to register form failed');
            return false;
        }
    } else {
        console.log('❌ showRegister function not found');
        return false;
    }
    
    // Test switching to login
    if (typeof showLogin === 'function') {
        showLogin();
        if (loginForm.classList.contains('active') && !registerForm.classList.contains('active')) {
            console.log('✅ Switch to login form works');
        } else {
            console.log('❌ Switch to login form failed');
            return false;
        }
    } else {
        console.log('❌ showLogin function not found');
        return false;
    }
    
    return true;
}

// Run all tests
function runAllTests() {
    console.log('🧪 Running Authentication System Tests...\n');
    
    const tests = [
        { name: 'AuthManager Loading', fn: testAuthManagerLoaded },
        { name: 'Form Elements', fn: testFormElements },
        { name: 'Email Validation', fn: testEmailValidation },
        { name: 'Password Validation', fn: testPasswordValidation },
        { name: 'Form Switching', fn: testFormSwitching }
    ];
    
    let passedTests = 0;
    
    tests.forEach((test, index) => {
        console.log(`\n--- Test ${index + 1}: ${test.name} ---`);
        try {
            if (test.fn()) {
                passedTests++;
                console.log(`✅ ${test.name} PASSED`);
            } else {
                console.log(`❌ ${test.name} FAILED`);
            }
        } catch (error) {
            console.log(`❌ ${test.name} ERROR:`, error.message);
        }
    });
    
    console.log(`\n📊 Test Results: ${passedTests}/${tests.length} tests passed`);
    
    if (passedTests === tests.length) {
        console.log('🎉 All tests passed! Your authentication system is ready.');
    } else {
        console.log('⚠️ Some tests failed. Please check the issues above.');
    }
    
    return passedTests === tests.length;
}

// Auto-run tests if this script is executed
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(runAllTests, 1000); // Wait 1 second for AuthManager to initialize
        });
    } else {
        setTimeout(runAllTests, 1000);
    }
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runAllTests, testAuthManagerLoaded, testFormElements };
}

console.log('📋 Test script loaded. Tests will run automatically or call runAllTests() manually.');