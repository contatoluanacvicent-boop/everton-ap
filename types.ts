
export type UserRole = 'cliente' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  fidelityPoints: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
  category: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  paymentStatus: 'none' | 'partial' | 'full';
  totalPrice: number;
  amountPaid: number;
  amountRemaining: number;
}

export interface FinancialRecord {
  id: string;
  date: string;
  type: 'income' | 'expense' | 'fee';
  category: string;
  amount: number;
  description: string;
}

export interface AppState {
  currentUser: User | null;
  services: Service[];
  products: Product[];
  bookings: Booking[];
  financials: FinancialRecord[];
  settings: {
    cancellationFeePercent: number;
    advancePaymentMinPercent: number;
    cancellationNoticeHours: number;
  };
}
