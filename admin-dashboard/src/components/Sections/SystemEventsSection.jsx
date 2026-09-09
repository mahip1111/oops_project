import React, { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Database,
  Building2,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export default function SystemEventsSection({ logs = [], onClearLogs }) {
  const [events, setEvents] = useState([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/events');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const eventTypes = [
    'ALL',
    'OrderCreated',
    'InventoryReserved',
    'WarehouseAssigned',
    'TaskCreated',
    'TaskAssigned',
    'TaskCompleted',
    'OrderPacked',
    'QCCompleted',
    'OrderShipped'
  ];

  const getEventBadge = (type) => {
    switch (type) {
      case 'OrderCreated': return <span className="badge badge-info">OrderCreated</span>;
      case 'InventoryReserved': return <span className="badge badge-success">InventoryReserved</span>;
      case 'WarehouseAssigned': return <span className="badge badge-purple">WarehouseAssigned</span>;
      case 'TaskCreated': return <span className="badge badge-info">TaskCreated</span>;
      case 'TaskAssigned': return <span className="badge badge-warning">TaskAssigned</span>;
      case 'TaskCompleted': return <span className="badge badge-success">TaskCompleted</span>;
      case 'OrderPacked': return <span className="badge badge-purple">OrderPacked</span>;
      case 'QCCompleted': return <span className="badge badge-success">QCCompleted</span>;
      case 'OrderShipped': return <span className="badge badge-info">OrderShipped</span>;
      default: return <span className="badge badge-neutral">{type}</span>;
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesType = selectedType === 'ALL' || e.eventType === selectedType;
    const matchesSearch =
      (e.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.orderId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.hubCode || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              System Event Stream & Auditable Log
            </h1>
            <span className="badge badge-purple">
              PRD Section 9
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Traceable event ledger recording state changes across orders, inventory locks, task waves, and QC milestones.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={fetchEvents}
            className="btn-secondary"
            style={{ fontSize: '12px' }}
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            Refresh Log
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}
      >
        {eventTypes.map((type) => {
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                border: '1px solid var(--border)',
                background: isSelected ? 'var(--primary)' : 'var(--surface)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.12s ease'
              }}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="panel-card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Filter audit events by order ID, message keyword, or hub code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input"
            style={{ border: 'none', padding: '4px 0' }}
          />
        </div>
      </div>

      {/* Events Table / Stream List */}
      <div className="panel-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Event Type</th>
                <th>Order ID</th>
                <th>Hub</th>
                <th>Auditable Message</th>
                <th>Operator / Subsystem</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No system events matching the current filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt, idx) => (
                  <tr key={evt.id || idx}>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{evt.timestamp}</td>
                    <td>{getEventBadge(evt.eventType)}</td>
                    <td>
                      <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        {evt.orderId || '—'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{evt.hubCode || 'SYSTEM'}</span>
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontSize: '12.5px' }}>{evt.message}</td>
                    <td>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        {evt.source || 'C++ Core'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
