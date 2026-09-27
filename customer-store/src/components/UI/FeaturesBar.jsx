import React from 'react';
import { Zap, ShieldCheck, RotateCcw, CreditCard, Award, Truck } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export default function FeaturesBar({ onOpenTradeIn, onOpenSuperCoins }) {
  return (
    <section className="store-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 28px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid var(--color-border)',
          padding: '16px 20px',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        {/* Feature 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(0, 113, 227, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Zap size={20} color="var(--color-apple-blue)" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-carbon)' }}>38s Wave Dispatch</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Automated warehouse conveyor release</div>
          </div>
        </div>

        {/* Feature 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={20} color="#059669" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-carbon)' }}>2 Years Official Warranty</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Genuine Apple & QuickFlow Care+</div>
          </div>
        </div>

        {/* Feature 3: Trade In Quick Trigger */}
        <div
          onClick={() => {
            playAppleSound('pop');
            onOpenTradeIn();
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <RotateCcw size={20} color="#d97706" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-carbon)' }}>Apple Trade-In Program</div>
            <div style={{ fontSize: '12px', color: 'var(--color-apple-blue)', fontWeight: 600 }}>Get up to ₹65,000 credit ➔</div>
          </div>
        </div>

        {/* Feature 4: Rewards Zone Trigger */}
        <div
          onClick={() => {
            playAppleSound('pop');
            onOpenSuperCoins();
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(147, 51, 234, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Award size={20} color="#9333ea" />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-carbon)' }}>QuickFlow Rewards Zone</div>
            <div style={{ fontSize: '12px', color: '#9333ea', fontWeight: 600 }}>1,250 Coins Available ➔</div>
          </div>
        </div>
      </div>
    </section>
  );
}
