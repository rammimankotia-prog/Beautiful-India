import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Master Admin Constants
const MASTER_ADMIN_EMAIL = 'robertjack442@gmail.com';
const MASTER_ADMIN_PASSWORD = 'Jaimatadi@24';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // Load user and allUsers from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('beautifulindia_auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error loading auth user:", e);
      }
    }

    const savedUsers = localStorage.getItem('beautifulindia_users');
    if (savedUsers) {
      try {
        setAllUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error("Error loading users:", e);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('beautifulindia_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('beautifulindia_auth_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('beautifulindia_users', JSON.stringify(allUsers));
  }, [allUsers]);

  const login = (email, password) => {
    // 1. Check if it's the Master Admin
    if (email === MASTER_ADMIN_EMAIL && password === MASTER_ADMIN_PASSWORD) {
      const masterUser = {
        name: 'Robert Jack',
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&backgroundColor=ffdfbf`,
        role: 'master_admin',
        status: 'approved'
      };
      setUser(masterUser);
      return { success: true, message: 'Welcome Master Admin!' };
    }

    // 2. Check existing users
    const existingUser = allUsers.find(u => u.email === email);
    
    if (existingUser) {
      if (existingUser.password !== password) {
        return { success: false, message: 'Invalid password.' };
      }
      
      // Allow pending users to login (for immediate access as requested)
      /*
      if (existingUser.status === 'pending') {
        return { success: false, message: 'Your account is pending approval from the Master Admin.' };
      }
      */
      
      if (existingUser.status === 'rejected') {
        return { success: false, message: 'Your access has been rejected by the Master Admin.' };
      }

      setUser(existingUser);
      return { success: true, message: 'Welcome back!' };
    }

    // 3. New user registration (simplified as part of login for this mock)
    // In a real app, this would be a separate SignUp function
    const newUser = {
      name: email.split('@')[0],
      email: email,
      password: password,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&backgroundColor=c0aede`,
      role: 'admin',
      status: 'approved', // Default to approved for immediate access
      requestedAt: new Date().toISOString()
    };
    
    setAllUsers(prev => [...prev, newUser]);
    return { success: false, message: 'Account created! Please wait for Master Admin approval.' };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserStatus = (email, status) => {
    setAllUsers(prev => prev.map(u => u.email === email ? { ...u, status } : u));
  };

  const deleteUser = (email) => {
    setAllUsers(prev => prev.filter(u => u.email !== email));
  };

  return (
    <AuthContext.Provider value={{ user, allUsers, login, logout, updateUserStatus, deleteUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
