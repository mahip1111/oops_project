import React, { useState, useEffect } from 'react';
import { Zap, Clock, Flame, ChevronRight, CheckCircle2 } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export const FLASH_DEALS_INR = [
  {
    id: 'deal-1',
    productId: 'lap-mbp-14',
    title: 'MacBook Pro 14" (M3 Pro, 18GB/512GB)',
    dealPriceInr: 139900,
    originalPriceInr: 149900,
    discountPercent: 7,
    stockTotal: 40,
    stockClaimed: 32,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'deal-2',
    productId: 'ms-magic',
    title: 'Magic Mouse (Multi-Touch USB-C)',
    dealPriceInr: 6990,
    originalPriceInr: 7900,
    discountPercent: 12,
    stockTotal: 100,
    stockClaimed: 84,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'deal-3',
    productId: 'hp-01',
    title: 'FlowSound ANC Max Wireless Headset',
    dealPriceInr: 34900,
    originalPriceInr: 39900,
    discountPercent: 13,
    stockTotal: 50,
    stockClaimed: 41,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'deal-4',
    productId: 'kb-01',
    title: 'FlowKey 75% CNC Custom Mechanical',
    dealPriceInr: 16900,
    originalPriceInr: 18900,
    discountPercent: 11,
    stockTotal: 30,
    stockClaimed: 24,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
  }
];

export default function FlashDealsCarousel({ onAddToCart, onSelectProduct, products = [] }) {
  const [timeLeft, setTimeLeft] = useState(3 * 3600 + 42 * 60 + 19);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        padding: '36px 0 44px'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <span
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: '#d97706',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Flame size={14} fill="#d97706" /> QuickFlow Express Flash Deals
          </span>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-carbon)' }}>
            Today's Limited Fast-Track Deals
          </h2>
        </div>

        {/* Live Ticking Countdown Clock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#f8fafc',
            padding: '6px 14px',
            borderRadius: '9999px',
            border: '1px solid var(--color-border)',
            fontSize: '13px'
          }}
        >
          <Clock size={15} color="var(--color-apple-blue)" />
          <span style={{ color: 'var(--text-muted)' }}>Ends in:</span>
          <span style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '14px', color: 'var(--color-carbon)' }}>
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Snap Scroll Grid of Flash Deals */}
      <div
        style={{
          display: 'flex',
          gap: '18px',
          overflowX: 'auto',
          padding: '8px 32px 16px',
          maxWidth: '1280px',
          margin: '0 auto',
          scrollbarWidth: 'none'
        }}
      >
        {FLASH_DEALS_INR.map((deal) => {
          const matchedProduct = products.find(p => p.id === deal.productId) || products[0];
          const percentClaimed = Math.round((deal.stockClaimed / deal.stockTotal) * 100);

          return (
            <div
              key={deal.id}
              style={{
                flex: '0 0 290px',
                backgroundColor: '#fbfbfd',
                borderRadius: '16px',
                border: '1px solid var(--color-border)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.18s ease',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div>
                <div style={{ position: 'relative', width: '100%', height: '150px', marginBottom: '12px' }}>
                  <img
                    src={deal.image}
                    alt={deal.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      backgroundColor: '#ffffff'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    Save {deal.discountPercent}%
                  </span>
                </div>

                <h3 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-carbon)', lineHeight: '1.3' }}>
                  {deal.title}
                </h3>

                {/* Price Display */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#dc2626' }}>
                    ₹{deal.dealPriceInr.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{deal.originalPriceInr.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Claimed Stock Bar */}
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>{percentClaimed}% claimed</span>
                    <span style={{ color: '#d97706', fontWeight: 600 }}>Only {deal.stockTotal - deal.stockClaimed} left</span>
                  </div>
                  <div style={{ width: '100%', height: '5px', backgroundColor: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentClaimed}%`,
                        height: '100%',
                        backgroundColor: '#dc2626',
                        borderRadius: '9999px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  className="btn-quickflow"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '12px' }}
                  onClick={() => {
                    playAppleSound('add_to_bag');
                    onAddToCart({ ...matchedProduct, priceInrRaw: deal.dealPriceInr, priceInr: `₹${deal.dealPriceInr.toLocaleString('en-IN')}` });
                  }}
                >
                  Claim Deal
                </button>
                <button
                  className="btn-ghost"
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                  onClick={() => {
                    playAppleSound('click');
                    onSelectProduct(matchedProduct);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
