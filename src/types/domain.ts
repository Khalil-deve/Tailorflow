export type OrderStatus = 'received' | 'cutting' | 'stitching' | 'finishing' | 'ready' | 'delivered' | 'cancelled';
export type GarmentType = 'shalwarKameez' | 'shirt' | 'pant' | 'waistcoat' | 'suit' | 'other';
export interface Customer { id: string; name: string; phone: string; area?: string; initials: string; orderCount: number; balance: number; lastOrder?: string; }
export interface Measurement { id: string; customerId: string; garmentType: GarmentType; version: number; unit: 'inch' | 'cm'; values: Record<string, number>; createdAt: string; }
export interface Order { id: string; orderNumber: string; customerId: string; customerName: string; garment: string; quantity: number; status: OrderStatus; total: number; paidAmount: number; balance: number; deliveryDate: string; deliveryTime: string; }
