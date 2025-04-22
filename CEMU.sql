-- Tabela 1: Faculdade
CREATE TABLE Faculdade (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela 2: Curso
CREATE TABLE Curso (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(60) NOT NULL UNIQUE,
    Faculdade_ID INT UNSIGNED,
    FOREIGN KEY (Faculdade_ID) REFERENCES Faculdad_ID () ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela 3: Estudantes
CREATE TABLE Estudante (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(50) NOT NULL,
    Sobrenome VARCHAR(40) NOT NULL,
    Curso_ID INT UNSIGNED NOT NULL,
    Telefone VARCHAR(15),
    Email VARCHAR(100) UNIQUE,
    Estado ENUM('Pendente', 'Ativo', 'Inativo') DEFAULT 'Pendente',
    Faculdade_ID INT UNSIGNED,
    FOREIGN KEY (Curso_ID) REFERENCES Curso (ID),
    FOREIGN KEY (Faculdade_ID) REFERENCES Faculdade (ID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabela 4: Empresas 
CREATE TABLE Empresa (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    NIF VARCHAR(20) UNIQUE NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Provincia VARCHAR(40) NOT NULL,
    Telefone VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE,
    Status ENUM('Ativo', 'Inativo', 'Pendente') DEFAULT 'Pendente'
);

-- Tabela 5: Relação Empresa - Cursos
CREATE TABLE Empresa_Curso (
    Empresa_ID INT UNSIGNED NOT NULL,
    Curso_ID INT UNSIGNED NOT NULL,
    PRIMARY KEY (Empresa_ID, Curso_ID),
    FOREIGN KEY (Empresa_ID) REFERENCES Empresa (ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Curso_ID) REFERENCES Curso (ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela 6: Estágios
CREATE TABLE Estagio (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Estudante_ID INT UNSIGNED,
    Empresa_ID INT UNSIGNED,
    Provincia VARCHAR(30) NOT NULL,
    Municipio VARCHAR(40) NOT NULL,
    Rua VARCHAR(40) NOT NULL,
    Tipo TINYINT(1) NOT NULL COMMENT '0 = Voluntário, 1 = Acadêmico',
    Modalidade TINYINT(1) NOT NULL COMMENT '0 = Atribuído, 1 = Adquirido',
    Remunerado TINYINT(1) NOT NULL COMMENT '0 = Não, 1 = Sim',
    Responsavel_Nome VARCHAR(70),
    Responsavel_Telefone VARCHAR(15),
    Inicio DATE NOT NULL,
    Termino DATE NOT NULL,
    FOREIGN KEY (Estudante_ID) REFERENCES Estudante (ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Empresa_ID) REFERENCES Empresa (ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela 7: FeedbackEstagio
CREATE TABLE FeedbackEstagio (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Estagio_ID INT UNSIGNED,
    Estudante_ID INT UNSIGNED,
    Empresa_ID INT UNSIGNED,
    Feedback TINYINT NOT NULL CHECK (Feedback BETWEEN 1 AND 5) COMMENT '1 = Péssimo, 2 = Ruim, 3 = Mediano, 4 = Bom, 5 = Excelente',
    Comentario TEXT,
    DataFeedback TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Estagio_ID) REFERENCES Estagio (ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Estudante_ID) REFERENCES Estudante (ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Empresa_ID) REFERENCES Empresa (ID) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (Estagio_ID, Estudante_ID)
);

ALTER TABLE Curso 
CHANGE COLUMN Faculdade_ID Faculdade_ID INT UNSIGNED,
ADD FOREIGN KEY (Faculdade_ID) REFERENCES Faculdade(ID) ON DELETE CASCADE ON UPDATE CASCADE;


CREATE INDEX idx_faculdade_nome ON Faculdade(Nome);
CREATE INDEX idx_curso_nome ON Curso(Nome);
CREATE INDEX idx_empresa_provincia ON Empresa(Provincia);

ALTER TABLE Estudante
ADD COLUMN Sexo TINYINT(1)() DEFAULT NULL
AFTER Sobrenome;

ALTER TABLE Estudante
ADD COLUMN Sexo CHAR(1) NOT NULL COMMENT 'M = Masculino, F = Feminino';
