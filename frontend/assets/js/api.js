// Dummy users (default)
let users = [
  { email: "admin@system.com", password: "1234", role: "Admin", name: "System Admin" },
  { email: "manager@system.com", password: "1234", role: "Manager", name: "City Manager" },
  { email: "driver@system.com", password: "1234", role: "Driver", name: "Driver 1" },
  { email: "john@gmail.com", password: "1234", role: "User", name: "John Doe" }
];

// Elements
const loginContainer = document.getElementById("loginContainer");
const signupContainer = document.getElementById("signupContainer");
const dashboardContainer = document.getElementById("dashboardContainer");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const dashboardTitle = document.getElementById("dashboardTitle");
const dashboardContent = document.getElementById("dashboardContent");
const logoutBtn = document.getElementById("logoutBtn");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

// Toggle views
showSignup.addEventListener("click", () => {
  loginContainer.classList.add("hidden");
  signupContainer.classList.remove("hidden");
});

showLogin.addEventListener("click", () => {
  signupContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});

// Login functionality
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    loadDashboard(user);
  } else {
    alert("Invalid email or password!");
  }
});

// Signup functionality
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const role = document.getElementById("signupRole").value;

  if (users.find(u => u.email === email)) {
    alert("User already exists!");
    return;
  }

  const newUser = { email, password, role, name };
  users.push(newUser);
  alert("Signup successful! Please login.");
  signupContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});

// Logout
logoutBtn.addEventListener("click", () => {
  dashboardContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
  document.body.style.backgroundImage = "";
});

// Load dashboard
function loadDashboard(user) {
  loginContainer.classList.add("hidden");
  signupContainer.classList.add("hidden");
  dashboardContainer.classList.remove("hidden");

  dashboardTitle.innerText = `${user.role} Dashboard - Welcome ${user.name}`;

  // Background per role
  let bg = "assets/img/bg-login.jpg";
  if (user.role === "Admin") bg = "assets/img/bg-admin.jpg";
  else if (user.role === "Manager") bg = "assets/img/bg-manager.jpg";
  else if (user.role === "Driver") bg = "assets/img/bg-driver.jpg";
  else if (user.role === "User") bg = "assets/img/bg-user.jpg";
  dashboardContainer.style.backgroundImage = `url('${bg}')`;

  // Content per role
  dashboardContent.innerHTML = "";
  if (user.role === "Admin") {
    dashboardContent.innerHTML = `
      <button class="bg-blue-600 text-white px-4 py-2 rounded mb-4">Manage Users</button>
      <button class="bg-green-600 text-white px-4 py-2 rounded mb-4">View Reports</button>
      <button class="bg-yellow-600 text-white px-4 py-2 rounded mb-4">System Settings</button>
    `;
  } else if (user.role === "Manager") {
    dashboardContent.innerHTML = `
      <button class="bg-purple-600 text-white px-4 py-2 rounded mb-4">Assign Routes</button>
      <button class="bg-blue-600 text-white px-4 py-2 rounded mb-4">Track Bins</button>
      <button class="bg-green-600 text-white px-4 py-2 rounded mb-4">Generate Reports</button>
    `;
  } else if (user.role === "Driver") {
    dashboardContent.innerHTML = `
      <button class="bg-blue-600 text-white px-4 py-2 rounded mb-4">View Assigned Route</button>
      <button class="bg-green-600 text-white px-4 py-2 rounded mb-4">Report Issues</button>
    `;
  } else if (user.role === "User") {
    dashboardContent.innerHTML = `
      <button class="bg-green-600 text-white px-4 py-2 rounded mb-4">Request Bin Pickup</button>
      <button class="bg-blue-600 text-white px-4 py-2 rounded mb-4">View Bin Status</button>
    `;
  }
}
