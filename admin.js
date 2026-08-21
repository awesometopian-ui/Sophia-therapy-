// ====== ADMIN WITH SUPABASE ======

// ====== LOGIN ======
var loginScreen = document.getElementById('loginScreen');
var adminPanel = document.getElementById('adminPanel');
var loginBtn = document.getElementById('loginBtn');
var loginError = document.getElementById('loginError');
var logoutBtn = document.getElementById('logoutBtn');

var ADMIN_USERNAME = 'admin';
var ADMIN_PASSWORD = 'admin123';

function checkSession() {
    var loggedIn = localStorage.getItem('sophia_admin_loggedin');
    if (loggedIn === 'true') {
        loginScreen.style.display = 'none';
        adminPanel.classList.add('active');
        loadAllData();
    }
}

function showLoginScreen() {
    loginScreen.style.display = 'flex';
    adminPanel.classList.remove('active');
}

loginBtn.addEventListener('click', function() {
    var username = document.getElementById('loginUsername').value.trim();
    var password = document.getElementById('loginPassword').value.trim();
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('sophia_admin_loggedin', 'true');
        loginError.textContent = '';
        loginScreen.style.display = 'none';
        adminPanel.classList.add('active');
        loadAllData();
    } else {
        loginError.textContent = 'Invalid username or password';
    }
});

document.getElementById('loginPassword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') loginBtn.click();
});
document.getElementById('loginUsername').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') loginBtn.click();
});

logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('sophia_admin_loggedin');
    showLoginScreen();
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    loginError.textContent = '';
});

// ====== TABS ======
var tabBtns = document.querySelectorAll('.tab-btn');
for (var i = 0; i < tabBtns.length; i++) {
    tabBtns[i].addEventListener('click', function() {
        var tabs = document.querySelectorAll('.tab-btn');
        for (var j = 0; j < tabs.length; j++) {
            tabs[j].classList.remove('active');
        }
        this.classList.add('active');
        var contents = document.querySelectorAll('.tab-content');
        for (var k = 0; k < contents.length; k++) {
            contents[k].classList.remove('active');
        }
        document.getElementById('tab-' + this.dataset.tab).classList.add('active');
    });
}

// ====== LOAD FUNCTIONS ======
async function loadAllData() {
    await renderImageList();
    await renderVideoList();
    await renderServiceList();
    await renderUsersList();
    renderStats();
}

