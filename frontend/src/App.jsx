import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Layout component que inclui a Sidebar
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans flex">
      <Sidebar />
      {children}
    </div>
  );
};

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(sessionStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Rota de Login */}
        <Route
          path="/login"
          element={!token ? <Login setToken={setToken} /> : <Navigate to="/dashboard" />}
        />
        {/* Rotas Autenticadas */}
        <Route
          path="/dashboard"
          element={token ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={token ? <Layout><RegistrarPessoa /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/register-student"
          element={token ? <Layout><RegisterStudent /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/register-company"
          element={token ? <Layout><RegisterCompany /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/registros"
          element={token ? <Layout><ListarRegistros /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/empresas/:id/edit"
          element={
            token ? (
              <Layout>
                <EditarEmpresa />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/estudante/:id/edit"
          element={token ? <Layout><EditarEstudante /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/estagios"
          element={token ? <Layout><ListarEstagios /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/estagios/:id/edit"
          element={token ? <Layout><EditarEstagio /></Layout> : <Navigate to="/login" />}
        />
        <Route
          path="/estagios/:id"
          element={token ? <Layout><DetalhesEstagio /></Layout> : <Navigate to="/login" />}
        />
        {/* Redirecionar para login por padrão */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
