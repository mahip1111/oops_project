import React, { useState } from 'react';
import { X, ArrowRightLeft, Check, Minus } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export default function DeviceCompareModal({ isOpen, onClose, products = [] }) {
  if (!isOpen) return null;

  const [device1Id, setDevice1Id] = useState(products[0]?.id || 'lap-mbp-14');
  const [device2Id, setDevice2Id] = useState(products[1]?.id || 'lap-01');

  const dev1 = products.find(p => p.id === device1Id) || products[0];
  const dev2 = products.find(p => p.id === device2Id) || products[1];

  const getInr = (p) => {
    if (!p) return '₹1,49,900';
    if (p.name.toLowerCase().includes('macbook')) return '₹1,49,900';
    if (p.name.toLowerCase().includes('magic mouse')) return '₹7,900';
    if (p.priceInr) return p.priceInr;
    return `₹${((p.price || 999) * 100).toLocaleString('en-IN')}`;
  };

  return (
    <div
      className="drawer-overlay"
      onClick={() => { playAppleSound('click'); onClose(); }}
      style={{ alignItems: 'center', justifyContent: 'center', padding: '20px' }}
    >
      <div
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-modal)',
          padding: '32px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowRightLeft size={20} color="var(--color-apple-blue)" />
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-carbon)' }}>
              Compare Models Side-by-Side
            </h3>
          </div>
          <button
            onClick={() => { playAppleSound('click'); onClose(); }}
            style={{
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-carbon)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Device Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Device 1</label>
            <select
              value={device1Id}
              onChange={(e) => {
                playAppleSound('pop');
                setDevice1Id(e.target.value);
              }}
              className="quickflow-input"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Device 2</label>
            <select
              value={device2Id}
              onChange={(e) => {
                playAppleSound('pop');
                setDevice2Id(e.target.value);
              }}
              className="quickflow-input"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', textAlign: 'center' }}>
          {/* Col 1 */}
          <div style={{ background: '#fbfbfd', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
            <img src={dev1?.image} alt={dev1?.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', margin: '0 auto 12px' }} />
            <h4 style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-carbon)' }}>{dev1?.name}</h4>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-apple-blue)', margin: '6px 0 16px' }}>{getInr(dev1)}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', textAlign: 'left' }}>
              <div style={{ padding: '8px', background: '#ffffff', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Rating</span>
                <strong>★ {dev1?.rating || 4.9} ({dev1?.reviewsCount || 400} reviews)</strong>
              </div>
              <div style={{ padding: '8px', background: '#ffffff', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Fulfillment SLA</span>
                <strong style={{ color: '#059669' }}>38s Automated Wave</strong>
              </div>
              <div style={{ padding: '8px', background: '#ffffff', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Warranty</span>
                <strong>2 Years Official</strong>
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div style={{ background: '#fbfbfd', padding: '20px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
            <img src={dev2?.image} alt={dev2?.name} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px', margin: '0 auto 12px' }} />
            <h4 style={{ fontWeight: 800, fontSize: '16px', color: 'var(--color-carbon)' }}>{dev2?.name}</h4>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-apple-blue)', margin: '6px 0 16px' }}>{getInr(dev2)}</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', textAlign: 'left' }}>
              <div style={{ padding: '8px', background: '#ffffff', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Rating</span>
                <strong>★ {dev2?.rating || 4.8} ({dev2?.reviewsCount || 280} reviews)</strong>
              </div>
              <div style={{ padding: '8px', background: '#ffffff', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Fulfillment SLA</span>
                <strong style={{ color: '#059669' }}>38s Automated Wave</strong>
              </div>
              <div style={{ padding: '8px', background: '#ffffff', borderRadius: '8px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Warranty</span>
                <strong>2 Years Official</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
