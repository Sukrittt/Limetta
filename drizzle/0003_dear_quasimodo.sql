ALTER TABLE `investments` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `needs` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `monthlyIncome` int NOT NULL;--> statement-breakpoint
ALTER TABLE `wants` MODIFY COLUMN `createdAt` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `user` ADD `needsPercentage` int DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `wantsPercentage` int DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `investmentsPercentage` int DEFAULT 20 NOT NULL;