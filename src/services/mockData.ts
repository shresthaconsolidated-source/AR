import { Invoice, Customer, AppData, FinancialEntry } from "../types";

export const MOCK_DATA: AppData = {
  invoices: [
    {
      invoiceId: "INV-001",
      customerId: "C-001",
      companyName: "Everest Education Consulting",
      invoiceNumber: "INV-2026-001",
      invoiceDate: "2026-01-05",
      dueDate: "2026-01-20",
      invoiceAmount: 120000,
      amountPaid: 0,
      outstandingAmount: 120000,
      currency: "NPR",
      invoiceStatus: "Overdue",
      daysOverdue: 55,
      lastReminderDate: "2026-03-01",
      reminderStage: 3,
      paymentPromiseDate: "2026-03-25",
      reminderStatus: "Payment Promised",
      notes: "First invoice for Q1 Consulting",
      riskFlag: "High"
    },
    {
      invoiceId: "INV-002",
      customerId: "C-002",
      companyName: "Himalayan Logistics Pvt Ltd",
      invoiceNumber: "INV-2026-002",
      invoiceDate: "2026-01-12",
      dueDate: "2026-01-27",
      invoiceAmount: 85000,
      amountPaid: 20000,
      outstandingAmount: 65000,
      currency: "NPR",
      invoiceStatus: "Partial",
      daysOverdue: 48,
      lastReminderDate: "2026-03-05",
      reminderStage: 2,
      paymentPromiseDate: "2026-03-20",
      reminderStatus: "Reminder Sent",
      notes: "Logistics retainer",
      riskFlag: "Medium"
    }
  ],
  customers: [
    {
      customerId: "C-001",
      companyName: "Everest Education Consulting",
      contactPerson: "Ramesh Shrestha",
      phone: "9841123456",
      email: "ramesh@everestedu.com",
      billingFrequency: "Monthly",
      paymentTerms: 15,
      industry: "Education",
      website: "everestedu.com",
      country: "Nepal",
      totalOutstanding: 230000,
      openInvoicesCount: 2
    }
  ],
  expenses: [
    {
      id: "1",
      category: "Payroll",
      type: "Fixed",
      monthlyValues: { Jan: 150000, Feb: 150000, Mar: 150000, Apr: 150000, May: 150000, Jun: 150000, Jul: 150000, Aug: 150000, Sep: 150000, Oct: 150000, Nov: 150000, Dec: 150000 }
    },
    {
      id: "2",
      category: "Marketing",
      type: "Variable",
      monthlyValues: { Jan: 20000, Feb: 25000, Mar: 30000, Apr: 20000, May: 15000, Jun: 20000, Jul: 25000, Aug: 30000, Sep: 20000, Oct: 15000, Nov: 20000, Dec: 25000 }
    }
  ],
  budgets: [
    {
      id: "b1",
      category: "Payroll",
      type: "Fixed",
      monthlyValues: { Jan: 140000, Feb: 140000, Mar: 140000, Apr: 140000, May: 140000, Jun: 140000, Jul: 140000, Aug: 140000, Sep: 140000, Oct: 140000, Nov: 140000, Dec: 140000 }
    },
    {
      id: "b2",
      category: "Marketing",
      type: "Variable",
      monthlyValues: { Jan: 25000, Feb: 25000, Mar: 25000, Apr: 25000, May: 25000, Jun: 25000, Jul: 25000, Aug: 25000, Sep: 25000, Oct: 25000, Nov: 25000, Dec: 25000 }
    }
  ],
  forecastMode: "Expenses",
  initialCash: 500000,
  safeThreshold: 200000,
  timestamp: new Date().toISOString()
};
