import React, { useState } from 'react';
import {
  Building2,
  AlertTriangle,
  ArrowRightLeft,
  Truck,
  Box,
  Sliders,
  ShieldAlert,
  MapPin,
  Route,
  Activity,
  Cpu
} from 'lucide-react';

export default function WarehouseSection({
  warehouses = [],
  onOpenRebalanceModal,
  onRebalanceHub
}) {
  const defaultWarehouses = [
    { id: 'wh-1', code: 'DEL-01', name: 'Delhi SuperHub (North)', city: 'Delhi', capacityPercent: 72, occupiedPallets: 14400, maxPallets: 20000, activeStaff: 14, agvBots: 45, hourlyThroughput: 820, workerCapacity: '88% Active', taskLoad: 342, status: 'Optimal' },
    { id: 'wh-2', code: 'BOM-04', name: 'Mumbai MegaPort (West)', city: 'Mumbai', capacityPercent: 84, occupiedPallets: 21000, maxPallets: 25000, activeStaff: 18, agvBots: 62, hourlyThroughput: 1140, workerCapacity: '92% Active', taskLoad: 580, status: 'Heavy Load' },
    { id: 'wh-3', code: 'HYD-02', name: 'Hyderabad Cyber Node (South)', city: 'Hyderabad', capacityPercent: 61, occupiedPallets: 10980, maxPallets: 18000, activeStaff: 12, agvBots: 38, hourlyThroughput: 690, workerCapacity: '68% Active', taskLoad: 210, status: 'Optimal' },
    { id: 'wh-4', code: 'CCU-03', name: 'Kolkata Gateway (East)', city: 'Kolkata', capacityPercent: 96, occupiedPallets: 21120, maxPallets: 22000, activeStaff: 13, agvBots: 37, hourlyThroughput: 580, workerCapacity: '96% Active', taskLoad: 410, status: 'Critical Load' }
  ];

  const currentWarehouses = warehouses.length > 0 ? warehouses.map((w, idx) => ({
    ...defaultWarehouses[idx % defaultWarehouses.length],
    ...w,
    capacityPercent: w.capacityPercentage || w.capacityPercent || w.utilization || defaultWarehouses[idx % defaultWarehouses.length].capacityPercent
  })) : defaultWarehouses;

  const [selectedHub, setSelectedHub] = useState(currentWarehouses[3]); // Default to Kolkata (96%)

  const networkEdges = [
    { from: 'BOM-04 (Mumbai)', to: 'BBI-01 (Bhubaneswar)', dist: '1,640 km', latency: '1.4 ms', shortest: false, tariff: '₹41.4' },
    { from: 'DEL-01 (Delhi)', to: 'BBI-01 (Bhubaneswar)', dist: '1,500 km', latency: '1.2 ms', shortest: false, tariff: '₹67.3' },
    { from: 'HYD-02 (Hyderabad)', to: 'BBI-01 (Bhubaneswar)', dist: '1,050 km', latency: '0.7 ms', shortest: false, tariff: '₹32.0' },
    { from: 'CCU-03 (Kolkata)', to: 'BBI-01 (Bhubaneswar)', dist: '440 km', latency: '0.5 ms', shortest: true, tariff: '₹14.8' }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Warehouse Logistics & Network Topology
            </h1>
            <span className="badge badge-info">
              PRD Section 6
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Real-time capacity, worker fleets, active orders, and Dijkstra shortest-path network routing.
          </p>
        </div>

        <button onClick={onOpenRebalanceModal} className="btn-primary">
          <Sliders size={14} />
          <span>Rebalance Hubs</span>
        </button>
      </div>

      {/* Critical Alert Box for Kolkata 96% */}
      {currentWarehouses.some((w) => w.capacityPercent >= 90) && (
        <div
          className="panel-card"
          style={{
            padding: '14px 18px',
            borderLeft: '4px solid var(--danger)',
            background: 'var(--danger-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} color="var(--danger)" />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--danger)' }}>
                Kolkata Hub Approaching Max Capacity (96%)
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Occupancy reached 21,120 / 22,000 pallets. Recommend transferring buffer volume to Hyderabad (61%).
              </div>
            </div>
          </div>

          <button
            onClick={onOpenRebalanceModal}
            className="btn-danger"
            style={{ fontSize: '12.5px', padding: '6px 14px' }}
          >
            <ArrowRightLeft size={14} />
            <span>Shift Volume to Hyderabad</span>
          </button>
        </div>
      )}

      {/* 4 REGIONAL HUBS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        {currentWarehouses.map((wh) => {
          const isOverloaded = wh.capacityPercent >= 90;
          const isBusy = wh.capacityPercent >= 75 && wh.capacityPercent < 90;
          const barColor = isOverloaded ? 'var(--danger)' : isBusy ? 'var(--warning)' : 'var(--success)';
          const isSelected = selectedHub?.code === wh.code;

          return (
            <div
              key={wh.code}
              className="panel-card"
              style={{
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                background: isSelected ? 'var(--primary-subtle)' : 'var(--surface)',
                boxShadow: isSelected ? '0 0 0 1px var(--primary)' : 'var(--shadow-sm)'
              }}
              onClick={() => setSelectedHub(wh)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} color="var(--primary)" />
                  <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{wh.name}</strong>
                </div>
                <span
                  className={
                    isOverloaded
                      ? 'badge badge-danger'
                      : isBusy
                      ? 'badge badge-warning'
                      : 'badge badge-success'
                  }
                >
                  {isOverloaded ? '● Critical (96%)' : isBusy ? '● Heavy (84%)' : '● Optimal'}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '5px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Pallet Occupancy</span>
                  <strong className="tabular-nums" style={{ color: barColor }}>
                    {wh.occupiedPallets?.toLocaleString()} / {wh.maxPallets?.toLocaleString()} ({wh.capacityPercent}%)
                  </strong>
                </div>
                <div style={{ height: '7px', width: '100%', background: 'var(--bg-surface-elevated)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${wh.capacityPercent}%`, background: barColor, borderRadius: '9999px', transition: 'width 0.3s ease' }} />
                </div>
              </div>

              {/* Stats Footer */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', paddingTop: '6px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '11px' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Staff</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{wh.activeStaff || 14} active</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>AGV Bots</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{wh.agvBots || 42} pods</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Throughput</div>
                  <strong style={{ color: 'var(--text-primary)' }}>{wh.hourlyThroughput || 780}/hr</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dijkstra Network Topology Router (PRD Section technical graph) */}
      <div className="panel-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Route size={18} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                C++ Dijkstra Shortest-Path Network Topology
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                Target Destination Node: <strong>BBI-01 (Bhubaneswar Hub Gateway)</strong>
              </p>
            </div>
          </div>
          <span className="badge badge-success">
            Algorithmic Route Resolution: 0.5 ms
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {networkEdges.map((edge) => (
            <div
              key={edge.from}
              style={{
                padding: '14px',
                borderRadius: '8px',
                border: edge.shortest ? '1.5px solid var(--success)' : '1px solid var(--border)',
                background: edge.shortest ? 'var(--success-subtle)' : 'var(--bg-surface-elevated)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {edge.from}
                </span>
                {edge.shortest ? (
                  <span className="badge badge-success">SHORTEST PATH</span>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Alternative</span>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Distance: <strong>{edge.dist}</strong></span>
                <span style={{ color: 'var(--text-secondary)' }}>Transit Latency: <strong>{edge.latency}</strong></span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Tariff: {edge.tariff}</span>
                <span style={{ color: edge.shortest ? 'var(--success)' : 'inherit', fontWeight: 600 }}>
                  {edge.shortest ? '✓ Optimal Cost Vector' : 'Higher transit cost'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
