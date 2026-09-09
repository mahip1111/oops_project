import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, MapPin, Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export default function SpecialistChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'centers'
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your QuickFlow AI Specialist. How can I assist you with your MacBook, audio gear, or live delivery status today?'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const serviceCenters = [
    { city: 'Mumbai', name: 'Apple BKC Flagship & Express Service', address: 'Jio World Drive, Bandra Kurla Complex', phone: '+91 22 6926 7000' },
    { city: 'Delhi NCR', name: 'Apple Saket Store & Support Hub', address: 'Select CITYWALK, Saket District Centre', phone: '+91 11 6926 7100' },
    { city: 'Bhubaneswar', name: 'QuickFlow East Delivery Node & Care', address: 'Plot 42, Infocity Avenue, Patia', phone: '+91 674 274 8800' },
    { city: 'Bengaluru', name: 'Apple Authorised Service Hub', address: '100 Feet Road, Indiranagar', phone: '+91 80 4120 4400' }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    playAppleSound('pop');
    const userMsg = { id: Date.now(), sender: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      playAppleSound('pop');
      let botReply = "QuickFlow automated routing ensures items are fulfilled from the nearest warehouse in under 38 seconds. Your order is tracked with full real-time telemetry!";
      if (userMsg.text.toLowerCase().includes('track') || userMsg.text.toLowerCase().includes('status')) {
        botReply = "Order #QF-10482 is currently at Stage 4: 'Picking items' at Mumbai Fulfillment Center. Estimated arrival in 18 minutes.";
      } else if (userMsg.text.toLowerCase().includes('warranty') || userMsg.text.toLowerCase().includes('care')) {
        botReply = "All products include 2-Year Official Warranty and 14-Day Hassle-Free Replacement. QuickFlow Care+ covers unlimited accidental damages!";
      } else if (userMsg.text.toLowerCase().includes('emi')) {
        botReply = "No-Cost EMI is available on all major credit cards for up to 24 months starting from ₹6,245/month.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => {
          playAppleSound('pop');
          setIsOpen(!isOpen);
        }}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99,
          background: 'var(--color-carbon)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '9999px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
      >
        <MessageSquare size={16} />
        <span>Ask Specialist</span>
      </button>

      {/* Floating Support Modal */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            zIndex: 1000,
            width: '360px',
            height: '500px',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', background: '#f8fafc', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--color-carbon)' }}>QuickFlow Specialist AI</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Online • 24/7 Support</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          {/* Sub Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
            <button
              onClick={() => { playAppleSound('pop'); setActiveTab('chat'); }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: activeTab === 'chat' ? '#ffffff' : '#f8fafc',
                fontWeight: activeTab === 'chat' ? 700 : 500,
                color: activeTab === 'chat' ? 'var(--color-apple-blue)' : 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Live Assistant
            </button>
            <button
              onClick={() => { playAppleSound('pop'); setActiveTab('centers'); }}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: activeTab === 'centers' ? '#ffffff' : '#f8fafc',
                fontWeight: activeTab === 'centers' ? 700 : 500,
                color: activeTab === 'centers' ? 'var(--color-apple-blue)' : 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Service Centers
            </button>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' ? (
            <>
              <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      padding: '10px 14px',
                      borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background: m.sender === 'user' ? 'var(--color-apple-blue)' : '#f1f5f9',
                      color: m.sender === 'user' ? '#ffffff' : 'var(--color-carbon)',
                      fontSize: '12.5px',
                      lineHeight: '1.4'
                    }}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Ask about orders, delivery, specs..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-border)',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'var(--color-apple-blue)',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Send size={14} />
                </button>
              </form>
            </>
          ) : (
            /* Service Centers Tab */
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Official Apple & QuickFlow Express Centers in India:
              </div>
              {serviceCenters.map((sc, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-carbon)' }}>{sc.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sc.address}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-apple-blue)', fontWeight: 600, marginTop: '4px' }}>{sc.phone}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
