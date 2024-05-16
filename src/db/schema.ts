import {
  date,
  primaryKey,
  varchar,
  serial,
  text,
  integer,
  boolean,
  pgTable,
  numeric,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import type { AdapterAccount } from "@auth/core/adapters";

export const accounts = pgTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: date("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: date("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const users = pgTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: date("emailVerified", {
    mode: "date",
  }).defaultNow(),
  image: varchar("image", { length: 255 }),

  monthlyIncome: numeric("monthlyIncome"),
  needsPercentage: numeric("needsPercentage")
    .notNull()

    .default("50"),
  wantsPercentage: numeric("wantsPercentage")
    .notNull()

    .default("30"),
  investmentsPercentage: numeric("investmentsPercentage")
    .notNull()
    .default("20"),

  savingsBalance: numeric("savingsBalance").notNull().default("0"),
  totalInvested: numeric("totalInvested").notNull().default("0"),
  investmentsBalance: numeric("investmentsBalance").notNull().default("0"),
  miscellanousBalance: numeric("miscellanousBalance").notNull().default("0"),

  duePayable: numeric("duePayable").notNull().default("0"),
  dueReceivable: numeric("dueReceiveble").notNull().default("0"),

  currency: varchar("currency", { length: 1 }).notNull().default("₹"),
});

export const usersRelations = relations(users, ({ one }) => ({
  accounts: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
}));

export const sessionRelations = relations(users, ({ one }) => ({
  sessions: one(sessions, {
    fields: [users.id],
    references: [sessions.userId],
  }),
}));

export type User = typeof users.$inferSelect;

// Books
export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  monthIncome: numeric("monthIncome").notNull(),
  totalSpendings: numeric("totalSpendings").notNull().default("0"),
  createdAt: date("createdAt", { mode: "date" }).notNull().defaultNow(),
  needsPercentage: numeric("needsPercentage").notNull(),
  wantsPercentage: numeric("wantsPercentage").notNull(),
  investmentsPercentage: numeric("investmentsPercentage").notNull(),
});

export type Books = typeof books.$inferSelect;

export const booksRelation = relations(books, ({ one }) => ({
  author: one(users, {
    fields: [books.userId],
    references: [users.id],
  }),
}));

export const UserBooksRelations = relations(users, ({ many }) => ({
  books: many(books),
}));

