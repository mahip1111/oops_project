import React, { useState, useEffect } from 'react';
import {
  X,
  Activity,
  CheckCircle2,
  Clock,
  Radio,
  Copy,
  Check,
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Zap
} from 'lucide-react';

export const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'log-1',
    time: '21:42:08',
    message: 'Inventory successfully reserved',
    subtext: 'SKUs locked across Mumbai Central Stock cluster (BOM-04)',
    type: 'inventory',
    stageIndex: 1
  },
  {
    id: 'log-2',
    time: '21:42:10',
    message: 'Mumbai fulfillment center selected',
    subtext: 'C++ Dijkstra routing computed lowest latency path (1.2 ms)',
    type: 'routing',
    stageIndex: 2
  },
  {
    id: 'log-3',
    time: '21:42:13',
    message: 'Picking task assigned',
    subtext: 'Assigned to Autonomous AGV Pod #48 & Station Picker #18',
    type: 'task',
    stageIndex: 3
  },
  {
    id: 'log-4',
    time: '21:42:18',
    message: 'MacBook located',
    subtext: 'Aisle 04-B / Shelf 12 (RFID Tag: #APL-8941-MBP)',
    type: 'item',
    stageIndex: 3
  },
  {
    id: 'log-5',
    time: '21:42:21',
    message: 'Mouse located',
    subtext: 'Aisle 02-C / Shelf 08 (RFID Tag: #APL-1029-MM)',
    type: 'item',
    stageIndex: 3
  }
];

const EXTENDED_STAGE_LOGS = {
  4: [
    {
      id: 'log-6',
      time: '21:43:04',
      message: 'Items transferred to Packing Station 07',
      subtext: 'Automated pod delivered tray to packing cell',
      type: 'packing',
      stageIndex: 4
    },
    {
      id: 'log-7',
      time: '21:43:18',
      message: 'Protective thermal shock packaging sealed',
      subtext: 'Tamper-evident seal applied with QR signature',
      type: 'packing',
      stageIndex: 4
    }
  ],
  5: [
    {
      id: 'log-8',
      time: '21:43:40',
      message: 'Optical & weight scan verification passed',
      subtext: 'Total net weight: 2.14 kg • Barcodes 100% matched',
      type: 'qc',
      stageIndex: 5
    }
  ],
  6: [
    {
      id: 'log-9',
      time: '21:44:12',
      message: 'Outbound air manifest registered',
      subtext: 'Handed over to QuickFlow Hyperlocal Air Express fleet',
      type: 'dispatch',
      stageIndex: 6
    },
    {
      id: 'log-10',
      time: '21:44:30',
      message: 'Departed Mumbai Gateway Hub (BOM-04)',
      subtext: 'En route via Air Transit Corridor to Bhubaneswar (BBI-01)',
      type: 'dispatch',
      stageIndex: 6
    }
  ],
  7: [
    {
      id: 'log-11',
      time: '21:45:00',
      message: 'Arrived at Bhubaneswar Delivery Hub (BBI-01)',
      subtext: 'Sorted for hyperlocal doorstep dispatch',
      type: 'delivery',
      stageIndex: 7
    },
    {
      id: 'log-12',
      time: '21:45:25',
      message: 'Package delivered and signed',
      subtext: 'Delivered to Bhubaneswar address • Signature captured',
      type: 'delivery',
      stageIndex: 7
    }
  ]
};

