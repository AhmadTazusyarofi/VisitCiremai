-- =============================================================
--  VisitCiremai — skema database
--  Jalankan sekali lewat phpMyAdmin (menu Import) atau:
--    mysql -u root < backend/db/schema.sql
--  Aman dijalankan ulang: semua tabel memakai CREATE TABLE IF NOT EXISTS.
-- =============================================================

CREATE DATABASE IF NOT EXISTS `visitciremai`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `visitciremai`;

-- -------------------------------------------------------------
--  Paket wisata
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `packages` (
  `id`           VARCHAR(120)  NOT NULL COMMENT 'slug, dipakai sebagai URL /paket/:id',
  `title`        VARCHAR(200)  NOT NULL,
  `category`     VARCHAR(60)   NOT NULL,
  `location`     VARCHAR(120)  DEFAULT NULL,
  `price`        INT UNSIGNED  NOT NULL COMMENT 'rupiah, bilangan bulat',
  `price_unit`   VARCHAR(30)   NOT NULL DEFAULT 'Orang',
  `duration`     VARCHAR(60)   NOT NULL,
  `image`        VARCHAR(255)  NOT NULL,
  `description`  TEXT          NOT NULL,
  `is_published` TINYINT(1)    NOT NULL DEFAULT 1,
  `sort_order`   INT           NOT NULL DEFAULT 0,
  `created_at`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_packages_category` (`category`, `is_published`),
  KEY `idx_packages_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Daftar "Yang Termasuk" pada halaman detail paket
CREATE TABLE IF NOT EXISTS `package_includes` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_id` VARCHAR(120) NOT NULL,
  `label`      VARCHAR(160) NOT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_includes_package` (`package_id`, `sort_order`),
  CONSTRAINT `fk_includes_package` FOREIGN KEY (`package_id`)
    REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Foto tambahan pada galeri paket (foto utama ada di packages.image)
CREATE TABLE IF NOT EXISTS `package_gallery` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_id` VARCHAR(120) NOT NULL,
  `image`      VARCHAR(255) NOT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_gallery_package` (`package_id`, `sort_order`),
  CONSTRAINT `fk_gallery_package` FOREIGN KEY (`package_id`)
    REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Butir "Catatan" pada halaman detail paket
CREATE TABLE IF NOT EXISTS `package_notes` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `package_id` VARCHAR(120) NOT NULL,
  `label`      VARCHAR(300) NOT NULL,
  `sort_order` INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_notes_package` (`package_id`, `sort_order`),
  CONSTRAINT `fk_notes_package` FOREIGN KEY (`package_id`)
    REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
--  Pemesanan
--  package_title & package_price disimpan sebagai salinan (snapshot)
--  supaya riwayat pesanan tetap benar walau paketnya nanti diubah
--  harganya atau dihapus.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
  `id`            INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `package_id`    VARCHAR(120)   DEFAULT NULL,
  `package_title` VARCHAR(200)   NOT NULL,
  `package_price` INT UNSIGNED   NOT NULL,
  `name`          VARCHAR(120)   NOT NULL,
  `phone`         VARCHAR(40)    NOT NULL,
  `people`        SMALLINT UNSIGNED NOT NULL,
  `trip_date`     DATE           NOT NULL,
  `notes`         TEXT           DEFAULT NULL,
  `status`        ENUM('baru','dikonfirmasi','selesai','batal') NOT NULL DEFAULT 'baru',
  `created_at`    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_bookings_status` (`status`, `created_at`),
  KEY `idx_bookings_package` (`package_id`),
  CONSTRAINT `fk_bookings_package` FOREIGN KEY (`package_id`)
    REFERENCES `packages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
--  Testimoni — masuk sebagai 'pending', tampil setelah di-approve
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(120) NOT NULL,
  `trip`       VARCHAR(160) NOT NULL DEFAULT 'Pengunjung',
  `rating`     TINYINT UNSIGNED NOT NULL,
  `quote`      TEXT         NOT NULL,
  `status`     ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_testimonials_status` (`status`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------------------
--  Akun admin (password disimpan sebagai hash bcrypt)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admins` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(60)  NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admins_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
