import { useEffect, useState } from 'react';
import api from '../utils/axiosInstance';
import { io } from 'socket.io-client';

export default function NotificacoesEstagios() {
  const [notificacoes, setNotificacoes] = useState({ aComecar: [], aTerminar: [] });
  const [dismissedAComecar, setDismissedAComecar] = useState(false);
  const [dismissedATerminar, setDismissedATerminar] = useState(false);

  useEffect(() => {
    // Load dismissal state from sessionStorage
    const dismissedState = JSON.parse(sessionStorage.getItem('dismissedCategoriesState') || '{}');
    setDismissedAComecar(!!dismissedState.aComecar);
    setDismissedATerminar(!!dismissedState.aTerminar);

    const fetchNotificacoes = async () => {
      try {
        const res = await api.get('http://localhost:5001/api/estagios/notificacoes/proximos?dias=5');
        
        let filteredAComecar = res.data.aComecar;
        let filteredATerminar = res.data.aTerminar;

       
        if (dismissedState.aComecar) {
            filteredAComecar = [];
        }
        if (dismissedState.aTerminar) {
            filteredATerminar = [];
        }

        setNotificacoes({ aComecar: filteredAComecar, aTerminar: filteredATerminar });
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

        if (data.tipo === 'aComecar' && !dismissedAComecar) {
          if (prev.aComecar.some(e => e.ID === data.ID)) return prev;
          return { ...prev, aComecar: [...prev.aComecar, data] };
        } else if (data.tipo === 'aTerminar' && !dismissedATerminar) {
          if (prev.aTerminar.some(e => e.ID === data.ID)) return prev;
          return { ...prev, aTerminar: [...prev.aTerminar, data] };
        }
        return prev;
      });
    });
    return () => socket.disconnect();
  }, [dismissedAComecar, dismissedATerminar]);

  // Função para agrupar por data
  function agruparPorData(lista, campoData) {
    return lista.reduce((acc, item) => {
      const data = new Date(item[campoData]).toLocaleDateString('pt-BR');
      if (!acc[data]) acc[data] = [];
      acc[data].push(item);
      return acc;
    }, {});
  }

  const handleDismissCategory = (category) => {
    setNotificacoes(prev => ({ ...prev, [category]: [] })); 
    const dismissedState = JSON.parse(sessionStorage.getItem('dismissedCategoriesState') || '{}');
    dismissedState[category] = true;
    sessionStorage.setItem('dismissedCategoriesState', JSON.stringify(dismissedState));

    if (category === 'aComecar') {
        setDismissedAComecar(true);
    } else if (category === 'aTerminar') {
        setDismissedATerminar(true);
    }
  };

  return (
    <div className="mb-4">
      {notificacoes.aComecar.length > 0 && !dismissedAComecar && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-2 rounded">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Estágios Prestes a Começar</h3>
            <button
              onClick={() => handleDismissCategory('aComecar')}
              className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
          </div>
          {Object.entries(agruparPorData(notificacoes.aComecar, 'Inicio')).map(([data, estagios]) => (
            <div key={data} className="flex items-center justify-between text-sm py-1">
              <span>{estagios.length} estágio{estagios.length > 1 ? 's' : ''} no dia {data}</span>
            </div>
          ))}
        </div>
      )}
      {notificacoes.aTerminar.length > 0 && !dismissedATerminar && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold">Estágios Prestes a Terminar</h3>
            <button
              onClick={() => handleDismissCategory('aTerminar')}
              className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
          </div>
          {Object.entries(agruparPorData(notificacoes.aTerminar, 'Termino')).map(([data, estagios]) => (
            <div key={data} className="flex items-center justify-between text-sm py-1">
              <span>{estagios.length} estágio{estagios.length > 1 ? 's' : ''} no dia {data}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
