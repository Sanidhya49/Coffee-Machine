import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Edit3, Trash2, CheckCircle, Loader2, AlertCircle } from 'lucide-react';

function ViewMachine({ role }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [machine, setMachine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestingDeletion, setRequestingDeletion] = useState(false);

    useEffect(() => {
        const fetchMachine = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/machines/${id}`);
                setMachine(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching machine details:", err);
                setError("Failed to load machine details. It may have been deleted.");
            } finally {
                setLoading(false);
            }
        };
        fetchMachine();
    }, [id]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Pending Level 2': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Pending Deletion': return 'bg-purple-100 text-purple-800 border-purple-200 animate-pulse';
            case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const handleRequestDeletion = async () => {
        if (!window.confirm("Are you sure you want to request deletion for this machine? This will send it to L2 for approval.")) {
            return;
        }

        setRequestingDeletion(true);
        try {
            const response = await api.put(`/machines/${id}`, { status: 'Pending Deletion' });
            setMachine(response.data);
            alert("Deletion request submitted to Level 2 reviewers.");
        } catch (err) {
            console.error("Failed to request deletion:", err);
            alert("Failed to submit deletion request.");
        } finally {
            setRequestingDeletion(false);
        }
    };

    const handleDeleteDirectly = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this rejected machine? This action cannot be undone.")) {
            return;
        }

        setRequestingDeletion(true);
        try {
            await api.delete(`/machines/${id}`);
            alert("Machine successfully deleted.");
            navigate('/inventory');
        } catch (err) {
            console.error("Failed to delete machine:", err);
            alert("Failed to delete machine.");
            setRequestingDeletion(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="animate-spin text-coffee-600" size={48} />
                <p className="text-gray-500 font-medium">Loading machine details...</p>
            </div>
        );
    }

    if (error || !machine) {
        return (
            <div className="bg-red-50 text-red-800 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto mt-12 text-center">
                <AlertCircle size={48} className="text-red-500" />
                <div>
                    <h2 className="font-bold text-xl mb-2">Error</h2>
                    <p>{error}</p>
                </div>
                <button onClick={() => navigate('/inventory')} className="mt-4 bg-red-100 px-6 py-2 rounded-xl text-red-700 font-bold hover:bg-red-200 transition">
                    Back to Inventory
                </button>
            </div>
        );
    }

    const canEdit = (role === 'L1' || role === 'Admin') && machine.status === 'New';
    const canReview = (role === 'L2' || role === 'Admin') && (machine.status === 'Pending Level 2' || machine.status === 'Pending Deletion');
    const canRequestDeletion = (role === 'L1' || role === 'Admin') && (machine.status === 'Approved' || machine.status === 'New');
    const canDeleteDirectly = machine.status === 'Rejected';

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-fade-in-up">
            <button
                onClick={() => navigate('/inventory')}
                className="flex items-center space-x-2 text-coffee-500 hover:text-coffee-700 transition mb-6 font-medium text-sm"
            >
                <ArrowLeft size={18} />
                <span>Back to Inventory</span>
            </button>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-1/2 h-80 md:h-auto relative bg-gray-50 flex-shrink-0">
                    <img
                        src={machine.image_url}
                        alt={machine.machine_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'; }}
                    />
                    <div className="absolute top-4 left-4">
                        <span className={`px-4 py-1.5 text-sm font-bold rounded-full border shadow-md ${getStatusBadge(machine.status)} bg-white/90 backdrop-blur-sm`}>
                            {machine.status}
                        </span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                        <div className="mb-2 text-coffee-600 font-bold tracking-widest uppercase text-[10px] border-b border-coffee-100 pb-3 inline-block">
                            {machine.brand_name} • {machine.machine_type}
                        </div>

                        <h1 className="text-2xl md:text-3xl font-extrabold text-coffee-900 mt-2 mb-3 leading-tight">
                            {machine.machine_name}
                        </h1>

                        <div className="bg-coffee-50 text-coffee-700 text-2xl font-black rounded-2xl p-4 text-center shadow-inner border border-coffee-100 mb-6">
                            ₹{machine.price.toFixed(2)}
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Color Variant</h4>
                                <p className="text-gray-900 font-semibold text-sm">{machine.color}</p>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h4>
                                <p className="text-gray-600 leading-relaxed min-h-[80px] text-sm">{machine.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Center Container */}
                    <div className="pt-5 border-t border-gray-100 flex flex-col space-y-2.5">
                        {canEdit && (
                            <button onClick={() => navigate(`/edit/${machine.id}`)} className="flex-1 flex items-center justify-center space-x-2 bg-coffee-800 hover:bg-coffee-900 text-white py-2.5 px-6 rounded-xl font-bold shadow-md transition text-sm">
                                <Edit3 size={18} />
                                <span>Edit Machine details</span>
                            </button>
                        )}

                        {canReview && (
                            <button onClick={() => navigate(`/review/${machine.id}`)} className="flex-1 flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 px-6 rounded-xl font-bold shadow-md transition text-sm">
                                <CheckCircle size={18} />
                                <span>Review Required</span>
                            </button>
                        )}

                        {canRequestDeletion && (
                            <button
                                onClick={handleRequestDeletion}
                                disabled={requestingDeletion}
                                className="flex-1 flex items-center justify-center space-x-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-2.5 px-6 rounded-xl font-bold shadow-sm transition disabled:opacity-50 text-sm"
                            >
                                <Trash2 size={18} />
                                <span>{requestingDeletion ? 'Requesting...' : 'Request Deletion (L1)'}</span>
                            </button>
                        )}

                        {canDeleteDirectly && (
                            <button
                                onClick={handleDeleteDirectly}
                                disabled={requestingDeletion}
                                className="flex-1 flex items-center justify-center space-x-2 bg-red-600 text-white hover:bg-red-700 py-2.5 px-6 rounded-xl font-bold shadow-md transition disabled:opacity-50 text-sm"
                            >
                                <Trash2 size={18} />
                                <span>{requestingDeletion ? 'Deleting...' : 'Delete Rejected Machine'}</span>
                            </button>
                        )}

                        {!canEdit && !canReview && !canRequestDeletion && !canDeleteDirectly && (
                            <div className="text-center py-3 text-gray-500 font-semibold bg-gray-50 rounded-xl border border-gray-200">
                                No further actions required
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewMachine;
