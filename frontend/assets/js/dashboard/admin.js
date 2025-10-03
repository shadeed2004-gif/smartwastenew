function renderAdminDashboard(){
  const container = document.getElementById('dashboardContent');
  container.innerHTML=`
    <div class="section-card">
      <h3 class="text-xl font-semibold mb-4">Admin Dashboard</h3>
      <p class="mb-4">Create, update, delete users.</p>

      <div class="mb-4 flex flex-col gap-2">
        <input type="email" id="newUserEmail" placeholder="User Email" class="border p-2 rounded w-full">
        <input type="password" id="newUserPassword" placeholder="Password" class="border p-2 rounded w-full">
        <select id="newUserRole" class="border p-2 rounded w-full">
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="driver">Driver</option>
          <option value="user">User</option>
        </select>
        <button id="addUserBtn" class="btn success mt-2">Add / Update User</button>
      </div>

      <h4 class="font-semibold mb-2">Existing Users:</h4>
      <div id="adminUserList"></div>
    </div>
  `;

  function refreshUserList(){
    const list = document.getElementById('adminUserList');
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    list.innerHTML = '';
    users.forEach((u,i)=>{
      const div = document.createElement('div');
      div.className='p-2 mb-1 border rounded flex justify-between items-center';
      div.innerHTML=`<span>${u.email} - ${u.role}</span>
                     <button class="deleteBtn btn">Delete</button>`;
      div.querySelector('.deleteBtn').addEventListener('click',()=>{
        users.splice(i,1);
        localStorage.setItem('users',JSON.stringify(users));
        refreshUserList();
      });
      list.appendChild(div);
    });
  }

  refreshUserList();

  document.getElementById('addUserBtn').addEventListener('click',()=>{
    const email = document.getElementById('newUserEmail').value.trim();
    const password = document.getElementById('newUserPassword').value.trim();
    const role = document.getElementById('newUserRole').value;

    if(!email||!password) return alert("Email & Password required.");

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u=>u.email===email);
    const name = email.split('@')[0];

    if(index>=0){
      users[index].password=password;
      users[index].role=role;
    }else{
      users.push({email,password,name,role});
    }
    localStorage.setItem('users',JSON.stringify(users));
    refreshUserList();

    document.getElementById('newUserEmail').value='';
    document.getElementById('newUserPassword').value='';
  });
}
