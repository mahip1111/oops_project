import React, { useState } from 'react';
import {
  Boxes,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Info,
  BrainCircuit
} from 'lucide-react';
import { DecisionExplainModal } from '../Modals/AdminModals';

export default function FulfillmentSection({ orders = [], onOpenDispatchModal }) {
  const [selectedOrderForExplain, setSelectedOrderForExplain] = useState(null);

  const stages = [
    { key: 'CREATED', label: '1. Created', color: '#64748B' },
    { key: 'CONFIRMED', label: '2. Confirmed', color: '#0EA5E9' },
    { key: 'ALLOCATED', label: '3. Allocated', color: '#2563EB' },
    { key: 'PICKING', label: '4. Picking', color: '#F59E0B' },
    { key: 'PACKING', label: '5. Packing', color: '#8B5CF6' },
    { key: 'QUALITY_CHECK', label: '6. Quality Check', color: '#EC4899' },
    { key: 'SHIPPED', label: '7. Shipped', color: '#10B981' },
    { key: 'DELIVERED', label: '8. Delivered', color: '#059669' }
  ];

  const getStageIndex = (status) => {
    const s = (status || '').toUpperCase();
    const idx = stages.findIndex((st) => st.key === s);
    if (idx >= 0) return idx;
    if (s.includes('DELIVERED') || s.includes('COMPLETED')) return 7;
    if (s.includes('SHIP')) return 6;
    if (s.includes('QC') || s.includes('QUALITY')) return 5;
    if (s.includes('PACK')) return 4;
    if (s.includes('PICK')) return 3;
    if (s.includes('ALLOCAT')) return 2;
    if (s.includes('CONFIRM')) return 1;
    return 3;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              End-to-End Fulfillment Pipeline & Waves
            </h1>
            <span className="badge badge-info">
              PRD Section 1 & 4
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Multi-stage parallel picking, automated tamper-proof packaging, 4K laser QC verification, and carrier handovers.
          </p>
        </div>

        {onOpenDispatchModal && (
          <button onClick={onOpenDispatchModal} className="btn-primary">
            <Sparkles size={14} />
            <span>Dispatch Next Wave</span>
          </button>
        )}
      </div>

      {/* Stage Gates Overview */}
      <div className="panel-card" style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
          8-Stage Strict State Machine Lifecycle (No Skipped Transitions)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
          {stages.map((st, i) => (
            <div
              key={st.key}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 8px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '10px', fontWeight: 800, color: st.color, textTransform: 'uppercase' }}>
                Stage {i + 1}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
                {st.key}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Orders in Pipeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Active Orders in Fulfillment Stream ({orders.length})
        </h2>

        {orders.map((order) => {
          const currIdx = getStageIndex(order.status);
          const isUrgent = order.priority === 'EXPRESS' || order.priority === 'Urgent' || order.priority === 'Same Day';
          return (
            <div
              key={order.id}
              className="panel-card"
              style={{
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Order Meta Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                    #{order.id}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {order.customer}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    • Dest: {order.destination || order.city || 'Bhubaneswar'}
                  </span>
                  <span className={isUrgent ? 'badge badge-danger' : 'badge badge-info'}>
                    {order.priority || 'EXPRESS'} (60m SLA)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedOrderForExplain(order)}
                    className="btn-secondary"
                    style={{ fontSize: '12px', padding: '4px 10px', color: 'var(--primary)' }}
                  >
                    <BrainCircuit size={13} />
                    <span>Explain Decision</span>
                  </button>
                  <span className="badge badge-success">
                    Hub: {order.hub || 'Mumbai MegaPort (BOM-04)'}
                  </span>
                </div>
              </div>

              {/* Progress Stepper Bar */}
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '8px 0' }}>
                {stages.map((st, idx) => {
                  const isCompleted = idx < currIdx;
                  const isCurrent = idx === currIdx;
                  return (
                    <React.Fragment key={st.key}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          zIndex: 2,
                          flex: 1
                        }}
                      >
                        <div
                          style={{
                            width: isCurrent ? '26px' : '20px',
                            height: isCurrent ? '26px' : '20px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted ? 'var(--success)' : isCurrent ? 'var(--primary)' : 'var(--bg-primary)',
                            border: isCurrent ? '3px solid #93C5FD' : '2px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '10px',
                            fontWeight: 800,
                            boxShadow: isCurrent ? '0 0 12px rgba(37, 99, 235, 0.4)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: isCurrent ? 800 : 500,
                            color: isCurrent ? 'var(--primary)' : isCompleted ? 'var(--success)' : 'var(--text-secondary)',
                            textAlign: 'center'
                          }}
                        >
                          {st.key}
                        </span>
                      </div>
                      {idx < stages.length - 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            left: `${(idx / (stages.length - 1)) * 100}%`,
                            width: `${(1 / (stages.length - 1)) * 100}%`,
                            height: '3px',
                            backgroundColor: idx < currIdx ? 'var(--success)' : 'var(--border)',
                            zIndex: 1,
                            top: '12px'
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Task Waves Breakdown */}
              {order.tasks && order.tasks.length > 0 && (
                <div
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Decomposed Task Graph & Dependency Gates (PRD Section 4 & 5)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '8px' }}>
                    {order.tasks.map((task) => (
                      <div
                        key={task.taskId || task.id}
                        className="panel-card"
                        style={{
                          padding: '10px 12px',
                          fontSize: '12px'
                        }}
                      >
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {task.taskName || task.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px' }}>
                          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            {task.assignedWorkerId && task.assignedWorkerId !== 'UNASSIGNED' ? `${task.assignedWorkerId}` : 'Pool Queue'}
                          </span>
                          <span
                            className={
                              task.status === 'COMPLETED'
                                ? 'badge badge-success'
                                : task.status === 'IN_PROGRESS' || task.status === 'Processing'
                                ? 'badge badge-warning'
                                : 'badge badge-neutral'
                            }
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decision Explain Modal */}
      {selectedOrderForExplain && (
        <DecisionExplainModal
          isOpen={Boolean(selectedOrderForExplain)}
          onClose={() => setSelectedOrderForExplain(null)}
          order={selectedOrderForExplain}
        />
      )}
    </div>
  );
}
