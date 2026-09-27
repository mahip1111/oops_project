import React, { useState } from 'react';
import { X, MapPin, Check, Search, Building2, Truck } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export default function LocationModal({ isOpen, onClose, currentCity, onSelectCity }) {
  if (!isOpen) return null;

  const [pinInput, setPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState('');

  const hubs = [
    { city: 'Bhubaneswar', state: 'Odisha', pin: '751024', speed: 'Next Day Express', status: 'Priority Hub' },
    { city: 'Mumbai', state: 'Maharashtra', pin: '400051', speed: 'Same Day Available', status: 'SuperHub BOM-04' },
    { city: 'Delhi NCR', state: 'Delhi', pin: '110001', speed: 'Same Day Available', status: 'SuperHub NCR-01' },
    { city: 'Kolkata', state: 'West Bengal', pin: '700091', speed: 'Next Day Express', status: 'Regional CCU-03' },
    { city: 'Hyderabad', state: 'Telangana', pin: '500081', speed: 'Next Day Express', status: 'SuperHub HYD-02' },
    { city: 'Bengaluru', state: 'Karnataka', pin: '560001', speed: 'Same Day Available', status: 'Tech Node BLR' }
  ];

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (pinInput.length === 6) {
      playAppleSound('pop');
      setPinMessage(`✓ PIN Code ${pinInput} is eligible for QuickFlow Express 38s dispatch!`);
    } else {
      setPinMessage('Please enter a valid 6-digit Indian PIN Code.');
    }
  };

  return (
    <div
      className="drawer-overlay"
      onClick={() => { playAppleSound('click'); onClose(); }}
      style={{ alignItems: 'center', justifyContent: 'center', padding: '16px' }}
    >
      <div
        className="animate-fade-in store-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-modal)',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--color-apple-blue)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-carbon)' }}>
              Choose Delivery Location
            </h3>
          </div>
          <button
            onClick={() => { playAppleSound('click'); onClose(); }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-carbon)',
              padding: '6px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* PIN Code Verification Form */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border-subtle)' }}>
          <form onSubmit={handleVerifyPin} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit PIN Code..."
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
              className="quickflow-input"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn-quickflow"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Check
            </button>
          </form>
          {pinMessage && (
            <div style={{ fontSize: '12px', color: pinMessage.startsWith('✓') ? '#059669' : '#dc2626', marginTop: '8px', fontWeight: 600 }}>
              {pinMessage}
            </div>
          )}
        </div>

        {/* Major Hub Cities */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Available Network Fulfillment Hubs:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {hubs.map((h) => {
              const isSelected = currentCity === h.city;
              return (
                <div
                  key={h.city}
                  onClick={() => {
                    playAppleSound('pop');
                    onSelectCity(h.city);
                    onClose();
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: isSelected ? '2px solid var(--color-apple-blue)' : '1px solid var(--color-border)',
                    background: isSelected ? 'rgba(0,113,227,0.05)' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-carbon)' }}>{h.city}</div>
                    {isSelected && <Check size={14} color="var(--color-apple-blue)" strokeWidth={3} />}
                  </div>
                  <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
                    {h.speed}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
