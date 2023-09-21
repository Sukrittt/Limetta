CREATE TABLE `account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` varchar(255),
	`access_token` varchar(255),
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `account_provider_providerAccountId` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `books` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` varchar(255) NOT NULL,
	`monthIncome` float NOT NULL,
	`totalSpendings` float NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`needsPercentage` float NOT NULL,
	`wantsPercentage` float NOT NULL,
	`investmentsPercentage` float NOT NULL,
	CONSTRAINT `books_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `investments` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`entryName` varchar(100) NOT NULL,
	`entryType` varchar(100) NOT NULL,
	`amount` float NOT NULL,
	`transferingTo` varchar(100),
	`transferingFrom` varchar(100),
	`userId` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `investments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `miscellaneous` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`entryName` varchar(100) NOT NULL,
	`entryType` varchar(100) NOT NULL,
	`amount` float NOT NULL,
	`transferingTo` varchar(100),
	`transferingFrom` varchar(100),
	`userId` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `miscellaneous_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `needs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`amount` float NOT NULL,
	`description` varchar(100) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`bookId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `needs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `savings` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`entryName` varchar(100) NOT NULL,
	`entryType` varchar(100) NOT NULL,
	`amount` float NOT NULL,
	`transferingTo` varchar(100),
	`transferingFrom` varchar(100),
	`userId` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `savings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp(3) DEFAULT (now()),
	`image` varchar(255),
	`monthlyIncome` float,
	`needsPercentage` float NOT NULL DEFAULT 50,
	`wantsPercentage` float NOT NULL DEFAULT 30,
	`investmentsPercentage` float NOT NULL DEFAULT 20,
	`savingsBalance` float NOT NULL DEFAULT 0,
	`investmentsBalance` float NOT NULL DEFAULT 0,
	`miscellanousBalance` float NOT NULL DEFAULT 0,
	`currency` varchar(1) NOT NULL DEFAULT '₹',
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `verificationToken_identifier_token` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE TABLE `wants` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`amount` float NOT NULL,
	`description` varchar(100) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`bookId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wants_id` PRIMARY KEY(`id`)
);
