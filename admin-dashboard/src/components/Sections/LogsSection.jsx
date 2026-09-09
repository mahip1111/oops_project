import React, { useState } from 'react';
import { Terminal, Shield, AlertTriangle, CheckCircle2, Info, Filter, Trash2, Download } from 'lucide-react';

export default function LogsSection({ logs, onClearLogs }) {
  const [filterLevel, setFilterLevel] = useState('ALL');

  const filteredLogs = logs.filter((l) => {
    if (filterLevel === 'ALL') return true;
    return l.level === filterLevel;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', fontWeight: 800, color: 'var(--text-main)' }}>
            Telemetry & Security Audit Logs
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Real-time event stream from warehouse gateways, pickers, and automated routing microservices
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClearLogs} className="btn-secondary">
            <Trash2 size={14} />
            <span>Clear Stream</span>
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
        {/* Filter Badges */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['ALL', 'INFO', 'SUCCESS', 'WARN', 'ERROR'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: filterLevel === lvl ? 'var(--text-main)' : '#f1f5f9',
                color: filterLevel === lvl ? '#ffffff' : 'var(--text-muted)',
                transition: 'all 0.15s ease'
              }}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* High-Contrast Code / Log Terminal Window */}
        <div
          style={{
            background: '#0f172a',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            padding: '18px',
            fontFamily: 'var(--font-mono)',
            fontSize: '12.5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxHeight: '480px',
            overflowY: 'auto',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {filteredLogs.length === 0 ? (
            <div style={{ color: '#64748b', textAlign: 'center', padding: '30px' }}>
              No log messages matching filter criteria.
            </div>
          ) : (
            filteredLogs.map((log) => {
              let color = '#38bdf8';
              if (log.level === 'SUCCESS') color = '#34d399';
              if (log.level === 'WARN') color = '#fbbf24';
              if (log.level === 'ERROR') color = '#f43f5e';

              return (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderLeft: `3px solid ${color}`
                  }}
                >
                  <span style={{ color: '#94a3b8', minWidth: '75px' }}>[{log.time}]</span>
                  <span
                    style={{
                      color,
                      fontWeight: 700,
                      minWidth: '65px',
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: `${color}18`,
                      textAlign: 'center'
                    }}
                  >
                    {log.level}
                  </span>
                  <span style={{ color: '#a5b4fc', fontWeight: 600, minWidth: '75px' }}>[{log.hub}]</span>
                  <span style={{ color: '#f8fafc', flex: 1, lineHeight: '1.4' }}>{log.message}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
