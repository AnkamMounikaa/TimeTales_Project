// Elements
let mainContainer = document.getElementById("main-container");
let navLogin = document.getElementById("nav-login");
let navSignup = document.getElementById("nav-signup");
let navProfile = document.getElementById("nav-profile");
let navLogout = document.getElementById("nav-logout");

// Users and session
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Capsules
let capsules = JSON.parse(localStorage.getItem("capsules")) || [];

// --- NAVBAR EVENTS ---
navLogin.addEventListener("click", () => showLogin());
navSignup.addEventListener("click", () => showSignup());
navLogout.addEventListener("click", () => logout());
navProfile.addEventListener("click", () => showProfile());

// Highlight active link
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});

// Add shadow on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if(window.scrollY > 50){
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

function showLogin() {
  mainContainer.innerHTML = `
    <div class="d-flex justify-content-center align-items-center" style="height: 600px;">
      <div class="card shadow-lg p-4" style="width: 350px; border-radius: 15px; border: none; background: #f8f9fa;">
        <div class="text-center mb-3">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRylqFwcq_UkroUbJ0rD0_BYS1cCb2tqTimwA&s" alt="Logo" style="height: 50px; margin-bottom: 10px;">
          <h2 style="font-family: 'Roboto'; color: #222629;">Login</h2>
        </div>
        <form id="loginForm">
          <div class="form-group">
            <input type="email" class="form-control form-control-lg" placeholder="Email" required>
          </div>
          <div class="form-group">
            <input type="password" class="form-control form-control-lg" placeholder="Password" required>
          </div>
          <button style="background-color:#86c232;" type="submit" class="btn btn-success btn-block btn-lg mt-3">Login</button>
        </form>
        <div class="text-center mt-3">
          <p style="font-size: 14px;">Don't have an account? <a href="#" id="goSignup">Sign Up</a></p>
        </div>
      </div>
    </div>
  `;

  // JS functionality
  document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = this[0].value;
    const password = this[1].value;
    const user = users.find(u => u.email === email && u.password === password);
    if(user) {
      currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      showProfile();
      updateNav();
    } else {
      alert("Invalid email or password!");
    }
  });

  document.getElementById("goSignup").addEventListener("click", function(e){
    e.preventDefault();
    showSignup();
  });
}


