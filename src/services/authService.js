// src/services/authService.js
const authService = {
  // Register new user
  register: (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
      throw new Error('Username sudah terdaftar');
    }
    
    if (username.length < 3) {
      throw new Error('Username minimal 3 karakter');
    }
    
    if (password.length < 6) {
      throw new Error('Password minimal 6 karakter');
    }
    
    // Simple password hashing (untuk demo, production pakai bcrypt)
    const hashedPassword = btoa(password);
    
    users[username] = {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, username };
  },
  
  // Login user
  login: (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[username];
    
    if (!user) {
      throw new Error('Username tidak ditemukan');
    }
    
    const hashedPassword = btoa(password);
    
    if (user.password !== hashedPassword) {
      throw new Error('Password salah');
    }
    
    // Set current user
    localStorage.setItem('currentUser', username);
    localStorage.setItem('isAuthenticated', 'true');
    
    return { success: true, username };
  },
  
  // Logout user
  logout: () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      // Clear user's quiz data
      localStorage.removeItem(`${currentUser}:quiz-progress`);
      localStorage.removeItem(`${currentUser}:quiz-questions`);
      localStorage.removeItem(`${currentUser}:quiz-result`);
    }
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  },
  
  // Get current user
  getCurrentUser: () => {
    return localStorage.getItem('currentUser');
  }
};

export default authService;