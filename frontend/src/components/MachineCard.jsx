import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, CheckCircle } from 'lucide-react';

function MachineCard({ machine, role }) {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'New':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Pending Level 2':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const showEdit = (role === 'L1' || role === 'Admin') && machine.status === 'New';
    const showReview = (role === 'L2' || role === 'Admin') && machine.status === 'Pending Level 2';

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col group">
            <div className="h-48 overflow-hidden relative">
                <img
                    src={machine.image_url}
                    alt={machine.machine_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'; }}
                />
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(machine.status)} shadow-sm`}>
                        {machine.status}
                    </span>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 truncate pr-2" title={machine.machine_name}>
                        {machine.machine_name}
                    </h3>
                    <span className="text-lg font-bold tracking-tight text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                        ${machine.price.toFixed(2)}
                    </span>
                </div>

                <p className="text-sm text-gray-500 font-medium mb-1">{machine.brand_name} • {machine.machine_type}</p>

                <div className="mt-4 flex space-x-2 pt-4 border-t border-gray-50 self-end w-full">
                    {showEdit && (
                        <Link
                            to={`/edit/${machine.id}`}
                            className="flex-1 flex items-center justify-center space-x-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-2 rounded-xl transition text-sm font-medium"
                        >
                            <Edit3 size={16} />
                            <span>Edit (L1)</span>
                        </Link>
                    )}
                    {showReview && (
                        <Link
                            to={`/review/${machine.id}`}
                            className="flex-1 flex items-center justify-center space-x-1 bg-amber-50 text-amber-700 hover:bg-amber-100 py-2 rounded-xl transition text-sm font-medium"
                        >
                            <CheckCircle size={16} />
                            <span>Review (L2)</span>
                        </Link>
                    )}
                    {/* Default view button if no actions available */}
                    {!showEdit && !showReview && (
                        <div className="flex-1 py-2 text-center text-sm font-medium text-gray-400 bg-gray-50 rounded-xl cursor-not-allowed">
                            No Action Required
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MachineCard;
