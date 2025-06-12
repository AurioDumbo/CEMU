import { useState, useEffect, useRef } from 'react';
import NotificacoesEstagios from './NotificacoesEstagios';
import api from '../utils/axiosInstance'; // Troque axios por api
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels
);

export default function Dashboard() {
  const [provincesData, setProvincesData] = useState(null);
  const [companiesData, setCompaniesData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    estagiariosAtivos: 0,
    empresasAtivas: 0,
    estudantesPendentes: 0,
    empresasPendentes: 0
  });
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const dashboardResponse = await api.get('http://localhost:5001/api/dashboard/data');
        setDashboardData(dashboardResponse.data);

        const provinciasResponse = await api.get('http://localhost:5001/api/dashboard/provincias');

        const provinciasOrdenadas = provinciasResponse.data.sort((a, b) => b.percentagem - a.percentagem);
        let labels = [];
        let data = [];
        let backgroundColor = [
          '#10B981', // Verde
          '#F59E0B', // Laranja
          '#A5B4FC', // Roxo claro
          '#EC4899', // Rosa
          '#8B5CF6', // Roxo
          '#64748B'  // Cinza para "Outras províncias"
        ];

        if (provinciasOrdenadas.length > 5) {
          const top5Provincias = provinciasOrdenadas.slice(0, 5);
          const outrasProvincias = provinciasOrdenadas.slice(5);
          const percentagemOutras = outrasProvincias.reduce((sum, prov) => sum + prov.percentagem, 0);

          labels = [...top5Provincias.map(item => item.Provincia), 'Outras províncias'];
          data = [...top5Provincias.map(item => item.percentagem), percentagemOutras];
        } else {
          labels = provinciasOrdenadas.map(item => item.Provincia);
          data = provinciasOrdenadas.map(item => item.percentagem);
          backgroundColor = backgroundColor.slice(0, provinciasOrdenadas.length);
        }

        const provinciasData = {
          labels,
          datasets: [
            {
              label: 'Estagiários por Província',
              data,
              backgroundColor,
              borderWidth: 0,
            },
          ],
        };
        setProvincesData(provinciasData);

        const empresasResponse = await api.get('http://localhost:5001/api/dashboard/empresas');
        const empresasAtivas = empresasResponse.data
          .sort((a, b) => b.total - a.total)
          .slice(0, 3);

        const empresasData = {
          labels: empresasAtivas.map(item => item.empresa),
          datasets: [
            {
              label: 'Número de Estagiários',
              data: empresasAtivas.map(item => item.total),
              backgroundColor: [
                '#ef4444', // vermelho
                '#3B82F6', // azul
                '#10B981', // verde
                '#F59E0B', // laranja
                '#8B5CF6', // roxo
              ].slice(0, empresasAtivas.length),
              borderWidth: 0,
            },
          ],
        };
        setCompaniesData(empresasData);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Configuração do gráfico
  const config = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}%`,
        },
      },
      title: {
        display: true,
        text: 'Estagiários Ativos por Província',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 14,
        },
        formatter: (value) => {
          return value + '%';
        },
      },
    },
    maintainAspectRatio: false,
  };

  const barOptions = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#111827', // Preto
        font: {
          weight: 'bold',
          size: 16,
        },
        formatter: (value) => {
          return value; // Mostra o número de estagiários
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const empresa = context.label;
            const total = context.raw;
            return `${empresa}: ${total} estagiário(s)`;
          },
        },
        backgroundColor: '#fff',
        titleColor: '#3B82F6',
        bodyColor: '#111',
        borderColor: '#3B82F6',
        borderWidth: 1,
        padding: 12,
        caretSize: 8,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        min: 0,
        max: 5,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return Number.isInteger(value) ? value : null;
          },
          color: '#111827', // preto
          font: {
            size: 14,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#111827',
          font: {
            size: 14,
          },
        },
        border: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
    },
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 30,
        top: 10,
        bottom: 10,
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false,
      },
    },
  };

  return (
    <div className="flex-1 p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <NotificacoesEstagios />
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600">Carregando dados...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-6">
              {[
                { label: 'Estagiários ativos', value: dashboardData.estagiariosAtivos },
                { label: 'Empresas ativas', value: dashboardData.empresasAtivas },
                { label: 'Estudantes pendentes', value: dashboardData.estudantesPendentes },
                { label: 'Empresas pendentes', value: dashboardData.empresasPendentes },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow p-4 text-gray-700"
                >
                  <div className="text-sm mb-2">{item.label}</div>
                  <div className="text-2xl font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Empresas com Mais Estagiários</h2>
                <div className="h-64">
                  {companiesData && <Bar data={companiesData} options={barOptions} />}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Estagiários por Província</h2>
                <div className="h-64">
                  {provincesData && (
                    <Doughnut
                      ref={chartRef}
                      data={provincesData}
                      options={config}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
