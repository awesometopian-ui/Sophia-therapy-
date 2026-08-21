// ====== MAIN SITE LOGIC ======

let galleryItems = [];
let videoItems = [];
let unlockCodes = {};

// ====== NAVIGATION ======
const navLinks = document.querySelectorAll('.nav-links a');
const pages = {
    home: document.getElementById('page-home'),
    services: document.getElementById('page-services'),
    gallery: document.getElementById('page-gallery'),
    videos: document.getElementById('page-videos'),
    account: document.getElementById('page-account')
};

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        Object.keys(pages).forEach(key => {
            pages[key].classList.toggle('active', key === page);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (page === 'account') loadAccountPage();
        if (page === 'gallery') renderGallery();
        if (page === 'videos') renderVideos();
    });
});

document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', function(e) {
        if (this.dataset.page) {
            e.preventDefault();
            const page = this.dataset.page;
            navLinks.forEach(l => {
                l.classList.toggle('active', l.dataset.page === page);
            });
            Object.keys(pages).forEach(key => {
                pages[key].classList.toggle('active', key === page);
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (page === 'account') loadAccountPage();
            if (page === 'gallery') renderGallery();
            if (page === 'videos') renderVideos();
        }
    });
});

// ====== LOAD CONTENT ======
function loadGallery() {
    const saved = localStorage.getItem('sophia_gallery');
    if (saved) {
        try { galleryItems = JSON.parse(saved); } catch(e) {}
    }
}

function loadVideos() {
    const saved = localStorage.getItem('sophia_videos');
    if (saved) {
        try { videoItems = JSON.parse(saved); } catch(e) {}
    }
}

function loadUnlocked() {
    const saved = localStorage.getItem('sophia_unlocked');
    if (saved) {
        try { unlockCodes = JSON.parse(saved); } catch(e) {}
    }
}

// ====== RENDER GALLERY ======
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (galleryItems.length === 0) {
        grid.innerHTML = '<p style="color:#8a7b6b;text-align:center;padding:2rem;">No images available yet.</p>';
        return;
    }
    
    const currentUser = getCurrentUser();
    const hasSubscription = currentUser ? checkSubscriptionStatus(currentUser.id).active : false;
    
    galleryItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.id = item.id;
        
        const isUnlocked = hasSubscription || unlockCodes[item.id] === true;
        
        div.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            ${!isUnlocked ? `
                <div class="lock-overlay">
                    <i class="fas fa-lock"></i>
                    <span class="price-tag">$${item.price}</span>
                    <button class="unlock-btn" data-id="${item.id}" data-type="image"><i class="fas fa-unlock"></i> Unlock</button>
                </div>
            ` : ''}
        `;
        if (isUnlocked) div.classList.add('unlocked');
        grid.appendChild(div);
    });
    
    document.querySelectorAll('.unlock-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            openUnlockModal(id, type);
        });
    });
}

// ====== RENDER VIDEOS ======
function renderVideos() {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (videoItems.length === 0) {
        grid.innerHTML = '<p style="color:#8a7b6b;text-align:center;padding:2rem;">No videos available yet.</p>';
        return;
    }
    
    const currentUser = getCurrentUser();
    const hasSubscription = currentUser ? checkSubscriptionStatus(currentUser.id).active : false;
    
    videoItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'video-item';
        div.dataset.id = item.id;
        
        const isUnlocked = hasSubscription || unlockCodes[item.id] === true;
        
        div.innerHTML = `
            <video src="${item.src}" poster="${item.thumbnail || ''}" preload="metadata"></video>
            <div class="play-icon"><i class="fas fa-play-circle"></i></div>
            ${!isUnlocked ? `
                <div class="lock-overlay">
                    <i class="fas fa-lock"></i>
                    <span class="price-tag">$${item.price}</span>
                    <button class="unlock-btn" data-id="${item.id}" data-type="video"><i class="fas fa-unlock"></i> Unlock</button>
                </div>
            ` : ''}
        `;
        if (isUnlocked) div.classList.add('unlocked');
        grid.appendChild(div);
    });
    
    document.querySelectorAll('.unlock-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            openUnlockModal(id, type);
        });
    });
}

// ====== UNLOCK MODAL ======
const modal = document.getElementById('unlockModal');
const modalClose = document.getElementById('modalClose');
const modalPrice = document.getElementById('modalPrice');
const unlockCodeInput = document.getElementById('unlockCodeInput');
const unlockCodeBtn = document.getElementById('unlockCodeBtn');
const unlockMessage = document.getElementById('unlockMessage');
const whatsappUnlockBtn = document.getElementById('whatsappUnlockBtn');
let currentUnlockId = null;
let currentUnlockType = null;

function openUnlockModal(id, type) {
    currentUnlockId = id;
    currentUnlockType = type;
    
    let item = null;
    if (type === 'image') {
        item = galleryItems.find(i => i.id === id);
    } else if (type === 'video') {
        item = videoItems.find(i => i.id === id);
    }
    
    if (item) {
        modalPrice.textContent = '$' + item.price + '.00';
    }
    
    // Update WhatsApp link with user ID
    const currentUser = getCurrentUser();
    if (currentUser) {
        whatsappUnlockBtn.href = `https://wa.me/14049070581?text=I%20want%20to%20unlock%20content%20-%20My%20ID%3A%20${currentUser.id}%20-%20Content%20ID%3A%20${id}`;
    } else {
        whatsappUnlockBtn.href = 'https://wa.me/14049070581?text=I%20want%20to%20unlock%20content';
    }
    
    unlockCodeInput.value = '';
    unlockMessage.textContent = '';
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    currentUnlockId = null;
    currentUnlockType = null;
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

