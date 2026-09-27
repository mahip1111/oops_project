import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export const QUICKFLOW_HERO_SLIDES = [
  {
    id: 'slide-mbp',
    productId: 'lap-mbp-14',
    badge: 'Pro Performance & Liquid Retina',
    title: 'MacBook Pro 14"',
    headline: 'Mind-blowing speed. Endless battery.',
    subhead: 'Supercharged by Apple Silicon. Engineered for maximum computing efficiency.',
    priceInr: '₹1,49,900',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    theme: 'dark'
  },
  {
    id: 'slide-audio',
    productId: 'hp-01',
    badge: 'Spatial Audio & ANC Max',
    title: 'FlowSound ANC Max',
    headline: 'Computational acoustics. Symphony in every note.',
    subhead: 'Lossless Hi-Res dynamic head tracking with 42dB hybrid active noise cancellation.',
    priceInr: '₹39,900',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    theme: 'light'
  },
  {
    id: 'slide-magic',
    productId: 'ms-magic',
    badge: 'Multi-Touch & Fast USB-C',
    title: 'Magic Mouse',
    headline: 'Precision glide. Seamless fluid gestures.',
    subhead: 'Ultra-responsive glass multi-touch surface synchronized with the nearest warehouse node.',
    priceInr: '₹7,900',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80',
    theme: 'dark'
  }
];

export default function HeroBannerCarousel({ onSelectProduct, onAddToCart, products = [] }) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const totalSlides = QUICKFLOW_HERO_SLIDES.length;

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
      }, 5500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSlides]);

  const slide = QUICKFLOW_HERO_SLIDES[currentSlideIndex];
  const matchedProduct = products.find(p => p.id === slide.productId) || products[0];

  const handlePrev = () => {
    playAppleSound('pop');
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    playAppleSound('pop');
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '500px',
        backgroundColor: slide.theme === 'dark' ? '#0b0f19' : '#f8fafc',
        color: slide.theme === 'dark' ? '#ffffff' : 'var(--color-carbon)',
        transition: 'background-color 0.4s ease, color 0.4s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border)'
      }}
    >
      {/* Background Product Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          pointerEvents: 'none',
          opacity: 0.95
        }}
      >
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          fetchPriority={currentSlideIndex === 0 ? "high" : "low"}
          decoding="async"
          width="600"
          height="400"
          className="animate-fade-in hero-responsive-img"
          style={{
            height: '85%',
            maxHeight: '440px',
            width: 'auto',
            maxWidth: '55%',
            objectFit: 'contain',
            marginRight: '6%',
            borderRadius: '16px',
            boxShadow: slide.theme === 'dark' ? '0 20px 50px rgba(0,0,0,0.8)' : '0 20px 40px rgba(0,0,0,0.08)',
            transition: 'all 0.5s ease'
          }}
        />
      </div>

      {/* Slide Text Content */}
      <div
        className="store-container"
        style={{
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(28px, 6vw, 56px) clamp(16px, 4vw, 32px) 24px',
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <div style={{ maxWidth: '580px' }}>
          <span
            className="animate-fade-in"
            style={{
              backgroundColor: slide.theme === 'dark' ? 'rgba(0, 113, 227, 0.25)' : 'rgba(0, 113, 227, 0.1)',
              color: slide.theme === 'dark' ? '#38bdf8' : 'var(--color-apple-blue)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '14px',
              border: '1px solid rgba(0, 113, 227, 0.3)'
            }}
          >
            <Sparkles size={13} /> {slide.badge}
          </span>

          <h2
            key={`title-${slide.id}`}
            className="animate-fade-in"
            style={{
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              color: slide.theme === 'dark' ? '#ffffff' : 'var(--color-carbon)'
            }}
          >
            {slide.title}
          </h2>

          <div
            key={`headline-${slide.id}`}
            className="animate-fade-in"
            style={{
              fontSize: 'clamp(17px, 2.5vw, 22px)',
              fontWeight: 400,
              marginTop: '8px',
              color: slide.theme === 'dark' ? '#94a3b8' : 'var(--text-muted)'
            }}
          >
            {slide.headline}
          </div>

          <p
            key={`sub-${slide.id}`}
            className="animate-fade-in"
            style={{
              fontSize: '13.5px',
              color: slide.theme === 'dark' ? '#64748b' : 'var(--text-muted)',
              marginTop: '8px',
              lineHeight: 1.4
            }}
          >
            {slide.subhead}
          </p>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                playAppleSound('click');
                if (onSelectProduct && matchedProduct) onSelectProduct(matchedProduct);
              }}
              className="btn-quickflow"
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 700
              }}
            >
              <span>Explore & Buy ({slide.priceInr})</span>
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => {
                playAppleSound('add_to_bag');
                if (onAddToCart && matchedProduct) onAddToCart(matchedProduct);
              }}
              className={slide.theme === 'dark' ? 'btn-ghost' : 'btn-dark'}
              style={{
                padding: '12px 20px',
                fontSize: '14px',
                color: slide.theme === 'dark' ? '#ffffff' : '#ffffff',
                borderColor: slide.theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'transparent'
              }}
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      {/* Carousel Navigation, Slide Bars, & Play/Pause Controls */}
      <div
        style={{
          maxWidth: '1280px',
          width: '100%',
          margin: '0 auto',
          padding: '16px 32px 24px',
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Slide Progress Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {QUICKFLOW_HERO_SLIDES.map((s, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <button
                key={s.id}
                onClick={() => {
                  playAppleSound('pop');
                  setCurrentSlideIndex(idx);
                }}
                style={{
                  height: '4px',
                  width: isActive ? '38px' : '18px',
                  borderRadius: '9999px',
                  backgroundColor: isActive
                    ? 'var(--color-apple-blue)'
                    : (slide.theme === 'dark' ? 'rgba(255,255,255,0.2)' : '#e2e8f0'),
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>

        {/* Arrow Controls & Auto-play toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              playAppleSound('pop');
              setIsPlaying(!isPlaying);
            }}
            style={{
              background: 'transparent',
              border: `1px solid ${slide.theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'var(--color-border)'}`,
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: slide.theme === 'dark' ? '#ffffff' : 'var(--color-carbon)',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <button
            onClick={handlePrev}
            style={{
              background: 'transparent',
              border: `1px solid ${slide.theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'var(--color-border)'}`,
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: slide.theme === 'dark' ? '#ffffff' : 'var(--color-carbon)',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={handleNext}
            style={{
              background: 'transparent',
              border: `1px solid ${slide.theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'var(--color-border)'}`,
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: slide.theme === 'dark' ? '#ffffff' : 'var(--color-carbon)',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