// Needs
export const needs = pgTable("needs", {
  id: serial("id").primaryKey(),
  amount: numeric("amount").notNull(),
  description: varchar("description", { length: 100 }).notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  bookId: integer("bookId").notNull(),
  dueType: varchar("dueType", {
    length: 100,
    enum: ["payable"],
  }),
  createdAt: date("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export type Needs = typeof needs.$inferSelect;

export const needsReleationWithBooks = relations(needs, ({ one }) => ({
  book: one(books, {
    fields: [needs.bookId],
    references: [books.id],
  }),
}));

export const needsReleationWithUsers = relations(needs, ({ one }) => ({
  author: one(users, {
    fields: [needs.userId],
    references: [users.id],
  }),
}));

export const bookNeedsRelations = relations(books, ({ many }) => ({
  needs: many(needs),
}));

// Wants
export const wants = pgTable("wants", {
  id: serial("id").primaryKey(),
  amount: numeric("amount").notNull(),
  description: varchar("description", { length: 100 }).notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  bookId: integer("bookId").notNull(),
  dueType: varchar("dueType", {
    length: 100,
    enum: ["payable"],
  }),
  createdAt: date("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export type Wants = typeof wants.$inferSelect;

export const wantsRelationWithBooks = relations(wants, ({ one }) => ({
  book: one(books, {
    fields: [wants.bookId],
    references: [books.id],
  }),
}));

export const wantsRelationWithUsers = relations(wants, ({ one }) => ({
  author: one(users, {
    fields: [wants.userId],
    references: [users.id],
  }),
}));

export const bookWantsRelations = relations(books, ({ many }) => ({
  wants: many(wants),
}));

// Savings Account
export const savings = pgTable("savings", {
  id: serial("id").primaryKey(),
  entryName: varchar("entryName", { length: 100 }).notNull(),
  entryType: varchar("entryType", {
    length: 100,
    enum: ["in", "out"],
  }).notNull(),
  amount: numeric("amount").notNull(),
  dueType: varchar("dueType", {
    length: 100,
    enum: ["payable", "receivable"],
  }),
  transferingTo: varchar("transferingTo", {
    length: 100,
    enum: ["investments", "miscellaneous"],
  }),
  transferingFrom: varchar("transferingFrom", {
    length: 100,
    enum: ["investments", "miscellaneous"],
  }),
  userId: varchar("userId", { length: 255 }).notNull(),
  createdAt: date("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export type Savings = typeof savings.$inferSelect;

export const savingsRelation = relations(savings, ({ one }) => ({
  author: one(users, {
    fields: [savings.userId],
    references: [users.id],
  }),
}));

export const UserSavingsRelations = relations(users, ({ many }) => ({
  savings: many(savings),
}));

// Investments Account
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  entryName: varchar("entryName", { length: 100 }).notNull(),
  tradeBooks: boolean("tradeBooks").notNull().default(false), // true if the entry is a trade booking (profit/loss entry)
  entryType: varchar("entryType", {
    length: 100,
    enum: ["in", "out"],
  }).notNull(),
  amount: numeric("amount").notNull(),
  transferingTo: varchar("transferingTo", {
    length: 100,
    enum: ["savings", "miscellaneous"],
  }),
  transferingFrom: varchar("transferingFrom", {
    length: 100,
    enum: ["savings", "miscellaneous"],
  }),
  userId: varchar("userId", { length: 255 }).notNull(),
  createdAt: date("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export type Investments = typeof investments.$inferSelect;

export const investmentsRelation = relations(investments, ({ one }) => ({
  author: one(users, {
    fields: [investments.userId],
    references: [users.id],
  }),
}));

export const UserInvestmentsRelations = relations(users, ({ many }) => ({
  investments: many(investments),
}));

// Miscellaneous Account
export const miscellaneous = pgTable("miscellaneous", {
  id: serial("id").primaryKey(),
  entryName: varchar("entryName", { length: 100 }).notNull(),
  entryType: varchar("entryType", {
    length: 100,
    enum: ["in", "out"],
  }).notNull(),
  amount: numeric("amount").notNull(),
  transferingTo: varchar("transferingTo", {
    length: 100,
    enum: ["investments", "savings"],
  }),
  transferingFrom: varchar("transferingFrom", {
    length: 100,
    enum: ["investments", "savings"],
  }),
  dueType: varchar("dueType", {
    length: 100,
    enum: ["payable", "receivable"],
  }),
  userId: varchar("userId", { length: 255 }).notNull(),
  createdAt: date("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export type Miscellaneous = typeof miscellaneous.$inferSelect;

export const miscellaneousRelation = relations(miscellaneous, ({ one }) => ({
  author: one(users, {
    fields: [miscellaneous.userId],
    references: [users.id],
  }),
}));

export const UserMiscellaneousRelations = relations(users, ({ many }) => ({
  miscellaneous: many(miscellaneous),
}));

// Dues
export const dues = pgTable("dues", {
  id: serial("id").primaryKey(),
  entryName: varchar("entryName", { length: 100 }).notNull(),
  dueStatus: varchar("entryType", {
    length: 100,
    enum: ["pending", "paid"],
  })
    .notNull()
    .default("pending"),
  dueType: varchar("dueType", {
    length: 100,
    enum: ["payable", "receivable"],
  }).notNull(),
  amount: numeric("amount").notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  dueDate: date("dueDate", { mode: "date" }).notNull(),

  transferAccountType: varchar("transferAccountType", {
    length: 100,
    enum: ["want", "need", "savings", "miscellaneous"],
  }),
  transferAccountId: integer("transferAccountId"), // will contain id of the account depending on the 'transferAccountType'

  createdAt: date("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export type Dues = typeof dues.$inferSelect;

export const dueRelation = relations(dues, ({ one }) => ({
  author: one(users, {
    fields: [dues.userId],
    references: [users.id],
  }),
}));

export const UserDueRelations = relations(users, ({ many }) => ({
  dues: many(dues),
}));

// Report an Issue
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  description: varchar("description", { length: 1000 }).notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  createdAt: date("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export type Reports = typeof dues.$inferSelect;

export const reportRelation = relations(reports, ({ one }) => ({
  author: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));

export const UserReportRelations = relations(users, ({ many }) => ({
  reports: many(reports),
}));
