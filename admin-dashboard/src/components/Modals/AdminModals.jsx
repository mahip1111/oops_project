import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Zap,
  Plus,
  X,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  BrainCircuit,
  Award,
  ShieldCheck,
  TrendingDown,
  Navigation,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 1. REBALANCE WAREHOUSE LOAD MODAL
export function RebalanceModal({
  isOpen,
  onClose,
  warehouses,
  onConfirmRebalance
}) {
  const [fromHub, setFromHub] = useState('Kolkata (CCU-03) - 96% Capacity');
  const [toHub, setToHub] = useState('Hyderabad (HYD-02) - 61% Capacity');
  const [transferPercent, setTransferPercent] = useState(15);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmRebalance({ fromHub, toHub, transferPercent });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '480px', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Rebalance Regional Hub Load
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Source Hub (Overloaded)
            </label>
            <select
              value={fromHub}
              onChange={(e) => setFromHub(e.target.value)}
              className="admin-select"
              style={{
                color: 'var(--danger)',
                fontWeight: 600,
                borderColor: 'var(--danger-border)'
              }}
            >
              <option value="Kolkata (CCU-03) - 96% Capacity">Kolkata (CCU-03) — 96% Capacity (CRITICAL)</option>
              <option value="Mumbai (BOM-04) - 84% Capacity">Mumbai (BOM-04) — 84% Capacity</option>
              <option value="Delhi (NCR-01) - 72% Capacity">Delhi (NCR-01) — 72% Capacity</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Destination Hub (Available Headroom)
            </label>
            <select
              value={toHub}
              onChange={(e) => setToHub(e.target.value)}
              className="admin-select"
              style={{
                color: 'var(--success)',
                fontWeight: 600,
                borderColor: 'var(--success-border)'
              }}
            >
              <option value="Hyderabad (HYD-02) - 61% Capacity">Hyderabad (HYD-02) — 61% Capacity (Optimal)</option>
              <option value="Delhi (NCR-01) - 72% Capacity">Delhi (NCR-01) — 72% Capacity (Optimal)</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Transfer Volume:</span>
              <strong style={{ color: 'var(--primary)' }}>{transferPercent}% (~4,600 pallets)</strong>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={transferPercent}
              onChange={(e) => setTransferPercent(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--primary-subtle)', border: '1px solid var(--primary-border)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            ✓ Will reduce Kolkata occupancy from <strong>96% → 81%</strong> and increase destination throughput efficiently.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <ArrowRightLeft size={14} />
              <span>Execute Rebalancing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. CREATE TASK MODAL
export function CreateTaskModal({
  isOpen,
  onClose,
  workers,
  onConfirmCreateTask
}) {
  const [title, setTitle] = useState('');
  const [hub, setHub] = useState('Delhi');
  const [priority, setPriority] = useState('High');
  const [assignedWorker, setAssignedWorker] = useState('Available Pool (18 Ready)');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onConfirmCreateTask({
      id: `TSK-${Math.floor(1050 + Math.random() * 900)}`,
      title,
      hub,
      priority,
      category: 'Fulfillment',
      assignedWorker,
      status: 'Processing',
      eta: '8 mins',
      createdAt: 'Just now'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '460px', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Create Operations Task
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Scan & Seal 100x Apple Watch Ultra"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="admin-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Assigned Hub
              </label>
              <select
                value={hub}
                onChange={(e) => setHub(e.target.value)}
                className="admin-select"
              >
                <option value="Delhi">Delhi (NCR-01)</option>
                <option value="Mumbai">Mumbai (BOM-04)</option>
                <option value="Hyderabad">Hyderabad (HYD-02)</option>
                <option value="Kolkata">Kolkata (CCU-03)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="admin-select"
              >
                <option value="Urgent">Urgent (P+4)</option>
                <option value="High">High (P+2)</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Assign to Specialist / Fleet Pool
            </label>
            <select
              value={assignedWorker}
              onChange={(e) => setAssignedWorker(e.target.value)}
              className="admin-select"
            >
              <option value="Available Pool (18 Ready)">Auto-Assign (18 Available Staff & Bots)</option>
              <option value="AGV Pod Alpha (Dock 04)">AGV Pod Alpha (Dock 04)</option>
              <option value="AGV Pod Gamma (Dock 01)">AGV Pod Gamma (Dock 01)</option>
              <option value="Priya Nair (QC Lead)">Priya Nair (Lead QC)</option>
              <option value="Rahul Verma (Pack Pro)">Rahul Verma (Packaging)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={14} />
              <span>Launch Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. DISPATCH WAVE MODAL
export function DispatchWaveModal({
  isOpen,
  onClose,
  onConfirmDispatch
}) {
  const [batchCount, setBatchCount] = useState(250);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmDispatch(batchCount);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '440px', padding: '24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Trigger Automated Wave Dispatch
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Simulate automated release of pending orders to sorting conveyors and carrier dock bays.
          </p>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Wave Size:</span>
              <strong style={{ color: 'var(--primary)' }}>{batchCount} Packages</strong>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={batchCount}
              onChange={(e) => setBatchCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Zap size={14} />
              <span>Launch Wave ({batchCount})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. DECISION EXPLAINABILITY INSPECTOR MODAL (PRD Section 4 & 5: Eligibility + Lower-is-better cost score)
export function DecisionExplainModal({
  isOpen,
  onClose,
  order
}) {
  if (!isOpen || !order) return null;

  const evalResult = order.evaluationResult || {
    winningHub: order.hubCode || 'BOM-04',
    winningHubName: order.hub || 'Mumbai MegaPort',
    winningCostScore: 182.2,
    explanation: `${order.hub || 'Mumbai MegaPort'} selected with lowest fulfillment cost (182.2 pts) across eligible superhubs with full stock availability.`,
    candidates: [
      { hubCode: 'BOM-04', hubName: 'Mumbai MegaPort', isEligible: true, distanceKm: 1640, distanceCost: 82.0, workloadCost: 39.6, processingCost: 19.2, shippingCost: 41.4, totalCostScore: 182.2, selected: true },
      { hubCode: 'DEL-01', hubName: 'Delhi SuperHub', isEligible: true, distanceKm: 1500, distanceCost: 75.0, workloadCost: 28.8, processingCost: 22.4, shippingCost: 67.3, totalCostScore: 193.5, selected: false, rejectionReason: 'Higher composite cost vs Mumbai' },
      { hubCode: 'HYD-02', hubName: 'Hyderabad Cyber Node', isEligible: false, rejectionReason: 'INELIGIBLE: Out of stock for MacBook Pro 14"', selected: false },
      { hubCode: 'CCU-03', hubName: 'Kolkata Gateway', isEligible: false, rejectionReason: 'INELIGIBLE: Out of stock for Magic Mouse', selected: false }
    ]
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '24px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrainCircuit size={18} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                C++ Decision & Eligibility Inspector
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Order #{order.id} • Destination: {order.destination || order.city || 'Bhubaneswar'}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Selected Hub Winner Banner */}
        <div
          style={{
            background: 'var(--primary-subtle)',
            border: '1.5px solid var(--primary-border)',
            borderRadius: '10px',
            padding: '16px 18px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="var(--primary)" />
              <strong style={{ fontSize: '14.5px', color: 'var(--primary)' }}>
                Selected Hub: {evalResult.winningHubName} ({evalResult.winningHub})
              </strong>
            </div>
            <span className="badge badge-success">
              Lowest Cost Score: {evalResult.winningCostScore} pts
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: '1.45' }}>
            {evalResult.explanation}
          </p>
        </div>

        {/* Multi-Factor Cost Scoring Formula */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Fulfillment Cost Function Factors (Lower Score is Better)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '11px', textAlign: 'center' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)' }}>Distance Cost</div>
              <strong style={{ color: 'var(--text-primary)' }}>0.05 / km</strong>
            </div>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)' }}>Workload Penalty</div>
              <strong style={{ color: 'var(--text-primary)' }}>Util * 0.40</strong>
            </div>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)' }}>Processing Time</div>
              <strong style={{ color: 'var(--text-primary)' }}>Latency * 0.8</strong>
            </div>
            <div style={{ background: 'var(--bg-surface-elevated)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)' }}>Shipping Tariff</div>
              <strong style={{ color: 'var(--text-primary)' }}>Dist * Rate</strong>
            </div>
          </div>
        </div>

        {/* Candidate Hubs Comparison Matrix with Eligibility Flag (PRD Section 4) */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            SuperHub Inventory Eligibility & Cost Matrix
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {evalResult.candidates?.map((c) => (
              <div
                key={c.hubCode}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: c.selected ? 'var(--primary-subtle)' : 'var(--bg-surface-elevated)',
                  border: `1.5px solid ${c.selected ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
                      {c.hubName} ({c.hubCode})
                    </strong>
                    {c.selected ? (
                      <span className="badge badge-info">
                        SELECTED (LOWEST COST)
                      </span>
                    ) : c.isEligible ? (
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Eligible • {c.rejectionReason}
                      </span>
                    ) : (
                      <span className="badge badge-danger">
                        <XCircle size={12} /> {c.rejectionReason}
                      </span>
                    )}
                  </div>
                  {c.isEligible && (
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      Dist: {c.distanceKm}km ({c.distanceCost} pts) • Workload: {c.workloadCost} pts • Proc: {c.processingCost} pts • Ship: ₹{c.shippingCost}
                    </div>
                  )}
                </div>

                <div className="tabular-nums" style={{ fontSize: '15px', fontWeight: 800, color: c.selected ? 'var(--primary)' : (c.isEligible ? 'var(--text-secondary)' : 'var(--danger)') }}>
                  {c.isEligible ? `${c.totalCostScore} pts` : 'INELIGIBLE'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-primary">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
