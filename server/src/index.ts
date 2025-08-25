import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createAccountInputSchema,
  updateAccountInputSchema,
  createTransactionInputSchema,
  updateTransactionInputSchema,
  transactionQuerySchema,
  createBudgetInputSchema,
  updateBudgetInputSchema,
  budgetReportQuerySchema
} from './schema';

// Import handlers
import { createAccount } from './handlers/create_account';
import { getAccounts } from './handlers/get_accounts';
import { updateAccount } from './handlers/update_account';
import { deleteAccount } from './handlers/delete_account';
import { createTransaction } from './handlers/create_transaction';
import { getTransactions } from './handlers/get_transactions';
import { updateTransaction } from './handlers/update_transaction';
import { deleteTransaction } from './handlers/delete_transaction';
import { createBudget } from './handlers/create_budget';
import { getBudgets } from './handlers/get_budgets';
import { updateBudget } from './handlers/update_budget';
import { deleteBudget } from './handlers/delete_budget';
import { getBudgetReport } from './handlers/get_budget_report';
import { getAccountBalance } from './handlers/get_account_balance';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Account management routes
  createAccount: publicProcedure
    .input(createAccountInputSchema)
    .mutation(({ input }) => createAccount(input)),
  
  getAccounts: publicProcedure
    .query(() => getAccounts()),
  
  updateAccount: publicProcedure
    .input(updateAccountInputSchema)
    .mutation(({ input }) => updateAccount(input)),
  
  deleteAccount: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteAccount(input.id)),
  
  getAccountBalance: publicProcedure
    .input(z.object({ accountId: z.number() }))
    .query(({ input }) => getAccountBalance(input.accountId)),

  // Transaction management routes
  createTransaction: publicProcedure
    .input(createTransactionInputSchema)
    .mutation(({ input }) => createTransaction(input)),
  
  getTransactions: publicProcedure
    .input(transactionQuerySchema)
    .query(({ input }) => getTransactions(input)),
  
  updateTransaction: publicProcedure
    .input(updateTransactionInputSchema)
    .mutation(({ input }) => updateTransaction(input)),
  
  deleteTransaction: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteTransaction(input.id)),

  // Budget management routes
  createBudget: publicProcedure
    .input(createBudgetInputSchema)
    .mutation(({ input }) => createBudget(input)),
  
  getBudgets: publicProcedure
    .input(z.object({ 
      month: z.number().int().min(1).max(12).optional(),
      year: z.number().int().min(2000).optional()
    }))
    .query(({ input }) => getBudgets(input.month, input.year)),
  
  updateBudget: publicProcedure
    .input(updateBudgetInputSchema)
    .mutation(({ input }) => updateBudget(input)),
  
  deleteBudget: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteBudget(input.id)),
  
  getBudgetReport: publicProcedure
    .input(budgetReportQuerySchema)
    .query(({ input }) => getBudgetReport(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Personal Finance TRPC server listening at port: ${port}`);
}

start();