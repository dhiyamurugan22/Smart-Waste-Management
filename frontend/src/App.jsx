import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AdminDashboard } from './pages/AdminDashboard';
import { BinManagementPage } from './pages/BinManagementPage';
import { DriverTasksPage } from './pages/DriverTasksPage';
import { IoTMonitorPage } from './pages/IoTMonitorPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { apiService } from './services/api';
import { firebaseService } from './firebase/firebaseService';
import { isFirebaseConfigured } from './firebase/config';

function MainApp() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('admin-dashboard');
  const [bins, setBins] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);

  // Sync tab with role if switched
  useEffect(() => {
    if (currentUser.role === 'DRIVER') {
      setActiveTab('driver-portal');
    } else if (currentUser.role === 'ADMIN' && activeTab === 'driver-portal') {
      setActiveTab('admin-dashboard');
    }
  }, [currentUser]);

  // Initial load
  useEffect(() => {
    fetchData();

    // Setup real-time listeners if Firebase is configured
    if (isFirebaseConfigured) {
      const unsubBins = firebaseService.subscribeBins((liveBins) => {
        if (liveBins && liveBins.length > 0) {
          setBins(liveBins);
          apiService.getOverviewMetrics().then(setMetrics);
        }
      });

      const unsubTasks = firebaseService.subscribeTasks((liveTasks) => {
        if (liveTasks && liveTasks.length > 0) {
          setTasks(liveTasks);
          apiService.getOverviewMetrics().then(setMetrics);
        }
      });

      return () => {
        unsubBins();
        unsubTasks();
      };
    }
  }, []);

  const fetchData = async () => {
    const [fetchedBins, fetchedTasks, fetchedMetrics] = await Promise.all([
      apiService.getBins(),
      apiService.getTasks(),
      apiService.getOverviewMetrics()
    ]);
    setBins(fetchedBins);
    setTasks(fetchedTasks);
    setMetrics(fetchedMetrics);
  };

  const handleSimulateTick = async () => {
    setIsSimulating(true);
    const updatedBins = await apiService.triggerIoTTick();
    setBins(updatedBins);
    const updatedMetrics = await apiService.getOverviewMetrics();
    setMetrics(updatedMetrics);
    setTimeout(() => setIsSimulating(false), 600);
  };

  const handleAddBin = async (binData) => {
    const created = await apiService.createBin(binData);
    setBins(prev => [...prev, created]);
    const updatedMetrics = await apiService.getOverviewMetrics();
    setMetrics(updatedMetrics);
  };

  const handleEmptyBin = async (binId) => {
    const updated = await apiService.emptyBin(binId);
    setBins(prev => prev.map(b => b.id === binId ? updated : b));
    const updatedMetrics = await apiService.getOverviewMetrics();
    setMetrics(updatedMetrics);
  };

  const handleDeleteBin = async (binId) => {
    await apiService.deleteBin(binId);
    setBins(prev => prev.filter(b => b.id !== binId));
    const updatedMetrics = await apiService.getOverviewMetrics();
    setMetrics(updatedMetrics);
  };

  const handleClearAllBins = async () => {
    if (window.confirm("Are you sure you want to clear all smart bins and start with an empty database?")) {
      await apiService.clearAllBins();
      setBins([]);
      const updatedMetrics = await apiService.getOverviewMetrics();
      setMetrics(updatedMetrics);
    }
  };

  const handleCreateTask = async (taskData) => {
    const created = await apiService.createTask(taskData);
    setTasks(prev => [created, ...prev]);
    const updatedMetrics = await apiService.getOverviewMetrics();
    setMetrics(updatedMetrics);
  };

  const handleUpdateTaskStatus = async (taskId, status, notes, wasteKg) => {
    const updated = await apiService.updateTaskStatus(taskId, status, notes, wasteKg);
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    fetchData();
  };

  const criticalCount = bins.filter(b => b.currentFillLevel >= 80).length;
  const activeTaskCount = tasks.filter(t => t.status !== 'COMPLETED').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSimulateTick={handleSimulateTick}
        isSimulating={isSimulating}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'admin-dashboard' && (
          <AdminDashboard
            metrics={metrics}
            bins={bins}
            tasks={tasks}
            onEmptyBin={handleEmptyBin}
            onCreateTask={handleCreateTask}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'bins' && (
          <BinManagementPage
            bins={bins}
            onAddBin={handleAddBin}
            onEmptyBin={handleEmptyBin}
            onDeleteBin={handleDeleteBin}
            onClearAllBins={handleClearAllBins}
          />
        )}

        {activeTab === 'driver-portal' && (
          <DriverTasksPage
            tasks={tasks}
            onUpdateTaskStatus={handleUpdateTaskStatus}
          />
        )}

        {activeTab === 'iot-telemetry' && (
          <IoTMonitorPage
            bins={bins}
            onSimulateTick={handleSimulateTick}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsPage
            metrics={metrics}
          />
        )}
      </main>

      <footer className="app-footer">
        BinFlow Tracker Smart Waste Management System &copy; {new Date().getFullYear()} — Municipal Environmental Operations Platform
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        criticalCount={criticalCount}
        activeTaskCount={activeTaskCount}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
