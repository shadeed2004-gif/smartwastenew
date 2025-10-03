document.addEventListener('DOMContentLoaded', () => {

  // Load users from localStorage
  let users = JSON.parse(localStorage.getItem('users') || '[]');

  // ✅ Preload default admin if not exists
  if(!users.find(u => u.email === 'admin@smartwaste.com')) {
    const defaultAdmin = { 
      email: 'admin@smartwaste.com', 
      password: 'admin123', 
      name: 'Admin', 
      role: 'admin' 
    };
    users.push(defaultAdmin);
    localStorage.setItem('users', JSON.stringify(users));
  }

  function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
  }

  function getNameFromEmail(email) {
    const part = email.split('@')[0].replace(/[._]/g, ' ');
    return part.charAt(0).toUpperCase() + part.slice(1);
  }

  // Toggle login/signup
  window.toggleAuth = function(mode) {
    const isSignup = (mode === 'signup');
    document.getElementById('authTitle').innerText = isSignup ? 'Sign Up - SMART WASTE MANAGEMENT' : 'Login - SMART WASTE MANAGEMENT';
    document.getElementById('loginForm').classList.toggle('hidden', isSignup);
    document.getElementById('signupForm').classList.toggle('hidden', !isSignup);
  };

  document.getElementById('showSignup').addEventListener('click', e => { e.preventDefault(); toggleAuth('signup'); });
  document.getElementById('showLogin').addEventListener('click', e => { e.preventDefault(); toggleAuth('login'); });

  // Signup new user
  document.getElementById('signupBtn').addEventListener('click', () => {
    const email = (document.getElementById('signupEmail').value || '').trim();
    const password = (document.getElementById('signupPassword').value || '').trim();
    if(!email || !password) return alert("Please fill all fields.");
    if(users.find(u => u.email === email)) return alert("User already exists!");

    const name = getNameFromEmail(email);
    users.push({ email, password, name, role:'user' });
    saveUsers();
    alert("Registration successful! Please login.");
    toggleAuth('login');
  });

  // Login user
  document.getElementById('loginBtn').addEventListener('click', () => {
    const email = (document.getElementById('loginEmail').value || '').trim();
    const password = (document.getElementById('loginPassword').value || '').trim();
    if(!email || !password) return alert("Please fill all fields.");

    // Find user by email & password
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if(!user) return alert("Invalid email or password.");

    // Save session
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userName', user.name);

    // Show dashboard
    if(typeof window.showDashboard === 'function') {
      window.showDashboard(user.role, user.name);
    } else {
      alert('Unable to open dashboard.');
    }
  });

});
