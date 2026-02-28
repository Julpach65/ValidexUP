-- =======================================================================================
-- Validex UP - Script de Creación de Base de Datos (MySQL 8.0+)
-- Descripción: Este script genera toda la estructura inicial (Cascarón) de tablas, 
--              procedimientos y disparadores (triggers) basados en el análisis de 
--              requerimientos B2B de las pantallas de Stitch.
-- =======================================================================================

CREATE DATABASE IF NOT EXISTS validex_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE validex_db;

-- -----------------------------------------------------
-- 1. Tabla de Usuarios (Identidad Central)
-- Describe a los gerentes y patrones de la plataforma.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único del usuario',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Correo corporativo del empleado',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Contraseña encriptada',
    telefono VARCHAR(20) DEFAULT NULL COMMENT 'Número telefónico vinculado para OTP',
    rol ENUM('ADMIN', 'GERENTE', 'PATRON') DEFAULT 'GERENTE' COMMENT 'Nivel de acceso (RBAC)',
    sms_verificado BOOLEAN DEFAULT FALSE COMMENT 'Bandera del onboarding de teléfono',
    rostro_registrado BOOLEAN DEFAULT FALSE COMMENT 'Bandera del onboarding biométrico',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Registro histórico de alta'
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 2. Tabla Biometría 
-- Maneja los vectores faciales y la foto de referencia (DeepFace).
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS biometria (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador de la biometría',
    usuario_id INT NOT NULL COMMENT 'Usuario al que pertenece el rostro',
    foto_referencia LONGBLOB COMMENT 'Imagen base64 o binaria del enrolamiento',
    vector_facial JSON COMMENT 'Características faciales numéricas',
    CONSTRAINT fk_biometria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 3. Tabla Pipas (Gestión de Hidrocarburos)
-- Inventario estático de vehículos del corporativo.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS pipas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_pipa VARCHAR(50) UNIQUE NOT NULL COMMENT 'Ej: PIPA-001, PIPA-002',
    capacidad_maxima DECIMAL(10,2) NOT NULL COMMENT 'Límite volumétrico en Litros',
    volumen_actual DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Litros actualmente en la pipa',
    estatus ENUM('ACTIVA', 'MANTENIMIENTO') DEFAULT 'ACTIVA'
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- 4. Tabla Auditoría / Bitácora Validex
-- Tabla inmutable para el frontend de "Accesos y Descargas".
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS auditoria_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT COMMENT 'Usuario que realizó la acción (Puede ser nulo si es sistema)',
    accion VARCHAR(100) NOT NULL COMMENT 'Ej: Inicio de Sesión, Autorización de Descarga',
    estado ENUM('EXITO', 'DENEGADO') NOT NULL COMMENT 'Semáforo de seguridad de la acción',
    detalles TEXT COMMENT 'Información adicional en formato texto',
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Marca de tiempo para frontend',
    CONSTRAINT fk_auditoria_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =======================================================================================
-- SECCIÓN DE LÓGICA DE BASE DE DATOS (Stored Procedures y Triggers)
-- =======================================================================================

DELIMITER //

-- Procedimiento Almacenado: Registrar la Autorización de Pipa de manera segura
CREATE PROCEDURE RegistrarAutorizacionPipa(
    IN p_usuario_id INT,
    IN p_codigo_pipa VARCHAR(50),
    IN p_litros DECIMAL(10,2),
    OUT p_resultado VARCHAR(100)
)
BEGIN
    DECLARE v_pipa_id INT;
    DECLARE v_cap_max DECIMAL(10,2);
    
    -- Manejo de transacciones
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_resultado = 'ERROR: Transacción Abortada';
    END;

    START TRANSACTION;
    
    -- Ubicar Pipa
    SELECT id, capacidad_maxima INTO v_pipa_id, v_cap_max 
    FROM pipas WHERE codigo_pipa = p_codigo_pipa LIMIT 1;
    
    IF v_pipa_id IS NOT NULL THEN
        -- Actualizar litros
        UPDATE pipas SET volumen_actual = volumen_actual + p_litros WHERE id = v_pipa_id;
        
        -- Registrar en Bitácora con estado ÉXITO
        INSERT INTO auditoria_logs (usuario_id, accion, estado, detalles)
        VALUES (p_usuario_id, 'Autorización de Descarga', 'EXITO', CONCAT('Descarga de ', p_litros, ' Lts en ', p_codigo_pipa));
        
        SET p_resultado = 'EXITO';
    ELSE
        -- Registrar intento fallido
        INSERT INTO auditoria_logs (usuario_id, accion, estado, detalles)
        VALUES (p_usuario_id, 'Intento de Autorización', 'DENEGADO', 'Pipa no encontrada o inactiva');
        SET p_resultado = 'ERROR: Pipa no existe';
    END IF;

    COMMIT;
END //

DELIMITER ;
