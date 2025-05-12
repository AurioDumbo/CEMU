const { sign } = require('jsonwebtoken');
const { hash, compare } = require('bcrypt');
const User = require('../models/user');
const LoginLog = require('../models/LoginLog');

const register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'E-mail já está em uso' });
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword, role: role || 3 });

        res.status(201).json({ message: 'Usuário registrado com sucesso', user: newUser });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await LoginLog.create({ email: user.email });

        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error });
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
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        // Verificar se o email já existe para outro usuário
        if (email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'E-mail já está em uso' });
            }
        }

        await user.update({ email, role });
        res.json({ message: 'Usuário atualizado com sucesso', user });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar usuário', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        await user.destroy();
        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).json({ message: 'Erro ao excluir usuário', error: error.message });
    }
};

module.exports = { register, login, isAdmin, updateUser, deleteUser };