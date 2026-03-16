export type InvoiceStatus = "Paid" | "Partial" | "Overdue" | "Current";
export type RiskFlag = "High" | "Medium" | "Low" | "None";
export type ReminderStatus = "Not Sent" | "Reminder Sent" | "Follow-up Sent" | "Payment Promised" | "Paid";

export interface Invoice {
  invoiceId: string;
  customerId: string;
  companyName?: string; // Joined from Customer Sheet
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  currency: string;
  invoiceStatus: InvoiceStatus;
  daysOverdue: number;
  lastReminderDate: string;
  reminderStage: number;
  paymentPromiseDate: string;
  reminderStatus: ReminderStatus;
  notes: string;
  riskFlag: RiskFlag;
}

export interface Customer {
  customerId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  billingFrequency: string;
  paymentTerms: number;
  industry: string;
  website: string;
  country: string;
  totalOutstanding?: number;
  openInvoicesCount?: number;
}

export type ForecastMode = 'Expenses' | 'Budget';

export interface MonthlyValues {
  [key: string]: number; // month -> amount (Jan, Feb, etc.)
}

export interface FinancialEntry {
  id: string;
  category: string;
  type: 'Fixed' | 'Variable';
  monthlyValues: MonthlyValues;
}

export interface AppData {
  invoices: Invoice[];
  customers: Customer[];
  expenses: FinancialEntry[];
  budgets: FinancialEntry[];
  forecastMode: ForecastMode;
  initialCash: number;
  safeThreshold: number;
  timestamp: string;
}
