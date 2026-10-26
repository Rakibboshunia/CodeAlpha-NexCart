import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('nexcart_cart');
    return stored ? JSON.parse(stored) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('nexcart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        const newQty = exists.quantity + quantity;
        if (newQty > product.stock) {
          toast.error(`Only ${product.stock} items available`);
          return prev;
        }
        toast.success('Cart updated!');
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        toast.success(`${product.name.substring(0, 20)}... added to cart!`);
        return [...prev, { ...product, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('nexcart_cart');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = cartSubtotal > 100 ? 0 : 9.99;
  const taxPrice = Number((cartSubtotal * 0.1).toFixed(2));
  const cartTotal = Number((cartSubtotal + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        shippingPrice,
        taxPrice,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
