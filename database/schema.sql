-- Validex UP - Esquema Inicial de Base de Datos
-- Propietario: Miembro 4 (DBA)

CREATE DATABASE IF NOT EXISTS validex_db;
USE validex_db;

-- Tabla de Usuarios (Gestion de Cuentas)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    rol ENUM('ADMIN', 'GERENTE') DEFAULT 'GERENTE',
    esta_activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Biometria (Almacenamiento de fotos base)
CREATE TABLE IF NOT EXISTS biometria_usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    foto_referencia LONGBLOB,
    vector_biometrico JSON,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tablas de Negocio (Pipas y Despachos)
CREATE TABLE IF NOT EXISTS pipas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(20) UNIQUE NOT NULL,
    capacidad_total DECIMAL(10,2),
    estatus ENUM('PENDIENTE', 'DESCARGANDO', 'COMPLETADO') DEFAULT 'PENDIENTE'
);

CREATE TABLE IF NOT EXISTS despachos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pipa_id INT NOT NULL,
    autorizado_por_id INT NOT NULL,
    litros_descargados DECIMAL(10,2),
    fecha_autorizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pipa_id) REFERENCES pipas(id),
    FOREIGN KEY (autorizado_por_id) REFERENCES usuarios(id)
);
