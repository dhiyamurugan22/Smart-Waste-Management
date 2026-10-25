import axios from 'axios';
import { firebaseService } from '../firebase/firebaseService';
import { isFirebaseConfigured } from '../firebase/config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Seed Firebase if configured on startup
if (isFirebaseConfigured) {
  firebaseService.seedInitialDataIfEmpty();
}

// In-memory mock store for offline/standalone execution
let mockBins = [
  {
    id: 'bin-1',
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
    id: 'bin-2',
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
    id: 'bin-3',
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
    id: 'bin-4',
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
    id: 'bin-5',
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

let mockTasks = [
  {
    id: 'tsk-1',
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
    binIds: ['bin-2'],
    assignedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'tsk-2',
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
    binIds: ['bin-1', 'bin-3'],
    assignedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const apiService = {
  // Bins
  async getBins(zone) {
    if (isFirebaseConfigured) {
      const fbBins = await firebaseService.getBins(zone);
      if (fbBins && fbBins.length > 0) return fbBins;
    }

    try {
      const res = await apiClient.get('/bins', { params: { zone } });
      return res.data;
    } catch {
      return zone ? mockBins.filter(b => b.zone === zone) : [...mockBins];
    }
  },

  async createBin(binData) {
    if (isFirebaseConfigured) {
      const created = await firebaseService.createBin(binData);
      if (created) return created;
    }

    try {
      const res = await apiClient.post('/bins', binData);
      return res.data;
    } catch {
      const newBin = {
        ...binData,
        id: `bin-${Date.now()}`,
        binCode: `BIN-${100 + mockBins.length + 1}`,
        batteryLevel: 98,
        temperature: 25.0,
        status: binData.currentFillLevel >= 80 ? 'FULL' : 'LOW'
      };
      mockBins.push(newBin);
      return newBin;
    }
  },

  async emptyBin(id) {
    if (isFirebaseConfigured) {
      const emptied = await firebaseService.emptyBin(id);
      if (emptied) return emptied;
    }

    try {
      const res = await apiClient.post(`/bins/${id}/empty`);
      return res.data;
    } catch {
      const bin = mockBins.find(b => b.id === id);
      if (bin) {
        bin.currentFillLevel = 0;
        bin.status = 'EMPTY';
        bin.lastCollectedAt = new Date().toISOString();
      }
      return bin;
    }
  },

  async deleteBin(id) {
    if (isFirebaseConfigured) {
      await firebaseService.deleteBin(id);
    }
    mockBins = mockBins.filter(b => b.id !== id);
    return id;
  },

  async clearAllBins() {
    if (isFirebaseConfigured) {
      await firebaseService.clearAllBins();
    }
    mockBins = [];
  },

  // Tasks
  async getTasks(driverId) {
    if (isFirebaseConfigured) {
      const fbTasks = await firebaseService.getTasks(driverId);
      if (fbTasks && fbTasks.length > 0) return fbTasks;
    }

    try {
      const res = await apiClient.get('/tasks', { params: { driverId } });
      return res.data;
    } catch {
      return [...mockTasks];
    }
  },

  async createTask(taskData) {
    if (isFirebaseConfigured) {
      const created = await firebaseService.createTask(taskData);
      if (created) return created;
    }

    try {
      const res = await apiClient.post('/tasks', taskData);
      return res.data;
    } catch {
      const newTask = {
        ...taskData,
        id: `tsk-${Date.now()}`,
        taskCode: `TSK-${1000 + mockTasks.length + 1}`,
        status: 'PENDING',
        assignedAt: new Date().toISOString()
      };
      mockTasks.unshift(newTask);
      return newTask;
    }
  },

  async updateTaskStatus(id, status, notes, wasteKg) {
    if (isFirebaseConfigured) {
      const updated = await firebaseService.updateTaskStatus(id, status, notes, wasteKg);
      if (updated) return updated;
    }

    try {
      const res = await apiClient.patch(`/tasks/${id}/status`, { status, notes, wasteKg });
      return res.data;
    } catch {
      const task = mockTasks.find(t => t.id === id);
      if (task) {
        task.status = status;
        task.completionNotes = notes;
        task.wasteCollectedKg = wasteKg;
        if (status === 'COMPLETED' && task.binIds) {
          task.binIds.forEach(bId => {
            const b = mockBins.find(mb => mb.id === bId);
            if (b) {
              b.currentFillLevel = 0;
              b.status = 'EMPTY';
            }
          });
        }
      }
      return task;
    }
  },

  // Analytics & IoT
  async getOverviewMetrics() {
    let currentBins = mockBins;
    let currentTasks = mockTasks;

    if (isFirebaseConfigured) {
      try {
        const [fbBins, fbTasks] = await Promise.all([
          firebaseService.getBins(),
          firebaseService.getTasks()
        ]);
        if (fbBins) currentBins = fbBins;
        if (fbTasks) currentTasks = fbTasks;
      } catch (e) {
        console.warn("Metrics fallback:", e);
      }
    } else {
      try {
        const res = await apiClient.get('/analytics/overview');
        return res.data;
      } catch {
        // use mockBins / mockTasks
      }
    }

    const critical = currentBins.filter(b => (b.currentFillLevel || 0) >= 80).length;
    const overflowing = currentBins.filter(b => b.status === 'OVERFLOWING').length;
    const completedTasks = currentTasks.filter(t => t.status === 'COMPLETED').length;
    const totalWasteCollectedTons = Number(((completedTasks * 350) / 1000 + 12.4).toFixed(1));

    return {
      totalBins: currentBins.length,
      criticalBins: critical,
      overflowingBins: overflowing,
      averageFillLevel: currentBins.length === 0 ? 0 : Math.round(currentBins.reduce((a, b) => a + (b.currentFillLevel || 0), 0) / currentBins.length),
      activeTasks: currentTasks.filter(t => t.status !== 'COMPLETED').length,
      completedTasks: completedTasks,
      totalWasteCollectedTons,
      co2OffsetKg: Math.round(totalWasteCollectedTons * 620),
      treesSavedEquivalent: Math.round(totalWasteCollectedTons * 17),
      efficiencyRatingPercent: Math.max(90, 100 - critical * 3)
    };
  },

  async triggerIoTTick() {
    if (isFirebaseConfigured) {
      const updated = await firebaseService.triggerIoTTick();
      if (updated && updated.length > 0) return updated;
    }

    try {
      const res = await apiClient.post('/iot/simulate');
      return res.data;
    } catch {
      mockBins = mockBins.map(b => {
        const delta = Math.random() * 4.0;
        const newFill = Math.min(100, Math.round(b.currentFillLevel + delta));
        let status = 'EMPTY';
        if (newFill >= 95) status = 'OVERFLOWING';
        else if (newFill >= 80) status = 'FULL';
        else if (newFill >= 40) status = 'MEDIUM';
        else if (newFill >= 15) status = 'LOW';

        return {
          ...b,
          currentFillLevel: newFill,
          status,
          temperature: Math.round((24 + Math.random() * 10) * 10) / 10
        };
      });
      return [...mockBins];
    }
  }
};
