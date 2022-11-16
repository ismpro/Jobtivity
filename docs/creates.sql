CREATE TABLE `Profissional` (
  `idProfissional` int NOT NULL AUTO_INCREMENT,
  `birthday` date DEFAULT NULL,
  `gender` varchar(1) DEFAULT NULL,
  `local` varchar(128) DEFAULT NULL,
  `private` tinyint DEFAULT NULL,
  PRIMARY KEY (`idProfissional`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Company` (
  `idCompany` int NOT NULL AUTO_INCREMENT,
  `urlWebsite` varchar(500) DEFAULT NULL,
  `urlLogo` varchar(500) DEFAULT NULL,
  `valid` tinyint DEFAULT NULL,
  PRIMARY KEY (`idCompany`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `User` (
  `idUser` int NOT NULL AUTO_INCREMENT,
  `email` varchar(64) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `admin` tinyint NOT NULL DEFAULT '0',
  `companyId` int DEFAULT NULL,
  `profissionalId` int DEFAULT NULL,
  PRIMARY KEY (`idUser`),
  KEY `FK_User_Empresa_idx` (`companyId`),
  KEY `FK_User_Profissional_idx` (`profissionalId`),
  CONSTRAINT `FK_User_Company` FOREIGN KEY (`companyId`) REFERENCES `Company` (`idCompany`),
  CONSTRAINT `FK_User_Profissional` FOREIGN KEY (`profissionalId`) REFERENCES `Profissional` (`idProfissional`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Qualification` (
  `idQualification` int NOT NULL AUTO_INCREMENT,
  `local` varchar(128) NOT NULL,
  `name` varchar(64) NOT NULL,
  `type` varchar(50) NOT NULL,
  `grade` varchar(20) DEFAULT NULL,
  `idProfissional` int DEFAULT NULL,
  PRIMARY KEY (`idQualification`),
  KEY `FK_Profissional_Qualification_idx` (`idProfissional`),
  CONSTRAINT `FK_Profissional_Qualification` FOREIGN KEY (`idProfissional`) REFERENCES `Profissional` (`idProfissional`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `PastJob` (
  `idPastJob` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `url` varchar(500) DEFAULT NULL,
  `beginDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `idProfissional` int DEFAULT NULL,
  PRIMARY KEY (`idPastJob`),
  KEY `FK_Profissional_PastJob_idx` (`idProfissional`),
  CONSTRAINT `FK_Profissional_PastJob` FOREIGN KEY (`idProfissional`) REFERENCES `Profissional` (`idProfissional`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Friends` (
  `idFriends` int NOT NULL AUTO_INCREMENT,
  `idProfissional1` int NOT NULL,
  `idProfissional2` int NOT NULL,
  `since` datetime NOT NULL,
  PRIMARY KEY (`idFriends`),
  KEY `FK_Professional1_idx` (`idProfissional1`),
  KEY `FK_Professional2_idx` (`idProfissional2`),
  CONSTRAINT `FK_Professional1` FOREIGN KEY (`idProfissional1`) REFERENCES `Profissional` (`idProfissional`),
  CONSTRAINT `FK_Professional2` FOREIGN KEY (`idProfissional2`) REFERENCES `Profissional` (`idProfissional`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `pw`.`User`
(`email`,
`password`,
`name`,
`description`,
`admin`)
VALUES
('admin1@gmail.com',
'gg',
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
'gg',
'Admin2',
'Admin2 account',
true);



