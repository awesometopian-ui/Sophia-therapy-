// ====== USER AUTHENTICATION ======

function generateUserId() {
    var prefix = 'ST';
    var random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return prefix + random;
}

function registerUser(name, email, phone) {
    var users = JSON.parse(localStorage.getItem('sophia_users') || '[]');
    
    for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            return { success: false, message: 'Email already registered' };
        }
    }
    
    var userId = generateUserId();
    var newUser = {
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
    var saved = localStorage.getItem('sophia_current_user');
    if (saved) {
        try { return JSON.parse(saved); } catch(e) { return null; }
    }
    return null;
}

function logoutUser() {
    localStorage.removeItem('sophia_current_user');
}

function updateUserSubscription(userId, durationDays, type) {
    var users = JSON.parse(localStorage.getItem('sophia_users') || '[]');
    var index = -1;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
            index = i;
            break;
        }
    }
    if (index === -1) return { success: false, message: 'User not found' };
    
    var startDate = new Date();
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);
    
    users[index].subscription = {
        active: true,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        type: type || 'monthly'
    };
    
    localStorage.setItem('sophia_users', JSON.stringify(users));
    
    var current = getCurrentUser();
    if (current && current.id === userId) {
        localStorage.setItem('sophia_current_user', JSON.stringify(users[index]));
    }
    
    return { success: true, user: users[index] };
}

function checkSubscriptionStatus(userId) {
    var users = JSON.parse(localStorage.getItem('sophia_users') || '[]');
    var user = null;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
            user = users[i];
            break;
        }
    }
    if (!user) return { active: false };
    
    if (!user.subscription || !user.subscription.active) {
        return { active: false };
    }
    
    var endDate = new Date(user.subscription.endDate);
    var now = new Date();
    
    if (endDate < now) {
        user.subscription.active = false;
        localStorage.setItem('sophia_users', JSON.stringify(users));
        return { active: false, expired: true };
    }
    
    var remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    return { 
        active: true, 
        remainingDays: remainingDays,
        endDate: endDate.toISOString(),
        startDate: user.subscription.startDate,
        type: user.subscription.type
    };
}

function unlockContent(userId, contentId, contentType) {
    var users = JSON.parse(localStorage.getItem('sophia_users') || '[]');
    var index = -1;
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === userId) {
            index = i;
            break;
        }
    }
    if (index === -1) return { success: false, message: 'User not found' };
    
    if (!users[index].unlockedContent) {
        users[index].unlockedContent = { images: [], videos: [] };
    }
    
    if (contentType === 'image') {
        if (users[index].unlockedContent.images.indexOf(contentId) === -1) {
            users[index].unlockedContent.images.push(contentId);
        }
    } else if (contentType === 'video') {
        if (users[index].unlockedContent.videos.indexOf(contentId) === -1) {
            users[index].unlockedContent.videos.push(contentId);
        }
    }
    
    localStorage.setItem('sophia_users', JSON.stringify(users));
    
    var current = getCurrentUser();
    if (current && current.id === userId) {
        localStorage.setItem('sophia_current_user', JSON.stringify(users[index]));
    }
    
    return { success: true };
}
