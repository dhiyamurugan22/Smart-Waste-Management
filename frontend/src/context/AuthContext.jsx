import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const demoProfiles = {
  ADMIN: {
    name: 'Admin Central',
    email: 'admin@smartwaste.com',
    role: 'ADMIN',
    avatar: '👨‍💼',
    zone: 'All Zones'
  },
  CITIZEN: {
    name: 'Priya Sharma',
    email: 'priya@citizen.com',
    role: 'CITIZEN',
    avatar: '👩',
    zone: 'Central Zone'
  },
  DRIVER: {
    name: 'Rajesh Kumar',
    email: 'driver.rajesh@smartwaste.com',
    role: 'DRIVER',
    avatar: '🚛',
    vehicle: 'TN-09-WM-4421',
    zone: 'North Zone'
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(demoProfiles.ADMIN);

  const switchRole = (roleKey) => {
    if (demoProfiles[roleKey]) {
      setCurrentUser(demoProfiles[roleKey]);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
