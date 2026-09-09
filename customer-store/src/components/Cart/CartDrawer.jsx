import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Zap, Tag, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAppleSound } from '../../utils/audio';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Calculate INR values
  const getInrPrice = (item) => {
    if (item.name.toLowerCase().includes('macbook')) return 149900;
    if (item.name.toLowerCase().includes('magic mouse')) return 7900;
    if (item.priceInrRaw) return item.priceInrRaw;
    return item.price * 100;
  };

  const subtotalInr = cart.reduce((acc, item) => acc + getInrPrice(item) * item.quantity, 0);

  // Discount logic
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.code === 'APPLE10') {
      discountAmount = Math.round(subtotalInr * 0.10);
    } else if (appliedCoupon.code === 'QUICKFLOW5K') {
      discountAmount = Math.min(5000, subtotalInr);
    }
  }

  const deliveryCharge = cart.length > 0 ? (subtotalInr > 200000 ? 0 : 499) : 0;
  const totalInr = Math.max(0, subtotalInr - discountAmount + deliveryCharge);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (cleanCode === 'APPLE10') {
      playAppleSound('pop');
      setAppliedCoupon({ code: 'APPLE10', label: '10% Instant Festive Discount' });
      setCouponError('');
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
    } else if (cleanCode === 'QUICKFLOW5K') {
      playAppleSound('pop');
      setAppliedCoupon({ code: 'QUICKFLOW5K', label: '₹5,000 QuickFlow Launch Voucher' });
      setCouponError('');
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
    } else {
      setCouponError('Invalid coupon. Try APPLE10 or QUICKFLOW5K');
    }
  };

  const handleCheckout = () => {
    playAppleSound('click');
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    onCheckout({ discountAmount, appliedCoupon });
  };

  return (
    <div className="drawer-overlay" onClick={() => { playAppleSound('click'); onClose(); }}>
      <div
        className="drawer-content animate-slide-left"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderLeft: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '480px',
          height: '100vh',
          position: 'relative'
        }}
      >
        {/* Header: Your cart */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="var(--color-carbon)" />
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-carbon)' }}>
              Your cart
            </h2>
            <span style={{ fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: 'rgba(0, 113, 227, 0.08)', color: 'var(--color-apple-blue)' }}>
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={() => { playAppleSound('click'); onClose(); }}
            style={{
              background: 'rgba(0, 0, 0, 0.05)',
              border: 'none',
              color: 'var(--color-carbon)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Express Shipping Milestone */}
        <div style={{ padding: '12px 28px', background: 'rgba(0, 113, 227, 0.04)', borderBottom: '1px solid rgba(0, 113, 227, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '4px' }}>
            <span>{subtotalInr >= 200000 ? '🎉 Free Express Air Shipping Unlocked!' : `Add ₹${(200000 - subtotalInr).toLocaleString('en-IN')} for Free Express Shipping`}</span>
            <span style={{ color: 'var(--color-apple-blue)' }}>{Math.min(100, Math.round((subtotalInr / 200000) * 100))}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, (subtotalInr / 200000) * 100)}%`, height: '100%', background: 'var(--color-apple-blue)' }}></div>
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} color="var(--text-faint)" style={{ margin: '0 auto 16px' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-carbon)', marginBottom: '6px' }}>Your bag is empty</p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Explore our engineered products catalog</p>
            </div>
          ) : (
            cart.map((item) => {
              const itemInr = getInrPrice(item);

              return (
                <div
                  key={item.cartKey || item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--color-border-subtle)'
                  }}
                >
                  {/* Left: Product Info & Quantity */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {item.image && (
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          background: '#fbfbfd',
                          border: '1px solid var(--color-border-subtle)',
                          flexShrink: 0
                        }}
                      >
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--color-carbon)' }}>{item.name}</div>
                      {item.selectedColor && (
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Finish: {item.selectedColor.name}
                        </div>
                      )}

                      {/* Quantity Controls with Audio */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <button
                          onClick={() => {
                            playAppleSound('pop');
                            onUpdateQuantity(item.cartKey, item.quantity - 1);
                          }}
                          style={{
                            background: '#f5f5f7',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-carbon)',
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)', minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            playAppleSound('pop');
                            onUpdateQuantity(item.cartKey, item.quantity + 1);
                          }}
                          style={{
                            background: '#f5f5f7',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-carbon)',
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Delete */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-carbon)' }}>
                      ₹{(itemInr * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => {
                        playAppleSound('pop');
                        onRemoveItem(item.cartKey);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-faint)',
                        cursor: 'pointer',
                        padding: '6px',
                        marginTop: '6px'
                      }}
                      title="Remove Item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Promo / Coupon Code Box */}
          {cart.length > 0 && (
            <div style={{ marginTop: '8px', padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--color-carbon)', marginBottom: '8px' }}>
                <Tag size={14} color="var(--color-apple-blue)" />
                <span>Have a Promo Coupon?</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. APPLE10 or QUICKFLOW5K"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleApplyCoupon}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'var(--color-carbon)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} strokeWidth={3} />
                  <span>{appliedCoupon.label} applied!</span>
                </div>
              )}
              {couponError && (
                <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px' }}>
                  {couponError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div
            style={{
              padding: '20px 28px',
              borderTop: '1px solid var(--color-border)',
              background: '#fbfbfd'
            }}
          >
            {/* Breakdown Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span style={{ color: 'var(--color-carbon)', fontWeight: 600 }}>₹{subtotalInr.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#059669' }}>
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span style={{ fontWeight: 700 }}>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-muted)' }}>
                <span>Delivery</span>
                <span style={{ color: deliveryCharge === 0 ? '#059669' : 'var(--color-carbon)', fontWeight: 600 }}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: 'var(--color-carbon)',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--color-border)'
                }}
              >
                <span>Total</span>
                <span>₹{totalInr.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Proceed to Checkout Button */}
            <button
              onClick={handleCheckout}
              className="btn-quickflow"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '15px',
                fontWeight: 600
              }}
            >
              <span>Proceed to checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
