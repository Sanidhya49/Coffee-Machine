import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Settings, Save, CheckCircle, XCircle } from 'lucide-react';

function EditReviewMachine({ role, mode }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [machine, setMachine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchMachine();
    }, [id]);

    const fetchMachine = async () => {
        try {
            const response = await api.get(`/machines/${id}`);
            setMachine(response.data);
        } catch (err) {
            console.error("Error fetching machine:", err);
            alert("Machine not found.");
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMachine(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateStatus = async (newStatus) => {
        setSaving(true);
        try {
            const updateData = mode === 'edit'
                ? { ...machine, price: parseFloat(machine.price) || 0, status: newStatus }
                : { status: newStatus }; // In review mode, we only update status generally

            await api.put(`/machines/${id}`, updateData);
            navigate('/');
        } catch (err) {
            console.error("Error updating machine:", err);
            alert("Failed to update status.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading details...</div>;
    if (!machine) return null;

    // Verify access rights dynamically
    if (mode === 'edit' && role !== 'L1' && role !== 'Admin') {
        return <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl mx-auto max-w-lg mt-10">Access Denied. Only L1 Reviewers or Admins can edit.</div>;
    }
    if (mode === 'review' && role !== 'L2' && role !== 'Admin') {
        return <div className="p-8 text-center text-red-600 bg-red-50 rounded-2xl mx-auto max-w-lg mt-10">Access Denied. Only L2 Reviewers or Admins can review.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            {/* Left Column: Image & ReadOnly Data */}
            <div className="w-full md:w-1/3">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                    <div className="h-64 sm:h-80 md:h-64 object-cover overflow-hidden">
                        <img src={machine.image_url} alt={machine.machine_name} className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'; }} />
                    </div>
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 leading-tight mb-2">{machine.machine_name}</h2>
                        <div className="flex flex-col space-y-1 text-sm text-gray-500 font-medium mb-4">
                            <span>Brand: <span className="text-gray-900">{machine.brand_name}</span></span>
                            <span>Type: <span className="text-gray-900">{machine.machine_type}</span></span>
                            <span>Color: <span className="text-gray-900">{machine.color}</span></span>
                        </div>
                        <div className="text-2xl font-black text-indigo-600 mb-4">${machine.price.toFixed(2)}</div>
                        <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold inline-block border border-gray-200">
                            Current Status: {machine.status}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Editing Form or Review Actions */}
            <div className="w-full md:w-2/3">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-50">
                        {mode === 'edit' ? <Settings size={28} className="text-indigo-600" /> : <CheckCircle size={28} className="text-amber-500" />}
                        <h1 className="text-2xl font-extrabold text-gray-900">
                            {mode === 'edit' ? 'L1 Edit & Escalate' : 'L2 Review & Approval'}
                        </h1>
                    </div>

                    {mode === 'edit' ? (
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateStatus('Pending Level 2'); }} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Machine Name</label>
                                <input required type="text" name="machine_name" value={machine.machine_name} onChange={handleChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                                    <input required type="number" step="0.01" name="price" value={machine.price} onChange={handleChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                                    <input required type="text" name="color" value={machine.color} onChange={handleChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea required name="description" value={machine.description} onChange={handleChange} rows="4" className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"></textarea>
                            </div>

                            <div className="pt-6 flex justify-end space-x-4 border-t border-gray-50 mt-6">
                                <button type="button" onClick={() => navigate('/')} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="px-8 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition flex items-center space-x-2">
                                    <Save size={20} />
                                    <span>{saving ? 'Saving...' : 'Save & Escalate to L2'}</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mb-8">
                                <h3 className="text-amber-800 font-bold mb-2 text-lg">Review Required</h3>
                                <p className="text-amber-700">Please review the machine details carefully. Once approved or rejected, an email notification will be dispatched automatically.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm font-semibold text-gray-500 block mb-1">Description from L1</span>
                                    <p className="text-gray-900 bg-gray-50 p-4 rounded-xl leading-relaxed">{machine.description}</p>
                                </div>
                            </div>

                            <div className="pt-8 flex justify-end space-x-4 border-t border-gray-50 mt-8">
                                <button type="button" onClick={() => navigate('/')} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition">
                                    Back
                                </button>
                                <button onClick={() => handleUpdateStatus('Rejected')} disabled={saving} className="px-6 py-3 font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl shadow-sm transition flex items-center space-x-2 border border-red-200">
                                    <XCircle size={20} />
                                    <span>Reject</span>
                                </button>
                                <button onClick={() => handleUpdateStatus('Approved')} disabled={saving} className="px-8 py-3 font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md transition flex items-center space-x-2">
                                    <CheckCircle size={20} />
                                    <span>Approve Machine</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditReviewMachine;
