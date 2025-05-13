const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cemu',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Add this after pool creation
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});

// Add this to your execute wrapper
const execute = async (...args) => {
    try {
        const result = await pool.execute(...args);
        return result;
    } catch (error) {
        console.error('Database execute error:', error);
        throw error;
    }
};

// Função para inicializar o banco de dados
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Criar tabela de Faculdade
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS Faculdade (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Nome VARCHAR(255) NOT NULL,
                Estado ENUM('Ativo', 'Inativo') DEFAULT 'Ativo'
            )
        `);

        // Criar tabela de Curso
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS Curso (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Nome VARCHAR(255) NOT NULL,
                Faculdade_ID INT,
                Estado ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
                FOREIGN KEY (Faculdade_ID) REFERENCES Faculdade(ID)
            )
        `);

        // Criar tabela de Estudante
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS Estudante (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Nome VARCHAR(255) NOT NULL,
                Sobrenome VARCHAR(255) NOT NULL,
                Curso_ID INT,
                Telefone VARCHAR(20),
                Email VARCHAR(255),
                Faculdade_ID INT,
                Estado ENUM('Pendente', 'Aprovado', 'Rejeitado') DEFAULT 'Pendente',
                Sexo ENUM('Masculino', 'Feminino') NOT NULL,
                Provincia VARCHAR(255) NOT NULL,
                FOREIGN KEY (Curso_ID) REFERENCES Curso(ID),
                FOREIGN KEY (Faculdade_ID) REFERENCES Faculdade(ID)
            )
        `);

        // Criar tabela de Empresa
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS Empresa (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                NIF VARCHAR(50) NOT NULL UNIQUE,
                Nome VARCHAR(255) NOT NULL,
                Provincia VARCHAR(255),
                Telefone VARCHAR(20) UNIQUE,
                Email VARCHAR(255) UNIQUE,
                Status ENUM('Ativo', 'Pendente', 'Inativo') DEFAULT 'Ativo'
            )
        `);

        // Criar tabela de Empresa_Curso
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS Empresa_Curso (
                Empresa_ID INT,
                Curso_ID INT,
                PRIMARY KEY (Empresa_ID, Curso_ID),
                FOREIGN KEY (Empresa_ID) REFERENCES Empresa(ID) ON DELETE CASCADE,
                FOREIGN KEY (Curso_ID) REFERENCES Curso(ID) ON DELETE CASCADE
            )
        `);

        connection.release();
        console.log('Banco de dados inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
}

initializeDatabase();

module.exports = pool;
