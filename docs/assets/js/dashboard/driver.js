// driver.js
function renderDriverDashboard() {
  const container = document.getElementById('dashboardContent');
  container.innerHTML = `
    <div class="bg-white bg-opacity-10 p-6 rounded-2xl shadow-lg">
      <h3 class="text-xl font-semibold mb-4">Driver Dashboard - SMART WASTE MANAGEMENT</h3>
      
      <div id="driverPickups" class="mb-4"></div>
      <div id="driverMapWrapper" class="rounded-lg overflow-hidden mb-4">
        <div id="map-driver" class="h-64 w-full"></div>
      </div>
    </div>
  `;

  const driverEmail = localStorage.getItem('userEmail');

  const pickups = JSON.parse(localStorage.getItem('pickups')||'[]').filter(p=>p.driverEmail===driverEmail);
  const pickupHistory = JSON.parse(localStorage.getItem('pickupHistory')||'[]');

  const driverPickupsDiv = document.getElementById('driverPickups');
  if(pickups.length===0) driverPickupsDiv.innerHTML='<p>No assigned pickups.</p>';

  pickups.forEach((p,i)=>{
    driverPickupsDiv.innerHTML += `
      <div class="mb-2 p-2 bg-white bg-opacity-20 rounded">
        Bin ${p.binId} - Status: ${p.status}
        <input type="text" placeholder="Notes" class="pickupNotes px-2 py-1 border rounded ml-2" data-i="${i}">
        <button class="markEmptied px-2 py-1 bg-green-500 text-white rounded ml-2" data-i="${i}">Mark Emptied</button>
      </div>
    `;
  });

  document.querySelectorAll('.markEmptied').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const i = e.target.dataset.i;
      const note = document.querySelector(`.pickupNotes[data-i="${i}"]`).value;
      pickups[i].status='Completed';
      localStorage.setItem('pickups', JSON.stringify(pickups));
      pickupHistory.push({ ...pickups[i], note, completedAt:new Date().toLocaleString() });
      localStorage.setItem('pickupHistory', JSON.stringify(pickupHistory));
      renderDriverDashboard();
    });
  });

  // Leaflet map
  try { if(window.currentMap) { window.currentMap.remove(); window.currentMap=null; } } catch(e){}

  const map = L.map('map-driver', { attributionControl:false }).setView([10.05,76.1],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ maxZoom:19 }).addTo(map);
  pickups.forEach(p=>L.marker([10.05 + Math.random()*0.01, 76.1 + Math.random()*0.01]).addTo(map).bindPopup(`Bin ${p.binId} - ${p.status}`));
  window.currentMap = map;
}
