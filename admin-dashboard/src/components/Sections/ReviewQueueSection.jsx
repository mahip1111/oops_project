import React, { useState } from 'react';
import {
  ShieldAlert,
  RotateCcw,
  Navigation,
  CheckCircle2,
  Clock,
  Building2,
  ArrowRight,
  AlertTriangle,
  Bot
} from 'lucide-react';

export default function ReviewQueueSection({ reviewItems = [], onRetryReviewItem, onRerouteReviewItem }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedHub, setSelectedHub] = useState('BOM-04');

  const pendingItems = reviewItems.filter((i) => i.status === 'PENDING_REVIEW');
  const resolvedItems = reviewItems.filter((i) => i.status !== 'PENDING_REVIEW');

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
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #EF4444',
                padding: '3px 10px',
                borderRadius: '999px',
                color: '#F87171',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              <ShieldAlert size={12} /> Resilience Subsystem
            </span>
            <span style={{ color: '#94A3B8', fontSize: '13px' }}>Automated Failover & Dead-Letter Escalation</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Operations Manual Review Queue
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '13px', margin: '4px 0 0' }}>
            Orders with repeated task failures (3/3 max retries exceeded) or hardware sensor timeouts quarantined for supervisor intervention.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              backgroundColor: '#1E293B',
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #334155',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>Quarantined Tasks</div>
            <div className="tabular-nums" style={{ fontSize: '24px', fontWeight: 800, color: pendingItems.length > 0 ? '#F87171' : '#10B981' }}>
              {pendingItems.length}
            </div>
          </div>
        </div>
      </div>

      {/* Review Queue Grid: Left (Items) / Right (Action Panel) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        
        {/* Left: Quarantined List */}
        <div
          className="panel-card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Quarantined Tasks Awaiting Action ({pendingItems.length})
            </h2>
            <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Auto-Retry Limit: 3 Attempts</span>
          </div>

          {pendingItems.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <CheckCircle2 size={36} color="var(--success)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Review Queue Clear</div>
              <div style={{ fontSize: '13px' }}>All fulfillment tasks and robotic pods operating within normal SLA thresholds.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pendingItems.map((item) => (
                <div
                  key={item.reviewId}
                  onClick={() => setSelectedItem(item)}
                  style={{
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: selectedItem?.reviewId === item.reviewId ? 'var(--primary-subtle)' : 'var(--bg-surface-elevated)',
                    border: `1.5px solid ${selectedItem?.reviewId === item.reviewId ? 'var(--primary)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <span className="badge badge-danger" style={{ marginRight: '8px' }}>
                        {item.reviewId}
                      </span>
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{item.taskName}</strong>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.timestamp}</span>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--danger)', marginBottom: '8px', fontWeight: 500 }}>
                    Reason: {item.reason}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    <span>Order: <strong>{item.orderId}</strong> • Hub: <strong>{item.hubName || item.hub}</strong></span>
                    <span style={{ color: 'var(--danger)', fontWeight: 700 }}>
                      Retries: {item.retryAttempts}/3
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Supervisor Action Panel */}
        <div
          className="panel-card"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Supervisor Action & Resolution
          </h2>

          {selectedItem ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Selected Quarantined Item</div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {selectedItem.reviewId} — {selectedItem.taskName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Order: <strong>{selectedItem.orderId}</strong> | Origin Hub: <strong>{selectedItem.hub}</strong>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '6px' }}>
                  {selectedItem.reason}
                </div>
              </div>

              {/* Action 1: Re-dispatch with Priority Worker */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Action 1: Priority Re-Dispatch
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
                  Reset task failure count to 0 and auto-assign to dedicated high-speed AGV pod or lead QC specialist.
                </p>
                <button
                  onClick={() => {
                    onRetryReviewItem(selectedItem.reviewId);
                    setSelectedItem(null);
                  }}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  <RotateCcw size={14} />
                  <span>Reset & Dispatch Priority Pod</span>
                </button>
              </div>

              {/* Action 2: Reroute to Alternative Hub */}
              <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Action 2: Reroute to Alternate SuperHub
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 8px' }}>
                  Transfer entire order fulfillment pipeline to neighboring node with available stock and buffer.
                </p>
                <select
                  value={selectedHub}
                  onChange={(e) => setSelectedHub(e.target.value)}
                  className="admin-select"
                  style={{ marginBottom: '10px' }}
                >
                  <option value="BOM-04">Mumbai MegaPort (BOM-04) — Optimal</option>
                  <option value="DEL-01">Delhi SuperHub (DEL-01) — Optimal</option>
                  <option value="HYD-02">Hyderabad Cyber Node (HYD-02) — Optimal</option>
                </select>
                <button
                  onClick={() => {
                    onRerouteReviewItem(selectedItem.reviewId, selectedHub);
                    setSelectedItem(null);
                  }}
                  className="btn-secondary"
                  style={{ width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  <Navigation size={14} />
                  <span>Reroute Order to {selectedHub}</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-surface-elevated)', borderRadius: '8px', border: '1px dashed var(--border)' }}>
              <AlertTriangle size={28} style={{ marginBottom: '8px', opacity: 0.6 }} />
              <div style={{ fontSize: '13px' }}>Select a quarantined task from the left list to review diagnostics and trigger resolution.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
