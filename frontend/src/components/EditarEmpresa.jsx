import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axiosInstance';
import { toast } from 'react-toastify';

export default function EditarEmpresa() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        NIF: '',
        Nome: '',
        Provincia: '',
        Telefone: '',
        Email: '',
        Status: ''
    });
    const [provincias, setProvincias] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [cursosInteresse, setCursosInteresse] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchEmpresa();
        fetchProvincias();
        fetchCursos().then(success => {
            if (success) fetchCursosInteresse();
        });
        // eslint-disable-next-line
    }, [id, navigate]);

    const fetchEmpresa = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await api.get(`http://localhost:5001/api/empresas/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.data) {
                toast.error('Empresa não encontrada');
                navigate('/registros');
            }
            setFormData(res.data);
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
            toast.error('Erro ao carregar dados da empresa');
        }
    };

    const fetchProvincias = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await api.get('http://localhost:5001/api/provincias', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProvincias(res.data);
        } catch (error) {
            console.error('Erro ao buscar provincias:', error);
            toast.error('Erro ao carregar lista de provincias');
        }
    };

    const fetchCursos = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await api.get('http://localhost:5001/api/curso', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCursos(res.data);
            return true;
        } catch (error) {
            console.error('Erro ao carregar lista de cursos:', error);
            toast.error('Erro ao carregar lista de cursos');
            return false;
        }
    };

    const fetchCursosInteresse = async () => {
        try {
            const token = sessionStorage.getItem('token');
            console.log('Fetching cursos for empresa ID:', id); 
            
            const res = await api.get(
                `http://localhost:5001/api/empresa_curso/empresa/${id}`,
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
                console.log('Response from API:', res.data); 
            setCursosInteresse(res.data);
        } catch (error) {
            console.error('Error fetching cursos:', error.response || error);
            toast.error('Erro ao carregar cursos de interesse');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            await api.put(`http://localhost:5001/api/empresas/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await api.put(
                `http://localhost:5001/api/empresa_curso/empresa/${id}`,
                { cursos: cursosInteresse },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Empresa atualizada com sucesso!');
            navigate('/registros');
        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            toast.error('Erro ao salvar alterações');
        }
    };


    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
            <h2 className="text-xl font-bold mb-6">Editar Empresa</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">NIF *</label>
                        <input
                            type="text"
                            name="NIF"
                            value={formData.NIF}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome *</label>
                        <input
                            type="text"
                            name="Nome"
                            value={formData.Nome}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Província *</label>
                        <select
                            name="Provincia"
                            value={formData.Provincia}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="">Selecione a província</option>
                            {provincias.map(prov => (
                                <option key={prov.slug} value={prov.slug}>{prov.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Telefone *</label>
                        <input
                            type="text"
                            name="Telefone"
                            value={formData.Telefone}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status *</label>
                        <select
                            name="Status"
                            value={formData.Status}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        >
                            <option value="">Selecione</option>
                            <option value="Ativo">Ativo</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/registros')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Salvar
                    </button>
                </div>
            </form>
            <div className="mt-6">
                <h3 className="font-bold mb-2">Cursos de Interesse da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cursos.map(curso => (
                        <div key={curso.curso_id} className="flex items-center">
                            <input
                               className='accent-red-600'
                                type="checkbox"
                                id={`curso-${curso.curso_id}`}
                                value={curso.curso_id}
                                checked={cursosInteresse.includes(curso.curso_id)}
                                onChange={(e) => {
                                    const id = curso.curso_id;
                                    if (e.target.checked) {
                                        setCursosInteresse([...cursosInteresse, id]);
                                    } else {
                                        setCursosInteresse(cursosInteresse.filter(cid => cid !== id));
                                    }
                                }}
                            />
                            <label htmlFor={`curso-${curso.curso_id}`} className="ml-2">{curso.curso_nome}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}