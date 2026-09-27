import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, Quote } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export const CUSTOMER_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Priya Mukherjee',
    location: 'Bhubaneswar, Odisha',
    product: 'MacBook Pro 14" M3 Pro',
    rating: 5,
    date: '2 days ago',
    title: 'Delivered to Infocity in under 18 minutes!',
    content: 'The live tracking and warehouse picking visualization is unbelievable. I saw the item located in Mumbai and assigned to express courier instantly.'
  },
  {
    id: 'rev-2',
    author: 'Vikramaditya Sengupta',
    location: 'Kolkata, West Bengal',
    product: 'FlowSound ANC Max Headset',
    rating: 5,
    date: 'Yesterday',
    title: 'Audiophile grade sound & seamless trade-in',
    content: 'Exchanged my older headphones for instant ₹14,000 credit. Packaging arrived with anti-shock seal and zero scratches.'
  },
  {
    id: 'rev-3',
    author: 'Ananya Deshmukh',
    location: 'Mumbai, Maharashtra',
    product: 'Magic Mouse (USB-C) & Braided Cable',
    rating: 5,
    date: '3 days ago',
    title: 'Super fast same-day delivery',
    content: 'Ordered at 11 AM, received at BKC office by 2 PM. Priority 9 delivery is genuinely lightning fast.'
  }
];

export default function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    playAppleSound('pop');
    setCurrentIndex((prev) => (prev - 1 + CUSTOMER_REVIEWS.length) % CUSTOMER_REVIEWS.length);
  };

  const handleNext = () => {
    playAppleSound('pop');
    setCurrentIndex((prev) => (prev + 1) % CUSTOMER_REVIEWS.length);
  };

  const current = CUSTOMER_REVIEWS[currentIndex];

  return (
    <section className="store-container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px' }}>
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          border: '1px solid var(--color-border)',
          padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 36px)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-apple-blue)', textTransform: 'uppercase' }}>
              Verified Owner Feedback
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-carbon)', marginTop: '4px' }}>
              What Our Customers Say Across India
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrev}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="animate-fade-in" key={current.id}>
          <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>

          <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-carbon)', marginBottom: '8px' }}>
            "{current.title}"
          </h4>

          <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px', maxWidth: '780px' }}>
            {current.content}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
              {current.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-carbon)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{current.author}</span>
                <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <CheckCircle2 size={12} /> Verified Buyer
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {current.location} • {current.product} • {current.date}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