unlockCodeBtn.addEventListener('click', function() {
    const code = unlockCodeInput.value.trim().toUpperCase();
    if (!code || code.length < 4) {
        unlockMessage.textContent = 'Please enter a valid PIN';
        unlockMessage.style.color = '#c0392b';
        return;
    }
    if (currentUnlockId === null) {
        unlockMessage.textContent = 'No content selected';
        unlockMessage.style.color = '#c0392b';
        return;
    }
    
    const storedCode = localStorage.getItem(`sophia_pin_${currentUnlockId}`);
    if (storedCode && storedCode.toUpperCase() === code) {
        unlockCodes[currentUnlockId] = true;
        localStorage.setItem('sophia_unlocked', JSON.stringify(unlockCodes));
        
        // Also unlock in user account
        const currentUser = getCurrentUser();
        if (currentUser) {
            unlockContent(currentUser.id, currentUnlockId, currentUnlockType);
        }
        
        unlockMessage.textContent = 'Content unlocked successfully!';
        unlockMessage.style.color = '#2b6e4f';
        setTimeout(() => {
            closeModal();
            renderGallery();
            renderVideos();
        }, 1200);
    } else {
        unlockMessage.textContent = 'Invalid PIN. Contact WhatsApp for your PIN.';
        unlockMessage.style.color = '#c0392b';
    }
});

unlockCodeInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') unlockCodeBtn.click();
});

// ====== REGISTER MODAL ======
const registerModal = document.getElementById('registerModal');
const registerClose = document.getElementById('registerClose');
const registerBtn = document.getElementById('registerBtn');
const regName = document.getElementById('regName');
const regEmail = document.getElementById('regEmail');
const regPhone = document.getElementById('regPhone');
const registerMessage = document.getElementById('registerMessage');

function showRegister() {
    registerModal.classList.add('active');
    registerMessage.textContent = '';
}

registerClose.addEventListener('click', function() {
    registerModal.classList.remove('active');
});
registerModal.addEventListener('click', function(e) {
    if (e.target === this) registerModal.classList.remove('active');
});

registerBtn.addEventListener('click', function() {
    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const phone = regPhone.value.trim();
    
    if (!name || !email || !phone) {
        registerMessage.textContent = 'Please fill in all fields';
        registerMessage.style.color = '#c0392b';
        return;
    }
    
    const result = registerUser(name, email, phone);
    if (result.success) {
        registerMessage.textContent = '✅ Account created! Your ID: ' + result.user.id;
        registerMessage.style.color = '#2b6e4f';
        regName.value = '';
        regEmail.value = '';
        regPhone.value = '';
        setTimeout(() => {
            registerModal.classList.remove('active');
            loadAccountPage();
        }, 2000);
    } else {
        registerMessage.textContent = result.message;
        registerMessage.style.color = '#c0392b';
    }
});

