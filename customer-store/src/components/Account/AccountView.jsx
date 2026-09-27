import React, { useState } from 'react';
import { User, Package, MapPin, CreditCard, Shield, Bell, ArrowRight, Zap, CheckCircle2, Clock, Download, RotateCcw, Plus, Check } from 'lucide-react';
import { INITIAL_CUSTOMER_ORDERS } from '../../data/customerOrders';
import { playAppleSound } from '../../utils/audio';

export default function AccountView({
  orders = INITIAL_CUSTOMER_ORDERS,
  onTrackOrder,
  onReorder
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'addresses' | 'payments'
  const [downloadingId, setDownloadingId] = useState(null);

  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'Home (Default)',
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      address: 'Plot 42, Infocity Avenue, Patia, Bhubaneswar, Odisha - 751024',
      isDefault: true
    },
    {
      id: 'addr-2',
      title: 'Tech Hub Office',
      name: 'Aarav Sharma',
      phone: '+91 98765 43210',
      address: 'Tower 3, DLF Cybercity, Patia, Bhubaneswar, Odisha - 751024',
      isDefault: false
    }
  ]);

  const formatInr = (val) => `₹${Number(val).toLocaleString('en-IN')}`;

  const handleDownloadInvoice = (orderId) => {
    playAppleSound('pop');
    setDownloadingId(orderId);
    setTimeout(() => {
      setDownloadingId(null);
      // Simulate file download
      const element = document.createElement("a");
      const file = new Blob([
        `QUICKFLOW OFFICIAL TAX INVOICE\nOrder ID: #${orderId}\nCustomer: Aarav Sharma\nDelivery: Bhubaneswar, Odisha\nStatus: Verified\nTotal Paid: ₹1,58,299\nGSTIN: 29AABCU9603R1ZM\nAuthorized by QuickFlow Logistics Network`
      ], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Invoice-${orderId}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  const handleSetDefaultAddress = (id) => {
    playAppleSound('pop');
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="store-container animate-fade-in" style={{ padding: 'clamp(16px, 3vw, 40px) 16px 80px' }}>
      {/* Header Profile Info Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          padding: 'clamp(16px, 3vw, 28px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-card)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1d1d1f 0%, #434344 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '20px',
              color: '#ffffff',
              flexShrink: 0
            }}
          >
            AS
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-carbon)', margin: 0 }}>Aarav Sharma</h2>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>aarav.sharma@quickflow.io • Member since 2024</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '12px',
              color: '#059669',
              fontWeight: 700
            }}
          >
            ✓ QuickFlow Priority Member
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'addresses', label: `Saved Addresses (${addresses.length})` },
          { id: 'payments', label: 'Payment Methods' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playAppleSound('pop');
              setActiveTab(tab.id);
            }}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === tab.id ? 'var(--color-carbon)' : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
              boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Orders List */}
      {activeTab === 'orders' && (
        <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-carbon)' }}>
              Recent Order History
            </h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Real-time synchronization with C++ fulfillment engine
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px',
                  borderRadius: '14px',
                  background: ord.id === 'QF-10482' ? 'rgba(0, 113, 227, 0.03)' : '#fbfbfd',
                  border: ord.id === 'QF-10482' ? '1.5px solid var(--color-apple-blue)' : '1px solid var(--color-border-subtle)',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-carbon)', fontFamily: 'var(--font-mono)', fontSize: '15px' }}>
                      #{ord.id}
                    </span>
                    <span
                      style={{
                        background: ord.status === 'Picking items' ? 'rgba(0, 113, 227, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                        color: ord.status === 'Picking items' ? 'var(--color-apple-blue)' : '#059669',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '9999px'
                      }}
                    >
                      ● {ord.status || 'Processing'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>• {ord.date}</span>
                  </div>

                  <div style={{ fontSize: '14px', color: 'var(--color-carbon)', fontWeight: 600 }}>
                    {ord.items && ord.items.length > 0
                      ? ord.items.map((it) => `${it.name} × ${it.quantity}`).join(', ')
                      : 'MacBook Pro × 1, Magic Mouse × 1'}
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={12} color="var(--color-apple-blue)" />
                    <span>Delivering to: <strong>{ord.city || 'Bhubaneswar'}</strong></span>
                    <span>•</span>
                    <span>Hub: <strong>{ord.hub || 'Mumbai Fulfillment Center'}</strong></span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 800, color: 'var(--color-carbon)', fontSize: '18px', fontFamily: 'var(--font-sans)', marginRight: '8px' }}>
                    {formatInr(ord.total || 158299)}
                  </span>

                  <button
                    onClick={() => handleDownloadInvoice(ord.id)}
                    style={{
                      background: '#f1f5f9',
                      border: 'none',
                      color: 'var(--color-carbon)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Download Invoice"
                  >
                    <Download size={13} />
                    <span>{downloadingId === ord.id ? 'Saving...' : 'Invoice'}</span>
                  </button>

                  <button
                    onClick={() => {
                      playAppleSound('click');
                      onTrackOrder(ord.id);
                    }}
                    className="btn-quickflow"
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    <span>Track Order</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-carbon)', marginBottom: '18px' }}>
            Manage Delivery Addresses
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {addresses.map((addr) => (
              <div
                key={addr.id}
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  border: addr.isDefault ? '2px solid var(--color-apple-blue)' : '1px solid var(--color-border)',
                  background: addr.isDefault ? 'rgba(0, 113, 227, 0.02)' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--color-carbon)' }}>
                      {addr.title}
                    </div>
                    {addr.isDefault && (
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-apple-blue)', background: 'rgba(0, 113, 227, 0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                        Default
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-carbon)', fontWeight: 600 }}>{addr.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>{addr.address}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Phone: {addr.phone}</div>
                </div>

                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefaultAddress(addr.id)}
                    style={{
                      marginTop: '16px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-carbon)',
                      cursor: 'pointer'
                    }}
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Payment Methods */}
      {activeTab === 'payments' && (
        <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-carbon)', marginBottom: '18px' }}>
            Saved Payment Methods
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CreditCard size={20} color="var(--color-apple-blue)" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-carbon)' }}>HDFC Bank Credit Card •••• 4242</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Expires 12/28 • Tokenized for QuickFlow Express</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669' }}>Primary</span>
            </div>

            <div style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap size={20} color="#059669" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-carbon)' }}>UPI AutoPay (Google Pay)</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>aarav@okhdfcbank</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-apple-blue)' }}>Verified</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
