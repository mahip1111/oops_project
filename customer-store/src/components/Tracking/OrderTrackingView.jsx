import React, { useState, useEffect } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  MapPin,
  Truck,
  Box,
  Cpu,
  ShieldCheck,
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Layers,
  Activity,
  AlertCircle,
  Radio,
  Zap,
  Phone,
  KeyRound,
  FileText,
  Share2,
  Navigation,
  RefreshCw,
  Sliders,
  CheckCheck
} from 'lucide-react';
import { INITIAL_CUSTOMER_ORDERS } from '../../data/customerOrders';
import ActivityDrawer from './ActivityDrawer';
import { playAppleSound } from '../../utils/audio';

const STAGE_DEFINITIONS = [
  {
    id: 0,
    name: 'Order confirmed',
    symbol: '✓',
    tag: 'Order Authorized',
    description: 'Payment authorized & cryptographic token verified in order ledger.',
    duration: '0s (Instant)',
    system: 'Node API Gateway'
  },
  {
    id: 1,
    name: 'Inventory reserved',
    symbol: '✓',
    tag: 'Stock Locked',
    description: 'High-availability SKU allocations locked in Mumbai West fulfillment stock.',
    duration: '1.2s SLA',
    system: 'Inventory Sync Service'
  },
  {
    id: 2,
    name: 'Fulfillment center selected',
    symbol: '✓',
    tag: 'Hub BOM-04',
    description: 'C++ Dijkstra routing engine matched nearest center with optimal SLA & capacity.',
    duration: '38ms Compute',
    system: 'C++ FastRoute Engine'
  },
  {
    id: 3,
    name: 'Picking items',
    symbol: '●',
    tag: 'Active Picking',
    description: 'Autonomous AGV robots & automated picking pods locating physical items in aisles.',
    duration: '18 minutes remaining',
    system: 'Automated AGV Fleet (Bot #48)'
  },
  {
    id: 4,
    name: 'Packing',
    symbol: '○',
    tag: 'Station 07',
    description: 'Thermal protective shock-proof packaging with tamper-evident seal application.',
    duration: 'Est. 4 mins',
    system: 'Packaging Automated Cell'
  },
  {
    id: 5,
    name: 'Quality check',
    symbol: '○',
    tag: 'Optical & RFID Scan',
    description: 'Automated weigh-scale calibration and high-speed optical barcode validation.',
    duration: 'Est. 45 secs',
    system: 'Vision QC Inspection'
  },
  {
    id: 6,
    name: 'Shipped',
    symbol: '○',
    tag: 'Air Express Fleet',
    description: 'Dispatched via QuickFlow Hyperlocal Air Express directly toward regional sorting node.',
    duration: 'In Transit',
    system: 'Logistics HyperRoute'
  },
  {
    id: 7,
    name: 'Delivered',
    symbol: '○',
    tag: 'Delivered to Doorstep',
    description: 'Package handed over and signed at customer address in Bhubaneswar.',
    duration: 'Final Mile SLA',
    system: 'Delivery Fleet'
  }
];

