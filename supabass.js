// ====== SUPABASE CONNECTION ======

// 🔑 REPLACE WITH YOUR DETAILS
const SUPABASE_URL = 'https://ytwldarvwlsglrrzftj.supabase.co';
const SUPABASE_KEY = 'sb_publis...'; // Your publishable key

// ====== GET FUNCTIONS ======

async function getImages() {
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

async function getVideos() {
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

async function getServices() {
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

async function getUsers() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// ====== ADMIN FUNCTIONS ======

async function addImage(title, url, price, pin) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/images`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, url, price, pin })
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding image:', error);
        return null;
    }
}

async function addService(name, description, price, duration, icon) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/services`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, price, duration, icon })
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding service:', error);
        return null;
    }
}

async function addVideo(title, url, price, pin) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/videos`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, url, price, pin })
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding video:', error);
        return null;
    }
}

async function deleteImage(id) {
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/images?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        return true;
    } catch (error) {
        console.error('Error deleting image:', error);
        return false;
    }
}

async function deleteService(id) {
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/services?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        return true;
    } catch (error) {
        console.error('Error deleting service:', error);
        return false;
    }
}

async function deleteVideo(id) {
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/videos?id=eq.${id}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        return true;
    } catch (error) {
        console.error('Error deleting video:', error);
        return false;
    }
}

function generatePin() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pin = '';
    for (let i = 0; i < 6; i++) {
        pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
}

console.log('✅ Supabase Connected!');
console.log('📊 Tables: images, videos, services, users');