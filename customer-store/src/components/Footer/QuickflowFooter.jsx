import React from 'react';

export default function QuickflowFooter({ setCurrentView, setSelectedCategory }) {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        background: '#f5f5f7',
        padding: '50px 32px 36px',
        color: 'var(--text-muted)',
        fontSize: '13px'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '0.8px', color: 'var(--color-carbon)', marginBottom: '10px' }}>
            QUICKFLOW
          </div>
          <p style={{ lineHeight: '1.5', color: 'var(--text-muted)' }}>
            High-performance hardware engineered for everyday life and backed by a modern 4-hub fulfillment network.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--color-carbon)', fontWeight: 700, marginBottom: '12px' }}>Categories</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['laptops', 'headphones', 'keyboards', 'mice', 'chargers', 'smart-devices'].map((cat) => (
              <span
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentView('shop'); window.scrollTo({ top: 500, behavior: 'smooth' }); }}
                style={{ cursor: 'pointer', textTransform: 'capitalize', color: 'var(--text-muted)' }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-apple-blue)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {cat.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ color: 'var(--color-carbon)', fontWeight: 700, marginBottom: '12px' }}>Smarter Fulfillment</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
            <span>Delhi SuperHub (NCR-01)</span>
            <span>Mumbai MegaPort (BOM-04)</span>
            <span>Hyderabad Cyber Hub (HYD-02)</span>
            <span>Kolkata Gateway (CCU-03)</span>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'var(--color-carbon)', fontWeight: 700, marginBottom: '12px' }}>Customer Care</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setCurrentView('track')}>Track Your Shipment</span>
            <span>24/7 Specialist Live Assistance</span>
            <span>30-Day Zero Risk Returns</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid var(--color-border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', color: 'var(--text-faint)', fontSize: '12px' }}>
        <span>© 2026 QUICKFLOW Inc. All rights reserved.</span>
        <span>Engineered for everyday life • Connected to C++ Dispatch Engine</span>
      </div>
    </footer>
  );
}
