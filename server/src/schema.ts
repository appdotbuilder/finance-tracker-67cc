import { z } from 'zod';

// Account schema
export const accountSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['Checking', 'Savings', 'Credit Card', 'Investment', 'Other']),
  balance: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Account = z.infer<typeof accountSchema>;

// Input schema for creating accounts
export const createAccountInputSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  type: z.enum(['Checking', 'Savings', 'Credit Card', 'Investment', 'Other']),
  balance: z.number().default(0)
});

export type CreateAccountInput = z.infer<typeof createAccountInputSchema>;

// Input schema for updating accounts
export const updateAccountInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  type: z.enum(['Checking', 'Savings', 'Credit Card', 'Investment', 'Other']).optional(),
  balance: z.number().optional()
});

export type UpdateAccountInput = z.infer<typeof updateAccountInputSchema>;

// Transaction schema
export const transactionSchema = z.object({
  id: z.number(),
  account_id: z.number(),
  type: z.enum(['income', 'expense']),
  amount: z.number(),
  category: z.string(),
  description: z.string().nullable(),
  date: z.coerce.date(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Transaction = z.infer<typeof transactionSchema>;

// Input schema for creating transactions
export const createTransactionInputSchema = z.object({
  account_id: z.number().positive('Account ID is required'),
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().nullable().optional(),
  date: z.coerce.date()
});

export type CreateTransactionInput = z.infer<typeof createTransactionInputSchema>;

// Input schema for updating transactions
export const updateTransactionInputSchema = z.object({
  id: z.number(),
  account_id: z.number().positive().optional(),
  type: z.enum(['income', 'expense']).optional(),
  amount: z.number().positive().optional(),
  category: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  date: z.coerce.date().optional()
});

export type UpdateTransactionInput = z.infer<typeof updateTransactionInputSchema>;

// Budget schema
export const budgetSchema = z.object({
  id: z.number(),
  category: z.string(),
  amount: z.number(),
  month: z.number().int().min(1).max(12),
  year: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Budget = z.infer<typeof budgetSchema>;

// Input schema for creating budgets
export const createBudgetInputSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Budget amount must be positive'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000)
});

export type CreateBudgetInput = z.infer<typeof createBudgetInputSchema>;

// Input schema for updating budgets
export const updateBudgetInputSchema = z.object({
  id: z.number(),
  category: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  month: z.number().int().min(1).max(12).optional(),
  year: z.number().int().min(2000).optional()
});

export type UpdateBudgetInput = z.infer<typeof updateBudgetInputSchema>;

// Query schema for filtering transactions
export const transactionQuerySchema = z.object({
  account_id: z.number().optional(),
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  limit: z.number().int().positive().max(1000).default(100),
  offset: z.number().int().nonnegative().default(0)
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;

// Query schema for budget reports
export const budgetReportQuerySchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
  category: z.string().optional()
});

export type BudgetReportQuery = z.infer<typeof budgetReportQuerySchema>;

// Response schema for budget reports
export const budgetReportSchema = z.object({
  category: z.string(),
  budgeted: z.number(),
  spent: z.number(),
  remaining: z.number(),
  percentage_used: z.number()
});

export type BudgetReport = z.infer<typeof budgetReportSchema>;