// ====== RENDER IMAGE LIST ======
async function renderImageList() {
    var container = document.getElementById('imageList');
    if (!container) return;
    
    var images = await getImages();
    
    if (images.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No images uploaded yet.</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < images.length; i++) {
        var item = images[i];
        var num = i + 1;
        html += `
            <div class="image-item">
                <img src="${item.url}" alt="${item.title}">
                <div class="info">
                    <div class="title">#${num} - ${item.title || 'Untitled'}</div>
                    <div class="details">Price: $${item.price} · ID: ${item.id}</div>
                    <div class="pin"><i class="fas fa-key"></i> PIN: <strong>${item.pin || 'N/A'}</strong></div>
                </div>
                <div>
                    <button class="copy-btn" onclick="copyText('${item.pin || ''}')"><i class="fas fa-copy"></i></button>
                    <button class="btn-danger" onclick="deleteImageItem(${item.id})" style="padding:0.2rem 0.6rem;font-size:0.8rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ====== RENDER VIDEO LIST ======
async function renderVideoList() {
    var container = document.getElementById('videoList');
    if (!container) return;
    
    var videos = await getVideos();
    
    if (videos.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No videos uploaded yet.</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < videos.length; i++) {
        var item = videos[i];
        var num = i + 1;
        html += `
            <div class="video-item">
                <img src="${item.thumbnail || 'https://via.placeholder.com/60x60/8b3a4a/fff?text=Video'}" alt="${item.title}">
                <div class="info">
                    <div class="title">#${num} - ${item.title || 'Untitled'}</div>
                    <div class="details">Price: $${item.price} · ID: ${item.id}</div>
                    <div class="pin"><i class="fas fa-key"></i> PIN: <strong>${item.pin || 'N/A'}</strong></div>
                </div>
                <div>
                    <button class="copy-btn" onclick="copyText('${item.pin || ''}')"><i class="fas fa-copy"></i></button>
                    <button class="btn-danger" onclick="deleteVideoItem(${item.id})" style="padding:0.2rem 0.6rem;font-size:0.8rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ====== RENDER SERVICE LIST ======
async function renderServiceList() {
    var container = document.getElementById('serviceListAdmin');
    if (!container) return;
    
    var services = await getServices();
    
    if (services.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No services added yet.</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < services.length; i++) {
        var service = services[i];
        var num = i + 1;
        var icon = service.icon || 'fas fa-star';
        html += `
            <div class="service-item">
                <div class="service-icon"><i class="${icon}"></i></div>
                <div class="info">
                    <div class="name">#${num} - ${service.name}</div>
                    <div class="desc">${service.description || 'No description'}</div>
                    <div><span class="price">$${service.price}</span> · <span class="duration">${service.duration || 'N/A'}</span></div>
                </div>
                <div>
                    <button class="btn-danger" onclick="deleteServiceItem(${service.id})" style="padding:0.2rem 0.6rem;font-size:0.8rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ====== RENDER USERS LIST ======
async function renderUsersList() {
    var container = document.getElementById('usersList');
    if (!container) return;
    
    var users = await getUsers();
    
    if (users.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No users registered yet.</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var statusClass = 'inactive';
        var statusText = 'Inactive';
        if (user.subscription === 'active' || user.subscription === 'Active') {
            statusClass = 'active';
            statusText = 'Active';
        }
        
        html += `
            <div class="user-item">
                <div class="user-info">
                    <div class="name">${user.name}</div>
                    <div class="id">ID: ${user.id} · ${user.email}</div>
                    <div style="font-size:0.8rem;color:#6b5d4f;">${user.phone}</div>
                </div>
                <div>
                    <span class="user-status ${statusClass}">${statusText}</span>
                    <button class="copy-btn" onclick="copyText('${user.id}')" style="margin-left:0.3rem;"><i class="fas fa-copy"></i></button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ====== STATS ======
async function renderStats() {
    var images = await getImages();
    var videos = await getVideos();
    var services = await getServices();
    var users = await getUsers();
    
    document.getElementById('totalImages').textContent = images.length;
    document.getElementById('totalVideos').textContent = videos.length;
    document.getElementById('totalServices').textContent = services.length;
    document.getElementById('totalUsers').textContent = users.length;
    
    var active = 0;
    for (var i = 0; i < users.length; i++) {
        if (users[i].subscription === 'active' || users[i].subscription === 'Active') {
            active++;
        }
    }
    document.getElementById('activeSubs').textContent = active;
}

// ====== UPLOAD IMAGE ======
document.getElementById('imageUploadBtn').addEventListener('click', async function() {
    var title = document.getElementById('imageTitle').value.trim();
    var price = parseInt(document.getElementById('imagePrice').value) || 5;
    var url = document.getElementById('imageUrl').value.trim();
    
    if (!title || !url) {
        document.getElementById('imageUploadStatus').textContent = 'Please fill in Title and URL';
        document.getElementById('imageUploadStatus').style.color = '#c0392b';
        return;
    }
    
    var pin = generatePin();
    await addImage(title, url, price, pin);
    
    document.getElementById('imageUploadStatus').textContent = '✅ Image added! PIN: ' + pin;
    document.getElementById('imageUploadStatus').style.color = '#2b6e4f';
    
    document.getElementById('imageTitle').value = '';
    document.getElementById('imageUrl').value = '';
    document.getElementById('imagePrice').value = '5';
    
    await loadAllData();
});

// ====== UPLOAD VIDEO ======
document.getElementById('videoUploadBtn').addEventListener('click', async function() {
    var title = document.getElementById('videoTitle').value.trim();
    var price = parseInt(document.getElementById('videoPrice').value) || 8;
    var url = document.getElementById('videoUrl').value.trim();
    
    if (!title || !url) {
        document.getElementById('videoUploadStatus').textContent = 'Please fill in Title and URL';
        document.getElementById('videoUploadStatus').style.color = '#c0392b';
        return;
    }
    
    var pin = generatePin();
    await addVideo(title, url, price, pin);
    
    document.getElementById('videoUploadStatus').textContent = '✅ Video added! PIN: ' + pin;
    document.getElementById('videoUploadStatus').style.color = '#2b6e4f';
    
    document.getElementById('videoTitle').value = '';
    document.getElementById('videoUrl').value = '';
    document.getElementById('videoPrice').value = '8';
    
    await loadAllData();
});

// ====== ADD SERVICE ======
document.getElementById('addServiceBtn').addEventListener('click', async function() {
    var name = document.getElementById('serviceName').value.trim();
    var description = document.getElementById('serviceDescription').value.trim();
    var price = parseInt(document.getElementById('servicePrice').value);
    var duration = document.getElementById('serviceDuration').value.trim();
    var icon = document.getElementById('serviceIcon').value;
    
    if (!name || !price) {
        document.getElementById('serviceStatus').textContent = 'Please fill in Name and Price';
        document.getElementById('serviceStatus').style.color = '#c0392b';
        return;
    }
    
    await addService(name, description, price, duration, icon);
    
    document.getElementById('serviceStatus').textContent = '✅ Service added!';
    document.getElementById('serviceStatus').style.color = '#2b6e4f';
    
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceDescription').value = '';
    document.getElementById('servicePrice').value = '';
    document.getElementById('serviceDuration').value = '';
    
    await loadAllData();
});

// ====== GENERATE PIN ======
function generatePin() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var pin = '';
    for (var i = 0; i < 6; i++) {
        pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
}

// ====== DELETE FUNCTIONS ======
window.deleteImageItem = async function(id) {
    if (!confirm('Delete this image?')) return;
    await deleteImage(id);
    await loadAllData();
};

window.deleteVideoItem = async function(id) {
    if (!confirm('Delete this video?')) return;
    await deleteVideo(id);
    await loadAllData();
};

window.deleteServiceItem = async function(id) {
    if (!confirm('Delete this service?')) return;
    await deleteService(id);
    await loadAllData();
};

// ====== COPY FUNCTION ======
window.copyText = function(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            alert('Copied: ' + text);
        }).catch(function() {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
};

function fallbackCopy(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Copied: ' + text);
}

// ====== GENERATE PIN FOR USER ======
document.getElementById('generatePinBtn').addEventListener('click', function() {
    var userId = document.getElementById('pinUserId').value.trim();
    var duration = parseInt(document.getElementById('pinDuration').value) || 30;
    
    if (!userId) {
        alert('Please enter a User ID');
        return;
    }
    
    var pin = generatePin();
    
    var resultDiv = document.getElementById('generateResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color:#2b6e4f;">PIN Generated Successfully!</h4>
        <p><strong>User ID:</strong> ${userId}</p>
        <p><strong>PIN:</strong> <span style="font-size:1.5rem;font-weight:600;color:#d47a8a;">${pin}</span></p>
        <p><strong>Duration:</strong> ${duration} days</p>
        <button class="copy-btn" onclick="copyText('${pin}')"><i class="fas fa-copy"></i> Copy PIN</button>
        <br>
        <a href="https://wa.me/14049070581?text=Your%20PIN%20is%3A%20${pin}%20for%20User%20ID%3A%20${userId}" target="_blank" class="btn btn-whatsapp" style="margin-top:0.5rem;font-size:0.9rem;display:inline-flex;">
            <i class="fab fa-whatsapp"></i> Send PIN via WhatsApp
        </a>
    `;
});

// ====== REFRESH ======
document.getElementById('refreshImagesBtn').addEventListener('click', function() {
    loadAllData();
    this.innerHTML = '<i class="fas fa-check"></i> Refreshed';
    setTimeout(function() { 
        this.innerHTML = '<i class="fas fa-sync"></i> Refresh'; 
    }.bind(this), 1500);
});

document.getElementById('refreshVideosBtn').addEventListener('click', function() {
    loadAllData();
    this.innerHTML = '<i class="fas fa-check"></i> Refreshed';
    setTimeout(function() { 
        this.innerHTML = '<i class="fas fa-sync"></i> Refresh'; 
    }.bind(this), 1500);
});

document.getElementById('refreshUsersBtn').addEventListener('click', function() {
    loadAllData();
    this.innerHTML = '<i class="fas fa-check"></i> Refreshed';
    setTimeout(function() { 
        this.innerHTML = '<i class="fas fa-sync"></i> Refresh'; 
    }.bind(this), 1500);
});

document.getElementById('refreshServicesBtn').addEventListener('click', function() {
    loadAllData();
    this.innerHTML = '<i class="fas fa-check"></i> Refreshed';
    setTimeout(function() { 
        this.innerHTML = '<i class="fas fa-sync"></i> Refresh'; 
    }.bind(this), 1500);
});

// ====== INIT ======
checkSession();

console.log('✅ Admin connected to Supabase!');
console.log('🔑 Default login: admin / admin123');