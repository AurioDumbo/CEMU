import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrarEstudante from './RegistrarEstudante';
import RegistrarEmpresa from './RegistrarEmpresa';
import RegistrarEstagio from './RegistrarEstagio';
import DashboardIcon from "../assets/icons/dashboard.svg?react";
import AddIcon from "../assets/icons/add.svg?react";
import MenuIcon from "../assets/icons/empresasestudantes.svg?react";
import RelatorioIcon from "../assets/icons/relatorio.svg?react";
import AvatarIcon from "../assets/icons/avatar.svg?react";

export default function Registrar() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('estudante');

  return (
    <div className="h-screen bg-gray-100 font-sans flex overflow-hidden">
      <aside className="w-16 bg-white shadow-md flex flex-col items-center pt-6 pb-4 space-y-8 font-sans">
        <div className="text-red-600 text-sm">Menu</div>

        <div className="flex flex-col space-y-10 text-gray-600 mt-4">
          <DashboardIcon 
            className="w-14 h-7 hover:text-blue-500 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          />
          <AddIcon
            className="w-14 h-7 hover:text-blue-500 cursor-pointer text-blue-500"
            onClick={() => navigate('/register')}
          />
          <MenuIcon 
            className="w-14 h-7 hover:text-blue-500 cursor-pointer"
            onClick={() => navigate('/estagios')}
          />
          <RelatorioIcon
            className="w-14 h-7 hover:text-blue-500 cursor-pointer"
            onClick={() => navigate('/relatorios')}
          />
        </div>

        <div className="flex-grow" />

        <div className="flex flex-col items-center space-y-1">
          <AvatarIcon className="w-9 h-9 text-gray-400 hover:text-gray-600 cursor-pointer rounded-full bg-purple-100 p-1" />
          <span className="text-xs text-red-500">Perfil</span>
        </div>
      </aside>

      <main className="flex-1 p-4 overflow-auto">
        <div className="bg-white rounded-lg shadow p-4 h-full">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('estudante')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'estudante'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Estudante
            </button>
            <button
              onClick={() => setActiveTab('empresa')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'empresa'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Empresa
            </button>
            <button
              onClick={() => setActiveTab('estagio')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'estagio'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Estágio
            </button>
          </div>

          <div className="h-[calc(100%-3rem)] overflow-auto">
            {activeTab === 'estudante' && <RegistrarEstudante />}
            {activeTab === 'empresa' && <RegistrarEmpresa />}
            {activeTab === 'estagio' && <RegistrarEstagio />}
          </div>
        </div>
      </main>
    </div>
  );
}