import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';

type StorageRow = { value: string };

export type TailorTableRecord = {
  id: string;
  phone: string;
  pin: string;
  shop: { name: string; ownerName: string; phone: string; address: string; city: string };
  createdAt: string;
};

export type TailorBusinessData = {
  customers: Array<{ id: string; name: string; phone: string; area?: string; initials: string; orderCount: number; balance: number; lastOrder?: string }>;
  orders: Array<{ id: string; orderNumber: string; customerId: string; customerName: string; garment: string; quantity: number; status: string; total: number; paidAmount: number; balance: number; deliveryDate: string; deliveryTime: string }>;
  customerMeasurements: Record<string, Record<string, string>>;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('tailorflow.db').then(async (database) => {
      await database.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS app_storage (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS tailors (
          id TEXT PRIMARY KEY NOT NULL,
          phone TEXT NOT NULL UNIQUE,
          pin TEXT NOT NULL,
          shop_name TEXT NOT NULL,
          owner_name TEXT NOT NULL,
          shop_phone TEXT NOT NULL,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS customers (
          id TEXT PRIMARY KEY NOT NULL,
          tailor_id TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT NOT NULL,
          area TEXT,
          initials TEXT NOT NULL,
          order_count INTEGER NOT NULL DEFAULT 0,
          balance REAL NOT NULL DEFAULT 0,
          last_order TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_customers_tailor_id ON customers(tailor_id);
        CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY NOT NULL,
          tailor_id TEXT NOT NULL,
          order_number TEXT NOT NULL,
          customer_id TEXT NOT NULL,
          customer_name TEXT NOT NULL,
          garment TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          status TEXT NOT NULL,
          total REAL NOT NULL,
          paid_amount REAL NOT NULL,
          balance REAL NOT NULL,
          delivery_date TEXT NOT NULL,
          delivery_time TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_orders_tailor_id ON orders(tailor_id);
        CREATE TABLE IF NOT EXISTS measurements (
          tailor_id TEXT NOT NULL,
          customer_id TEXT NOT NULL,
          values_json TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          PRIMARY KEY (tailor_id, customer_id)
        );
        CREATE TABLE IF NOT EXISTS payments (
          order_id TEXT PRIMARY KEY NOT NULL,
          tailor_id TEXT NOT NULL,
          customer_id TEXT NOT NULL,
          paid_amount REAL NOT NULL,
          balance REAL NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_payments_tailor_id ON payments(tailor_id);
      `);
      return database;
    });
  }
  return databasePromise;
}

/**
 * Persistence adapter for Zustand. Native records live in a local SQLite file;
 * existing SecureStore records are imported on their first read after upgrade.
 */
export const sqliteStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
    }

    const database = await getDatabase();
    const row = await database.getFirstAsync<StorageRow>(
      'SELECT value FROM app_storage WHERE key = ?',
      key
    );
    if (row?.value) return row.value;

    // One-time migration from the previous SecureStore-based implementation.
    const legacyValue = await SecureStore.getItemAsync(key);
    if (legacyValue !== null) {
      await sqliteStorage.setItem(key, legacyValue);
    }
    return legacyValue;
  },

  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
      return;
    }

    const database = await getDatabase();
    await database.runAsync(
      `INSERT INTO app_storage (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      key,
      value,
      new Date().toISOString()
    );
  },

  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
      return;
    }

    const database = await getDatabase();
    await database.runAsync('DELETE FROM app_storage WHERE key = ?', key);
  },
};

let tableSyncQueue = Promise.resolve();

function enqueueTableSync(work: () => Promise<void>) {
  tableSyncQueue = tableSyncQueue.then(work).catch((error) => {
    console.warn('SQLite table sync failed', error);
  });
  return tableSyncQueue;
}

/** Keeps inspectable relational SQLite tables aligned with the app's local state. */
export function syncTailorTables(accounts: TailorTableRecord[]) {
  return enqueueTableSync(async () => {
    if (Platform.OS === 'web') return;
    const database = await getDatabase();
    await database.execAsync('DELETE FROM tailors;');
    for (const account of accounts) {
      await database.runAsync(
        `INSERT INTO tailors (id, phone, pin, shop_name, owner_name, shop_phone, address, city, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        account.id, account.phone, account.pin, account.shop.name, account.shop.ownerName,
        account.shop.phone, account.shop.address, account.shop.city, account.createdAt
      );
    }
  });
}

export function syncBusinessTables(dataByTailor: Record<string, TailorBusinessData>) {
  return enqueueTableSync(async () => {
    if (Platform.OS === 'web') return;
    const database = await getDatabase();
    await database.execAsync('DELETE FROM customers; DELETE FROM orders; DELETE FROM measurements; DELETE FROM payments;');
    const updatedAt = new Date().toISOString();
    for (const [tailorId, data] of Object.entries(dataByTailor)) {
      for (const customer of data.customers) {
        await database.runAsync(
          `INSERT INTO customers (id, tailor_id, name, phone, area, initials, order_count, balance, last_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          customer.id, tailorId, customer.name, customer.phone, customer.area ?? null,
          customer.initials, customer.orderCount, customer.balance, customer.lastOrder ?? null
        );
      }
      for (const order of data.orders) {
        await database.runAsync(
          `INSERT INTO orders (id, tailor_id, order_number, customer_id, customer_name, garment, quantity, status, total, paid_amount, balance, delivery_date, delivery_time)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          order.id, tailorId, order.orderNumber, order.customerId, order.customerName,
          order.garment, order.quantity, order.status, order.total, order.paidAmount,
          order.balance, order.deliveryDate, order.deliveryTime
        );
        await database.runAsync(
          `INSERT INTO payments (order_id, tailor_id, customer_id, paid_amount, balance, updated_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
          order.id, tailorId, order.customerId, order.paidAmount, order.balance, updatedAt
        );
      }
      for (const [customerId, values] of Object.entries(data.customerMeasurements)) {
        await database.runAsync(
          'INSERT INTO measurements (tailor_id, customer_id, values_json, updated_at) VALUES (?, ?, ?, ?)',
          tailorId, customerId, JSON.stringify(values), updatedAt
        );
      }
    }
  });
}
