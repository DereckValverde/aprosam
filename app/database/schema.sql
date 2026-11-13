-- SQLiteDC

--Habilitar las llaves foráneas en SQLite
PRAGMA foreign_keys = ON;

----------------------------
--Módulo Horario
----------------------------
CREATE TABLE IF NOT EXISTS Colaboradoras(
idColaboradora INTEGER PRIMARY KEY AUTOINCREMENT,
nombre TEXT NOT NULL,
apellido1 TEXT,
apellido2 TEXT
);

----------------------------
--Módulo Médicamentos
----------------------------

-- Tabla: Medicamentos
CREATE TABLE IF NOT EXISTS Medicamentos(
idMedicamento INTEGER PRIMARY KEY AUTOINCREMENT,
nombre TEXT NOT NULL
);

-- Tabla: Usuarios 
CREATE TABLE IF NOT EXISTS Usuarios(
idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
nombre TEXT NOT NULL,
apellido1 TEXT,
apellido2 TEXT
);

-- Tabla intermedia: Usuarios_Medicamentos
CREATE TABLE IF NOT EXISTS Usuarios_Medicamentos(
idUsuario INTEGER NOT NULL,
idMedicamento INTEGER NOT NULL,
PRIMARY KEY (idUsuario,idMedicamento),
FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE CASCADE,
FOREIGN KEY (idMedicamento) REFERENCES Medicamentos(idMedicamento) ON DELETE CASCADE
);

-- Tabla: Fichas_Medicas
CREATE TABLE IF NOT EXISTS Fichas_Medicas(
idFicha INTEGER PRIMARY KEY AUTOINCREMENT,
idUsuario INTEGER NOT NULL,
idMedicamento INTEGER NOT NULL,
fecha_ingreso TEXT NOT NULL, -- FORMATO: YYYY-MM-DD
fecha_vencimiento TEXT NOT NULL, -- FORMATO: YYYY-MM-DD
lote TEXT NOT NULL,
encargada TEXT NOT NULL,
fecha_registro_sistema TEXT DEFAULT CURRENT_TIMESTAMP, --Guarda fecha y hora automáticamente
FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario) ON DELETE RESTRICT,
FOREIGN KEY (idMedicamento) REFERENCES Medicamentos(idMedicamento) ON DELETE RESTRICT
);


----------------------------
--Módulo Inventario
----------------------------

--Tabla: Distribuidora 
CREATE TABLE IF NOT EXISTS Distribuidora(
idDistribuidora INTEGER PRIMARY KEY AUTOINCREMENT,
nombre_distribuidora TEXT NOT NULL
);

--Tabla: Categorias
CREATE TABLE IF NOT EXISTS Categorias(
idCategoria INTEGER PRIMARY KEY AUTOINCREMENT,
nombre_categoria TEXT NOT NULL
);

-- Tabla: Inventario
CREATE TABLE IF NOT EXISTS Inventario(
idProducto INTEGER PRIMARY KEY AUTOINCREMENT,
nombre_producto TEXT NOT NULL,
stock_actual INTEGER DEFAULT 0,
stock_ideal INTEGER DEFAULT 0,
idCategoria INTEGER NOT NULL,
idDistribuidora INTEGER NOT NULL,
FOREIGN KEY (idCategoria) REFERENCES Categorias(idCategoria) ON DELETE RESTRICT,
FOREIGN KEY (idDistribuidora) REFERENCES Distribuidora(idDistribuidora) ON DELETE RESTRICT
);


-- Inserts de las colaboradoras:
INSERT INTO Colaboradoras (nombre) VALUES 
('Heilyn'),
('Karla'),
('Katherine'),
('Norma'),
('Romaneth'),
('Sandra'),
('Xinia'),
('Yocsine');


-- Insertse de las categoriás

INSERT INTO Categorias (nombre_categoria) VALUES
('abarrotes'),
('carnes'),
('verduras'),
('articulosPersonales'),
('jabones')

SELECT * FROM Categorias;