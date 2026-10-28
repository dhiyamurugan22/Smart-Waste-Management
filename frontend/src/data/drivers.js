import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const standardFleetDrivers = [
  {
    id: 'drv-rajesh',
    name: 'Rajesh Kumar',
    email: 'driver.rajesh@smartwaste.com',
    role: 'DRIVER',
    avatar: '🚛',
    vehicle: 'TN-09-WM-4421',
    zone: 'North Zone',
    department: 'Urban Sanitation Fleet',
    phone: '+91 98401 23456'
  },
  {
    id: 'drv-amit',
    name: 'Amit Singh',
    email: 'amit.driver@smartwaste.com',
    role: 'DRIVER',
    avatar: '🚛',
    vehicle: 'TN-09-WM-2089',
    zone: 'South Zone',
    department: 'Urban Sanitation Fleet',
    phone: '+91 98402 34567'
  },
  {
    id: 'drv-priya',
    name: 'Priya Murugan',
    email: 'priya.driver@smartwaste.com',
    role: 'DRIVER',
    avatar: '🚛',
    vehicle: 'TN-09-WM-7731',
    zone: 'Central Zone',
    department: 'Urban Sanitation Fleet',
    phone: '+91 98403 45678'
  },
  {
    id: 'drv-suresh',
    name: 'Suresh Babu',
    email: 'suresh.driver@smartwaste.com',
    role: 'DRIVER',
    avatar: '🚛',
    vehicle: 'TN-09-WM-1102',
    zone: 'West Zone',
    department: 'Urban Sanitation Fleet',
    phone: '+91 98404 56789'
  }
];

export async function fetchAllDrivers() {
  const driversMap = new Map();

  // Add standard drivers first
  standardFleetDrivers.forEach(d => driversMap.set(d.email.toLowerCase(), d));

  // If Firebase Firestore is active, fetch any additional registered drivers
  if (isFirebaseConfigured && db) {
    try {
      const usersCol = collection(db, 'users');
      const snap = await getDocs(usersCol);
      snap.docs.forEach(docSnap => {
        const u = docSnap.data();
        if (u.role === 'DRIVER') {
          const emailKey = (u.email || '').toLowerCase();
          driversMap.set(emailKey, {
            id: u.uid || docSnap.id,
            name: u.name || 'Field Driver',
            email: u.email,
            role: 'DRIVER',
            avatar: u.avatar || '🚛',
            vehicle: u.vehicle || 'TN-09-WM-' + Math.floor(1000 + Math.random() * 9000),
            zone: u.zone || 'North Zone',
            department: u.department || 'Urban Sanitation Fleet'
          });
        }
      });
    } catch (e) {
      console.warn("ℹ️ Could not fetch drivers from Firestore (using standard fleet list):", e.message);
    }
  }

  return Array.from(driversMap.values());
}
