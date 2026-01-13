
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AppState, Service, Product, Booking, FinancialRecord } from '../types';
import { INITIAL_SERVICES, INITIAL_PRODUCTS } from '../constants';

interface StoreContextType extends AppState {
  login: (email: string, role: 'cliente' | 'admin') => void;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  cancelBooking: (id: string, isLate: boolean) => void;
  payRemainingBalance: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateSettings: (newSettings: Partial<AppState['settings']>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [financials, setFinancials] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('financials');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppState['settings']>(() => {
    const saved = localStorage.getItem('admin_settings');
    return saved ? JSON.parse(saved) : {
      cancellationFeePercent: 50,
      advancePaymentMinPercent: 50,
      cancellationNoticeHours: 1
    };
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
    localStorage.setItem('services', JSON.stringify(services));
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('financials', JSON.stringify(financials));
    localStorage.setItem('admin_settings', JSON.stringify(settings));
  }, [currentUser, services, products, bookings, financials, settings]);

  const login = (email: string, role: 'cliente' | 'admin') => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role,
      fidelityPoints: 5,
    };
    setCurrentUser(newUser);
  };

  const logout = () => setCurrentUser(null);

  const addBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking = { ...booking, id: Date.now().toString() };
    setBookings(prev => [...prev, newBooking]);
    
    if (booking.amountPaid > 0) {
      addFinancialRecord({
        date: booking.date,
        type: 'income',
        category: 'Pagamento Antecipado',
        amount: booking.amountPaid,
        description: `Ref. ${booking.serviceName} - Cliente: ${booking.userName}`
      });
    }
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      
      const old = prev.find(b => b.id === id);
      if (old && updates.status === 'completed' && old.amountRemaining > 0) {
        // If completing, we assume balance is paid if not already full
        if (old.paymentStatus !== 'full') {
           addFinancialRecord({
            date: new Date().toISOString().split('T')[0],
            type: 'income',
            category: 'Serviço Concluído (Saldo)',
            amount: old.amountRemaining,
            description: `Pagamento Final Ref. ${old.serviceName}`
          });
          return prev.map(b => b.id === id ? { ...b, ...updates, paymentStatus: 'full', amountPaid: b.totalPrice, amountRemaining: 0 } : b);
        }
      }
      return updated;
    });
  };

  const payRemainingBalance = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking || booking.amountRemaining <= 0) return;

    addFinancialRecord({
      date: new Date().toISOString().split('T')[0],
      type: 'income',
      category: 'Pagamento Saldo (Local)',
      amount: booking.amountRemaining,
      description: `Pagamento Restante Ref. ${booking.serviceName} - Cliente: ${booking.userName}`
    });

    setBookings(prev => prev.map(b => b.id === id ? { 
      ...b, 
      paymentStatus: 'full', 
      amountPaid: b.totalPrice, 
      amountRemaining: 0 
    } : b));
  };

  const cancelBooking = (id: string, isLate: boolean) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    let feeApplied = 0;
    if (isLate) {
      feeApplied = booking.totalPrice * (settings.cancellationFeePercent / 100);
      
      addFinancialRecord({
        date: new Date().toISOString().split('T')[0],
        type: 'fee',
        category: 'Taxa de Cancelamento',
        amount: feeApplied,
        description: `Cancelamento tardio: ${booking.userName} - ${booking.serviceName}`
      });
    }

    updateBooking(id, { 
      status: 'cancelled', 
      paymentStatus: isLate ? booking.paymentStatus : 'none',
      amountPaid: isLate ? Math.max(booking.amountPaid, feeApplied) : 0 
    });
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
  };

  const addFinancialRecord = (record: Omit<FinancialRecord, 'id'>) => {
    setFinancials(prev => [...prev, { ...record, id: Date.now().toString() }]);
  };

  const addService = (service: Omit<Service, 'id'>) => {
    setServices(prev => [...prev, { ...service, id: Date.now().toString() }]);
  };

  const updateSettings = (newSettings: Partial<AppState['settings']>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <StoreContext.Provider value={{ 
      currentUser, services, products, bookings, financials, settings,
      login, logout, addBooking, updateBooking, cancelBooking, payRemainingBalance, updateProductStock, addFinancialRecord, addService, updateSettings
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
