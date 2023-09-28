import {
  int,
  timestamp,
  mysqlTable,
  primaryKey,
  varchar,
  serial,
  text,
  float,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import type { AdapterAccount } from "@auth/core/adapters";

export const accounts = mysqlTable(
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
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).defaultNow(),
  image: varchar("image", { length: 255 }),

  monthlyIncome: float("monthlyIncome"),
  needsPercentage: float("needsPercentage").notNull().default(50),
  wantsPercentage: float("wantsPercentage").notNull().default(30),
  investmentsPercentage: float("investmentsPercentage").notNull().default(20),

  savingsBalance: float("savingsBalance").notNull().default(0),
  totalInvested: float("totalInvested").notNull().default(0),
  investmentsBalance: float("investmentsBalance").notNull().default(0),
  miscellanousBalance: float("miscellanousBalance").notNull().default(0),

  duePayable: float("duePayable").notNull().default(0),
  dueReceiveble: float("dueReceiveble").notNull().default(0),

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
export const books = mysqlTable("books", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  monthIncome: float("monthIncome").notNull(),
  totalSpendings: float("totalSpendings").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  needsPercentage: float("needsPercentage").notNull(),
  wantsPercentage: float("wantsPercentage").notNull(),
  investmentsPercentage: float("investmentsPercentage").notNull(),
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
export const needs = mysqlTable("needs", {
  id: serial("id").primaryKey(),
  amount: float("amount").notNull(),
  description: varchar("description", { length: 100 }).notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  bookId: int("bookId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
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
export const wants = mysqlTable("wants", {
  id: serial("id").primaryKey(),
  amount: float("amount").notNull(),
  description: varchar("description", { length: 100 }).notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  bookId: int("bookId").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
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
export const savings = mysqlTable("savings", {
  id: serial("id").primaryKey(),
  entryName: varchar("entryName", { length: 100 }).notNull(),
  entryType: varchar("entryType", {
    length: 100,
    enum: ["in", "out"],
  }).notNull(),
  amount: float("amount").notNull(),
  transferingTo: varchar("transferingTo", {
    length: 100,
    enum: ["investments", "miscellaneous"],
  }),
  transferingFrom: varchar("transferingFrom", {
    length: 100,
    enum: ["investments", "miscellaneous"],
  }),
  userId: varchar("userId", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
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
export const investments = mysqlTable("investments", {
  id: serial("id").primaryKey(),
  entryName: varchar("entryName", { length: 100 }).notNull(),
  tradeBooks: boolean("tradeBooks").notNull().default(false), // true if the entry is a trade booking (profit/loss entry)
  entryType: varchar("entryType", {
    length: 100,
    enum: ["in", "out"],
  }).notNull(),
  amount: float("amount").notNull(),
  transferingTo: varchar("transferingTo", {
    length: 100,
    enum: ["savings", "miscellaneous"],
  }),
  transferingFrom: varchar("transferingFrom", {
    length: 100,
    enum: ["savings", "miscellaneous"],
  }),
  userId: varchar("userId", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
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
export const miscellaneous = mysqlTable("miscellaneous", {
  id: serial("id").primaryKey(),
  entryName: varchar("entryName", { length: 100 }).notNull(),
  entryType: varchar("entryType", {
    length: 100,
    enum: ["in", "out"],
  }).notNull(),
  amount: float("amount").notNull(),
  transferingTo: varchar("transferingTo", {
    length: 100,
    enum: ["investments", "savings"],
  }),
  transferingFrom: varchar("transferingFrom", {
    length: 100,
    enum: ["investments", "savings"],
  }),
  userId: varchar("userId", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
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
export const dues = mysqlTable("dues", {
  id: serial("id").primaryKey(),
  entryName: varchar("entryName", { length: 100 }).notNull(),
  dueType: varchar("entryType", {
    length: 100,
    enum: ["pending", "paid"],
  }).notNull(),
  amount: float("amount").notNull(),
  userId: varchar("userId", { length: 255 }).notNull(),
  dueDate: timestamp("dueDate").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
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
