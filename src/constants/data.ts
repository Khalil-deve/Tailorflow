import type { Customer, Order } from '@/types/domain';

export const customers: Customer[] = [
  { id: '1', name: 'Ali Khan', phone: '0300 1234567', initials: 'AK', orderCount: 4, balance: 0, lastOrder: '2 Shalwar Kameez' },
  { id: '2', name: 'Muhammad Khalil', phone: '0321 7654321', initials: 'MK', orderCount: 8, balance: 2500, lastOrder: '1 Waistcoat' },
  { id: '3', name: 'Usman Raza', phone: '0333 9876543', initials: 'UR', orderCount: 3, balance: 1200, lastOrder: '1 Suit' },
  { id: '4', name: 'Hamza Ahmed', phone: '0345 2233445', initials: 'HA', orderCount: 6, balance: 0, lastOrder: '3 Shirts' },
];
export const orders: Order[] = [
  { id: '1042', orderNumber: 'TF-1042', customerId: '1', customerName: 'Ali Khan', garment: 'Shalwar Kameez', quantity: 2, status: 'ready', total: 6000, paidAmount: 6000, balance: 0, deliveryDate: 'Today', deliveryTime: '5:00 PM' },
  { id: '1043', orderNumber: 'TF-1043', customerId: '2', customerName: 'Muhammad Khalil', garment: 'Waistcoat', quantity: 1, status: 'stitching', total: 5000, paidAmount: 2500, balance: 2500, deliveryDate: 'Today', deliveryTime: '7:00 PM' },
  { id: '1044', orderNumber: 'TF-1044', customerId: '3', customerName: 'Usman Raza', garment: 'Suit', quantity: 1, status: 'cutting', total: 12000, paidAmount: 5000, balance: 7000, deliveryDate: 'Tomorrow', deliveryTime: '2:00 PM' },
];
export const garments = ['Shalwar Kameez', 'Shirt', 'Pant', 'Waistcoat', 'Suit', 'Other'];
