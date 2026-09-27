import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export default function TradeInModal({ isOpen, onClose, onApplyCredit }) {
  if (!isOpen) return null;

  const [deviceModel, setDeviceModel] = useState('iPhone 14 Pro');
  const [deviceCondition, setDeviceCondition] = useState('good');
  const [storageCapacity, setStorageCapacity] = useState('128GB');

  const modelValuations = {
    'iPhone 15 Pro Max': 65000,
    'iPhone 15 Pro': 52000,
    'iPhone 14 Pro Max': 46000,
    'iPhone 14 Pro': 40000,
    'iPhone 13 Pro Max': 35000,
    'iPhone 13 Pro': 30000,
    'MacBook Air M1': 38000,
    'MacBook Pro 14" M1 Pro': 58000,
    'Samsung Galaxy S23 Ultra': 38000
  };

  const conditionMultiplier = {
    flawless: 1.0,
    good: 0.9,
    scratched: 0.75,
    cracked: 0.4
  };

  const baseVal = modelValuations[deviceModel] || 35000;
  const finalEstimate = Math.round(baseVal * (conditionMultiplier[deviceCondition] || 1.0));

  const handleApply = () => {
    playAppleSound('add_to_bag');
    onApplyCredit(finalEstimate);
    onClose();
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
          maxWidth: '560px',
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
            <RefreshCw size={18} color="var(--color-apple-blue)" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-carbon)' }}>
              QuickFlow Trade-In Calculator
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

        {/* Form Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Step 1: Select Model */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)', marginBottom: '6px', display: 'block' }}>
              1. Select Your Current Smartphone / Laptop
            </label>
            <select
              value={deviceModel}
              onChange={(e) => {
                playAppleSound('pop');
                setDeviceModel(e.target.value);
              }}
              className="quickflow-input"
            >
              {Object.keys(modelValuations).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Step 2: Storage */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)', marginBottom: '6px', display: 'block' }}>
              2. Storage Capacity
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['128GB', '256GB', '512GB', '1TB'].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    playAppleSound('pop');
                    setStorageCapacity(s);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: storageCapacity === s ? '2px solid var(--color-apple-blue)' : '1px solid var(--color-border)',
                    backgroundColor: storageCapacity === s ? 'rgba(0,113,227,0.06)' : '#ffffff',
                    color: storageCapacity === s ? 'var(--color-apple-blue)' : 'var(--color-carbon)',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Condition Check */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)', marginBottom: '6px', display: 'block' }}>
              3. Device Cosmetic Condition
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { id: 'flawless', label: 'Flawless Condition', desc: 'Zero scratches, 90%+ battery' },
                { id: 'good', label: 'Normal / Good Use', desc: 'Minor hairline wear, 100% working' },
                { id: 'scratched', label: 'Moderate Scratches', desc: 'Cosmetic dings on chassis' },
                { id: 'cracked', label: 'Cracked Glass / Back', desc: 'Functional with cracked surface' }
              ].map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    playAppleSound('pop');
                    setDeviceCondition(c.id);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: deviceCondition === c.id ? '2px solid var(--color-apple-blue)' : '1px solid var(--color-border)',
                    backgroundColor: deviceCondition === c.id ? 'rgba(0,113,227,0.06)' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)' }}>{c.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Value Box */}
          <div
            style={{
              padding: '18px 20px',
              backgroundColor: 'rgba(16, 185, 129, 0.06)',
              borderRadius: '14px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                Instant Trade-In Valuation
              </span>
              <div style={{ fontSize: '13px', color: 'var(--color-carbon)', marginTop: '2px' }}>
                Credit for {deviceModel} ({storageCapacity}):
              </div>
            </div>

            <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669' }}>
              ₹{finalEstimate.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
          <button
            onClick={() => { playAppleSound('click'); onClose(); }}
            className="btn-ghost"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="btn-quickflow"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            Apply ₹{finalEstimate.toLocaleString('en-IN')} Voucher
          </button>
        </div>
      </div>
    </div>
  );
}
