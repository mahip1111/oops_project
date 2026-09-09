import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User,
  Package,
  Compass,
  Menu,
  X,
  Zap,
  ArrowRight,
  MapPin,
  Heart
} from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export default function QuickflowNavbar({
  currentView,
  setCurrentView,
  cartCount,
  onOpenCart,
  wishlistCount = 0,
  onOpenWishlist,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  products = [],
  deliveryCity = 'Bhubaneswar',
  onOpenLocationModal
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const navLinks = [
    { id: 'shop', label: 'Store' },
    { id: 'collections', label: 'Mac & Audio' },
    { id: 'track', label: 'Track Order' },
    { id: 'account', label: 'Account' }
  ];

  // Search auto suggestions
  const suggestions = searchQuery.trim().length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 4)
    : [];

  return (
    <header
      className="glass-nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px'
      }}
    >
      {/* Brand Title: QUICKFLOW */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <button
          onClick={() => {
            playAppleSound('click');
            setCurrentView('shop');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'var(--color-carbon)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
            }}
          >
            <div style={{ width: '12px', height: '12px', background: '#ffffff', borderRadius: '3px', transform: 'rotate(45deg)' }}></div>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.8px',
              color: 'var(--color-carbon)',
              textTransform: 'uppercase'
            }}
          >
            QUICKFLOW
          </span>
        </button>

        {/* Center Desktop Navigation: Store | Mac & Audio | Track Order | Account */}
        <nav style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  playAppleSound('click');
                  setCurrentView(link.id);
                  if (link.id === 'shop') window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isActive ? 'var(--color-apple-blue)' : 'var(--text-muted)',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  position: 'relative',
                  padding: '6px 0',
                  transition: 'color 0.2s ease'
                }}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--color-apple-blue)',
                      borderRadius: '9999px'
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls: Location Pill, Search, Wishlist & Bag Drawer Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Delivery Location Pill with Click Action */}
        <button
          onClick={() => {
            playAppleSound('pop');
            if (onOpenLocationModal) onOpenLocationModal();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 113, 227, 0.06)',
            border: '1px solid rgba(0, 113, 227, 0.15)',
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            color: 'var(--color-apple-blue)',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          title="Change Delivery PIN / City"
        >
          <MapPin size={12} color="var(--color-apple-blue)" />
          <span>Deliver to: <strong>{deliveryCity}</strong></span>
        </button>

        {/* Admin Dashboard Switcher Pill */}
        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--color-carbon)',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            transition: 'transform 0.15s ease'
          }}
          title="Open Admin Operations Command Center (Port 3001)"
        >
          <Zap size={13} color="#38bdf8" />
          <span>Admin Portal ↗</span>
        </a>

        {/* Search Bar with Dropdown Suggestions */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: '9999px',
              padding: '6px 14px',
              gap: '8px',
              width: searchFocused ? '240px' : '150px',
              transition: 'width 0.25s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}
          >
            <Search size={14} color="var(--text-faint)" />
            <input
              type="text"
              placeholder="Search Apple..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-carbon)',
                fontSize: '13px',
                outline: 'none',
                width: '100%'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Instant Search Suggestions Box */}
          {searchFocused && suggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                width: '280px',
                background: '#ffffff',
                borderRadius: '14px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                zIndex: 1000
              }}
            >
              {suggestions.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    playAppleSound('pop');
                    if (onSelectProduct) onSelectProduct(p);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <img src={p.image} alt={p.name} style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--color-carbon)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-apple-blue)', fontWeight: 600 }}>
                      {p.priceInr || `₹${((p.price || 999) * 100).toLocaleString('en-IN')}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => {
            playAppleSound('click');
            if (onOpenWishlist) onOpenWishlist();
          }}
          style={{
            background: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative'
          }}
          title="Saved Wishlist"
        >
          <Heart size={16} color={wishlistCount > 0 ? '#e11d48' : 'var(--color-carbon)'} fill={wishlistCount > 0 ? '#e11d48' : 'none'} />
          {wishlistCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#e11d48',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Bag Drawer Button with Audio Feedback */}
        <button
          onClick={() => {
            playAppleSound('click');
            onOpenCart();
          }}
          className="btn-quickflow"
          style={{
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '9999px',
            position: 'relative'
          }}
        >
          <ShoppingBag size={15} />
          <span>Bag</span>
          {cartCount > 0 && (
            <span
              style={{
                background: '#ffffff',
                color: 'var(--color-apple-blue)',
                fontSize: '11px',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '4px'
              }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