export default function OrderTrackingView({ orders = INITIAL_CUSTOMER_ORDERS, onShopMore, onReorder }) {
  // Default to QF-10482
  const defaultOrder = orders.find((o) => o.id === 'QF-10482') || orders[0] || INITIAL_CUSTOMER_ORDERS[0];
  
  const [selectedOrderId, setSelectedOrderId] = useState(defaultOrder?.id || 'QF-10482');
  const [currentOrder, setCurrentOrder] = useState(defaultOrder);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);
  const [driverContacted, setDriverContacted] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);

  // Micro-simulation for courier vehicle moving along delivery path
  const [vanPosition, setVanPosition] = useState({ x: 65, y: 48 });

  // Interactive Stage State (0 to 7)
  const [activeStageIndex, setActiveStageIndex] = useState(defaultOrder?.currentStageIndex ?? 3);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(2500); // ms per step

  // Live Timer Countdown for stage 3
  const [countdownMinutes, setCountdownMinutes] = useState(18);
  const [countdownSeconds, setCountdownSeconds] = useState(0);

  // Active Tab in telemetry inspector
  const [activeTelemetryTab, setActiveTelemetryTab] = useState('picker'); // 'picker' | 'items' | 'engine' | 'logs'

  // Update currentOrder when selectedOrderId changes
  useEffect(() => {
    const matched = orders.find((o) => o.id.toLowerCase() === selectedOrderId.toLowerCase());
    if (matched) {
      setCurrentOrder(matched);
      setActiveStageIndex(matched.currentStageIndex ?? 3);
    }
  }, [selectedOrderId, orders]);

  // Real-time Countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prevSec) => {
        if (prevSec > 0) {
          return prevSec - 1;
        } else {
          setCountdownMinutes((prevMin) => (prevMin > 0 ? prevMin - 1 : 18));
          return 59;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Moving Courier Van simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVanPosition(prev => ({
        x: Math.max(25, Math.min(78, prev.x + (Math.random() * 2.5 - 1.25))),
        y: Math.max(30, Math.min(65, prev.y + (Math.random() * 2 - 1)))
      }));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Auto-play simulation effect
  useEffect(() => {
    let interval = null;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveStageIndex((prev) => {
          if (prev >= STAGE_DEFINITIONS.length - 1) {
            setIsAutoPlaying(false);
            playAppleSound('apple_pay');
            return prev;
          }
          playAppleSound('pop');
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlaying, playbackSpeed]);

  const handleCopyOrderId = () => {
    playAppleSound('click');
    navigator.clipboard?.writeText(currentOrder?.id || 'QF-10482');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyPin = () => {
    playAppleSound('click');
    const pin = currentOrder?.trackingPin || currentOrder?.deliveryPin || '7510';
    navigator.clipboard?.writeText(pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  const handleShareTracking = () => {
    playAppleSound('click');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 2500);
  };

  const handleCallDriver = () => {
    playAppleSound('pop');
    setDriverContacted(true);
    alert(`Connecting secure encrypted call to Courier Alex Vance (+91 98765-43210) for Order #${currentOrder?.id}...`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    playAppleSound('click');
    const query = searchQuery.trim().toUpperCase();
    const matched = orders.find((o) => o.id.toUpperCase() === query || o.id.includes(query));
    if (matched) {
      setSelectedOrderId(matched.id);
      setCurrentOrder(matched);
      setActiveStageIndex(matched.currentStageIndex ?? 3);
    } else {
      const newCustomOrder = {
        id: query.startsWith('QF-') ? query : `QF-${query}`,
        date: 'Today, March 6, 2026',
        status: 'Picking items',
        currentStageIndex: 3,
        hub: 'Mumbai Fulfillment Center',
        hubCode: 'BOM-04',
        city: 'Bhubaneswar',
        state: 'Odisha',
        pinCode: '751024',
        deliveryAddress: 'Plot 412, Infocity Road, Patia, Bhubaneswar, Odisha',
        estimatedDelivery: 'Tomorrow by 2:30 PM',
        estimatedCompletionTime: '18 minutes',
        trackingPin: '7510',
        carrier: 'QuickFlow Hyperlocal Air Express',
        driverName: 'Alex Vance',
        driverRating: '4.9',
        driverPhone: '+91 98765-43210',
        items: [
          { name: 'MacBook Pro', quantity: 1, color: 'Space Black', price: 149900, aisle: 'Aisle 04-B', shelf: 'Shelf 12', located: true, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
          { name: 'Magic Mouse', quantity: 1, color: 'White', price: 7900, aisle: 'Aisle 02-C', shelf: 'Shelf 08', located: true, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80' }
        ]
      };
      setCurrentOrder(newCustomOrder);
      setSelectedOrderId(newCustomOrder.id);
      setActiveStageIndex(3);
    }
    setSearchQuery('');
  };

  const itemsList = currentOrder?.items?.length
    ? currentOrder.items
    : [
        { name: 'MacBook Pro', quantity: 1, color: 'Space Black', price: 149900, aisle: 'Aisle 04-B', shelf: 'Shelf 12', located: true, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
        { name: 'Magic Mouse', quantity: 1, color: 'White', price: 7900, aisle: 'Aisle 02-C', shelf: 'Shelf 08', located: true, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80' }
      ];

  const destinationCity = currentOrder?.city || 'Bhubaneswar';
  const hubName = currentOrder?.hub || 'Mumbai Fulfillment Center';
  const deliveryPin = currentOrder?.trackingPin || currentOrder?.deliveryPin || '7510';
  const driverName = currentOrder?.driverName || 'Alex Vance';
  const driverRating = currentOrder?.driverRating || '4.9';

  return (
    <div className="animate-fade-in store-container" style={{ maxWidth: '1120px', margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 20px) 60px' }}>
      
      {/* Search & Live Network Quick Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px',
          background: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          padding: '12px 18px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)' }}>
            LIVE FULFILLMENT & COURIER NETWORK
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: '#f5f5f7', padding: '2px 8px', borderRadius: '6px' }}>
            Node BOM-04 Active
          </span>
        </div>

        {/* Right side actions: Order selector, Search form & Activity Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {orders.length > 1 && (
            <select
              value={selectedOrderId}
              onChange={(e) => {
                playAppleSound('click');
                setSelectedOrderId(e.target.value);
              }}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#f5f5f7',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-carbon)',
                outline: 'none'
              }}
            >
              {orders.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  {ord.id} - {ord.city || 'Bhubaneswar'} ({ord.status || 'Active'})
                </option>
              ))}
            </select>
          )}

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Search (e.g. QF-10482)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                background: '#f5f5f7',
                border: '1px solid var(--color-border)',
                color: 'var(--color-carbon)',
                fontSize: '13px',
                outline: 'none',
                width: '180px'
              }}
            />
            <button
              type="submit"
              className="btn-quickflow"
              style={{ padding: '7px 14px', fontSize: '13px' }}
            >
              <Search size={13} />
              <span>Track</span>
            </button>
          </form>

          <button
            onClick={() => {
              playAppleSound('toggle');
              setIsActivityDrawerOpen(true);
            }}
            className="btn-ghost"
            style={{
              padding: '7px 14px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <Activity size={14} color="var(--color-apple-blue)" />
            <span>Activity Logs</span>
          </button>
        </div>
      </div>

      {/* Main Order Container */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          padding: 'clamp(16px, 4vw, 32px)',
          boxShadow: 'var(--shadow-card)',
          position: 'relative'
        }}
      >
        {/* 1. ORDER HEADER & METADATA BAR */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px',
            marginBottom: '28px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'rgba(0, 113, 227, 0.08)',
                  color: 'var(--color-apple-blue)',
                  fontWeight: 700,
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {activeStageIndex >= 6 ? 'Courier In Transit' : 'Warehouse Processing'}
              </span>

              <h1
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'var(--color-carbon)',
                  letterSpacing: '-0.5px'
                }}
              >
                ORDER #{currentOrder?.id || 'QF-10482'}
              </h1>

              <button
                onClick={handleCopyOrderId}
                title="Copy Order ID"
                style={{
                  background: '#f5f5f7',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  color: copiedId ? '#059669' : 'var(--text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                {copiedId ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Product Items Summary List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
              {itemsList.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-carbon)'
                  }}
                >
                  <span>{item.name}</span>
                  <span style={{ color: 'var(--text-faint)', fontWeight: 400 }}>×</span>
                  <span style={{ color: 'var(--color-apple-blue)', fontWeight: 700 }}>{item.quantity}</span>
                  {item.color && (
                    <span
                      style={{
                        fontSize: '11px',
                        background: '#f5f5f7',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        color: 'var(--text-muted)',
                        marginLeft: '4px'
                      }}
                    >
                      {item.color}
                    </span>
                  )}
                  {item.price && (
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: 'auto', fontWeight: 500 }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Action Pill Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={handleShareTracking}
                style={{
                  background: '#f5f5f7',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  color: 'var(--color-carbon)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 600
                }}
              >
                <Share2 size={12} color="var(--color-apple-blue)" />
                <span>{sharedToast ? 'Link Copied!' : 'Share Tracking'}</span>
              </button>

              <button
                onClick={() => {
                  playAppleSound('click');
                  alert(`Downloading GST Tax Invoice for Order #${currentOrder?.id}...`);
                }}
                style={{
                  background: '#f5f5f7',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  color: 'var(--color-carbon)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 600
                }}
              >
                <FileText size={12} color="#059669" />
                <span>Tax Invoice</span>
              </button>
            </div>
          </div>

          {/* DELIVERING TO Section Card */}
          <div
            style={{
              background: '#fbfbfd',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              padding: '16px 20px',
              minWidth: '240px',
              textAlign: 'left'
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-faint)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <MapPin size={13} color="var(--color-apple-blue)" />
              <span>DELIVERING TO</span>
            </div>
            <div
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: 'var(--color-carbon)',
                fontFamily: 'var(--font-sans)'
              }}
            >
              {destinationCity}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '220px' }}>
              {currentOrder?.deliveryAddress || 'Plot 412, Infocity Road, Patia, Bhubaneswar, Odisha 751024'}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#059669', marginTop: '6px' }}>
              Scheduled: {currentOrder?.estimatedDelivery || 'Tomorrow by 2:30 PM'}
            </div>
          </div>
        </div>

        {/* ──────────────────────────── DIVIDER ──────────────────────────── */}
        <div style={{ margin: '20px 0 28px', height: '1px', background: 'var(--color-border)' }} />

        {/* 2. MERGED CORE: TWO-COLUMN LAYOUT (GPS MAP & COURIER ON LEFT, 8-STAGE VERTICAL FLOW ON RIGHT) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            marginBottom: '36px'
          }}
        >
          {/* LEFT COLUMN: INTERACTIVE GPS MAP, COURIER CARD & DELIVERY PIN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Animated GPS Live Map Simulation */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  height: '240px',
                  backgroundColor: '#eaf0f6',
                  position: 'relative',
                  backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)',
                  backgroundSize: '20px 20px',
                  overflow: 'hidden'
                }}
              >
                {/* Simulated Road Route Path (SVG) */}
                <svg
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                >
                  <path
                    d="M 50 190 Q 150 70, 240 130 T 420 65"
                    fill="none"
                    stroke="var(--color-apple-blue)"
                    strokeWidth="4"
                    strokeDasharray="8 6"
                  />
                </svg>

                {/* Origin Hub Pin */}
                <div
                  style={{
                    position: 'absolute',
                    top: '190px',
                    left: '50px',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#64748b',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Box size={13} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#475569', marginTop: '2px', background: '#ffffff', padding: '1px 5px', borderRadius: '4px' }}>
                    Hub BOM-04
                  </span>
                </div>

                {/* Delivery Destination Pin */}
                <div
                  style={{
                    position: 'absolute',
                    top: '65px',
                    left: '78%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 600,
                      marginBottom: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    Your Doorstep ({destinationCity})
                  </div>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-carbon)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                  >
                    <MapPin size={17} />
                  </div>
                </div>

                {/* Moving Courier Van Marker */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${vanPosition.y}%`,
                    left: `${vanPosition.x}%`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'all 2s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--color-apple-blue)',
                      color: '#ffffff',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      marginBottom: '4px',
                      boxShadow: '0 2px 8px rgba(0,113,227,0.4)'
                    }}
                  >
                    Courier Alex (1.4 km away)
                  </div>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-apple-blue)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 0 6px rgba(0, 113, 227, 0.25)',
                      animation: 'pulseGlow 2s infinite'
                    }}
                  >
                    <Truck size={18} />
                  </div>
                </div>
              </div>

              {/* Courier Profile & Amazon/Flipkart Secure Delivery PIN */}
              <div
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  backgroundColor: '#ffffff'
                }}
              >
                {/* Driver Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: 'var(--color-apple-blue)',
                      fontSize: '14px'
                    }}
                  >
                    AV
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-carbon)' }}>
                      {driverName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      QuickFlow Express · ★ {driverRating} (1,420+ trips)
                    </div>
                  </div>
                </div>

                {/* Call Driver Button */}
                <button
                  onClick={handleCallDriver}
                  className="btn-ghost"
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderColor: driverContacted ? '#10b981' : 'var(--color-border)',
                    color: driverContacted ? '#059669' : 'var(--color-carbon)'
                  }}
                >
                  <Phone size={13} color={driverContacted ? '#059669' : 'var(--color-apple-blue)'} />
                  <span>{driverContacted ? 'Connected' : 'Call Courier'}</span>
                </button>
              </div>

              {/* Secure Delivery Confirmation PIN Strip */}
              <div
                style={{
                  margin: '0 16px 16px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(0, 113, 227, 0.05)',
                  borderRadius: '12px',
                  border: '1px dashed var(--color-apple-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(0, 113, 227, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <KeyRound size={16} color="var(--color-apple-blue)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Delivery Confirmation PIN (Share with Driver)
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '3px', color: 'var(--color-apple-blue)', fontFamily: 'var(--font-mono)' }}>
                      {deliveryPin}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyPin}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: copiedPin ? '#059669' : 'var(--color-carbon)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedPin ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedPin ? 'Copied' : 'Copy PIN'}</span>
                </button>
              </div>
            </div>

            {/* Package Protection & Technical Specifications */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '18px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-carbon)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={14} color="#059669" />
                <span>Package Specifications & Security</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--text-faint)', fontSize: '10px', textTransform: 'uppercase' }}>Gross Weight</span>
                  <div style={{ fontWeight: 700, color: 'var(--color-carbon)', marginTop: '2px' }}>1.84 kg (Shielded)</div>
                </div>

                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--text-faint)', fontSize: '10px', textTransform: 'uppercase' }}>Security Seal</span>
                  <div style={{ fontWeight: 700, color: '#059669', marginTop: '2px' }}>Tamper-Evident RFID</div>
                </div>

                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--text-faint)', fontSize: '10px', textTransform: 'uppercase' }}>Carrier Type</span>
                  <div style={{ fontWeight: 700, color: 'var(--color-carbon)', marginTop: '2px' }}>Hyperlocal Air Express</div>
                </div>

                <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                  <span style={{ color: 'var(--text-faint)', fontSize: '10px', textTransform: 'uppercase' }}>OTP Handover</span>
                  <div style={{ fontWeight: 700, color: 'var(--color-apple-blue)', marginTop: '2px' }}>Required at Doorstep</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: THE 8-STAGE VERTICAL MILESTONE PIPELINE WITH CONNECTED DOWN ARROWS (↓) */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-carbon)' }}>
                  Fulfillment Milestone Pipeline
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  8-Stage Vertical Flow with Dijkstra SLA Tracking
                </p>
              </div>

              {/* Simulation Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#f5f5f7',
                  border: '1px solid var(--color-border)',
                  borderRadius: '9999px',
                  padding: '3px 6px'
                }}
              >
                <button
                  onClick={() => {
                    playAppleSound('click');
                    setActiveStageIndex((prev) => Math.max(0, prev - 1));
                  }}
                  disabled={activeStageIndex <= 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeStageIndex <= 0 ? 'var(--text-faint)' : 'var(--color-carbon)',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 8px',
                    cursor: activeStageIndex <= 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ◀ Prev
                </button>

                <button
                  onClick={() => {
                    playAppleSound('toggle');
                    setIsAutoPlaying(!isAutoPlaying);
                  }}
                  className="btn-quickflow"
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 600
                  }}
                >
                  {isAutoPlaying ? <Pause size={11} /> : <Play size={11} />}
                  <span>{isAutoPlaying ? 'Simulating...' : 'Simulate'}</span>
                </button>

                <button
                  onClick={() => {
                    playAppleSound('click');
                    setActiveStageIndex((prev) => Math.min(STAGE_DEFINITIONS.length - 1, prev + 1));
                  }}
                  disabled={activeStageIndex >= STAGE_DEFINITIONS.length - 1}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: activeStageIndex >= STAGE_DEFINITIONS.length - 1 ? 'var(--text-faint)' : 'var(--color-carbon)',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 8px',
                    cursor: activeStageIndex >= STAGE_DEFINITIONS.length - 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next ▶
                </button>

                <button
                  onClick={() => {
                    playAppleSound('click');
                    setActiveStageIndex(3);
                    setIsAutoPlaying(false);
                  }}
                  title="Reset to Stage 4 (Picking items)"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    padding: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>

            {/* Vertical Stepper with connected down arrows (↓) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0px',
                paddingLeft: '4px'
              }}
            >
              {STAGE_DEFINITIONS.map((stage, idx) => {
                const isPast = idx < activeStageIndex;
                const isCurrent = idx === activeStageIndex;
                const isFuture = idx > activeStageIndex;

                let symbolChar = '○';
                if (isPast) symbolChar = '✓';
                else if (isCurrent) symbolChar = '●';
                else symbolChar = '○';

                return (
                  <div key={stage.id} style={{ width: '100%' }}>
                    {/* Single Stage Row */}
                    <div
                      onClick={() => {
                        playAppleSound('click');
                        setActiveStageIndex(idx);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '8px 12px',
                        borderRadius: '12px',
                        background: isCurrent ? 'rgba(0, 113, 227, 0.06)' : 'transparent',
                        border: isCurrent ? '1px solid rgba(0, 113, 227, 0.25)' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* Stage Symbol Indicator */}
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isPast ? '12px' : isCurrent ? '13px' : '12px',
                          fontWeight: 800,
                          background: isPast
                            ? 'rgba(16, 185, 129, 0.12)'
                            : isCurrent
                            ? 'var(--color-apple-blue)'
                            : '#f5f5f7',
                          color: isPast
                            ? '#059669'
                            : isCurrent
                            ? '#ffffff'
                            : 'var(--text-faint)',
                          border: isPast
                            ? '1px solid #10b981'
                            : isCurrent
                            ? '1px solid var(--color-apple-blue)'
                            : '1px solid var(--color-border)',
                          flexShrink: 0
                        }}
                      >
                        {symbolChar}
                      </div>

                      {/* Stage Title & Tag */}
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: isCurrent ? 700 : isPast ? 600 : 500,
                              color: isCurrent ? 'var(--color-carbon)' : isPast ? 'var(--color-carbon)' : 'var(--text-faint)'
                            }}
                          >
                            {stage.name}
                          </span>

                          {isCurrent && (
                            <span
                              style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                background: 'var(--color-apple-blue)',
                                color: '#ffffff',
                                padding: '2px 7px',
                                borderRadius: '9999px',
                                textTransform: 'uppercase'
                              }}
                            >
                              IN PROGRESS
                            </span>
                          )}

                          {isPast && (
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#059669',
                                fontWeight: 600
                              }}
                            >
                              Completed
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {stage.duration}
                        </div>
                      </div>
                    </div>

                    {/* Connected Down Arrow (↓) */}
                    {idx < STAGE_DEFINITIONS.length - 1 && (
                      <div
                        style={{
                          paddingLeft: '20px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          color: isPast ? '#059669' : isCurrent ? 'var(--color-apple-blue)' : 'var(--color-border)',
                          fontSize: '12px',
                          fontWeight: 700,
                          lineHeight: 1
                        }}
                      >
                        ↓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. "CURRENTLY" LIVE TELEMETRY CARD */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid var(--color-border)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            marginBottom: '32px'
          }}
        >
          {/* Section Header: CURRENTLY */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '18px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  color: 'var(--color-apple-blue)',
                  background: 'rgba(0, 113, 227, 0.08)',
                  border: '1px solid rgba(0, 113, 227, 0.2)',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase'
                }}
              >
                CURRENTLY
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: '#059669',
                  fontWeight: 600
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#10b981'
                  }}
                />
                <span>Live System Broadcast</span>
              </div>
            </div>

            {/* Sub-tab selection */}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                padding: '3px',
                borderRadius: '8px'
              }}
            >
              {[
                { key: 'picker', label: 'Robotics AGV' },
                { key: 'items', label: 'Item Manifest' },
                { key: 'engine', label: 'C++ FastRoute' },
                { key: 'logs', label: 'Checkpoints & Logs' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    playAppleSound('toggle');
                    setActiveTelemetryTab(tab.key);
                  }}
                  style={{
                    background: activeTelemetryTab === tab.key ? 'var(--color-carbon)' : 'transparent',
                    color: activeTelemetryTab === tab.key ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary 4 Specification Points */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '16px',
              marginBottom: '20px',
              background: '#ffffff',
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              padding: '18px'
            }}
          >
            {/* 1. Status */}
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
                ACTIVE TASK
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-carbon)' }}>
                {activeStageIndex === 3 ? 'Picking your items' : STAGE_DEFINITIONS[activeStageIndex].name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {STAGE_DEFINITIONS[activeStageIndex].description}
              </div>
            </div>

            {/* 2. Items Located */}
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
                ITEM RECOVERY
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>2 of 2 items located</span>
                <CheckCircle2 size={16} color="#059669" />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                All SKUs retrieved from automated pods
              </div>
            </div>

            {/* 3. Node */}
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
                FULFILLMENT NODE
              </div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-carbon)' }}>
                {hubName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-apple-blue)', marginTop: '2px', fontWeight: 600 }}>
                Node BOM-04 (SuperHub Gateway)
              </div>
            </div>

            {/* 4. Estimated Completion */}
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '3px' }}>
                ESTIMATED COMPLETION
              </div>
              <div
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: 'var(--color-apple-blue)',
                  fontFamily: 'var(--font-mono)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Clock size={16} />
                <span>
                  {activeStageIndex === 3
                    ? `${countdownMinutes}m ${countdownSeconds < 10 ? '0' : ''}${countdownSeconds}s`
                    : activeStageIndex > 3
                    ? 'Completed Stage'
                    : '18 minutes'}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {activeStageIndex >= 7 ? 'Package at Doorstep' : 'Real-time SLA active'}
              </div>
            </div>
          </div>

          {/* Sub Tab Contents */}
          {activeTelemetryTab === 'picker' && (
            <div
              className="animate-fade-in"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '12px',
                background: '#ffffff',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)'
              }}
            >
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase' }}>ROBOT UNIT</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)', marginTop: '2px' }}>Kiva-AGV-48 (Automated)</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase' }}>VELOCITY</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>2.4 m/s (Pod Traversal)</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase' }}>BATTERY / HEALTH</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-apple-blue)', marginTop: '2px' }}>96% (Optimal Thermal)</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase' }}>ASSIGNED WORKER</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)', marginTop: '2px' }}>Station Operator #18</div>
              </div>
            </div>
          )}

          {activeTelemetryTab === 'items' && (
            <div
              className="animate-fade-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                background: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)' }}>MacBook Pro 14" (Space Black) × 1</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Location: Aisle 04-B • Shelf 12 • Serial #APL-8941-MBP</div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>Located ✓</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: '#f8fafc',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)' }}>Magic Mouse (White) × 1</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Location: Aisle 02-C • Shelf 08 • Serial #APL-1029-MM</div>
                  </div>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>Located ✓</span>
              </div>
            </div>
          )}

          {activeTelemetryTab === 'engine' && (
            <div
              className="animate-fade-in"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '12px',
                background: '#ffffff',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)'
              }}
            >
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase' }}>DISPATCH PRIORITY</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-apple-blue)', marginTop: '2px' }}>Priority 6 (Express SLA)</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase' }}>OPTIMAL ROUTE PATH</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)', marginTop: '2px' }}>BOM-04 ➔ NGP-02 ➔ BBI-01</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase' }}>DIJKSTRA LATENCY</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#059669', marginTop: '2px' }}>1.2 ms (C++ Engine)</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'uppercase' }}>SLA CONFIDENCE</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)', marginTop: '2px' }}>99.8% On-Time</div>
              </div>
            </div>
          )}

          {activeTelemetryTab === 'logs' && (
            <div
              className="animate-fade-in"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                background: '#ffffff',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)'
              }}
            >
              {[
                { time: '10:14 AM', title: 'Order Payment Confirmed', desc: 'Cryptographic authorization token QF-AUTH-990 verified', active: true },
                { time: '10:15 AM', title: 'Inventory SKUs Locked', desc: '2 items reserved at Mumbai Central Stock Node', active: true },
                { time: '10:16 AM', title: 'FastRoute Engine Assigned BOM-04 Hub', desc: 'Dijkstra shortest path computed in 1.2ms', active: true },
                { time: '10:18 AM', title: 'Robotics AGV Active Picking', desc: 'Bot #48 retrieved MacBook Pro & Magic Mouse', active: true },
                { time: 'Pending', title: 'Tamper-Evident Outbound Packing', desc: 'Station 07 awaiting automated seal', active: false }
              ].map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: log.active ? '#059669' : 'var(--color-border)',
                        marginTop: '4px'
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.time}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-carbon)' }}>{log.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{log.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. ITEMS IN THIS SHIPMENT & 1-CLICK REORDER STRIP */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--color-border)',
            borderRadius: '18px',
            padding: '22px',
            marginBottom: '28px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-carbon)' }}>
              Items in this Shipment ({itemsList.length})
            </h3>
            <button
              onClick={() => {
                playAppleSound('add_to_bag');
                if (onReorder) onReorder(currentOrder);
                alert(`Added all ${itemsList.length} items from Order #${currentOrder?.id} to your Bag!`);
              }}
              className="btn-quickflow"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              <RefreshCw size={13} />
              <span>Buy All Again</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {itemsList.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#f8fafc',
                  border: '1px solid var(--color-border)',
                  borderRadius: '14px',
                  padding: '14px'
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '8px', background: '#ffffff', padding: '4px' }}
                  />
                ) : (
                  <div style={{ width: '56px', height: '56px', borderRadius: '8px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={24} color="var(--color-apple-blue)" />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-carbon)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Qty: {item.quantity} · {item.color || 'Standard'}
                  </div>
                  {item.price && (
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-apple-blue)', marginTop: '2px' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    playAppleSound('add_to_bag');
                    alert(`Added 1x ${item.name} to your Bag!`);
                  }}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'var(--color-carbon)'
                  }}
                >
                  Reorder
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Help & Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Guaranteed Next-Day Express Delivery with QuickFlow Protect SLA</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                playAppleSound('toggle');
                setIsActivityDrawerOpen(true);
              }}
              className="btn-ghost"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              <Activity size={13} color="var(--color-apple-blue)" />
              <span>Full Event Log</span>
            </button>

            <button
              onClick={() => {
                playAppleSound('click');
                if (onShopMore) onShopMore();
              }}
              className="btn-quickflow"
              style={{ fontSize: '12px', padding: '6px 16px' }}
            >
              <span>Continue Shopping</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. LIVE ORDER ACTIVITY DRAWER */}
      <ActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
        activeStageIndex={activeStageIndex}
        orderId={currentOrder?.id || 'QF-10482'}
      />
    </div>
  );
}
