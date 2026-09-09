import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Server,
  Cpu,
  Smartphone,
  Zap,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderPlacedAnimationModal({
  isOpen,
  orderData,
  onProceedToTracking
}) {
  if (!isOpen || !orderData) return null;

  const [step, setStep] = useState(1); // 1: Customer App -> 2: Node API -> 3: C++ Engine -> 4: Complete

  useEffect(() => {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });

    const t1 = setTimeout(() => setStep(2), 900);
    const t2 = setTimeout(() => setStep(3), 1900);
    const t3 = setTimeout(() => setStep(4), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const orderId = orderData.id || 'QF-10482';

  return (
    <div className="drawer-overlay" style={{ alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        className="animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '36px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-modal)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Animated Checkmark */}
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '2px solid #10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px'
          }}
        >
          <CheckCircle2 size={36} color="#10b981" />
        </div>

        {/* ORDER PLACED ✓ Header */}
        <h2
          style={{
            fontSize: '26px',
            fontWeight: 800,
            color: 'var(--color-carbon)',
            letterSpacing: '-0.5px',
            marginBottom: '6px'
          }}
        >
          ORDER PLACED ✓
        </h2>

        {/* Order #QF-10482 */}
        <div
          style={{
            fontSize: '18px',
            fontWeight: 800,
            color: 'var(--color-apple-blue)',
            fontFamily: 'var(--font-mono)',
            marginBottom: '8px'
          }}
        >
          Order #{orderId}
        </div>

        {/* Processing Message */}
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px' }}>
          Processing your order through the fulfillment pipeline...
        </p>

        {/* 🌟 STEP 5 SPECIFICATION: 3-TIER DISPATCH FLOW 🌟 */}
        <div
          style={{
            background: '#fbfbfd',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* 1. Customer App */}
          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              padding: '12px 18px',
              borderRadius: '10px',
              background: step >= 1 ? '#ffffff' : '#f5f5f7',
              border: step >= 1 ? '1px solid #10b981' : '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: step >= 1 ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Smartphone size={16} color={step >= 1 ? '#10b981' : 'var(--text-muted)'} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-carbon)' }}>Customer App</span>
            </div>
            {step >= 1 ? <Check size={16} color="#10b981" /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-border)' }}></div>}
          </div>

          <ArrowDown size={16} color={step >= 2 ? '#10b981' : 'var(--color-border)'} />

          {/* 2. Node API */}
          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              padding: '12px 18px',
              borderRadius: '10px',
              background: step >= 2 ? '#ffffff' : '#f5f5f7',
              border: step >= 2 ? '1px solid #10b981' : '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: step >= 2 ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={16} color={step >= 2 ? '#10b981' : 'var(--text-muted)'} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-carbon)' }}>Node API Gateway</span>
            </div>
            {step >= 2 ? <Check size={16} color="#10b981" /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-border)' }}></div>}
          </div>

          <ArrowDown size={16} color={step >= 3 ? '#10b981' : 'var(--color-border)'} />

          {/* 3. C++ Engine */}
          <div
            style={{
              width: '100%',
              maxWidth: '340px',
              padding: '12px 18px',
              borderRadius: '10px',
              background: step >= 3 ? '#ffffff' : '#f5f5f7',
              border: step >= 3 ? '1px solid #0071e3' : '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: step >= 3 ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Cpu size={16} color={step >= 3 ? '#0071e3' : 'var(--text-muted)'} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-carbon)' }}>C++ FastRoute Engine</span>
            </div>
            {step >= 3 ? <Check size={16} color="#0071e3" /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-border)' }}></div>}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onProceedToTracking}
          className="btn-quickflow"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '9999px'
          }}
        >
          <span>Track Live Milestones</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
