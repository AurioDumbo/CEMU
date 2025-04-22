import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
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
        
        // Buscar dados gerais do dashboard
        const dashboardResponse = await axios.get('http://localhost:5001/api/dashboard/data');
        setDashboardData(dashboardResponse.data);

        // Buscar dados de estagiários por província
        const provinciasResponse = await axios.get('http://localhost:5001/api/dashboard/provincias');
        const provinciasData = {
          labels: provinciasResponse.data.map(item => item.Provincia),
          datasets: [
            {
              label: 'Estagiários por Província',
              data: provinciasResponse.data.map(item => item.percentagem),
              backgroundColor: [
                '#3B82F6',
                '#10B981',
                '#F59E0B',
                '#A5B4FC',
                '#EC4899',
                '#8B5CF6',
                '#14B8A6'
              ],
              borderWidth: 0,
            },
          ],
        };
        setProvincesData(provinciasData);

        // Buscar dados de empresas com mais estagiários
        const empresasResponse = await axios.get('http://localhost:5001/api/dashboard/empresas');
        const empresasData = {
          labels: empresasResponse.data.map(item => item.empresa),
          datasets: [
            {
              label: 'Número de Estagiários',
              data: empresasResponse.data.map(item => item.total),
              backgroundColor: '#3B82F6',
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
        text: 'Estagiários / Província',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
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
        color: '#1E3A8A',
        font: {
          weight: 'bold',
          size: 12,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="flex-1 p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Dashboard</h1>
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
