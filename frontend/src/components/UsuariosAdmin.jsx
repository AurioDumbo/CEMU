import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import editIcon from '../assets/icons/edit.svg';
import deleteIcon from '../assets/icons/delete.svg';

export default function UsuariosAdmin() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '3'
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    email: '',
    role: '3'
  });

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get('http://localhost:5001/api/usuarios');
        setUsuarios(res.data);

        if (id) {
          const usuario = res.data.find(u => u.ID === parseInt(id));
          if (usuario) {
            setEditId(usuario.ID);
            setEditData({
              email: usuario.email,
              role: String(usuario.role)
            });
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        toast.error('Erro ao carregar usuários');
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();
  }, [id]);

  const HANDLE_SUBMIT = async (e) => {
    e.preventDefault();
    try {
      await api.post('http://localhost:5001/api/usuarios/register', formData);
      toast.success('Usuário criado com sucesso!');
      setFormData({ email: '', password: '', role: '3' });
      setLoading(true);
      const res = await api.get('http://localhost:5001/api/usuarios');
      setUsuarios(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário');
    }
  };

  const handleEdit = (usuario) => {
    setEditId(usuario.id || usuario.ID);
    setEditData({
      email: usuario.email,
      role: String(usuario.role)
    });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditData({ email: '', role: '3' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!editId) {
        toast.error('ID do usuário não encontrado');
        return;
      }

      const response = await api.put(
        `http://localhost:5001/api/usuarios/${editId}`,
        {
          email: editData.email,
          role: editData.role
        }
      );

      if (response.status === 200) {
        toast.success('Usuário atualizado com sucesso!');
        const res = await api.get('http://localhost:5001/api/usuarios');
        setUsuarios(res.data);
        setEditId(null);
        setEditData({ email: '', role: '3' });
      }
    } catch (error) {
      console.error('Erro na atualização:', error);
      if (error.response?.status === 401) {
        toast.error('Sessão expirada. Faça login novamente.');
        navigate('/login');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Erro ao atualizar usuário. Tente novamente.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await api.delete(`http://localhost:5001/api/usuarios/${id}`);
      toast.success('Usuário excluído com sucesso!');
      const res = await api.get('http://localhost:5001/api/usuarios');
      setUsuarios(res.data);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Gerenciar Usuários
        </h1>

        {/* Formulário de edição */}
        {editId !== null && (
          <div className="mb-8 p-6 bg-red-50 rounded-lg border border-red-200">
            <h2 className="text-lg font-semibold text-red-800 mb-4">Editar Usuário</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  value={editData.email}
                  onChange={e => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuário
                </label>
                <select
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  value={editData.role}
                  onChange={e => setEditData({ ...editData, role: e.target.value })}
                >
                  <option value="1">Administrador</option>
                  <option value="2">Funcionário</option>
                  <option value="3">Leitor</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulário de criação */}
        {editId === null && (
          <form onSubmit={HANDLE_SUBMIT} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Usuário
              </label>
              <select
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="1">Administrador</option>
                <option value="2">Funcionário</option>
                <option value="3">Leitor</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Adicionar Usuário
            </button>
          </form>
        )}

        {/* Lista de usuários */}
        <table className="w-full text-left mb-4">
          <thead>
            <tr>
              <th className="pb-2">E-mail</th>
              <th className="pb-2">Tipo</th>
              <th className="pb-2 w-32">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id || usuario.ID} className="border-t">
                <td className="py-2">{usuario.email}</td>
                <td className="py-2">
                  {usuario.role === 1
                    ? 'Administrador'
                    : usuario.role === 2
                    ? 'Funcionário'
                    : 'Leitor'}
                </td>
                <td className="flex gap-2 py-2">
                  <button
                    onClick={() => handleEdit(usuario)}
                    className="p-2 rounded hover:bg-red-50 transition-colors"
                    title="Editar"
                  >
                    <img src={editIcon} alt="Editar" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id || usuario.ID)}
                    className="p-2 rounded hover:bg-red-50 transition-colors"
                    title="Excluir"
                  >
                    <img src={deleteIcon} alt="Excluir" className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}