// --- SHOW SIGNUP ---
function showSignup() {
  mainContainer.innerHTML = `
    
   
      <div class="d-flex justify-content-center align-items-center" style="height: 600px;">
      <div class="card shadow-lg p-4" style="width: 350px; border-radius: 15px; border: none; background: #f8f9fa;">
        <div class="text-center mb-3">
          <img src="https://toppng.com/uploads/preview/pro-svg-icon-sign-up-icon-svg-115534449143lq1avadrj.png" alt="Logo" style="height: 50px; margin-bottom: 10px;">
          <h2 style="font-family: 'Roboto'; color: #222629;">Sign Up</h2>
        </div>
          
          <form id="signupForm">
            <div class="form-group"><input type="text" class="form-control" placeholder="Name" required></div>
            <div class="form-group"><input type="email" class="form-control" placeholder="Email" required></div>
            <div class="form-group"><input type="password" class="form-control" placeholder="Password" required></div>
            <button type="submit" class="btn primary-btn btn-block">Sign Up</button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById("signupForm").addEventListener("submit", function(e){
    e.preventDefault();
    const name = this[0].value;
    const email = this[1].value;
    const password = this[2].value;
    if(users.find(u => u.email === email)){
      alert("Email already exists!");
      return;
    }
    const user = { name, email, password };
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    showProfile();
    updateNav();
  });
}

// --- SHOW PROFILE & CAPSULE MANAGEMENT ---
function showProfile() {
  if(!currentUser) { showLogin(); return; }

  mainContainer.innerHTML = `
    <h2 style="color:white; font-family:roboto;" class="text-center mb-4">Welcome, ${currentUser.name}</h2>
    <p style="color:white; text-align:center;">Your Time Capsules are safe and secure here.</p>
    <div class="row mb-4">
      <div class="col-md-6">
        <h4>Create Capsule</h4>
        <form id="capsuleForm">
          <div class="form-group"><input type="text" class="form-control" placeholder="Title" required></div>
          <div class="form-group"><textarea class="form-control" rows="2" placeholder="Description" required></textarea></div>
          <div class="form-group"><input type="file" class="form-control-file"></div>
          <div class="form-group"><input type="date" class="form-control" required></div>
          <button type="submit" class="btn primary-btn btn-block">Save Capsule</button>
        </form>
      </div>
      <div class="col-md-6">
        <h4>My Capsules</h4>
        <div class="row capsule-list"></div>
      </div>
    </div>
  `;

  document.getElementById("capsuleForm").addEventListener("submit", addCapsule);
  displayCapsules();
}

// --- ADD CAPSULE ---
function addCapsule(e) {
  e.preventDefault();
  const form = e.target;
  const title = form[0].value;
  const description = form[1].value;
  const fileInput = form[2];
  const date = form[3].value;
  let fileData = "";

  const reader = new FileReader();
  reader.onload = function(){
    fileData = reader.result;
    saveCapsule(title, description, date, fileData);
    form.reset();
  }

  if(fileInput.files[0]){
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveCapsule(title, description, date, fileData);
    form.reset();
  }
}

// --- SAVE CAPSULE ---
function saveCapsule(title, description, date, fileData){
  const capsule = {
    id: Date.now(),
    userEmail: currentUser.email,
    title,
    description,
    date,
    fileData,
    status: new Date(date) <= new Date() ? "open" : "locked"
  };
  capsules.push(capsule);
  localStorage.setItem("capsules", JSON.stringify(capsules));
  displayCapsules();
}

// --- DISPLAY CAPSULES ---
function displayCapsules(){
  const capsuleListContainer = document.querySelector(".capsule-list");
  if(!capsuleListContainer) return;
  capsuleListContainer.innerHTML = "";

  const userCapsules = capsules.filter(c => c.userEmail === currentUser.email);

  userCapsules.forEach(capsule => {
    const col = document.createElement("div");
    col.className = "col-md-12 mb-3";
    col.innerHTML = `
      <div class="capsule-card p-3">
        <h5 style="color:#61892f;">${capsule.title}</h5>
        <p>${capsule.description}</p>
        <p>Unlock Date: ${capsule.date}</p>
        <span class="status ${capsule.status === 'open' ? 'open' : ''}">${capsule.status}</span>
        <div class="mt-2">
          ${capsule.status === 'open' ? `<button style="background-color:#86c232; color:white;" class="btn btn-sm " onclick="openCapsule(${capsule.id})">Open</button>` : ""}
          <button class="btn btn-sm btn-danger" onclick="deleteCapsule(${capsule.id})">Delete</button>
        </div>
      </div>
    `;
    capsuleListContainer.appendChild(col);
  });
}

// --- OPEN CAPSULE ---

let currentCapsule = null; // to keep track for download/share

function openCapsule(id){
  const capsule = capsules.find(c => c.id === id);
  if(!capsule) return;

  currentCapsule = capsule; // store current capsule for modal buttons

  let contentHTML = `<p><strong>Title:</strong> ${capsule.title}</p>
                     <p><strong>Description:</strong> ${capsule.description}</p>
                     <p><strong>Unlock Date:</strong> ${capsule.date}</p>`;

  if(capsule.fileData){
    if(capsule.fileData.startsWith("data:image")){
      contentHTML += `<img src="${capsule.fileData}" alt="Capsule Image">`;
    } else if(capsule.fileData.startsWith("data:video")){
      contentHTML += `<video controls><source src="${capsule.fileData}"></video>`;
    }
  }

  document.getElementById("capsuleModalBody").innerHTML = contentHTML;
  $('#capsuleModal').modal('show');
}

// --- DOWNLOAD CAPSULE ---
document.getElementById("downloadCapsule").addEventListener("click", function(){
  if(!currentCapsule) return;
  const element = document.createElement("a");
  const fileContent = `Title: ${currentCapsule.title}\nDescription: ${currentCapsule.description}\nUnlock Date: ${currentCapsule.date}`;
  const blob = new Blob([fileContent], {type: "text/plain"});
  element.href = URL.createObjectURL(blob);
  element.download = `${currentCapsule.title}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
});

// --- SHARE CAPSULE ---
document.getElementById("shareCapsule").addEventListener("click", function(){
  if(!currentCapsule) return;
  const shareURL = `${window.location.href}#capsule-${currentCapsule.id}`;
  navigator.clipboard.writeText(shareURL).then(() => {
    alert("Capsule share link copied to clipboard!");
  });
});

// function openCapsule(id){
//   const capsule = capsules.find(c => c.id === id);
//   if(!capsule) return;
//   let content = `Title: ${capsule.title}\nDescription: ${capsule.description}`;
//   if(capsule.fileData){
//     content += `\n[Media Attached]`;
//   }
//   alert(content);
// }

// --- DELETE CAPSULE ---
function deleteCapsule(id){
  if(!confirm("Delete this capsule?")) return;
  capsules = capsules.filter(c => c.id !== id);
  localStorage.setItem("capsules", JSON.stringify(capsules));
  displayCapsules();
}

// --- LOGOUT ---
function logout(){
  currentUser = null;
  localStorage.removeItem("currentUser");
  updateNav();
  showLogin();
}

// --- UPDATE NAVBAR ---
function updateNav(){
  if(currentUser){
    navLogin.classList.add("d-none");
    navSignup.classList.add("d-none");
    navProfile.classList.remove("d-none");
    navLogout.classList.remove("d-none");
  } else {
    navLogin.classList.remove("d-none");
    navSignup.classList.remove("d-none");
    navProfile.classList.add("d-none");
    navLogout.classList.add("d-none");
  }
}

// --- CHECK CAPSULE STATUS ON LOAD ---
function updateCapsuleStatus(){
  const today = new Date();
  let updated = false;
  capsules.forEach(capsule => {
    if(new Date(capsule.date) <= today && capsule.status === "locked"){
      capsule.status = "open";
      updated = true;
    }
  });
  if(updated) localStorage.setItem("capsules", JSON.stringify(capsules));
}

// Initialize
updateCapsuleStatus();
updateNav();
if(currentUser) showProfile(); else showLogin();
