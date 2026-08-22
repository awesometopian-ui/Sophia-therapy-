// ====== ADMIN.JS ======

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

// ====== LOAD DATA ======
var galleryItems = [];
var videoItems = [];
var users = [];
var services = [];

function loadAllData() {
    loadGallery();
    loadVideos();
    loadUsers();
    loadServices();
    renderStats();
}

function loadGallery() {
    var saved = localStorage.getItem('sophia_gallery');
    if (saved) {
        try { galleryItems = JSON.parse(saved); } catch(e) {}
    }
    renderImageList();
}

function loadVideos() {
    var saved = localStorage.getItem('sophia_videos');
    if (saved) {
        try { videoItems = JSON.parse(saved); } catch(e) {}
    }
    renderVideoList();
}

function loadUsers() {
    var saved = localStorage.getItem('sophia_users');
    if (saved) {
        try { users = JSON.parse(saved); } catch(e) {}
    }
    renderUsersList();
}

function loadServices() {
    var saved = localStorage.getItem('sophia_services');
    if (saved) {
        try { services = JSON.parse(saved); } catch(e) { services = []; }
    }
    renderServiceList();
}

function saveGallery() {
    localStorage.setItem('sophia_gallery', JSON.stringify(galleryItems));
    renderImageList();
    renderStats();
}

function saveVideos() {
    localStorage.setItem('sophia_videos', JSON.stringify(videoItems));
    renderVideoList();
    renderStats();
}

function saveServices() {
    localStorage.setItem('sophia_services', JSON.stringify(services));
    renderServiceList();
    renderStats();
}

function renderStats() {
    document.getElementById('totalImages').textContent = galleryItems.length;
    document.getElementById('totalVideos').textContent = videoItems.length;
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalServices').textContent = services.length;
    
    var active = 0;
    for (var i = 0; i < users.length; i++) {
        if (users[i].subscription && users[i].subscription.active) {
            var endDate = new Date(users[i].subscription.endDate);
            if (endDate > new Date()) active++;
        }
    }
    document.getElementById('activeSubs').textContent = active;
}

// ====== RENDER IMAGE LIST ======
function renderImageList() {
    var container = document.getElementById('imageList');
    if (!container) return;
    
    if (galleryItems.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No images uploaded yet.</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < galleryItems.length; i++) {
        var item = galleryItems[i];
        var pin = localStorage.getItem('sophia_pin_' + item.id) || 'N/A';
        var num = i + 1;
        html += `
            <div class="image-item">
                <img src="${item.src}" alt="${item.title}">
                <div class="info">
                    <div class="title">#${num} - ${item.title || 'Untitled'}</div>
                    <div class="details">Price: $${item.price} · ID: ${item.id}</div>
                    <div class="pin"><i class="fas fa-key"></i> PIN: <strong>${pin}</strong></div>
                </div>
                <div>
                    <button class="copy-btn" onclick="copyPin('${pin}')"><i class="fas fa-copy"></i></button>
                    <button class="btn-danger" onclick="deleteImage(${item.id})" style="padding:0.2rem 0.6rem;font-size:0.8rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ====== RENDER VIDEO LIST ======
function renderVideoList() {
    var container = document.getElementById('videoList');
    if (!container) return;
    
    if (videoItems.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No videos uploaded yet.</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < videoItems.length; i++) {
        var item = videoItems[i];
        var pin = localStorage.getItem('sophia_pin_' + item.id) || 'N/A';
        var num = i + 1;
        html += `
            <div class="video-item">
                <img src="${item.thumbnail || 'https://via.placeholder.com/60x60/8b3a4a/fff?text=Video'}" alt="${item.title}">
                <div class="info">
                    <div class="title">#${num} - ${item.title || 'Untitled'}</div>
                    <div class="details">Price: $${item.price} · ID: ${item.id}</div>
                    <div class="pin"><i class="fas fa-key"></i> PIN: <strong>${pin}</strong></div>
                </div>
                <div>
                    <button class="copy-btn" onclick="copyPin('${pin}')"><i class="fas fa-copy"></i></button>
                    <button class="btn-danger" onclick="deleteVideo(${item.id})" style="padding:0.2rem 0.6rem;font-size:0.8rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ====== RENDER SERVICES LIST ======
function renderServiceList() {
    var container = document.getElementById('serviceListAdmin');
    if (!container) return;
    
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
                    <button class="btn-danger" onclick="deleteService(${i})" style="padding:0.2rem 0.6rem;font-size:0.8rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ====== RENDER USERS LIST ======
function renderUsersList() {
    var container = document.getElementById('usersList');
    if (!container) return;
    
    if (users.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No users registered yet.</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var status = checkSubscriptionStatus(user.id);
        var statusClass = status.active ? 'active' : 'inactive';
        var statusText = status.active ? status.remainingDays + ' days left' : 'Inactive';
        
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

// ====== UPLOAD IMAGE ======
var imageUploadArea = document.getElementById('imageUploadArea');
var imageFileInput = document.getElementById('imageFileInput');
var imagePrice = document.getElementById('imagePrice');
var imageTitle = document.getElementById('imageTitle');
var imageUploadBtn = document.getElementById('imageUploadBtn');
var imageUploadStatus = document.getElementById('imageUploadStatus');

imageUploadArea.addEventListener('click', function() { imageFileInput.click(); });
imageUploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#d47a8a';
    this.style.background = '#fff5f7';
});
imageUploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.borderColor = '#f0b8c8';
    this.style.background = 'white';
});
imageUploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = '#f0b8c8';
    this.style.background = 'white';
    handleImageFiles(e.dataTransfer.files);
});
imageFileInput.addEventListener('change', function(e) { handleImageFiles(this.files); });

