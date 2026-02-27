import React, { useState, useEffect } from 'react';
import api from '../api';
import MachineCard from './MachineCard';
import { Loader2, AlertCircle } from 'lucide-react';

function Dashboard({ role }) {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <Loader2 className="animate-spin text-indigo-600" size={48} />
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Machine Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage and approve the coffee machine fleet.</p>
                </div>

                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold border border-indigo-100">
                    Showing {machines.length} items
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 select-none">
                {machines.map(machine => (
                    <MachineCard key={machine.id} machine={machine} role={role} />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
