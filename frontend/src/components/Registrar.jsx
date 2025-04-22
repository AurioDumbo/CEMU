import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrarEstudante from './RegistrarEstudante';
import RegistrarEmpresa from './RegistrarEmpresa';
import RegistrarEstagio from './RegistrarEstagio';
import Modal from './Modal';
import DashboardIcon from "../assets/icons/dashboard.svg?react";
import AddIcon from "../assets/icons/add.svg?react";
import MenuIcon from "../assets/icons/empresasestudantes.svg?react";
import RelatorioIcon from "../assets/icons/relatorio.svg?react";
import AvatarIcon from "../assets/icons/avatar.svg?react";

export default function Registrar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('estudante');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: '', message: '' });

  const handleRegistroSucesso = (tipo) => {
    const mensagens = {
      estudante: {
        title: 'Estudante Registrado!',
        message: 'O estudante foi registrado com sucesso no sistema.'
      },
      empresa: {
        title: 'Empresa Registrada!',
        message: 'A empresa foi registrada com sucesso no sistema.'
      },
      estagio: {
        title: 'Estágio Registrado!',
        message: 'O estágio foi registrado com sucesso no sistema.'
      }
    };

    setModalMessage(mensagens[tipo]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex-1 p-6 bg-gray-100 ml-20">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Registrar</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('estudante')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'estudante'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Estudante
            </button>
            <button
              onClick={() => setActiveTab('empresa')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'empresa'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Empresa
            </button>
            <button
              onClick={() => setActiveTab('estagio')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === 'estagio'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Estágio
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {activeTab === 'estudante' && <RegistrarEstudante onSuccess={() => handleRegistroSucesso('estudante')} />}
            {activeTab === 'empresa' && <RegistrarEmpresa onSuccess={() => handleRegistroSucesso('empresa')} />}
            {activeTab === 'estagio' && <RegistrarEstagio onSuccess={() => handleRegistroSucesso('estagio')} />}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={modalMessage.title}
        message={modalMessage.message}
        type="success"
      />
    </div>
  );
}