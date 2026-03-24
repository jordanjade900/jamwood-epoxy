import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import Process from './components/Process';
import Gallery from './components/Gallery';
import About from './components/About';
import Contact from './components/Contact';
import AdminOrders from './components/AdminOrders';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import FAQ from './components/FAQ';
import { FirebaseProvider, useAuth } from './components/FirebaseProvider';
import ErrorBoundary from './components/ErrorBoundary';
import { CartItem } from './types';
import { PRODUCTS } from './constants';

export type PageId = 'home' | 'about' | 'process' | 'gallery' | 'contact' | 'product-details' | 'checkout' | 'orders';

// Utility for Analytics Event Tracking
const trackEvent = (action: string, category: string, label: string) => {
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  }
};

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, loading } = useAuth();

  const isAdmin = useMemo(() => {
    return user?.email === 'jordanjade900@gmail.com';
  }, [user]);

  // Dynamic SEO Title & GA Page View Tracking
  useEffect(() => {
    const baseTitle = "Jamwood Epoxy";
    let subTitle = "Elegance Sealed In Every Grain";

    switch (currentPage) {
      case 'gallery': subTitle = "Our Collection | Handcrafted Furniture"; break;
      case 'about': subTitle = "About Us | Sustainable Sourcing"; break;
      case 'process': subTitle = "Our Process | Tree to Treasure"; break;
      case 'contact': subTitle = "Contact Us | Start Your Project"; break;
      case 'checkout': subTitle = "Secure Checkout"; break;
      case 'orders': subTitle = "Admin | Order Management"; break;
      case 'product-details': 
        const product = PRODUCTS.find(p => p.id === currentProductId);
        if (product) subTitle = `${product.name} | Artisan Collection`;
        break;
      default: subTitle = "Elegance Sealed In Every Grain";
    }

    const fullTitle = `${baseTitle} | ${subTitle}`;
    document.title = fullTitle;

    // Trigger GA Page View
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('config', 'G-372VN4B2CN', {
        'page_title': fullTitle,
        'page_path': `/${currentPage}${currentProductId ? '/' + currentProductId : ''}`
      });
    }
  }, [currentPage, currentProductId]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page: PageId, productId?: string) => {
    if (productId) {
      setCurrentProductId(productId);
      const product = PRODUCTS.find(p => p.id === productId);
      trackEvent('view_item', 'Product', product?.name || productId);
    } else {
      trackEvent('navigate', 'Internal Navigation', page);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsCartOpen(false);
  };

  const addToCart = (item: CartItem) => {
    trackEvent('add_to_cart', 'E-commerce', item.name);
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId && i.size === item.size);
      if (existing) {
        return prev.map(i => 
          (i.productId === item.productId && i.size === item.size) 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const updateCartQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    trackEvent('purchase_complete', 'E-commerce', 'Order Placed');
    setCart([]);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }}>
            <Hero onNavigate={navigateTo} />
            <FAQ onNavigate={navigateTo} />
          </motion.div>
        );
      case 'about':
        return (
          <motion.div key="about" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="pt-40 pb-20 px-4 md:px-0 min-h-screen">
            <About />
          </motion.div>
        );
      case 'process':
        return (
          <motion.div key="process" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="pt-40 pb-20 min-h-screen">
            <Process />
          </motion.div>
        );
      case 'gallery':
        return (
          <motion.div key="gallery" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="pt-40 pb-20 min-h-screen">
            <Gallery onNavigate={navigateTo} />
          </motion.div>
        );
      case 'product-details':
        return (
          <motion.div key="product-details" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="pt-40 pb-20 min-h-screen">
            <ProductDetails 
              productId={currentProductId} 
              onNavigate={navigateTo} 
              onAddToCart={addToCart} 
            />
          </motion.div>
        );
      case 'checkout':
        return (
          <motion.div key="checkout" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="pt-40 pb-20 min-h-screen">
            <Checkout cart={cart} onClearCart={clearCart} onNavigate={navigateTo} />
          </motion.div>
        );
      case 'contact':
        return (
          <motion.div key="contact" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="pt-40 pb-20 min-h-screen">
            <Contact />
          </motion.div>
        );
      case 'orders':
        if (!isAdmin) {
          navigateTo('home');
          return null;
        }
        return (
          <motion.div key="orders" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.5 }} className="pt-40 pb-20 min-h-screen">
            <AdminOrders />
          </motion.div>
        );
      default:
        return <Hero onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col selection:bg-[#22d3ee] selection:text-black">
      <Navbar 
        isScrolled={isScrolled} 
        currentPage={currentPage} 
        onNavigate={navigateTo} 
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        isAdmin={isAdmin}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>
      </main>

      <Footer />
      
      {/* Sidebar Shopping Cart */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={removeFromCart} 
        onUpdateQuantity={updateCartQuantity}
        onNavigate={navigateTo}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </ErrorBoundary>
  );
};

export default App;
