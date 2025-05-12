import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaEnvelope, FaUserCog, FaLock, FaSignOutAlt } from 'react-icons/fa';

export default function Perfil() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    role: '',
    ultimoAcesso: '',
    dataCriacao: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/usuarios/perfil', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        if (error.response?.status === 401) {
          toast.error('Sessão expirada. Por favor, faça login novamente.');
          sessionStorage.removeItem('token');
          navigate('/login');
        } else {
          toast.error('Erro ao carregar dados do perfil');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Sessão expirada. Por favor, faça login novamente.');
      navigate('/login');
      return;
    }

    try {
      await axios.put('http://localhost:5001/api/usuarios/alterar-senha',
        { novaSenha: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Senha alterada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
      setEditMode(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Por favor, faça login novamente.');
        sessionStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Erro ao alterar senha');
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
    toast.success('Sessão encerrada com sucesso');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não disponível';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  const getRoleName = (role) => {
    switch (role) {
      case '1':
        return 'Administrador';
      case '2':
        return 'Usuário';
      default:
        return 'Não definido';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Perfil do Usuário</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              {editMode ? 'Cancelar Edição' : 'Alterar Senha'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center gap-2"
            >
              <FaSignOutAlt />
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <FaEnvelope className="text-2xl text-blue-600 min-w-[2rem]" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-medium">{userData.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <FaUserCog className="text-2xl text-blue-600 min-w-[2rem]" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Nível de Acesso</p>
              <p className="text-lg font-medium">{getRoleName(userData.role)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <FaLock className="text-2xl text-blue-600 min-w-[2rem]" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Último Acesso</p>
              <p className="text-lg font-medium">{formatDate(userData.ultimoAcesso)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <FaLock className="text-2xl text-blue-600 min-w-[2rem]" />
            <div className="flex-1">
              <p className="text-sm text-gray-500">Conta Criada em</p>
              <p className="text-lg font-medium">{formatDate(userData.dataCriacao)}</p>
            </div>
          </div>
        </div>

        {editMode && (
          <form onSubmit={handlePasswordChange} className="mt-8 space-y-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Alterar Senha</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Salvar Nova Senha
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}