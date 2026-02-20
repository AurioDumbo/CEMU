import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import editIcon from '../assets/icons/edit.svg';
import deleteIcon from '../assets/icons/delete.svg';
import Modal from './Modal';

export default function FaculdadesAdmin() {
  const navigate = useNavigate();
  const [faculdades, setFaculdades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
  });
  const [editId, setEditId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, faculdadeId: null });

  useEffect(() => {
    const fetchFaculdades = async () => {
      try {
        const response = await api.get('/api/faculdade');
        setFaculdades(response.data);
      } catch (error) {
        console.error('Erro ao carregar faculdades:', error);
        toast.error('Erro ao carregar faculdades');
      } finally {
        setLoading(false);
      }
    };
    fetchFaculdades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome.trim()) {
      toast.error('Digite o nome da faculdade');
      return;
    }
    try {
      await api.post(
        '/api/faculdade',
        { Nome: formData.nome }
      );
      toast.success('Faculdade adicionada com sucesso!');
      setFormData({ nome: '' });
      setLoading(true);
      const response = await api.get('/api/faculdade');
      setFaculdades(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao adicionar faculdade:', error);
      toast.error('Erro ao adicionar faculdade');
    }
  };

  const handleEdit = (faculdade) => {
    setEditId(faculdade.ID);
    setEditNome(faculdade.Nome);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editNome.trim()) {
      toast.error('Digite o nome da faculdade');
      return;
    }
    try {
      await api.put(
        `/api/faculdade/${editId}`,
        { Nome: editNome }
      );
      toast.success('Faculdade atualizada!');
      setEditId(null);
      setEditNome('');
      setLoading(true);
      const response = await api.get('/api/faculdade');
      setFaculdades(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao atualizar faculdade:', error);
      toast.error('Erro ao atualizar faculdade');
    }
  };

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, faculdadeId: id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/faculdade/${deleteModal.faculdadeId}`);
      toast.success('Faculdade excluída!');
      setLoading(true);
      const response = await api.get('/api/faculdade');
      setFaculdades(response.data);
    } catch (error) {
      console.error('Erro ao excluir faculdade:', error);
      toast.error('Erro ao excluir faculdade');
    } finally {
      setDeleteModal({ isOpen: false, faculdadeId: null });
      setLoading(false);
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
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Gerenciar Faculdades
        </h1>

    
        {editId ? (
          <form onSubmit={handleUpdate} className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Faculdade
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o nome da faculdade"
                value={editNome}
                onChange={(e) => setEditNome(e.target.value)}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => { setEditId(null); setEditNome(''); }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Faculdade
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o nome da faculdade"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Adicionar Faculdade
              </button>
            </div>
          </form>
        )}

          
        <table className="w-full text-left mb-4">
          <thead>
            <tr>
              <th className="pb-2">Nome</th>
              <th className="pb-2 w-32">Ações</th>
            </tr>
          </thead>
          <tbody>
            {faculdades.map((faculdade) => (
              <tr key={faculdade.ID} className="border-t">
                <td className="py-2">{faculdade.Nome}</td>
                <td className="flex gap-2 py-2">
                  <button
                    onClick={() => handleEdit(faculdade)}
                    className="p-2 rounded hover:bg-blue-50"
                    title="Editar"
                  >
                    <img src={editIcon} alt="Editar" className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(faculdade.ID)}
                    className="p-2 rounded hover:bg-red-50"
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
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, faculdadeId: null })}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta faculdade? Esta ação não pode ser desfeita."
        type="error"
        onConfirm={confirmDelete}
      />
    </div>
  );
}