function handleImageFiles(files) {
    if (files.length === 0) return;
    var price = parseInt(imagePrice.value) || 5;
    if (price < 1) {
        imageUploadStatus.textContent = 'Price must be at least $1';
        imageUploadStatus.style.color = '#c0392b';
        return;
    }
    
    var uploaded = 0;
    imageUploadStatus.textContent = 'Uploading...';
    imageUploadStatus.style.color = '#d47a8a';
    
    for (var i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith('image/')) continue;
        var reader = new FileReader();
        reader.onload = function(e) {
            var title = imageTitle.value.trim() || file.name.slice(0, 30);
            var newItem = {
                id: Date.now() + Math.floor(Math.random() * 10000),
                src: e.target.result,
                price: price,
                title: title,
                date: new Date().toISOString()
            };
            galleryItems.push(newItem);
            var pin = generatePin();
            localStorage.setItem('sophia_pin_' + newItem.id, pin);
            uploaded++;
            if (uploaded === files.length) {
                saveGallery();
                imageUploadStatus.innerHTML = 'Uploaded ' + uploaded + ' image(s)! PIN: <strong>' + pin + '</strong>';
                imageUploadStatus.style.color = '#2b6e4f';
                imageTitle.value = '';
                imageFileInput.value = '';
                alert('Upload successful!\n\nPIN: ' + pin + '\n\nCopy this PIN to share with customers.');
            }
        };
        reader.readAsDataURL(files[i]);
    }
}

imageUploadBtn.addEventListener('click', function() { imageUploadArea.click(); });

// ====== UPLOAD VIDEO ======
var videoUploadArea = document.getElementById('videoUploadArea');
var videoFileInput = document.getElementById('videoFileInput');
var videoPrice = document.getElementById('videoPrice');
var videoTitle = document.getElementById('videoTitle');
var videoUploadBtn = document.getElementById('videoUploadBtn');
var videoUploadStatus = document.getElementById('videoUploadStatus');

videoUploadArea.addEventListener('click', function() { videoFileInput.click(); });
videoUploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = '#d47a8a';
    this.style.background = '#fff5f7';
});
videoUploadArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.borderColor = '#f0b8c8';
    this.style.background = 'white';
});
videoUploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = '#f0b8c8';
    this.style.background = 'white';
    handleVideoFiles(e.dataTransfer.files);
});
videoFileInput.addEventListener('change', function(e) { handleVideoFiles(this.files); });

function handleVideoFiles(files) {
    if (files.length === 0) return;
    var price = parseInt(videoPrice.value) || 8;
    if (price < 1) {
        videoUploadStatus.textContent = 'Price must be at least $1';
        videoUploadStatus.style.color = '#c0392b';
        return;
    }
    
    var uploaded = 0;
    videoUploadStatus.textContent = 'Uploading...';
    videoUploadStatus.style.color = '#d47a8a';
    
    for (var i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith('video/')) continue;
        var reader = new FileReader();
        reader.onload = function(e) {
            var title = videoTitle.value.trim() || file.name.slice(0, 30);
            var newItem = {
                id: Date.now() + Math.floor(Math.random() * 10000),
                src: e.target.result,
                price: price,
                title: title,
                thumbnail: '',
                date: new Date().toISOString()
            };
            videoItems.push(newItem);
            var pin = generatePin();
            localStorage.setItem('sophia_pin_' + newItem.id, pin);
            uploaded++;
            if (uploaded === files.length) {
                saveVideos();
                videoUploadStatus.innerHTML = 'Uploaded ' + uploaded + ' video(s)! PIN: <strong>' + pin + '</strong>';
                videoUploadStatus.style.color = '#2b6e4f';
                videoTitle.value = '';
                videoFileInput.value = '';
                alert('Upload successful!\n\nPIN: ' + pin + '\n\nCopy this PIN to share with customers.');
            }
        };
        reader.readAsDataURL(files[i]);
    }
}

