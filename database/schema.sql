-- Validex UP - Esquema Real Sincronizado (v1.3)
-- Generado por Antigravity tras AuditorÝa de Fidelidad

CREATE DATABASE IF NOT EXISTS validexdb;
USE validexdb;

CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `ix_Roles_nombre` (`nombre`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `permisos` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_permiso`),
  UNIQUE KEY `ix_Permisos_nombre` (`nombre`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `pipas` (
  `id_pipa` int NOT NULL AUTO_INCREMENT,
  `placa` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacidad_litros` decimal(10,2) NOT NULL,
  `proveedor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` enum('ACTIVA','INACTIVA','EN_DESCARGA') COLLATE utf8mb4_unicode_ci DEFAULT 'ACTIVA',
  PRIMARY KEY (`id_pipa`),
  UNIQUE KEY `placa` (`placa`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `face` text COLLATE utf8mb4_unicode_ci,
  `rol` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'GERENTE',
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `face_embedding` text COLLATE utf8mb4_unicode_ci,
  `id_rol` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `rolpermisos` (
  `id_rol` int NOT NULL,
  `id_permiso` int NOT NULL,
  PRIMARY KEY (`id_rol`,`id_permiso`),
  KEY `id_permiso` (`id_permiso`),
  CONSTRAINT `rolpermisos_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  CONSTRAINT `rolpermisos_ibfk_2` FOREIGN KEY (`id_permiso`) REFERENCES `permisos` (`id_permiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `bitacora` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `accion` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `detalles` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_hora` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_log`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `bitacora_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `codigosotp` (
  `id_otp` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `codigo` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expira_at` datetime DEFAULT NULL,
  `usado` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id_otp`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `codigosotp_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sesiones` (
  `id_sesion` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `token_jwt` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paso_1_login` tinyint(1) DEFAULT '0',
  `paso_2_sms` tinyint(1) DEFAULT '0',
  `paso_3_face` tinyint(1) DEFAULT '0',
  `dispositivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expira_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_sesion`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `operacionesdescarga` (
  `id_operacion` int NOT NULL AUTO_INCREMENT,
  `id_pipa` int NOT NULL,
  `id_usuario` int NOT NULL,
  `volumen_objetivo` decimal(10,2) NOT NULL,
  `volumen_actual` decimal(10,2) DEFAULT '0.00',
  `caudal_lpm` decimal(10,2) DEFAULT '0.00',
  `estado` enum('INICIADA','EN_PROGRESO','INTERRUMPIDA','FINALIZADA') COLLATE utf8mb4_unicode_ci DEFAULT 'INICIADA',
  `fecha_inicio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin` datetime DEFAULT NULL,
  PRIMARY KEY (`id_operacion`),
  KEY `id_pipa` (`id_pipa`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `operacionesdescarga_ibfk_1` FOREIGN KEY (`id_pipa`) REFERENCES `pipas` (`id_pipa`) ON DELETE CASCADE,
  CONSTRAINT `operacionesdescarga_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cargascombustible` (
  `id_carga` int NOT NULL AUTO_INCREMENT,
  `id_pipa` int DEFAULT NULL,
  `litros_descargados` decimal(10,2) NOT NULL,
  `tipo_combustible` enum('MAGNA','PREMIUM','DIESEL') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `autorizado_por` int DEFAULT NULL,
  `fecha_carga` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado_carga` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `litros_objetivo` decimal(10,2) DEFAULT NULL,
  `id_operacion` int DEFAULT NULL,
  PRIMARY KEY (`id_carga`),
  KEY `id_pipa` (`id_pipa`),
  KEY `autorizado_por` (`autorizado_por`),
  KEY `fk_carga_operacion` (`id_operacion`),
  CONSTRAINT `cargascombustible_ibfk_1` FOREIGN KEY (`id_pipa`) REFERENCES `pipas` (`id_pipa`) ON DELETE SET NULL,
  CONSTRAINT `cargascombustible_ibfk_2` FOREIGN KEY (`autorizado_por`) REFERENCES `usuario` (`id_usuario`) ON DELETE SET NULL,
  CONSTRAINT `fk_carga_operacion` FOREIGN KEY (`id_operacion`) REFERENCES `operacionesdescarga` (`id_operacion`) ON DELETE SET NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

