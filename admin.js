// ====== ADMIN LOGIC ======

// ====== LOGIN ======
const loginScreen = document.getElementById('loginScreen');
const adminPanel = document.getElementById('adminPanel');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

function checkSession() {
    const loggedIn = localStorage.getItem('sophia_admin_loggedin');
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
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
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
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.getElementById('tab-' + this.dataset.tab).classList.add('active');
    });
});

// ====== LOAD DATA ======
let galleryItems = [];
let videoItems = [];
let users = [];
let services = [];

function loadAllData() {
    loadGallery();
    loadVideos();
    loadUsers();
    loadServices();
    renderStats();
}

function loadGallery() {
    const saved = localStorage.getItem('sophia_gallery');
    if (saved) {
        try { galleryItems = JSON.parse(saved); } catch(e) {}
    }
    renderImageList();
}

function loadVideos() {
    const saved = localStorage.getItem('sophia_videos');
    if (saved) {
        try { videoItems = JSON.parse(saved); } catch(e) {}
    }
    renderVideoList();
}

function loadUsers() {
    const saved = localStorage.getItem('sophia_users');
    if (saved) {
        try { users = JSON.parse(saved); } catch(e) {}
    }
    renderUsersList();
}

function loadServices() {
    const saved = localStorage.getItem('sophia_services');
    if (saved) {
        try { services = JSON.parse(saved); } catch(e) { services = []; }
    } else {
        services = [
            { name: 'Therapeutic Massage', description: 'Deep tissue and relaxation massage tailored to your needs.', price: 120, duration: '60-90 minutes', icon: 'fas fa-hand-holding-heart' },
            { name: 'Craniosacral Therapy', description: 'Gentle hands-on therapy for the central nervous system.', price: 150, duration: '60 minutes', icon: 'fas fa-user-md' },
            { name: 'Aromatherapy & Energy Balance', description: 'Essential oils and energy healing for complete wellness.', price: 100, duration: '45-60 minutes', icon: 'fas fa-leaf' },
            { name: 'In-House Session', description: 'We come to your location for a personalized session.', price: 180, duration: '60-90 minutes', icon: 'fas fa-house-chimney' },
            { name: 'Home Delivery Kit', description: 'Therapy kit delivered to your door with remote guidance.', price: 60, duration: 'Self-guided', icon: 'fas fa-truck' },
            { name: 'Video Therapy Session', description: 'Remote therapy session via video call.', price: 90, duration: '45 minutes', icon: 'fas fa-video' }
        ];
        localStorage.setItem('sophia_services', JSON.stringify(services));
    }
    renderServiceList();
}

function saveGallery() {
    localStorage.setItem('sophia_gallery', JSON.stringify(galleryItems));
    renderImageList();
    renderStats();
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'sophia_gallery',
        newValue: JSON.stringify(galleryItems)
    }));
}

function saveVideos() {
    localStorage.setItem('sophia_videos', JSON.stringify(videoItems));
    renderVideoList();
    renderStats();
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'sophia_videos',
        newValue: JSON.stringify(videoItems)
    }));
}

function saveServices() {
    localStorage.setItem('sophia_services', JSON.stringify(services));
    renderServiceList();
    renderStats();
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'sophia_services',
        newValue: JSON.stringify(services)
    }));
}

function renderStats() {
    document.getElementById('totalImages').textContent = galleryItems.length;
    document.getElementById('totalVideos').textContent = videoItems.length;
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalServices').textContent = services.length;
    
    let active = 0;
    users.forEach(user => {
        if (user.subscription && user.subscription.active) {
            const endDate = new Date(user.subscription.endDate);
            if (endDate > new Date()) active++;
        }
    });
    document.getElementById('activeSubs').textContent = active;
}

