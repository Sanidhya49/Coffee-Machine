import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { CheckCircle, XCircle, Loader2, Save, ArrowLeft, Settings, Trash2 } from 'lucide-react';

function EditReviewMachine({ role, mode }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [machine, setMachine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchMachine = async () => {
            try {
                const response = await api.get(`/machines/${id}`);
                setMachine(response.data);
            } catch (err) {
                console.error("Failed to fetch machine", err);
                alert("Failed to load machine data");
                navigate('/inventory');
            } finally {
                setLoading(false);
            }
        };
        fetchMachine();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMachine(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const handleLevel1Submit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put(`/machines/${id}`, {
                ...machine,
                status: 'Pending Level 2'
            });
            alert('Machine updated and sent to Level 2 for review.');
            navigate('/inventory');
        } catch (err) {
            console.error(err);
            alert('Failed to update machine.');
        } finally {
            setSaving(false);
        }
    };

    const handleLevel2Review = async (newStatus) => {
        setSaving(true);
        try {
            await api.put(`/machines/${id}`, { status: newStatus });
            alert(`Machine ${newStatus.toLowerCase()} successfully.`);
            navigate('/inventory');
        } catch (err) {
            console.error(err);
            alert('Failed to update status.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteMachine = async () => {
        setSaving(true);
        try {
            await api.delete(`/machines/${id}`);
            alert('Machine permanently deleted from the database.');
            navigate('/inventory');
        } catch (err) {
            console.error(err);
            alert('Failed to delete machine.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="animate-spin text-coffee-600" size={48} />
            <p className="text-gray-500 font-medium">Loading machine data...</p>
        </div>
    );

    if (!machine) return null;

    const isL2DeleteReview = mode === 'review' && machine.status === 'Pending Deletion';

    return (
        <div className="max-w-3xl mx-auto pb-12 animate-fade-in-up">
            <button
                onClick={() => navigate('/inventory')}
                className="flex items-center space-x-2 text-coffee-500 hover:text-coffee-700 transition mb-6 font-medium text-sm"
            >
                <ArrowLeft size={18} />
                <span>Back to Inventory</span>
            </button>

            <div className={`bg-white rounded-[2rem] shadow-sm border overflow-hidden ${isL2DeleteReview ? 'border-red-200' : 'border-gray-100'}`}>
                <div className={`${isL2DeleteReview ? 'bg-red-50 text-red-900 border-b border-red-100' : 'bg-coffee-50/50 border-b border-coffee-100'} p-5 sm:p-6`}>
                    <div className="flex items-center space-x-3">
                        {isL2DeleteReview ?
                            <div className="bg-red-100 p-2.5 rounded-xl"><Trash2 size={22} className="text-red-600" /></div> :
                            (mode === 'edit' ? <div className="bg-coffee-100 p-2.5 rounded-xl"><Settings size={22} className="text-coffee-700" /></div> : <div className="bg-amber-100 p-2.5 rounded-xl"><CheckCircle size={22} className="text-amber-600" /></div>)
                        }
                        <div>
                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
                                {isL2DeleteReview ? 'Review Deletion Request' : (mode === 'edit' ? 'Edit Details (L1)' : 'Review Updates (L2)')}
                            </h2>
                            <p className={`mt-0.5 font-medium text-xs sm:text-sm ${isL2DeleteReview ? 'text-red-600' : 'text-coffee-600'}`}>
                                {isL2DeleteReview ? 'An L1 reviewer has requested to permanently delete this machine.' : 'Verify the details before publishing to the live inventory.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-5 sm:p-6 md:p-8">
                    {mode === 'edit' ? (
                        <form onSubmit={handleLevel1Submit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Machine Name</label>
                                    <input required type="text" name="machine_name" value={machine.machine_name} onChange={handleChange} className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand Name</label>
                                    <input required type="text" name="brand_name" value={machine.brand_name} onChange={handleChange} className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm" />
                                </div>
                                <div className="space-y-1.5 relative">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Machine Type</label>
                                    <select name="machine_type" value={machine.machine_type} onChange={handleChange} className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 pr-10 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm cursor-pointer appearance-none">
                                        <option value="Espresso">Espresso</option>
                                        <option value="Drip">Drip</option>
                                        <option value="Pour Over">Pour Over</option>
                                        <option value="Pod">Pod</option>
                                        <option value="French Press">French Press</option>
                                        <option value="AeroPress">AeroPress</option>
                                    </select>
                                    <div className="absolute top-[26px] right-0 flex items-center px-3 pointer-events-none text-coffee-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₹)</label>
                                    <input required type="number" step="0.01" name="price" value={machine.price} onChange={handleChange} className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Color Variant</label>
                                    <input required type="text" name="color" value={machine.color} onChange={handleChange} className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                <textarea required name="description" value={machine.description} onChange={handleChange} rows="3" className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm resize-none"></textarea>
                            </div>
                            <div className="pt-5 border-t border-gray-100 flex justify-end">
                                <button type="submit" disabled={saving} className="px-6 py-2.5 font-bold text-white bg-coffee-800 hover:bg-coffee-900 rounded-xl shadow-md transition flex items-center space-x-2 text-sm hover:-translate-y-0.5">
                                    <Save size={18} />
                                    <span>{saving ? 'Saving...' : 'Save & Send to L2'}</span>
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="w-full md:w-1/3 bg-gray-50 rounded-2xl overflow-hidden shadow-inner h-64 border border-gray-100">
                                    <img
                                        src={machine.image_url}
                                        alt={machine.machine_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'; }}
                                    />
                                </div>

                                <div className="flex-1 space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Machine Information</h3>
                                        <div className="mt-2 text-2xl font-black text-gray-900">{machine.machine_name}</div>
                                        <div className="text-lg font-medium text-gray-600">{machine.brand_name} • {machine.machine_type} • {machine.color}</div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Proposed Price</h3>
                                        <div className="mt-2 text-3xl font-black text-coffee-600">₹{machine.price.toFixed(2)}</div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Description Content</h3>
                                        <div className="mt-2 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">{machine.description}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                                {isL2DeleteReview ? (
                                    <>
                                        <button
                                            onClick={() => handleLevel2Review('Approved')}
                                            disabled={saving}
                                            className="px-5 py-2.5 font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition flex items-center justify-center space-x-2 text-sm"
                                        >
                                            <XCircle size={18} />
                                            <span>Reject Deletion (Keep)</span>
                                        </button>
                                        <button
                                            onClick={handleDeleteMachine}
                                            disabled={saving}
                                            className="px-5 py-2.5 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
                                        >
                                            <Trash2 size={18} />
                                            <span>Confirm Deletion</span>
                                        </button>
                                    </>
                                ) : machine.status === 'Rejected' && (role === 'L2' || role === 'Admin') ? (
                                    <button
                                        onClick={handleDeleteMachine}
                                        disabled={saving}
                                        className="px-5 py-2.5 font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
                                    >
                                        <Trash2 size={18} />
                                        <span>Delete Rejected Machine permanently</span>
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleLevel2Review('Rejected')}
                                            disabled={saving}
                                            className="px-5 py-2.5 font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition flex items-center justify-center space-x-2 text-sm"
                                        >
                                            <XCircle size={18} />
                                            <span>Reject Update</span>
                                        </button>
                                        <button
                                            onClick={() => handleLevel2Review('Approved')}
                                            disabled={saving}
                                            className="px-5 py-2.5 font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm"
                                        >
                                            <CheckCircle size={18} />
                                            <span>Approve & Publish</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EditReviewMachine;
