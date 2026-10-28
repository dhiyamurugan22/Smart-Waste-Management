import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const demoProfiles = {
  ADMIN: {
    name: 'Admin Central',
    email: 'admin@smartwaste.com',
    role: 'ADMIN',
    avatar: '👨‍💼',
    zone: 'All Zones',
    department: 'Municipal Waste Operations'
  },
  DRIVER: {
    name: 'Rajesh Kumar',
    email: 'driver.rajesh@smartwaste.com',
    role: 'DRIVER',
    avatar: '🚛',
    vehicle: 'TN-09-WM-4421',
    zone: 'North Zone',
    department: 'Urban Sanitation Fleet'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('smartwaste_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn("Could not load stored user session:", e);
      return null;
    }
  });

  const login = (role, email, password, remember = true) => {
    const base = demoProfiles[role] || demoProfiles.ADMIN;
    const user = {
      ...base,
      email: email || base.email,
      lastLogin: new Date().toISOString()
    };

    setCurrentUser(user);

    if (remember) {
      try {
        localStorage.setItem('smartwaste_auth_user', JSON.stringify(user));
      } catch (e) {
        console.warn("Could not save user session:", e);
      }
    }

    return { success: true, user };
  };

  const logout = () => {
    try {
      localStorage.removeItem('smartwaste_auth_user');
    } catch (e) {
      console.warn("Could not clear user session:", e);
    }
    setCurrentUser(null);
  };

  const switchRole = (roleKey) => {
    if (demoProfiles[roleKey]) {
      const updated = demoProfiles[roleKey];
      setCurrentUser(updated);
      try {
        localStorage.setItem('smartwaste_auth_user', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
      switchRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
