import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Users,
  Lock,
  Cpu,
  CheckCircle2,
  Sliders,
  Server,
  Save
} from 'lucide-react';

export default function SettingsSection() {
  const [activeRole, setActiveRole] = useState('ADMIN');
  const [threadCount, setThreadCount] = useState(4);
  const [maxRetries, setMaxRetries] = useState(3);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const rolesMatrix = [
    {
      role: 'CUSTOMER',
      badgeClass: 'badge-info',
      description: 'Customer Storefront User',
      permissions: [
        'Browse Product Catalog',
        'Place New Orders',
        'View & Track Personal Orders (PIN: 7510)',
        'Receive Order State WebSocket Notifications'
      ],
      restricted: [
        'Access Internal C++ Cost Scores',
        'Trigger Warehouse Rebalancing',
        'Modify Schedulers & Task Queues',
        'Run Multi-Order Simulation Engine'
      ]
    },
    {
      role: 'WAREHOUSE_MANAGER',
      badgeClass: 'badge-warning',
      description: 'SuperHub Operations Lead (Delhi, Mumbai, Hyderabad, Kolkata)',
      permissions: [
        'View Hub Inventory & Stock Quotas',
        'Trigger Inter-Hub Volume Rebalancing',
        'Manage Worker Roster & AGV Dispatch',
        'Execute Optical QC Verification & Overrides'
      ],
      restricted: [
        'Modify Global Decision Core Algorithms',
        'Alter Multi-Tenant Security & RBAC Roles'
      ]
    },
    {
      role: 'ADMIN',
      badgeClass: 'badge-success',
      description: 'Platform SuperAdmin & Logistics Engineer',
      permissions: [
        'Full Read & Write Access to All Orders',
        'Switch Scheduling Strategies (FIFO, Priority, EDF, Hybrid)',
        'Run 50,000 Order What-If Simulations',
        'Inspect Raw C++ Mutex Locks & ThreadPool',
        'System Audit Event Ledger'
      ],
      restricted: []
    }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              System Settings, Security & RBAC Policies
            </h1>
            <span className="badge badge-success">
              PRD Section 12
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            JWT authentication verification, role-based access boundaries (CUSTOMER / WAREHOUSE_MANAGER / ADMIN), and C++ engine tuning.
          </p>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div
          className="panel-card"
          style={{
            padding: '12px 16px',
            borderLeft: '4px solid var(--success)',
            background: 'var(--success-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <CheckCircle2 size={16} color="var(--success)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>
            System configurations updated and synchronized with C++ Execution Core!
          </span>
        </div>
      )}

      {/* RBAC Role Permissions Matrix */}
      <div className="panel-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Shield size={18} color="var(--primary)" />
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Role-Based Access Control (RBAC Matrix)
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {rolesMatrix.map((r) => (
            <div
              key={r.role}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${r.badgeClass}`}>
                  {r.role}
                </span>
                <Lock size={14} color="var(--text-muted)" />
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {r.description}
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Allowed Operations
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {r.permissions.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              {r.restricted.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Restricted Endpoints
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {r.restricted.map((res, idx) => (
                      <li key={idx}>{res}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* C++ Engine Threading & Resilience Config */}
      <div className="panel-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Cpu size={18} color="var(--primary)" />
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            C++ Engine & Concurrency Parameters
          </h2>
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Thread Pool Concurrency Workers
            </label>
            <input
              type="number"
              min="1"
              max="16"
              value={threadCount}
              onChange={(e) => setThreadCount(Number(e.target.value))}
              className="admin-input"
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Standard: 4 core worker threads in parallel.
            </span>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Maximum Task Retry Threshold
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={maxRetries}
              onChange={(e) => setMaxRetries(Number(e.target.value))}
              className="admin-input"
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              Tasks exceeding limit are quarantined into Review Queue.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              <Save size={14} />
              <span>Save System Config</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
