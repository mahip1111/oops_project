import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, MapPin, Sparkles, Phone, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { playAppleSound } from '../../utils/audio';

export default function SpecialistChatWidget({ onNavigateView }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'centers'
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I am your QuickFlow AI Specialist. How can I assist you with your MacBook, audio gear, or live delivery status today?',
      action: null
    }
  ]);
  const [inputText, setInputText] = useState('');

  const quickSuggestions = [
    { label: '📦 Track Order #QF-10482', query: 'Track order #QF-10482' },
    { label: '⚡ 38-sec SLA Guarantee', query: 'How does the 38s SLA dispatch work?' },
    { label: '🛡️ AppleCare+ Warranty', query: 'Tell me about warranty & protection' },
    { label: '💳 No-Cost EMI Options', query: 'What EMI plans are available?' }
  ];

  const serviceCenters = [
    { city: 'Mumbai', name: 'Apple BKC Flagship & Express Service', address: 'Jio World Drive, Bandra Kurla Complex', phone: '+91 22 6926 7000' },
    { city: 'Delhi NCR', name: 'Apple Saket Store & Support Hub', address: 'Select CITYWALK, Saket District Centre', phone: '+91 11 6926 7100' },
    { city: 'Bhubaneswar', name: 'QuickFlow East Delivery Node & Care', address: 'Plot 42, Infocity Avenue, Patia', phone: '+91 674 274 8800' },
    { city: 'Bengaluru', name: 'Apple Authorised Service Hub', address: '100 Feet Road, Indiranagar', phone: '+91 80 4120 4400' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const processQuery = (queryText) => {
    playAppleSound('pop');
    const userMsg = { id: Date.now(), sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      playAppleSound('pop');
      let botReply = "QuickFlow automated routing ensures items are fulfilled from the nearest warehouse in under 38 seconds. Your order is tracked with full real-time telemetry!";
      let action = null;

      const lower = queryText.toLowerCase();
      if (lower.includes('track') || lower.includes('status') || lower.includes('10482')) {
        botReply = "Order #QF-10482 is currently at Stage 4: 'Picking items' at Mumbai Fulfillment Center (BOM-04). Real-time GPS courier Alex Vance is assigned for tomorrow by 2:30 PM!";
        action = { label: 'Open Live Milestone Tracker', target: 'track' };
      } else if (lower.includes('warranty') || lower.includes('care') || lower.includes('protection')) {
        botReply = "All products include 2-Year Official Manufacturer Warranty and 14-Day Hassle-Free Replacement. QuickFlow Care+ covers unlimited accidental damages with zero deductible!";
      } else if (lower.includes('emi') || lower.includes('payment')) {
        botReply = "No-Cost EMI is available on HDFC, ICICI, SBI, and Axis Bank cards for up to 24 months starting at ₹6,245/month. Zero down payment required!";
      } else if (lower.includes('sla') || lower.includes('38') || lower.includes('speed')) {
        botReply = "Our C++ FastRoute multi-threaded engine calculates Dijkstra shortest-distance algorithms to match inventory and allocate automated AGV picking robots within 38 milliseconds!";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botReply, action }]);
    }, 700);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    processQuery(inputText.trim());
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
          bottom: '20px',
          right: '20px',
          zIndex: 99,
          background: 'var(--color-primary)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '9999px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13.5px',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <MessageSquare size={16} />
        <span>Ask 24/7 Specialist</span>
      </button>

      {/* Floating Support Modal */}
      {isOpen && (
        <div
          className="animate-fade-in store-modal-content"
          style={{
            position: 'fixed',
            bottom: '76px',
            right: '16px',
            zIndex: 1000,
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            maxHeight: 'calc(100vh - 100px)',
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid var(--color-border)',
            boxShadow: '0 20px 48px rgba(15, 23, 42, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', background: 'var(--color-primary)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '-0.2px' }}>QuickFlow AI Specialist</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Real-Time Logistics & Hardware Copilot</div>
              </div>
            </div>
            <button
              onClick={() => {
                playAppleSound('click');
                setIsOpen(false);
              }}
              style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#ffffff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} />
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
                color: activeTab === 'chat' ? 'var(--color-accent)' : 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                borderBottom: activeTab === 'chat' ? '2px solid var(--color-accent)' : 'none'
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
                color: activeTab === 'centers' ? 'var(--color-accent)' : 'var(--text-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                borderBottom: activeTab === 'centers' ? '2px solid var(--color-accent)' : 'none'
              }}
            >
              Express Service Centers
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
                      background: m.sender === 'user' ? 'var(--color-accent)' : '#f1f5f9',
                      color: m.sender === 'user' ? '#ffffff' : 'var(--color-primary)',
                      fontSize: '13px',
                      lineHeight: '1.45',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div>{m.text}</div>
                    {m.action && onNavigateView && (
                      <button
                        onClick={() => {
                          playAppleSound('click');
                          setIsOpen(false);
                          onNavigateView(m.action.target);
                        }}
                        style={{
                          marginTop: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#ffffff',
                          border: '1px solid var(--color-accent)',
                          color: 'var(--color-accent)',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <span>{m.action.label}</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div
                    style={{
                      alignSelf: 'flex-start',
                      padding: '8px 14px',
                      borderRadius: '14px 14px 14px 2px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite 0.2s' }} />
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: 'pulseGlow 1s infinite 0.4s' }} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div style={{ padding: '6px 12px', background: '#f8fafc', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
                {quickSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => processQuery(s.query)}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: '#ffffff',
                      border: '1px solid var(--color-border)',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} style={{ padding: '10px 12px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '8px', background: '#ffffff' }}>
                <input
                  type="text"
                  placeholder="Ask about orders, delivery, specs..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 14px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-border)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  <Send size={14} />
                </button>
              </form>
            </>
          ) : (
            /* Service Centers Tab */
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                Official Apple & QuickFlow Express Centers in India:
              </div>
              {serviceCenters.map((sc, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '12px', background: '#f8fafc', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontWeight: 800, fontSize: '13.5px', color: 'var(--color-primary)' }}>{sc.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>{sc.address}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-accent)', fontWeight: 700, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} />
                    <span>{sc.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

