import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';

function CompareMachines() {
    const location = useLocation();
    const navigate = useNavigate();
    const machines = location.state?.machines || [];

    if (machines.length < 2) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Not enough machines to compare</h2>
                <button onClick={() => navigate('/')} className="text-coffee-600 font-semibold hover:underline bg-coffee-50 px-6 py-2 rounded-xl">
                    Go back to selection
                </button>
            </div>
        );
    }

    const features = [
        { label: 'Brand', key: 'brand_name' },
        { label: 'Type', key: 'machine_type' },
        { label: 'Color', key: 'color' },
        { label: 'Price', key: 'price', format: (v) => `₹${v.toFixed(2)}` },
        { label: 'Status', key: 'status', isBadge: true },
        { label: 'Description', key: 'description' },
    ];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Pending Level 2': return 'bg-yellow-100 text-yellow-800';
            case 'Pending Deletion': return 'bg-purple-100 text-purple-800';
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <button
                        onClick={() => navigate('/inventory')}
                        className="flex items-center space-x-2 text-coffee-500 hover:text-coffee-700 transition mb-1 font-medium text-sm"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to Inventory</span>
                    </button>
                    <h1 className="text-2xl font-extrabold text-coffee-900 tracking-tight">Compare Machines</h1>
                </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px] sm:min-w-0">
                    <thead>
                        <tr>
                            <th className="p-3 sm:p-5 border-b border-r border-gray-100 w-1/4 sm:w-1/5 bg-gray-50/50 align-bottom sticky left-0 z-20">
                                <span className="text-[10px] sm:text-sm font-bold text-gray-500 uppercase tracking-wider">Features</span>
                            </th>
                            {machines.map(machine => (
                                <th key={machine.id} className="p-3 sm:p-5 border-b border-gray-100 w-[25%] sm:w-[20%] min-w-[130px] sm:min-w-[200px] align-top bg-white">
                                    <div className="flex flex-col items-center text-center group">
                                        <div className="h-16 sm:h-24 w-full rounded-xl overflow-hidden mb-2 sm:mb-3 shadow-sm border border-gray-100 relative">
                                            <img
                                                src={machine.image_url}
                                                alt={machine.machine_name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'; }}
                                            />
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-extrabold text-coffee-900 leading-tight mb-1 line-clamp-2">
                                            {machine.machine_name}
                                        </h3>
                                        <div className="text-[10px] sm:text-xs font-black text-coffee-600 bg-coffee-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                                            ₹{machine.price.toFixed(2)}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((feature, idx) => (
                            <tr key={feature.key} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-coffee-50/50 transition-colors`}>
                                <td className="p-3 sm:p-5 border-b border-r border-gray-100 font-bold text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 bg-gray-50/50 sticky left-0 z-10">
                                    {feature.label}
                                </td>
                                {machines.map(machine => (
                                    <td key={machine.id} className="p-3 sm:p-5 border-b border-gray-100 text-gray-800 text-center">
                                        {feature.isBadge ? (
                                            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase rounded-full inline-block ${getStatusBadge(machine.status)}`}>
                                                {machine.status}
                                            </span>
                                        ) : (
                                            <span className={feature.key === 'description' ? 'text-[10px] sm:text-xs text-gray-600 line-clamp-3 text-left inline-block' : 'font-semibold text-xs sm:text-sm'}>
                                                {feature.format ? feature.format(machine[feature.key]) : machine[feature.key]}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CompareMachines;
