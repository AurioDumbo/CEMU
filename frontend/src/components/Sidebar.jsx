import { useNavigate } from 'react-router-dom';
import dashboardIcon from '../assets/icons/dashboard.svg';
import addIcon from '../assets/icons/add.svg';
import empresasEstudantesIcon from '../assets/icons/empresasestudantes.svg';
import relatoriosIcon from '../assets/icons/relatorio.svg';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    console.log(`Navegando para: ${path}`);
    navigate(path);
  };

  return (
    <div className="w-20 bg-white h-screen fixed left-0 top-0 shadow-lg flex flex-col items-center py-4">
      <button
        onClick={() => handleNavigation('/dashboard')}
        className="w-12 h-12 mb-4 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200"
        title="Dashboard"
      >
        <img src={dashboardIcon} alt="Dashboard" className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => handleNavigation('/register')}
        className="w-12 h-12 mb-4 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200"
        title="Registrar"
      >
        <img src={addIcon} alt="Registrar" className="w-6 h-6" />
      </button>
      
      <button
        onClick={() => handleNavigation('/estagios')}
        className="w-12 h-12 mb-4 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200"
        title="Estágios"
      >
        <img src={empresasEstudantesIcon} alt="Estágios" className="w-6 h-6" />
      </button>

      <button
        onClick={() => {
          console.log('Botão de Relatórios clicado - Tentando navegar para /registros');
          handleNavigation('/registros');
        }}
        className="w-12 h-12 mb-4 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200"
        title="Relatórios"
      >
        <img src={relatoriosIcon} alt="Relatórios" className="w-6 h-6" />
      </button>
    </div>
  );
} 