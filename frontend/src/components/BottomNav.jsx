import React from 'react';
import { LayoutDashboard, Trash2, Truck, Radio, BarChart2 } from 'lucide-react';

export const BottomNav = ({ activeTab, setActiveTab, criticalCount = 0, activeTaskCount = 0 }) => {
  const navItems = [
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
      id: 'driver-portal',
      label: 'Driver',
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
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart2,
      hasBadge: false
    }
  ];

  return (
    <div className="bottom-nav mobile-only" role="navigation" aria-label="Mobile Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div className="bottom-nav-icon-box">
              <Icon size={20} strokeWidth={isActive ? 2.3 : 1.8} />
              {item.hasBadge && <span className="bottom-nav-badge" />}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
