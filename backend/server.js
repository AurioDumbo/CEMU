// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Corrigido o caminho para o arquivo db.js
const sequelize = require('./config/database'); // Corrigido o caminho para o arquivo database.js
const dotenv = require('dotenv');

const empresaCursoRoutes = require('./routes/empresaCurso'); // Corrigido o caminho
const estudantesRoutes = require('./routes/estudantes'); // Corrigido o caminho
const empresasRoutes = require('./routes/empresas'); // Corrigido o caminho
const estagiosRoutes = require('./routes/estagios'); // Corrigido o caminho
const feedbackEstagioRoutes = require('./routes/feedbackEstagio'); // Corrigido o caminho
const userRoutes = require('./routes/userRoutes'); // Corrigido o caminho

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conecta ao banco de dados e sincroniza os modelos
sequelize.sync()
    .then(() => console.log('Banco de dados sincronizado'))
    .catch((err) => console.error('Erro ao sincronizar o banco de dados:', err));

(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Conectado ao MySQL');
        connection.release();
    } catch (err) {
        console.error('Erro ao conectar no MySQL:', err);
    }
})();

// Rotas
app.use('/api/estudantes', estudantesRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/empresa_curso', empresaCursoRoutes);
app.use('/api/estagios', estagiosRoutes);
app.use('/api/feedback', feedbackEstagioRoutes);
app.use('/api/usuarios', userRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('API rodando!');
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
