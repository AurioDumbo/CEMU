import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaUserCog, FaClock, FaCalendarAlt, FaKey, FaSignOutAlt } from 'react-icons/fa';

export default function Perfil() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: '',
        role: '',
        ultimoAcesso: null,
        dataCriacao: null
    });
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        // eslint-disable-next-line
    }, []);

    const fetchUserData = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const response = await api.get('http://localhost:5001/api/usuarios/perfil');
            setUserData(response.data);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            if (error.response?.status === 401) {
                sessionStorage.removeItem('token');
                navigate('/login');
            }
            toast.error('Erro ao carregar dados do perfil');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token'); 
            console.log('Token:', token); 
            if (!token) {
                toast.error('Token não encontrado. Faça login novamente.');
                navigate('/login');
                return;
            }
            const response = await api.put(
                'http://localhost:5001/api/usuarios/alterar-senha',
                { novaSenha: passwords.newPassword },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Senha alterada com sucesso!');
                setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            toast.error('Erro ao alterar senha');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('refreshToken');
        sessionStorage.removeItem('role');
        toast.success('Logout realizado!');
        navigate('/login');
    };

    const getRoleName = (role) => {
        const roles = {
            1: 'Administrador',
            2: 'Funcionário',
            3: 'Leitor'
        };
        return roles[role] || 'Não definido';
    };

    const formatDate = (date) => {
        if (!date) return 'Não disponível';
     
        return new Date(date.replace(' ', 'T')).toLocaleString('pt-BR');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Perfil do Usuário</h2>
                <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                </button>
            </div>
            <div className="space-y-6">
                {/* Informações do Usuário */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
                        <FaEnvelope className="text-red-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{userData.email}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
                        <FaUserCog className="text-red-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-500">Tipo de Usuário</p>
                            <p className="font-medium">{getRoleName(userData.role)}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
                        <FaClock className="text-red-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-500">Último Acesso</p>
                            <p className="font-medium">{formatDate(userData.ultimoAcesso)}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
                        <FaCalendarAlt className="text-red-600 text-xl" />
                        <div>
                            <p className="text-sm text-gray-500">Conta Criada em</p>
                            <p className="font-medium">{formatDate(userData.dataCriacao)}</p>
                        </div>
                    </div>
                </div>

                {/* Botão Alterar Senha */}
                <div className="mt-6">
                    <button
                        onClick={() => setIsChangingPassword(!isChangingPassword)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        <FaKey className="mr-2" />
                        {isChangingPassword ? 'Cancelar' : 'Alterar Senha'}
                    </button>
                </div>

                {/* Formulário de Alteração de Senha */}
                {isChangingPassword && (
                    <form onSubmit={handlePasswordChange} className="mt-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nova Senha
                                </label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({
                                        ...passwords,
                                        newPassword: e.target.value
                                    })}
                                    className="w-full p-2 border rounded-md"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar Senha
                                </label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({
                                        ...passwords,
                                        confirmPassword: e.target.value
                                    })}
                                    className="w-full p-2 border rounded-md"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Salvar Nova Senha
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}