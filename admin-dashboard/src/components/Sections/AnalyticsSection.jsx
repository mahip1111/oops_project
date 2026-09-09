import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  Truck,
  Building2,
  Users,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  MapPin,
  Activity
} from 'lucide-react';

export default function AnalyticsSection({ metrics, onOpenDispatchModal }) {
  const [timeRange, setTimeRange] = useState('today');
  const analytics = metrics.analytics || {};

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Time Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Operational Performance & SLA Analytics
            </h1>
            <span className="badge badge-success">
              Live KPI Engine
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Real-time telemetry algorithms calculating SLA latency, workforce efficiency, and hub throughput metrics.
          </p>
        </div>

        {/* Time Range Selector */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface-elevated)', padding: '3px', borderRadius: '9999px', border: '1px solid var(--border)' }}>
          {[
            { id: 'today', label: 'Today (Live)' },
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: '30 Days' },
            { id: 'q1', label: 'Q1 2026' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id)}
              style={{
                padding: '5px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: timeRange === t.id ? 'var(--primary)' : 'transparent',
                color: timeRange === t.id ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.12s ease'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 7 PRIMARY CALCULATED ANALYTICS METRICS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {/* 1. Average Order Processing: 38 sec */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Avg Order Processing
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={16} color="var(--primary)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
            {analytics.avgOrderProcessing || '38 sec'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowDownRight size={13} />
            <span>-4.2s faster than SLA (&lt;45s)</span>
          </div>
        </div>

        {/* 2. Average Fulfillment: 2.4 hr */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Avg Fulfillment Time
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--purple-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} color="var(--purple)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--purple)' }}>
            {analytics.avgFulfillment || '2.4 hr'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowDownRight size={13} />
            <span>Dock release to courier handoff</span>
          </div>
        </div>

        {/* 3. Warehouse Utilization: 78.3% */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Warehouse Utilization
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--warning-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={16} color="var(--warning)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--warning)' }}>
            {analytics.warehouseUtilization || '78.3%'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            Network avg (Kolkata max 96%)
          </div>
        </div>

        {/* 4. Worker Utilization: 81% */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Worker Utilization
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} color="var(--success)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)' }}>
            {analytics.workerUtilization || '81%'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={13} />
            <span>37 / 57 staff actively picking</span>
          </div>
        </div>

        {/* 5. Late Orders: 3.2% */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Late Orders Rate
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--danger-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={16} color="var(--danger)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--danger)' }}>
            {analytics.lateOrders || '3.2%'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            399 of 12,482 orders delayed
          </div>
        </div>

        {/* 6. Failed Tasks: 12 */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Failed Tasks
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--danger-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={16} color="var(--danger)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--danger)' }}>
            {analytics.failedTasks || 12}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--danger)' }}>
            0.8% failure rate in pipeline
          </div>
        </div>

        {/* 7. Retry Rate: 2.6% */}
        <div className="kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Auto-Retry Recovery
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={16} color="var(--primary)" />
            </div>
          </div>
          <div className="tabular-nums" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>
            {analytics.retryRate || '2.6%'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--success)' }}>
            91.4% auto recovery success
          </div>
        </div>
      </div>

      {/* HOURLY VELOCITY CURVE & SLA BREAKDOWN */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Hourly Order Throughput Graph */}
        <div className="panel-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Order Processing Velocity Curve (Today)
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Average processing time maintains &lt;38s across peak midday volume
              </p>
            </div>
            <span className="badge badge-success">
              SLA 96.8% Compliant
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '170px', paddingTop: '16px', gap: '10px' }}>
            {(analytics.hourlyProcessingCurve || []).map((point, i) => {
              const heightPct = (point.orders / 2000) * 100;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 700 }}>{point.avgTime}</span>
                  <div
                    style={{
                      width: '100%',
                      height: `${heightPct}%`,
                      background: 'linear-gradient(180deg, var(--primary) 0%, #1D4ED8 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.4s ease'
                    }}
                    title={`${point.orders} orders processed in ${point.avgTime}`}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{point.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SLA Compliance Scorecard */}
        <div className="panel-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px' }}>
              SLA Health Index
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              Contractual delivery target adherence
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>On-Time Dispatch Rate:</span>
                  <strong style={{ color: 'var(--success)' }}>96.8%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '96.8%', height: '100%', background: 'var(--success)', borderRadius: '9999px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Packing Speed SLA (&lt;15m):</span>
                  <strong style={{ color: 'var(--primary)' }}>94.2%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '94.2%', height: '100%', background: 'var(--primary)', borderRadius: '9999px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>First-Attempt Delivery:</span>
                  <strong style={{ color: 'var(--purple)' }}>98.4%</strong>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-surface-elevated)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '98.4%', height: '100%', background: 'var(--purple)', borderRadius: '9999px' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
            System SLA Baseline: Target 95.0% • Currently <strong style={{ color: 'var(--success)' }}>+1.8% Above Target</strong>
          </div>
        </div>
      </div>

      {/* 4-HUB REGIONAL BENCHMARK COMPARISON TABLE */}
      <div className="panel-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 2px' }}>
          Regional Hub SLA & Efficiency Benchmarks
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
          Comparative analytics across Delhi, Mumbai, Hyderabad, and Kolkata logistics centers
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Regional Hub</th>
                <th>Avg Processing</th>
                <th>Avg Fulfillment</th>
                <th>Warehouse Util</th>
                <th>Worker Util</th>
                <th>Late Orders</th>
                <th>SLA Compliance</th>
                <th style={{ textAlign: 'right' }}>Performance Status</th>
              </tr>
            </thead>
            <tbody>
              {(analytics.hubBenchmarks || []).map((hub) => {
                const isKolkata = hub.city === 'Kolkata';
                return (
                  <tr key={hub.city}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={14} color={isKolkata ? 'var(--danger)' : 'var(--primary)'} />
                        <span>{hub.city} SuperHub</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {hub.processing}
                    </td>
                    <td style={{ color: 'var(--purple)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {hub.fulfillment}
                    </td>
                    <td>
                      <strong style={{ color: isKolkata ? 'var(--danger)' : 'var(--warning)' }}>{hub.warehouseUtil}</strong>
                    </td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>
                      {hub.workerUtil}
                    </td>
                    <td style={{ color: isKolkata ? 'var(--danger)' : 'var(--text-secondary)' }}>
                      {hub.lateRate}
                    </td>
                    <td style={{ color: 'var(--success)', fontWeight: 700 }}>
                      {hub.sla}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={isKolkata ? 'badge badge-danger' : 'badge badge-success'}>
                        {isKolkata ? 'High Load Alert' : 'Exceeding Target'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
