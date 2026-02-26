-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role TINYINT NOT NULL DEFAULT 3,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela 1: Faculdade
CREATE TABLE IF NOT EXISTS Faculdade (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela 2: Curso
CREATE TABLE IF NOT EXISTS Curso (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(60) NOT NULL UNIQUE,
    Faculdade_ID INT UNSIGNED,
    FOREIGN KEY (Faculdade_ID) REFERENCES Faculdade(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela 3: Estudantes
CREATE TABLE IF NOT EXISTS Estudante (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(50) NOT NULL,
    Sobrenome VARCHAR(40) NOT NULL,
    Sexo CHAR(1) NOT NULL COMMENT 'M = Masculino, F = Feminino',
    Curso_ID INT UNSIGNED NOT NULL,
    Telefone VARCHAR(15),
    Email VARCHAR(100) UNIQUE,
    Estado ENUM('Pendente', 'Ativo', 'Inativo') DEFAULT 'Pendente',
    Faculdade_ID INT UNSIGNED,
    FOREIGN KEY (Curso_ID) REFERENCES Curso (ID),
    FOREIGN KEY (Faculdade_ID) REFERENCES Faculdade (ID) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabela 4: Empresas 
CREATE TABLE IF NOT EXISTS Empresa (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    NIF VARCHAR(20) UNIQUE NOT NULL,
    Nome VARCHAR(100) NOT NULL,
    Provincia VARCHAR(40) NOT NULL,
    Telefone VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE,
    Status ENUM('Ativo', 'Inativo', 'Pendente') DEFAULT 'Pendente'
);

-- Tabela 5: Relação Empresa - Cursos
CREATE TABLE IF NOT EXISTS Empresa_Curso (
    Empresa_ID INT UNSIGNED NOT NULL,
    Curso_ID INT UNSIGNED NOT NULL,
    PRIMARY KEY (Empresa_ID, Curso_ID),
    FOREIGN KEY (Empresa_ID) REFERENCES Empresa (ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Curso_ID) REFERENCES Curso (ID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabela 6: Estágios
CREATE TABLE IF NOT EXISTS Estagio (
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
CREATE TABLE IF NOT EXISTS FeedbackEstagio (
    ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Estagio_ID INT UNSIGNED,
    Estudante_ID INT UNSIGNED,
    Empresa_ID INT UNSIGNED,
    Feedback TINYINT NOT NULL COMMENT '1 = Péssimo, 2 = Ruim, 3 = Mediano, 4 = Bom, 5 = Excelente' CHECK (Feedback BETWEEN 1 AND 5) ,
    Comentario TEXT,
    DataFeedback TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Estagio_ID) REFERENCES Estagio (ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Estudante_ID) REFERENCES Estudante (ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Empresa_ID) REFERENCES Empresa (ID) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE (Estagio_ID, Estudante_ID)
);

CREATE INDEX idx_faculdade_nome ON Faculdade(Nome);
CREATE INDEX idx_curso_nome ON Curso(Nome);
CREATE INDEX idx_empresa_provincia ON Empresa(Provincia);

-- Tabela: login_logs
DROP TABLE IF EXISTS login_logs;

CREATE TABLE login_logs (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
<<<<<<< Updated upstream
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
=======
    FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE CASCADE ON UPDATE CASCADE
>>>>>>> Stashed changes
);
