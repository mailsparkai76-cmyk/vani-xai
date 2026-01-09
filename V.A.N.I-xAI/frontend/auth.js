// Firebase Authentication Handler

// Tab switching
document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Remove active class from all tabs
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
    
    // Add active class to clicked tab
    tab.classList.add('active');
    document.getElementById(`${tabName}-tab`).style.display = 'block';
  });
});

// Handle Email/Password Login
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');
  
  if (!email || !password) {
    errorDiv.textContent = '❌ Please enter email and password';
    return;
  }

  try {
    errorDiv.textContent = '⏳ Signing in...';
    const userCredential = await window.signInWithEmailAndPassword(window.firebaseAuth, email, password);
    errorDiv.textContent = '';
    console.log('✅ Logged in with email:', email);
    showMainApp();
  } catch (error) {
    let message = '❌ Sign in failed';
    if (error.code === 'auth/user-not-found') message = '❌ Email not found';
    if (error.code === 'auth/wrong-password') message = '❌ Wrong password';
    if (error.code === 'auth/invalid-email') message = '❌ Invalid email';
    errorDiv.textContent = message;
    console.error('Login error:', error);
  }
}

// Handle Email/Password Signup
async function handleSignup() {
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const errorDiv = document.getElementById('signup-error');
  
  if (!email || !password || !confirm) {
    errorDiv.textContent = '❌ Please fill all fields';
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = '❌ Password must be at least 6 characters';
    return;
  }

  if (password !== confirm) {
    errorDiv.textContent = '❌ Passwords do not match';
    return;
  }

  try {
    errorDiv.textContent = '⏳ Creating account...';
    const userCredential = await window.createUserWithEmailAndPassword(window.firebaseAuth, email, password);
    errorDiv.textContent = '';
    console.log('✅ Account created:', email);
    showMainApp();
  } catch (error) {
    let message = '❌ Sign up failed';
    if (error.code === 'auth/email-already-in-use') message = '❌ Email already registered';
    if (error.code === 'auth/weak-password') message = '❌ Password too weak';
    if (error.code === 'auth/invalid-email') message = '❌ Invalid email';
    errorDiv.textContent = message;
    console.error('Signup error:', error);
  }
}

// Handle Google Sign-In
async function handleGoogleSignIn() {
  const provider = new window.GoogleAuthProvider();
  try {
    document.getElementById('login-error').textContent = '⏳ Signing in with Google...';
    const result = await window.signInWithPopup(window.firebaseAuth, provider);
    console.log('✅ Logged in with Google:', result.user.email);
    showMainApp();
  } catch (error) {
    let message = '❌ Google sign-in failed';
    if (error.code === 'auth/popup-closed-by-user') message = '❌ Sign-in cancelled';
    if (error.code === 'auth/popup-blocked') message = '❌ Popup blocked by browser — falling back to redirect';
    const fullMsg = `${message} (${error.code}): ${error.message}`;
    document.getElementById('login-error').textContent = fullMsg;
    console.error('Google signin error:', error);

    if (error.code === 'auth/popup-blocked' && window.signInWithRedirect) {
      try {
        console.warn('Popup blocked: attempting redirect fallback');
        await window.signInWithRedirect(window.firebaseAuth, provider);
        return;
      } catch (redirErr) {
        document.getElementById('login-error').textContent = '❌ Redirect fallback failed: ' + (redirErr.message || redirErr);
        console.error('Redirect fallback error:', redirErr);
      }
    }
  }
}

// Handle Google Sign-Up
async function handleGoogleSignUp() {
  const provider = new window.GoogleAuthProvider();
  try {
    document.getElementById('signup-error').textContent = '⏳ Signing up with Google...';
    const result = await window.signInWithPopup(window.firebaseAuth, provider);
    console.log('✅ Account created with Google:', result.user.email);
    showMainApp();
  } catch (error) {
    let message = '❌ Google sign-up failed';
    if (error.code === 'auth/popup-closed-by-user') message = '❌ Sign-up cancelled';
    if (error.code === 'auth/popup-blocked') message = '❌ Popup blocked by browser — falling back to redirect';
    const fullMsg = `${message} (${error.code}): ${error.message}`;
    document.getElementById('signup-error').textContent = fullMsg;
    console.error('Google signup error:', error);

    if (error.code === 'auth/popup-blocked' && window.signInWithRedirect) {
      try {
        console.warn('Popup blocked: attempting redirect fallback');
        await window.signInWithRedirect(window.firebaseAuth, provider);
        return;
      } catch (redirErr) {
        document.getElementById('signup-error').textContent = '❌ Redirect fallback failed: ' + (redirErr.message || redirErr);
        console.error('Redirect fallback error:', redirErr);
      }
    }
  }
}

// Show main app after auth
function showMainApp() {
  document.getElementById('auth-modal').style.display = 'none';
  document.getElementById('main-container').style.display = 'flex';
}

// Hide main app (for logout)
function hideMainApp() {
  document.getElementById('auth-modal').style.display = 'flex';
  document.getElementById('main-container').style.display = 'none';
}

// Check auth state on page load
window.onAuthStateChanged(window.firebaseAuth, (user) => {
  if (user) {
    console.log('✅ User authenticated:', user.email);
    console.log('   Provider:', user.providerData[0]?.providerId || 'email/password');
    showMainApp();
  } else {
    console.log('❌ User not authenticated');
    hideMainApp();
  }
});

// Handle redirect result (for signInWithRedirect fallback)
async function handleRedirectResult() {
  if (!window.getRedirectResult) return;
  try {
    const result = await window.getRedirectResult(window.firebaseAuth);
    if (result && result.user) {
      console.log('✅ Logged in via redirect:', result.user.email);
      showMainApp();
    }
  } catch (error) {
    console.error('Redirect sign-in error:', error);
    // Show user-friendly error if needed
    const errMsg = `❌ Redirect sign-in failed (${error.code || 'error'}): ${error.message || ''}`;
    // Prefer showing in login-error if present
    const le = document.getElementById('login-error');
    if (le) le.textContent = errMsg;
  }
}

// Immediately attempt to process any OAuth redirect result
handleRedirectResult();

// Global logout function
window.handleLogout = async function() {
  try {
    await window.signOut(window.firebaseAuth);
    console.log('✅ Logged out');
    hideMainApp();
    // Clear form fields
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm').value = '';
  } catch (error) {
    console.error('Logout error:', error);
  }
};
