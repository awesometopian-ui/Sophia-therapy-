// ====== COMPLETE SCRIPT.JS WITH ALL DATA ======

var galleryItems = [];
var videoItems = [];
var unlockCodes = {};
var services = [];

// ====== DEFAULT SERVICES ======
function getDefaultServices() {
    return [
        {
            name: 'Elite Wellness Rituals',
            description: 'Premium 80-minute "Emba" Ayurvedic massage with hot stones. Includes organic essential oil wraps, full-body integration, and luxury amenities.',
            price: 800,
            duration: '80 minutes',
            icon: 'fas fa-gem'
        },
        {
            name: 'Amangiri Spa Experience',
            description: 'Signature 80-minute Ayurvedic massage with hot stone therapy. Includes full-day access to whirlpools, mist rooms, and vanity amenities.',
            price: 800,
            duration: '80 minutes',
            icon: 'fas fa-sun'
        },
        {
            name: 'Standard Therapeutic Studio',
            description: '60-90 minute targeted deep tissue or Swedish relaxation massage. Focuses on trigger-point therapy, stretching, and physical wellness.',
            price: 150,
            duration: '60-90 minutes',
            icon: 'fas fa-hand-holding-heart'
        },
        {
            name: 'SoJo Spa Club Experience',
            description: '60-minute classic Swedish massage. Includes access to outdoor infinity pools, volcanic sand baths, rooftop saunas, and multi-story bathhouse.',
            price: 150,
            duration: '60 minutes',
            icon: 'fas fa-water'
        }
    ];
}

// ====== DEFAULT IMAGES (10 Images) ======
function getDefaultImages() {
    return [
        { id: 1, src: 'https://picsum.photos/400/400?random=1', price: 5, title: 'Relaxation Session' },
        { id: 2, src: 'https://picsum.photos/400/400?random=2', price: 8, title: 'Deep Tissue Massage' },
        { id: 3, src: 'https://picsum.photos/400/400?random=3', price: 6, title: 'Aromatherapy' },
        { id: 4, src: 'https://picsum.photos/400/400?random=4', price: 10, title: 'Craniosacral Therapy' },
        { id: 5, src: 'https://picsum.photos/400/400?random=5', price: 7, title: 'Energy Balance' },
        { id: 6, src: 'https://picsum.photos/400/400?random=6', price: 5, title: 'Hot Stone Massage' },
        { id: 7, src: 'https://picsum.photos/400/400?random=7', price: 9, title: 'Swedish Massage' },
        { id: 8, src: 'https://picsum.photos/400/400?random=8', price: 6, title: 'Reflexology' },
        { id: 9, src: 'https://picsum.photos/400/400?random=9', price: 7, title: 'Thai Massage' },
        { id: 10, src: 'https://picsum.photos/400/400?random=10', price: 8, title: 'Lymphatic Drainage' }
    ];
}

// ====== DEFAULT VIDEOS (4 Videos) ======
function getDefaultVideos() {
    return [
        { id: 1, src: 'https://www.w3schools.com/html/mov_bbb.mp4', price: 8, title: 'Massage Tutorial', thumbnail: '' },
        { id: 2, src: 'https://www.w3schools.com/html/mov_bbb.mp4', price: 6, title: 'Relaxation Guide', thumbnail: '' },
        { id: 3, src: 'https://www.w3schools.com/html/mov_bbb.mp4', price: 10, title: 'Advanced Techniques', thumbnail: '' },
        { id: 4, src: 'https://www.w3schools.com/html/mov_bbb.mp4', price: 7, title: 'Wellness Routine', thumbnail: '' }
    ];
}

// ====== PIN GENERATION ======
function generatePin() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var pin = '';
    for (var i = 0; i < 6; i++) {
        pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
}

// ====== LOAD DATA FROM LOCALSTORAGE (or use defaults) ======
function loadGallery() {
    var saved = localStorage.getItem('sophia_gallery');
    if (saved) {
        try { galleryItems = JSON.parse(saved); } catch(e) {}
    }
    if (!galleryItems || galleryItems.length === 0) {
        galleryItems = getDefaultImages();
        localStorage.setItem('sophia_gallery', JSON.stringify(galleryItems));
    }
}