export default function ActivityDrawer({ isOpen, onClose, activeStageIndex = 3, orderId = 'QF-10482' }) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('feed'); // 'feed' | 'json'

  // Build active logs based on current stage
  const currentLogs = [...INITIAL_ACTIVITY_LOGS];
  for (let s = 4; s <= activeStageIndex; s++) {
    if (EXTENDED_STAGE_LOGS[s]) {
      currentLogs.push(...EXTENDED_STAGE_LOGS[s]);
    }
  }

  const handleCopyLogs = () => {
    const text = currentLogs.map((l) => `${l.time} - ${l.message} (${l.subtext})`).join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      {/* Drawer Container */}
      <div
        className="animate-slide-left"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          background: '#ffffff',
          borderLeft: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '20px',
                  fontWeight: 800,
                  color: 'var(--color-carbon)',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                ACTIVITY
              </h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#059669',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '2px 8px',
                  borderRadius: '9999px'
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10b981'
                  }}
                />
                LIVE
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Backend Event Stream for <strong>#{orderId}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleCopyLogs}
              title="Copy Activity Stream"
              style={{
                background: '#f5f5f7',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '7px',
                cursor: 'pointer',
                color: copied ? '#059669' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>

            <button
              onClick={onClose}
              style={{
                background: '#f5f5f7',
                border: 'none',
                borderRadius: '50%',
                padding: '7px',
                cursor: 'pointer',
                color: 'var(--color-carbon)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div
          style={{
            padding: '12px 28px',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc'
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing <strong>{currentLogs.length}</strong> system events
          </div>

          <div style={{ display: 'flex', gap: '4px', background: '#e2e8f0', padding: '2px', borderRadius: '6px' }}>
            <button
              onClick={() => setViewMode('feed')}
              style={{
                background: viewMode === 'feed' ? '#ffffff' : 'transparent',
                color: viewMode === 'feed' ? 'var(--color-carbon)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: viewMode === 'feed' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Timeline Feed
            </button>
            <button
              onClick={() => setViewMode('json')}
              style={{
                background: viewMode === 'json' ? '#ffffff' : 'transparent',
                color: viewMode === 'json' ? 'var(--color-carbon)' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: viewMode === 'json' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Raw Event Bus
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px'
          }}
        >
          {viewMode === 'feed' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative' }}>
              {/* Connected Vertical Timeline Track */}
              <div
                style={{
                  position: 'absolute',
                  left: '35px',
                  top: '12px',
                  bottom: '12px',
                  width: '2px',
                  background: '#e2e8f0'
                }}
              />

              {currentLogs.map((log, index) => (
                <div
                  key={log.id || index}
                  className="animate-fade-in"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    position: 'relative'
                  }}
                >
                  {/* Timestamp Chip */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: index === currentLogs.length - 1 ? 'var(--color-apple-blue)' : 'var(--color-carbon)',
                      background: '#f8fafc',
                      border: index === currentLogs.length - 1 ? '1px solid rgba(0, 113, 227, 0.3)' : '1px solid var(--color-border)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      minWidth: '70px',
                      textAlign: 'center',
                      zIndex: 2,
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                    }}
                  >
                    {log.time}
                  </div>

                  {/* Event Details Card */}
                  <div
                    style={{
                      flex: 1,
                      background: index === currentLogs.length - 1 ? 'rgba(0, 113, 227, 0.04)' : '#fbfbfd',
                      border: index === currentLogs.length - 1 ? '1px solid rgba(0, 113, 227, 0.25)' : '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '12px 16px'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'var(--color-carbon)',
                        lineHeight: 1.3
                      }}
                    >
                      {log.message}
                    </div>
                    {log.subtext && (
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-muted)',
                          marginTop: '4px',
                          lineHeight: 1.4
                        }}
                      >
                        {log.subtext}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: '#1d1d1f',
                border: '1px solid #333333',
                borderRadius: '10px',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#34d399',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6
              }}
            >
              {JSON.stringify(
                currentLogs.map((l) => ({
                  timestamp: l.time,
                  event: l.message,
                  meta: l.subtext,
                  origin: 'cpp_event_bus::node_dispatch'
                })),
                null,
                2
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div
          style={{
            padding: '20px 28px',
            borderTop: '1px solid var(--color-border)',
            background: '#fbfbfd',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-carbon)', fontWeight: 500 }}>
            <Zap size={14} color="var(--color-apple-blue)" />
            <span>Telemetry data streamed directly from C++ Event Bus & Node API.</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Sub-second synchronization across Mumbai, Delhi, Kolkata, & Hyderabad nodes.
          </div>
        </div>
      </div>
    </div>
  );
}
