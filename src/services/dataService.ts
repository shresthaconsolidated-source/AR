import { ENDPOINTS, CONFIG } from "../config/endpoints";
import { AppData, Invoice, Customer } from "../types";
import { MOCK_DATA } from "./mockData";

export class DataService {
  private static instance: DataService;

  private constructor() {}

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async getAllData(): Promise<AppData> {
    if (CONFIG.DEMO_MODE && !ENDPOINTS.SHEETS_API) {
      return MOCK_DATA;
    }

    try {
      const response = await fetch(ENDPOINTS.SHEETS_API);
      if (!response.ok) throw new Error("API Fetch Failed");
      const data = await response.json();
      
      // Transform sheet keys to application keys if necessary
      // Assuming Sheet1 maps to invoices and Sheet2 to customers as per Sheets code
      const transformedInvoices = (data.sheet1 || []).map((inv: any) => ({
        invoiceId: inv["Invoice ID"],
        customerId: inv["Customer ID"],
        invoiceNumber: inv["Invoice Number"],
        invoiceDate: inv["Invoice Date"],
        dueDate: inv["Due Date"],
        invoiceAmount: Number(inv["Invoice Amount"]),
        amountPaid: Number(inv["Amount Paid"]),
        outstandingAmount: Number(inv["Outstanding Amount"]),
        currency: inv["Currency"],
        invoiceStatus: inv["Invoice Status"],
        daysOverdue: Number(inv["Days Overdue"]),
        lastReminderDate: inv["Last Reminder Date"],
        reminderStage: Number(inv["Reminder Stage"]),
        paymentPromiseDate: inv["Payment Promise Date"],
        reminderStatus: inv["Reminder Status"],
        notes: inv["Notes"],
        riskFlag: inv["Risk Flag"],
      }));

      const transformedCustomers = (data.sheet2 || []).map((cust: any) => ({
        customerId: cust["Customer ID"],
        companyName: cust["Company Name"],
        contactPerson: cust["Contact Person"],
        phone: cust["Phone"],
        email: cust["Email"],
        billingFrequency: cust["Billing Frequency"],
        paymentTerms: Number(cust["Payment Terms (Days)"]),
        industry: cust["Industry"],
        website: cust["Website"],
        country: cust["Country"],
      }));

      // In-memory join for company name on invoices
      const enrichedInvoices = transformedInvoices.map((inv: Invoice) => {
        const customer = transformedCustomers.find((c: Customer) => c.customerId === inv.customerId);
        return {
          ...inv,
          companyName: customer ? customer.companyName : "Unknown Client"
        };
      });

      return {
        invoices: enrichedInvoices,
        customers: transformedCustomers,
        expenses: MOCK_DATA.expenses, // Fallback for now
        budgets: MOCK_DATA.budgets,   // Fallback for now
        forecastMode: MOCK_DATA.forecastMode,
        initialCash: MOCK_DATA.initialCash,
        safeThreshold: MOCK_DATA.safeThreshold,
        timestamp: data.timestamp || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Data fetch error, using mock data:", error);
      return MOCK_DATA;
    }
  }

  // Placeholder for future mail automation
  async sendReminder(invoiceId: string, stage: number): Promise<boolean> {
    console.log(`Sending reminder for ${invoiceId} at stage ${stage}`);
    // Simulate API call
    return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  }

  // Placeholder for future notification
  async sendNotification(type: string, message: string): Promise<boolean> {
    console.log(`Sending ${type} notification: ${message}`);
    return true;
  }
}

export const dataService = DataService.getInstance();
