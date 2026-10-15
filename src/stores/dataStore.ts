import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Customer, Order, OrderStatus } from '@/types/domain';
import { customers as initialCustomers, orders as initialOrders } from '@/constants/data';
import { sqliteStorage, syncBusinessTables } from '@/services/storage/sqliteStorage';

export interface DataState {
  customers: Customer[];
  orders: Order[];
  customerMeasurements: Record<string, Record<string, string>>;
  activeTailorId?: string;
  tailorData: Record<string, TailorData>;
  switchTailor: (tailorId: string) => void;

  // Customer Actions
  addCustomer: (data: {
    name: string;
    phone: string;
    area?: string;
    measurements?: Record<string, string>;
  }) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;

  // Order Actions
  addOrder: (data: {
    customerId: string;
    customerName: string;
    garment: string;
    quantity: number;
    total: number;
    paidAmount: number;
    deliveryDate: string;
    deliveryTime?: string;
    status?: OrderStatus;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrderPayment: (orderId: string, paidAmount: number) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (id: string) => Order | undefined;

  // Measurement Actions
  saveMeasurements: (customerId: string, measurements: Record<string, string>) => void;
  getMeasurements: (customerId: string) => Record<string, string>;

  // Data Management
  resetToSampleData: () => void;
  clearAllData: () => void;
}

export interface TailorData {
  customers: Customer[];
  orders: Order[];
  customerMeasurements: Record<string, Record<string, string>>;
}

const emptyTailorData = (): TailorData => ({
  customers: [],
  orders: [],
  customerMeasurements: {},
});

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      customers: initialCustomers,
      orders: initialOrders,
      customerMeasurements: {
        '1': {
          'Length': '40.5',
          'Shoulder': '17.5',
          'Chest': '22.0',
          'Sleeves': '23.5',
          'Collar': '15.5',
          'Daman': '23.0',
          'Shalwar Length': '38.0',
          'Pancha': '8.5',
        },
      },
      activeTailorId: undefined,
      tailorData: {},
      switchTailor: (tailorId) =>
        set((state) => {
          const savedData = state.activeTailorId
            ? {
                ...state.tailorData,
                [state.activeTailorId]: {
                  customers: state.customers,
                  orders: state.orders,
                  customerMeasurements: state.customerMeasurements,
                },
              }
            : state.tailorData;
          const nextData = savedData[tailorId] || emptyTailorData();
          return {
            activeTailorId: tailorId,
            tailorData: savedData,
            customers: nextData.customers,
            orders: nextData.orders,
            customerMeasurements: nextData.customerMeasurements,
          };
        }),

      addCustomer: (data) => {
        const initials = data.name
          .split(' ')
          .map((n) => n[0])
          .filter(Boolean)
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'CU';

        const newCustomer: Customer = {
          id: `cust-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: data.name.trim(),
          phone: data.phone.trim(),
          area: data.area?.trim() || 'Lahore',
          initials,
          orderCount: 0,
          balance: 0,
        };

        set((state) => ({
          customers: [newCustomer, ...state.customers],
          customerMeasurements: data.measurements
            ? {
              ...state.customerMeasurements,
              [newCustomer.id]: data.measurements,
            }
            : state.customerMeasurements,
        }));

        return newCustomer;
      },

      updateCustomer: (id, data) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        })),

      getCustomerById: (id) => {
        return get().customers.find((c) => c.id === id);
      },

      addOrder: (data) => {
        const orderNumber = `TF-${Math.floor(1000 + Math.random() * 9000)}`;
        const total = Number(data.total) || 0;
        const paidAmount = Number(data.paidAmount) || 0;
        const balance = Math.max(0, total - paidAmount);

        const newOrder: Order = {
          id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          orderNumber,
          customerId: data.customerId,
          customerName: data.customerName,
          garment: data.garment,
          quantity: data.quantity,
          status: data.status || 'received',
          total,
          paidAmount,
          balance,
          deliveryDate: data.deliveryDate || '3 Days',
          deliveryTime: data.deliveryTime || '5:00 PM',
        };

        set((state) => {
          // Update customer order count & balance
          const updatedCustomers = state.customers.map((c) => {
            if (c.id === data.customerId) {
              return {
                ...c,
                orderCount: (c.orderCount || 0) + 1,
                balance: (c.balance || 0) + balance,
                lastOrder: `${data.quantity} ${data.garment}`,
              };
            }
            return c;
          });

          return {
            orders: [newOrder, ...state.orders],
            customers: updatedCustomers,
          };
        });

        return newOrder;
      },

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        })),

      updateOrderPayment: (orderId, paidAmount) =>
        set((state) => {
          let customerIdToUpdate = '';
          let balanceDiff = 0;

          const updatedOrders = state.orders.map((o) => {
            if (o.id === orderId) {
              customerIdToUpdate = o.customerId;
              const newPaid = Math.min(o.total, paidAmount);
              const newBalance = Math.max(0, o.total - newPaid);
              balanceDiff = newBalance - o.balance;
              return {
                ...o,
                paidAmount: newPaid,
                balance: newBalance,
              };
            }
            return o;
          });

          const updatedCustomers = state.customers.map((c) => {
            if (c.id === customerIdToUpdate) {
              return {
                ...c,
                balance: Math.max(0, (c.balance || 0) + balanceDiff),
              };
            }
            return c;
          });

          return {
            orders: updatedOrders,
            customers: updatedCustomers,
          };
        }),

      deleteOrder: (orderId) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== orderId),
        })),

      getOrderById: (id) => {
        return get().orders.find((o) => o.id === id || o.orderNumber === id);
      },

      saveMeasurements: (customerId, measurements) =>
        set((state) => ({
          customerMeasurements: {
            ...state.customerMeasurements,
            [customerId]: measurements,
          },
        })),

      getMeasurements: (customerId) => {
        return get().customerMeasurements[customerId] || {};
      },

      resetToSampleData: () =>
        set({
          customers: initialCustomers,
          orders: initialOrders,
        }),

      clearAllData: () =>
        set({
          customers: [],
          orders: [],
          customerMeasurements: {},
        }),
    }),
    {
      name: 'tailorflow-offline-data',
      storage: createJSONStorage(() => sqliteStorage),
    }
  )
);

const syncDataToTables = () => {
  const state = useDataStore.getState();
  const dataByTailor = { ...state.tailorData };
  if (state.activeTailorId) {
    dataByTailor[state.activeTailorId] = {
      customers: state.customers,
      orders: state.orders,
      customerMeasurements: state.customerMeasurements,
    };
  }
  void syncBusinessTables(dataByTailor);
};

useDataStore.subscribe(syncDataToTables);
useDataStore.persist.onFinishHydration(syncDataToTables);
