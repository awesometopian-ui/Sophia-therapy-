// ====== SUPABASE CONNECTION ======
const SUPABASE_URL = 'https://ytwldarvwlsglrrzftj.supabase.co';
const SUPABASE_KEY = 'YOUR_PUBLISHABLE_KEY'; // <--- PUT YOUR KEY HERE!

// ====== FETCH FUNCTIONS ======
async function getImagesFromDB() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/images?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}

async function getServicesFromDB() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/services?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

async function getVideosFromDB() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/videos?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
}

// ====== RENDER FUNCTIONS WITH SUPABASE ======
async function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    
    const services = await getServicesFromDB();
    
    if (services.length === 0) {
        grid.innerHTML = '<p style="color:#8a7b6b;text-align:center;padding:2rem;">No services available yet.</p>';
        return;
    }
    
    let html = '';
    for (let i = 0; i < services.length; i++) {
        const service = services[i];
        const icon = service.icon || 'fas fa-star';
        html += `
            <div class="service-card">
                <div class="service-icon"><i class="${icon}"></i></div>
                <h3>${service.name}</h3>
                <p>${service.description || 'Professional therapy service'}</p>
                <div class="service-price">$${service.price}</div>
                <div class="service-duration">${service.duration || '60 minutes'}</div>
                <button class="btn btn-small" onclick="showRegister()">Book Now</button>
            </div>
        `;
    }
    grid.innerHTML = html;
}

async function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const images = await getImagesFromDB();
    
    if (images.length === 0) {
        grid.innerHTML = '<p style="color:#8a7b6b;text-align:center;padding:2rem;">No images available yet.</p>';
        return;
    }
    
    for (let i = 0; i < images.length; i++) {
        const item = images[i];
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.dataset.id = item.id;
        
        // Check if unlocked (you'll need to implement this with your PIN system)
        const isUnlocked = false; // Temporarily false until PIN system connected
        
        let html = `<img src="${item.url}" alt="${item.title}" loading="lazy">`;
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
    
    document.querySelectorAll('.unlock-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            const type = this.dataset.type;
            openUnlockModal(id, type);
        });
    });
}

// ====== LOAD ON PAGE START ======
// Replace your old init with this:
async function init() {
    await renderServices();
    await renderGallery();
    // Add more as needed
}

// Call init when page loads
init();

console.log('✅ Website connected to Supabase!');