// ====== RENDER IMAGE LIST ======
function renderImageList() {
    const container = document.getElementById('imageList');
    if (!container) return;
    
    if (galleryItems.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No images uploaded yet.</p>';
        return;
    }
    
    let html = '';
    galleryItems.forEach((item, index) => {
        const pin = localStorage.getItem(`sophia_pin_${item.id}`) || 'N/A';
        html += `
            <div class="image-item">
                <img src="${item.src}" alt="${item.title}">
                <div class="info">
                    <div class="title">#${index + 1} - ${item.title || 'Untitled'}</div>
                    <div class="details">Price: $${item.price} · ID: ${item.id}</div>
                    <div class="pin"><i class="fas fa-key"></i> PIN: <strong>${pin}</strong></div>
                </div>
                <div>
                    <button class="copy-btn" onclick="copyPin('${pin}')"><i class="fas fa-copy"></i></button>
                    <button class="btn-danger" onclick="deleteImage(${item.id})" style="padding:0.2rem 0.6rem;font-size:0.8rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ====== RENDER VIDEO LIST ======
function renderVideoList() {
    const container = document.getElementById('videoList');
    if (!container) return;
    
    if (videoItems.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No videos uploaded yet.</p>';
        return;
    }
    
    let html = '';
    videoItems.forEach((item, index) => {
        const pin = localStorage.getItem(`sophia_pin_${item.id}`) || 'N/A';
        html += `
            <div class="video-item">
                <img src="${item.thumbnail || 'https://via.placeholder.com/60x60/8b3a4a/fff?text=Video'}" alt="${item.title}">
                <div class="info">
                    <div class="title">#${index + 1} - ${item.title || 'Untitled'}</div>
                    <div class="details">Price: $${item.price} · ID: ${item.id}</div>
                    <div class="pin"><i class="fas fa-key"></i> PIN: <strong>${pin}</strong></div>
                </div>
                <div>
                    <button class="copy-btn" onclick="copyPin('${pin}')"><i class="fas fa-copy"></i></button>
                    <button class="btn-danger" onclick="deleteVideo(${item.id})" style="padding:0.2rem 0.6rem;font-size:0.8rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ====== RENDER SERVICES LIST ======
function renderServiceList() {
    const container = document.getElementById('serviceListAdmin');
    if (!container) return;
    
    if (services.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No services added yet.</p>';
        return;
    }
    
    let html = '';
    services.forEach((service, index) => {
        html += `
            <div class="service-item">
                <div class="service-icon"><i class="${service.icon || 'fas fa-star'}"></i></div>
                <div class="info">
                    <div class="name">#${index + 1} - ${service.name}</div>
                    <div class="desc">${service.description || 'No description'}</div>
                    <div><span class="price">$${service.price}</span> · <span class="duration">${service.duration || 'N/A'}</span></div>
                </div>
                <div>
                    <button class="btn-danger" onclick="deleteService(${index})" style="padding:0.2rem 0.6rem;font-size:0.8rem;"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ====== RENDER USERS LIST ======
function renderUsersList() {
    const container = document.getElementById('usersList');
    if (!container) return;
    
    if (users.length === 0) {
        container.innerHTML = '<p style="color:#d47a8a;text-align:center;padding:1rem;">No users registered yet.</p>';
        return;
    }
    
    let html = '';
    users.forEach(user => {
        const status = checkSubscriptionStatus(user.id);
        const statusClass = status.active ? 'active' : 'inactive';
        const statusText = status.active ? `${status.remainingDays} days left` : 'Inactive';
        
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
    });
    container.innerHTML = html;
}

// ====== UPLOAD IMAGE ======
const imageUploadArea = document.getElementById('imageUploadArea');
const imageFileInput = document.getElementById('imageFileInput');
const imagePrice = document.getElementById('imagePrice');
const imageTitle = document.getElementById('imageTitle');
const imageUploadBtn = document.getElementById('imageUploadBtn');
const imageUploadStatus = document.getElementById('imageUploadStatus');

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
    const price = parseInt(imagePrice.value) || 5;
    if (price < 1) {
        imageUploadStatus.textContent = 'Price must be at least $1';
        imageUploadStatus.style.color = '#c0392b';
        return;
    }
    
    let uploaded = 0;
    imageUploadStatus.textContent = 'Uploading...';
    imageUploadStatus.style.color = '#d47a8a';
    
    for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        const reader = new FileReader();
        reader.onload = function(e) {
            const title = imageTitle.value.trim() || file.name.slice(0, 30);
            const newItem = {
                id: Date.now() + Math.floor(Math.random() * 10000),
                src: e.target.result,
                price: price,
                title: title,
                date: new Date().toISOString()
            };
            galleryItems.push(newItem);
            const pin = generatePin();
            localStorage.setItem(`sophia_pin_${newItem.id}`, pin);
            uploaded++;
            if (uploaded === files.length) {
                saveGallery();
                imageUploadStatus.innerHTML = `Uploaded ${uploaded} image(s)! PIN: <strong>${pin}</strong>`;
                imageUploadStatus.style.color = '#2b6e4f';
                imageTitle.value = '';
                imageFileInput.value = '';
                let allPins = '';
                galleryItems.forEach(item => {
                    const p = localStorage.getItem(`sophia_pin_${item.id}`);
                    allPins += `Image #${galleryItems.indexOf(item)+1}: ${p}\n`;
                });
                alert(`Upload successful!\n\n${uploaded} image(s) uploaded.\n\nPINs:\n${allPins}`);
            }
        };
        reader.readAsDataURL(file);
    }
}

