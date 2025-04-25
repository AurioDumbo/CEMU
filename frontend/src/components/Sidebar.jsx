import { useNavigate, useLocation } from 'react-router-dom';
import dashboardIcon from '../assets/icons/dashboard.svg';
import addIcon from '../assets/icons/add.svg';
import empresasEstudantesIcon from '../assets/icons/empresasestudantes.svg';
import relatoriosIcon from '../assets/icons/relatorio.svg';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    console.log(`Navegando para: ${path}`);
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-20 bg-white h-screen fixed left-0 top-0 shadow-lg flex flex-col items-center py-4">
      <button
        onClick={() => handleNavigation('/dashboard')}
        className={`w-12 h-12 mb-4 flex items-center justify-center rounded-lg transition-all duration-200 relative
          ${isActive('/dashboard') 
            ? 'bg-red-50 text-red-600 shadow-inner' 
            : 'hover:bg-gray-100'}`}
        title="Dashboard"
      >
        <img 
          src={dashboardIcon} 
          alt="Dashboard" 
          className={`w-6 h-6 ${isActive('/dashboard') ? 'opacity-100' : 'opacity-60'}`} 
        />
        {isActive('/dashboard') && (
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600 rounded-l-lg" />
        )}
      </button>
      
      <button
        onClick={() => handleNavigation('/register')}
        className={`w-12 h-12 mb-4 flex items-center justify-center rounded-lg transition-all duration-200 relative
          ${isActive('/register') 
            ? 'bg-red-50 text-red-600 shadow-inner' 
            : 'hover:bg-gray-100'}`}
        title="Registrar"
      >
        <img 
          src={addIcon} 
          alt="Registrar" 
          className={`w-6 h-6 ${isActive('/register') ? 'opacity-100' : 'opacity-60'}`} 
        />
        {isActive('/register') && (
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600 rounded-l-lg" />
        )}
      </button>
      
      <button
        onClick={() => handleNavigation('/estagios')}
        className={`w-12 h-12 mb-4 flex items-center justify-center rounded-lg transition-all duration-200 relative
          ${isActive('/estagios') 
            ? 'bg-red-50 text-red-600 shadow-inner' 
            : 'hover:bg-gray-100'}`}
        title="Estágios"
      >
        <img 
          src={empresasEstudantesIcon} 
          alt="Estágios" 
          className={`w-6 h-6 ${isActive('/estagios') ? 'opacity-100' : 'opacity-60'}`} 
        />
        {isActive('/estagios') && (
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600 rounded-l-lg" />
        )}
      </button>

      <button
        onClick={() => handleNavigation('/registros')}
        className={`w-12 h-12 mb-4 flex items-center justify-center rounded-lg transition-all duration-200 relative
          ${isActive('/registros') 
            ? 'bg-red-50 text-red-600 shadow-inner' 
            : 'hover:bg-gray-100'}`}
        title="Relatórios"
      >
        <img 
          src={relatoriosIcon} 
          alt="Relatórios" 
          className={`w-6 h-6 ${isActive('/registros') ? 'opacity-100' : 'opacity-60'}`} 
        />
        {isActive('/registros') && (
          <div className="absolute left-0 top-0 h-full w-1 bg-red-600 rounded-l-lg" />
        )}
      </button>
    </div>
  );
} 