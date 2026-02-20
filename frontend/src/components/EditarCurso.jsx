import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

export default function EditarCurso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    faculdadeId: ''
  });
  const [faculdades, setFaculdades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const [cursoResponse, faculdadesResponse] = await Promise.all([
          api.get(`/api/curso/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/api/faculdade', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setFormData({
          nome: cursoResponse.data.curso_nome,
          faculdadeId: cursoResponse.data.faculdade_id
        });
        setFaculdades(faculdadesResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast.error('Erro ao carregar dados do curso');
        navigate('/cursos');
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await api.put(
        `/api/curso/${id}`,
        {
          Nome: formData.nome,
          Faculdade_ID: formData.faculdadeId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Curso atualizado com sucesso!');
      navigate('/cursos');
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      toast.error('Erro ao atualizar curso');
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
          Editar Curso
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Curso
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o nome do curso"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Faculdade
            </label>
            <select
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.faculdadeId}
              onChange={(e) => setFormData({ ...formData, faculdadeId: e.target.value })}
            >
              <option value="">Selecione uma faculdade</option>
              {faculdades.map((faculdade) => (
                <option key={faculdade.ID} value={faculdade.ID}>
                  {faculdade.Nome}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/cursos')}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}