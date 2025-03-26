// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('../backend/db/db'); // Importa o pool criado em db.js
const estudantesRoutes = require('./routes/estudantes');
const empresasRoutes = require('./routes/empresas');

const app = express();
app.use(cors());
app.use(express.json());

// Teste de conexão
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

// Rota de teste
app.get('/', (req, res) => {
    res.send('API rodando!');
});

// Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
