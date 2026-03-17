-- ======================================================
-- Validex UP - Esquema Unificado (v1.2 - Docker Ready)
-- Consolidación de Real-Time Pipas y Autenticación
-- ======================================================

CREATE DATABASE IF NOT EXISTS ValidexDB;
USE ValidexDB;   

-- 1. TABLA DE USUARIOS
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(15),
    face TEXT,
    rol VARCHAR(20) DEFAULT 'GERENTE',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABLA DE SESIONES
CREATE TABLE IF NOT EXISTS Sesiones (
    id_sesion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    token_jwt VARCHAR(500),
    paso_1_login BOOLEAN DEFAULT FALSE,
    paso_2_sms BOOLEAN DEFAULT FALSE,
    paso_3_face BOOLEAN DEFAULT FALSE,
    dispositivo VARCHAR(255),
    expira_at DATETIME,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. TABLA DE CÓDIGOS OTP
CREATE TABLE IF NOT EXISTS CodigosOTP (
    id_otp INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    codigo VARCHAR(6) NOT NULL,
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_at DATETIME,
    usado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. TABLA DE PIPAS
CREATE TABLE IF NOT EXISTS Pipas (
    id_pipa INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) UNIQUE NOT NULL,
    capacidad_litros DECIMAL(10,2) NOT NULL,
    proveedor VARCHAR(100),
    estado ENUM('ACTIVA', 'INACTIVA', 'EN_DESCARGA') DEFAULT 'ACTIVA'
) ENGINE=InnoDB;

-- 5. TABLA DE OPERACIONES DE DESCARGA (Ciclo de vida en tiempo real)
CREATE TABLE IF NOT EXISTS OperacionesDescarga (
    id_operacion    INT AUTO_INCREMENT PRIMARY KEY,
    id_pipa         INT NOT NULL,
    id_usuario      INT NOT NULL,
    volumen_objetivo DECIMAL(10,2) NOT NULL,
    volumen_actual  DECIMAL(10,2) DEFAULT 0.00,
    caudal_lpm      DECIMAL(10,2) DEFAULT 0.00,
    estado          ENUM('INICIADA','EN_PROGRESO','INTERRUMPIDA','FINALIZADA') DEFAULT 'INICIADA',
    fecha_inicio    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin       DATETIME NULL,
    FOREIGN KEY (id_pipa)    REFERENCES Pipas(id_pipa)   ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. TABLA DE CARGAS DE COMBUSTIBLE
CREATE TABLE IF NOT EXISTS CargasCombustible (
    id_carga INT AUTO_INCREMENT PRIMARY KEY,
    id_pipa INT,
    id_operacion INT NULL,
    litros_descargados DECIMAL(10,2) NOT NULL,
    tipo_combustible ENUM('MAGNA','PREMIUM','DIESEL'),
    autorizado_por INT,
    fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pipa) REFERENCES Pipas(id_pipa) ON DELETE SET NULL,
    FOREIGN KEY (autorizado_por) REFERENCES Usuario(id_usuario) ON DELETE SET NULL,
    FOREIGN KEY (id_operacion) REFERENCES OperacionesDescarga(id_operacion) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. TABLA DE BITÁCORA
CREATE TABLE IF NOT EXISTS Bitacora (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    accion VARCHAR(100),
    detalles TEXT,
    ip_address VARCHAR(45),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;
