import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Truck, Sparkles } from 'lucide-react';

export default function QuickflowHero({ onShopClick }) {
  return (
    <section
      style={{
        position: 'relative',
        padding: '80px 32px 64px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Network Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 113, 227, 0.08)',
          border: '1px solid rgba(0, 113, 227, 0.18)',
          borderRadius: '9999px',
          padding: '6px 18px',
          fontSize: '13px',
          color: 'var(--color-apple-blue)',
          marginBottom: '24px',
          fontWeight: 600
        }}
      >
        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-apple-blue)' }} className="pulse-beacon" />
        <span>QuickFlow HyperFast 2026</span>
        <span style={{ opacity: 0.5 }}>•</span>
        <span>Sub-40s Dispatch SLA</span>
      </div>

      {/* Main Hero Title */}
      <h1
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(36px, 5.5vw, 64px)',
          fontWeight: 800,
          letterSpacing: '-1.5px',
          lineHeight: '1.08',
          color: 'var(--color-carbon)',
          maxWidth: '850px',
          marginBottom: '18px'
        }}
      >
        Engineered for everyday life.
      </h1>

      {/* Hero Subtitle */}
      <p
        style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: 'var(--text-muted)',
          maxWidth: '620px',
          lineHeight: '1.5',
          marginBottom: '36px',
          fontWeight: 400
        }}
      >
        Explore products designed to move through a smarter fulfillment network.
      </p>

      {/* CTA Button: [Shop products] */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onShopClick}
          className="btn-quickflow"
          style={{ padding: '14px 34px', fontSize: '15px' }}
        >
          <span>Shop products</span>
          <ArrowRight size={16} />
        </button>

        <a
          href="#categories"
          className="btn-ghost"
          style={{ padding: '14px 28px', fontSize: '15px', textDecoration: 'none' }}
        >
          <span>View Collections</span>
        </a>
      </div>

      {/* Value Pillars Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          width: '100%',
          marginTop: '60px',
          paddingTop: '32px',
          borderTop: '1px solid var(--color-border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0, 113, 227, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="var(--color-apple-blue)" />
          </div>
          <div style={{ textAlign: 'left', fontSize: '13px' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-carbon)' }}>38s Instant Processing</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Autonomous picking queue</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Truck size={18} color="#10b981" />
          </div>
          <div style={{ textAlign: 'left', fontSize: '13px' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-carbon)' }}>4 Regional SuperHubs</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Delhi, Mumbai, HYD, Kolkata</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(0, 0, 0, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={18} color="var(--color-carbon)" />
          </div>
          <div style={{ textAlign: 'left', fontSize: '13px' }}>
            <div style={{ fontWeight: 600, color: 'var(--color-carbon)' }}>2-Year Comprehensive Warranty</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>100% Genuine hardware</div>
          </div>
        </div>
      </div>
    </section>
  );
}
