import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
        const response = await axios.get(`http://localhost:5001/api/estagios/${id}`);
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Detalhes do Estágio</h1>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações do Estudante */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações do Estudante</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Nome:</span> {estagio.estudante_nome}</p>
                  <p><span className="font-medium">Curso:</span> {estagio.estudante_curso}</p>
                  <p><span className="font-medium">Faculdade:</span> {estagio.estudante_faculdade}</p>
                </div>
              </div>

              {/* Informações da Empresa */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações da Empresa</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Nome:</span> {estagio.empresa_nome}</p>
                  <p><span className="font-medium">NIF:</span> {estagio.empresa_nif}</p>
                  <p><span className="font-medium">Responsável:</span> {estagio.Responsavel_Nome}</p>
                  <p><span className="font-medium">Telefone do Responsável:</span> {estagio.Responsavel_Telefone}</p>
                </div>
              </div>

              {/* Informações do Estágio */}
              <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Informações do Estágio</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p><span className="font-medium">Tipo:</span> {getTipoEstagio(estagio.Tipo)}</p>
                    <p><span className="font-medium">Modalidade:</span> {getModalidade(estagio.Modalidade)}</p>
                    <p><span className="font-medium">Remunerado:</span> {getRemunerado(estagio.Remunerado)}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Província:</span> {estagio.Provincia}</p>
                    <p><span className="font-medium">Município:</span> {estagio.Municipio}</p>
                    <p><span className="font-medium">Rua:</span> {estagio.Rua}</p>
                  </div>
                  <div>
                    <p><span className="font-medium">Data de Início:</span> {formatDate(estagio.Inicio)}</p>
                    <p><span className="font-medium">Data de Término:</span> {formatDate(estagio.Termino)}</p>
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