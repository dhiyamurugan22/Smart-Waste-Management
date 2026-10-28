import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

// Convert Firebase auth error codes into clear messages
export const getFriendlyAuthErrorMessage = (error) => {
  if (!error) return 'An error occurred during authentication.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password. Please try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please switch to "Create Account" below.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Switching to Sign In...';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to many failed attempts. Try again later.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
    default:
      if (error.message && error.message.includes('permission')) {
        return 'Firestore database permissions are locked. To save users permanently to database, update Firestore security rules in Firebase Console.';
      }
      return error.message || 'Authentication failed. Please verify credentials.';
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

  // Keep Firebase Auth state synchronized if user is already signed in
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        if (!currentUser || currentUser.uid !== fbUser.uid) {
          let role = 'ADMIN';
          let name = fbUser.displayName || fbUser.email.split('@')[0];
          let department = 'Operations';

          // Safe non-blocking Firestore sync
          if (db) {
            try {
              const userRef = doc(db, 'users', fbUser.uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const data = userSnap.data();
                role = data.role || role;
                name = data.name || name;
                department = data.department || department;
              }
            } catch (err) {
              console.warn("ℹ️ [Firestore] User profile read skipped (rules locked or offline):", err.message);
            }
          }

          const refreshedUser = {
            uid: fbUser.uid,
            name,
            email: fbUser.email,
            role,
            avatar: role === 'ADMIN' ? '👨‍💼' : '🚛',
            department,
            lastLogin: new Date().toISOString()
          };

          setCurrentUser(refreshedUser);
          localStorage.setItem('smartwaste_auth_user', JSON.stringify(refreshedUser));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Log In using Email & Password with Firebase Auth & safe Firestore sync
   */
  const login = async (role, email, password, remember = true) => {
    const trimmedEmail = (email || '').trim();
    const trimmedPass = (password || '').trim();

    // Check if Firebase is available
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
        const fbUser = userCredential.user;

        let assignedRole = role;
        let displayName = fbUser.displayName || trimmedEmail.split('@')[0];
        let department = role === 'ADMIN' ? 'Municipal Waste Operations' : 'Urban Sanitation Fleet';

        // Safe non-blocking Firestore read & update
        if (db) {
          try {
            const userRef = doc(db, 'users', fbUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
              const data = userSnap.data();
              assignedRole = data.role || role;
              displayName = data.name || displayName;
              department = data.department || department;
              await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
            } else {
              // Attempt to write profile
              await setDoc(userRef, {
                uid: fbUser.uid,
                name: displayName,
                email: fbUser.email,
                role: assignedRole,
                avatar: assignedRole === 'ADMIN' ? '👨‍💼' : '🚛',
                department,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
              }, { merge: true });
            }
          } catch (dbErr) {
            console.warn("ℹ️ [Firestore] Database write skipped due to security rules:", dbErr.message);
          }
        }

        const appUser = {
          uid: fbUser.uid,
          name: displayName,
          email: fbUser.email,
          role: assignedRole,
          avatar: assignedRole === 'ADMIN' ? '👨‍💼' : '🚛',
          department,
          lastLogin: new Date().toISOString()
        };

        setCurrentUser(appUser);
        if (remember) {
          localStorage.setItem('smartwaste_auth_user', JSON.stringify(appUser));
        }

        return { success: true, user: appUser };
      } catch (err) {
        // If it's a demo credential, gracefully allow demo login as fallback
        const isDemoAdmin = trimmedEmail === 'admin@smartwaste.com' && (trimmedPass === 'admin123' || trimmedPass === 'demo123');
        const isDemoDriver = trimmedEmail.includes('driver') && (trimmedPass === 'driver123' || trimmedPass === 'demo123');

        if (isDemoAdmin || isDemoDriver) {
          const base = demoProfiles[role] || demoProfiles.ADMIN;
          const demoUser = {
            ...base,
            email: trimmedEmail,
            lastLogin: new Date().toISOString()
          };
          setCurrentUser(demoUser);
          if (remember) {
            localStorage.setItem('smartwaste_auth_user', JSON.stringify(demoUser));
          }
          return { success: true, user: demoUser, isDemo: true };
        }

        return { success: false, message: getFriendlyAuthErrorMessage(err), rawError: err };
      }
    }

    // Local / Offline demo mode fallback
    const base = demoProfiles[role] || demoProfiles.ADMIN;
    const user = {
      ...base,
      email: trimmedEmail || base.email,
      lastLogin: new Date().toISOString()
    };
    setCurrentUser(user);
    if (remember) {
      localStorage.setItem('smartwaste_auth_user', JSON.stringify(user));
    }
    return { success: true, user };
  };

  /**
   * Register a new user with Email, Password & chosen Role
   * Handles email-already-in-use by seamlessly signing in
   * Safely isolates Firestore database write so permission errors never block login
   */
  const register = async (role, email, password, name = '', remember = true) => {
    const trimmedEmail = (email || '').trim();
    const trimmedPass = (password || '').trim();
    const trimmedName = (name || '').trim();

    if (!isFirebaseConfigured || !auth) {
      return {
        success: false,
        message: 'Firebase is not initialized. Connect your Firebase credentials to register real accounts.'
      };
    }

    try {
      let fbUser;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
        fbUser = userCredential.user;
      } catch (authErr) {
        // If user already exists in Firebase Auth (e.g. created on previous click), automatically sign them in!
        if (authErr.code === 'auth/email-already-in-use') {
          try {
            const signInRes = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
            fbUser = signInRes.user;
          } catch (signInErr) {
            return {
              success: false,
              message: 'This email is already registered with a different password. Please switch to "Sign In".'
            };
          }
        } else {
          throw authErr;
        }
      }

      const displayName = trimmedName || fbUser.displayName || trimmedEmail.split('@')[0];
      const department = role === 'ADMIN' ? 'Municipal Waste Operations' : 'Urban Sanitation Fleet';

      // Safe non-blocking Firestore write:
      // Even if Firestore security rules in Firebase Console are locked,
      // the user is STILL successfully authenticated into their dashboard!
      if (db) {
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          await setDoc(userRef, {
            uid: fbUser.uid,
            name: displayName,
            email: fbUser.email,
            role: role,
            avatar: role === 'ADMIN' ? '👨‍💼' : '🚛',
            department,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (dbErr) {
          console.warn("ℹ️ [Firestore] User profile database write skipped (check Firestore Rules in Firebase Console):", dbErr.message);
        }
      }

      const appUser = {
        uid: fbUser.uid,
        name: displayName,
        email: fbUser.email,
        role: role,
        avatar: role === 'ADMIN' ? '👨‍💼' : '🚛',
        department,
        lastLogin: new Date().toISOString()
      };

      setCurrentUser(appUser);
      if (remember) {
        localStorage.setItem('smartwaste_auth_user', JSON.stringify(appUser));
      }

      return { success: true, user: appUser };
    } catch (err) {
      return { success: false, message: getFriendlyAuthErrorMessage(err), rawError: err };
    }
  };

  /**
   * Quick 1-Click Demo Login
   */
  const loginDemo = (role) => {
    const base = demoProfiles[role] || demoProfiles.ADMIN;
    const user = {
      ...base,
      lastLogin: new Date().toISOString()
    };
    setCurrentUser(user);
    localStorage.setItem('smartwaste_auth_user', JSON.stringify(user));
    return { success: true, user };
  };

  /**
   * Logout from Firebase Auth & local session
   */
  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await fbSignOut(auth);
      }
    } catch (e) {
      console.warn("Firebase sign out error:", e);
    }
    try {
      localStorage.removeItem('smartwaste_auth_user');
    } catch (e) {}
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
      register,
      loginDemo,
      logout,
      switchRole,
      isFirebaseActive: isFirebaseConfigured
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
