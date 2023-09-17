ALTER TABLE `user` MODIFY COLUMN `needsPercentage` float NOT NULL DEFAULT 50;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `wantsPercentage` float NOT NULL DEFAULT 30;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `investmentsPercentage` float NOT NULL DEFAULT 20;