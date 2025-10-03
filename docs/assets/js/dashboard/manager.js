// manager.js
function renderManagerDashboard() {
  const container = document.getElementById('dashboardContent');

  container.innerHTML = `
    <div class="bg-white bg-opacity-10 p-6 rounded-2xl shadow-lg">
      <h3 class="text-xl font-semibold mb-4">Manager Dashboard</h3>

      <!-- Bin Monitoring -->
      <div class="mb-6">
        <h4 class="font-semibold mb-2">Bin Status Monitoring</h4>
        <div id="binList" class="grid grid-cols-1 md:grid-cols-2 gap-3"></div>
      </div>

      <!-- Assign Pickups -->
      <div class="mb-6">
        <h4 class="font-semibold mb-2">Approve & Schedule Pickups</h4>
        <div id="pickupAssignArea"></div>
      </div>

      <!-- Reports -->
      <div class="mb-6">
        <h4 class="font-semibold mb-2">Pickup Reports</h4>
        <table class="w-full text-left border-collapse border border-gray-300" id="pickupReportsTable">
          <thead>
            <tr class="bg-white bg-opacity-20">
              <th class="border px-2 py-1">Bin ID</th>
              <th class="border px-2 py-1">Driver</th>
              <th class="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>

      <!-- User Issues -->
      <div class="mb-6">
        <h4 class="font-semibold mb-2">User Issues</h4>
        <div id="userIssuesList"></div>
      </div>
    </div>
  `;

  // --- Mock Bin Data ---
  let bins = JSON.parse(localStorage.getItem('bins') || '[]');
  if (bins.length === 0) {
    bins = Array.from({length: 5}, (_, i) => ({ id: i+1, fill: Math.floor(Math.random()*101) }));
    localStorage.setItem('bins', JSON.stringify(bins));
  }

  function updateBinList() {
    const binListEl = document.getElementById('binList');
    binListEl.innerHTML = '';
    bins.forEach(bin => {
      const color = bin.fill >= 80 ? 'bg-red-600' : (bin.fill >= 50 ? 'bg-orange-500' : 'bg-green-500');
      const needsPickupBtn = bin.fill >= 80 ? `<button data-bin="${bin.id}" class="approveBtn px-3 py-1 rounded bg-blue-600 text-white mt-1 hover:bg-blue-700 transition">Approve Pickup</button>` : '';
      binListEl.innerHTML += `
        <div class="p-3 rounded shadow bg-white bg-opacity-20">
          <p>Bin ${bin.id} - Fill: ${bin.fill}%</p>
          ${needsPickupBtn}
        </div>
      `;
    });
    attachApproveEvents();
  }

  // Auto-update bin fill levels every 5s
  setInterval(() => {
    bins = bins.map(b => ({...b, fill: Math.min(100, Math.max(0, b.fill + Math.floor(Math.random()*21)-10))}));
    localStorage.setItem('bins', JSON.stringify(bins));
    updateBinList();
  }, 5000);

  updateBinList();

  // --- Approve Pickup ---
  function attachApproveEvents() {
    document.querySelectorAll('.approveBtn').forEach(btn => {
      btn.onclick = () => {
        const binId = parseInt(btn.getAttribute('data-bin'));
        const drivers = JSON.parse(localStorage.getItem('users') || '[]').filter(u => u.role === 'driver');
        const pickupAssignArea = document.getElementById('pickupAssignArea');
        pickupAssignArea.innerHTML = `
          <p>Assign driver for Bin ${binId}:</p>
          <select id="assignDriverSelect" class="w-full p-2 rounded border mb-2">
            <option value="">Select Driver</option>
            ${drivers.map(d => `<option value="${d.email}">${d.name}</option>`).join('')}
          </select>
          <button id="confirmAssignBtn" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Confirm</button>
        `;
        document.getElementById('confirmAssignBtn').onclick = () => {
          const driverEmail = document.getElementById('assignDriverSelect').value;
          if(!driverEmail) return alert('Please select a driver.');
          const pickups = JSON.parse(localStorage.getItem('pickups') || '[]');
          pickups.push({ binId, driverEmail, status: 'Pending' });
          localStorage.setItem('pickups', JSON.stringify(pickups));
          alert(`Bin ${binId} assigned to driver.`);
          pickupAssignArea.innerHTML = '';
          updateReports();
        };
      };
    });
  }

  // --- Reports ---
  function updateReports() {
    const tbody = document.querySelector('#pickupReportsTable tbody');
    const pickups = JSON.parse(localStorage.getItem('pickups') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    tbody.innerHTML = '';
    pickups.forEach(p => {
      const driver = users.find(u=>u.email===p.driverEmail)?.name || 'Unknown';
      tbody.innerHTML += `
        <tr>
          <td class="border px-2 py-1">${p.binId}</td>
          <td class="border px-2 py-1">${driver}</td>
          <td class="border px-2 py-1">${p.status}</td>
        </tr>
      `;
    });
  }

  updateReports();

  // --- User Issues ---
  function updateIssues() {
    const issues = JSON.parse(localStorage.getItem('issues') || '[]');
    const container = document.getElementById('userIssuesList');
    container.innerHTML = '';
    issues.forEach((i, idx) => {
      container.innerHTML += `
        <div class="p-2 mb-2 rounded shadow bg-white bg-opacity-20">
          <p><strong>${i.type}:</strong> ${i.description}</p>
          <p>Status: <span id="issueStatus${idx}">${i.status}</span></p>
          ${i.status==='Pending' ? `<button data-idx="${idx}" class="resolveIssueBtn px-3 py-1 mt-1 bg-green-600 text-white rounded hover:bg-green-700 transition">Mark Resolved</button>` : ''}
        </div>
      `;
    });

    document.querySelectorAll('.resolveIssueBtn').forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        issues[idx].status = 'Resolved';
        localStorage.setItem('issues', JSON.stringify(issues));
        updateIssues();
      };
    });
  }

  updateIssues();
}
