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
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [faculdades, setFaculdades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega cursos e faculdades primeiro, depois carrega o estudante
    const carregarDados = async () => {
      await fetchFaculdades();
      await fetchCursos();
      await fetchEstudante();
      setLoading(false);
    };
    carregarDados();
  }, []);

  useEffect(() => {
    if (formData.Faculdade_ID) {
      const cursosDaFaculdade = cursos.filter(curso => 
        String(curso.faculdade_id) === String(formData.Faculdade_ID)
      );
      setCursosFiltrados(cursosDaFaculdade);

      // Se o curso atual não está nos cursos filtrados, limpa o Curso_ID
      if (
        formData.Curso_ID &&
        !cursosDaFaculdade.some(c => String(c.curso_id) === String(formData.Curso_ID))
      ) {
        setFormData(prev => ({ ...prev, Curso_ID: '' }));
      }
    } else {
      setCursosFiltrados([]);
      if (formData.Curso_ID) {
        setFormData(prev => ({ ...prev, Curso_ID: '' }));
      }
    }
  }, [formData.Faculdade_ID, cursos]);

  const fetchEstudante = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/estudantes/${id}`);
      const estudante = res.data;
      setFormData({
        Nome: estudante.nome || '',
        Sobrenome: estudante.sobrenome || '',
        Curso_ID: estudante.curso?.id || '',
        Telefone: estudante.telefone || '',
        Email: estudante.email || '',
        Faculdade_ID: estudante.faculdade?.id || '',
        Sexo: estudante.sexo || ''
      });
    } catch (error) {
      console.error('Erro ao carregar estudante:', error);
      toast.error('Erro ao carregar estudante.');
      navigate('/registros');
    }
  };

  const fetchCursos = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/curso', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Cursos retornados:', res.data); // Para debug
      setCursos(res.data);
      if (formData.Faculdade_ID) {
        const cursosDaFaculdade = res.data.filter(curso => 
          String(curso.faculdade_id) === String(formData.Faculdade_ID)
        );
        setCursosFiltrados(cursosDaFaculdade);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      toast.error('Erro ao carregar cursos.');
    }
  };

  const fetchFaculdades = async () => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/faculdade', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaculdades(res.data);
    } catch (error) {
      console.error('Erro ao carregar faculdades:', error);
      toast.error('Erro ao carregar faculdades.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Atualizando estudante...');
    try {
      const dadosParaEnviar = {
        Nome: formData.Nome,
        Sobrenome: formData.Sobrenome,
        Curso_ID: parseInt(formData.Curso_ID) || null,
        Telefone: formData.Telefone || null,
        Email: formData.Email || null,
        Faculdade_ID: parseInt(formData.Faculdade_ID) || null,
        Sexo: formData.Sexo,
        Estado: 'Pendente'
      };
      
      console.log('Dados enviados:', dadosParaEnviar);
      
      const response = await axios.put(`http://localhost:5001/api/estudantes/${id}`, dadosParaEnviar);
      console.log('Resposta do servidor:', response.data);
      
      toast.dismiss(toastId);
      toast.success('Estudante atualizado com sucesso!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
      
      setTimeout(() => {
        navigate('/registros');
      }, 1000);
      
    } catch (error) {
      toast.dismiss(toastId);
      console.error('Erro ao atualizar:', error);
      console.error('Detalhes do erro:', error.response?.data);
      toast.error(`Erro ao atualizar estudante: ${error.response?.data?.error || 'Erro desconhecido'}`);
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
                <option key={fac.ID} value={fac.ID}>{fac.Nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Curso *</label>
            <select
              name="Curso_ID"
              value={formData.Curso_ID}
              onChange={handleChange}
              required
              disabled={!formData.Faculdade_ID}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Selecione o curso</option>
              {cursosFiltrados.map(curso => (
                <option key={curso.curso_id} value={curso.curso_id}>{curso.curso_nome}</option>
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