imageUploadBtn.addEventListener('click', function() { imageUploadArea.click(); });

// ====== UPLOAD VIDEO ======
const videoUploadArea = document.getElementById('videoUploadArea');
const videoFileInput = document.getElementById('videoFileInput');
const videoPrice = document.getElementById('videoPrice');
const videoTitle = document.getElementById('videoTitle');
const videoUploadBtn = document.getElementById('videoUploadBtn');
const videoUploadStatus = document.getElementById('videoUploadStatus');

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
    const price = parseInt(videoPrice.value) || 8;
    if (price < 1) {
        videoUploadStatus.textContent = 'Price must be at least $1';
        videoUploadStatus.style.color = '#c0392b';
        return;
    }
    
    let uploaded = 0;
    videoUploadStatus.textContent = 'Uploading...';
    videoUploadStatus.style.color = '#d47a8a';
    
    for (const file of files) {
        if (!file.type.startsWith('video/')) continue;
        const reader = new FileReader();
        reader.onload = function(e) {
            const title = videoTitle.value.trim() || file.name.slice(0, 30);
            const newItem = {
                id: Date.now() + Math.floor(Math.random() * 10000),
                src: e.target.result,
                price: price,
                title: title,
                thumbnail: '',
                date: new Date().toISOString()
            };
            videoItems.push(newItem);
            const pin = generatePin();
            localStorage.setItem(`sophia_pin_${newItem.id}`, pin);
            uploaded++;
            if (uploaded === files.length) {
                saveVideos();
                videoUploadStatus.innerHTML = `Uploaded ${uploaded} video(s)! PIN: <strong>${pin}</strong>`;
                videoUploadStatus.style.color = '#2b6e4f';
                videoTitle.value = '';
                videoFileInput.value = '';
                let allPins = '';
                videoItems.forEach(item => {
                    const p = localStorage.getItem(`sophia_pin_${item.id}`);
                    allPins += `Video #${videoItems.indexOf(item)+1}: ${p}\n`;
                });
                alert(`Upload successful!\n\n${uploaded} video(s) uploaded.\n\nPINs:\n${allPins}`);
            }
        };
        reader.readAsDataURL(file);
    }
}

videoUploadBtn.addEventListener('click', function() { videoUploadArea.click(); });

// ====== ADD SERVICE ======
document.getElementById('addServiceBtn').addEventListener('click', function() {
    const name = document.getElementById('serviceName').value.trim();
    const description = document.getElementById('serviceDescription').value.trim();
    const price = document.getElementById('servicePrice').value.trim();
    const duration = document.getElementById('serviceDuration').value.trim();
    const icon = document.getElementById('serviceIcon').value;
    
    if (!name || !price) {
        document.getElementById('serviceStatus').textContent = 'Please fill in Name and Price';
        document.getElementById('serviceStatus').style.color = '#c0392b';
        return;
    }
    
    const newService = {
        name: name,
        description: description || 'Professional therapy service',
        price: parseFloat(price),
        duration: duration || '60 minutes',
        icon: icon || 'fas fa-star'
    };
    
    services.push(newService);
    saveServices();
    
    document.getElementById('serviceStatus').textContent = 'Service added successfully!';
    document.getElementById('serviceStatus').style.color = '#2b6e4f';
    
    document.getElementById('serviceName').value = '';
    document.getElementById('serviceDescription').value = '';
    document.getElementById('servicePrice').value = '';
    document.getElementById('serviceDuration').value = '';
    
    setTimeout(() => {
        document.getElementById('serviceStatus').textContent = '';
    }, 3000);
});

// ====== DELETE SERVICE ======
window.deleteService = function(index) {
    if (!confirm('Delete this service?')) return;
    services.splice(index, 1);
    saveServices();
};

// ====== GENERATE PIN ======
function generatePin() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pin = '';
    for (let i = 0; i < 6; i++) {
        pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
}

