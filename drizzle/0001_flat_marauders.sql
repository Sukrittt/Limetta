CREATE TABLE `investments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`amount` int NOT NULL,
	`userId` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `investments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `needs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`amount` int NOT NULL,
	`userId` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `needs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wants` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`amount` int NOT NULL,
	`userId` varchar(255) NOT NULL,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `wants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user` ADD `monthlyIncome` int;