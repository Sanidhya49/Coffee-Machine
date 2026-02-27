import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { PlusCircle, Search } from 'lucide-react';

function AddMachine({ role }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        machine_name: '',
        brand_name: '',
        machine_type: 'Espresso',
        price: '',
        color: '',
        description: '',
        image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
        status: 'New'
    });

    if (role !== 'Admin') {
        return (
            <div className="bg-red-50 text-red-800 p-6 rounded-2xl max-w-2xl mx-auto shadow-sm border border-red-100">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                    <Search size={24} />
                    <span>Access Denied</span>
                </h2>
                <p className="mt-2 text-red-700">Only Administrators can add new coffee machines.</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold rounded-lg transition"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submissionData = {
                ...formData,
                price: parseFloat(formData.price) || 0
            };
            await api.post('/machines', submissionData);
            navigate('/');
        } catch (err) {
            console.error("Error creating machine:", err);
            alert("Failed to add machine. See console for details.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-3">
                    <PlusCircle className="text-indigo-600" size={32} />
                    <span>Add New Coffee Machine</span>
                </h1>
                <p className="text-gray-500 mt-2">Enter the details of the new machine to add it to the inventory.</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Machine Name</label>
                                <input required type="text" name="machine_name" value={formData.machine_name} onChange={handleChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" placeholder="e.g. Breville Barista Express" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
                                <input required type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" placeholder="e.g. Breville" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                                <select name="machine_type" value={formData.machine_type} onChange={handleChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition">
                                    <option value="Espresso">Espresso</option>
                                    <option value="Drip">Drip</option>
                                    <option value="Pour Over">Pour Over</option>
                                    <option value="Pod">Pod</option>
                                    <option value="French Press">French Press</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                                <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" placeholder="599.99" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                                <input required type="text" name="color" value={formData.color} onChange={handleChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" placeholder="e.g. Stainless Steel" />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                <input required type="url" name="image_url" value={formData.image_url} onChange={handleChange} className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" placeholder="https://..." />

                                {formData.image_url && (
                                    <div className="mt-4 rounded-xl overflow-hidden h-40 bg-gray-100 flex items-center justify-center border border-gray-200">
                                        <img src={formData.image_url} alt="Preview" className="h-full object-cover w-full opacity-80" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'; }} />
                                    </div>
                                )}
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full rounded-xl border-gray-300 bg-gray-50 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition" placeholder="Short description of the machine..."></textarea>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-4 border-t border-gray-50">
                            <button type="button" onClick={() => navigate('/')} className="px-6 py-3 font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-8 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition hover:shadow-lg disabled:opacity-70 flex items-center justify-center">
                                {loading ? 'Saving...' : 'Add Machine'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddMachine;
