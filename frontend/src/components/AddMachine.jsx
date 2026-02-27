import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { PlusCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

function AddMachine({ role }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        machine_name: '',
        brand_name: '',
        machine_type: 'Espresso',
        price: '',
        color: '',
        description: '',
        image_url: '',
    });
    const [imagePreview, setImagePreview] = useState('');
    const [loading, setLoading] = useState(false);

    // Only Admin can access this route, but we double check
    if (role !== 'Admin') {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="text-gray-500 mt-2">Only Administrators can add new machines.</p>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files && files[0]) {
            const file = files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    image_url: reader.result
                }));
            };

            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'price' ? parseFloat(value) || '' : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.image_url) {
            alert("Please select an image for the machine.");
            return;
        }

        setLoading(true);
        try {
            await api.post('/machines', formData);
            alert('Machine added successfully!');
            navigate('/inventory');
        } catch (error) {
            console.error("Error adding machine:", error);
            alert('Failed to add machine. Please check the backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto pb-12 animate-fade-in-up md:pt-4">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-coffee-50/50 border-b border-coffee-100 p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                    <div className="bg-coffee-100 p-3 rounded-2xl">
                        <PlusCircle className="text-coffee-700" size={28} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-coffee-900 tracking-tight">Add New Coffee Machine</h2>
                        <p className="text-coffee-600 mt-1 font-medium text-sm">Enter the details of the new machine to add it to the pending inventory.</p>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Machine Name*</label>
                                    <input required type="text" name="machine_name" value={formData.machine_name} onChange={handleChange} className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm" placeholder="e.g. Breville Barista" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand Name*</label>
                                    <input required type="text" name="brand_name" value={formData.brand_name} onChange={handleChange} className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm" placeholder="e.g. Breville" />
                                </div>

                                <div className="space-y-1.5 relative">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Machine Type*</label>
                                    <select name="machine_type" value={formData.machine_type} onChange={handleChange} className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 pr-10 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm cursor-pointer appearance-none">
                                        <option value="Espresso">Espresso</option>
                                        <option value="Drip">Drip</option>
                                        <option value="Pour Over">Pour Over</option>
                                        <option value="Pod">Pod</option>
                                        <option value="French Press">French Press</option>
                                        <option value="AeroPress">AeroPress</option>
                                    </select>
                                    <div className="absolute top-[28px] right-0 flex items-center px-3 pointer-events-none text-coffee-600">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₹)*</label>
                                        <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm" placeholder="599.99" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Color Variant*</label>
                                        <input required type="text" name="color" value={formData.color} onChange={handleChange} className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm" placeholder="e.g. Silver" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Machine Image*</label>
                                    <div className="flex flex-col space-y-3">
                                        <input required type="file" accept="image/*" name="image_url" onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-coffee-100 file:text-coffee-700 hover:file:bg-coffee-200 text-sm shadow-sm" />

                                        <div className="w-full h-36 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-gray-50/50 flex items-center justify-center relative transition-colors hover:bg-gray-50">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-400">
                                                    <ImageIcon size={32} className="mb-2 opacity-50" />
                                                    <span className="text-xs font-semibold">Image Preview</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description*</label>
                                    <textarea required name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full rounded-xl border-none bg-coffee-50/50 px-4 py-3 focus:ring-4 focus:ring-coffee-500/20 focus:outline-none transition text-sm font-medium shadow-sm resize-none" placeholder="Short description of the machine..."></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3 w-full max-w-2xl mx-auto">
                            <button type="button" onClick={() => navigate('/inventory')} className="px-5 py-2.5 font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition text-sm">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="px-6 py-2.5 font-bold text-white bg-coffee-800 hover:bg-coffee-900 rounded-xl shadow-md transition hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 flex items-center justify-center text-sm">
                                {loading ? <Loader2 className="animate-spin mr-2" size={18} /> : <PlusCircle className="mr-2" size={18} />}
                                <span>{loading ? 'Adding...' : 'Add Machine'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddMachine;
