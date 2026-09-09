import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Zap,
  ArrowRight,
  Check,
  Radio,
  MapPin,
  Clock,
  Sparkles,
  CreditCard,
  Layers,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAppleSound } from '../../utils/audio';

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow
}) {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || { name: 'Space Black', hex: '#1e1e24' });
  const [selectedStorage, setSelectedStorage] = useState('512GB');
  const [hasAppleCare, setHasAppleCare] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Storage options with incremental price adjustments
  const storageOptions = [
    { label: '512GB', addPrice: 0 },
    { label: '1TB', addPrice: 20000 },
    { label: '2TB', addPrice: 60000 }
  ];

  // Base calculation in INR
  const getBasePrice = () => {
    if (product.name.toLowerCase().includes('macbook')) return 149900;
    if (product.name.toLowerCase().includes('magic mouse')) return 7900;
    if (product.priceInrRaw) return product.priceInrRaw;
    return (product.price || 999) * 100;
  };

  const currentStorageOption = storageOptions.find((s) => s.label === selectedStorage) || storageOptions[0];
  const appleCarePrice = product.name.toLowerCase().includes('macbook') ? 14900 : 2490;
  const unitPrice = getBasePrice() + currentStorageOption.addPrice + (hasAppleCare ? appleCarePrice : 0);
  const totalPrice = unitPrice * quantity;
  const emiPerMonth = Math.round(unitPrice / 24);

  const defaultNodes = [
    { node: 'Mumbai', status: 'In stock', color: '#10b981', isStock: true },
    { node: 'Delhi', status: 'In stock', color: '#10b981', isStock: true },
    { node: 'Kolkata', status: 'Limited', color: '#f59e0b', isStock: true },
    { node: 'Hyderabad', status: 'Out of stock', color: '#86868b', isStock: false }
  ];

  const fulfillmentNodes = product.fulfillmentAvailability || defaultNodes;

  const handleAdd = () => {
    playAppleSound('add_to_bag');
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    onAddToCart(
      {
        ...product,
        name: `${product.name} (${selectedStorage}${hasAppleCare ? ' + AppleCare+' : ''})`,
        priceInrRaw: unitPrice,
        priceInr: `₹${unitPrice.toLocaleString('en-IN')}`,
        storage: selectedStorage,
        appleCare: hasAppleCare
      },
      selectedColor,
      quantity
    );
  };

  const handleBuy = () => {
    playAppleSound('click');
    onBuyNow(
      {
        ...product,
        name: `${product.name} (${selectedStorage}${hasAppleCare ? ' + AppleCare+' : ''})`,
        priceInrRaw: unitPrice,
        priceInr: `₹${unitPrice.toLocaleString('en-IN')}`,
        storage: selectedStorage,
        appleCare: hasAppleCare
      },
      selectedColor,
      quantity
    );
  };

  return (
    <div className="drawer-overlay" onClick={() => { playAppleSound('click'); onClose(); }} style={{ alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '860px',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '36px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-modal)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => { playAppleSound('click'); onClose(); }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            color: 'var(--color-carbon)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px' }}>
          {/* Left Column: Image & Highlights */}
          <div>
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#fbfbfd',
                aspectRatio: '1/1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                border: '1px solid var(--color-border-subtle)'
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* No Cost EMI Card */}
            <div
              style={{
                background: 'rgba(0, 113, 227, 0.04)',
                border: '1px solid rgba(0, 113, 227, 0.2)',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={16} color="var(--color-apple-blue)" />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-carbon)' }}>
                  No Cost EMI from <strong>₹{emiPerMonth.toLocaleString('en-IN')}/mo</strong>
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-apple-blue)', fontWeight: 700 }}>24 Months</span>
            </div>

            {/* Quick Specs Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                background: '#f5f5f7',
                padding: '14px',
                borderRadius: '12px'
              }}
            >
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Warranty:</span>{' '}
                <strong style={{ color: 'var(--color-carbon)' }}>2 Years Official</strong>
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Dispatch SLA:</span>{' '}
                <strong style={{ color: '#059669' }}>38s Wave</strong>
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Return Window:</span>{' '}
                <strong style={{ color: 'var(--color-carbon)' }}>14 Days No-Risk</strong>
              </div>
              <div style={{ fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Packaging:</span>{' '}
                <strong style={{ color: 'var(--color-carbon)' }}>Anti-Shock Seal</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, Customizations, Fulfillment Node Availability, Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--color-apple-blue)',
                    background: 'rgba(0, 113, 227, 0.08)',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {product.categoryLabel || 'Premium Tech'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-carbon)', fontWeight: 600 }}>
                  <Star size={13} fill="#f59e0b" color="#f59e0b" />
                  <span>{product.rating || 4.9}</span>
                  <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount || 480})</span>
                </div>
              </div>

              <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-carbon)', lineHeight: '1.2', marginBottom: '8px' }}>
                {product.name}
              </h1>

              {/* Price & Shipping Info */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-carbon)', fontFamily: 'var(--font-sans)' }}>
                  ₹{unitPrice.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '13px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>Available • Ships in 1–2 days</span>
                </div>
              </div>

              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '18px' }}>
                {product.tagline || 'Engineered with maximum efficiency to integrate directly with QuickFlow smart distribution.'}
              </p>

              {/* 🎨 Color Selector with Audio */}
              {product.colors && product.colors.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-carbon)', marginBottom: '8px' }}>
                    FINISH — <span style={{ color: 'var(--text-muted)' }}>{selectedColor.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {product.colors.map((col, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          playAppleSound('pop');
                          setSelectedColor(col);
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: col.hex,
                          border: selectedColor.name === col.name ? '2px solid var(--color-apple-blue)' : '1px solid var(--color-border)',
                          padding: '2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: selectedColor.name === col.name ? '0 0 0 2px rgba(0, 113, 227, 0.25)' : 'none'
                        }}
                      >
                        {selectedColor.name === col.name && (
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.hex === '#ffffff' ? '#000000' : '#ffffff' }}></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 💾 Storage / Spec Variant Selector */}
              {product.category === 'laptops' && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-carbon)', marginBottom: '8px' }}>
                    STORAGE CAPACITY
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {storageOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          playAppleSound('pop');
                          setSelectedStorage(opt.label);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          borderRadius: '10px',
                          border: selectedStorage === opt.label ? '2px solid var(--color-apple-blue)' : '1px solid var(--color-border)',
                          background: selectedStorage === opt.label ? 'rgba(0, 113, 227, 0.05)' : '#ffffff',
                          color: selectedStorage === opt.label ? 'var(--color-apple-blue)' : 'var(--color-carbon)',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <div>{opt.label}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {opt.addPrice === 0 ? 'Included' : `+₹${opt.addPrice.toLocaleString('en-IN')}`}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 🛡️ AppleCare+ / Extended Protection Add-on */}
              <label
                onClick={() => {
                  playAppleSound('toggle');
                  setHasAppleCare(!hasAppleCare);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: hasAppleCare ? '2px solid #059669' : '1px solid var(--color-border)',
                  background: hasAppleCare ? 'rgba(16, 185, 129, 0.05)' : '#ffffff',
                  marginBottom: '18px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: hasAppleCare ? 'none' : '1.5px solid var(--color-border)',
                      background: hasAppleCare ? '#059669' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}
                  >
                    {hasAppleCare && <Check size={12} strokeWidth={3} />}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)' }}>
                      QuickFlow Care+ (2 Years)
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Unlimited accidental damage repairs with priority courier replacement
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669' }}>
                  +₹{appleCarePrice.toLocaleString('en-IN')}
                </div>
              </label>

              {/* 🌟 STEP 2 SPECIFICATION: FULFILLMENT AVAILABILITY WIDGET 🌟 */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--color-border)',
                  borderRadius: '14px',
                  padding: '16px 18px',
                  marginBottom: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="var(--color-apple-blue)" />
                    <span>Fulfillment availability</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Available from</span>
                </div>

                {/* Node Status Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {fulfillmentNodes.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: '#ffffff',
                        border: '1px solid rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-carbon)' }}>{item.node}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: item.color, fontWeight: 600 }}>
                        <span style={{ fontSize: '10px' }}>{item.isStock ? '●' : '—'}</span>
                        <span>{item.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtle Customer Network Note */}
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Zap size={12} color="var(--color-apple-blue)" />
                  <span>Fulfilled by the nearest available network node.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleAdd}
                className="btn-quickflow"
                style={{ flex: 1, padding: '14px', fontSize: '14px', fontWeight: 600 }}
              >
                <ShoppingBag size={16} />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuy}
                className="btn-dark"
                style={{ flex: 1, padding: '14px', fontSize: '14px', fontWeight: 600 }}
              >
                <span>Fast Buy Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
