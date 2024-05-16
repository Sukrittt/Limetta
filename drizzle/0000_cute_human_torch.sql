CREATE TABLE IF NOT EXISTS "account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" varchar(255),
	"access_token" varchar(255),
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT account_provider_providerAccountId PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"monthIncome" numeric NOT NULL,
	"totalSpendings" numeric DEFAULT '0' NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL,
	"needsPercentage" numeric NOT NULL,
	"wantsPercentage" numeric NOT NULL,
	"investmentsPercentage" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dues" (
	"id" serial PRIMARY KEY NOT NULL,
	"entryName" varchar(100) NOT NULL,
	"entryType" varchar(100) DEFAULT 'pending' NOT NULL,
	"dueType" varchar(100) NOT NULL,
	"amount" numeric NOT NULL,
	"userId" varchar(255) NOT NULL,
	"dueDate" date NOT NULL,
	"transferAccountType" varchar(100),
	"transferAccountId" integer,
	"createdAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "investments" (
	"id" serial PRIMARY KEY NOT NULL,
	"entryName" varchar(100) NOT NULL,
	"tradeBooks" boolean DEFAULT false NOT NULL,
	"entryType" varchar(100) NOT NULL,
	"amount" numeric NOT NULL,
	"transferingTo" varchar(100),
	"transferingFrom" varchar(100),
	"userId" varchar(255) NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "miscellaneous" (
	"id" serial PRIMARY KEY NOT NULL,
	"entryName" varchar(100) NOT NULL,
	"entryType" varchar(100) NOT NULL,
	"amount" numeric NOT NULL,
	"transferingTo" varchar(100),
	"transferingFrom" varchar(100),
	"dueType" varchar(100),
	"userId" varchar(255) NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "needs" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"description" varchar(100) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"bookId" integer NOT NULL,
	"dueType" varchar(100),
	"createdAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar(1000) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "savings" (
	"id" serial PRIMARY KEY NOT NULL,
	"entryName" varchar(100) NOT NULL,
	"entryType" varchar(100) NOT NULL,
	"amount" numeric NOT NULL,
	"dueType" varchar(100),
	"transferingTo" varchar(100),
	"transferingFrom" varchar(100),
	"userId" varchar(255) NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" date DEFAULT now(),
	"image" varchar(255),
	"monthlyIncome" numeric,
	"needsPercentage" numeric DEFAULT '50' NOT NULL,
	"wantsPercentage" numeric DEFAULT '30' NOT NULL,
	"investmentsPercentage" numeric DEFAULT '20' NOT NULL,
	"savingsBalance" numeric DEFAULT '0' NOT NULL,
	"totalInvested" numeric DEFAULT '0' NOT NULL,
	"investmentsBalance" numeric DEFAULT '0' NOT NULL,
	"miscellanousBalance" numeric DEFAULT '0' NOT NULL,
	"duePayable" numeric DEFAULT '0' NOT NULL,
	"dueReceiveble" numeric DEFAULT '0' NOT NULL,
	"currency" varchar(1) DEFAULT '₹' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" date NOT NULL,
	CONSTRAINT verificationToken_identifier_token PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wants" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric NOT NULL,
	"description" varchar(100) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"bookId" integer NOT NULL,
	"dueType" varchar(100),
	"createdAt" date DEFAULT now() NOT NULL
);
