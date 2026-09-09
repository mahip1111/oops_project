import React, { useState, useEffect } from 'react';
import {
  Store,
  Moon,
  Sun,
  Radio,
  ChevronRight
} from 'lucide-react';

const TAB_TITLES = {
  overview: 'Operations Overview',
  orders: 'Orders Telemetry & Management',
  fulfillment: 'End-to-End Fulfillment Pipeline & Waves',
  tasks: 'Task Pipelines & Execution Queue',
  warehouses: 'Warehouse Logistics & Network Topology',
  workers: 'Workforce Fleet & AGV Robotics',
  inventory: 'Warehouse Inventory & Stock Allocation',
  scheduling: 'Dynamic Scheduling & Priority Escalation',
  simulation: 'High-Concurrency Simulation Engine (50K Orders)',
  analytics: 'SLA Compliance & Throughput Analytics',
  events: 'Auditable System Event Stream',
  settings: 'RBAC Security Matrix & System Configuration',
  reviewQueue: 'Resilience & Quarantined Task Review'
};

export default function AdminNavbar({
  activeTab = 'overview',
  metrics,
  isLiveSimulating,
  setIsLiveSimulating,
  onOpenRebalanceModal,
  onOpenCreateTaskModal,
  onOpenDispatchModal,
  backendStatus,
  isDarkMode,
  setIsDarkMode
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentTitle = TAB_TITLES[activeTab] || 'Operations Overview';

  return (
    <header
      style={{
        height: '60px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      {/* Left: Breadcrumb & Active View Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>QuickFlow</span>
          <ChevronRight size={12} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-muted)' }}>Command Center</span>
          <ChevronRight size={12} color="var(--text-muted)" />
        </div>
        <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
          {currentTitle}
        </div>
      </div>

      {/* Center: System Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border)',
            padding: '4px 12px',
            borderRadius: '6px'
          }}
        >
          <span className="pulse-dot" style={{ backgroundColor: 'var(--success)' }}></span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>All Systems Operational</span>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span className="tabular-nums" style={{ color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
            {timeStr}
          </span>
        </div>
      </div>

      {/* Right: Utility actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Customer Storefront Link */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{
            fontSize: '12px',
            padding: '5px 10px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
          title="Open Customer Storefront (Port 3000)"
        >
          <Store size={13} color="var(--primary)" />
          <span>Customer Store ↗</span>
        </a>

        {/* Live Simulation Switch */}
        <button
          onClick={() => setIsLiveSimulating(!isLiveSimulating)}
          className="btn-secondary"
          style={{
            fontSize: '12px',
            padding: '5px 10px',
            color: isLiveSimulating ? 'var(--primary)' : 'var(--text-secondary)',
            borderColor: isLiveSimulating ? 'var(--primary)' : 'var(--border)'
          }}
          title="Toggle live telemetry feed"
        >
          <Radio size={12} />
          <span>{isLiveSimulating ? 'Live' : 'Paused'}</span>
        </button>

        {/* Theme Toggle */}
        {setIsDarkMode && (
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="btn-secondary"
            style={{
              padding: '6px 8px',
              color: 'var(--text-secondary)'
            }}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun size={14} color="#F59E0B" /> : <Moon size={14} />}
          </button>
        )}
      </div>
    </header>
  );
}
