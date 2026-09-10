import React, { useState } from 'react';
import {
  X,
  Cpu,
  Layers,
  GitFork,
  ShieldCheck,
  Zap,
  Repeat,
  Share2,
  Box,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lock,
  Unlock,
  Radio,
  Clock,
  MapPin,
  TrendingUp,
  Workflow
} from 'lucide-react';

export default function ArchitectureInspectorModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('strategy');

  // Strategy Pattern Interactive State
  const [strategyUrgency, setStrategyUrgency] = useState(85);
  const [strategyDistance, setStrategyDistance] = useState(450);
  const [strategyValue, setStrategyValue] = useState(158000);

  // State Machine Interactive State
  const [simState, setSimState] = useState('CREATED');
  const [stateLog, setStateLog] = useState([
    { from: 'INITIAL', to: 'CREATED', status: 'SUCCESS', msg: 'Order QF-10482 initialized with items' }
  ]);

  // Dijkstra Router Interactive State
  const [selectedHub, setSelectedHub] = useState('CCU-03');
  const [selectedDest, setSelectedDest] = useState('Bhubaneswar');

  // Mutex Concurrency Interactive State
  const [mutexStock, setMutexStock] = useState(1);
  const [threadResults, setThreadResults] = useState([]);
  const [isSimulatingMutex, setIsSimulatingMutex] = useState(false);

  // Task DAG Wave State
  const [activeWave, setActiveWave] = useState(1);

  if (!isOpen) return null;

  // Strategy Score Calculation
  const fifoScore = 100;
  const priorityScore = (strategyUrgency * 1.5) + (strategyValue > 50000 ? 50 : 10);
  const deadlineScore = Math.max(10, 200 - (strategyDistance / 10));
  const hybridScore = Math.round((strategyUrgency * 0.45) + ((2000 - strategyDistance) * 0.03) + (strategyValue > 100000 ? 35 : 15));

  // State Machine Handler
  const validTransitions = {
    CREATED: ['ALLOCATED', 'CANCELLED'],
    ALLOCATED: ['PICKING', 'CANCELLED'],
    PICKING: ['PACKING', 'CANCELLED'],
    PACKING: ['QUALITY_CHECK', 'CANCELLED'],
    QUALITY_CHECK: ['OUT_FOR_DELIVERY', 'REVIEW_REQUIRED', 'CANCELLED'],
    OUT_FOR_DELIVERY: ['DELIVERED', 'RETURNED'],
    REVIEW_REQUIRED: ['PICKING', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: []
  };

  const handleAttemptTransition = (targetState) => {
    const allowed = validTransitions[simState] || [];
    if (allowed.includes(targetState)) {
      setSimState(targetState);
      setStateLog((prev) => [
        { from: simState, to: targetState, status: 'SUCCESS', msg: `State advanced to ${targetState} (Invariant verified)` },
        ...prev
      ]);
    } else {
      setStateLog((prev) => [
        {
          from: simState,
          to: targetState,
          status: 'REJECTED',
          msg: `C++ State Machine Invariant Rejection: Cannot jump directly from ${simState} -> ${targetState}`
        },
        ...prev
      ]);
    }
  };

  // Mutex Concurrency Simulator
  const runMutexSimulation = () => {
    setIsSimulatingMutex(true);
    setThreadResults([]);
    setMutexStock(1);

    setTimeout(() => {
      const results = [
        { thread: 'Thread #1 (Worker AGV-Alpha)', time: '0.12ms', action: 'Acquired Mutex lock -> Reserved MacBook Pro -> Atomic Decrement Stock', success: true },
        { thread: 'Thread #2 (Worker AGV-Beta)', time: '0.15ms', action: 'Acquired Mutex lock -> Checked Stock (0 left) -> Reservation Rejected (Rollback)', success: false },
        { thread: 'Thread #3 (Web Customer Store)', time: '0.19ms', action: 'Acquired Mutex lock -> Checked Stock (0 left) -> Reservation Rejected (Rollback)', success: false },
        { thread: 'Thread #4 (Admin Manual Assign)', time: '0.22ms', action: 'Acquired Mutex lock -> Checked Stock (0 left) -> Reservation Rejected (Rollback)', success: false }
      ];
      setThreadResults(results);
      setMutexStock(0);
      setIsSimulatingMutex(false);
    }, 600);
  };

  // Dijkstra Paths
  const dijkstraRoutes = {
    'CCU-03->Bhubaneswar': { path: 'CCU-03 (Kolkata Gateway) ➔ BBI-01 (Bhubaneswar Cyber Node)', distance: '440 km', latency: '0.45 ms', best: true },
    'HYD-02->Bhubaneswar': { path: 'HYD-02 (Hyderabad) ➔ VZ-02 ➔ BBI-01', distance: '1050 km', latency: '1.10 ms', best: false },
    'DEL-01->Bhubaneswar': { path: 'DEL-01 (Delhi SuperHub) ➔ LKO-01 ➔ PAT-02 ➔ BBI-01', distance: '1500 km', latency: '1.65 ms', best: false },
    'BOM-04->Bhubaneswar': { path: 'BOM-04 (Mumbai MegaPort) ➔ NAG-01 ➔ RAIP-02 ➔ BBI-01', distance: '1640 km', latency: '1.85 ms', best: false },
    'DEL-01->Jaipur': { path: 'DEL-01 (Delhi SuperHub) ➔ JAI-01 (Jaipur)', distance: '260 km', latency: '0.28 ms', best: true },
    'BOM-04->Pune': { path: 'BOM-04 (Mumbai MegaPort) ➔ PUN-01 (Pune Express Node)', distance: '150 km', latency: '0.18 ms', best: true }
  };

  const routeKey = `${selectedHub}->${selectedDest}`;
  const computedRoute = dijkstraRoutes[routeKey] || {
    path: `${selectedHub} ➔ Inter-State Transit Relay ➔ ${selectedDest}`,
    distance: '890 km',
    latency: '0.95 ms',
    best: selectedHub === 'CCU-03' && selectedDest === 'Bhubaneswar'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '960px',
          width: '95vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-modal)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(139,92,246,0.04) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
              }}
            >
              <Cpu size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
                  Enterprise Technical Architecture & OOPs Deep-Dive
                </h2>
                <span className="badge badge-purple">Gang of Four (GoF) + C++ Systems</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Interactive technical sandbox demonstrating design patterns, thread synchronization, and graph algorithms.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-subtle"
            style={{ padding: '6px', borderRadius: '50%', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            padding: '10px 20px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface-elevated)',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'strategy', label: '1. Strategy Pattern', icon: Zap, pattern: 'Dynamic Schedulers' },
            { id: 'state', label: '2. State Pattern', icon: Repeat, pattern: 'Order State Machine' },
            { id: 'graph', label: '3. Graph & Dijkstra', icon: GitFork, pattern: 'Routing Engine' },
            { id: 'mutex', label: '4. RAII Mutex', icon: Lock, pattern: 'Thread-Safe Inventory' },
            { id: 'factory', label: '5. Factory Method', icon: Box, pattern: 'Task Decomposition' },
            { id: 'resilience', label: '6. Resilience Queue', icon: ShieldCheck, pattern: 'Circuit Breaker' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent',
                  background: isActive ? 'var(--surface)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '12px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          
          {/* 1. STRATEGY PATTERN */}
          {activeTab === 'strategy' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Strategy Pattern: Dynamic Workload Scheduling (C++ Strategy Interface)
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    De-couples priority scheduling algorithms at runtime without modifying the caller <code style={{ fontFamily: 'var(--font-mono)' }}>Scheduler::dispatchNextBatch()</code>.
                  </p>
                </div>
                <span className="pattern-badge">Design Pattern: Strategy (Behavioral)</span>
              </div>

              {/* Interactive Sandbox */}
              <div className="panel-card" style={{ padding: '16px', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Interactive Scoring Sandbox: Adjust Order Variables Live
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Urgency SLA Score: <strong style={{ color: 'var(--text-primary)' }}>{strategyUrgency}/100</strong>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={strategyUrgency}
                      onChange={(e) => setStrategyUrgency(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Delivery Distance: <strong style={{ color: 'var(--text-primary)' }}>{strategyDistance} km</strong>
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="50"
                      value={strategyDistance}
                      onChange={(e) => setStrategyDistance(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Order Basket Value: <strong style={{ color: 'var(--text-primary)' }}>Rs {strategyValue.toLocaleString()}</strong>
                    </label>
                    <input
                      type="range"
                      min="5000"
                      max="300000"
                      step="5000"
                      value={strategyValue}
                      onChange={(e) => setStrategyValue(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Score Comparison Matrix */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div className="panel-card" style={{ padding: '12px', textAlign: 'center', background: 'var(--surface)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>FIFO Score</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-secondary)', margin: '4px 0' }}>{fifoScore}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Order Creation Time Only</div>
                  </div>
                  <div className="panel-card" style={{ padding: '12px', textAlign: 'center', background: 'var(--surface)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--info)', fontWeight: 600 }}>Priority Score</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--info)', margin: '4px 0' }}>{priorityScore}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Urgency + Value Multiplier</div>
                  </div>
                  <div className="panel-card" style={{ padding: '12px', textAlign: 'center', background: 'var(--surface)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--purple)', fontWeight: 600 }}>Deadline Score</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--purple)', margin: '4px 0' }}>{deadlineScore}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)' }}>Time-to-Breach Remaining</div>
                  </div>
                  <div className="panel-card" style={{ padding: '12px', textAlign: 'center', background: 'rgba(37,99,235,0.06)', border: '1px solid var(--primary-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>Hybrid Score ⭐</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>{hybridScore}</div>
                    <div style={{ fontSize: '10px', color: 'var(--primary)' }}>Multi-Param Dynamic Math</div>
                  </div>
                </div>
              </div>

              {/* Code Snippet Box */}
              <div style={{ background: '#0F172A', color: '#E2E8F0', padding: '14px 16px', borderRadius: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
                <div style={{ color: '#94A3B8', marginBottom: '6px' }}>// C++ Polymorphic Strategy Interface</div>
                <span style={{ color: '#38BDF8' }}>class</span> <span style={{ color: '#FBBF24' }}>ISchedulingStrategy</span> &#123;<br/>
                &nbsp;&nbsp;<span style={{ color: '#38BDF8' }}>public</span>:<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38BDF8' }}>virtual</span> ~ISchedulingStrategy() = <span style={{ color: '#F472B6' }}>default</span>;<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#38BDF8' }}>virtual double</span> <span style={{ color: '#34D399' }}>calculatePriority</span>(const Order& order, const Warehouse& hub) = <span style={{ color: '#F472B6' }}>0</span>;<br/>
                &#125;;
              </div>
            </div>
          )}

          {/* 2. STATE PATTERN */}
          {activeTab === 'state' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    State Pattern: Order Finite State Machine with Invariant Guard Protection
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Guarantees valid business lifecycle transitions. Illegal state leaps (e.g. <code style={{ fontFamily: 'var(--font-mono)' }}>CREATED ➔ DELIVERED</code>) are strictly rejected with zero side-effects.
                  </p>
                </div>
                <span className="pattern-badge">Design Pattern: State (Behavioral)</span>
              </div>

              {/* Interactive State Lifecycle Bar */}
              <div className="panel-card" style={{ padding: '16px', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Current State: <span className="badge badge-blue" style={{ fontSize: '13px', padding: '4px 10px' }}>{simState}</span>
                  </div>
                  <button onClick={() => { setSimState('CREATED'); setStateLog([]); }} className="btn-secondary" style={{ fontSize: '11px', padding: '4px 8px' }}>
                    <RotateCcw size={12} /> Reset FSM
                  </button>
                </div>

                {/* State Progress Sequence */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '14px' }}>
                  {['CREATED', 'ALLOCATED', 'PICKING', 'PACKING', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((st, idx) => {
                    const isCurr = simState === st;
                    return (
                      <React.Fragment key={st}>
                        <div
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: isCurr ? 'var(--primary)' : 'var(--surface)',
                            color: isCurr ? '#fff' : 'var(--text-secondary)',
                            border: isCurr ? '1px solid var(--primary)' : '1px solid var(--border)',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {idx + 1}. {st}
                        </div>
                        {idx < 6 && <ArrowRight size={12} color="var(--text-muted)" />}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Interactive Transition Buttons */}
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Test State Transitions (Try legal vs illegal jumps):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['ALLOCATED', 'PICKING', 'PACKING', 'QUALITY_CHECK', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((target) => (
                    <button
                      key={target}
                      onClick={() => handleAttemptTransition(target)}
                      className="btn-secondary"
                      style={{ fontSize: '12px' }}
                    >
                      Advance to <strong>{target}</strong>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transition Audit Log */}
              <div style={{ maxHeight: '140px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', background: 'var(--surface)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>C++ STATE MACHINE AUDIT STREAM</div>
                {stateLog.map((entry, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '3px 0' }}>
                    {entry.status === 'SUCCESS' ? (
                      <CheckCircle2 size={14} color="var(--success)" />
                    ) : (
                      <AlertTriangle size={14} color="var(--danger)" />
                    )}
                    <span style={{ color: entry.status === 'SUCCESS' ? 'var(--text-primary)' : 'var(--danger)', fontWeight: 600 }}>
                      [{entry.status}] {entry.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. GRAPH & DIJKSTRA ROUTER */}
          {activeTab === 'graph' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Graph Network & Dijkstra Shortest Latency Route Optimization
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Models national SuperHubs and distribution nodes as an adjacency-list weighted graph. Solves lowest latency routing in <code style={{ fontFamily: 'var(--font-mono)' }}>O(E + V log V)</code>.
                  </p>
                </div>
                <span className="pattern-badge">Algorithm: Dijkstra Priority Queue</span>
              </div>

              {/* Selector Controls */}
              <div className="panel-card" style={{ padding: '16px', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Source SuperHub (Warehouse)
                    </label>
                    <select
                      className="admin-select"
                      value={selectedHub}
                      onChange={(e) => setSelectedHub(e.target.value)}
                    >
                      <option value="CCU-03">CCU-03 — Kolkata Gateway (East SuperHub)</option>
                      <option value="DEL-01">DEL-01 — Delhi SuperHub (North Hub)</option>
                      <option value="BOM-04">BOM-04 — Mumbai MegaPort (West Hub)</option>
                      <option value="HYD-02">HYD-02 — Hyderabad Cyber Node (South Hub)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Destination City
                    </label>
                    <select
                      className="admin-select"
                      value={selectedDest}
                      onChange={(e) => setSelectedDest(e.target.value)}
                    >
                      <option value="Bhubaneswar">Bhubaneswar (Odisha)</option>
                      <option value="Pune">Pune (Maharashtra)</option>
                      <option value="Jaipur">Jaipur (Rajasthan)</option>
                      <option value="Lucknow">Lucknow (Uttar Pradesh)</option>
                    </select>
                  </div>
                </div>

                {/* Computed Path Display */}
                <div className="panel-card" style={{ padding: '14px', background: 'var(--surface)', border: computedRoute.best ? '1px solid var(--success-border)' : '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Dijkstra Shortest Path Computed:
                    </div>
                    {computedRoute.best && (
                      <span className="badge badge-success">Optimal Hub Selected (Lowest Latency)</span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
                    {computedRoute.path}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span>Distance: <strong style={{ color: 'var(--text-primary)' }}>{computedRoute.distance}</strong></span>
                    <span>•</span>
                    <span>Hop Latency: <strong style={{ color: 'var(--text-primary)' }}>{computedRoute.latency}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. RAII MUTEX & CONCURRENCY */}
          {activeTab === 'mutex' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Thread-Safe Inventory: RAII Mutex Locks & Zero Race Conditions
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Uses <code style={{ fontFamily: 'var(--font-mono)' }}>std::lock_guard&lt;std::mutex&gt;</code> (RAII) to guarantee atomic stock reservation and instant rollback under high concurrent load.
                  </p>
                </div>
                <span className="pattern-badge">Idiom: RAII Thread Synchronization</span>
              </div>

              {/* Concurrency Simulator Sandbox */}
              <div className="panel-card" style={{ padding: '16px', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Simulate 4 Simultaneous Worker Threads Competing for 1 MacBook Pro (SKU: <code style={{ fontFamily: 'var(--font-mono)' }}>lap-mbp-14</code>)
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Current Stock in Central Inventory: <strong style={{ color: mutexStock > 0 ? 'var(--success)' : 'var(--danger)' }}>{mutexStock} Unit</strong>
                    </div>
                  </div>
                  <button
                    onClick={runMutexSimulation}
                    disabled={isSimulatingMutex}
                    className="btn-primary"
                  >
                    <Play size={14} /> {isSimulatingMutex ? 'Simulating Locks...' : 'Execute Concurrent Race Test'}
                  </button>
                </div>

                {/* Thread Results */}
                {threadResults.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                    {threadResults.map((tr, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: 'var(--surface)',
                          border: tr.success ? '1px solid var(--success-border)' : '1px solid var(--border)',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {tr.success ? <Lock size={16} color="var(--success)" /> : <Unlock size={16} color="var(--text-muted)" />}
                          <div>
                            <strong style={{ color: 'var(--text-primary)' }}>{tr.thread}</strong>
                            <div style={{ color: tr.success ? 'var(--success)' : 'var(--text-secondary)', fontSize: '11px' }}>{tr.action}</div>
                          </div>
                        </div>
                        <span className={`badge ${tr.success ? 'badge-success' : 'badge-neutral'}`}>
                          {tr.success ? 'ACQUIRED & DEDUCTED' : 'REJECTED (NO OVERSELL)'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. FACTORY METHOD & TASK PIPELINES */}
          {activeTab === 'factory' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Factory Method Pattern: Automated Task Pipeline Decomposition
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Transforms high-level Customer Orders into a Directed Acyclic Graph (DAG) of dependent fulfillment tasks (Picking ➔ Packing ➔ QC ➔ Shipping).
                  </p>
                </div>
                <span className="pattern-badge">Design Pattern: Factory Method (Creational)</span>
              </div>

              {/* Pipeline DAG Visualization */}
              <div className="panel-card" style={{ padding: '16px', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Decomposed Order DAG (Order #QF-10482):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  <div className="panel-card" style={{ padding: '12px', background: 'var(--surface)', border: activeWave === 1 ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                    <span className="badge badge-blue">Wave 1: Parallel Picks</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 4px 0' }}>
                      2 Independent Picks
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      • Pick MacBook Pro (Aisle 04-B)<br/>• Pick Magic Mouse (Aisle 02-C)
                    </div>
                  </div>

                  <div className="panel-card" style={{ padding: '12px', background: 'var(--surface)', border: activeWave === 2 ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                    <span className="badge badge-purple">Wave 2: Packing</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 4px 0' }}>
                      Tamper-Proof Box
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Unlocked automatically once both Wave 1 picks complete.
                    </div>
                  </div>

                  <div className="panel-card" style={{ padding: '12px', background: 'var(--surface)', border: activeWave === 3 ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                    <span className="badge badge-amber">Wave 3: Quality Check</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 4px 0' }}>
                      Optical & RFID Scan
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Laser serial number & tamper seal verification.
                    </div>
                  </div>

                  <div className="panel-card" style={{ padding: '12px', background: 'var(--surface)', border: activeWave === 4 ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                    <span className="badge badge-emerald">Wave 4: Shipping</span>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: '8px 0 4px 0' }}>
                      Hyperlocal Handover
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Out for Hyperlocal Courier Delivery (OTP Verified).
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                  {[1, 2, 3, 4].map((waveNum) => (
                    <button
                      key={waveNum}
                      onClick={() => setActiveWave(waveNum)}
                      className={activeWave === waveNum ? 'btn-primary' : 'btn-secondary'}
                      style={{ fontSize: '11px', padding: '5px 10px' }}
                    >
                      Inspect Wave {waveNum} Tasks
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. RESILIENCE QUEUE & RETRY POLICY */}
          {activeTab === 'resilience' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Resilience Queue & 3-Attempt Exponential Backoff Circuit Breaker
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Prevents faulty scanner loops from blocking the warehouse fleet. Auto-quarantines tasks after 3 failures for operator review.
                  </p>
                </div>
                <span className="pattern-badge">Pattern: Circuit Breaker & Retry</span>
              </div>

              <div className="panel-card" style={{ padding: '16px', background: 'var(--bg-surface-elevated)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
                  <div className="panel-card" style={{ padding: '12px', background: 'var(--surface)', borderLeft: '4px solid var(--warning)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 700 }}>Attempt 1 (500ms backoff)</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Optical scanner timeout 1/3 (Transient sensor glitch).
                    </div>
                  </div>
                  <div className="panel-card" style={{ padding: '12px', background: 'var(--surface)', borderLeft: '4px solid var(--warning)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--warning)', fontWeight: 700 }}>Attempt 2 (1000ms backoff)</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Optical scanner timeout 2/3 (Serial tag unreadable).
                    </div>
                  </div>
                  <div className="panel-card" style={{ padding: '12px', background: 'var(--surface)', borderLeft: '4px solid var(--danger)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--danger)', fontWeight: 700 }}>Attempt 3 (2000ms backoff)</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Max retries exceeded ➔ Auto-quarantine to Manual Review Queue.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(239,68,68,0.06)', border: '1px solid var(--danger-border)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--danger)', fontWeight: 600 }}>
                    <AlertTriangle size={16} />
                    Quarantined Task: QF-10291-QC (Laser Barcode Verification) in Kolkata Hub
                  </div>
                  <span className="badge badge-danger">STATUS: PENDING_REVIEW</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} color="var(--primary)" />
            All 9 C++ Logistics Modules & Domain Architecture active and verified.
          </div>
          <button onClick={onClose} className="btn-primary" style={{ padding: '6px 16px' }}>
            Close Architecture Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
