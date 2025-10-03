// user.js
function renderUserDashboard() {
  const container = document.getElementById('dashboardContent');
  container.innerHTML = `
    <div class="bg-white bg-opacity-10 p-6 rounded-2xl shadow-lg">
      <h3 class="text-xl font-semibold mb-4">User Dashboard - SMART WASTE MANAGEMENT</h3>
      
      <div id="userMapWrapper" class="rounded-lg overflow-hidden mb-4">
        <div id="map-user" class="h-64 w-full"></div>
      </div>

      <h4 class="text-lg font-semibold mt-2 mb-2">Report Issue</h4>
      <input id="issueType" type="text" placeholder="Type of Issue" class="px-2 py-1 border rounded mb-2 w-full">
      <textarea id="issueDesc" placeholder="Description" class="px-2 py-1 border rounded mb-2 w-full"></textarea>
      <button id="reportBtn" class="px-3 py-1 bg-blue-500 text-white rounded mb-4">Report Issue</button>

      <h4 class="text-lg font-semibold mt-2 mb-2">Your Reports</h4>
      <div id="userReports"></div>
    </div>
  `;

  const userName = localStorage.getItem('userName') || 'Guest';
  const issues = JSON.parse(localStorage.getItem('issues')||'[]');

  // Map with bins
  try { if(window.currentMap) { window.currentMap.remove(); window.currentMap=null; } } catch(e){}
  const map = L.map('map-user',{attributionControl:false}).setView([10.05,76.1],13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);

  for(let i=1;i<=10;i++){
    const fill=Math.floor(Math.random()*101);
    let color='green';
    if(fill>50 && fill<=80) color='orange';
    else if(fill>80) color='red';
    L.circle([10.05+Math.random()*0.01,76.1+Math.random()*0.01], {radius:50, color, fillColor:color, fillOpacity:0.5}).bindPopup(`Bin ${i} - ${fill}% full`).addTo(map);
  }
  window.currentMap=map;

  // Report Issue
  document.getElementById('reportBtn').addEventListener('click', ()=>{
    const type=document.getElementById('issueType').value.trim();
    const desc=document.getElementById('issueDesc').value.trim();
    if(!type || !desc) return alert('Fill all fields!');
    issues.push({ user:userName, type, desc, status:'Pending' });
    localStorage.setItem('issues', JSON.stringify(issues));
    alert('Issue reported!');
    document.getElementById('issueType').value='';
    document.getElementById('issueDesc').value='';
    renderUserReports();
  });

  function renderUserReports(){
    const userReports=document.getElementById('userReports');
    const myIssues=issues.filter(i=>i.user===userName);
    if(myIssues.length===0) { userReports.innerHTML='<p>No reports yet.</p>'; return; }
    let html='<ul>';
    myIssues.forEach(i=>{
      html+=`<li>${i.type} - ${i.desc} [${i.status}]</li>`;
    });
    html+='</ul>';
    userReports.innerHTML=html;
  }

  renderUserReports();
}
