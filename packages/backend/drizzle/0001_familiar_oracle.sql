CREATE TABLE `store_services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` text,
	`created_at` integer,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` integer NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`description` text,
	`address` text NOT NULL,
	`city` text,
	`state` text,
	`zip_code` text,
	`latitude` text,
	`longitude` text,
	`phone` text,
	`email` text,
	`image_url` text,
	`open_time` text DEFAULT '10:00' NOT NULL,
	`close_time` text DEFAULT '20:00' NOT NULL,
	`deposit` integer DEFAULT 0 NOT NULL,
	`default_service_time` integer DEFAULT 5 NOT NULL,
	`is_open` integer DEFAULT true NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`rating` text DEFAULT '0',
	`total_reviews` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `service_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` integer NOT NULL,
	`ticket_id` integer NOT NULL,
	`service_time_minutes` integer NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`ticket_id`) REFERENCES `tickets`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`store_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`ticket_number` integer NOT NULL,
	`secret_code` text NOT NULL,
	`status` text DEFAULT 'waiting' NOT NULL,
	`position` integer,
	`created_at` integer,
	`called_at` integer,
	`served_at` integer,
	`completed_at` integer,
	`cancelled_at` integer,
	`deposit_amount` integer DEFAULT 0 NOT NULL,
	`deposit_refunded` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`store_id`) REFERENCES `stores`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `push_subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`created_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `push_subscriptions_endpoint_unique` ON `push_subscriptions` (`endpoint`);