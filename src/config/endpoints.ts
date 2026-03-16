export const ENDPOINTS = {
  // Current Google Sheets API
  SHEETS_API: "https://script.google.com/macros/s/AKfycbxJgM3kODN4FijCgXiBSXaFMW3elRJUtFPBAfNkNMQjf7fAVnJ9Int0k0jLUZXwrdLk/exec",
  
  // Future Placeholders
  AR_INVOICES: process.env.NEXT_PUBLIC_AR_INVOICES_API || "",
  CUSTOMERS: process.env.NEXT_PUBLIC_CUSTOMERS_API || "",
  EXPENSES: process.env.NEXT_PUBLIC_EXPENSES_API || "",
  BUDGET: process.env.NEXT_PUBLIC_BUDGET_API || "",
  MAIL_AUTOMATION: process.env.NEXT_PUBLIC_MAIL_API || "",
  USER_NOTIFICATIONS: process.env.NEXT_PUBLIC_NOTIFICATIONS_API || "",
};

export const CONFIG = {
  DEMO_MODE: true, // Fallback to mock data if API fails or is not connected
  SAFE_CASH_THRESHOLD: 500000,
  DEFAULT_CURRENCY: "NPR",
};
