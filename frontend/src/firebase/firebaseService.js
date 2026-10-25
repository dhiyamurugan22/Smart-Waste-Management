import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';

const INITIAL_BINS = [
  {
    binCode: 'BIN-101',
    locationName: 'City Center Mall - Main Entrance',
    latitude: 13.0827,
    longitude: 80.2707,
    zone: 'Central Zone',
    binType: 'GENERAL',
    capacityLiters: 500,
    currentFillLevel: 92.0,
    status: 'OVERFLOWING',
    temperature: 27.4,
    batteryLevel: 94,
    requiresMaintenance: false,
    lastCollectedAt: new Date(Date.now() - 3600000 * 26).toISOString()
  },
  {
    binCode: 'BIN-102',
    locationName: 'Tech Park Gate 2 - Cafeteria',
    latitude: 13.0850,
    longitude: 80.2750,
    zone: 'North Zone',
    binType: 'RECYCLABLE',
    capacityLiters: 1100,
    currentFillLevel: 84.0,
    status: 'FULL',
    temperature: 25.1,
    batteryLevel: 88,
    requiresMaintenance: false,
    lastCollectedAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    binCode: 'BIN-103',
    locationName: 'Gandhi Road Market Square',
    latitude: 13.0780,
    longitude: 80.2650,
    zone: 'Central Zone',
    binType: 'ORGANIC',
    capacityLiters: 500,
    currentFillLevel: 97.0,
    status: 'OVERFLOWING',
    temperature: 31.2,
    batteryLevel: 79,
    requiresMaintenance: false,
    lastCollectedAt: new Date(Date.now() - 3600000 * 30).toISOString()
  },
  {
    binCode: 'BIN-104',
    locationName: 'Residential Colony Park 4',
    latitude: 13.0910,
    longitude: 80.2800,
    zone: 'North Zone',
    binType: 'GENERAL',
    capacityLiters: 240,
    currentFillLevel: 35.0,
    status: 'MEDIUM',
    temperature: 24.0,
    batteryLevel: 98,
    requiresMaintenance: false,
    lastCollectedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    binCode: 'BIN-105',
    locationName: 'Metro Station East Gate',
    latitude: 13.0750,
    longitude: 80.2600,
    zone: 'South Zone',
    binType: 'RECYCLABLE',
    capacityLiters: 500,
    currentFillLevel: 18.0,
    status: 'LOW',
    temperature: 26.8,
    batteryLevel: 91,
    requiresMaintenance: false,
    lastCollectedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

const INITIAL_TASKS = [
  {
    taskCode: 'TSK-1001',
    title: 'High Priority North Zone Pickup',
    description: 'Clear BIN-102 Tech Park and surrounding bins',
    assignedDriverName: 'Rajesh Kumar (Driver 1)',
    driverPhone: '+91 94567 89012',
    vehicleNumber: 'TN-09-WM-4421',
    targetZone: 'North Zone',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    estimatedDistanceKm: 6.4,
    estimatedDurationMinutes: 35,
    binIds: [],
    assignedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    taskCode: 'TSK-1002',
    title: 'Central Zone Market Route',
    description: 'Empty BIN-101 and BIN-103 overflowing bins',
    assignedDriverName: 'Suresh Babu (Driver 2)',
    driverPhone: '+91 98111 22334',
    vehicleNumber: 'TN-09-WM-8890',
    targetZone: 'Central Zone',
    status: 'PENDING',
    priority: 'EMERGENCY',
    estimatedDistanceKm: 4.8,
    estimatedDurationMinutes: 25,
    binIds: [],
    assignedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const firebaseService = {
  // Check if collections are empty; if so, populate initial seed data
  async seedInitialDataIfEmpty() {
    if (!isFirebaseConfigured || !db) return;

    try {
      const binsCol = collection(db, 'waste_bins');
      const binsSnap = await getDocs(binsCol);

      if (binsSnap.empty) {
        console.log("🌱 [Firebase] Seeding initial waste bins into Firestore...");
        const batch = writeBatch(db);
        const savedBinIds = [];

        for (const b of INITIAL_BINS) {
          const docRef = doc(binsCol);
          batch.set(docRef, { ...b, id: docRef.id, createdAt: serverTimestamp() });
          savedBinIds.push(docRef.id);
        }

        const tasksCol = collection(db, 'collection_tasks');
        const tasksSnap = await getDocs(tasksCol);
        if (tasksSnap.empty) {
          console.log("🌱 [Firebase] Seeding initial collection tasks into Firestore...");
          const t1 = { ...INITIAL_TASKS[0], binIds: savedBinIds[1] ? [savedBinIds[1]] : [] };
          const t2 = { ...INITIAL_TASKS[1], binIds: [savedBinIds[0], savedBinIds[2]].filter(Boolean) };

          const t1Ref = doc(tasksCol);
          batch.set(t1Ref, { ...t1, id: t1Ref.id, createdAt: serverTimestamp() });

          const t2Ref = doc(tasksCol);
          batch.set(t2Ref, { ...t2, id: t2Ref.id, createdAt: serverTimestamp() });
        }

        await batch.commit();
        console.log("✅ [Firebase] Seed data successfully written to Firestore!");
      }
    } catch (err) {
      console.error("⚠️ [Firebase] Seeding error:", err);
    }
  },

  // Real-time listener for Bins
  subscribeBins(onUpdate) {
    if (!isFirebaseConfigured || !db) return () => {};
    const binsCol = collection(db, 'waste_bins');
    return onSnapshot(binsCol, (snapshot) => {
      const bins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(bins);
    }, (error) => {
      console.error("🔥 [Firestore] subscribeBins error:", error);
    });
  },

  // Real-time listener for Tasks
  subscribeTasks(onUpdate) {
    if (!isFirebaseConfigured || !db) return () => {};
    const tasksCol = collection(db, 'collection_tasks');
    return onSnapshot(tasksCol, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(tasks);
    }, (error) => {
      console.error("🔥 [Firestore] subscribeTasks error:", error);
    });
  },

  // Fetch Bins once
  async getBins(zone) {
    if (!isFirebaseConfigured || !db) return null;
    const binsCol = collection(db, 'waste_bins');
    const snap = await getDocs(binsCol);
    let bins = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (zone) {
      bins = bins.filter(b => b.zone === zone);
    }
    return bins;
  },

  // Create Bin
  async createBin(binData) {
    if (!isFirebaseConfigured || !db) return null;
    const binsCol = collection(db, 'waste_bins');
    const count = (await getDocs(binsCol)).size + 1;
    const binCode = binData.binCode || `BIN-${100 + count}`;
    const fill = binData.currentFillLevel || 0;
    
    let status = 'LOW';
    if (fill >= 95) status = 'OVERFLOWING';
    else if (fill >= 80) status = 'FULL';
    else if (fill >= 40) status = 'MEDIUM';

    const newBin = {
      ...binData,
      binCode,
      currentFillLevel: fill,
      status,
      batteryLevel: binData.batteryLevel || 95,
      temperature: binData.temperature || 26.0,
      requiresMaintenance: false,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(binsCol, newBin);
    return { id: docRef.id, ...newBin };
  },

  // Empty Bin
  async emptyBin(id) {
    if (!isFirebaseConfigured || !db) return null;
    const binRef = doc(db, 'waste_bins', id);
    const updates = {
      currentFillLevel: 0,
      status: 'EMPTY',
      requiresMaintenance: false,
      lastCollectedAt: new Date().toISOString()
    };
    await updateDoc(binRef, updates);
    const snap = await getDoc(binRef);
    return { id: snap.id, ...snap.data() };
  },

  // Delete Bin
  async deleteBin(id) {
    if (!isFirebaseConfigured || !db) return null;
    const binRef = doc(db, 'waste_bins', id);
    await deleteDoc(binRef);
    return id;
  },

  // Clear all bins from database
  async clearAllBins() {
    if (!isFirebaseConfigured || !db) return;
    const binsCol = collection(db, 'waste_bins');
    const snap = await getDocs(binsCol);
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  },

  // Fetch Tasks once
  async getTasks(driverId) {
    if (!isFirebaseConfigured || !db) return null;
    const tasksCol = collection(db, 'collection_tasks');
    const snap = await getDocs(tasksCol);
    let tasks = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (driverId) {
      tasks = tasks.filter(t => t.assignedDriverId === driverId);
    }
    return tasks;
  },

  // Create Task
  async createTask(taskData) {
    if (!isFirebaseConfigured || !db) return null;
    const tasksCol = collection(db, 'collection_tasks');
    const count = (await getDocs(tasksCol)).size + 1;

    const newTask = {
      ...taskData,
      taskCode: taskData.taskCode || `TSK-${1000 + count}`,
      status: 'PENDING',
      assignedAt: new Date().toISOString(),
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(tasksCol, newTask);
    return { id: docRef.id, ...newTask };
  },

  // Update Task Status
  async updateTaskStatus(id, status, notes, wasteKg) {
    if (!isFirebaseConfigured || !db) return null;
    const taskRef = doc(db, 'collection_tasks', id);
    const snap = await getDoc(taskRef);
    if (!snap.exists()) return null;

    const task = snap.data();
    const updates = { status };
    if (notes !== undefined) updates.completionNotes = notes;
    if (wasteKg !== undefined) updates.wasteCollectedKg = wasteKg;

    if (status === 'IN_PROGRESS' && !task.startedAt) {
      updates.startedAt = new Date().toISOString();
    } else if (status === 'COMPLETED') {
      updates.completedAt = new Date().toISOString();
      // Empty linked bins in Firestore
      if (task.binIds && Array.isArray(task.binIds)) {
        for (const bId of task.binIds) {
          try {
            await this.emptyBin(bId);
          } catch (e) {
            console.error("Could not empty bin linked to task:", bId, e);
          }
        }
      }
    }

    await updateDoc(taskRef, updates);
    const updatedSnap = await getDoc(taskRef);
    return { id: updatedSnap.id, ...updatedSnap.data() };
  },

  // Trigger IoT Simulation on all bins in Firestore
  async triggerIoTTick() {
    if (!isFirebaseConfigured || !db) return null;
    const binsCol = collection(db, 'waste_bins');
    const snap = await getDocs(binsCol);
    if (snap.empty) return [];

    const batch = writeBatch(db);
    const updatedBins = [];

    snap.docs.forEach((docSnap) => {
      const b = docSnap.data();
      const delta = Math.random() * 3.5;
      const newFill = Math.min(100, Math.round((b.currentFillLevel || 0) + delta));
      let status = 'EMPTY';
      if (newFill >= 95) status = 'OVERFLOWING';
      else if (newFill >= 80) status = 'FULL';
      else if (newFill >= 40) status = 'MEDIUM';
      else if (newFill >= 15) status = 'LOW';

      const updates = {
        currentFillLevel: newFill,
        status,
        temperature: Math.round((24 + Math.random() * 10) * 10) / 10,
        batteryLevel: Math.max(15, (b.batteryLevel || 95) - (Math.random() < 0.05 ? 1 : 0))
      };

      batch.update(docSnap.ref, updates);
      updatedBins.push({ id: docSnap.id, ...b, ...updates });
    });

    await batch.commit();
    return updatedBins;
  }
};