// ====== ACCOUNT PAGE ======
function loadAccountPage() {
    const container = document.getElementById('accountContent');
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        container.innerHTML = `
            <div class="account-card" style="text-align:center;">
                <i class="fas fa-user-circle" style="font-size:4rem;color:#d47a8a;margin-bottom:1rem;"></i>
                <h3>Not Logged In</h3>
                <p style="color:#8a7b6b;margin:0.5rem 0;">Create an account to get your unique ID and access premium content.</p>
                <button class="btn" onclick="showRegister()" style="margin-top:0.5rem;">Create Account</button>
            </div>
        `;
        return;
    }
    
    const status = checkSubscriptionStatus(currentUser.id);
    
    let statusHtml = '';
    let timerHtml = '';
    
    if (status.active) {
        statusHtml = `<span class="status active">Active</span>`;
        timerHtml = `
            <div class="timer">
                ${status.remainingDays} days remaining
            </div>
            <p style="text-align:center;color:#8a7b6b;font-size:0.9rem;">
                Valid until: ${new Date(status.endDate).toLocaleDateString()}
            </p>
        `;
    } else {
        statusHtml = `<span class="status inactive">Inactive</span>`;
        timerHtml = `
            <div class="timer" style="color:#c0392b;">
                No Active Subscription
            </div>
            <p style="text-align:center;color:#8a7b6b;font-size:0.9rem;">
                Subscribe to unlock all content
            </p>
            <div style="text-align:center;margin-top:1rem;">
                <button class="btn" onclick="document.querySelector('[data-page=home]').click();">View Plans</button>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="account-card">
            <h3 style="text-align:center;">My Account</h3>
            <div class="user-id">
                <i class="fas fa-id-card"></i> Your ID: ${currentUser.id}
                <button class="copy-btn" onclick="copyText('${currentUser.id}')" style="margin-left:0.5rem;">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <p><strong>Name:</strong> ${currentUser.name}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Phone:</strong> ${currentUser.phone}</p>
            <p><strong>Status:</strong> ${statusHtml}</p>
            <hr style="margin:1rem 0;">
            ${timerHtml}
            <hr style="margin:1rem 0;">
            <p style="font-size:0.85rem;color:#8a7b6b;text-align:center;">
                <i class="fas fa-info-circle"></i> Share your ID with admin to get your unlock PIN
            </p>
            <div style="text-align:center;margin-top:0.5rem;">
                <a href="https://wa.me/14049070581?text=My%20ID%20is%3A%20${currentUser.id}" target="_blank" class="btn btn-whatsapp" style="font-size:0.9rem;">
                    <i class="fab fa-whatsapp"></i> Contact Admin
                </a>
                <button class="btn" onclick="logoutUser(); loadAccountPage();" style="font-size:0.9rem;background:#8a7b6b;margin-left:0.5rem;">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    `;
}

function copyText(text) {
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
}

// ====== INIT ======
loadGallery();
loadVideos();
loadUnlocked();

// Check if user is logged in
const currentUser = getCurrentUser();
if (currentUser) {
    // Check subscription status
    const status = checkSubscriptionStatus(currentUser.id);
    if (!status.active) {
        // Clean up
    }
}

// Listen for storage changes
window.addEventListener('storage', function(e) {
    if (e.key === 'sophia_gallery') { loadGallery(); renderGallery(); }
    if (e.key === 'sophia_videos') { loadVideos(); renderVideos(); }
    if (e.key === 'sophia_unlocked') { loadUnlocked(); renderGallery(); renderVideos(); }
    if (e.key === 'sophia_current_user') { loadAccountPage(); }
});

console.log('Sophia Therapy · Ready');
console.log('Contact: +1 (404) 907-0581');