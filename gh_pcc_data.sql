-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: gh_hms
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admissions`
--

DROP TABLE IF EXISTS `admissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `admission_date` datetime(6) DEFAULT NULL,
  `admission_id` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `discharge_date` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `reason_for_admission` text,
  `status` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `admitted_by` bigint NOT NULL,
  `branch_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_sw48nrd84pv8o1ic9pntv2v4v` (`admission_id`),
  KEY `FK1c33ahli9ox7mq5qbd3be9kjd` (`admitted_by`),
  KEY `FKn5yr2a3st74emdtna21s3yw4g` (`branch_id`),
  KEY `FKkyky6a6qqfqwfvd92qpopwepy` (`patient_id`),
  CONSTRAINT `FK1c33ahli9ox7mq5qbd3be9kjd` FOREIGN KEY (`admitted_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKkyky6a6qqfqwfvd92qpopwepy` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  CONSTRAINT `FKn5yr2a3st74emdtna21s3yw4g` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admissions`
--

LOCK TABLES `admissions` WRITE;
/*!40000 ALTER TABLE `admissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `admissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `beds`
--

DROP TABLE IF EXISTS `beds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beds` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bed_number` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `status` enum('AVAILABLE','MAINTENANCE','OCCUPIED') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `current_patient_id` bigint DEFAULT NULL,
  `room_id` bigint NOT NULL,
  `ward_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnwjyg3u7b9v863i0mp6gcwbin` (`room_id`,`bed_number`),
  KEY `FK5htkv9dl61xo2hrwx06y3tcva` (`current_patient_id`),
  KEY `FKccoswfceny9biqfp1jkcpcrqy` (`ward_id`),
  CONSTRAINT `FK2tg7eb23xlsy3mkhcqlp15aha` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `FK5htkv9dl61xo2hrwx06y3tcva` FOREIGN KEY (`current_patient_id`) REFERENCES `patients` (`id`),
  CONSTRAINT `FKccoswfceny9biqfp1jkcpcrqy` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beds`
--

LOCK TABLES `beds` WRITE;
/*!40000 ALTER TABLE `beds` DISABLE KEYS */;
INSERT INTO `beds` VALUES (1,'BGH-MALE-R1-B1','2026-03-19 10:09:37.685832','AVAILABLE','2026-03-19 10:09:37.685835',NULL,1,1),(2,'BGH-MALE-R1-B2','2026-03-19 10:09:37.688196','AVAILABLE','2026-03-19 10:09:37.688199',NULL,1,1),(3,'BGH-MALE-R1-B3','2026-03-19 10:09:37.689367','AVAILABLE','2026-03-19 10:09:37.689369',NULL,1,1),(4,'BGH-MALE-R1-B4','2026-03-19 10:09:37.690355','AVAILABLE','2026-03-19 10:09:37.690356',NULL,1,1),(5,'BGH-MALE-R1-B5','2026-03-19 10:09:37.691232','AVAILABLE','2026-03-19 10:09:37.691233',NULL,1,1),(6,'BGH-MALE-R2-B1','2026-03-19 10:09:37.693031','AVAILABLE','2026-03-19 10:09:37.693033',NULL,2,1),(7,'BGH-MALE-R2-B2','2026-03-19 10:09:37.693881','AVAILABLE','2026-03-19 10:09:37.693883',NULL,2,1),(8,'BGH-MALE-R2-B3','2026-03-19 10:09:37.694740','AVAILABLE','2026-03-19 10:09:37.694741',NULL,2,1),(9,'BGH-MALE-R2-B4','2026-03-19 10:09:37.695500','AVAILABLE','2026-03-19 10:09:37.695501',NULL,2,1),(10,'BGH-MALE-R2-B5','2026-03-19 10:09:37.696254','AVAILABLE','2026-03-19 10:09:37.696256',NULL,2,1),(11,'BGH-FEMALE-R1-B1','2026-03-19 10:09:37.698934','AVAILABLE','2026-03-19 10:09:37.698936',NULL,3,2),(12,'BGH-FEMALE-R1-B2','2026-03-19 10:09:37.702260','AVAILABLE','2026-03-19 10:09:37.702265',NULL,3,2),(13,'BGH-FEMALE-R1-B3','2026-03-19 10:09:37.704895','AVAILABLE','2026-03-19 10:09:37.704900',NULL,3,2),(14,'BGH-FEMALE-R1-B4','2026-03-19 10:09:37.706765','AVAILABLE','2026-03-19 10:09:37.706769',NULL,3,2),(15,'BGH-FEMALE-R1-B5','2026-03-19 10:09:37.708506','AVAILABLE','2026-03-19 10:09:37.708509',NULL,3,2),(16,'BGH-FEMALE-R2-B1','2026-03-19 10:09:37.710622','AVAILABLE','2026-03-19 10:09:37.710624',NULL,4,2),(17,'BGH-FEMALE-R2-B2','2026-03-19 10:09:37.711663','AVAILABLE','2026-03-19 10:09:37.711665',NULL,4,2),(18,'BGH-FEMALE-R2-B3','2026-03-19 10:09:37.712574','AVAILABLE','2026-03-19 10:09:37.712576',NULL,4,2),(19,'BGH-FEMALE-R2-B4','2026-03-19 10:09:37.713634','AVAILABLE','2026-03-19 10:09:37.713637',NULL,4,2),(20,'BGH-FEMALE-R2-B5','2026-03-19 10:09:37.714786','AVAILABLE','2026-03-19 10:09:37.714788',NULL,4,2),(21,'BGH-MAT-R1-B1','2026-03-19 10:09:37.717768','AVAILABLE','2026-03-19 10:09:37.717771',NULL,5,3),(22,'BGH-MAT-R1-B2','2026-03-19 10:09:37.719465','AVAILABLE','2026-03-19 10:09:37.719469',NULL,5,3),(23,'BGH-MAT-R1-B3','2026-03-19 10:09:37.721303','AVAILABLE','2026-03-19 10:09:37.721308',NULL,5,3),(24,'BGH-MAT-R1-B4','2026-03-19 10:09:37.722961','AVAILABLE','2026-03-19 10:09:37.722963',NULL,5,3),(25,'BGH-MAT-R1-B5','2026-03-19 10:09:37.724271','AVAILABLE','2026-03-19 10:09:37.724274',NULL,5,3),(26,'LRH-MALE-R1-B1','2026-03-19 10:09:37.728397','AVAILABLE','2026-03-19 10:09:37.728403',NULL,6,4),(27,'LRH-MALE-R1-B2','2026-03-19 10:09:37.729846','AVAILABLE','2026-03-19 10:09:37.729848',NULL,6,4),(28,'LRH-MALE-R1-B3','2026-03-19 10:09:37.730811','AVAILABLE','2026-03-19 10:09:37.730812',NULL,6,4),(29,'LRH-MALE-R1-B4','2026-03-19 10:09:37.731522','AVAILABLE','2026-03-19 10:09:37.731524',NULL,6,4),(30,'LRH-MALE-R1-B5','2026-03-19 10:09:37.732194','AVAILABLE','2026-03-19 10:09:37.732196',NULL,6,4),(31,'LRH-MALE-R2-B1','2026-03-19 10:09:37.734068','AVAILABLE','2026-03-19 10:09:37.734072',NULL,7,4),(32,'LRH-MALE-R2-B2','2026-03-19 10:09:37.735268','AVAILABLE','2026-03-19 10:09:37.735271',NULL,7,4),(33,'LRH-MALE-R2-B3','2026-03-19 10:09:37.736362','AVAILABLE','2026-03-19 10:09:37.736364',NULL,7,4),(34,'LRH-MALE-R2-B4','2026-03-19 10:09:37.737200','AVAILABLE','2026-03-19 10:09:37.737201',NULL,7,4),(35,'LRH-MALE-R2-B5','2026-03-19 10:09:37.737941','AVAILABLE','2026-03-19 10:09:37.737943',NULL,7,4),(36,'LRH-FEMALE-R1-B1','2026-03-19 10:09:37.740078','AVAILABLE','2026-03-19 10:09:37.740086',NULL,8,5),(37,'LRH-FEMALE-R1-B2','2026-03-19 10:09:37.741172','AVAILABLE','2026-03-19 10:09:37.741176',NULL,8,5),(38,'LRH-FEMALE-R1-B3','2026-03-19 10:09:37.742167','AVAILABLE','2026-03-19 10:09:37.742170',NULL,8,5),(39,'LRH-FEMALE-R1-B4','2026-03-19 10:09:37.743530','AVAILABLE','2026-03-19 10:09:37.743534',NULL,8,5),(40,'LRH-FEMALE-R1-B5','2026-03-19 10:09:37.745241','AVAILABLE','2026-03-19 10:09:37.745245',NULL,8,5),(41,'LRH-FEMALE-R2-B1','2026-03-19 10:09:37.748666','AVAILABLE','2026-03-19 10:09:37.748668',NULL,9,5),(42,'LRH-FEMALE-R2-B2','2026-03-19 10:09:37.749786','AVAILABLE','2026-03-19 10:09:37.749788',NULL,9,5),(43,'LRH-FEMALE-R2-B3','2026-03-19 10:09:37.750757','AVAILABLE','2026-03-19 10:09:37.750760',NULL,9,5),(44,'LRH-FEMALE-R2-B4','2026-03-19 10:09:37.751630','AVAILABLE','2026-03-19 10:09:37.751632',NULL,9,5),(45,'LRH-FEMALE-R2-B5','2026-03-19 10:09:37.752642','AVAILABLE','2026-03-19 10:09:37.752645',NULL,9,5),(46,'LRH-MAT-R1-B1','2026-03-19 10:09:37.757316','AVAILABLE','2026-03-19 10:09:37.757320',NULL,10,6),(47,'LRH-MAT-R1-B2','2026-03-19 10:09:37.758796','AVAILABLE','2026-03-19 10:09:37.758800',NULL,10,6),(48,'LRH-MAT-R1-B3','2026-03-19 10:09:37.759914','AVAILABLE','2026-03-19 10:09:37.759917',NULL,10,6),(49,'LRH-MAT-R1-B4','2026-03-19 10:09:37.761267','AVAILABLE','2026-03-19 10:09:37.761271',NULL,10,6),(50,'LRH-MAT-R1-B5','2026-03-19 10:09:37.763053','AVAILABLE','2026-03-19 10:09:37.763057',NULL,10,6),(51,'KDH-MALE-R1-B1','2026-03-19 10:09:37.767313','AVAILABLE','2026-03-19 10:09:37.767317',NULL,11,7),(52,'KDH-MALE-R1-B2','2026-03-19 10:09:37.769160','AVAILABLE','2026-03-19 10:09:37.769167',NULL,11,7),(53,'KDH-MALE-R1-B3','2026-03-19 10:09:37.771090','AVAILABLE','2026-03-19 10:09:37.771095',NULL,11,7),(54,'KDH-MALE-R1-B4','2026-03-19 10:09:37.772532','AVAILABLE','2026-03-19 10:09:37.772535',NULL,11,7),(55,'KDH-MALE-R1-B5','2026-03-19 10:09:37.773828','AVAILABLE','2026-03-19 10:09:37.773832',NULL,11,7),(56,'KDH-MALE-R2-B1','2026-03-19 10:09:37.776267','AVAILABLE','2026-03-19 10:09:37.776270',NULL,12,7),(57,'KDH-MALE-R2-B2','2026-03-19 10:09:37.777244','AVAILABLE','2026-03-19 10:09:37.777245',NULL,12,7),(58,'KDH-MALE-R2-B3','2026-03-19 10:09:37.778632','AVAILABLE','2026-03-19 10:09:37.778636',NULL,12,7),(59,'KDH-MALE-R2-B4','2026-03-19 10:09:37.780009','AVAILABLE','2026-03-19 10:09:37.780013',NULL,12,7),(60,'KDH-MALE-R2-B5','2026-03-19 10:09:37.781181','AVAILABLE','2026-03-19 10:09:37.781183',NULL,12,7),(61,'KDH-FEMALE-R1-B1','2026-03-19 10:09:37.786699','AVAILABLE','2026-03-19 10:09:37.786706',NULL,13,8),(62,'KDH-FEMALE-R1-B2','2026-03-19 10:09:37.788241','AVAILABLE','2026-03-19 10:09:37.788246',NULL,13,8),(63,'KDH-FEMALE-R1-B3','2026-03-19 10:09:37.790009','AVAILABLE','2026-03-19 10:09:37.790015',NULL,13,8),(64,'KDH-FEMALE-R1-B4','2026-03-19 10:09:37.791916','AVAILABLE','2026-03-19 10:09:37.791920',NULL,13,8),(65,'KDH-FEMALE-R1-B5','2026-03-19 10:09:37.793361','AVAILABLE','2026-03-19 10:09:37.793365',NULL,13,8),(66,'KDH-FEMALE-R2-B1','2026-03-19 10:09:37.796143','AVAILABLE','2026-03-19 10:09:37.796147',NULL,14,8),(67,'KDH-FEMALE-R2-B2','2026-03-19 10:09:37.798727','AVAILABLE','2026-03-19 10:09:37.798732',NULL,14,8),(68,'KDH-FEMALE-R2-B3','2026-03-19 10:09:37.800831','AVAILABLE','2026-03-19 10:09:37.800839',NULL,14,8),(69,'KDH-FEMALE-R2-B4','2026-03-19 10:09:37.802881','AVAILABLE','2026-03-19 10:09:37.802886',NULL,14,8),(70,'KDH-FEMALE-R2-B5','2026-03-19 10:09:37.804368','AVAILABLE','2026-03-19 10:09:37.804370',NULL,14,8),(71,'KDH-MAT-R1-B1','2026-03-19 10:09:37.807150','AVAILABLE','2026-03-19 10:09:37.807152',NULL,15,9),(72,'KDH-MAT-R1-B2','2026-03-19 10:09:37.807910','AVAILABLE','2026-03-19 10:09:37.807912',NULL,15,9),(73,'KDH-MAT-R1-B3','2026-03-19 10:09:37.808572','AVAILABLE','2026-03-19 10:09:37.808574',NULL,15,9),(74,'KDH-MAT-R1-B4','2026-03-19 10:09:37.809296','AVAILABLE','2026-03-19 10:09:37.809298',NULL,15,9),(75,'KDH-MAT-R1-B5','2026-03-19 10:09:37.809935','AVAILABLE','2026-03-19 10:09:37.809937',NULL,15,9),(76,'DGH-MALE-R1-B1','2026-03-19 10:09:37.813560','AVAILABLE','2026-03-19 10:09:37.813567',NULL,16,10),(77,'DGH-MALE-R1-B2','2026-03-19 10:09:37.815070','AVAILABLE','2026-03-19 10:09:37.815074',NULL,16,10),(78,'DGH-MALE-R1-B3','2026-03-19 10:09:37.816413','AVAILABLE','2026-03-19 10:09:37.816417',NULL,16,10),(79,'DGH-MALE-R1-B4','2026-03-19 10:09:37.817981','AVAILABLE','2026-03-19 10:09:37.817986',NULL,16,10),(80,'DGH-MALE-R1-B5','2026-03-19 10:09:37.819538','AVAILABLE','2026-03-19 10:09:37.819542',NULL,16,10),(81,'DGH-MALE-R2-B1','2026-03-19 10:09:37.821381','AVAILABLE','2026-03-19 10:09:37.821383',NULL,17,10),(82,'DGH-MALE-R2-B2','2026-03-19 10:09:37.822366','AVAILABLE','2026-03-19 10:09:37.822370',NULL,17,10),(83,'DGH-MALE-R2-B3','2026-03-19 10:09:37.823474','AVAILABLE','2026-03-19 10:09:37.823479',NULL,17,10),(84,'DGH-MALE-R2-B4','2026-03-19 10:09:37.824998','AVAILABLE','2026-03-19 10:09:37.825004',NULL,17,10),(85,'DGH-MALE-R2-B5','2026-03-19 10:09:37.826549','AVAILABLE','2026-03-19 10:09:37.826552',NULL,17,10),(86,'DGH-FEMALE-R1-B1','2026-03-19 10:09:37.830383','AVAILABLE','2026-03-19 10:09:37.830387',NULL,18,11),(87,'DGH-FEMALE-R1-B2','2026-03-19 10:09:37.831744','AVAILABLE','2026-03-19 10:09:37.831748',NULL,18,11),(88,'DGH-FEMALE-R1-B3','2026-03-19 10:09:37.832802','AVAILABLE','2026-03-19 10:09:37.832805',NULL,18,11),(89,'DGH-FEMALE-R1-B4','2026-03-19 10:09:37.833590','AVAILABLE','2026-03-19 10:09:37.833591',NULL,18,11),(90,'DGH-FEMALE-R1-B5','2026-03-19 10:09:37.834237','AVAILABLE','2026-03-19 10:09:37.834238',NULL,18,11),(91,'DGH-FEMALE-R2-B1','2026-03-19 10:09:37.835766','AVAILABLE','2026-03-19 10:09:37.835769',NULL,19,11),(92,'DGH-FEMALE-R2-B2','2026-03-19 10:09:37.836912','AVAILABLE','2026-03-19 10:09:37.836915',NULL,19,11),(93,'DGH-FEMALE-R2-B3','2026-03-19 10:09:37.838577','AVAILABLE','2026-03-19 10:09:37.838582',NULL,19,11),(94,'DGH-FEMALE-R2-B4','2026-03-19 10:09:37.840175','AVAILABLE','2026-03-19 10:09:37.840181',NULL,19,11),(95,'DGH-FEMALE-R2-B5','2026-03-19 10:09:37.841605','AVAILABLE','2026-03-19 10:09:37.841609',NULL,19,11),(96,'DGH-MAT-R1-B1','2026-03-19 10:09:37.846139','AVAILABLE','2026-03-19 10:09:37.846143',NULL,20,12),(97,'DGH-MAT-R1-B2','2026-03-19 10:09:37.847422','AVAILABLE','2026-03-19 10:09:37.847425',NULL,20,12),(98,'DGH-MAT-R1-B3','2026-03-19 10:09:37.848231','AVAILABLE','2026-03-19 10:09:37.848233',NULL,20,12),(99,'DGH-MAT-R1-B4','2026-03-19 10:09:37.848910','AVAILABLE','2026-03-19 10:09:37.848912',NULL,20,12),(100,'DGH-MAT-R1-B5','2026-03-19 10:09:37.849657','AVAILABLE','2026-03-19 10:09:37.849660',NULL,20,12),(101,'YCH-MALE-R1-B1','2026-03-19 10:09:37.853139','AVAILABLE','2026-03-19 10:09:37.853142',NULL,21,13),(102,'YCH-MALE-R1-B2','2026-03-19 10:09:37.854338','AVAILABLE','2026-03-19 10:09:37.854340',NULL,21,13),(103,'YCH-MALE-R1-B3','2026-03-19 10:09:37.855161','AVAILABLE','2026-03-19 10:09:37.855163',NULL,21,13),(104,'YCH-MALE-R1-B4','2026-03-19 10:09:37.856064','AVAILABLE','2026-03-19 10:09:37.856065',NULL,21,13),(105,'YCH-MALE-R1-B5','2026-03-19 10:09:37.856873','AVAILABLE','2026-03-19 10:09:37.856874',NULL,21,13),(106,'YCH-MALE-R2-B1','2026-03-19 10:09:37.858624','AVAILABLE','2026-03-19 10:09:37.858627',NULL,22,13),(107,'YCH-MALE-R2-B2','2026-03-19 10:09:37.859815','AVAILABLE','2026-03-19 10:09:37.859820',NULL,22,13),(108,'YCH-MALE-R2-B3','2026-03-19 10:09:37.861139','AVAILABLE','2026-03-19 10:09:37.861142',NULL,22,13),(109,'YCH-MALE-R2-B4','2026-03-19 10:09:37.862183','AVAILABLE','2026-03-19 10:09:37.862186',NULL,22,13),(110,'YCH-MALE-R2-B5','2026-03-19 10:09:37.863410','AVAILABLE','2026-03-19 10:09:37.863413',NULL,22,13),(111,'YCH-FEMALE-R1-B1','2026-03-19 10:09:37.868107','AVAILABLE','2026-03-19 10:09:37.868111',NULL,23,14),(112,'YCH-FEMALE-R1-B2','2026-03-19 10:09:37.869453','AVAILABLE','2026-03-19 10:09:37.869456',NULL,23,14),(113,'YCH-FEMALE-R1-B3','2026-03-19 10:09:37.870547','AVAILABLE','2026-03-19 10:09:37.870552',NULL,23,14),(114,'YCH-FEMALE-R1-B4','2026-03-19 10:09:37.871565','AVAILABLE','2026-03-19 10:09:37.871569',NULL,23,14),(115,'YCH-FEMALE-R1-B5','2026-03-19 10:09:37.872791','AVAILABLE','2026-03-19 10:09:37.872796',NULL,23,14),(116,'YCH-FEMALE-R2-B1','2026-03-19 10:09:37.875403','AVAILABLE','2026-03-19 10:09:37.875406',NULL,24,14),(117,'YCH-FEMALE-R2-B2','2026-03-19 10:09:37.876467','AVAILABLE','2026-03-19 10:09:37.876470',NULL,24,14),(118,'YCH-FEMALE-R2-B3','2026-03-19 10:09:37.877285','AVAILABLE','2026-03-19 10:09:37.877287',NULL,24,14),(119,'YCH-FEMALE-R2-B4','2026-03-19 10:09:37.878190','AVAILABLE','2026-03-19 10:09:37.878192',NULL,24,14),(120,'YCH-FEMALE-R2-B5','2026-03-19 10:09:37.879171','AVAILABLE','2026-03-19 10:09:37.879173',NULL,24,14),(121,'YCH-MAT-R1-B1','2026-03-19 10:09:37.881492','AVAILABLE','2026-03-19 10:09:37.881493',NULL,25,15),(122,'YCH-MAT-R1-B2','2026-03-19 10:09:37.882041','AVAILABLE','2026-03-19 10:09:37.882042',NULL,25,15),(123,'YCH-MAT-R1-B3','2026-03-19 10:09:37.882484','AVAILABLE','2026-03-19 10:09:37.882485',NULL,25,15),(124,'YCH-MAT-R1-B4','2026-03-19 10:09:37.882946','AVAILABLE','2026-03-19 10:09:37.882947',NULL,25,15),(125,'YCH-MAT-R1-B5','2026-03-19 10:09:37.883453','AVAILABLE','2026-03-19 10:09:37.883454',NULL,25,15);
/*!40000 ALTER TABLE `beds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` text,
  `branch_code` varchar(20) NOT NULL,
  `branch_name` varchar(100) NOT NULL,
  `branch_type` enum('CENTRAL_PHARMACY','HOSPITAL') NOT NULL,
  `city` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `deleted_by` bigint DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `established_date` date DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `registration_number` varchar(50) DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_aqmyw20ht3aku27r3oorfaw43` (`branch_code`),
  UNIQUE KEY `UK_8qeelb6ackyr9u3muvjhwmcj2` (`registration_number`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'Buea Road','CPH','PCC Central Pharmacy','CENTRAL_PHARMACY','Buea','2026-03-19 10:09:37.667039',NULL,NULL,NULL,'central.pharmacy@pcc.cm','2026-03-19',_binary '',_binary '\0','+237 672500625','South West',NULL,NULL,'2026-03-19 10:09:37.667042',NULL),(2,'Molyko','BGH','Buea General Hospital','HOSPITAL','Buea','2026-03-19 10:09:37.669392',NULL,NULL,NULL,'buea.hospital@pcc.cm','2026-03-19',_binary '',_binary '\0','+237 677123456','South West',NULL,NULL,'2026-03-19 10:09:37.669394',NULL),(3,'Down Beach','LRH','Limbe Regional Hospital','HOSPITAL','Limbe','2026-03-19 10:09:37.670966',NULL,NULL,NULL,'limbe.hospital@pcc.cm','2026-03-19',_binary '',_binary '\0','+237 677123457','South West',NULL,NULL,'2026-03-19 10:09:37.670968',NULL),(4,'Kumba Town','KDH','Kumba District Hospital','HOSPITAL','Kumba','2026-03-19 10:09:37.672368',NULL,NULL,NULL,'kumba.hospital@pcc.cm','2026-03-19',_binary '',_binary '\0','+237 677123458','South West',NULL,NULL,'2026-03-19 10:09:37.672369',NULL),(5,'Bonanjo','DGH','Douala General Hospital','HOSPITAL','Douala','2026-03-19 10:09:37.673718',NULL,NULL,NULL,'douala.hospital@pcc.cm','2026-03-19',_binary '',_binary '\0','+237 677123460','Littoral',NULL,NULL,'2026-03-19 10:09:37.673719',NULL),(6,'Mfoundi','YCH','Yaoundé Central Hospital','HOSPITAL','Yaoundé','2026-03-19 10:09:37.674826',NULL,NULL,NULL,'yaounde.hospital@pcc.cm','2026-03-19',_binary '',_binary '\0','+237 677123463','Centre',NULL,NULL,'2026-03-19 10:09:37.674827',NULL);
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultations`
--

DROP TABLE IF EXISTS `consultations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `clinical_notes` text,
  `consultation_date` datetime(6) DEFAULT NULL,
  `consultation_id` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `symptoms` text,
  `updated_at` datetime(6) DEFAULT NULL,
  `branch_id` bigint NOT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6v974o0hr6df9sa502jwudqxg` (`consultation_id`),
  KEY `FK3qse2stjqftij4axhpx1ahdyn` (`branch_id`),
  KEY `FKkog17uvjvkkg4bv6l5eu1ysqw` (`doctor_id`),
  KEY `FKdqyibd6w1h5h66xn9aqx7fwv5` (`patient_id`),
  CONSTRAINT `FK3qse2stjqftij4axhpx1ahdyn` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKdqyibd6w1h5h66xn9aqx7fwv5` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  CONSTRAINT `FKkog17uvjvkkg4bv6l5eu1ysqw` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultations`
--

LOCK TABLES `consultations` WRITE;
/*!40000 ALTER TABLE `consultations` DISABLE KEYS */;
/*!40000 ALTER TABLE `consultations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_entries`
--

DROP TABLE IF EXISTS `emergency_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_entries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `accompanied_by` varchar(255) DEFAULT NULL,
  `additional_info` text,
  `approx_age` int DEFAULT NULL,
  `arrival_time` time(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `emergency_type` varchar(255) NOT NULL,
  `entry_date` date DEFAULT NULL,
  `entry_id` varchar(255) NOT NULL,
  `entry_time` time(6) DEFAULT NULL,
  `gender` enum('FEMALE','MALE','OTHER') NOT NULL,
  `patient_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `send_to_department` varchar(255) DEFAULT NULL,
  `branch_id` bigint NOT NULL,
  `registered_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_t25ss8fwps9o05xocl62fdn50` (`entry_id`),
  KEY `FKg8yiy8w9gd7ej6ati5408rpn6` (`branch_id`),
  KEY `FKg7otnwqvlts0w9xldjaps5md1` (`registered_by`),
  CONSTRAINT `FKg7otnwqvlts0w9xldjaps5md1` FOREIGN KEY (`registered_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKg8yiy8w9gd7ej6ati5408rpn6` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_entries`
--

LOCK TABLES `emergency_entries` WRITE;
/*!40000 ALTER TABLE `emergency_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `emergency_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entries`
--

DROP TABLE IF EXISTS `entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entries` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `bed_number` varchar(255) DEFAULT NULL,
  `brought_by` varchar(255) DEFAULT NULL,
  `condition_description` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `destination` varchar(255) DEFAULT NULL,
  `emergency_type` varchar(255) DEFAULT NULL,
  `entry_id` varchar(255) NOT NULL,
  `entry_time` datetime(6) NOT NULL,
  `entry_type` varchar(255) NOT NULL,
  `exit_time` datetime(6) DEFAULT NULL,
  `expected_exit_time` datetime(6) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `id_proof` varchar(255) DEFAULT NULL,
  `patient_id` bigint DEFAULT NULL,
  `patient_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `purpose_of_visit` varchar(255) DEFAULT NULL,
  `registered_by` varchar(255) DEFAULT NULL,
  `relationship` varchar(255) DEFAULT NULL,
  `room_number` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `visit_type` varchar(255) DEFAULT NULL,
  `visitor_name` varchar(255) DEFAULT NULL,
  `ward_id` bigint DEFAULT NULL,
  `branch_id` bigint NOT NULL,
  `created_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_61is0855fn8jfq4a4qa23sp5e` (`entry_id`),
  KEY `FK8w39e1j39rgthr6n4hvcntnbl` (`branch_id`),
  KEY `FKmfmaerrl4geu0b8inq0hh1fps` (`created_by`),
  CONSTRAINT `FK8w39e1j39rgthr6n4hvcntnbl` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKmfmaerrl4geu0b8inq0hh1fps` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entries`
--

LOCK TABLES `entries` WRITE;
/*!40000 ALTER TABLE `entries` DISABLE KEYS */;
INSERT INTO `entries` VALUES (1,'Test Address',25,NULL,NULL,NULL,NULL,'Reception',NULL,'NOR-20260319111118','2026-03-19 10:11:18.250034','NORMAL',NULL,NULL,'Test Patient Database','MALE',NULL,NULL,NULL,'1234567890','Consultation','Limbe Admin',NULL,NULL,'ACTIVE',NULL,NULL,NULL,2,13),(2,'Emergency Address',35,NULL,NULL,NULL,NULL,'Emergency Room',NULL,'EME-20260319111329','2026-03-19 10:13:29.037256','EMERGENCY',NULL,NULL,'Emergency Patient','FEMALE',NULL,NULL,NULL,'9876543210',NULL,'Limbe Admin',NULL,NULL,'ACTIVE',NULL,NULL,NULL,2,13);
/*!40000 ALTER TABLE `entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `global_settings`
--

DROP TABLE IF EXISTS `global_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `global_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `is_editable` bit(1) DEFAULT NULL,
  `module` varchar(50) DEFAULT NULL,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_dwhdppkpwfs2m7id2b8it40o0` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `global_settings`
--

LOCK TABLES `global_settings` WRITE;
/*!40000 ALTER TABLE `global_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `global_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `due_date` datetime(6) DEFAULT NULL,
  `invoice_date` datetime(6) DEFAULT NULL,
  `invoice_id` varchar(50) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `paid_amount` decimal(38,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `branch_id` bigint NOT NULL,
  `created_by` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_in8ejtpjwbmf9llvtr68vty6t` (`invoice_id`),
  KEY `FK2m7cj392b6vvvhw3ka3fknofh` (`branch_id`),
  KEY `FK9lx1n0d1xu2stp70xvwmdbflt` (`created_by`),
  KEY `FKrpyotno5h237hyoaokuggqqog` (`patient_id`),
  CONSTRAINT `FK2m7cj392b6vvvhw3ka3fknofh` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FK9lx1n0d1xu2stp70xvwmdbflt` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKrpyotno5h237hyoaokuggqqog` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_orders`
--

DROP TABLE IF EXISTS `lab_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `lab_order_id` varchar(50) DEFAULT NULL,
  `order_date` datetime(6) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `branch_id` bigint NOT NULL,
  `consultation_id` bigint DEFAULT NULL,
  `patient_id` bigint NOT NULL,
  `requested_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_hbesl6wr23kyuwr4kj5m00jr9` (`lab_order_id`),
  KEY `FKmmf5buuik18mqcdlvau048636` (`branch_id`),
  KEY `FKfbtsm83netoct4lrnx7i5aweg` (`consultation_id`),
  KEY `FKthw0jarnyedxux7fxbjp6nk7k` (`patient_id`),
  KEY `FKhxobbkta5ix6t5dctclv27ehd` (`requested_by`),
  CONSTRAINT `FKfbtsm83netoct4lrnx7i5aweg` FOREIGN KEY (`consultation_id`) REFERENCES `consultations` (`id`),
  CONSTRAINT `FKhxobbkta5ix6t5dctclv27ehd` FOREIGN KEY (`requested_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmmf5buuik18mqcdlvau048636` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKthw0jarnyedxux7fxbjp6nk7k` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_orders`
--

LOCK TABLES `lab_orders` WRITE;
/*!40000 ALTER TABLE `lab_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `lab_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `license_info`
--

DROP TABLE IF EXISTS `license_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `license_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `license_key` varchar(255) NOT NULL,
  `licensed_to` varchar(255) NOT NULL,
  `max_branches` int DEFAULT NULL,
  `max_users` int DEFAULT NULL,
  `status` enum('ACTIVE','EXPIRED','SUSPENDED') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_aas9u4yn00kqb41p18pln27h9` (`license_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `license_info`
--

LOCK TABLES `license_info` WRITE;
/*!40000 ALTER TABLE `license_info` DISABLE KEYS */;
/*!40000 ALTER TABLE `license_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_gate_entry`
--

DROP TABLE IF EXISTS `patient_gate_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient_gate_entry` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `allergy` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `department` varchar(255) NOT NULL,
  `entry_date` date NOT NULL,
  `entry_id` varchar(255) NOT NULL,
  `entry_time` time(6) NOT NULL,
  `gender` enum('FEMALE','MALE','OTHER') DEFAULT NULL,
  `has_insurance` bit(1) DEFAULT NULL,
  `is_emergency` bit(1) DEFAULT NULL,
  `known_illness` varchar(255) DEFAULT NULL,
  `patient_name` varchar(255) DEFAULT NULL,
  `person_type` enum('EMERGENCY','PATIENT','STAFF','VISITOR') NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `purpose_of_visit` text,
  `registered_by` varchar(255) NOT NULL,
  `status` enum('CANCELLED','COMPLETED','PENDING') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `visit_type` enum('EMERGENCY','INPATIENT_VISIT','LAB','MATERNITY','OUTPATIENT','PHARMACY') NOT NULL,
  `branch_id` bigint NOT NULL,
  `created_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_2yqlk3t7g5iirsfyhv903nwag` (`entry_id`),
  KEY `FK3uvx7oq9ocpbwcv1ad2eo1mrq` (`branch_id`),
  KEY `FKajmhgrjqecjs4rv9hg6w3dj69` (`created_by`),
  CONSTRAINT `FK3uvx7oq9ocpbwcv1ad2eo1mrq` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKajmhgrjqecjs4rv9hg6w3dj69` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_gate_entry`
--

LOCK TABLES `patient_gate_entry` WRITE;
/*!40000 ALTER TABLE `patient_gate_entry` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient_gate_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` text,
  `blood_group` varchar(5) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `emergency_contact_relation` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `gender` enum('FEMALE','MALE','OTHER') NOT NULL,
  `insurance_expiry_date` date DEFAULT NULL,
  `insurance_policy_number` varchar(50) DEFAULT NULL,
  `insurance_provider` varchar(100) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `patient_id` varchar(50) NOT NULL,
  `patient_number` varchar(50) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `branch_id` bigint NOT NULL,
  `registered_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_427e3ubwhw8n7a4id3mmrmjgj` (`patient_id`),
  UNIQUE KEY `UK_8u6p47bdb5ku435q2d64yav3b` (`patient_number`),
  KEY `FK56e51tks50ueeat2lqen1d8s1` (`branch_id`),
  KEY `FKrshad2cg3d0bubebnu1t9cyia` (`registered_by`),
  CONSTRAINT `FK56e51tks50ueeat2lqen1d8s1` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKrshad2cg3d0bubebnu1t9cyia` FOREIGN KEY (`registered_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `module` varchar(50) DEFAULT NULL,
  `permission_code` varchar(50) NOT NULL,
  `permission_name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_3t7dqv661lw96xkq9kqgmbtw6` (`permission_code`),
  UNIQUE KEY `UK_nry1f3jmc4abb5yvkftlvn6vg` (`permission_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `issue_date` datetime(6) DEFAULT NULL,
  `notes` text,
  `prescription_id` varchar(50) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `branch_id` bigint NOT NULL,
  `consultation_id` bigint DEFAULT NULL,
  `doctor_id` bigint NOT NULL,
  `patient_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_q6fr18twglgr4sqy9d9f377tn` (`prescription_id`),
  UNIQUE KEY `UK_q3b3bb5c0v622b426g7lxrglg` (`consultation_id`),
  KEY `FKrq1720s4iacspx1pb9tnfo8b5` (`branch_id`),
  KEY `FK2hdpvkpjjx3plf21194oxjskt` (`doctor_id`),
  KEY `FKqydyol76jn1o37k1bdbkjgq74` (`patient_id`),
  CONSTRAINT `FK2hdpvkpjjx3plf21194oxjskt` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKj6varr98psv2onkoxks6jin14` FOREIGN KEY (`consultation_id`) REFERENCES `consultations` (`id`),
  CONSTRAINT `FKqydyol76jn1o37k1bdbkjgq74` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`),
  CONSTRAINT `FKrq1720s4iacspx1pb9tnfo8b5` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `FKegdk29eiy7mdtefy5c7eirr6e` (`permission_id`),
  CONSTRAINT `FKegdk29eiy7mdtefy5c7eirr6e` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `FKn5fotdgk8d1xvo8nav9uv3muc` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `description` text,
  `is_system_role` bit(1) DEFAULT NULL,
  `role_abbreviation` varchar(10) NOT NULL,
  `role_code` varchar(30) NOT NULL,
  `role_level` int DEFAULT NULL,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_949pwsnk7kxk0px0tbj3r3web` (`role_code`),
  UNIQUE KEY `UK_716hgxp60ym1lifrdgp67xt5k` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'2026-03-19 10:09:37.452637','Administration','System Super Administrator',_binary '','SUP','SUPER_ADMIN',1,'Super Administrator'),(2,'2026-03-19 10:09:37.471359','Pharmacy','Central Pharmacy Administrator',_binary '','CPA','CENTRAL_PHARMACY_ADMIN',2,'Central Pharmacy Admin'),(3,'2026-03-19 10:09:37.478640','Administration','Branch Administrator',_binary '','ADM','BRANCH_ADMIN',3,'Branch Administrator'),(4,'2026-03-19 10:09:37.487286','Consultation','Medical Doctor',_binary '\0','DOC','DOCTOR',4,'Doctor'),(5,'2026-03-19 10:09:37.495202','Operation Theatre','Surgeon',_binary '\0','SUR','SURGEON',4,'Surgeon'),(6,'2026-03-19 10:09:37.503257','Consultation','Medical Specialist',_binary '\0','SPC','SPECIALIST',4,'Specialist'),(7,'2026-03-19 10:09:37.509243','Ward Management','Ward Nurse',_binary '\0','WNR','WARD_NURSE',5,'Ward Nurse'),(8,'2026-03-19 10:09:37.515384','Maternity','Maternity Nurse',_binary '\0','MNR','MATERNITY_NURSE',5,'Maternity Nurse'),(9,'2026-03-19 10:09:37.526351','Operation Theatre','Operation Theatre Nurse',_binary '\0','TNR','THEATRE_NURSE',5,'Theatre Nurse'),(10,'2026-03-19 10:09:37.531662','Treatment Room','Treatment Room Nurse',_binary '\0','TRN','TREATMENT_NURSE',5,'Treatment Nurse'),(11,'2026-03-19 10:09:37.537675','Laboratory','Laboratory Technician',_binary '\0','LAB','LAB_TECHNICIAN',5,'Lab Technician'),(12,'2026-03-19 10:09:37.545256','Imaging','Radiology Technician',_binary '\0','RAD','RADIOLOGY_TECH',5,'Radiology Tech'),(13,'2026-03-19 10:09:37.551711','Pharmacy','Pharmacist',_binary '\0','PHA','PHARMACIST',5,'Pharmacist'),(14,'2026-03-19 10:09:37.557340','Reception','Front Desk Receptionist',_binary '\0','REC','RECEPTIONIST',6,'Receptionist'),(15,'2026-03-19 10:09:37.562116','Billing','Cash Office Staff',_binary '\0','CSH','CASHIER',6,'Cashier'),(16,'2026-03-19 10:09:37.569995','Security','Security Post Guard',_binary '\0','SEC','SECURITY',6,'Security Guard'),(17,'2026-03-19 10:09:37.577547','Accountancy','Accountant',_binary '\0','ACC','ACCOUNTANT',5,'Accountant'),(18,'2026-03-19 10:09:37.583359','Human Resources','Human Resources Manager',_binary '\0','HRM','HR_MANAGER',4,'HR Manager'),(19,'2026-03-19 10:09:37.590429','Logistics','Logistics Officer',_binary '\0','LOG','LOGISTICS',6,'Logistics Officer'),(20,'2026-03-19 10:09:37.598527','Store','Store Keeper',_binary '\0','STK','STORE_KEEPER',6,'Store Keeper'),(21,'2026-03-19 10:09:37.604882','Statistics','Statistics Officer',_binary '\0','STA','STATISTICIAN',5,'Statistician');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `available_beds` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `room_number` varchar(255) NOT NULL,
  `room_type` enum('GENERAL','PRIVATE','SHARED') DEFAULT NULL,
  `total_beds` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `ward_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKneh2pffqfkwk2fiwi5j4mlbpg` (`ward_id`,`room_number`),
  CONSTRAINT `FK8ffj7hiibkh37afvf3u1d12pg` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,5,'2026-03-19 10:09:37.682878','BGH-MALE-R1','GENERAL',5,'2026-03-19 10:09:37.682881',1),(2,5,'2026-03-19 10:09:37.692128','BGH-MALE-R2','GENERAL',5,'2026-03-19 10:09:37.692129',1),(3,5,'2026-03-19 10:09:37.698046','BGH-FEMALE-R1','GENERAL',5,'2026-03-19 10:09:37.698048',2),(4,5,'2026-03-19 10:09:37.709702','BGH-FEMALE-R2','GENERAL',5,'2026-03-19 10:09:37.709704',2),(5,5,'2026-03-19 10:09:37.716615','BGH-MAT-R1','GENERAL',5,'2026-03-19 10:09:37.716616',3),(6,5,'2026-03-19 10:09:37.726970','LRH-MALE-R1','GENERAL',5,'2026-03-19 10:09:37.726973',4),(7,5,'2026-03-19 10:09:37.732931','LRH-MALE-R2','GENERAL',5,'2026-03-19 10:09:37.732935',4),(8,5,'2026-03-19 10:09:37.739352','LRH-FEMALE-R1','GENERAL',5,'2026-03-19 10:09:37.739354',5),(9,5,'2026-03-19 10:09:37.747301','LRH-FEMALE-R2','GENERAL',5,'2026-03-19 10:09:37.747304',5),(10,5,'2026-03-19 10:09:37.755879','LRH-MAT-R1','GENERAL',5,'2026-03-19 10:09:37.755884',6),(11,5,'2026-03-19 10:09:37.765897','KDH-MALE-R1','GENERAL',5,'2026-03-19 10:09:37.765901',7),(12,5,'2026-03-19 10:09:37.775084','KDH-MALE-R2','GENERAL',5,'2026-03-19 10:09:37.775086',7),(13,5,'2026-03-19 10:09:37.784710','KDH-FEMALE-R1','GENERAL',5,'2026-03-19 10:09:37.784715',8),(14,5,'2026-03-19 10:09:37.794843','KDH-FEMALE-R2','GENERAL',5,'2026-03-19 10:09:37.794847',8),(15,5,'2026-03-19 10:09:37.806366','KDH-MAT-R1','GENERAL',5,'2026-03-19 10:09:37.806368',9),(16,5,'2026-03-19 10:09:37.811884','DGH-MALE-R1','GENERAL',5,'2026-03-19 10:09:37.811888',10),(17,5,'2026-03-19 10:09:37.820486','DGH-MALE-R2','GENERAL',5,'2026-03-19 10:09:37.820489',10),(18,5,'2026-03-19 10:09:37.829159','DGH-FEMALE-R1','GENERAL',5,'2026-03-19 10:09:37.829163',11),(19,5,'2026-03-19 10:09:37.834847','DGH-FEMALE-R2','GENERAL',5,'2026-03-19 10:09:37.834848',11),(20,5,'2026-03-19 10:09:37.844628','DGH-MAT-R1','GENERAL',5,'2026-03-19 10:09:37.844633',12),(21,5,'2026-03-19 10:09:37.851842','YCH-MALE-R1','GENERAL',5,'2026-03-19 10:09:37.851851',13),(22,5,'2026-03-19 10:09:37.857580','YCH-MALE-R2','GENERAL',5,'2026-03-19 10:09:37.857582',13),(23,5,'2026-03-19 10:09:37.866218','YCH-FEMALE-R1','GENERAL',5,'2026-03-19 10:09:37.866225',14),(24,5,'2026-03-19 10:09:37.874209','YCH-FEMALE-R2','GENERAL',5,'2026-03-19 10:09:37.874213',14),(25,5,'2026-03-19 10:09:37.880941','YCH-MAT-R1','GENERAL',5,'2026-03-19 10:09:37.880944',15);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_activity_log`
--

DROP TABLE IF EXISTS `user_activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_activity_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(100) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `error_message` text,
  `execution_time_ms` int DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `module` varchar(50) DEFAULT NULL,
  `new_value` longtext,
  `old_value` longtext,
  `resource_id` varchar(50) DEFAULT NULL,
  `resource_type` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `user_agent` text,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_activity_log`
--

LOCK TABLES `user_activity_log` WRITE;
/*!40000 ALTER TABLE `user_activity_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_branch_assignments`
--

DROP TABLE IF EXISTS `user_branch_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_branch_assignments` (
  `branch_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  `assigned_at` datetime(6) DEFAULT NULL,
  `is_primary` bit(1) DEFAULT NULL,
  `assigned_by` bigint DEFAULT NULL,
  PRIMARY KEY (`branch_id`,`user_id`),
  KEY `FKexkxar0f8twgt8t87wejwveka` (`user_id`),
  KEY `FKthaussqn6d06ks1uj6gn05yjo` (`assigned_by`),
  CONSTRAINT `FKexkxar0f8twgt8t87wejwveka` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKouhg8ertv8oluu50ljc1b363d` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKthaussqn6d06ks1uj6gn05yjo` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_branch_assignments`
--

LOCK TABLES `user_branch_assignments` WRITE;
/*!40000 ALTER TABLE `user_branch_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_branch_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `device_info` varchar(500) DEFAULT NULL,
  `expiry_time` datetime(6) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `last_activity` datetime(6) DEFAULT NULL,
  `login_time` datetime(6) NOT NULL,
  `logout_time` datetime(6) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `session_token` varchar(100) NOT NULL,
  `user_agent` varchar(500) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_h3bafswclg0jyaj1vi6sgg7o5` (`session_token`),
  UNIQUE KEY `UK_5ou0u1pqftlypbt1wcsbl5hgh` (`refresh_token`),
  KEY `FK8klxsgb8dcjjklmqebqp1twd5` (`user_id`),
  CONSTRAINT `FK8klxsgb8dcjjklmqebqp1twd5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
INSERT INTO `user_sessions` VALUES (1,NULL,'2026-03-20 10:11:18.178010','0:0:0:0:0:0:0:1',_binary '','2026-03-19 10:11:18.178414','2026-03-19 10:11:18.178007',NULL,'dca052b7-0818-4ba9-9cb7-7afb4eb14933','cc22ff07-2d9e-42b2-8e8d-1a4b76b9eaf2','curl/8.5.0',12),(2,NULL,'2026-03-20 10:12:50.179445','0:0:0:0:0:0:0:1',_binary '','2026-03-19 10:12:50.179618','2026-03-19 10:12:50.179443',NULL,'b63b06a6-4a99-4cd4-b537-0a16d5e45c66','4d4e9136-ce2a-4896-9006-7c533b932a16','curl/8.5.0',12),(3,NULL,'2026-03-20 10:13:28.995036','0:0:0:0:0:0:0:1',_binary '','2026-03-19 10:13:28.995115','2026-03-19 10:13:28.995034',NULL,'feb03577-4f0a-4c6c-826b-5174bf86e5ab','caee6f1b-00d9-46f1-847a-aa7edf601592','curl/8.5.0',12),(4,NULL,'2026-03-20 10:15:07.527784','0:0:0:0:0:0:0:1',_binary '','2026-03-19 10:15:07.527912','2026-03-19 10:15:07.527782',NULL,'a6e21471-2bab-407f-85e1-37742d173c2f','d4c9074a-1d7e-4e95-b85b-1b1d66d375a9','curl/8.5.0',12),(5,NULL,'2026-03-20 10:32:11.992957','0:0:0:0:0:0:0:1',_binary '','2026-03-19 10:32:11.993398','2026-03-19 10:32:11.992931',NULL,'45da0d40-24fb-499a-9f80-7d518caa87aa','1a94c234-3abe-44c5-860a-ce8ff61be1ba','curl/8.5.0',12),(6,NULL,'2026-03-20 10:34:10.843362','127.0.0.1',_binary '','2026-03-19 11:09:10.902430','2026-03-19 10:34:10.843344',NULL,'29de7053-5060-498e-9924-2e64ae1763cb','571a6c10-df17-4f5d-a445-ab8fe8ea93e4','Mozilla/5.0 (X11; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0',12),(7,NULL,'2026-03-20 10:38:55.965073','0:0:0:0:0:0:0:1',_binary '','2026-03-19 10:38:55.965232','2026-03-19 10:38:55.965066',NULL,'b5732f14-1a2b-440d-889b-b968eaa6bcb3','0d3256b3-de76-4c94-bb23-93528f6bb82e','curl/8.5.0',12),(8,NULL,'2026-03-20 11:07:16.587326','0:0:0:0:0:0:0:1',_binary '','2026-03-19 11:07:16.587716','2026-03-19 11:07:16.587317',NULL,'c9b0f21f-bcbc-471d-8c65-78904d398437','3fca110a-78b2-4fa4-8d98-8dd630a3c93f','curl/8.5.0',12),(9,NULL,'2026-03-20 11:12:46.749356','127.0.0.1',_binary '','2026-03-19 11:32:47.564708','2026-03-19 11:12:46.749353',NULL,'a5f25835-1ed3-4ad3-b6f2-69a5158ec0be','08b7a1fb-6e19-4bf0-8b62-12226f552924','Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0',12);
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `failed_attempts` int DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `is_locked` bit(1) DEFAULT NULL,
  `is_password_expired` bit(1) DEFAULT NULL,
  `last_login_at` datetime(6) DEFAULT NULL,
  `last_login_ip` varchar(45) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `password_changed_at` datetime(6) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `staff_id` varchar(50) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `created_by` bigint DEFAULT NULL,
  `primary_branch_id` bigint DEFAULT NULL,
  `role_id` bigint NOT NULL,
  `updated_by` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`),
  UNIQUE KEY `UK_hijqejqge8g6evxs6j44rny9k` (`staff_id`),
  KEY `FKibk1e3kaxy5sfyeekp8hbhnim` (`created_by`),
  KEY `FK9bkake0u3o9dn8u9qaieom3s8` (`primary_branch_id`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  KEY `FKci7xr690rvyv3bnfappbyh8x0` (`updated_by`),
  CONSTRAINT `FK9bkake0u3o9dn8u9qaieom3s8` FOREIGN KEY (`primary_branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKci7xr690rvyv3bnfappbyh8x0` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKibk1e3kaxy5sfyeekp8hbhnim` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-03-19 10:09:38.113026','super.admin@pcc.cm',0,'System',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Administrator','$2a$10$p31WJ3DpUMKebq/LgUAISeJq3GdCC.nlQTkJPD4yXEE9VYWjGdonC',NULL,NULL,NULL,'SUP-001','2026-03-19 10:09:38.113029','super.admin',NULL,1,1,NULL),(2,'2026-03-19 10:09:38.218864','admin.buea@pcc.cm',0,'Buea',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Admin','$2a$10$6NGl6c.XTxej4ZN4NuTzLOo/yfKK3Jdc3bz5IVrJB38VkkU/Ac9Wq',NULL,NULL,NULL,'BGH-ADM-001','2026-03-19 11:47:03.569141','admin.buea',NULL,2,3,NULL),(3,'2026-03-19 10:09:38.313945','dr.mbella@buea.pcc.cm',0,'Sarah',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Mbella','$2a$10$3Z4EECpRYf.c/3mTxmYTSe8R6wZASZOwLnp4ljWxWupM.HF8yMht.',NULL,NULL,NULL,'BGH-DOC-001','2026-03-19 11:47:03.724686','dr.mbella',NULL,2,4,NULL),(4,'2026-03-19 10:09:38.403387','dr.ndifor@buea.pcc.cm',0,'John',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Ndifor','$2a$10$zH1m655UvT2JUdkrRiGrUuaJ4FhNYS9aG3tzeD9i.5VXxj7QtHXyK',NULL,NULL,NULL,'BGH-DOC-002','2026-03-19 11:47:03.872234','dr.ndifor',NULL,2,4,NULL),(5,'2026-03-19 10:09:38.489941','dr.ngwa@buea.pcc.cm',0,'Elizabeth',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Ngwa','$2a$10$FVpSoTlYKwEGtHrtdP/.C.gvRgSff.VyfloxnbruDDC4L01unwpR6',NULL,NULL,NULL,'BGH-DOC-003','2026-03-19 11:47:04.009872','dr.ngwa',NULL,2,4,NULL),(6,'2026-03-19 10:09:38.576860','nurse.akono@buea.pcc.cm',0,'Marie',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Akono','$2a$10$5JxlOmQ8F2Vzf1JrAkKKZebLLsUpQarZazk6Ns8GOvt5ZroplqvvO',NULL,NULL,NULL,'BGH-WNR-001','2026-03-19 11:47:04.147877','nurse.akono',NULL,2,7,NULL),(7,'2026-03-19 10:09:38.670353','nurse.efua@buea.pcc.cm',0,'Paul',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Efua','$2a$10$ZyD83uwMidHHgBp3NCDFwOPgddFHlw6dT4whtUpUrQAd24NpZzbkG',NULL,NULL,NULL,'BGH-WNR-002','2026-03-19 11:47:04.285114','nurse.efua',NULL,2,7,NULL),(8,'2026-03-19 10:09:38.757122','lab.taku@buea.pcc.cm',0,'James',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Taku','$2a$10$471Ac3zH9Nhjzk4O567OZunewdvQ/KI3fcj2vaagMgqTuC/49p4Zy',NULL,NULL,NULL,'BGH-LAB-001','2026-03-19 11:47:04.421403','lab.taku',NULL,2,11,NULL),(9,'2026-03-19 10:09:38.839363','pharm.ngale@buea.pcc.cm',0,'Beatrice',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Ngale','$2a$10$ikGZpmNpSTGNubGQEvByb.NQ1Sk/CYUoRi.89Y1NXJrg5Dc60qM0u',NULL,NULL,NULL,'BGH-PHA-001','2026-03-19 11:47:04.557363','pharm.ngale',NULL,2,13,NULL),(10,'2026-03-19 10:09:38.916414','cash.enyi@buea.pcc.cm',0,'Peter',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Enyi','$2a$10$B8vobNdtdcRXhztZVuPfluq1LrPb6jDfbSpvHFPjgwVdtwqFu3DDO',NULL,NULL,NULL,'BGH-CSH-001','2026-03-19 11:47:04.693844','cash.enyi',NULL,2,15,NULL),(11,'2026-03-19 10:09:38.991290','reception.mbua@buea.pcc.cm',0,'Christine',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Mbua','$2a$10$ED9nz7/nT9dVAqfCimanVuxUHE2crGHijGtLdt50y1LrbHi6/OQcS',NULL,NULL,NULL,'BGH-REC-001','2026-03-19 11:47:04.831281','reception.mbua',NULL,2,14,NULL),(12,'2026-03-19 10:09:39.065772','sec.motuba@buea.pcc.cm',0,'David',_binary '',_binary '\0',_binary '\0','2026-03-19 11:12:46.747141','127.0.0.1','Motuba','$2a$10$n5YRa2Yb4clfGaF5GQzTu.DkDu9SyD5iHDAfHoxAz9MAsukFq5.ea',NULL,NULL,NULL,'BGH-SEC-001','2026-03-19 11:47:04.967059','sec.motuba',NULL,2,16,NULL),(13,'2026-03-19 10:09:39.146134','admin.limbe@pcc.cm',0,'Limbe',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Admin','$2a$10$EZ95/KfSvs6ouIPEjvcjWeFZHP7C1V30cR2T7GND5HZSZ57FaULPa',NULL,NULL,NULL,'LRH-ADM-001','2026-03-19 11:47:05.103299','admin.limbe',NULL,3,3,NULL),(14,'2026-03-19 10:09:39.230091','admin.kumba@pcc.cm',0,'Kumba',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Admin','$2a$10$WEWaYMuLDDGaS3iMKfxt/.NHA3QLqY/uNp76/DiuHII/q2K51Xu/G',NULL,NULL,NULL,'KDH-ADM-001','2026-03-19 11:47:05.238929','admin.kumba',NULL,4,3,NULL),(15,'2026-03-19 10:09:39.311335','admin.yaounde@pcc.cm',0,'Yaounde',_binary '',_binary '\0',_binary '\0',NULL,NULL,'Admin','$2a$10$KIfqv23W07oatUHgfLf9t.bl7EXvKy0Ah3GQ4Jczg3YsxxfAMkPYK',NULL,NULL,NULL,'YCH-ADM-001','2026-03-19 11:47:05.379103','admin.yaounde',NULL,6,3,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitor_logs`
--

DROP TABLE IF EXISTS `visitor_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitor_logs` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `bed_number` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `entry_time` time(6) NOT NULL,
  `exit_time` time(6) DEFAULT NULL,
  `expected_exit_time` time(6) DEFAULT NULL,
  `national_id` varchar(255) DEFAULT NULL,
  `patient_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) NOT NULL,
  `registered_by` varchar(255) NOT NULL,
  `relationship` varchar(255) DEFAULT NULL,
  `room_number` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','CANCELLED','COMPLETED') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `visit_purpose` text,
  `visitor_id` varchar(255) NOT NULL,
  `visitor_name` varchar(255) NOT NULL,
  `visitor_pass_number` varchar(255) DEFAULT NULL,
  `ward_id` bigint DEFAULT NULL,
  `branch_id` bigint NOT NULL,
  `created_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_o0bnpvya9t9t2gd2dme9n9cju` (`visitor_id`),
  UNIQUE KEY `UK_qwur60cbu1q7wmhubqq237rkr` (`visitor_pass_number`),
  KEY `FKkhotwr8p0m4yxq9x49p0klg84` (`branch_id`),
  KEY `FKjgghiv2nr1kmlnmy997vnx10d` (`created_by`),
  CONSTRAINT `FKjgghiv2nr1kmlnmy997vnx10d` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  CONSTRAINT `FKkhotwr8p0m4yxq9x49p0klg84` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitor_logs`
--

LOCK TABLES `visitor_logs` WRITE;
/*!40000 ALTER TABLE `visitor_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `visitor_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitors`
--

DROP TABLE IF EXISTS `visitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitors` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `bed_number` varchar(255) DEFAULT NULL,
  `entry_time` datetime(6) NOT NULL,
  `exit_time` datetime(6) DEFAULT NULL,
  `expected_exit_time` datetime(6) DEFAULT NULL,
  `id_proof` varchar(255) DEFAULT NULL,
  `patient_id` bigint DEFAULT NULL,
  `patient_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `purpose_of_visit` varchar(255) DEFAULT NULL,
  `registered_by` varchar(255) DEFAULT NULL,
  `relationship` varchar(255) DEFAULT NULL,
  `room_number` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `visitor_id` varchar(255) NOT NULL,
  `visitor_name` varchar(255) NOT NULL,
  `visitor_pass_number` varchar(255) DEFAULT NULL,
  `ward_id` bigint DEFAULT NULL,
  `branch_id` bigint NOT NULL,
  `created_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_fg7rbm01xdesvyc161cnyk09l` (`visitor_id`),
  UNIQUE KEY `UK_g67m28y5knohc30iy5q6e8w8f` (`visitor_pass_number`),
  KEY `FK9wbq0kwju14fic62kx4bg1542` (`branch_id`),
  KEY `FKfsfhgefg0a62im1dawevdxugu` (`created_by`),
  CONSTRAINT `FK9wbq0kwju14fic62kx4bg1542` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  CONSTRAINT `FKfsfhgefg0a62im1dawevdxugu` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitors`
--

LOCK TABLES `visitors` WRITE;
/*!40000 ALTER TABLE `visitors` DISABLE KEYS */;
/*!40000 ALTER TABLE `visitors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wards`
--

DROP TABLE IF EXISTS `wards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `available_beds` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `floor` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `occupied_beds` int NOT NULL,
  `total_beds` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `ward_code` varchar(255) NOT NULL,
  `ward_name` varchar(255) NOT NULL,
  `ward_type` enum('CHILDREN','FEMALE','ICU','MALE','MATERNITY','PRIVATE') NOT NULL,
  `branch_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_8yen4iqooo0buumls31g7e0qx` (`ward_code`),
  KEY `FK7uh2ur6i4cisl0a1c8cmd3mjn` (`branch_id`),
  CONSTRAINT `FK7uh2ur6i4cisl0a1c8cmd3mjn` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wards`
--

LOCK TABLES `wards` WRITE;
/*!40000 ALTER TABLE `wards` DISABLE KEYS */;
INSERT INTO `wards` VALUES (1,10,'2026-03-19 10:09:37.680939','Floor 1',_binary '',0,10,'2026-03-19 10:09:37.680943','BGH-MALE','Male General Ward','MALE',2),(2,10,'2026-03-19 10:09:37.697053','Floor 1',_binary '',0,10,'2026-03-19 10:09:37.697054','BGH-FEMALE','Female General Ward','FEMALE',2),(3,5,'2026-03-19 10:09:37.715718','Floor 2',_binary '',0,5,'2026-03-19 10:09:37.715720','BGH-MAT','Maternity Ward','MATERNITY',2),(4,10,'2026-03-19 10:09:37.725782','Floor 1',_binary '',0,10,'2026-03-19 10:09:37.725786','LRH-MALE','Male General Ward','MALE',3),(5,10,'2026-03-19 10:09:37.738571','Floor 1',_binary '',0,10,'2026-03-19 10:09:37.738575','LRH-FEMALE','Female General Ward','FEMALE',3),(6,5,'2026-03-19 10:09:37.753994','Floor 2',_binary '',0,5,'2026-03-19 10:09:37.753998','LRH-MAT','Maternity Ward','MATERNITY',3),(7,10,'2026-03-19 10:09:37.764515','Floor 1',_binary '',0,10,'2026-03-19 10:09:37.764519','KDH-MALE','Male General Ward','MALE',4),(8,10,'2026-03-19 10:09:37.782475','Floor 1',_binary '',0,10,'2026-03-19 10:09:37.782478','KDH-FEMALE','Female General Ward','FEMALE',4),(9,5,'2026-03-19 10:09:37.805325','Floor 2',_binary '',0,5,'2026-03-19 10:09:37.805329','KDH-MAT','Maternity Ward','MATERNITY',4),(10,10,'2026-03-19 10:09:37.810628','Floor 1',_binary '',0,10,'2026-03-19 10:09:37.810630','DGH-MALE','Male General Ward','MALE',5),(11,10,'2026-03-19 10:09:37.827822','Floor 1',_binary '',0,10,'2026-03-19 10:09:37.827825','DGH-FEMALE','Female General Ward','FEMALE',5),(12,5,'2026-03-19 10:09:37.843003','Floor 2',_binary '',0,5,'2026-03-19 10:09:37.843007','DGH-MAT','Maternity Ward','MATERNITY',5),(13,10,'2026-03-19 10:09:37.850505','Floor 1',_binary '',0,10,'2026-03-19 10:09:37.850507','YCH-MALE','Male General Ward','MALE',6),(14,10,'2026-03-19 10:09:37.864569','Floor 1',_binary '',0,10,'2026-03-19 10:09:37.864573','YCH-FEMALE','Female General Ward','FEMALE',6),(15,5,'2026-03-19 10:09:37.880041','Floor 2',_binary '',0,5,'2026-03-19 10:09:37.880043','YCH-MAT','Maternity Ward','MATERNITY',6);
/*!40000 ALTER TABLE `wards` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-21  9:28:19
