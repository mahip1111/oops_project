import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Play,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Building2,
  Sparkles,
  RotateCcw,
  BarChart3,
  Layers,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function SimulationSection({ onOpenDispatchModal }) {
  // Config state
  const [orderCount, setOrderCount] = useState(50000);
  const [workerCount, setWorkerCount] = useState(30);
  const [strategy, setStrategy] = useState('Hybrid'); // 'Hybrid', 'Priority', 'Deadline', 'FIFO'
  const [activeHubs, setActiveHubs] = useState(['BOM-04', 'DEL-01', 'HYD-02', 'CCU-03']);
  const [isLoading, setIsLoading] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [activeTab, setActiveTab] = useState('single'); // 'single' | 'compare'

  // Active result state
  const [simulationResult, setSimulationResult] = useState({
    totalOrders: 50000,
    workerCount: 30,
    activeHubCount: 4,
    strategy: 'Hybrid',
    estimatedCompletionHours: 8.2,
    lateOrdersCount: 225,
    slaAdherencePct: 99.55,
    throughputPerHour: 6098,
    avgOrderFulfillmentMins: 18.4,
    workerUtilizationPct: 94.2,
    bottleneckNode: 'Kolkata Gateway (CCU-03)',
    recommendation: 'Configuration is operating at optimal efficiency (99.6% SLA adherence).',
    hubStats: [
      { hubId: 'BOM-04', hubName: 'Mumbai MegaPort', ordersAssigned: 17500, utilizationPct: 89.2, avgLatencyMs: 1.2 },
      { hubId: 'DEL-01', hubName: 'Delhi SuperHub', ordersAssigned: 15000, utilizationPct: 85.0, avgLatencyMs: 1.2 },
      { hubId: 'HYD-02', hubName: 'Hyderabad Cyber Node', ordersAssigned: 10000, utilizationPct: 76.7, avgLatencyMs: 1.2 },
      { hubId: 'CCU-03', hubName: 'Kolkata Gateway', ordersAssigned: 7500, utilizationPct: 96.5, avgLatencyMs: 1.2 }
    ]
  });

  // 4-Strategy Comparison Matrix State (PRD Section 5 & 6)
  const [comparisonMatrix, setComparisonMatrix] = useState([
    { strategy: 'FIFO', estimatedCompletionHours: 8.9, lateOrdersCount: 750, slaAdherencePct: 98.50, throughputPerHour: 5618, workerUtilizationPct: 96.1 },
    { strategy: 'Priority', estimatedCompletionHours: 8.5, lateOrdersCount: 300, slaAdherencePct: 99.40, throughputPerHour: 5882, workerUtilizationPct: 94.8 },
    { strategy: 'Deadline', estimatedCompletionHours: 8.4, lateOrdersCount: 262, slaAdherencePct: 99.48, throughputPerHour: 5952, workerUtilizationPct: 94.5 },
    { strategy: 'Hybrid', estimatedCompletionHours: 8.2, lateOrdersCount: 225, slaAdherencePct: 99.55, throughputPerHour: 6098, workerUtilizationPct: 94.2 }
  ]);

  // History comparison runs
  const [historyRuns, setHistoryRuns] = useState([
    {
      id: 'RUN-01',
      timestamp: '10:14 AM',
      orders: 50000,
      workers: 30,
      strategy: 'FIFO',
      completionHours: 8.9,
      lateOrders: 750,
      slaPct: 98.50,
      utilization: 96.1
    },
    {
      id: 'RUN-02',
      timestamp: '10:22 AM',
      orders: 50000,
      workers: 40,
      strategy: 'Hybrid',
      completionHours: 6.1,
      lateOrders: 180,
      slaPct: 99.64,
      utilization: 82.5
    }
  ]);

  const toggleHub = (hubId) => {
    if (activeHubs.includes(hubId)) {
      if (activeHubs.length > 1) {
        setActiveHubs(activeHubs.filter((h) => h !== hubId));
      }
    } else {
      setActiveHubs([...activeHubs, hubId]);
    }
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderCount,
          workerCount,
          activeHubs,
          strategy
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);

        const newRun = {
          id: `RUN-0${historyRuns.length + 1}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          orders: data.totalOrders,
          workers: data.workerCount,
          strategy: data.strategy,
          completionHours: data.estimatedCompletionHours,
          lateOrders: data.lateOrdersCount,
          slaPct: data.slaAdherencePct,
          utilization: data.workerUtilizationPct
        };
        setHistoryRuns([newRun, ...historyRuns.slice(0, 4)]);
      }
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunCompareAll = async () => {
    setIsComparing(true);
    try {
      const res = await fetch('http://localhost:5000/api/simulation/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderCount,
          workerCount,
          activeHubs
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.comparison) {
          setComparisonMatrix(data.comparison);
          setActiveTab('compare');
        }
      }
    } catch (e) {
      console.error('Comparison error:', e);
    } finally {
      setIsComparing(false);
    }
  };

  const allHubList = [
    { id: 'BOM-04', name: 'Mumbai MegaPort' },
    { id: 'DEL-01', name: 'Delhi SuperHub' },
    { id: 'HYD-02', name: 'Hyderabad Cyber Node' },
    { id: 'CCU-03', name: 'Kolkata Gateway' }
  ];

  const strategyDescriptions = [
    { id: 'Hybrid', label: 'Hybrid (Dynamic Priority + Deadline)', desc: 'Combines dynamic priority escalation with delivery deadline decay (Lowest late orders)', color: '#3B82F6' },
    { id: 'Priority', label: 'Priority-First (Highest Value & Urgency)', desc: 'Processes VIP & high-value express items ahead of normal queue', color: '#F59E0B' },
    { id: 'Deadline', label: 'Deadline (Earliest Deadline First / EDF)', desc: 'Prioritizes tasks nearest promised customer delivery cutoff', color: '#10B981' },
    { id: 'FIFO', label: 'FIFO (First-In, First-Out)', desc: 'Standard sequential arrival queue processing', color: '#94A3B8' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }}>
      
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: '12px',
          padding: '24px 28px',
          border: '1px solid #334155',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-card)',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(37, 99, 235, 0.25)',
                border: '1px solid #3B82F6',
                padding: '3px 10px',
                borderRadius: '999px',
                color: '#60A5FA',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              <Sparkles size={12} /> PRD Phase 5 Signature Feature
            </span>
            <span style={{ color: '#94A3B8', fontSize: '13px' }}>C++ FastRoute Workload & Scheduling Simulation</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            What-If Workload Simulation & Algorithm Optimizer
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: '4px 0 0' }}>
            Evaluate future operating conditions: "What happens if tomorrow we receive 50,000 orders?" Compare FIFO vs Priority vs Deadline vs Hybrid in real time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleRunCompareAll}
            disabled={isComparing}
            className="btn-secondary"
            style={{
              padding: '11px 18px',
              fontSize: '13.5px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isComparing ? <RotateCcw size={15} className="animate-spin" /> : <BarChart3 size={15} color="var(--primary)" />}
            <span>Compare All 4 Schedulers</span>
          </button>

          <button
            onClick={handleRunSimulation}
            disabled={isLoading}
            className="btn-primary"
            style={{
              padding: '11px 22px',
              fontSize: '13.5px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isLoading ? <RotateCcw size={15} className="animate-spin" /> : <Play size={15} />}
            <span>Run Simulation</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
        <button
          onClick={() => setActiveTab('single')}
          style={{
            background: activeTab === 'single' ? 'var(--primary-subtle)' : 'transparent',
            color: activeTab === 'single' ? 'var(--primary)' : 'var(--text-secondary)',
            border: `1px solid ${activeTab === 'single' ? 'var(--primary-border)' : 'transparent'}`,
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sliders size={15} />
          <span>Interactive Parameter Modeling</span>
        </button>

        <button
          onClick={() => { setActiveTab('compare'); handleRunCompareAll(); }}
          style={{
            background: activeTab === 'compare' ? 'var(--primary-subtle)' : 'transparent',
            color: activeTab === 'compare' ? 'var(--primary)' : 'var(--text-secondary)',
            border: `1px solid ${activeTab === 'compare' ? 'var(--primary-border)' : 'transparent'}`,
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <BarChart3 size={15} />
          <span>FIFO vs Priority vs Deadline vs Hybrid Comparison</span>
        </button>
      </div>

      {/* TAB 1: Single Strategy Modeling */}
      {activeTab === 'single' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* Left: Interactive Sliders & Parameter Configuration */}
          <div
            className="panel-card"
            style={{
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <Sliders size={18} color="var(--primary)" />
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Workload Simulation Parameters
              </h2>
            </div>

            {/* 1. Expected Order Volume */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Expected Order Volume
                </label>
                <span className="badge badge-info">
                  {orderCount.toLocaleString()} orders
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={orderCount}
                onChange={(e) => setOrderCount(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>1,000</span>
                <span>50,000 (PRD Base)</span>
                <span>100,000 (Peak Flash)</span>
              </div>
            </div>

            {/* 2. Worker Fleet Size */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Active Workforce Fleet
                </label>
                <span className="badge badge-success">
                  {workerCount} workers & AGVs
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={workerCount}
                onChange={(e) => setWorkerCount(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--success)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                <span>10 (Skeleton)</span>
                <span>30 (Standard)</span>
                <span>40 (Optimized)</span>
                <span>100</span>
              </div>
            </div>

            {/* 3. Scheduling Strategy (PRD Section 5: FIFO, Priority, Deadline, Hybrid) */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Scheduling Strategy (Strategy Pattern)
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {strategyDescriptions.map((strat) => (
                  <div
                    key={strat.id}
                    onClick={() => setStrategy(strat.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: `1.5px solid ${strategy === strat.id ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: strategy === strat.id ? 'var(--primary-subtle)' : 'var(--bg-surface-elevated)',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 700, color: strategy === strat.id ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {strat.label}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {strat.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Active Hubs Selection */}
            <div>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Participating Distribution SuperHubs ({activeHubs.length}/4)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {allHubList.map((h) => {
                  const isSelected = activeHubs.includes(h.id);
                  return (
                    <button
                      key={h.id}
                      onClick={() => toggleHub(h.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                        backgroundColor: isSelected ? 'var(--primary-subtle)' : 'var(--bg-surface-elevated)',
                        color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Building2 size={13} />
                      <span>{h.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Simulation Results & Forecast Metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Top Key Result Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              
              {/* 1. Estimated Completion Time */}
              <div className="kpi-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', marginBottom: '4px' }}>
                  <Clock size={16} />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Est. Completion</span>
                </div>
                <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {simulationResult.estimatedCompletionHours} <span style={{ fontSize: '14px', fontWeight: 500 }}>hours</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Total batch fulfillment time
                </div>
              </div>

              {/* 2. Predicted Late Orders */}
              <div className="kpi-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: simulationResult.lateOrdersCount > 500 ? 'var(--danger)' : 'var(--success)', marginBottom: '4px' }}>
                  <AlertTriangle size={16} />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Predicted Late</span>
                </div>
                <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 800, color: simulationResult.lateOrdersCount > 500 ? 'var(--danger)' : 'var(--success)' }}>
                  {simulationResult.lateOrdersCount?.toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  SLA Adherence: <strong>{simulationResult.slaAdherencePct}%</strong>
                </div>
              </div>

              {/* 3. Hourly Throughput */}
              <div className="kpi-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', marginBottom: '4px' }}>
                  <TrendingUp size={16} />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Throughput</span>
                </div>
                <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {simulationResult.throughputPerHour?.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: 500 }}>/hr</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Avg {simulationResult.avgOrderFulfillmentMins}m / order
                </div>
              </div>

              {/* 4. Worker Fleet Utilization */}
              <div className="kpi-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--purple)', marginBottom: '4px' }}>
                  <Users size={16} />
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Utilization</span>
                </div>
                <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {simulationResult.workerUtilizationPct}%
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Across {simulationResult.workerCount} workers & AGVs
                </div>
              </div>
            </div>

            {/* AI Workload Recommendation Banner */}
            <div
              className="panel-card"
              style={{
                backgroundColor: 'var(--primary-subtle)',
                borderColor: 'var(--primary-border)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Sparkles size={18} />
              </div>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Optimization Recommendation
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                  {simulationResult.recommendation}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Bottleneck: <strong style={{ color: 'var(--danger)' }}>{simulationResult.bottleneckNode}</strong>
              </div>
            </div>

            {/* SuperHub Distribution Breakdown */}
            <div className="panel-card" style={{ padding: '18px 20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                Simulated Hub Workload Distribution
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                {simulationResult.hubStats.map((h) => (
                  <div
                    key={h.hubId}
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                      {h.hubId}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', margin: '2px 0 6px' }}>
                      {h.hubName}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      <span>Orders:</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{h.ordersAssigned?.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <span>Load:</span>
                      <strong style={{ color: h.utilizationPct > 90 ? 'var(--danger)' : 'var(--success)' }}>{h.utilizationPct}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIFO vs Priority vs Deadline vs Hybrid Comparison Matrix (PRD Section 5 & 6) */}
      {activeTab === 'compare' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="panel-card" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Side-by-Side Algorithm Comparison (FIFO vs Priority vs Deadline vs Hybrid)
                </h2>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Benchmarked for <strong>{orderCount.toLocaleString()} orders</strong> across <strong>{workerCount} workers</strong> and {activeHubs.length} superhubs.
                </p>
              </div>
              <button
                onClick={handleRunCompareAll}
                disabled={isComparing}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '12.5px' }}
              >
                {isComparing ? <RotateCcw size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                <span>Refresh Comparison</span>
              </button>
            </div>

            {/* Matrix Table */}
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Scheduling Algorithm</th>
                    <th>Est. Completion</th>
                    <th>Late Orders Count</th>
                    <th>SLA Adherence</th>
                    <th>Throughput / Hour</th>
                    <th>Fleet Utilization</th>
                    <th>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonMatrix.map((item) => {
                    const isBest = item.strategy === 'Hybrid';
                    return (
                      <tr key={item.strategy} style={{ backgroundColor: isBest ? 'var(--primary-subtle)' : 'transparent' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ color: isBest ? 'var(--primary)' : 'var(--text-primary)', fontSize: '13.5px' }}>
                              {item.strategy}
                            </strong>
                            {isBest && <span className="badge badge-success">⭐ OPTIMAL</span>}
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          {item.estimatedCompletionHours} hrs
                        </td>
                        <td>
                          <span style={{ color: item.lateOrdersCount > 500 ? 'var(--danger)' : 'var(--success)', fontWeight: 800 }}>
                            {item.lateOrdersCount?.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--success)', fontWeight: 800 }}>
                            {item.slaAdherencePct}%
                          </span>
                        </td>
                        <td style={{ fontWeight: 700 }}>
                          {item.throughputPerHour?.toLocaleString()} /hr
                        </td>
                        <td>
                          {item.workerUtilizationPct}%
                        </td>
                        <td>
                          {isBest ? (
                            <span style={{ color: 'var(--success)', fontSize: '11.5px', fontWeight: 700 }}>
                              Lowest late rate & highest SLA adherence
                            </span>
                          ) : item.strategy === 'FIFO' ? (
                            <span style={{ color: 'var(--danger)', fontSize: '11.5px', fontWeight: 600 }}>
                              High late rate under burst concurrency
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-secondary)', fontSize: '11.5px' }}>
                              Good performance on specific priority queues
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Visual Bar Comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              
              {/* SLA Adherence Comparison */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                  SLA Adherence Comparison (%)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {comparisonMatrix.map((item) => (
                    <div key={item.strategy}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.strategy}</span>
                        <strong style={{ color: 'var(--success)' }}>{item.slaAdherencePct}%</strong>
                      </div>
                      <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${item.slaAdherencePct}%`,
                            background: item.strategy === 'Hybrid' ? 'var(--primary)' : (item.strategy === 'FIFO' ? 'var(--text-muted)' : 'var(--success)')
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Late Orders Reduction Comparison */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                  Predicted Late Orders (Lower is Better)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {comparisonMatrix.map((item) => {
                    const maxLate = Math.max(...comparisonMatrix.map(m => m.lateOrdersCount), 100);
                    const pctWidth = Math.max(10, Math.min(100, (item.lateOrdersCount / maxLate) * 100));
                    return (
                      <div key={item.strategy}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.strategy}</span>
                          <strong style={{ color: item.lateOrdersCount > 500 ? 'var(--danger)' : 'var(--success)' }}>
                            {item.lateOrdersCount} late
                          </strong>
                        </div>
                        <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              height: '100%',
                              width: `${pctWidth}%`,
                              background: item.strategy === 'Hybrid' ? 'var(--success)' : (item.strategy === 'FIFO' ? 'var(--danger)' : 'var(--warning)')
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Comparison History */}
      <div className="panel-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Scenario Benchmark Execution Log
          </h3>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Live History Tracking</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Configuration</th>
                <th>Strategy</th>
                <th>Est. Completion</th>
                <th>Late Orders</th>
                <th>SLA %</th>
                <th>Fleet Load</th>
              </tr>
            </thead>
            <tbody>
              {historyRuns.map((run) => (
                <tr key={run.id}>
                  <td style={{ fontWeight: 600 }}>
                    {run.orders?.toLocaleString()} orders / {run.workers} workers
                  </td>
                  <td><span className="badge badge-neutral">{run.strategy}</span></td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{run.completionHours} hours</td>
                  <td>
                    <span style={{ color: run.lateOrders > 500 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                      {run.lateOrders?.toLocaleString()}
                    </span>
                  </td>
                  <td><span style={{ color: 'var(--success)', fontWeight: 700 }}>{run.slaPct}%</span></td>
                  <td>{run.utilization}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
