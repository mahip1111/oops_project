import React, { useState, useEffect } from 'react';
import QuickflowNavbar from './components/Navbar/QuickflowNavbar';
import HeroBannerCarousel from './components/Hero/HeroBannerCarousel';
import FlashDealsCarousel from './components/UI/FlashDealsCarousel';
import FeaturesBar from './components/UI/FeaturesBar';
import ProductGrid from './components/Catalog/ProductGrid';
import MidBanner from './components/UI/MidBanner';
import ReviewsCarousel from './components/UI/ReviewsCarousel';
import ProductDetailModal from './components/Modals/ProductDetailModal';
import DeviceCompareModal from './components/Modals/DeviceCompareModal';
import CartDrawer from './components/Cart/CartDrawer';
import WishlistDrawer from './components/UI/WishlistDrawer';
import TradeInModal from './components/UI/TradeInModal';
import SuperCoinsZoneModal from './components/UI/SuperCoinsZoneModal';
import LocationModal from './components/UI/LocationModal';
import CheckoutModal from './components/Checkout/CheckoutModal';
import OrderPlacedAnimationModal from './components/Checkout/OrderPlacedAnimationModal';
import OrderTrackingView from './components/Tracking/OrderTrackingView';
import AccountView from './components/Account/AccountView';
import SpecialistChatWidget from './components/UI/SpecialistChatWidget';
import QuickflowFooter from './components/Footer/QuickflowFooter';

