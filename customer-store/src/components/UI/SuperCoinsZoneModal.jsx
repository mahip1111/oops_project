import React, { useState } from 'react';
import { X, Award, Gift, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';
import confetti from 'canvas-confetti';

export default function SuperCoinsZoneModal({ isOpen, onClose, onApplyDiscountCoupon }) {
  if (!isOpen) return null;

  const [coinsBalance, setCoinsBalance] = useState(1250);
  const [redeemedCodes, setRedeemedCodes] = useState([]);

  const rewards = [
    { id: 'rw-1', code: 'QUICKFLOW500', title: '₹500 Instant Cart Discount', coins: 250, minOrder: '₹5,000' },
    { id: 'rw-2', code: 'QUICKFLOW2K', title: '₹2,000 MacBook Voucher', coins: 600, minOrder: '₹50,000' },
    { id: 'rw-3', code: 'FREE_CARE', title: '1-Year QuickFlow Care+ Pass', coins: 1000, minOrder: 'Any Order' }
  ];

  const handleRedeem = (reward) => {
    if (coinsBalance < reward.coins) return;
    playAppleSound('add_to_bag');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setCoinsBalance(prev => prev - reward.coins);
    setRedeemedCodes(prev => [...prev, reward.id]);
    if (onApplyDiscountCoupon) {
      onApplyDiscountCoupon(reward.code);
    }
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
          maxWidth: '560px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={22} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>QuickFlow Rewards Zone</h3>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Available Coins: <strong style={{ color: '#fbbf24' }}>{coinsBalance} QF Coins</strong></div>
            </div>
          </div>
          <button
            onClick={() => { playAppleSound('click'); onClose(); }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              cursor: 'pointer',
              color: '#ffffff',
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

        {/* Rewards List */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)' }}>
            Redeem Coins for Instant Vouchers:
          </div>

          {rewards.map((rw) => {
            const isRedeemed = redeemedCodes.includes(rw.id);
            return (
              <div
                key={rw.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 18px',
                  borderRadius: '14px',
                  border: isRedeemed ? '1.5px solid #10b981' : '1px solid var(--color-border)',
                  background: isRedeemed ? 'rgba(16, 185, 129, 0.04)' : '#fbfbfd'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14.5px', color: 'var(--color-carbon)' }}>{rw.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Requires {rw.coins} Coins • Min Order {rw.minOrder}
                  </div>
                </div>

                <button
                  disabled={isRedeemed || coinsBalance < rw.coins}
                  onClick={() => handleRedeem(rw)}
                  className={isRedeemed ? 'btn-ghost' : 'btn-quickflow'}
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    color: isRedeemed ? '#10b981' : '#ffffff',
                    opacity: coinsBalance < rw.coins && !isRedeemed ? 0.5 : 1
                  }}
                >
                  {isRedeemed ? 'Unlocked ✓' : `Redeem (${rw.coins})`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
