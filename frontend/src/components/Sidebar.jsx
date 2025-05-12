import { useNavigate, useLocation, Link } from 'react-router-dom';
import dashboardIcon from '../assets/icons/dashboard.svg';
import addIcon from '../assets/icons/add.svg';
import empresasEstudantesIcon from '../assets/icons/empresasestudantes.svg';
import relatoriosIcon from '../assets/icons/relatorio.svg';
import avatar from '../assets/icons/avatar.svg';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = Number(sessionStorage.getItem('role'));

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  const renderNavigationButton = (path, icon, title) => (
    <button
      onClick={() => handleNavigation(path)}
      className={`w-12 h-12 mb-4 flex items-center justify-center rounded-lg transition-all duration-200 relative
        ${isActive(path) 
          ? 'bg-red-50 text-red-600 shadow-inner' 
          : 'hover:bg-gray-100'}`}
      title={title}
    >
      <img 
        src={icon} 
        alt={title} 
        className={`w-6 h-6 ${isActive(path) ? 'opacity-100' : 'opacity-60'}`} 
      />
      {isActive(path) && (
        <div className="absolute left-0 top-0 h-full w-1 bg-red-600 rounded-l-lg" />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-white shadow w-20 fixed left-0 top-0">
      <div className="flex flex-col items-center py-4 flex-1">
        {/* Dashboard - disponível para todos */}
        {renderNavigationButton('/dashboard', dashboardIcon, 'Dashboard')}
        {/* Registrar - apenas para nível 2 (funcionário) */}
        {userRole === 2 && renderNavigationButton('/register', addIcon, 'Registrar')}
        {/* Estágios - disponível para todos */}
        {renderNavigationButton('/estagios', empresasEstudantesIcon, 'Estágios')}
        {/* Relatórios - disponível para todos */}
        {renderNavigationButton('/registros', relatoriosIcon, 'Relatórios')}
        {/* Espaço flexível para empurrar o avatar para baixo */}
        <div className="flex-1" />
        {/* Perfil fixo na parte de baixo */}
        <Link
          to="/perfil"
          className={`flex flex-col items-center mb-2 ${isActive('/perfil') ? 'text-purple-700' : 'text-gray-500 hover:text-purple-700'}`}
        >
          <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full mb-1" />
          <span className="text-xs">Perfil</span>
        </Link>
      </div>
    </div>
  );
}