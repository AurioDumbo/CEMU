import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function NotificacoesEstagios() {
  const [notificacoes, setNotificacoes] = useState({ aComecar: [], aTerminar: [] });

  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/estagios/notificacoes/proximos?dias=7', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotificacoes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchNotificacoes();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:5001');
    socket.on('notificacaoEstagio', (data) => {
      setNotificacoes((prev) => {
        if (data.tipo === 'aComecar') {
          if (prev.aComecar.some(e => e.ID === data.ID)) return prev;
          return { ...prev, aComecar: [...prev.aComecar, data] };
        } else if (data.tipo === 'aTerminar') {
          if (prev.aTerminar.some(e => e.ID === data.ID)) return prev;
          return { ...prev, aTerminar: [...prev.aTerminar, data] };
        }
        return prev;
      });
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="mb-4">
      {notificacoes.aComecar.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-2 rounded">
          <strong>Estágios prestes a começar:</strong>
          <ul>
            {notificacoes.aComecar.map(estagio => (
              <li key={estagio.ID}>
                Estudante {estagio.Estudante_ID} na empresa {estagio.Empresa_ID} começa em {estagio.Inicio}
              </li>
            ))}
          </ul>
        </div>
      )}
      {notificacoes.aTerminar.length > 0 && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <strong>Estágios prestes a terminar:</strong>
          <ul>
            {notificacoes.aTerminar.map(estagio => (
              <li key={estagio.ID}>
                Estudante {estagio.Estudante_ID} na empresa {estagio.Empresa_ID} termina em {estagio.Termino}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
