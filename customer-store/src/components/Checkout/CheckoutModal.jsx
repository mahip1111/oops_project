import React, { useState } from 'react';
import {
  X,
  MapPin,
  Truck,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  ArrowRight,
  QrCode,
  Building,
  Banknote,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playAppleSound } from '../../utils/audio';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onCompleteOrder,
  discountInfo = { discountAmount: 0, appliedCoupon: null }
}) {
  if (!isOpen) return null;

  // Delivery Address (Default: Bhubaneswar, Odisha)
  const [address, setAddress] = useState({
    name: 'Aarav Sharma',
    phone: '+91 98765 43210',
    street: 'Plot 42, Infocity Avenue, Patia',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pin: '751024'
  });

  // Delivery Speed with internal QuickFlow Priority Mapping
  // Standard -> Priority 3
  // Express  -> Priority 6
  // Same Day -> Priority 9
  const [selectedSpeed, setSelectedSpeed] = useState('express');
  const [deliverySlot, setDeliverySlot] = useState('10:00 AM – 2:00 PM');
  const [deliveryInstruction, setDeliveryInstruction] = useState('Call before arrival');

  // Payment Method State
  const [paymentMode, setPaymentMode] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  const [cardDetails, setCardDetails] = useState({ number: '•••• •••• •••• 4242', name: 'Aarav Sharma', expiry: '12/28', cvv: '•••' });
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');

  const deliveryOptions = [
    {
      id: 'standard',
      label: 'Standard',
      time: '2–3 Business Days',
      fee: 199,
      priorityScore: 3,
      priorityTag: 'Priority 3 Node'
    },
    {
      id: 'express',
      label: 'Express',
      time: 'Next Day by 2:00 PM',
      fee: 499,
      priorityScore: 6,
      priorityTag: 'Priority 6 High-Speed Node',
      isPopular: true
    },
    {
      id: 'same_day',
      label: 'Same Day',
      time: 'Today by 8:00 PM',
      fee: 999,
      priorityScore: 9,
      priorityTag: 'Priority 9 Ultra-Urgent Node'
    }
  ];

  const currentOption = deliveryOptions.find((o) => o.id === selectedSpeed) || deliveryOptions[1];

  const getInrPrice = (item) => {
    if (item.name.toLowerCase().includes('macbook')) return 149900;
    if (item.name.toLowerCase().includes('magic mouse')) return 7900;
    if (item.priceInrRaw) return item.priceInrRaw;
    return item.price * 100;
  };

  const subtotalInr = cart.reduce((acc, item) => acc + getInrPrice(item) * item.quantity, 0);
  const discountAmount = discountInfo.discountAmount || 0;
  const totalInr = Math.max(0, subtotalInr - discountAmount + currentOption.fee);

  const handleSubmit = (e) => {
    e.preventDefault();
    playAppleSound('apple_pay');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const orderPayload = {
      id: 'QF-10482',
      date: 'Just now',
      city: address.city,
      state: address.state,
      pinCode: address.pin,
      deliveryAddress: `${address.street}, ${address.city}, ${address.state} ${address.pin}`,
      speedOption: currentOption.label,
      deliverySlot: `${currentOption.time} (${deliverySlot})`,
      deliveryInstruction,
      paymentMethod: paymentMode === 'upi' ? `UPI (${upiId})` : paymentMode === 'card' ? 'Visa •••• 4242' : paymentMode === 'netbanking' ? 'HDFC NetBanking' : 'Cash on Delivery',
      deliveryFee: currentOption.fee,
      quickflowPriority: currentOption.priorityScore, // Internal Priority 3, 6, or 9
      status: 'Picking items',
      currentStageIndex: 3,
      hub: 'Mumbai Fulfillment Center',
      hubCode: 'BOM-04',
      estimatedDelivery: currentOption.time,
      estimatedCompletionTime: '18 minutes',
      carrier: currentOption.id === 'same_day' ? 'QuickFlow Hyperlocal Air Express' : 'BlueDart Air Express',
      total: totalInr,
      items: cart.map(it => ({
        ...it,
        price: getInrPrice(it),
        aisle: 'Aisle 04-B',
        shelf: 'Shelf 12',
        located: true
      }))
    };

    onCompleteOrder(orderPayload);
  };

  return (
    <div className="drawer-overlay" onClick={() => { playAppleSound('click'); onClose(); }} style={{ alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '720px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-apple-blue)' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-apple-blue)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            SECURE QUICKFLOW CHECKOUT
          </span>
        </div>

        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-carbon)', marginBottom: '24px' }}>
          Delivery & Payment
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Section 1: Delivery Address (Bhubaneswar) */}
          <div style={{ background: '#fbfbfd', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MapPin size={16} color="var(--color-apple-blue)" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-carbon)' }}>Delivery Address</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Full Name</label>
                <input
                  type="text"
                  className="quickflow-input"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                <input
                  type="text"
                  className="quickflow-input"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Street Address</label>
                <input
                  type="text"
                  className="quickflow-input"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>City (Delivery Target)</label>
                <input
                  type="text"
                  className="quickflow-input"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>PIN Code</label>
                <input
                  type="text"
                  className="quickflow-input"
                  value={address.pin}
                  onChange={(e) => setAddress({ ...address, pin: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Speed Priority Selection */}
          <div style={{ background: '#fbfbfd', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={16} color="var(--color-apple-blue)" />
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-carbon)' }}>Delivery speed</h2>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Automated network priority routing</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {deliveryOptions.map((opt) => {
                const isSelected = selectedSpeed === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => {
                      playAppleSound('pop');
                      setSelectedSpeed(opt.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(0, 113, 227, 0.05)' : '#ffffff',
                      border: isSelected ? '2px solid var(--color-apple-blue)' : '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid var(--color-apple-blue)' : '2px solid var(--color-border)',
                          background: '#ffffff'
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-carbon)' }}>
                          {opt.label}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {opt.time}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-carbon)' }}>
                        ₹{opt.fee}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-apple-blue)', fontWeight: 600 }}>
                        {opt.priorityTag}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {/* Time Slot & Instructions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-carbon)', display: 'block', marginBottom: '4px' }}>
                  Preferred Time Slot
                </label>
                <select
                  value={deliverySlot}
                  onChange={(e) => setDeliverySlot(e.target.value)}
                  className="quickflow-input"
                >
                  <option value="10:00 AM – 2:00 PM">Morning (10:00 AM – 2:00 PM)</option>
                  <option value="2:00 PM – 6:00 PM">Afternoon (2:00 PM – 6:00 PM)</option>
                  <option value="6:00 PM – 10:00 PM">Evening (6:00 PM – 10:00 PM)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-carbon)', display: 'block', marginBottom: '4px' }}>
                  Courier Instructions
                </label>
                <select
                  value={deliveryInstruction}
                  onChange={(e) => setDeliveryInstruction(e.target.value)}
                  className="quickflow-input"
                >
                  <option value="Call before arrival">Call before arrival</option>
                  <option value="Leave at society security">Leave at society security</option>
                  <option value="Contactless doorstep delivery">Contactless doorstep delivery</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Simulator */}
          <div style={{ background: '#fbfbfd', border: '1px solid var(--color-border)', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CreditCard size={16} color="var(--color-apple-blue)" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-carbon)' }}>Payment Method</h2>
            </div>

            {/* Payment Mode Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
              {[
                { id: 'upi', label: 'UPI / QR', icon: QrCode },
                { id: 'card', label: 'Cards', icon: CreditCard },
                { id: 'netbanking', label: 'NetBanking', icon: Building },
                { id: 'cod', label: 'COD', icon: Banknote }
              ].map((pm) => {
                const Icon = pm.icon;
                const isSel = paymentMode === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => {
                      playAppleSound('pop');
                      setPaymentMode(pm.id);
                    }}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '10px',
                      border: isSel ? '2px solid var(--color-apple-blue)' : '1px solid var(--color-border)',
                      background: isSel ? 'rgba(0, 113, 227, 0.06)' : '#ffffff',
                      color: isSel ? 'var(--color-apple-blue)' : 'var(--color-carbon)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={16} />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Payment Details */}
            {paymentMode === 'upi' && (
              <div style={{ padding: '14px', borderRadius: '10px', background: '#ffffff', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)' }}>Google Pay / PhonePe / Paytm</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>VPA: {upiId}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: 'rgba(16, 185, 129, 0.08)', padding: '3px 8px', borderRadius: '4px' }}>
                  Instant 1-Click
                </span>
              </div>
            )}

            {paymentMode === 'card' && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  placeholder="Card Number"
                  className="quickflow-input"
                />
                <input
                  type="text"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="quickflow-input"
                />
                <input
                  type="password"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  placeholder="CVV"
                  className="quickflow-input"
                />
              </div>
            )}

            {paymentMode === 'netbanking' && (
              <select className="quickflow-input">
                <option>HDFC Bank (Instant Verification)</option>
                <option>ICICI Bank</option>
                <option>State Bank of India (SBI)</option>
                <option>Axis Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
            )}

            {paymentMode === 'cod' && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '10px', background: '#ffffff', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                Pay via Cash or UPI QR to delivery agent on arrival.
              </div>
            )}
          </div>

          {/* Price Summary & Submit */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Final Total Amount</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-carbon)' }}>
                  ₹{totalInr.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '12px', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>SSL 256-bit Encrypted Checkout</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-quickflow"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: 700,
                borderRadius: '9999px'
              }}
            >
              <span>Place Order</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
