// ====== USER AUTHENTICATION ======

function generateUserId() {
    const prefix = 'ST';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return prefix + random;
}

function registerUser(name, email, phone) {
    const users = JSON.parse(localStorage.getItem('sophia_users') || '[]');
    
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    const userId = generateUserId();
    const newUser = {
        id: userId,
        name: name,
        email: email,
        phone: phone,
        registered: new Date().toISOString(),
        subscription: {
            active: false,
            startDate: null,
            endDate: null,
            type: null
        },
        unlockedContent: {
            images: [],
            videos: []
        }
    };
    
    users.push(newUser);
    localStorage.setItem('sophia_users', JSON.stringify(users));
    localStorage.setItem('sophia_current_user', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
}

function getCurrentUser() {
    const saved = localStorage.getItem('sophia_current_user');
    if (saved) {
        try { return JSON.parse(saved); } catch(e) { return null; }
    }
    return null;
}

function logoutUser() {
    localStorage.removeItem('sophia_current_user');
}

function updateUserSubscription(userId, durationDays, type) {
    const users = JSON.parse(localStorage.getItem('sophia_users') || '[]');
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return { success: false, message: 'User not found' };
    
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);
    
    users[index].subscription = {
        active: true,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        type: type || 'monthly'
    };
    
    localStorage.setItem('sophia_users', JSON.stringify(users));
    
    const current = getCurrentUser();
    if (current && current.id === userId) {
        localStorage.setItem('sophia_current_user', JSON.stringify(users[index]));
    }
    
    return { success: true, user: users[index] };
}

function checkSubscriptionStatus(userId) {
    const users = JSON.parse(localStorage.getItem('sophia_users') || '[]');
    const user = users.find(u => u.id === userId);
    if (!user) return { active: false };
    
    if (!user.subscription || !user.subscription.active) {
        return { active: false };
    }
    
    const endDate = new Date(user.subscription.endDate);
    const now = new Date();
    
    if (endDate < now) {
        user.subscription.active = false;
        localStorage.setItem('sophia_users', JSON.stringify(users));
        return { active: false, expired: true };
    }
    
    const remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return { 
        active: true, 
        remainingDays: remainingDays,
        endDate: endDate.toISOString(),
        startDate: user.subscription.startDate,
        type: user.subscription.type
    };
}

function unlockContent(userId, contentId, contentType) {
    const users = JSON.parse(localStorage.getItem('sophia_users') || '[]');
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return { success: false, message: 'User not found' };
    
    if (!users[index].unlockedContent) {
        users[index].unlockedContent = { images: [], videos: [] };
    }
    
    if (contentType === 'image') {
        if (!users[index].unlockedContent.images.includes(contentId)) {
            users[index].unlockedContent.images.push(contentId);
        }
    } else if (contentType === 'video') {
        if (!users[index].unlockedContent.videos.includes(contentId)) {
            users[index].unlockedContent.videos.push(contentId);
        }
    }
    
    localStorage.setItem('sophia_users', JSON.stringify(users));
    
    const current = getCurrentUser();
    if (current && current.id === userId) {
        localStorage.setItem('sophia_current_user', JSON.stringify(users[index]));
    }
    
    return { success: true };
}