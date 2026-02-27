import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import MachineCard from './MachineCard';
import { Loader2, AlertCircle, Layers, X } from 'lucide-react';

function Dashboard({ role }) {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search & Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // Compare State
    const [compareList, setCompareList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            setLoading(true);
            const response = await api.get('/machines');
            setMachines(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching machines:", err);
            setError('Failed to load coffee machines. Ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="animate-spin text-coffee-600" size={48} />
                <p className="text-gray-500 font-medium">Loading inventory...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-800 p-6 rounded-2xl flex items-center space-x-4">
                <AlertCircle size={32} />
                <div>
                    <h2 className="font-bold text-lg">Connection Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const toggleCompare = (machine) => {
        setCompareList(prev => {
            const isSelected = prev.find(m => m.id === machine.id);
            if (isSelected) {
                return prev.filter(m => m.id !== machine.id);
            } else {
                if (prev.length >= 4) {
                    alert("You can only compare up to 4 machines at a time.");
                    return prev;
                }
                return [...prev, machine];
            }
        });
    };

    const handleCompareNavigate = () => {
        if (compareList.length < 2) {
            alert("Please select at least 2 machines to compare.");
            return;
        }
        navigate('/compare', { state: { machines: compareList } });
    };

    const filteredMachines = machines.filter(machine => {
        const matchesSearch = machine.machine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            machine.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || machine.machine_type === filterType;
        const matchesStatus = filterStatus === 'All' || machine.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Machine Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage and approve the coffee machine fleet.</p>
                </div>

                <div className="bg-coffee-50 text-coffee-700 px-4 py-2 rounded-xl text-sm font-semibold border border-coffee-100 whitespace-nowrap self-start sm:self-auto">
                    Showing {filteredMachines.length} items
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search by machine or brand name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-5 pr-10 py-4 rounded-2xl border-none bg-coffee-50 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition shadow-sm font-medium text-coffee-900 placeholder-coffee-400"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                    <div className="relative flex-1 sm:w-48">
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full py-4 px-5 pr-12 rounded-2xl border-none bg-coffee-50 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition shadow-sm font-medium text-coffee-900 cursor-pointer appearance-none"
                        >
                            <option value="All">All Types</option>
                            <option value="Espresso">Espresso</option>
                            <option value="Drip">Drip</option>
                            <option value="Pour Over">Pour Over</option>
                            <option value="Pod">Pod</option>
                            <option value="French Press">French Press</option>
                            <option value="AeroPress">AeroPress</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-coffee-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative flex-1 sm:w-56">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full py-4 px-5 pr-12 rounded-2xl border-none bg-coffee-50 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition shadow-sm font-medium text-coffee-900 cursor-pointer appearance-none"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="New">Pending Level 1 (New)</option>
                            <option value="Pending Level 2">Pending Level 2</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-coffee-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {filteredMachines.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <h3 className="text-xl font-bold text-gray-700">No machines found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6 gap-3 select-none pb-24">
                    {filteredMachines.map(machine => (
                        <MachineCard
                            key={machine.id}
                            machine={machine}
                            role={role}
                            isSelected={compareList.some(m => m.id === machine.id)}
                            onToggleCompare={toggleCompare}
                        />
                    ))}
                </div>
            )}

            {/* Floating Action Bar for Comparison */}
            {compareList.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-5 z-50 animate-fade-in-up flex justify-center pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-md shadow-2xl border border-gray-200 rounded-2xl p-3 sm:p-4 flex flex-row items-center justify-between w-full max-w-4xl pointer-events-auto transition-transform hover:-translate-y-1 duration-300 gap-2 sm:gap-4">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="bg-coffee-100 p-2 sm:p-3 rounded-xl text-coffee-700 hidden min-[360px]:block">
                                <Layers size={20} className="sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h3 className="text-gray-900 font-extrabold text-sm sm:text-lg leading-tight whitespace-nowrap">Compare</h3>
                                <p className="text-gray-500 text-[10px] sm:text-sm font-medium whitespace-nowrap">{compareList.length} / 4 <span className="hidden sm:inline">machines</span></p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-3 ml-auto">
                            {compareList.length >= 2 ? (
                                <button
                                    onClick={handleCompareNavigate}
                                    className="bg-coffee-600 hover:bg-coffee-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-base font-bold shadow-md transition transform hover:scale-105 whitespace-nowrap"
                                >
                                    Compare Now
                                </button>
                            ) : (
                                <div className="bg-gray-100 text-gray-400 px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl text-xs sm:text-base font-bold whitespace-nowrap cursor-not-allowed">
                                    Select 1 more
                                </div>
                            )}
                            <button
                                onClick={() => setCompareList([])}
                                className="p-1.5 sm:p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                                title="Clear Selection"
                            >
                                <X size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
