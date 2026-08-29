import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
    currentFillLevel: 98.0,
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

let mockComplaints = [
  {
    id: 'cmp-1',
    complaintCode: 'CMP-2026-001',
    citizenName: 'Priya Sharma',
    citizenPhone: '+91 91234 56789',
    citizenEmail: 'priya@citizen.com',
    title: 'Overflowing organic bin causing odor',
    category: 'OVERFLOWING_BIN',
    description: 'The organic waste container outside Gandhi Market has been spilling over for 2 days.',
    locationAddress: 'Gandhi Road Market Square, Corner 3',
    latitude: 13.0780,
    longitude: 80.2650,
    zone: 'Central Zone',
    priority: 'HIGH',
    status: 'PENDING',
    imageUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=600&auto=format&fit=crop&q=60',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'cmp-2',
    complaintCode: 'CMP-2026-002',
    citizenName: 'Ramesh V.',
    citizenPhone: '+91 99887 76655',
    citizenEmail: 'ramesh@citizen.com',
    title: 'Uncollected plastic waste in park',
    category: 'UNCOLLECTED_WASTE',
    description: 'Cardboard boxes and plastics left near park gazebo.',
    locationAddress: 'Park Lane, Sector 9',
    latitude: 13.0920,
    longitude: 80.2820,
    zone: 'North Zone',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    assignedDriverName: 'Rajesh Kumar (Driver 1)',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=60',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

let mockTasks = [
  {
    id: 'tsk-1',
    taskCode: 'TSK-1001',
    title: 'High Priority North Zone Pickup',
    description: 'Clear BIN-102 Tech Park and Park Lane complaint',
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
    try {
      const res = await apiClient.get('/bins', { params: { zone } });
      return res.data;
    } catch {
      return zone ? mockBins.filter(b => b.zone === zone) : [...mockBins];
    }
  },

  async createBin(binData) {
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

  // Complaints
  async getComplaints(userId) {
    try {
      const res = await apiClient.get('/complaints', { params: { userId } });
      return res.data;
    } catch {
      return userId ? mockComplaints.filter(c => c.userId === userId) : [...mockComplaints];
    }
  },

  async fileComplaint(complaintData) {
    try {
      const res = await apiClient.post('/complaints', complaintData);
      return res.data;
    } catch {
      const newCmp = {
        ...complaintData,
        id: `cmp-${Date.now()}`,
        complaintCode: `CMP-2026-${100 + mockComplaints.length + 1}`,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      mockComplaints.unshift(newCmp);
      return newCmp;
    }
  },

  async updateComplaintStatus(id, updateData) {
    try {
      const res = await apiClient.patch(`/complaints/${id}/status`, updateData);
      return res.data;
    } catch {
      const cmp = mockComplaints.find(c => c.id === id);
      if (cmp) {
        Object.assign(cmp, updateData);
      }
      return cmp;
    }
  },

  // Tasks
  async getTasks(driverId) {
    try {
      const res = await apiClient.get('/tasks', { params: { driverId } });
      return res.data;
    } catch {
      return [...mockTasks];
    }
  },

  async createTask(taskData) {
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
    try {
      const res = await apiClient.get('/analytics/overview');
      return res.data;
    } catch {
      const critical = mockBins.filter(b => b.currentFillLevel >= 80).length;
      const overflowing = mockBins.filter(b => b.status === 'OVERFLOWING').length;
      return {
        totalBins: mockBins.length,
        criticalBins: critical,
        overflowingBins: overflowing,
        averageFillLevel: Math.round(mockBins.reduce((a, b) => a + b.currentFillLevel, 0) / mockBins.length),
        totalComplaints: mockComplaints.length,
        pendingComplaints: mockComplaints.filter(c => c.status === 'PENDING').length,
        resolvedComplaints: mockComplaints.filter(c => c.status === 'RESOLVED').length,
        activeTasks: mockTasks.filter(t => t.status !== 'COMPLETED').length,
        completedTasks: mockTasks.filter(t => t.status === 'COMPLETED').length,
        totalWasteCollectedTons: 14.8,
        co2OffsetKg: 9176,
        treesSavedEquivalent: 251,
        efficiencyRatingPercent: 96
      };
    }
  },

  async triggerIoTTick() {
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
