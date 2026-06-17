CREATE TABLE `files` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`path` text NOT NULL,
	`hash` text NOT NULL,
	`indexed` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`rating` integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rating_check" CHECK(0 < "rating" < 6)
);
--> statement-breakpoint
CREATE TABLE `projects_files` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`project_id` integer NOT NULL,
	`file_id` integer NOT NULL,
	CONSTRAINT `fk_projects_files_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_projects_files_file_id_files_id_fk` FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text,
	`created` integer DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`name` text,
	`created` integer DEFAULT (CURRENT_TIMESTAMP)
);