videoUploadBtn.addEventListener('click', function() { videoUploadArea.click(); });

// ====== ADD SERVICE ======
document.getElementById('addServiceBtn').addEventListener('click', function() {
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
    
    var newService = {
        name: name,
        description: description || 'Professional therapy service',
        price: price,
        duration: duration || '60 minutes',
        icon: icon || 'fas fa-star'
    };
    
    services.push(newService);
    saveServices();
    
    document.getElementById('serviceStatus').textContent = '✅ Service added!';
    document.getElementById('serviceStatus').style.color = '#2b6e4f';
    
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceDescription').value = '';
    document.getElementById('servicePrice').value = '';
    document.getElementById('serviceDuration').value = '';
    
    setTimeout(function() {
        document.getElementById('serviceStatus').textContent = '';
    }, 3000);
});

// ====== DELETE FUNCTIONS ======
window.deleteService = function(index) {
    if (!confirm('Delete this service?')) return;
    services.splice(index, 1);
    saveServices();
};

window.deleteImage = function(id) {
    if (!confirm('Delete this image?')) return;
    galleryItems = galleryItems.filter(function(item) { return item.id !== id; });
    localStorage.removeItem('sophia_pin_' + id);
    saveGallery();
    var unlocked = JSON.parse(localStorage.getItem('sophia_unlocked') || '{}');
    delete unlocked[id];
    localStorage.setItem('sophia_unlocked', JSON.stringify(unlocked));
};

window.deleteVideo = function(id) {
    if (!confirm('Delete this video?')) return;
    videoItems = videoItems.filter(function(item) { return item.id !== id; });
    localStorage.removeItem('sophia_pin_' + id);
    saveVideos();
    var unlocked = JSON.parse(localStorage.getItem('sophia_unlocked') || '{}');
    delete unlocked[id];
    localStorage.setItem('sophia_unlocked', JSON.stringify(unlocked));
};

// ====== GENERATE PIN ======
function generatePin() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var pin = '';
    for (var i = 0; i < 6; i++) {
        pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
}

// ====== GENERATE PIN FOR USER ======
document.getElementById('generatePinBtn').addEventListener('click', function() {
    var userId = document.getElementById('pinUserId').value.trim();
    var contentType = document.getElementById('pinContentType').value;
    var duration = parseInt(document.getElementById('pinDuration').value) || 30;
    
    if (!userId) {
        alert('Please enter a User ID');
        return;
    }
    
    var pin = generatePin();
    
    var usersData = JSON.parse(localStorage.getItem('sophia_users') || '[]');
    var userFound = false;
    for (var i = 0; i < usersData.length; i++) {
        if (usersData[i].id === userId) {
            userFound = true;
            var startDate = new Date();
            var endDate = new Date();
            endDate.setDate(endDate.getDate() + duration);
            usersData[i].subscription = {
                active: true,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                type: 'monthly'
            };
            break;
        }
    }
    
    if (!userFound) {
        alert('User not found. Please check the ID.');
        return;
    }
    
    localStorage.setItem('sophia_users', JSON.stringify(usersData));
    
    if (contentType === 'all' || contentType === 'image') {
        for (var j = 0; j < galleryItems.length; j++) {
            localStorage.setItem('sophia_pin_' + galleryItems[j].id, pin);
        }
    }
    if (contentType === 'all' || contentType === 'video') {
        for (var k = 0; k < videoItems.length; k++) {
            localStorage.setItem('sophia_pin_' + videoItems[k].id, pin);
        }
    }
    
    var resultDiv = document.getElementById('generateResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h4 style="color:#2b6e4f;">PIN Generated Successfully!</h4>
        <p><strong>User:</strong> ${userId}</p>
        <p><strong>PIN:</strong> <span style="font-size:1.5rem;font-weight:600;color:#d47a8a;">${pin}</span></p>
        <p><strong>Duration:</strong> ${duration} days</p>
        <p><strong>Content:</strong> ${contentType}</p>
        <button class="copy-btn" onclick="copyText('${pin}')"><i class="fas fa-copy"></i> Copy PIN</button>
        <br>
        <a href="https://wa.me/14049070581?text=Your%20PIN%20is%3A%20${pin}%20for%20User%20ID%3A%20${userId}" target="_blank" class="btn btn-whatsapp" style="margin-top:0.5rem;font-size:0.9rem;display:inline-flex;">
            <i class="fab fa-whatsapp"></i> Send PIN via WhatsApp
        </a>
    `;
});

// ====== COPY FUNCTION ======
window.copyPin = function(pin) {
    copyText(pin);
};

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

console.log('✅ Admin Panel Ready!');
console.log('🔑 Default login: admin / admin123');
