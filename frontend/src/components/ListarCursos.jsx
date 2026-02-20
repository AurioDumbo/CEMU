import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Modal from './Modal';

const ListarCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, cursoId: null });
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCursos = async () => {
      try {
        const response = await api.get('/api/curso');
        setCursos(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        toast.error('Erro ao carregar os cursos');
        setLoading(false);
      }
    };

    fetchCursos();
  }, [navigate]);

  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, cursoId: id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/curso/${deleteModal.cursoId}`);
      setCursos(cursos.filter(curso => curso.curso_id !== deleteModal.cursoId));
      toast.success('Curso excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      toast.error('Erro ao excluir o curso');
    } finally {
      setDeleteModal({ isOpen: false, cursoId: null });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Lista de Cursos</h1>
        </div>
        <button
          onClick={() => navigate('/cursos/novo')}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
        >
          <FaPlus /> Novo Curso
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculdade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cursos.map((curso) => (
              <tr key={curso.curso_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{curso.faculdade_nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{curso.curso_nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/cursos/editar/${curso.curso_id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FaEdit className="inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(curso.curso_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, cursoId: null })}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita."
        type="error"
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ListarCursos;