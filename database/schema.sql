-- ======================================================
-- Validex UP - Esquema Abraham (Rama: testAbraham)
-- ======================================================

CREATE DATABASE IF NOT EXISTS ValidexDB;
USE ValidexDB;   

-- 1. TABLA DE USUARIOS (Registro y Login en uno solo)
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL, -- Nombre real (ej. Abraham Orozco)
    username VARCHAR(50) UNIQUE NOT NULL,  -- Identificador único para el Login
    password_hash VARCHAR(255) NOT NULL,   -- Aquí guardarás la clave con Bcrypt
    telefono VARCHAR(15),                  -- Para Twilio (formato +52...)
    face TEXT,                   			-- Vector de la cara (DeepFace)
    rol VARCHAR(20) DEFAULT 'GERENTE',     -- Rol predefinido
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABLA DE SESIONES (Control de los 3 pasos de seguridad)
-- sirve para registrar los pasos que se estan cumpliento
CREATE TABLE IF NOT EXISTS Sesiones (
    id_sesion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    token_jwt VARCHAR(500),                -- El token que se genera al final
    paso_1_login BOOLEAN DEFAULT FALSE,    -- ¿Pasó contraseña?
    paso_2_sms BOOLEAN DEFAULT FALSE,      -- ¿Pasó SMS?
    paso_3_face BOOLEAN DEFAULT FALSE,     -- ¿Pasó cara?
    dispositivo VARCHAR(255),              -- Opcional: Para saber de qué PC entró
    expira_at DATETIME,                    -- Fecha de cierre automático
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. TABLA DE CÓDIGOS OTP (Para los SMS de Twilio)
-- one time password
CREATE TABLE IF NOT EXISTS CodigosOTP (
    id_otp INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    codigo VARCHAR(6) NOT NULL,            -- El número que envía Twilio
    creado_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_at DATETIME,                    -- Ejemplo: 5 minutos después
    usado BOOLEAN DEFAULT FALSE,           -- Para que no se use dos veces
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. TABLA DE PIPAS (Vehículos de transporte de combustible)
-- Esta tabla registra los vehículos autorizados para el transporte
CREATE TABLE IF NOT EXISTS Pipas (
    id_pipa INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) UNIQUE NOT NULL,
    capacidad_litros DECIMAL(10,2) NOT NULL,
    proveedor VARCHAR(100),
    estado ENUM('ACTIVA','INACTIVA') DEFAULT 'ACTIVA'
) ENGINE=InnoDB;

-- 5. TABLA DE CARGAS DE COMBUSTIBLE
-- Guarda las descargas autorizadas de combustible,
-- registrando la pipa, litros, tipo y el usuario que autorizó.
CREATE TABLE IF NOT EXISTS CargasCombustible (
    id_carga INT AUTO_INCREMENT PRIMARY KEY,
    id_pipa INT,
    litros_descargados DECIMAL(10,2) NOT NULL,
    tipo_combustible ENUM('MAGNA','PREMIUM','DIESEL'),
    autorizado_por INT,
    fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pipa) REFERENCES Pipas(id_pipa) ON DELETE SET NULL,
    FOREIGN KEY (autorizado_por) REFERENCES Usuario(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. TABLA DE BITÁCORA (Historial de acciones)
-- Esto es para que la maestra vea quién autorizó qué cosa
CREATE TABLE IF NOT EXISTS Bitacora (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    accion VARCHAR(100),                   -- Ej: "Inicio sesión", "Autorizó carga"
    detalles TEXT,                         -- Ej: "Acceso concedido tras MFA"
    ip_address VARCHAR(45),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE SET NULL
) ENGINE=InnoDB;
