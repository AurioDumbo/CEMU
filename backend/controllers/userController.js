const { sign } = require('jsonwebtoken');
const { hash, compare } = require('bcrypt');
const User = require('../models/user');
const LoginLog = require('../models/LoginLog');
const db = require('../config/db');

const register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'E-mail já está em uso' });
        }

        const hashedPassword = await hash(password, 10);
        const userId = await User.create({ email, password: hashedPassword, role: role || 3 });

        res.status(201).json({ message: 'Usuário registrado com sucesso', user: { id: userId, email, role: role || 3 } });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        console.log('Usuario encontrado:', user ? 'SÍ' : 'NO');
        if (user) {
            console.log('Password en BD:', user.password); // Si sale undefined, aquí está el error.
            const isPasswordValid = await compare(password, user.password);
            console.log('¿Password válida?:', isPasswordValid);
        }
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


        await LoginLog.create({ userId: user.id });

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

function isAdmin(req, res, next) {
    if (req.user.role === 1) {
        return next();
    }
    return res.status(403).json({ message: 'Acesso negado: apenas administradores.' });
}

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, role } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }


        if (email !== user.email) {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'E-mail já está em uso' });
            }
        }

       
        await require('../config/db').execute(
            'UPDATE users SET email = ?, role = ? WHERE id = ?',
            [email, role, id]
        );
        res.json({ message: 'Usuário atualizado com sucesso', user: { id, email, role } });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await require('../config/db').execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ message: 'Erro ao excluir usuário', error: error.message });
    }
};

const listarUsuarios = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT id, email, role FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

const alterarSenha = async (req, res) => {
    console.log('Rota alterarSenha foi chamada!'); // Adicione esta linha
    try {
        const userId = req.user.id;
        const { novaSenha } = req.body;
        if (!novaSenha || novaSenha.length < 6) {
            return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
        }
        const hashedPassword = await hash(novaSenha, 10);
        await User.updatePassword(userId, hashedPassword);
        res.json({ message: 'Senha alterada com sucesso!' });
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({ message: 'Erro ao alterar senha', error: error.message });
    }
};

const getRoleName = (role) => {
    const roles = {
        1: 'Administrador',
        2: 'Funcionário',
        3: 'Leitor'
    };
    return roles[role] || 'Não definido';
};

const perfilUsuario = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }


        const [logs] = await db.execute(
            'SELECT login_at FROM login_logs WHERE user_id = ? ORDER BY login_at DESC LIMIT 1',
            [user.id]
        );
        const ultimoAcesso = logs.length > 0 ? logs[0].login_at : null;

        res.json({
            email: user.email,
            role: user.role,
            roleName: getRoleName(user.role),
            ultimoAcesso: ultimoAcesso,
            dataCriacao: user.createdAt || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
    }
};

module.exports = { register, login, isAdmin, updateUser, deleteUser, listarUsuarios, alterarSenha, perfilUsuario };