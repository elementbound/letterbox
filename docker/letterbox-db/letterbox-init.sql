CREATE DATABASE IF NOT EXISTS letterbox;
USE letterbox;

CREATE TABLE IF NOT EXISTS history (
    `id` VARCHAR(48) NOT NULL ,
    `date` DATETIME NOT NULL ,
    `at` INT NOT NULL ,
    `value` CHAR(2) NOT NULL ,
    INDEX `date_index` (`date`)
);

CREATE TABLE IF NOT EXISTS snapshots (
  `date` datetime NOT NULL,
  `state` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,

  PRIMARY KEY (date)
);