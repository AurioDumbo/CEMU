const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const sequelize = require('./config/database');
const { Estudante, updateEstudanteEstado } = require('./models/estudante');
const cron = require('node-cron');
const http = require('http');
const { Server } = require('socket.io');
const { emitirNotificacoesEstagios } = require('./controllers/estagiosController');

const empresaCursoRoutes = require('./routes/empresaCurso');
const estudantesRoutes = require('./routes/estudantes');
const empresasRoutes = require('./routes/empresas');
const estagiosRoutes = require('./routes/estagios');
const feedbackEstagioRoutes = require('./routes/feedbackEstagio');
const userRoutes = require('./routes/userRoutes');
const cursoRoutes = require('./routes/curso');
const faculdadeRoutes = require('./routes/faculdade');
const dashboardRoutes = require('./routes/dashboardRoutes');
const provinciasRoutes = require("./routes/provincias.routes");
const authRoutes = require('./routes/authRoutes');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

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

// Agendar atualização diária do estado dos estudantes
cron.schedule('0 0 * * *', async () => {
  try {
    await updateEstudanteEstado();
  } catch (error) {
    console.error('Erro ao executar atualização agendada dos estados:', error);
  }
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/estudantes', estudantesRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/empresa_curso', empresaCursoRoutes);
app.use('/api/estagios', estagiosRoutes);
app.use('/api/feedback', feedbackEstagioRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/faculdade', faculdadeRoutes);
app.use('/api/curso', cursoRoutes);
app.use('/api/provincias', provinciasRoutes);

app.get('/api/mensagem',(req, res) => {
    res.json({mensagem: 'Backend rodando'})
})

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

cron.schedule('0 8 * * *', async () => { 
  try {
    await emitirNotificacoesEstagios();
  } catch (error) {
    console.error('Erro ao emitir notificações de estágios:', error);
  }
});

module.exports = { app, server, io };
