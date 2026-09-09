import React, { useState } from 'react';
import { ShoppingBag, Star, Plus, Check, Eye, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '../../data/quickflowProducts';
import { playAppleSound } from '../../utils/audio';

export default function ProductGrid({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  onSelectProduct,
  onAddToCart
}) {
  const [addedMap, setAddedMap] = useState({});
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price_asc' | 'price_desc' | 'rating'

  const handleAdd = (e, prod) => {
    e.stopPropagation();
    playAppleSound('add_to_bag');
    onAddToCart(prod);
    setAddedMap((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [prod.id]: false }));
    }, 1200);
  };

  const getRawInr = (p) => {
    if (p.name.toLowerCase().includes('macbook')) return 149900;
    if (p.name.toLowerCase().includes('magic mouse')) return 7900;
    if (p.priceInrRaw) return p.priceInrRaw;
    return (p.price || 999) * 100;
  };

  // Filter & Sort logic
  let filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  if (sortBy === 'price_asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => getRawInr(a) - getRawInr(b));
  } else if (sortBy === 'price_desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => getRawInr(b) - getRawInr(a));
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
  }

  return (
    <section id="categories" style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 32px 80px' }}>
      {/* Category Pills Bar & Sort Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'none'
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playAppleSound('pop');
                  setSelectedCategory(cat.id);
                }}
                style={{
                  background: isActive ? 'var(--color-carbon)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--color-carbon)',
                  border: isActive ? '1px solid var(--color-carbon)' : '1px solid var(--color-border)',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.02)'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort Filter Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={14} color="var(--text-muted)" />
          <select
            value={sortBy}
            onChange={(e) => {
              playAppleSound('pop');
              setSortBy(e.target.value);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid var(--color-border)',
              background: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-carbon)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="featured">Featured Collection</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated ★</option>
          </select>
        </div>
      </div>

      {/* Grid of Products */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '16px' }}>No products found matching "{searchQuery}".</p>
          <button
            onClick={() => { setSelectedCategory('all'); }}
            className="btn-ghost"
            style={{ marginTop: '16px' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}
        >
          {filteredProducts.map((prod) => {
            const isAdded = !!addedMap[prod.id];
            const displayInr = prod.priceInr || `₹${getRawInr(prod).toLocaleString('en-IN')}`;

            return (
              <div
                key={prod.id}
                className="product-card"
                onClick={() => {
                  playAppleSound('click');
                  onSelectProduct(prod);
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Product Image Container */}
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16/11',
                    background: '#fbfbfd',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />

                  {/* Badge */}
                  {prod.badge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(255, 255, 255, 0.94)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        color: 'var(--color-carbon)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                      }}
                    >
                      {prod.badge}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 600 }}>
                        {prod.categoryLabel || 'Product'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', color: 'var(--color-carbon)', fontWeight: 600 }}>
                        <Star size={12} fill="#f59e0b" color="#f59e0b" />
                        <span>{prod.rating || 4.9}</span>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-carbon)', lineHeight: '1.3', marginBottom: '6px' }}>
                      {prod.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '14px' }}>
                      {prod.tagline}
                    </p>

                    {/* Color Swatches */}
                    {prod.colors && prod.colors.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                        {prod.colors.map((c, i) => (
                          <div
                            key={i}
                            style={{
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              background: c.hex,
                              border: '1px solid rgba(0, 0, 0, 0.15)'
                            }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '14px',
                      borderTop: '1px solid var(--color-border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-carbon)', fontFamily: 'var(--font-sans)' }}>
                        {displayInr}
                      </div>
                      <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                        ● Ships in 1–2 days
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAdd(e, prod)}
                      className="btn-quickflow"
                      style={{
                        padding: '8px 16px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: isAdded ? '#059669' : 'var(--color-apple-blue)'
                      }}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
