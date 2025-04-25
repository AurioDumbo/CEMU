import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function EditarEstudante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Nome: '',
    Sobrenome: '',
    Curso_ID: '',
    Telefone: '',
    Email: '',
    Faculdade_ID: '',
    Sexo: ''
  });
  const [cursos, setCursos] = useState([]);
  const [faculdades, setFaculdades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstudante();
    fetchCursos();
    fetchFaculdades();
    // eslint-disable-next-line
  }, []);

  const fetchEstudante = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/estudantes/${id}`);
      setFormData({
        Nome: res.data.nome || '',
        Sobrenome: res.data.sobrenome || '',
        Curso_ID: res.data.curso_id || '',
        Telefone: res.data.telefone || '',
        Email: res.data.email || '',
        Faculdade_ID: res.data.faculdade_id || '',
        Sexo: res.data.sexo || ''
      });
    } catch {
      toast.error('Erro ao carregar estudante.');
      navigate('/registros');
    } finally {
      setLoading(false);
    }
  };

  const fetchCursos = async () => {
    const res = await axios.get('http://localhost:5001/api/cursos');
    setCursos(res.data);
  };

  const fetchFaculdades = async () => {
    const res = await axios.get('http://localhost:5001/api/faculdades');
    setFaculdades(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5001/api/estudantes/${id}`, {
        nome: formData.Nome,
        sobrenome: formData.Sobrenome,
        curso_id: formData.Curso_ID,
        telefone: formData.Telefone,
        email: formData.Email,
        faculdade_id: formData.Faculdade_ID,
        sexo: formData.Sexo
      });
      toast.success('Estudante atualizado com sucesso!');
      navigate('/registros');
    } catch {
      toast.error('Erro ao atualizar estudante.');
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h2 className="text-xl font-bold mb-6">Editar Estudante</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome *</label>
            <input
              type="text"
              name="Nome"
              value={formData.Nome}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sobrenome *</label>
            <input
              type="text"
              name="Sobrenome"
              value={formData.Sobrenome}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Curso *</label>
            <select
              name="Curso_ID"
              value={formData.Curso_ID}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione o curso</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.id}>{curso.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Faculdade *</label>
            <select
              name="Faculdade_ID"
              value={formData.Faculdade_ID}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione a faculdade</option>
              {faculdades.map(fac => (
                <option key={fac.id} value={fac.id}>{fac.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Telefone *</label>
            <input
              type="text"
              name="Telefone"
              value={formData.Telefone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Sexo *</label>
            <select
              name="Sexo"
              value={formData.Sexo}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/registros')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}