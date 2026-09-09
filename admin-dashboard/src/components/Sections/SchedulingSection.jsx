import React, { useState } from 'react';
import {
  CalendarClock,
  Zap,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle,
  Cpu,
  ArrowRight
} from 'lucide-react';

export default function SchedulingSection({ activeStrategy = 'Hybrid', onStrategyChange }) {
  const [currentStrategy, setCurrentStrategy] = useState(activeStrategy);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const strategies = [
    {
      id: 'Hybrid',
      name: 'Hybrid Dynamic (Priority + EDF)',
      tagline: 'Recommended for High Concurrency SLA Adherence',
      description: 'Calculates composite score scaling dynamic priority alongside deadline urgency decay.',
      formula: 'Score = (DynamicPriority × 10) - (DeadlineMinutes × 0.5)',
      slaAdherence: '99.55%',
      throughput: '3,519 orders/hr',
      lateRisk: 'Very Low (0.45%)',
      color: '#2563EB',
      badge: 'Active & Optimal'
    },
    {
      id: 'Priority',
      name: 'Priority-First (Value & Urgency)',
      tagline: 'Maximizes high-ticket and VIP express order fulfillment',
      description: 'Dispatches highest dynamic priority items first regardless of queue entry time.',
      formula: 'Sort by dynamicPriority DESC',
      slaAdherence: '97.20%',
      throughput: '3,410 orders/hr',
      lateRisk: 'Low (2.8%)',
      color: '#F59E0B',
      badge: 'Express Priority'
    },
    {
      id: 'Deadline',
      name: 'Earliest Deadline First (EDF)',
      tagline: 'Strict deadline boundary optimization',
      description: 'Prioritizes tasks nearest to their promised customer delivery SLA cutoff time.',
      formula: 'Sort by deadlineMinutes ASC',
      slaAdherence: '98.80%',
      throughput: '3,480 orders/hr',
      lateRisk: 'Low (1.2%)',
      color: '#10B981',
      badge: 'SLA Focus'
    },
    {
      id: 'FIFO',
      name: 'First-In, First-Out (FIFO)',
      tagline: 'Strict chronological queue processing',
      description: 'Dispatches tasks strictly by creation timestamp without dynamic re-prioritization.',
      formula: 'Arrival Timestamp Sequence',
      slaAdherence: '92.10%',
      throughput: '3,120 orders/hr',
      lateRisk: 'Moderate (7.9%)',
      color: '#64748B',
      badge: 'Sequential'
    }
  ];

  const handleSelectStrategy = async (stratId) => {
    setIsUpdating(true);
    try {
      await fetch('http://localhost:5000/api/scheduling/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy: stratId })
      });
      setCurrentStrategy(stratId);
      if (onStrategyChange) onStrategyChange(stratId);
      setSuccessMsg(`C++ Scheduling Engine recalculated task queue using ${stratId} Strategy.`);
      setTimeout(() => setSuccessMsg(''), 4500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Dynamic Scheduling & Task Re-Ordering Engine
            </h1>
            <span className="badge badge-warning">
              PRD Section 5
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Switch between FIFO, Priority, Deadline, and Hybrid strategies. The C++ decision engine dynamically re-indexes the shared queue.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'var(--primary-subtle)',
              border: '1px solid var(--primary-border)'
            }}
          >
            <Cpu size={14} color="var(--primary)" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>
              Active Strategy: {currentStrategy}
            </span>
          </div>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMsg && (
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
          <CheckCircle size={16} color="var(--success)" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--success)' }}>
            {successMsg}
          </span>
        </div>
      )}

      {/* Strategy Comparison Cards (4 Grids) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {strategies.map((strat) => {
          const isActive = currentStrategy === strat.id;
          return (
            <div
              key={strat.id}
              className="panel-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                borderColor: isActive ? strat.color : 'var(--border)',
                boxShadow: isActive ? `0 0 0 1.5px ${strat.color}` : 'var(--shadow-sm)',
                background: isActive ? 'var(--surface)' : 'var(--surface)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      color: strat.color,
                      background: 'var(--bg-surface-elevated)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}
                  >
                    {strat.id} Strategy
                  </span>
                  {isActive && (
                    <span className="badge badge-success">
                      ACTIVE
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                  {strat.name}
                </h3>
                <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {strat.tagline}
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.45', margin: '0 0 12px' }}>
                  {strat.description}
                </p>

                {/* Formula box */}
                <div
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-primary)',
                    marginBottom: '12px'
                  }}
                >
                  {strat.formula}
                </div>

                {/* Key Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center', fontSize: '11px' }}>
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '6px', borderRadius: '4px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>SLA</div>
                    <strong style={{ color: 'var(--success)' }}>{strat.slaAdherence}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '6px', borderRadius: '4px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Speed</div>
                    <strong style={{ color: 'var(--text-primary)' }}>{strat.throughput}</strong>
                  </div>
                  <div style={{ background: 'var(--bg-surface-elevated)', padding: '6px', borderRadius: '4px' }}>
                    <div style={{ color: 'var(--text-muted)' }}>Risk</div>
                    <strong style={{ color: strat.lateRisk.includes('Very Low') || strat.lateRisk.includes('Low') ? 'var(--success)' : 'var(--warning)' }}>
                      {strat.lateRisk}
                    </strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectStrategy(strat.id)}
                disabled={isActive || isUpdating}
                className={isActive ? 'btn-secondary' : 'btn-primary'}
                style={{
                  width: '100%',
                  opacity: isActive ? 0.7 : 1,
                  cursor: isActive ? 'default' : 'pointer'
                }}
              >
                {isActive ? 'Currently Active Strategy' : `Activate ${strat.id} Strategy`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Dynamic Priority Escalation Section (PRD Section 5) */}
      <div className="panel-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--warning-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="var(--warning)" />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Dynamic Priority Escalation Curve
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              C++ background scheduler increments task priorities automatically as delivery deadlines approach.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase' }}>
              Cutoff ≤ 15 Minutes
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Escalate: Priority + 4 Levels
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Dispatches directly to highest priority thread pool bay with zero queue wait.
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--warning)', textTransform: 'uppercase' }}>
              Cutoff ≤ 30 Minutes
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Escalate: Priority + 2 Levels
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Moves into express AGV fast lane to prevent buffer congestion.
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase' }}>
              Normal SLA Window (&gt; 30m)
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Standard Weighting
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Scheduled according to base dynamic priority score and distance vector.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
