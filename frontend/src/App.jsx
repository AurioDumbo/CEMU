import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RegisterStudent from './components/RegistrarEstudante';
import RegisterCompany from './components/RegistrarEmpresa';
import RegistrarPessoa from './components/Registrar';
import ListarEstagios from './components/ListarEstagios';
import DetalhesEstagio from './components/DetalhesEstagio';
import ListarRegistros from './components/ListarRegistros';
import Sidebar from './components/Sidebar';
import EditarEstagio from './components/EditarEstagio';
import EditarEstudante from './components/EditarEstudante';
import EditarEmpresa from './components/EditarEmpresa';
import AdminPainel from './components/AdminPainel';
import Perfil from './components/Perfil';
import CriarUsuario from './components/UsuariosAdmin';
import FaculdadesAdmin from './components/FaculdadesAdmin'; 
import AdicionarCurso from './components/AdicionarCurso';
import LogsLogin from './components/LogsLogin';
import ListarCursos from './components/ListarCursos';
import RegistrarEstagio from './components/RegistrarEstagio';
import EditarCurso from './components/EditarCurso';

// Layout component que inclui a Sidebar
const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-100 font-sans flex">
    <Sidebar />
    {children}
  </div>
);

// Componente para verificar permissões
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = sessionStorage.getItem('token');
  const role = Number(sessionStorage.getItem('role'));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== Number(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function getDefaultRoute() {
  const token = sessionStorage.getItem('token');
  const role = Number(sessionStorage.getItem('role'));
  if (!token) return '/login';
  return role === 1 ? '/admin' : '/dashboard';
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Rota de Login */}
        <Route
          path="/login"
          element={
            !sessionStorage.getItem('token')
              ? <Login />
              : <Navigate to={getDefaultRoute()} replace />
          }
        />

        {/* Rotas para usuários nível 2 e 3 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout><RegistrarPessoa /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/registros"
          element={
            <ProtectedRoute>
              <Layout><ListarRegistros /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estagios"
          element={
            <ProtectedRoute>
              <Layout><ListarEstagios /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estagios/novo"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout><RegistrarEstagio /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Rotas apenas para usuários nível 2 */}
        <Route
          path="/register-student"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout><RegisterStudent /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-company"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout><RegisterCompany /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estagios/:id/edit"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout><EditarEstagio /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estagios/:id"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout><DetalhesEstagio /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estudante/:id/edit"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout><EditarEstudante /></Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresas/:id/edit"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout><EditarEmpresa /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Rota apenas para admin (nível 1) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="1">
              <AdminPainel />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Layout><Perfil /></Layout>
            </ProtectedRoute>
          }
        />

        {/* Rotas administrativas */}

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute requiredRole={1}>
              <CriarUsuario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/:id"
          element={
            <ProtectedRoute requiredRole={1}>
              <CriarUsuario />
            </ProtectedRoute>
          }
        />
        <Route path="/cursos/novo" element={<AdicionarCurso />} />
        <Route path="/cursos/editar/:id" element={<EditarCurso />} />
        <Route path="/cursos" element={<ListarCursos />} />
        <Route path="/logs" element={<LogsLogin />} />
        <Route
          path="/faculdades"
          element={
            <ProtectedRoute requiredRole={1}>
              <FaculdadesAdmin />
            </ProtectedRoute>
          }
        />

        {/* Redirecionar para a rota padrão baseada no role */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
