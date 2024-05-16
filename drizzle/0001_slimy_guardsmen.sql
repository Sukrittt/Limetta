ALTER TABLE "books" ALTER COLUMN "createdAt" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "dues" ALTER COLUMN "dueDate" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "dues" ALTER COLUMN "createdAt" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "investments" ALTER COLUMN "createdAt" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "miscellaneous" ALTER COLUMN "createdAt" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "needs" ALTER COLUMN "createdAt" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "createdAt" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "savings" ALTER COLUMN "createdAt" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "expires" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "emailVerified" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "verificationToken" ALTER COLUMN "expires" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "wants" ALTER COLUMN "createdAt" SET DATA TYPE date;