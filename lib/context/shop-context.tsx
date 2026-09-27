'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Order, CartItem, OrderStatus } from '@/types/shop';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from '@/lib/mock-data';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  cart: CartItem[];
  isAdminLoggedIn: boolean;
  searchQuery: string;
  selectedCategory: string | null;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; deliveryFee: number; total: number; itemCount: number };
  
  // Customer Actions
  placeOrder: (customerInfo: { customer_name: string; phone: string; address: string; note?: string }) => Order;
  
  // Admin Actions
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'created_at' | 'updated_at'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'slug'>) => Category;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'stationery_shop_products_v1',
  CATEGORIES: 'stationery_shop_categories_v1',
  ORDERS: 'stationery_shop_orders_v1',
  CART: 'stationery_shop_cart_v1',
  ADMIN_AUTH: 'stationery_shop_admin_auth_v1',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedAdminAuth = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      if (savedAdminAuth === 'true') setIsAdminLoggedIn(true);
    } catch (e) {
      console.error('Failed to load storage state:', e);
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {}
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const maxAllowed = item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxAllowed) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryFee = cart.length > 0 ? 2000 : 0;
    const total = subtotal + deliveryFee;
    return { subtotal, deliveryFee, total, itemCount };
  };

  // Customer Place Order
  const placeOrder = (customerInfo: { customer_name: string; phone: string; address: string; note?: string }): Order => {
    const { subtotal, deliveryFee, total } = getCartTotal();
    const orderNumber = `ST-${10000 + orders.length + 1}`;
    const orderId = `ord-${Date.now()}`;

    const newOrderItems = cart.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      order_id: orderId,
      product_id: item.product.id,
      product_name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image_url: item.product.image_url,
    }));

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_name: customerInfo.customer_name,
      phone: customerInfo.phone,
      address: customerInfo.address,
      note: customerInfo.note || '',
      subtotal,
      delivery_fee: deliveryFee,
      total,
      status: 'Pending',
      created_at: new Date().toISOString(),
      items: newOrderItems,
    };

    // Decrease product stock automatically according to PRD section 19
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const cartItem = cart.find((item) => item.product.id === prod.id);
        if (cartItem) {
          return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
        }
        return prod;
      })
    );

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    clearCart();
    return newOrder;
  };

  // Admin Authentication
  const loginAdmin = (password: string) => {
    // Default admin demo pass key or any non-empty demo password
    if (password === 'admin' || password === 'admin123' || password === 'stationery') {
      setIsAdminLoggedIn(true);
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  // Product CRUD
  const addProduct = (data: Omit<Product, 'id' | 'slug' | 'created_at' | 'updated_at'>): Product => {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      slug,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === id
          ? { ...prod, ...updates, updated_at: new Date().toISOString() }
          : prod
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== id));
  };

  // Category CRUD
  const addCategory = (data: Omit<Category, 'id' | 'slug'>): Category => {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      slug,
      item_count: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  // Order Management
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        orders,
        cart,
        isAdminLoggedIn,
        searchQuery,
        selectedCategory,
        setSearchQuery,
        setSelectedCategory,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        placeOrder,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateOrderStatus,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
