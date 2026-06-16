PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`path` text NOT NULL,
	`hash` text NOT NULL,
	`indexed` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`rating` integer DEFAULT 0 NOT NULL,
	CONSTRAINT "rating_check" CHECK("__new_files"."rating" < 5)
);
--> statement-breakpoint
INSERT INTO `__new_files`("id", "path", "hash", "indexed", "rating") SELECT "id", "path", "hash", "indexed", "rating" FROM `files`;--> statement-breakpoint
DROP TABLE `files`;--> statement-breakpoint
ALTER TABLE `__new_files` RENAME TO `files`;--> statement-breakpoint
PRAGMA foreign_keys=ON;