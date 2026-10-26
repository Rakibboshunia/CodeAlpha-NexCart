import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';

const AppContent = () => {
  // Protected Route — must be inside AuthProvider
  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // Auth Route — redirect if already logged in
  const AuthRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return !isAuthenticated ? children : <Navigate to="/" replace />;
  };

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />

            {/* Auth Routes */}
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

            {/* Protected Routes */}
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />

            {/* 404 Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e1e2e',
              color: '#f0f0ff',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '0.875rem',
            },
            success: {
              iconTheme: { primary: '#43e97b', secondary: '#1e1e2e' },
            },
            error: {
              iconTheme: { primary: '#FF6584', secondary: '#1e1e2e' },
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
