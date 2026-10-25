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

export const firebaseService = {
  // Empty starter - starts with 0 bins (no fake data)
  async seedInitialDataIfEmpty() {
    // 100% clean start - no sample data seeded
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
