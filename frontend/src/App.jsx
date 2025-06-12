import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';

// Importações dinâmicas (React.lazy)
const Login = React.lazy(() => import('./components/Login'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const ListarRegistros = React.lazy(() => import('./components/ListarRegistros'));
const ListarEstagios = React.lazy(() => import('./components/ListarEstagios'));
const ListarCursos = React.lazy(() => import('./components/ListarCursos'));
const UsuariosAdmin = React.lazy(() => import('./components/UsuariosAdmin'));
const FaculdadesAdmin = React.lazy(() => import('./components/FaculdadesAdmin'));
const RegisterStudent = React.lazy(() => import('./components/RegistrarEstudante'));
const RegisterCompany = React.lazy(() => import('./components/RegistrarEmpresa'));
const EditarEstagio = React.lazy(() => import('./components/EditarEstagio'));
const EditarEstudante = React.lazy(() => import('./components/EditarEstudante'));
const EditarEmpresa = React.lazy(() => import('./components/EditarEmpresa'));
const AdicionarCurso = React.lazy(() => import('./components/AdicionarCurso'));
const EditarCurso = React.lazy(() => import('./components/EditarCurso'));
const RegistrarPessoa = React.lazy(() => import('./components/Registrar'));
const DetalhesEstagio = React.lazy(() => import('./components/DetalhesEstagio'));
const LogsLogin = React.lazy(() => import('./components/LogsLogin'));
const AdminPainel = React.lazy(() => import('./components/AdminPainel'));
const Perfil = React.lazy(() => import('./components/Perfil'));
const Sidebar = React.lazy(() => import('./components/Sidebar'));
const RegistrarEstagio = React.lazy(() => import('./components/RegistrarEstagio'));

// Layout component que inclui Header e Sidebar
const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
    <Header />
    <div className="flex flex-1 overflow-hidden pt-16">
      <Suspense fallback={<div>Carregando menu...</div>}>
    <Sidebar />
      </Suspense>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
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
              ? <Suspense fallback={<div>Carregando login...</div>}><Login /></Suspense>
              : <Navigate to={getDefaultRoute()} replace />
          }
        />

        {/* Rotas para usuários nível 2 e 3 */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<div>Carregando dashboard...</div>}>
                  <Dashboard />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout>
                <Suspense fallback={<div>Carregando registro de pessoa...</div>}>
                  <RegistrarPessoa />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/registros"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<div>Carregando registros...</div>}>
                  <ListarRegistros />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estagios"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<div>Carregando estágios...</div>}>
                  <ListarEstagios />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estagios/novo"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout>
                <Suspense fallback={<div>Carregando novo estágio...</div>}>
                  <RegistrarEstagio />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Rotas apenas para usuários nível 2 */}
        <Route
          path="/register-student"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout>
                <Suspense fallback={<div>Carregando registro de estudante...</div>}>
                  <RegisterStudent />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register-company"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout>
                <Suspense fallback={<div>Carregando registro de empresa...</div>}>
                  <RegisterCompany />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estagios/:id/edit"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout>
                <Suspense fallback={<div>Carregando edição de estágio...</div>}>
                  <EditarEstagio />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estagios/:id"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout>
                <Suspense fallback={<div>Carregando detalhes do estágio...</div>}>
                  <DetalhesEstagio />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/estudante/:id/edit"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout>
                <Suspense fallback={<div>Carregando edição de estudante...</div>}>
                  <EditarEstudante />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/empresas/:id/edit"
          element={
            <ProtectedRoute requiredRole={2}>
              <Layout>
                <Suspense fallback={<div>Carregando edição de empresa...</div>}>
                  <EditarEmpresa />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Rota apenas para admin (nível 1) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole={1}>
              <Suspense fallback={<div>Carregando painel admin...</div>}>
              <AdminPainel />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<div>Carregando perfil...</div>}>
                  <Perfil />
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* Rotas administrativas */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute requiredRole={1}>
              <Suspense fallback={<div>Carregando usuários...</div>}>
                <UsuariosAdmin />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/:id"
          element={
            <ProtectedRoute requiredRole={1}>
              <Suspense fallback={<div>Carregando usuários...</div>}>
                <UsuariosAdmin />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cursos/novo"
          element={
            <Suspense fallback={<div>Carregando adição de curso...</div>}>
              <AdicionarCurso />
            </Suspense>
          }
        />
        <Route
          path="/cursos/editar/:id"
          element={
            <Suspense fallback={<div>Carregando edição de curso...</div>}>
              <EditarCurso />
            </Suspense>
          }
        />
        <Route
          path="/cursos"
          element={
            <Suspense fallback={<div>Carregando cursos...</div>}>
              <ListarCursos />
            </Suspense>
          }
        />
        <Route
          path="/logs"
          element={
            <Suspense fallback={<div>Carregando logs de login...</div>}>
              <LogsLogin />
            </Suspense>
          }
        />
        <Route
          path="/faculdades"
          element={
            <ProtectedRoute requiredRole={1}>
              <Suspense fallback={<div>Carregando faculdades...</div>}>
              <FaculdadesAdmin />
              </Suspense>
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