import { PRODUCTS } from './data/quickflowProducts';
import { INITIAL_CUSTOMER_ORDERS } from './data/customerOrders';
import { StoreApiService } from './services/storeApi';
import { playAppleSound } from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState('shop'); // 'shop' | 'collections' | 'track' | 'account'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Bhubaneswar');

  // Modals & Drawers States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);
  const [isSuperCoinsOpen, setIsSuperCoinsOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderPlacedModalOpen, setIsOrderPlacedModalOpen] = useState(false);

  const [discountInfo, setDiscountInfo] = useState({ discountAmount: 0, appliedCoupon: null });
  const [placedOrder, setPlacedOrder] = useState(null);

  // Cart State with Local Storage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('quickflow_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 'lap-mbp-14',
          cartKey: 'lap-mbp-14-Space Black',
          name: 'MacBook Pro',
          price: 1499,
          priceInrRaw: 149900,
          quantity: 1,
          selectedColor: { name: 'Space Black', hex: '#1e1e24' },
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 'ms-magic',
          cartKey: 'ms-magic-White',
          name: 'Magic Mouse',
          price: 79,
          priceInrRaw: 7900,
          quantity: 1,
          selectedColor: { name: 'White', hex: '#fafafa' },
          image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80'
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('quickflow_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Orders State
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('quickflow_orders');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_ORDERS;
    } catch (e) {
      return INITIAL_CUSTOMER_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('quickflow_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('quickflow_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('quickflow_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  // Add to Cart with Audio
  const handleAddToCart = (product, color, qty = 1) => {
    const selectedColor = color || product.colors?.[0] || { name: 'Space Black', hex: '#1e1e24' };
    const cartKey = `${product.id}-${selectedColor.name}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          cartKey,
          name: product.name,
          price: product.price,
          priceInrRaw: product.priceInrRaw,
          quantity: qty,
          selectedColor,
          image: product.image
        }
      ];
    });

    setIsCartOpen(true);
  };

  // Move from Wishlist to Cart
  const handleMoveWishlistToCart = (prod) => {
    handleAddToCart(prod);
    setWishlist(prev => prev.filter(w => w.id !== prod.id));
  };

  const handleRemoveFromWishlist = (id) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
  };

  // Fast Buy Action
  const handleBuyNow = (product, color, qty = 1) => {
    handleAddToCart(product, color, qty);
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (cartKey, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(cartKey);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartKey === cartKey ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (cartKey) => {
    setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  // Open Checkout Modal
  const handleProceedToCheckout = ({ discountAmount, appliedCoupon } = {}) => {
    setDiscountInfo({ discountAmount: discountAmount || 0, appliedCoupon: appliedCoupon || null });
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Apply Trade-In Credit
  const handleApplyTradeInCredit = (amount) => {
    setDiscountInfo({
      discountAmount: amount,
      appliedCoupon: { code: 'TRADE_IN', label: `₹${amount.toLocaleString('en-IN')} Trade-In Credit` }
    });
    setIsCartOpen(true);
  };

  // Complete Order from Checkout Modal
  const handleCompleteOrder = async (orderPayload) => {
    try {
      const apiRes = await StoreApiService.submitOrder(orderPayload);
      if (apiRes && apiRes.orderId) {
        orderPayload.id = apiRes.orderId;
      }
    } catch (err) {
      console.error('Failed to submit order to API', err);
    }
    setOrders((prev) => [orderPayload, ...prev]);
    setPlacedOrder(orderPayload);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsOrderPlacedModalOpen(true);
  };

  const handleProceedToTrackingFromAnimation = () => {
    setIsOrderPlacedModalOpen(false);
    setCurrentView('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Header: QUICKFLOW | Store | Mac & Audio | Track Order | Account */}
      <QuickflowNavbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        products={PRODUCTS}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        deliveryCity={deliveryCity}
        onOpenLocationModal={() => setIsLocationOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {/* STORE & COLLECTIONS VIEW */}
        {(currentView === 'shop' || currentView === 'collections') && (
          <>
            {/* 1. Interactive Multi-Slide Hero Banner Carousel */}
            <HeroBannerCarousel
              products={PRODUCTS}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              onAddToCart={(prod) => handleAddToCart(prod)}
            />

            {/* 2. Flash Deals Countdown Carousel */}
            <FlashDealsCarousel
              products={PRODUCTS}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              onAddToCart={(prod) => handleAddToCart(prod)}
            />

            {/* 3. Quality Guarantees & Triggers Bar */}
            <div style={{ marginTop: '36px' }}>
              <FeaturesBar
                onOpenTradeIn={() => setIsTradeInOpen(true)}
                onOpenSuperCoins={() => setIsSuperCoinsOpen(true)}
              />
            </div>

            {/* 4. Compare Models Floating Trigger Strip */}
            <div style={{ maxWidth: '1280px', margin: '0 auto 20px', padding: '0 32px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  playAppleSound('pop');
                  setIsCompareOpen(true);
                }}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: 'var(--color-apple-blue)',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                ⚖️ Compare Apple & QuickFlow Specs
              </button>
            </div>

            {/* 5. Main Catalog Grid */}
            <ProductGrid
              products={PRODUCTS}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSelectProduct={(prod) => setSelectedProduct(prod)}
              onAddToCart={(prod) => handleAddToCart(prod)}
            />

            {/* 6. Mid-Banner Routing & Silicon Innovation Showcase */}
            <MidBanner
              onShopClick={() => {
                const el = document.getElementById('categories');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onTradeInClick={() => setIsTradeInOpen(true)}
            />

            {/* 7. Verified Customer Reviews Carousel */}
            <ReviewsCarousel />
          </>
        )}

        {/* TRACK ORDER VIEW */}
        {currentView === 'track' && (
          <OrderTrackingView
            orders={orders}
            onShopMore={() => {
              playAppleSound('click');
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ACCOUNT VIEW */}
        {currentView === 'account' && (
          <AccountView
            orders={orders}
            onTrackOrder={(id) => {
              playAppleSound('click');
              setCurrentView('track');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleProceedToCheckout}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveWishlistToCart}
      />

      {/* Device Side-by-Side Compare Modal */}
      <DeviceCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={PRODUCTS}
      />

      {/* Trade-In Calculator Modal */}
      <TradeInModal
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
        onApplyCredit={handleApplyTradeInCredit}
      />

      {/* SuperCoins Rewards Modal */}
      <SuperCoinsZoneModal
        isOpen={isSuperCoinsOpen}
        onClose={() => setIsSuperCoinsOpen(false)}
        onApplyDiscountCoupon={(code) => {
          setIsSuperCoinsOpen(false);
          setIsCartOpen(true);
        }}
      />

      {/* Location / PIN Code Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentCity={deliveryCity}
        onSelectCity={(city) => setDeliveryCity(city)}
      />

      {/* Checkout Modal with Address & Speed Priority */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        discountInfo={discountInfo}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Order Placed Processing Animation Flow Modal (Customer App -> Node API -> C++ Engine) */}
      <OrderPlacedAnimationModal
        isOpen={isOrderPlacedModalOpen}
        orderData={placedOrder}
        onProceedToTracking={handleProceedToTrackingFromAnimation}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* Floating 24/7 AI Specialist Assistant */}
      <SpecialistChatWidget
        onNavigateView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <QuickflowFooter
        setCurrentView={setCurrentView}
        setSelectedCategory={setSelectedCategory}
      />
    </div>
  );
}
