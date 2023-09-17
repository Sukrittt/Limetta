import {
  int,
  timestamp,
  mysqlTable,
  primaryKey,
  varchar,
  serial,
  text,
  float,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import type { AdapterAccount } from "@auth/core/adapters";

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
});

export type User = typeof users.$inferSelect;

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

//monthly books
export const books = mysqlTable("books", {
  id: serial("id").primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
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
  description: varchar("description", { length: 50 }).notNull(),
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
  description: varchar("description", { length: 50 }).notNull(),
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
