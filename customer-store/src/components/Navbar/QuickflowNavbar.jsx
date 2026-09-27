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
  Heart,
  ChevronRight,
  Award,
  RotateCcw
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

  const handleNavClick = (id) => {
    playAppleSound('click');
    setCurrentView(id);
    setMobileMenuOpen(false);
    if (id === 'shop') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
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
          padding: '0 24px'
        }}
      >
        {/* Brand Title: QUICKFLOW */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
              gap: '8px'
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'var(--color-carbon)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                flexShrink: 0
              }}
            >
              <div style={{ width: '10px', height: '10px', background: '#ffffff', borderRadius: '2px', transform: 'rotate(45deg)' }}></div>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '17px',
                fontWeight: 800,
                letterSpacing: '0.8px',
                color: 'var(--color-carbon)',
                textTransform: 'uppercase'
              }}
            >
              QUICKFLOW
            </span>
          </button>

          {/* Center Desktop Navigation */}
          <nav className="desktop-nav-links" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Delivery Location Pill */}
          <button
            onClick={() => {
              playAppleSound('pop');
              if (onOpenLocationModal) onOpenLocationModal();
            }}
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 113, 227, 0.06)',
              border: '1px solid rgba(0, 113, 227, 0.15)',
              padding: '5px 10px',
              borderRadius: '9999px',
              fontSize: '12px',
              color: 'var(--color-apple-blue)',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
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
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'var(--color-carbon)',
              color: '#ffffff',
              padding: '5px 10px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              whiteSpace: 'nowrap'
            }}
            title="Open Admin Operations Command Center (Port 3001)"
          >
            <Zap size={12} color="#38bdf8" />
            <span>Admin ↗</span>
          </a>

          {/* Search Bar with Dropdown Suggestions */}
          <div className="nav-search-container" style={{ position: 'relative' }}>
            <div
              className="nav-search-wrapper"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                border: searchFocused ? '1.5px solid var(--color-apple-blue)' : '1px solid var(--color-border)',
                borderRadius: '9999px',
                padding: '5px 10px',
                gap: '6px',
                boxShadow: searchFocused ? '0 0 0 3px rgba(37, 99, 235, 0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease'
              }}
            >
              <Search size={13} color="var(--text-faint)" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-carbon)',
                  fontSize: '12.5px',
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
                  top: '40px',
                  right: 0,
                  width: '260px',
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
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
                      gap: '8px',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <img src={p.image} alt={p.name} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-carbon)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              flexShrink: 0
            }}
            title="Saved Wishlist"
          >
            <Heart size={15} color={wishlistCount > 0 ? '#e11d48' : 'var(--color-carbon)'} fill={wishlistCount > 0 ? '#e11d48' : 'none'} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: '#e11d48',
                  color: '#ffffff',
                  fontSize: '9.5px',
                  fontWeight: 800,
                  width: '15px',
                  height: '15px',
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
              padding: '6px 14px',
              fontSize: '12.5px',
              fontWeight: 600,
              borderRadius: '9999px',
              position: 'relative',
              flexShrink: 0
            }}
          >
            <ShoppingBag size={14} />
            <span className="hide-on-mobile">Bag</span>
            {cartCount > 0 && (
              <span
                style={{
                  background: '#ffffff',
                  color: 'var(--color-apple-blue)',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: '2px'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => {
              playAppleSound('pop');
              setMobileMenuOpen(prev => !prev);
            }}
            className="mobile-menu-btn"
            style={{
              background: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Open Mobile Navigation"
            aria-label="Open mobile menu"
          >
            <Menu size={18} color="var(--color-carbon)" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Backdrop Overlay */}
      <div
        className={`mobile-nav-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Slide-out Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Drawer Header */}
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'var(--color-carbon)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ width: '8px', height: '8px', background: '#ffffff', borderRadius: '2px', transform: 'rotate(45deg)' }}></div>
            </div>
            <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-carbon)', letterSpacing: '0.5px' }}>
              QUICKFLOW
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--color-carbon)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Links List */}
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Mobile Drawer Search Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f8fafc',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              padding: '8px 12px',
              gap: '8px',
              marginBottom: '8px'
            }}
          >
            <Search size={14} color="var(--text-faint)" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <X size={13} />
              </button>
            )}
          </div>
          {navLinks.map((link) => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                  color: isActive ? 'var(--color-apple-blue)' : 'var(--color-carbon)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '14.5px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span>{link.label}</span>
                <ChevronRight size={16} color={isActive ? 'var(--color-apple-blue)' : 'var(--text-faint)'} />
              </button>
            );
          })}

          <div style={{ margin: '12px 0', height: '1px', background: 'var(--color-border)' }} />

          {/* Location Action */}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenLocationModal) onOpenLocationModal();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '12px',
              border: '1px solid rgba(0, 113, 227, 0.15)',
              background: 'rgba(0, 113, 227, 0.04)',
              color: 'var(--color-apple-blue)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <MapPin size={16} />
            <span>Deliver to: <strong>{deliveryCity}</strong></span>
          </button>

          {/* Admin Command Center Link */}
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'var(--color-carbon)',
              color: '#ffffff',
              fontSize: '13.5px',
              fontWeight: 700,
              textDecoration: 'none',
              marginTop: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="#38bdf8" />
              <span>Admin Operations</span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Port 3001 ↗</span>
          </a>
        </div>
      </div>
    </>
  );
}
