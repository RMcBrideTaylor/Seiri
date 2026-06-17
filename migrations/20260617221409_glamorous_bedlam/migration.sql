CREATE TABLE `tags_files` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`tag_id` integer NOT NULL,
	`file_id` integer NOT NULL,
	CONSTRAINT `fk_tags_files_tag_id_tags_id_fk` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_tags_files_file_id_files_id_fk` FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON DELETE CASCADE
);
