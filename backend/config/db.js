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

        connection.release();
        console.log('Banco de dados inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    }
}

initializeDatabase();

module.exports = pool;
