import React from 'react';
import { Link } from 'react-router-dom';
import { Edit3, CheckCircle, MoreHorizontal } from 'lucide-react';

function MachineCard({ machine, role, isSelected, onToggleCompare, index = 0 }) {
    const animationDelay = `animation-delay-${Math.min((index % 5 + 1) * 100, 500)}`;
    const getStatusBadge = (status) => {
        switch (status) {
            case 'New':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Pending Level 2':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Pending Deletion':
                return 'bg-purple-100 text-purple-800 border-purple-200 animate-pulse';
            case 'Approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const showEdit = (role === 'L1' || role === 'Admin') && machine.status === 'New';
    const showReview = (role === 'L2' || role === 'Admin') && (machine.status === 'Pending Level 2' || machine.status === 'Pending Deletion');

    return (
        <div className={`bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1 opacity-0 animate-fade-in-up ${animationDelay} ${isSelected ? 'ring-2 sm:ring-4 ring-coffee-600 border-transparent relative z-10 scale-[1.01]' : 'border border-gray-100'}`}>
            {/* Image */}
            <div className="block relative h-32 sm:h-44 md:h-48 lg:h-52 overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
                <Link to={`/view/${machine.id}`} className="absolute inset-0 z-0">
                    <img
                        src={machine.image_url}
                        alt={machine.machine_name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80'; }}
                    />
                </Link>

                {/* Compare checkbox */}
                <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                    <label className="flex items-center bg-white/95 backdrop-blur-sm px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-full shadow-sm cursor-pointer hover:bg-white transition border border-gray-200 gap-1 sm:gap-1.5">
                        <input
                            type="checkbox"
                            checked={isSelected || false}
                            onChange={() => onToggleCompare && onToggleCompare(machine)}
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-coffee-600 rounded border-gray-300 focus:ring-coffee-500 cursor-pointer"
                        />
                        <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 select-none hidden min-[420px]:inline">Compare</span>
                    </label>
                </div>

                {/* Status badge */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 pointer-events-none">
                    <span className={`px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-bold rounded-full border shadow-sm whitespace-nowrap ${getStatusBadge(machine.status)}`}>
                        {machine.status}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col bg-white rounded-b-2xl sm:rounded-b-3xl z-0">
                {/* Name + Price */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-3 mb-2">
                    <Link to={`/view/${machine.id}`} className="block min-w-0">
                        <h3 className="text-sm sm:text-base md:text-lg font-extrabold text-gray-900 truncate hover:text-coffee-600 transition-colors leading-tight" title={machine.machine_name}>
                            {machine.machine_name}
                        </h3>
                    </Link>
                    <span className="text-sm sm:text-base font-black tracking-tight text-coffee-600 bg-coffee-50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg border border-coffee-100 flex-shrink-0 shadow-sm w-fit">
                        ₹{machine.price.toFixed(2)}
                    </span>
                </div>

                {/* Brand + Type */}
                <div className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-500 mb-2 sm:mb-3 uppercase tracking-wider flex flex-wrap items-center gap-1 sm:gap-1.5">
                    <span className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded">{machine.brand_name}</span>
                    <span className="text-gray-300">•</span>
                    <span className="bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded">{machine.machine_type}</span>
                </div>

                {/* Description */}
                <div className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-500 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                    {machine.description}
                </div>

                {/* Action */}
                <div className="mt-auto pt-3 sm:pt-4 border-t border-gray-100">
                    {showEdit && (
                        <Link to={`/edit/${machine.id}`} className="flex items-center justify-center gap-1.5 bg-white text-coffee-800 border border-coffee-200 hover:bg-coffee-50 hover:border-coffee-300 py-1.5 sm:py-2 rounded-xl transition font-bold shadow-sm text-[11px] sm:text-xs md:text-sm">
                            <Edit3 size={14} />
                            <span>Edit / Review</span>
                        </Link>
                    )}

                    {showReview && (
                        <Link to={`/review/${machine.id}`} className="flex items-center justify-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 py-1.5 sm:py-2 rounded-xl transition font-bold shadow-sm text-[11px] sm:text-xs md:text-sm">
                            <CheckCircle size={14} />
                            <span>Review</span>
                        </Link>
                    )}

                    {!showEdit && !showReview && (
                        <Link to={`/view/${machine.id}`} className="flex items-center justify-center gap-1.5 bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600 py-1.5 sm:py-2 rounded-xl transition font-semibold text-[11px] sm:text-xs md:text-sm">
                            <MoreHorizontal size={14} />
                            <span>View Details</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MachineCard;
