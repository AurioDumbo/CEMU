import { useState } from 'react';
import axios from 'axios';

function Login({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setErro('');

    axios.post('http://localhost:5001/api/usuarios/login', { email, password })
      .then((response) => {
        const token = response.data.token;
        sessionStorage.setItem('token', token);
        setToken(token);
      })
      .catch((err) => {
        setErro('Erro de login! Verifique suas credenciais.');
        console.error(err);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {erro && <p className="text-red-500 mb-4">{erro}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="senha" className="block text-sm font-semibold text-gray-700">Senha</label>
            <input
              id="senha"
              type="password"
              value={password}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