function loadVideos() {
    var saved = localStorage.getItem('sophia_videos');
    if (saved) {
        try { videoItems = JSON.parse(saved); } catch(e) {}
    }
    if (!videoItems || videoItems.length === 0) {
        videoItems = getDefaultVideos();
        localStorage.setItem('sophia_videos', JSON.stringify(videoItems));
    }
}

function loadUnlocked() {
    var saved = localStorage.getItem('sophia_unlocked');
    if (saved) {
        try { unlockCodes = JSON.parse(saved); } catch(e) {}
    }
}

function loadServices() {
    var saved = localStorage.getItem('sophia_services');
    if (saved) {
        try { services = JSON.parse(saved); } catch(e) {}
    }
    if (!services || services.length === 0) {
        services = getDefaultServices();
        localStorage.setItem('sophia_services', JSON.stringify(services));
    }
}

// ====== RENDER SERVICES ======
function renderServices() {
    var grid = document.getElementById('servicesGrid');
    if (!grid) return;
    
    loadServices();
    
    var html = '';
    for (var i = 0; i < services.length; i++) {
        var service = services[i];
        var icon = service.icon || 'fas fa-star';
        html += `
            <div class="service-card">
                <div class="service-icon"><i class="${icon}"></i></div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-price">$${service.price}</div>
                <div class="service-duration">${service.duration}</div>
                <button class="btn btn-small" onclick="showRegister()">Book Now</button>
            </div>
        `;
    }
    grid.innerHTML = html;
}

function renderHomeServices() {
    var container = document.getElementById('homeServiceList');
    if (!container) return;
    
    loadServices();
    
    var html = '';
    for (var i = 0; i < services.length; i++) {
        var icon = services[i].icon || 'fas fa-star';
        html += `<li><i class="${icon}"></i> ${services[i].name} – $${services[i].price}</li>`;
    }
    container.innerHTML = html;
    
    var bookList = document.getElementById('bookServiceList');
    if (bookList) {
        var bookHtml = '';
        for (var j = 0; j < services.length; j++) {
            var icon2 = services[j].icon || 'fas fa-star';
            bookHtml += `<li><i class="${icon2}"></i> ${services[j].name} – $${services[j].price}</li>`;
        }
        bookList.innerHTML = bookHtml;
    }
}

// ====== RENDER GALLERY ======
function renderGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    loadGallery();
    
    var currentUser = getCurrentUser();
    var hasSubscription = false;
    if (currentUser) {
        var status = checkSubscriptionStatus(currentUser.id);
        hasSubscription = status.active;
    }
    
    for (var i = 0; i < galleryItems.length; i++) {
        var item = galleryItems[i];
        var div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.id = item.id;
        
        var isUnlocked = hasSubscription || unlockCodes[item.id] === true;
        
        var html = `<img src="${item.src}" alt="${item.title}" loading="lazy">`;
        if (!isUnlocked) {
            html += `
                <div class="lock-overlay">
                    <i class="fas fa-lock"></i>
                    <span class="price-tag">$${item.price}</span>
                    <button class="unlock-btn" data-id="${item.id}" data-type="image"><i class="fas fa-unlock"></i> Unlock</button>
                </div>
            `;
        }
        div.innerHTML = html;
        if (isUnlocked) div.classList.add('unlocked');
        grid.appendChild(div);
    }
    
    document.querySelectorAll('.unlock-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var id = parseInt(this.dataset.id);
            var type = this.dataset.type;
            openUnlockModal(id, type);
        });
    });
}

