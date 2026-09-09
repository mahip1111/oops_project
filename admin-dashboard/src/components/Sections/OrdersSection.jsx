import React, { useState } from 'react';
import {
  Package,
  Search,
  Zap,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  BrainCircuit,
  RotateCcw
} from 'lucide-react';
import { DecisionExplainModal } from '../Modals/AdminModals';

export default function OrdersSection({
  metrics,
  orders,
  onRetryFailedOrder,
  onOpenDispatchModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedOrderForExplanation, setSelectedOrderForExplanation] = useState(null);

  // Filter orders based on search & active status
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.customer && ord.customer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ord.hub && ord.hub.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ord.items && typeof ord.items === 'string' && ord.items.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatusFilter === 'all' ||
      ord.status.toLowerCase() === selectedStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (priority) => {
    const p = (priority || '').toUpperCase();
    if (p.includes('SAME') || p.includes('URGENT') || p.includes('CRITICAL')) {
      return <span className="badge badge-danger">⚡ {priority}</span>;
    }
    if (p.includes('EXPRESS') || p.includes('HIGH')) {
      return <span className="badge badge-warning">🚀 {priority}</span>;
    }
    return <span className="badge badge-neutral">📦 {priority || 'Standard'}</span>;
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s.includes('COMPLETED') || s.includes('DELIVERED')) {
      return <span className="badge badge-success">● {status}</span>;
    }
    if (s.includes('FAILED') || s.includes('QUARANTINED')) {
      return <span className="badge badge-danger">● {status}</span>;
    }
    if (s.includes('PENDING') || s.includes('ALLOCATED')) {
      return <span className="badge badge-warning">● {status}</span>;
    }
    return <span className="badge badge-info">● {status}</span>;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Export Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Orders Telemetry & Management
            </h1>
            <span className="badge badge-info">
              PRD Section 1 & 4
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Real-time tracking of <strong>{metrics.orders.total.toLocaleString()}</strong> orders with C++ Decision Scoring & Explainability
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onOpenDispatchModal} className="btn-primary">
            <Zap size={15} />
            <span>Dispatch Wave</span>
          </button>
        </div>
      </div>

      {/* 4 PRIMARY METRIC CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
        {/* TOTAL */}
        <div
          onClick={() => setSelectedStatusFilter('all')}
          className="kpi-card"
          style={{
            cursor: 'pointer',
            borderColor: selectedStatusFilter === 'all' ? 'var(--primary)' : 'var(--border)',
            background: selectedStatusFilter === 'all' ? 'var(--primary-subtle)' : 'var(--surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Total Orders
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={16} color="var(--primary)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {metrics.orders.total.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} />
            <span>100% Gross Network Volume</span>
          </div>
        </div>

        {/* PROCESSING */}
        <div
          onClick={() => setSelectedStatusFilter('processing')}
          className="kpi-card"
          style={{
            cursor: 'pointer',
            borderColor: selectedStatusFilter === 'processing' ? 'var(--info)' : 'var(--border)',
            background: selectedStatusFilter === 'processing' ? 'var(--info-subtle)' : 'var(--surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Processing
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--info-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} color="var(--info)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--info)', lineHeight: 1.1 }}>
            {metrics.orders.processing.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Active in routing & picking cells
          </div>
        </div>

        {/* COMPLETED */}
        <div
          onClick={() => setSelectedStatusFilter('completed')}
          className="kpi-card"
          style={{
            cursor: 'pointer',
            borderColor: selectedStatusFilter === 'completed' ? 'var(--success)' : 'var(--border)',
            background: selectedStatusFilter === 'completed' ? 'var(--success-subtle)' : 'var(--surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Completed
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="var(--success)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--success)', lineHeight: 1.1 }}>
            {metrics.orders.completed.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--success)' }}>
            Delivered within SLA window
          </div>
        </div>

        {/* FAILED */}
        <div
          onClick={() => setSelectedStatusFilter('failed')}
          className="kpi-card"
          style={{
            cursor: 'pointer',
            borderColor: selectedStatusFilter === 'failed' ? 'var(--danger)' : 'var(--border)',
            background: selectedStatusFilter === 'failed' ? 'var(--danger-subtle)' : 'var(--surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Failed
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--danger-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={16} color="var(--danger)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '30px', fontWeight: 800, color: 'var(--danger)', lineHeight: 1.1 }}>
            {metrics.orders.failed.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--danger)' }}>
            Requires operator action or retry
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="panel-card" style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '420px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Filter by Order ID, Customer, Hub, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input"
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'processing', 'completed', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              style={{
                background: selectedStatusFilter === st ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: selectedStatusFilter === st ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '9999px',
                padding: '5px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.12s ease'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="panel-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Destination</th>
                <th>Priority</th>
                <th>Assigned Hub</th>
                <th>Decision Score</th>
                <th>Status</th>
                <th>Total Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{ord.id}</td>
                  <td style={{ fontWeight: 600 }}>{ord.customer || 'Customer'}</td>
                  <td>{ord.destination || ord.city || 'Bhubaneswar'}</td>
                  <td>{getPriorityBadge(ord.priority)}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{ord.hub || 'Mumbai MegaPort'}</span>
                  </td>
                  <td>
                    <span className="badge badge-info">
                      {ord.decisionExplanation?.winningScore || '88.4'}/100
                    </span>
                  </td>
                  <td>{getStatusBadge(ord.status)}</td>
                  <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>₹{Number(ord.totalValue || ord.total || 158299).toLocaleString('en-IN')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedOrderForExplanation(ord)}
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}
                        title="Explain C++ Decision"
                      >
                        <BrainCircuit size={13} />
                        <span>Explain</span>
                      </button>

                      {ord.status === 'Failed' && (
                        <button
                          onClick={() => onRetryFailedOrder(ord.id)}
                          className="btn-danger"
                          style={{ padding: '4px 8px', fontSize: '11.5px' }}
                        >
                          <RotateCcw size={12} />
                          <span>Retry</span>
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

      {/* Decision Explainability Modal */}
      <DecisionExplainModal
        isOpen={Boolean(selectedOrderForExplanation)}
        onClose={() => setSelectedOrderForExplanation(null)}
        order={selectedOrderForExplanation}
      />
    </div>
  );
}
