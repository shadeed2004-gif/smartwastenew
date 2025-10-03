// main.js - core dashboard logic, session, and map handling
document.addEventListener('DOMContentLoaded', () => {

  // --- Helpers ---
  function removeCurrentMap() {
    try {
      if (window.currentMap && typeof window.currentMap.remove === 'function') {
        window.currentMap.remove();
        window.currentMap = null;
      }
    } catch (e) { /* ignore */ }
  }

  function setPageBackground(role) {
    document.body.classList.remove('login-page', 'admin-page', 'manager-page', 'driver-page', 'user-page');
    document.body.classList.add(`${role}-page`);
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // --- Dashboard Display ---
  window.showDashboard = function(role, name) {
    // Show dashboard, hide auth section
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    // Set background & title
    setPageBackground(role);
    document.getElementById('dashboardTitle').innerText = `Welcome ${capitalize(role)} ${name} | SMART WASTE MANAGEMENT`;

    // Clear previous content & map
    removeCurrentMap();
    document.getElementById('dashboardContent').innerHTML = '';

    // Render dashboard based on role
    switch(role) {
      case 'admin': renderAdminDashboard(); break;
      case 'manager': renderManagerDashboard(); break;
      case 'driver': renderDriverDashboard(); break;
      case 'user': renderUserDashboard(); break;
      default: renderUserDashboard(); break;
    }

    // Save session
    localStorage.setItem('userRole', role);
    localStorage.setItem('userName', name);
  };

  // --- Logout Handling ---
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

    // Remove map if exists
    removeCurrentMap();

    // Reset UI
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('authSection').classList.remove('hidden');

    // Reset body background
    document.body.className = '';
    document.body.classList.add('login-page');

    // Clear input values
    ['loginEmail','loginPassword','signupEmail','signupPassword'].forEach(id => {
      const el = document.getElementById(id);
      if(el) el.value = '';
    });

    // Show login form
    toggleAuth && toggleAuth('login');
  });

  // --- Auto-login if session exists ---
  const savedRole = localStorage.getItem('userRole');
  const savedName = localStorage.getItem('userName');
  if(savedRole && savedName) {
    // Validate renderer exists
    if(typeof window.showDashboard === 'function') {
      window.showDashboard(savedRole, savedName);
    }
  }

  // --- Window Resize Fix (login page centered) ---
  function fixLoginLayout() {
    const authCard = document.getElementById('authSection');
    if(authCard) {
      authCard.style.marginTop = `${Math.max(20, window.innerHeight/2 - authCard.offsetHeight/2)}px`;
    }
  }
  window.addEventListener('resize', fixLoginLayout);
  fixLoginLayout();

});