// ====== RENDER VIDEOS ======
function renderVideos() {
    var grid = document.getElementById('videoGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    loadVideos();
    
    var currentUser = getCurrentUser();
    var hasSubscription = false;
    if (currentUser) {
        var status = checkSubscriptionStatus(currentUser.id);
        hasSubscription = status.active;
    }
    
    for (var i = 0; i < videoItems.length; i++) {
        var item = videoItems[i];
        var div = document.createElement('div');
        div.className = 'video-item';
        div.dataset.id = item.id;
        
        var isUnlocked = hasSubscription || unlockCodes[item.id] === true;
        
        var html = `<video src="${item.src}" poster="${item.thumbnail || ''}" preload="metadata"></video><div class="play-icon"><i class="fas fa-play-circle"></i></div>`;
        if (!isUnlocked) {
            html += `
                <div class="lock-overlay">
                    <i class="fas fa-lock"></i>
                    <span class="price-tag">$${item.price}</span>
                    <button class="unlock-btn" data-id="${item.id}" data-type="video"><i class="fas fa-unlock"></i> Unlock</button>
                </div>
            `;
        }
        div.innerHTML = html;
        if (isUnlocked) div.classList.add('unlocked');
        grid.appendChild(div);
    }
    
    document.querySelectorAll('.unlock-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var id = parseInt(this.dataset.id);
            var type = this.dataset.type;
            openUnlockModal(id, type);
        });
    });
}

// ====== UNLOCK MODAL ======
var modal = document.getElementById('unlockModal');
var modalClose = document.getElementById('modalClose');
var modalPrice = document.getElementById('modalPrice');
var unlockCodeInput = document.getElementById('unlockCodeInput');
var unlockCodeBtn = document.getElementById('unlockCodeBtn');
var unlockMessage = document.getElementById('unlockMessage');
var whatsappUnlockBtn = document.getElementById('whatsappUnlockBtn');
var currentUnlockId = null;
var currentUnlockType = null;

