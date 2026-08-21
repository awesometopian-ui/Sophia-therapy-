// ====== SUPABASE CONNECTION ======

// REPLACE WITH YOUR DETAILS
const SUPABASE_URL = 'https://ytwldarvwlsgllrzrftj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UtvoatDB8TCfbkQWVS8MBA_Pvxd9uf_';  //

// ====== FUNCTIONS ======

// Get all images
async function getImages() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/images?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}

// Get all services
async function getServices() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/services?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

// Get all videos
async function getVideos() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/videos?select=*`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
}

// Add image (for admin)
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

// Add service (for admin)
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

// ====== EXPORT FUNCTIONS ======
// (For use in other files)