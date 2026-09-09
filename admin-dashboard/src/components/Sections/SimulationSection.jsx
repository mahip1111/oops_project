import React, { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';

export default function SimulationSection({ onOpenDispatchModal }) {
  // Config state
  const [orderCount, setOrderCount] = useState(50000);
  const [workerCount, setWorkerCount] = useState(30);
  const [strategy, setStrategy] = useState('PRIORITY_EDF'); // 'FIFO', 'PRIORITY_EDF', 'SPT'
  const [activeHubs, setActiveHubs] = useState(['BOM-04', 'DEL-01', 'HYD-02', 'CCU-03']);
  const [isLoading, setIsLoading] = useState(false);

  // Active result state
  const [simulationResult, setSimulationResult] = useState({
    totalOrders: 50000,
    workerCount: 30,
    activeHubCount: 4,
    strategy: 'Priority / Earliest Deadline First (EDF)',
    estimatedCompletionHours: 8.2,
    lateOrdersCount: 1240,
    slaAdherencePct: 97.52,
    throughputPerHour: 6098,
    avgOrderFulfillmentMins: 18.4,
    workerUtilizationPct: 94.2,
    bottleneckNode: 'Kolkata Gateway (CCU-03)',
    recommendation: 'Adding 10 workers reduces completion time from 8.2h to ~6.1h and cuts late orders by ~69%.',
    hubStats: [
      { hubId: 'BOM-04', hubName: 'Mumbai MegaPort', ordersAssigned: 17500, utilizationPct: 89.2, avgLatencyMs: 1.2 },
      { hubId: 'DEL-01', hubName: 'Delhi SuperHub', ordersAssigned: 15000, utilizationPct: 85.0, avgLatencyMs: 1.2 },
      { hubId: 'HYD-02', hubName: 'Hyderabad Cyber Node', ordersAssigned: 10000, utilizationPct: 76.7, avgLatencyMs: 1.2 },
      { hubId: 'CCU-03', hubName: 'Kolkata Gateway', ordersAssigned: 7500, utilizationPct: 96.5, avgLatencyMs: 1.2 }
    ]
  });

  // History comparison runs
  const [historyRuns, setHistoryRuns] = useState([
    {
      id: 'RUN-01',
      timestamp: '10:14 AM',
      orders: 50000,
      workers: 30,
      strategy: 'FIFO',
      completionHours: 8.9,
      lateOrders: 2150,
      slaPct: 95.7,
      utilization: 96.1
    },
    {
      id: 'RUN-02',
      timestamp: '10:22 AM',
      orders: 50000,
      workers: 40,
      strategy: 'Priority (EDF)',
      completionHours: 6.1,
      lateOrders: 380,
      slaPct: 99.24,
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

  const allHubList = [
    { id: 'BOM-04', name: 'Mumbai MegaPort' },
    { id: 'DEL-01', name: 'Delhi SuperHub' },
    { id: 'HYD-02', name: 'Hyderabad Cyber Node' },
    { id: 'CCU-03', name: 'Kolkata Gateway' }
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
              <Sparkles size={12} /> PRD Signature Feature
            </span>
            <span style={{ color: '#94A3B8', fontSize: '13px' }}>C++ FastRoute Workload Model</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            What-If Workload Simulation Lab
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: '4px 0 0' }}>
            Evaluate future operating conditions: "What happens if tomorrow we receive 50,000 orders?" Compare completion times, worker bottlenecks, and SLA late curves.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isLoading}
          className="btn-primary"
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            borderRadius: '8px'
          }}
        >
          {isLoading ? (
            <>
              <RotateCcw size={16} className="animate-spin" /> Calculating Simulation...
            </>
          ) : (
            <>
              <Play size={16} /> Run What-If Simulation
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Parameters Control on Left, Real-Time Prediction Output on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
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

          {/* 3. Scheduling Strategy */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
              Scheduling Strategy
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'PRIORITY_EDF', label: 'Priority / Earliest Deadline First (EDF)', desc: 'Optimizes express SLA deliveries (68% fewer late orders)' },
                { id: 'SPT', label: 'Shortest Processing Time (SPT)', desc: 'Maximizes throughput by clearing rapid small item picks' },
                { id: 'FIFO', label: 'FIFO (First-In, First-Out)', desc: 'Standard sequential arrival ordering' }
              ].map((strat) => (
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: simulationResult.lateOrdersCount > 1000 ? 'var(--danger)' : 'var(--success)', marginBottom: '4px' }}>
                <AlertTriangle size={16} />
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Predicted Late</span>
              </div>
              <div className="tabular-nums" style={{ fontSize: '26px', fontWeight: 800, color: simulationResult.lateOrdersCount > 1000 ? 'var(--danger)' : 'var(--success)' }}>
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

          {/* Scenario Comparison History */}
          <div className="panel-card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Scenario Comparison Log (PRD Target Benchmarks)
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
                        <span style={{ color: run.lateOrders > 1000 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
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
      </div>
    </div>
  );
}
