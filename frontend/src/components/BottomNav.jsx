import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Trash2, Truck, Radio, BarChart2, LogOut } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab, criticalCount = 0, activeTaskCount = 0 }) => {
  const { currentUser, logout } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const adminItems = [
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      hasBadge: criticalCount > 0
    },
    {
      id: 'bins',
      label: 'Bins',
      icon: Trash2,
      hasBadge: criticalCount > 0
    },
    {
      id: 'iot-telemetry',
      label: 'Live IoT',
      icon: Radio,
      hasBadge: false
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart2,
      hasBadge: false
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      hasBadge: false,
      isLogout: true
    }
  ];

  const driverItems = [
    {
      id: 'driver-portal',
      label: 'My Trips',
      icon: Truck,
      hasBadge: activeTaskCount > 0
    },
    {
      id: 'iot-telemetry',
      label: 'Live IoT',
      icon: Radio,
      hasBadge: false
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      hasBadge: false,
      isLogout: true
    }
  ];

  const navItems = isAdmin ? adminItems : driverItems;

  return (
    <div className="bottom-nav mobile-only" role="navigation" aria-label="Mobile Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        const handleClick = () => {
          if (item.isLogout) {
            logout();
          } else {
            setActiveTab(item.id);
          }
        };

        return (
          <button
            key={item.id}
            onClick={handleClick}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
            style={item.isLogout ? { color: '#f87171' } : {}}
          >
            <div className="bottom-nav-icon-box">
              <Icon size={19} strokeWidth={isActive ? 2.3 : 1.8} />
              {item.hasBadge && <span className="bottom-nav-badge" />}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
