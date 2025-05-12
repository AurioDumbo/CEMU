import { useNavigate } from 'react-router-dom';
import logoCuanza from '../assets/icons/logo-cuanza.svg';
import relatorioIcon from '../assets/icons/relatorio.svg';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img 
              src={logoCuanza} 
              alt="Logo Cuanza" 
              className="h-12 w-auto cursor-pointer"
              onClick={() => navigate('/dashboard')}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/estagios')}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Estágios
            </button>
            <button
              onClick={() => navigate('/registros')}
              className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              <img src={relatorioIcon} alt="Relatórios" className="w-5 h-5 mr-2" />
              Relatórios
            </button>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 