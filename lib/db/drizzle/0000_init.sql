CREATE TABLE `invitations` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`recipient_company` text NOT NULL,
	`contact_name` text,
	`contact_email` text,
	`sponsor_type` text NOT NULL,
	`custom_message` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`selected_plan` text,
	`in_kind_type` text,
	`confirmed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invitations_token_unique` ON `invitations` (`token`);