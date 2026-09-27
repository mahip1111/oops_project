import React from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  CheckSquare,
  Building2,
  Users,
  Database,
  CalendarClock,
  Sliders,
  TrendingUp,
  Activity,
  Settings,
  ShieldAlert,
  Cpu,
  X
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  metrics,
  reviewQueueCount = 2,
  kolkataAlert = true,
  activeStrategy = 'Hybrid',
  isOpen = false,
  onClose
}) {
  // PRD Section 2: Clean, Unified Navigation Items (Monochromatic Elegance)
  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      count: metrics?.orders?.total ? metrics.orders.total.toLocaleString() : '12,487'
    },
    {
      id: 'fulfillment',
      label: 'Fulfillment',
      icon: Boxes,
      badge: '8 Stages'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      count: `${metrics?.tasks?.pending ?? 420}`
    },
    {
      id: 'warehouses',
      label: 'Warehouses',
      icon: Building2,
      count: '4 Hubs',
      alert: kolkataAlert
    },
    {
      id: 'workers',
      label: 'Workers',
      icon: Users,
      count: `${metrics?.workers?.available ?? 18}`
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Database,
      badge: 'Stock'
    },
    {
      id: 'scheduling',
      label: 'Scheduling',
      icon: CalendarClock,
      badge: activeStrategy
    },
    {
      id: 'simulation',
      label: 'Simulation',
      icon: Sliders,
      badge: '50K'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: TrendingUp,
      badge: '96.8%'
    },
    {
      id: 'events',
      label: 'System Events',
      icon: Activity,
      badge: 'Stream'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: 'RBAC'
    }
  ];

  return (
    <aside
      className={`admin-sidebar ${isOpen ? 'sidebar-open' : ''}`}
      style={{
        width: '240px',
        backgroundColor: '#0F172A',
        borderRight: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        userSelect: 'none',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 1000
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: '60px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1E293B',
          background: '#0F172A',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
            }}
          >
            <Cpu size={18} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
              QuickFlow
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, letterSpacing: '0.5px' }}>
              OPERATIONS CONSOLE
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: 'rgba(22, 163, 74, 0.12)',
              border: '1px solid rgba(22, 163, 74, 0.22)',
              borderRadius: '12px',
              padding: '2px 8px'
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                boxShadow: '0 0 4px rgba(22, 163, 74, 0.5)',
                display: 'inline-block'
              }}
            />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#86EFAC' }}>Live</span>
          </div>

          {/* Close drawer button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '6px',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="admin-sidebar-close"
              title="Close Navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Section */}
      <nav
        style={{
          flex: 1,
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          overflowY: 'auto'
        }}
      >
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.8px',
            color: '#64748B',
            padding: '6px 10px 4px',
            textTransform: 'uppercase'
          }}
        >
          Operations Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isLiveBadge = item.badge === 'Live';
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? '#172554' : 'transparent',
                borderLeft: isActive ? '3px solid #2563EB' : '3px solid transparent',
                color: isActive ? '#F8FAFC' : '#94A3B8',
                transition: 'all 0.12s ease',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#F1F5F9';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#94A3B8';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0 }}>
                <Icon size={16} color={isActive ? '#3B82F6' : '#64748B'} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#F8FAFC' : '#94A3B8',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.label}
                </span>
              </div>

              {/* Badges / Counters */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
                {item.alert && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#DC2626',
                      boxShadow: '0 0 4px rgba(220, 38, 38, 0.4)',
                      display: 'inline-block'
                    }}
                    title="Kolkata hub capacity alert (>90%)"
                  />
                )}
                {item.count && (
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 600,
                      color: isActive ? '#93C5FD' : '#94A3B8',
                      backgroundColor: isActive ? 'rgba(37, 99, 235, 0.18)' : 'rgba(148, 163, 184, 0.08)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {item.count}
                  </span>
                )}
                {item.badge && !item.count && (
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: isLiveBadge
                        ? '#86EFAC'
                        : isActive
                        ? '#93C5FD'
                        : '#94A3B8',
                      backgroundColor: isLiveBadge
                        ? 'rgba(22, 163, 74, 0.14)'
                        : isActive
                        ? 'rgba(37, 99, 235, 0.18)'
                        : 'rgba(148, 163, 184, 0.08)',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Review Queue Footer Action */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #1E293B',
          background: '#0F172A'
        }}
      >
        <button
          onClick={() => {
            setActiveTab('reviewQueue');
            if (onClose) onClose();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            borderRadius: '6px',
            border: reviewQueueCount > 0 ? '1px solid rgba(220, 38, 38, 0.22)' : '1px solid #1E293B',
            backgroundColor: reviewQueueCount > 0 ? 'rgba(220, 38, 38, 0.08)' : 'rgba(255,255,255,0.02)',
            color: reviewQueueCount > 0 ? '#FCA5A5' : '#94A3B8',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={15} color={reviewQueueCount > 0 ? '#DC2626' : '#64748B'} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: reviewQueueCount > 0 ? '#FCA5A5' : '#94A3B8' }}>
              Review Queue
            </span>
          </div>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 700,
              backgroundColor: reviewQueueCount > 0 ? 'rgba(220, 38, 38, 0.22)' : 'rgba(148, 163, 184, 0.08)',
              color: reviewQueueCount > 0 ? '#FCA5A5' : '#94A3B8',
              border: reviewQueueCount > 0 ? '1px solid rgba(220, 38, 38, 0.3)' : '1px solid transparent',
              padding: '1px 6px',
              borderRadius: '4px'
            }}
          >
            {reviewQueueCount}
          </span>
        </button>
      </div>
    </aside>
  );
}
