import { useState } from 'react';
import RegistrarEstudante from './RegistrarEstudante';
import RegistrarEmpresa from './RegistrarEmpresa';
import RegistrarEstagio from './RegistrarEstagio';
import Modal from './Modal';

export default function Registrar() {
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('estudante')}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'estudante'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Estudante
              </button>
              <button
                onClick={() => setActiveTab('empresa')}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'empresa'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Empresa
              </button>
              <button
                onClick={() => setActiveTab('estagio')}
                className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                  activeTab === 'estagio'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Estágio
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'estudante' && <RegistrarEstudante onSuccess={() => handleRegistroSucesso('estudante')} />}
              {activeTab === 'empresa' && <RegistrarEmpresa onSuccess={() => handleRegistroSucesso('empresa')} />}
              {activeTab === 'estagio' && <RegistrarEstagio onSuccess={() => handleRegistroSucesso('estagio')} />}
            </div>
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