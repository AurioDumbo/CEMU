import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function DetalhesEstagio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estagio, setEstagio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstagio = async () => {
      try {
        const response = await api.get(`http://localhost:5001/api/estagios/${id}`);
        setEstagio(response.data);
      } catch (error) {
        console.error('Erro ao carregar detalhes do estágio:', error);
        alert('Erro ao carregar os detalhes do estágio');
      } finally {
        setLoading(false);
      }
    };

    fetchEstagio();
  }, [id]);

  const getTipoEstagio = (tipo) => {
    return tipo === 1 ? 'Acadêmico' : 'Voluntário';
  };

  const getModalidade = (modalidade) => {
    return modalidade === 0 ? 'Atribuído' : 'Adquirido';
  };

  const getRemunerado = (remunerado) => {
    return remunerado === 1 ? 'Sim' : 'Não';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const gerarPDF = () => {
    if (!estagio) return;

    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Detalhes do Estágio', 105, 20, { align: 'center' });
    
    // Informações do Estudante
    doc.setFontSize(14);
    doc.text('Informações do Estudante', 20, 40);
    doc.setFontSize(12);
    doc.text(`Nome: ${estagio.estudante_nome}`, 20, 50);
    doc.text(`Curso: ${estagio.estudante_curso}`, 20, 60);
    doc.text(`Faculdade: ${estagio.estudante_faculdade}`, 20, 70);
    
    // Informações da Empresa
    doc.setFontSize(14);
    doc.text('Informações da Empresa', 20, 90);
    doc.setFontSize(12);
    doc.text(`Nome: ${estagio.empresa_nome}`, 20, 100);
    doc.text(`NIF: ${estagio.empresa_nif}`, 20, 110);
    doc.text(`Responsável: ${estagio.Responsavel_Nome}`, 20, 120);
    doc.text(`Telefone do Responsável: ${estagio.Responsavel_Telefone}`, 20, 130);
    
    // Informações do Estágio
    doc.setFontSize(14);
    doc.text('Informações do Estágio', 20, 150);
    doc.setFontSize(12);
    doc.text(`Tipo: ${getTipoEstagio(estagio.Tipo)}`, 20, 160);
    doc.text(`Modalidade: ${getModalidade(estagio.Modalidade)}`, 20, 170);
    doc.text(`Remunerado: ${getRemunerado(estagio.Remunerado)}`, 20, 180);
    doc.text(`Local: ${estagio.Provincia}, ${estagio.Municipio}, ${estagio.Rua}`, 20, 190);
    doc.text(`Período: ${formatDate(estagio.Inicio)} a ${formatDate(estagio.Termino)}`, 20, 200);
    
    doc.save(`estagio_${estagio.ID}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-gray-600">Carregando detalhes do estágio...</p>
        </div>
      </div>
    );
  }

  if (!estagio) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-center text-red-600">Estágio não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 ml-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h1 className="text-3xl font-bold text-gray-800">Detalhes do Estágio</h1>
              <div className="flex space-x-4">
                <button
                  onClick={() => navigate('/estagios')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                >
                  Voltar
                </button>
                <button
                  onClick={gerarPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  Imprimir PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Informações do Estudante</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 items-center">
                    <span className="font-medium text-gray-700">Nome:</span>
                    <span className="col-span-2 text-gray-900">{estagio.estudante_nome}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="font-medium text-gray-700">Curso:</span>
                    <span className="col-span-2 text-gray-900">{estagio.estudante_curso}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="font-medium text-gray-700">Faculdade:</span>
                    <span className="col-span-2 text-gray-900">{estagio.estudante_faculdade}</span>
                  </div>
                </div>
              </div>

             
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Informações da Empresa</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 items-center">
                    <span className="font-medium text-gray-700">Nome:</span>
                    <span className="col-span-2 text-gray-900">{estagio.empresa_nome}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="font-medium text-gray-700">NIF:</span>
                    <span className="col-span-2 text-gray-900">{estagio.empresa_nif}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="font-medium text-gray-700">Responsável:</span>
                    <span className="col-span-2 text-gray-900">{estagio.Responsavel_Nome}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <span className="font-medium text-gray-700">Telefone:</span>
                    <span className="col-span-2 text-gray-900">{estagio.Responsavel_Telefone}</span>
                  </div>
                </div>
              </div>

              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Informações do Estágio</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 items-center">
                      <span className="font-medium text-gray-700">Tipo:</span>
                      <span className="col-span-2 text-gray-900">{getTipoEstagio(estagio.Tipo)}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <span className="font-medium text-gray-700">Modalidade:</span>
                      <span className="col-span-2 text-gray-900">{getModalidade(estagio.Modalidade)}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <span className="font-medium text-gray-700">Remunerado:</span>
                      <span className="col-span-2 text-gray-900">{getRemunerado(estagio.Remunerado)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 items-center">
                      <span className="font-medium text-gray-700">Província:</span>
                      <span className="col-span-2 text-gray-900">{estagio.Provincia}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <span className="font-medium text-gray-700">Município:</span>
                      <span className="col-span-2 text-gray-900">{estagio.Municipio}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <span className="font-medium text-gray-700">Rua:</span>
                      <span className="col-span-2 text-gray-900">{estagio.Rua}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 items-center">
                      <span className="font-medium text-gray-700">Início:</span>
                      <span className="col-span-2 text-gray-900">{formatDate(estagio.Inicio)}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center">
                      <span className="font-medium text-gray-700">Término:</span>
                      <span className="col-span-2 text-gray-900">{formatDate(estagio.Termino)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}