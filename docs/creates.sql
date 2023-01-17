CREATE SCHEMA IF NOT EXISTS `pw` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `pw`.`Professional` (
  `idProfessional` INT NOT NULL AUTO_INCREMENT,
  `birthday` DATE NULL DEFAULT NULL,
  `gender` VARCHAR(1) NULL DEFAULT NULL,
  `local` VARCHAR(128) NULL DEFAULT NULL,
  `private` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`idProfessional`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `pw`.`Company` (
  `idCompany` INT NOT NULL AUTO_INCREMENT,
  `urlWebsite` VARCHAR(500) NULL DEFAULT NULL,
  `urlLogo` VARCHAR(500) NULL DEFAULT NULL,
  `valid` TINYINT NULL DEFAULT NULL,
  PRIMARY KEY (`idCompany`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `pw`.`User` (
  `idUser` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(64) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  `name` VARCHAR(64) NULL DEFAULT NULL,
  `description` VARCHAR(1024) NULL DEFAULT NULL,
  `admin` TINYINT NOT NULL DEFAULT '0',
  `sessionId` VARCHAR(70) NULL DEFAULT NULL,
  `companyId` INT NULL DEFAULT NULL,
  `professionalId` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  INDEX `FK_User_Company_idx` (`companyId` ASC) VISIBLE,
  INDEX `FK_User_Profissional_idx` (`professionalId` ASC) VISIBLE,
  CONSTRAINT `FK_User_Company`
    FOREIGN KEY (`companyId`)
    REFERENCES `pw`.`Company` (`idCompany`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_User_Professional`
    FOREIGN KEY (`professionalId`)
    REFERENCES `pw`.`Professional` (`idProfessional`))
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `pw`.`Qualification` (
  `idQualification` INT NOT NULL AUTO_INCREMENT,
  `local` VARCHAR(128) NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `grade` VARCHAR(20) NULL DEFAULT NULL,
  `idProfissional` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idQualification`),
  INDEX `FK_Profissional_Qualification_idx` (`idProfissional` ASC) VISIBLE,
  CONSTRAINT `FK_Profissional_Qualification`
    FOREIGN KEY (`idProfissional`)
    REFERENCES `pw`.`Professional` (`idProfessional`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 10
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `pw`.`PastJob` (
  `idPastJob` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NULL DEFAULT NULL,
  `url` VARCHAR(500) NULL DEFAULT NULL,
  `beginDate` DATE NULL DEFAULT NULL,
  `endDate` DATE NULL DEFAULT NULL,
  `description` VARCHAR(1024) NULL DEFAULT NULL,
  `idProfissional` INT NULL DEFAULT NULL,
  PRIMARY KEY (`idPastJob`),
  INDEX `FK_Profissional_PastJob_idx` (`idProfissional` ASC) VISIBLE,
  CONSTRAINT `FK_Profissional_PastJob`
    FOREIGN KEY (`idProfissional`)
    REFERENCES `pw`.`Professional` (`idProfessional`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 16
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `pw`.`Friend` (
  `idFriend` INT NOT NULL AUTO_INCREMENT,
  `idProfessional1` INT NOT NULL,
  `idProfessional2` INT NOT NULL,
  `since` DATETIME NOT NULL,
  PRIMARY KEY (`idFriend`),
  INDEX `FK_Professional1_idx` (`idProfessional1` ASC) VISIBLE,
  INDEX `FK_Professional2_idx` (`idProfessional2` ASC) VISIBLE,
  CONSTRAINT `FK_Professional1`
    FOREIGN KEY (`idProfessional1`)
    REFERENCES `pw`.`Professional` (`idProfessional`),
  CONSTRAINT `FK_Professional2`
    FOREIGN KEY (`idProfessional2`)
    REFERENCES `pw`.`Professional` (`idProfessional`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `pw`.`FriendRequest` (
  `idFriendRequest` INT NOT NULL AUTO_INCREMENT,
  `idProfessional1` INT NOT NULL,
  `idProfessional2` INT NOT NULL,
  `timestamp` DATETIME NOT NULL,
  PRIMARY KEY (`idFriendRequest`),
  INDEX `FK_FriendsRequests_Professional1_idx` (`idProfessional1` ASC) VISIBLE,
  INDEX `FK_FriendsRequests_Professional2_idx` (`idProfessional2` ASC) VISIBLE,
  CONSTRAINT `FK_FriendsRequests_Professional1`
    FOREIGN KEY (`idProfessional1`)
    REFERENCES `pw`.`Professional` (`idProfessional`),
  CONSTRAINT `FK_FriendsRequests_Professional2`
    FOREIGN KEY (`idProfessional2`)
    REFERENCES `pw`.`Professional` (`idProfessional`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO `pw`.`User`
(`email`,
`password`,
`name`,
`description`,
`admin`)
VALUES
('admin1@gmail.com',
'$2b$10$3F3n1X/cXT.TO4gpoJA59.iuWOZOCD6tZPsnbLv9g70zpTjYgzJ2i',
'Admin1',
'Admin1 account',
true);

INSERT INTO `pw`.`User`
(`email`,
`password`,
`name`,
`description`,
`admin`)
VALUES
('admin2@gmail.com',
'$2b$10$3F3n1X/cXT.TO4gpoJA59.iuWOZOCD6tZPsnbLv9g70zpTjYgzJ2i',
'Admin2',
'Admin2 account',
true);