function openUnlockModal(id, type) {
    currentUnlockId = id;
    currentUnlockType = type;
    
    var item = null;
    if (type === 'image') {
        for (var i = 0; i < galleryItems.length; i++) {
            if (galleryItems[i].id === id) { item = galleryItems[i]; break; }
        }
    } else if (type === 'video') {
        for (var j = 0; j < videoItems.length; j++) {
            if (videoItems[j].id === id) { item = videoItems[j]; break; }
        }
    }
    
    if (item) {
        modalPrice.textContent = '$' + item.price + '.00';
    }
    
    var currentUser = getCurrentUser();
    if (currentUser) {
        whatsappUnlockBtn.href = 'https://wa.me/14049070581?text=I%20want%20to%20unlock%20content%20-%20My%20ID%3A%20' + currentUser.id + '%20-%20Content%20ID%3A%20' + id;
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
    var code = unlockCodeInput.value.trim().toUpperCase();
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
    
    var storedCode = localStorage.getItem('sophia_pin_' + currentUnlockId);
    if (storedCode && storedCode.toUpperCase() === code) {
        unlockCodes[currentUnlockId] = true;
        localStorage.setItem('sophia_unlocked', JSON.stringify(unlockCodes));
        
        var currentUser = getCurrentUser();
        if (currentUser) {
            unlockContent(currentUser.id, currentUnlockId, currentUnlockType);
        }
        
        unlockMessage.textContent = 'Content unlocked successfully!';
        unlockMessage.style.color = '#2b6e4f';
        setTimeout(function() {
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
var registerModal = document.getElementById('registerModal');
var registerClose = document.getElementById('registerClose');
var registerBtn = document.getElementById('registerBtn');
var regName = document.getElementById('regName');
var regEmail = document.getElementById('regEmail');
var regPhone = document.getElementById('regPhone');
var registerMessage = document.getElementById('registerMessage');

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
    var name = regName.value.trim();
    var email = regEmail.value.trim();
    var phone = regPhone.value.trim();
    
    if (!name || !email || !phone) {
        registerMessage.textContent = 'Please fill in all fields';
        registerMessage.style.color = '#c0392b';
        return;
    }
    
    var result = registerUser(name, email, phone);
    if (result.success) {
        registerMessage.textContent = 'Account created! Your ID: ' + result.user.id;
        registerMessage.style.color = '#2b6e4f';
        regName.value = '';
        regEmail.value = '';
        regPhone.value = '';
        setTimeout(function() {
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
    var container = document.getElementById('accountContent');
    var currentUser = getCurrentUser();
    
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
    
    var status = checkSubscriptionStatus(currentUser.id);
    
    var statusHtml = '';
    var timerHtml = '';
    var adStatusHtml = '';
    
    if (status.active) {
        statusHtml = '<span class="status active">Active</span>';
        adStatusHtml = '<p style="color:#2b6e4f;background:#e8f5ee;padding:0.5rem;border-radius:12px;"><i class="fas fa-check-circle"></i> Premium Member - No Ads!</p>';
        timerHtml = `
            <div class="timer">
                ${status.remainingDays} days remaining
            </div>
            <p style="text-align:center;color:#8a7b6b;font-size:0.9rem;">
                Valid until: ${new Date(status.endDate).toLocaleDateString()}
            </p>
        `;
    } else {
        statusHtml = '<span class="status inactive">Inactive</span>';
        adStatusHtml = '<p style="color:#8a7b6b;background:#f5ecee;padding:0.5rem;border-radius:12px;"><i class="fas fa-ad"></i> Free Member - Ads are shown</p>';
        timerHtml = `
            <div class="timer" style="color:#c0392b;">
                No Active Subscription
            </div>
            <p style="text-align:center;color:#8a7b6b;font-size:0.9rem;">
                Subscribe to remove ads and unlock all content
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
                <button class="copy-btn" onclick="copyText('${currentUser.id}')" style="margin-left:0.5rem;background:#f8d0d8;border:none;padding:0.2rem 0.8rem;border-radius:30px;cursor:pointer;">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <p><strong>Name:</strong> ${currentUser.name}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Phone:</strong> ${currentUser.phone}</p>
            <p><strong>Status:</strong> ${statusHtml}</p>
            ${adStatusHtml}
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
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
            alert('Copied: ' + text);
        }).catch(function() {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Copied: ' + text);
}

// ====== PREMIUM USER - NO ADS ======
function isPremiumUser() {
    var currentUser = getCurrentUser();
    if (!currentUser) return false;
    var status = checkSubscriptionStatus(currentUser.id);
    return status.active;
}

function hideAdsForPremium() {
    var isPremium = isPremiumUser();
    var adContainers = document.querySelectorAll('.ad-container');
    for (var i = 0; i < adContainers.length; i++) {
        if (isPremium) {
            adContainers[i].style.display = 'none';
        } else {
            adContainers[i].style.display = 'flex';
        }
    }
}

// ====== NAVIGATION ======
var navLinks = document.querySelectorAll('.nav-links a');
var pages = {
    home: document.getElementById('page-home'),
    services: document.getElementById('page-services'),
    gallery: document.getElementById('page-gallery'),
    videos: document.getElementById('page-videos'),
    account: document.getElementById('page-account'),
    book: document.getElementById('page-book')
};

for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function(e) {
        e.preventDefault();
        var page = this.dataset.page;
        for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove('active');
        }
        this.classList.add('active');
        var keys = Object.keys(pages);
        for (var k = 0; k < keys.length; k++) {
            pages[keys[k]].classList.toggle('active', keys[k] === page);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        hideAdsForPremium();
        if (page === 'account') loadAccountPage();
        if (page === 'gallery') renderGallery();
        if (page === 'videos') renderVideos();
        if (page === 'services') renderServices();
        if (page === 'home') renderHomeServices();
    });
}

document.querySelectorAll('[data-page]').forEach(function(el) {
    el.addEventListener('click', function(e) {
        if (this.dataset.page) {
            e.preventDefault();
            var page = this.dataset.page;
            for (var m = 0; m < navLinks.length; m++) {
                navLinks[m].classList.toggle('active', navLinks[m].dataset.page === page);
            }
            var keys2 = Object.keys(pages);
            for (var n = 0; n < keys2.length; n++) {
                pages[keys2[n]].classList.toggle('active', keys2[n] === page);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            hideAdsForPremium();
            if (page === 'account') loadAccountPage();
            if (page === 'gallery') renderGallery();
            if (page === 'videos') renderVideos();
            if (page === 'services') renderServices();
            if (page === 'home') renderHomeServices();
        }
    });
});

// ====== INIT ======
loadServices();
loadGallery();
loadVideos();
loadUnlocked();
renderHomeServices();
renderServices();
renderGallery();
renderVideos();
hideAdsForPremium();

console.log('✅ Sophia Therapy Ready!');
console.log('📸 10 Images Loaded');
console.log('🎬 4 Videos Loaded');
console.log('💼 4 Services Loaded');
console.log('📱 Contact: +1 (404) 907-0581');
