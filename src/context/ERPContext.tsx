import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Invoice, InventoryItem, ExpenseItem } from '../types';

interface ERPContextType {
  invoices: Invoice[];
  inventory: InventoryItem[];
  expenses: ExpenseItem[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  setExpenses: React.Dispatch<React.SetStateAction<ExpenseItem[]>>;
}

export const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  return (
    <ERPContext.Provider value={{
      invoices, setInvoices,
      inventory, setInventory,
      expenses, setExpenses
    }}>
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) throw new Error('useERP must be used within an ERPProvider');
  return context;
};
