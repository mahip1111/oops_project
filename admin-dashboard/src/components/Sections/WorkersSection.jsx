import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  Plus,
  Bot,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function WorkersSection({
  metrics,
  workers = [],
  onUpdateWorkerStatus,
  onOpenCreateTaskModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const defaultWorkersList = [
    { id: 'AGV-101', name: 'AGV Pod Alpha', department: 'PICKING', role: 'AGV Autonomous Pod', hub: 'BOM-04', status: 'available', activeTask: 'None (Idle in Dock 04)', completedTasks: 48, avgTaskTimeSec: 14, efficiency: 99.2, successRate: 99.8 },
    { id: 'AGV-102', name: 'AGV Pod Beta', department: 'PICKING', role: 'AGV Autonomous Pod', hub: 'BOM-04', status: 'busy', activeTask: 'Pick MacBook Pro 14" (Aisle 04-B)', completedTasks: 42, avgTaskTimeSec: 16, efficiency: 98.7, successRate: 99.1 },
    { id: 'AGV-103', name: 'AGV Pod Gamma', department: 'PICKING', role: 'AGV Autonomous Pod', hub: 'DEL-01', status: 'available', activeTask: 'None (Idle in Dock 01)', completedTasks: 51, avgTaskTimeSec: 13, efficiency: 99.0, successRate: 99.5 },
    { id: 'WRK-201', name: 'Aarav Sharma', department: 'PICKING', role: 'Station Picker', hub: 'BOM-04', status: 'busy', activeTask: 'Pick Magic Mouse (Aisle 02-C)', completedTasks: 65, avgTaskTimeSec: 22, efficiency: 96.5, successRate: 98.4 },
    { id: 'WRK-202', name: 'Priya Nair', department: 'QUALITY_CHECK', role: 'Lead QC Inspector', hub: 'BOM-04', status: 'available', activeTask: 'Laser Barcode Calibration', completedTasks: 72, avgTaskTimeSec: 18, efficiency: 99.8, successRate: 99.9 },
    { id: 'WRK-203', name: 'Rahul Verma', department: 'PACKING', role: 'Packaging Specialist', hub: 'BOM-04', status: 'available', activeTask: 'Thermal Packaging Pro', completedTasks: 58, avgTaskTimeSec: 24, efficiency: 97.4, successRate: 98.9 },
    { id: 'WRK-204', name: 'Sneha Patel', department: 'SHIPPING', role: 'Courier Dispatch Lead', hub: 'DEL-01', status: 'available', activeTask: 'Air Express Dispatch Gate', completedTasks: 61, avgTaskTimeSec: 15, efficiency: 99.1, successRate: 99.6 },
    { id: 'AGV-104', name: 'AGV Pod Delta', department: 'PICKING', role: 'AGV Autonomous Pod', hub: 'HYD-02', status: 'offline', activeTask: 'Battery Re-charge Cycle', completedTasks: 30, avgTaskTimeSec: 18, efficiency: 94.0, successRate: 96.5 }
  ];

  const currentWorkers = workers.length > 0 ? workers.map((w, i) => ({
    ...defaultWorkersList[i % defaultWorkersList.length],
    ...w,
    department: w.department || defaultWorkersList[i % defaultWorkersList.length].department,
    avgTaskTimeSec: w.avgTaskTimeSec || defaultWorkersList[i % defaultWorkersList.length].avgTaskTimeSec,
    successRate: w.successRate || defaultWorkersList[i % defaultWorkersList.length].successRate
  })) : defaultWorkersList;

  const filteredWorkers = currentWorkers.filter((wrk) => {
    const matchesSearch =
      wrk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wrk.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wrk.hub.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wrk.activeTask && wrk.activeTask.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (wrk.currentTaskId && wrk.currentTaskId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'all' || wrk.department === selectedDept;
    const matchesStatus = selectedStatus === 'all' || wrk.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  const availableCount = currentWorkers.filter((w) => w.status === 'available').length;
  const busyCount = currentWorkers.filter((w) => w.status === 'busy').length;
  const offlineCount = currentWorkers.filter((w) => w.status === 'offline').length;

  const getDeptBadge = (dept) => {
    switch (dept) {
      case 'PICKING': return <span className="badge badge-warning">Picking</span>;
      case 'PACKING': return <span className="badge badge-purple">Packing</span>;
      case 'QUALITY_CHECK': return <span className="badge badge-rose">QC Inspection</span>;
      case 'SHIPPING': return <span className="badge badge-info">Shipping</span>;
      default: return <span className="badge badge-neutral">{dept}</span>;
    }
  };

  const getWorkerStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'available' || s === 'idle') return <span className="badge badge-success">● Available</span>;
    if (s === 'busy') return <span className="badge badge-info">● Busy</span>;
    return <span className="badge badge-neutral">● Offline</span>;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Workforce Fleet & AGV Robotics
            </h1>
            <span className="badge badge-info">
              PRD Section 7
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Department routing, current active task, completed tasks today, average task speed, and success rates.
          </p>
        </div>

        {onOpenCreateTaskModal && (
          <button onClick={onOpenCreateTaskModal} className="btn-primary">
            <Plus size={14} />
            <span>Assign Task to Worker</span>
          </button>
        )}
      </div>

      {/* Status KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'available' ? 'all' : 'available')}
          className="kpi-card"
          style={{
            borderColor: selectedStatus === 'available' ? 'var(--success)' : 'var(--border)',
            background: selectedStatus === 'available' ? 'var(--success-subtle)' : 'var(--surface)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Available Fleet
            </span>
            <UserCheck size={16} color="var(--success)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--success)' }}>
            {availableCount}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            Idle & Ready for Wave Dispatch
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus(selectedStatus === 'busy' ? 'all' : 'busy')}
          className="kpi-card"
          style={{
            borderColor: selectedStatus === 'busy' ? 'var(--primary)' : 'var(--border)',
            background: selectedStatus === 'busy' ? 'var(--primary-subtle)' : 'var(--surface)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active on Tasks
            </span>
            <Clock size={16} color="var(--primary)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--primary)' }}>
            {busyCount}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            Operating in pick/pack aisles
          </div>
        </div>

        <div
          onClick={() => setSelectedStatus(selectedStatus === 'offline' ? 'all' : 'offline')}
          className="kpi-card"
          style={{
            borderColor: selectedStatus === 'offline' ? 'var(--warning)' : 'var(--border)',
            background: selectedStatus === 'offline' ? 'var(--warning-subtle)' : 'var(--surface)',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Maintenance / Charging
            </span>
            <UserX size={16} color="var(--warning)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--warning)' }}>
            {offlineCount}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            Battery swap & scheduled break
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="panel-card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by worker name, role, pod ID, or hub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['all', 'PICKING', 'PACKING', 'QUALITY_CHECK', 'SHIPPING'].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              style={{
                background: selectedDept === dept ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: selectedDept === dept ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                padding: '5px 12px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Workers Roster Table */}
      <div className="panel-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name / Model</th>
                <th>Type</th>
                <th>Department</th>
                <th>Hub</th>
                <th>Current Active Task</th>
                <th>Avg Speed</th>
                <th>Success Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkers.map((w) => (
                <tr key={w.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{w.id}</td>
                  <td style={{ fontWeight: 600 }}>{w.name}</td>
                  <td>
                    {w.id.startsWith('AGV') ? (
                      <span className="badge badge-info"><Bot size={12} /> AGV Bot</span>
                    ) : (
                      <span className="badge badge-neutral"><Users size={12} /> Specialist</span>
                    )}
                  </td>
                  <td>{getDeptBadge(w.department)}</td>
                  <td><span style={{ fontWeight: 600 }}>{w.hub}</span></td>
                  <td>
                    <span style={{ color: w.activeTask?.includes('None') ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: '12px' }}>
                      {w.activeTask || 'None (Idle)'}
                    </span>
                  </td>
                  <td className="tabular-nums" style={{ fontWeight: 600 }}>{w.avgTaskTimeSec}s</td>
                  <td>
                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>
                      {w.successRate}%
                    </span>
                  </td>
                  <td>{getWorkerStatusBadge(w.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
