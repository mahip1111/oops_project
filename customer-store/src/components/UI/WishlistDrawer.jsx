import React from 'react';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist = [],
  onRemoveFromWishlist,
  onMoveToCart
}) {
  if (!isOpen) return null;

  const getInr = (p) => {
    if (p.name.toLowerCase().includes('macbook')) return 149900;
    if (p.name.toLowerCase().includes('magic mouse')) return 7900;
    if (p.priceInrRaw) return p.priceInrRaw;
    return (p.price || 999) * 100;
  };

  return (
    <div
      className="drawer-overlay"
      onClick={() => { playAppleSound('click'); onClose(); }}
      style={{ display: 'flex', justifyContent: 'flex-end' }}
    >
      <div
        className="drawer-content animate-slide-left"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          background: '#ffffff',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderLeft: '1px solid var(--color-border)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#ffffff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} fill="#e11d48" stroke="#e11d48" />
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-carbon)' }}>
              Saved Wishlist ({wishlist.length})
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

        {/* Wishlist Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {wishlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(225, 29, 72, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  color: '#e11d48'
                }}
              >
                <Heart size={26} />
              </div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-carbon)' }}>
                Your Wishlist is Empty
              </h4>
              <p style={{ fontSize: '13px', marginTop: '6px', color: 'var(--text-muted)' }}>
                Save your favorite MacBook, headphones, or accessories to track prices and availability.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {wishlist.map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      background: '#fbfbfd',
                      border: '1px solid var(--color-border)'
                    }}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-carbon)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {prod.name}
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      ★ {prod.rating || 4.9} • In Stock
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-carbon)', marginTop: '4px' }}>
                      ₹{getInr(prod).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <button
                      onClick={() => {
                        playAppleSound('add_to_bag');
                        onMoveToCart(prod);
                      }}
                      className="btn-quickflow"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Move to Bag
                    </button>
                    <button
                      onClick={() => {
                        playAppleSound('pop');
                        onRemoveFromWishlist(prod.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
