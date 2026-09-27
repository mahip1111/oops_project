import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export default function MidBanner({ onShopClick, onTradeInClick }) {
  return (
    <section className="store-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 40px' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #0b0f19 0%, #1e293b 100%)',
          borderRadius: '24px',
          padding: 'clamp(24px, 5vw, 44px) clamp(18px, 4vw, 36px)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
        }}
      >
        <div style={{ maxWidth: '580px' }}>
          <span
            style={{
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}
          >
            <Zap size={14} /> QuickFlow Next-Gen Routing Architecture
          </span>

          <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 800, lineHeight: '1.2', marginBottom: '14px' }}>
            Fulfilled from the Nearest City Node in 38 Seconds.
          </h2>

          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '24px' }}>
            Our C++ Dijkstra pathfinding engine calculates optimal conveyor sorting across Mumbai, Delhi, Kolkata, and Hyderabad fulfillment centers for instant courier handoff.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                playAppleSound('click');
                onShopClick();
              }}
              className="btn-quickflow"
              style={{ padding: '12px 22px', fontSize: '13.5px' }}
            >
              <span>Explore Gear</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => {
                playAppleSound('pop');
                onTradeInClick();
              }}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '9999px',
                fontSize: '13.5px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Check Trade-In Value
            </button>
          </div>
        </div>

        {/* Feature Pill Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '280px' }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8' }}>&lt; 38 Seconds</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Average algorithmic conveyor dispatch time</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#34d399' }}>96.8% SLA Target Adherence</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Real-time warehouse load balancing</div>
          </div>
        </div>
      </div>
    </section>
  );
}