// ====== GENERATE PIN FOR USER ======
document.getElementById('generatePinBtn').addEventListener('click', function() {
    const userId = document.getElementById('pinUserId').value.trim();
    const contentType = document.getElementById('pinContentType').value;
    const duration = parseInt(document.getElementById('pinDuration').value) || 30;
    
    if (!userId) {
        alert('Please enter a User ID');
        return;
    }
    
    const usersData = JSON.parse(localStorage.getItem('sophia_users') || '[]');
    const user = usersData.find(u => u.id === userId);
    if (!user) {
        alert('User not found. Please check the ID.');
        return;
    }
    
    const pin = generatePin();
    
    const result = updateUserSubscription(userId, duration, 'monthly');
    if (result.success) {
        localStorage.setItem(`sophia_user_pin_${userId}`, pin);
        
        if (contentType === 'all' || contentType === 'image') {
            galleryItems.forEach(item => {
                localStorage.setItem(`sophia_pin_${item.id}`, pin);
            });
        }
        if (contentType === 'all' || contentType === 'video') {
            videoItems.forEach(item => {
                localStorage.setItem(`sophia_pin_${item.id}`, pin);
            });
        }
        
        const resultDiv = document.getElementById('generateResult');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h4 style="color:#2b6e4f;">PIN Generated Successfully!</h4>
            <p><strong>User:</strong> ${user.name} (${user.id})</p>
            <p><strong>PIN:</strong> <span style="font-size:1.5rem;font-weight:600;color:#d47a8a;">${pin}</span></p>
            <p><strong>Duration:</strong> ${duration} days</p>
            <p><strong>Content:</strong> ${contentType}</p>
            <button class="copy-btn" onclick="copyText('${pin}')"><i class="fas fa-copy"></i> Copy PIN</button>
            <br>
            <a href="https://wa.me/14049070581?text=Your%20PIN%20is%3A%20${pin}%20for%20User%20ID%3A%20${userId}" target="_blank" class="btn btn-whatsapp" style="margin-top:0.5rem;font-size:0.9rem;display:inline-flex;">
                <i class="fab fa-whatsapp"></i> Send PIN via WhatsApp
            </a>
        `;
        
        loadAllData();
    } else {
        alert(result.message);
    }
});

// ====== COPY FUNCTIONS ======
window.copyPin = function(pin) {
    copyText(pin);
};

window.copyText = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied: ' + text);
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Copied: ' + text);
    });
};

// ====== DELETE FUNCTIONS ======
window.deleteImage = function(id) {
    if (!confirm('Delete this image?')) return;
    galleryItems = galleryItems.filter(item => item.id !== id);
    localStorage.removeItem(`sophia_pin_${id}`);
    saveGallery();
    const unlocked = JSON.parse(localStorage.getItem('sophia_unlocked') || '{}');
    delete unlocked[id];
    localStorage.setItem('sophia_unlocked', JSON.stringify(unlocked));
};

window.deleteVideo = function(id) {
    if (!confirm('Delete this video?')) return;
    videoItems = videoItems.filter(item => item.id !== id);
    localStorage.removeItem(`sophia_pin_${id}`);
    saveVideos();
    const unlocked = JSON.parse(localStorage.getItem('sophia_unlocked') || '{}');
    delete unlocked[id];
    localStorage.setItem('sophia_unlocked', JSON.stringify(unlocked));
};

// ====== REFRESH ======
document.getElementById('refreshImagesBtn').addEventListener('click', function() {
    loadGallery();
    this.innerHTML = '<i class="fas fa-check"></i> Refreshed';
    setTimeout(() => { this.innerHTML = '<i class="fas fa-sync"></i> Refresh'; }, 1500);
});

document.getElementById('refreshVideosBtn').addEventListener('click', function() {
    loadVideos();
    this.innerHTML = '<i class="fas fa-check"></i> Refreshed';
    setTimeout(() => { this.innerHTML = '<i class="fas fa-sync"></i> Refresh'; }, 1500);
});

document.getElementById('refreshUsersBtn').addEventListener('click', function() {
    loadUsers();
    this.innerHTML = '<i class="fas fa-check"></i> Refreshed';
    setTimeout(() => { this.innerHTML = '<i class="fas fa-sync"></i> Refresh'; }, 1500);
});

document.getElementById('refreshServicesBtn').addEventListener('click', function() {
    loadServices();
    this.innerHTML = '<i class="fas fa-check"></i> Refreshed';
    setTimeout(() => { this.innerHTML = '<i class="fas fa-sync"></i> Refresh'; }, 1500);
});

// ====== INIT ======
checkSession();

console.log('Admin Panel · Ready');
console.log('Default login: admin / admin123');
```