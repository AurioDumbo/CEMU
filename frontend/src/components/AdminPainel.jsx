import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function AdminPainel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
    toast.success('Sessão encerrada com sucesso');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Gerenciar Sistema
        </h1>

        <div className="space-y-4">
          {/* Botão Criar Usuário */}
          <button
            onClick={() => navigate('/usuarios')}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Gerenciar Usuários
          </button>

          {/* Botão Gerenciar Faculdades */}
        


          <button
            onClick={() => navigate('/faculdades')}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Gerenciar Faculdades
          </button>

          {/* Botão Gerenciar Cursos */}
          <button
            onClick={() => navigate('/cursos')}
            className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Gerenciar Cursos
          </button>

          {/* Botão Ver Logs */}
          <button
            onClick={() => navigate('/logs')}
            className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Ver Logs de Login
          </button>

          {/* Botão Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
