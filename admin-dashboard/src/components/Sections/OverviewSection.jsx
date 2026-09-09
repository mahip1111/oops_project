import React, { useState } from 'react';
import {
  Package,
  Building2,
  Users,
  CheckSquare,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Zap,
  Clock,
  ShieldCheck,
  ChevronRight,
  Sliders,
  RefreshCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Check,
  Copy,
  Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OverviewSection({
  metrics,
  orders = [],
  workers = [],
  tasks = [],
  setActiveTab,
  onOpenRebalanceModal,
  onOpenDispatchModal,
  onRetryFailedOrder
}) {
  const [chartRange, setChartRange] = useState('24h');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(null);
  const [selectedHubInspect, setSelectedHubInspect] = useState(null);
  const [routeTracerOrder, setRouteTracerOrder] = useState(null);
  const [resolvedAlerts, setResolvedAlerts] = useState({});

  // Warehouse list from metrics
  const warehousesList = metrics?.warehouses || [
    { city: 'Delhi', capacityPercentage: 72, activeOrders: 1820, maxPallets: 20000, occupiedPallets: 14400, staff: 14, agv: 45, throughput: 820 },
    { city: 'Mumbai', capacityPercentage: 84, activeOrders: 2140, maxPallets: 25000, occupiedPallets: 21000, staff: 18, agv: 62, throughput: 1140 },
    { city: 'Hyderabad', capacityPercentage: 61, activeOrders: 1420, maxPallets: 18000, occupiedPallets: 10980, staff: 12, agv: 38, throughput: 690 },
    { city: 'Kolkata', capacityPercentage: 96, activeOrders: 2890, maxPallets: 22000, occupiedPallets: 21120, staff: 13, agv: 37, throughput: 580 }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.2 } });
    }, 400);
  };

  const handleCopyId = (id) => {
    navigator.clipboard?.writeText(id);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 1800);
  };

  const handleResolveAlert = (alertKey, customAction) => {
    setResolvedAlerts((prev) => ({ ...prev, [alertKey]: true }));
    if (customAction) customAction();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
  };

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !orderSearch ||
      o.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.city?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.hub?.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus =
      orderStatusFilter === 'All' ||
      (orderStatusFilter === 'Processing' && o.status === 'Processing') ||
      (orderStatusFilter === 'Urgent' && (o.priority === 'Urgent' || o.priority === 'Same Day')) ||
      (orderStatusFilter === 'Completed' && (o.status === 'Completed' || o.status === 'Delivered')) ||
      (orderStatusFilter === 'Failed' && o.status === 'Failed');

    return matchesSearch && matchesStatus;
  });

  // Chart data based on selected range
  const chartPoints = {
    '24h': [
      { label: '00:00', orders: 120, fulfilled: 110, delayed: 4, velocity: '14/min' },
      { label: '04:00', orders: 85, fulfilled: 80, delayed: 2, velocity: '9/min' },
      { label: '08:00', orders: 240, fulfilled: 220, delayed: 8, velocity: '28/min' },
      { label: '12:00', orders: 410, fulfilled: 385, delayed: 14, velocity: '48/min' },
      { label: '16:00', orders: 360, fulfilled: 345, delayed: 9, velocity: '42/min' },
      { label: '20:00', orders: 290, fulfilled: 275, delayed: 6, velocity: '35/min' },
      { label: 'Now', orders: 340, fulfilled: 325, delayed: 5, velocity: '39/min' }
    ],
    '7d': [
      { label: 'Mon', orders: 1820, fulfilled: 1740, delayed: 35, velocity: '210/hr' },
      { label: 'Tue', orders: 2100, fulfilled: 2020, delayed: 40, velocity: '240/hr' },
      { label: 'Wed', orders: 1950, fulfilled: 1890, delayed: 28, velocity: '225/hr' },
      { label: 'Thu', orders: 2240, fulfilled: 2160, delayed: 42, velocity: '260/hr' },
      { label: 'Fri', orders: 2480, fulfilled: 2390, delayed: 48, velocity: '290/hr' },
      { label: 'Sat', orders: 2600, fulfilled: 2510, delayed: 52, velocity: '305/hr' },
      { label: 'Sun', orders: 2100, fulfilled: 2040, delayed: 30, velocity: '245/hr' }
    ],
    '30d': [
      { label: 'W1', orders: 14200, fulfilled: 13700, delayed: 210, velocity: '1.9k/day' },
      { label: 'W2', orders: 15600, fulfilled: 15100, delayed: 240, velocity: '2.1k/day' },
      { label: 'W3', orders: 16800, fulfilled: 16300, delayed: 220, velocity: '2.3k/day' },
      { label: 'W4', orders: 18100, fulfilled: 17600, delayed: 260, velocity: '2.5k/day' }
    ]
  };

  const activePoints = chartPoints[chartRange];
  const maxVal = Math.max(...activePoints.map((p) => Math.max(p.orders, p.fulfilled))) * 1.15;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. PAGE HEADER WITH SIMULATION CONTROLS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', margin: 0 }}>
            Operations Overview
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px', margin: 0 }}>
            Real-time view of orders, warehouse capacity, workforce and dispatch activity.
          </p>
        </div>

        {/* Right side interactive simulator toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              handleRefresh();
              onOpenDispatchModal();
            }}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px', color: 'var(--primary)', borderColor: 'var(--primary-border)' }}
            title="Inject batch wave dispatch directly into active queue"
          >
            <Flame size={13} color="var(--primary)" />
            <span>Rush Hour Wave</span>
          </button>

          <button
            onClick={handleRefresh}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '6px 10px' }}
            title="Sync telemetry metrics"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* 2. SYSTEM STATUS BAR */}
      <div
        className="panel-card"
        style={{
          height: '46px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          borderLeft: '4px solid var(--success)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <span className="pulse-dot" style={{ backgroundColor: 'var(--success)' }}></span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>All Systems Operational</span>
          <span className="badge badge-success">
            99.98% Uptime
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('warehouses')}>
            <strong style={{ color: 'var(--text-primary)' }}>4</strong> hubs online
          </div>
          <span style={{ color: 'var(--border)' }}>|</span>
          <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('workers')}>
            <strong style={{ color: 'var(--success)' }}>{metrics?.workers?.available ?? 18}</strong> workers available
          </div>
          <span style={{ color: 'var(--border)' }}>|</span>
          <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('tasks')}>
            <strong style={{ color: 'var(--warning)' }}>{metrics?.tasks?.pending ?? 420}</strong> tasks pending
          </div>
        </div>
      </div>

      {/* 3. KPI SECTION - 4 PRIMARY METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
        
        {/* KPI 1: TOTAL ORDERS */}
        <div
          className="kpi-card"
          onClick={() => setActiveTab('orders')}
          style={{ cursor: 'pointer' }}
          title="Click to view Orders Center"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              TOTAL ORDERS
            </span>
            <Package size={16} color="var(--primary)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {metrics?.orders?.total ? metrics.orders.total.toLocaleString() : '12,487'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
                ↑ 12.4%
              </span>
              <span style={{ color: 'var(--text-muted)' }}>vs last period</span>
            </div>
            <svg width="48" height="16" style={{ opacity: 0.7 }}>
              <path d="M 0,14 Q 12,2 24,10 T 48,2" fill="none" stroke="var(--primary)" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* KPI 2: ACTIVE ORDERS */}
        <div
          className="kpi-card"
          onClick={() => setActiveTab('orders')}
          style={{ cursor: 'pointer' }}
          title="Click to inspect active queue"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              ACTIVE ORDERS
            </span>
            <Clock size={16} color="var(--info)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--info)', lineHeight: 1.1 }}>
            {metrics?.orders?.processing ? metrics.orders.processing.toLocaleString() : '3,218'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
                ↑ 8.2%
              </span>
              <span style={{ color: 'var(--text-muted)' }}>processing</span>
            </div>
            <svg width="48" height="16" style={{ opacity: 0.7 }}>
              <path d="M 0,12 Q 16,14 28,4 T 48,2" fill="none" stroke="var(--info)" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* KPI 3: FULFILLMENT TIME */}
        <div
          className="kpi-card"
          onClick={() => setActiveTab('analytics')}
          style={{ cursor: 'pointer' }}
          title="Click to view SLA Analytics"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              FULFILLMENT TIME
            </span>
            <Zap size={16} color="var(--warning)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--warning)', lineHeight: 1.1 }}>
            2.4 hr
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
                ↓ 14%
              </span>
              <span style={{ color: 'var(--text-muted)' }}>improvement</span>
            </div>
            <svg width="48" height="16" style={{ opacity: 0.7 }}>
              <path d="M 0,4 Q 14,14 26,6 T 48,14" fill="none" stroke="var(--warning)" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* KPI 4: SLA COMPLIANCE */}
        <div
          className="kpi-card"
          onClick={() => setActiveTab('analytics')}
          style={{ cursor: 'pointer' }}
          title="Target: 95.0% SLA"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              SLA COMPLIANCE
            </span>
            <ShieldCheck size={16} color="var(--success)" />
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--success)', lineHeight: 1.1 }}>
            96.8%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
                ↑ 2.1%
              </span>
              <span style={{ color: 'var(--text-muted)' }}>target: 95%</span>
            </div>
            <svg width="48" height="16" style={{ opacity: 0.7 }}>
              <path d="M 0,14 Q 14,2 28,6 T 48,1" fill="none" stroke="var(--success)" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT GRID: 62% LEFT (Chart) / 38% RIGHT (Live Ops) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        
        {/* LEFT: Order Volume & Fulfillment Chart */}
        <div className="panel-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', height: '340px', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Order Volume & Fulfillment
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Hover curve to inspect routing velocity & delays
              </div>
            </div>

            {/* Date Range Switcher */}
            <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border)', borderRadius: '6px', padding: '2px' }}>
              {['24h', '7d', '30d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setChartRange(range)}
                  style={{
                    background: chartRange === range ? 'var(--primary)' : 'transparent',
                    color: chartRange === range ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: chartRange === range ? 700 : 500,
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 9px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive SVG Line Chart */}
          <div
            style={{ position: 'relative', width: '100%', height: '190px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onMouseLeave={() => setHoveredChartPoint(null)}
          >
            <svg
              viewBox="0 0 500 140"
              style={{ width: '100%', height: '160px', overflow: 'visible' }}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="orderGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Subtle Grid Lines */}
              <line x1="0" y1="35" x2="500" y2="35" stroke="var(--border)" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border)" strokeDasharray="3 3" />
              <line x1="0" y1="125" x2="500" y2="125" stroke="var(--border)" strokeDasharray="3 3" />

              {/* Area & Line for Orders */}
              {(() => {
                const pts = activePoints.map((p, idx) => {
                  const x = (idx / (activePoints.length - 1)) * 500;
                  const y = 130 - (p.orders / maxVal) * 110;
                  return `${x},${y}`;
                });
                const areaPath = `M 0,130 L ${pts.join(' L ')} L 500,130 Z`;
                const linePath = `M ${pts.join(' L ')}`;

                const fulfilledPts = activePoints.map((p, idx) => {
                  const x = (idx / (activePoints.length - 1)) * 500;
                  const y = 130 - (p.fulfilled / maxVal) * 110;
                  return `${x},${y}`;
                });
                const fulfilledLine = `M ${fulfilledPts.join(' L ')}`;

                return (
                  <>
                    <path d={areaPath} fill="url(#orderGrad)" />
                    <path d={linePath} fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
                    <path d={fulfilledLine} fill="none" stroke="#10B981" strokeWidth="1.8" strokeDasharray="3 3" />
                    {activePoints.map((p, idx) => {
                      const x = (idx / (activePoints.length - 1)) * 500;
                      const y = 130 - (p.orders / maxVal) * 110;
                      const isHovered = hoveredChartPoint?.idx === idx;
                      return (
                        <g key={idx} onMouseEnter={() => setHoveredChartPoint({ ...p, idx, x, y })}>
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? '6' : '3.5'}
                            fill={isHovered ? '#2563EB' : 'var(--surface)'}
                            stroke="#2563EB"
                            strokeWidth="2"
                            style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                          />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* Interactive Tooltip Card Overlay */}
            {hoveredChartPoint && (
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: `${Math.min(360, Math.max(10, (hoveredChartPoint.idx / (activePoints.length - 1)) * 400))}px`,
                  background: '#0F172A',
                  color: '#FFFFFF',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  boxShadow: 'var(--shadow-modal)',
                  zIndex: 20,
                  pointerEvents: 'none',
                  border: '1px solid #334155'
                }}
              >
                <div style={{ fontWeight: 700, color: '#93C5FD', marginBottom: '2px' }}>
                  {hoveredChartPoint.label} Telemetry
                </div>
                <div>Orders: <strong>{hoveredChartPoint.orders}</strong></div>
                <div>Fulfilled: <strong style={{ color: '#86EFAC' }}>{hoveredChartPoint.fulfilled}</strong></div>
                <div>Delayed: <strong style={{ color: '#FCA5A5' }}>{hoveredChartPoint.delayed}</strong></div>
                <div style={{ color: '#94A3B8', fontSize: '10px', marginTop: '2px' }}>Velocity: {hoveredChartPoint.velocity}</div>
              </div>
            )}

            {/* X-Axis Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
              {activePoints.map((p, idx) => (
                <span
                  key={idx}
                  style={{
                    cursor: 'pointer',
                    fontWeight: hoveredChartPoint?.idx === idx ? 700 : 400,
                    color: hoveredChartPoint?.idx === idx ? 'var(--primary)' : 'var(--text-muted)'
                  }}
                  onMouseEnter={() => setHoveredChartPoint({ ...p, idx })}
                >
                  {p.label}
                </span>
              ))}
            </div>
          </div>

          {/* Compact Legend */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>Orders: <strong style={{ color: 'var(--text-primary)' }}>{metrics?.orders?.total?.toLocaleString() ?? '12,487'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>Fulfilled: <strong style={{ color: 'var(--text-primary)' }}>{metrics?.orders?.completed?.toLocaleString() ?? '8,941'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)' }}></span>
                <span style={{ color: 'var(--text-secondary)' }}>Delayed: <strong style={{ color: 'var(--text-primary)' }}>23</strong></span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('analytics')}
              className="btn-subtle"
              style={{ fontSize: '11.5px' }}
            >
              <span>Full Analytics →</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Live Operations with Quick Dispatches */}
        <div className="panel-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', height: '340px', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Live Operations Feed
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Active workload across automated pipelines
                </div>
              </div>
              <span className="badge badge-success">● Live</span>
            </div>

            {/* 4 Operational Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  height: '42px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="pulse-dot" style={{ backgroundColor: 'var(--primary)', width: '6px', height: '6px' }}></span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>Orders processing</span>
                </div>
                <span className="tabular-nums" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {metrics?.orders?.processing ? metrics.orders.processing.toLocaleString() : '3,218'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  height: '42px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="pulse-dot" style={{ backgroundColor: 'var(--success)', width: '6px', height: '6px' }}></span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>Workers active</span>
                </div>
                <span className="tabular-nums" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--success)' }}>
                  {metrics?.workers?.available ?? 18}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  height: '42px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="pulse-dot" style={{ backgroundColor: 'var(--info)', width: '6px', height: '6px' }}></span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>Robots processing</span>
                </div>
                <span className="tabular-nums" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--info)' }}>
                  {metrics?.tasks?.processing ?? 177}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  height: '42px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="pulse-dot" style={{ backgroundColor: 'var(--warning)', width: '6px', height: '6px' }}></span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>Tasks pending</span>
                </div>
                <span className="tabular-nums" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--warning)' }}>
                  {metrics?.tasks?.pending ?? 420}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
            <button
              onClick={onOpenDispatchModal}
              className="btn-primary"
              style={{ fontSize: '11.5px', padding: '5px 12px' }}
            >
              <Zap size={12} />
              <span>+ Wave (250)</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className="btn-subtle"
              style={{ fontSize: '12px' }}
            >
              <span>View Full Fleet →</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. WAREHOUSE CAPACITY + ATTENTION REQUIRED */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        
        {/* LEFT: Warehouse Capacity with Interactive Hub Inspector */}
        <div className="panel-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Warehouse Capacity
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Pallet load & active routing nodes (click row to inspect)
                </div>
              </div>
              <button
                onClick={onOpenRebalanceModal}
                className="btn-secondary"
                style={{ fontSize: '11.5px', padding: '4px 10px' }}
              >
                <Sliders size={12} />
                <span>Rebalance</span>
              </button>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Hub</th>
                  <th>Capacity</th>
                  <th>Orders</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {warehousesList.map((wh) => {
                  const isOverloaded = wh.capacityPercentage >= 90;
                  const isBusy = wh.capacityPercentage >= 75 && wh.capacityPercentage < 90;
                  return (
                    <tr
                      key={wh.city}
                      style={{ cursor: 'pointer', background: selectedHubInspect?.city === wh.city ? 'var(--primary-subtle)' : 'transparent' }}
                      onClick={() => setSelectedHubInspect(wh)}
                    >
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building2 size={13} color={isOverloaded ? 'var(--danger)' : 'var(--primary)'} />
                          <span>{wh.city}</span>
                        </div>
                      </td>
                      <td className="tabular-nums">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700, color: isOverloaded ? 'var(--danger)' : isBusy ? 'var(--warning)' : 'var(--success)' }}>
                            {wh.capacityPercentage}%
                          </span>
                          <div style={{ width: '40px', height: '5px', background: 'var(--bg-surface-elevated)', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ width: `${wh.capacityPercentage}%`, height: '100%', background: isOverloaded ? 'var(--danger)' : isBusy ? 'var(--warning)' : 'var(--success)', borderRadius: '9999px' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {wh.activeOrders ? wh.activeOrders.toLocaleString() : '1,820'}
                      </td>
                      <td>
                        {isOverloaded ? (
                          <span className="badge badge-danger">Critical</span>
                        ) : isBusy ? (
                          <span className="badge badge-warning">Heavy</span>
                        ) : (
                          <span className="badge badge-success">Optimal</span>
                        )}
                      </td>
                      <td>
                        {isOverloaded ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenRebalanceModal();
                            }}
                            className="btn-danger"
                            style={{ padding: '2px 8px', fontSize: '11px' }}
                          >
                            Rebalance ⚡
                          </button>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Optimal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Hub Telemetry Drawer if clicked */}
          {selectedHubInspect && (
            <div style={{ marginTop: '10px', padding: '10px 12px', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '11.5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{selectedHubInspect.city} Hub:</strong> {selectedHubInspect.occupiedPallets?.toLocaleString()} / {selectedHubInspect.maxPallets?.toLocaleString()} pallets • {selectedHubInspect.staff || 14} staff • {selectedHubInspect.throughput || 820}/hr
              </div>
              <button onClick={() => setSelectedHubInspect(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px' }}>✕</button>
            </div>
          )}
        </div>

        {/* RIGHT: Attention Required */}
        <div className="panel-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} color="var(--warning)" />
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Attention Required
                </div>
              </div>
              <span className="badge badge-warning">
                {4 - Object.keys(resolvedAlerts).length} Actions Pending
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* Alert 1: Kolkata Hub */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: resolvedAlerts.kolkata ? 'var(--success-subtle)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${resolvedAlerts.kolkata ? 'var(--success-border)' : 'var(--border)'}`,
                  borderRadius: '6px'
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: resolvedAlerts.kolkata ? 'var(--success)' : 'var(--text-primary)' }}>
                    {resolvedAlerts.kolkata ? '✓ Kolkata Hub Rebalanced' : '⚠ Kolkata Hub Capacity (96%)'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {resolvedAlerts.kolkata ? 'Transferred 15% load to Hyderabad • Stabilized' : 'Occupancy critical — recommend buffer rebalance'}
                  </div>
                </div>
                {resolvedAlerts.kolkata ? (
                  <span style={{ fontSize: '11.5px', color: 'var(--success)', fontWeight: 700 }}>Resolved ✓</span>
                ) : (
                  <button
                    onClick={() => handleResolveAlert('kolkata', onOpenRebalanceModal)}
                    className="btn-subtle"
                    style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '11.5px' }}
                  >
                    Rebalance →
                  </button>
                )}
              </div>

              {/* Alert 2: SLA Delays */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: resolvedAlerts.sla ? 'var(--success-subtle)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${resolvedAlerts.sla ? 'var(--success-border)' : 'var(--border)'}`,
                  borderRadius: '6px'
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: resolvedAlerts.sla ? 'var(--success)' : 'var(--text-primary)' }}>
                    {resolvedAlerts.sla ? '✓ SLA Express Queue Cleared' : '⚠ SLA Express Delays'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {resolvedAlerts.sla ? '23 orders prioritized for wave dispatch' : '23 orders near delivery SLA cutoff'}
                  </div>
                </div>
                {resolvedAlerts.sla ? (
                  <span style={{ fontSize: '11.5px', color: 'var(--success)', fontWeight: 700 }}>Resolved ✓</span>
                ) : (
                  <button
                    onClick={() => handleResolveAlert('sla', () => setActiveTab('orders'))}
                    className="btn-subtle"
                    style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '11.5px' }}
                  >
                    Review →
                  </button>
                )}
              </div>

              {/* Alert 3: Worker Availability */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: resolvedAlerts.workers ? 'var(--success-subtle)' : 'var(--bg-surface-elevated)',
                  border: `1px solid ${resolvedAlerts.workers ? 'var(--success-border)' : 'var(--border)'}`,
                  borderRadius: '6px'
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: resolvedAlerts.workers ? 'var(--success)' : 'var(--text-primary)' }}>
                    {resolvedAlerts.workers ? '✓ 4 Standby Workers Mobilized' : '⚠ Worker Availability'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {resolvedAlerts.workers ? 'Shift gap covered at Mumbai sorting bay' : '4 workers on scheduled maintenance/break'}
                  </div>
                </div>
                {resolvedAlerts.workers ? (
                  <span style={{ fontSize: '11.5px', color: 'var(--success)', fontWeight: 700 }}>Resolved ✓</span>
                ) : (
                  <button
                    onClick={() => handleResolveAlert('workers', () => setActiveTab('workers'))}
                    className="btn-subtle"
                    style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '11.5px' }}
                  >
                    Investigate →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. RECENT ORDERS TABLE */}
      <div className="panel-card" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Orders
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Real-time dispatches routed by C++ Dijkstra Engine
              </div>
            </div>

            {/* Quick Status Filter Tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border)', borderRadius: '6px', padding: '2px' }}>
              {['All', 'Processing', 'Urgent', 'Completed', 'Failed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setOrderStatusFilter(tab)}
                  style={{
                    background: orderStatusFilter === tab ? 'var(--primary)' : 'transparent',
                    color: orderStatusFilter === tab ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: orderStatusFilter === tab ? 700 : 500,
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '8px', top: '8px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders..."
                className="admin-input"
                style={{ padding: '5px 8px 5px 26px', fontSize: '12px', width: '180px' }}
              />
            </div>

            <button
              onClick={() => setActiveTab('orders')}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              <span>View all ({orders.length})</span>
              <ChevronRight size={12} />
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned Hub</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.slice(0, 5).map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    <button
                      onClick={() => handleCopyId(ord.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        padding: 0
                      }}
                      title="Click to copy Order ID"
                    >
                      <span>#{ord.id}</span>
                      {copiedOrderId === ord.id ? (
                        <Check size={11} color="var(--success)" />
                      ) : (
                        <Copy size={11} style={{ opacity: 0.4 }} />
                      )}
                    </button>
                  </td>
                  <td style={{ fontWeight: 600 }}>{ord.customer || 'Rahul Sharma'}</td>
                  <td>{ord.destination || ord.city || ord.hub || 'Delhi'}</td>
                  <td>
                    {ord.status === 'Completed' || ord.status === 'Delivered' ? (
                      <span className="badge badge-success">Completed</span>
                    ) : ord.status === 'Failed' ? (
                      <span className="badge badge-danger">Failed</span>
                    ) : (
                      <span className="badge badge-info">Processing</span>
                    )}
                  </td>
                  <td>
                    {ord.priority === 'Same Day' || ord.priority === 'Urgent' ? (
                      <span className="badge badge-danger">{ord.priority}</span>
                    ) : ord.priority === 'Express' || ord.priority === 'High' ? (
                      <span className="badge badge-info">{ord.priority}</span>
                    ) : (
                      <span className="badge badge-neutral">{ord.priority || 'Standard'}</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{ord.hub || 'Delhi (NCR-01)'}</span>
                  </td>
                  <td className="tabular-nums" style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {ord.updated || '2m ago'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {ord.status === 'Failed' ? (
                        <button
                          onClick={() => onRetryFailedOrder(ord.id)}
                          className="btn-danger"
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                        >
                          <RotateCcw size={11} />
                          <span>Retry</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setRouteTracerOrder(ord)}
                          className="btn-secondary"
                          style={{ fontSize: '11.5px', padding: '3px 8px', color: 'var(--primary)' }}
                          title="Trace Dijkstra route calculation"
                        >
                          <span>Route 🗺️</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. DIJKSTRA ROUTE TRACER MODAL */}
      {routeTracerOrder && (
        <div className="modal-overlay" onClick={() => setRouteTracerOrder(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '24px', maxWidth: '480px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--primary)" />
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  C++ Dijkstra Route Tracer #{routeTracerOrder.id}
                </div>
              </div>
              <button onClick={() => setRouteTracerOrder(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <div><strong>Customer:</strong> {routeTracerOrder.customer || 'Rahul Sharma'}</div>
                <div><strong>Destination:</strong> {routeTracerOrder.destination || routeTracerOrder.city || 'Delhi'}</div>
                <div><strong>Priority:</strong> {routeTracerOrder.priority || 'Express'}</div>
              </div>

              {/* Visual Step Trace */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '6px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>1</div>
                  <div>Origin Hub: <strong>{routeTracerOrder.hub || 'Delhi SuperHub (NCR-01)'}</strong> (Stock Matched in 0.4ms)</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--info)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>2</div>
                  <div>AGV Conveyor Lane #4 ➔ Air Bay Gate (Wave sort completed)</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--success)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>3</div>
                  <div>Courier Dispatched: <strong>Direct Transit to {routeTracerOrder.city || 'Destination'}</strong></div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Calculation Latency: <strong>1.2ms (Min-Heap)</strong></span>
                <button onClick={() => setRouteTracerOrder(null)} className="btn-primary" style={{ fontSize: '12px' }}>
                  Close Tracer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
