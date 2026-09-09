import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function ToastAlerts({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%'
      }}
    >
      {toasts.map((toast) => {
        let border = 'var(--border-subtle)';
        let Icon = Info;
        let iconColor = 'var(--accent-blue)';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = '#059669';
        } else if (toast.type === 'warn') {
          Icon = AlertTriangle;
          iconColor = '#d97706';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          iconColor = '#dc2626';
        }

        return (
          <div
            key={toast.id}
            className="animate-fade-in"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#ffffff',
              border: `1px solid ${border}`,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              color: 'var(--text-main)'
            }}
          >
            <Icon size={18} color={iconColor} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)', marginBottom: '2px' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
