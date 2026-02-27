import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ChevronRight, CheckCircle2 } from 'lucide-react';

function LandingPage() {
    return (
        <div className="flex-1 w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 h-full min-h-[calc(100vh-80px)]">
            <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-6 sm:space-y-8 animate-fade-in-up md:-mt-10">

                {/* Aesthetic Hero Text */}
                <div className="space-y-4 sm:space-y-5 flex flex-col items-center">
                    <div className="inline-flex items-center justify-center p-3 bg-coffee-100/50 backdrop-blur-sm rounded-full mb-1 sm:mb-2 shadow-sm border border-coffee-200">
                        <Coffee size={24} className="text-coffee-800 sm:w-7 sm:h-7" />
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-coffee-800 tracking-tight leading-tight drop-shadow-sm pb-1 flex flex-col items-center">
                        <span>Explore</span>
                        <span className="text-coffee-600 italic font-semibold mt-1">Coffee Machines</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-coffee-700 max-w-xl mx-auto font-medium leading-relaxed mt-2 px-2">
                        Discover, review, and manage our premium fleet of espresso, pour over, pod, and drip coffee makers.
                    </p>
                </div>

                {/* Call to Action Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-4 sm:pt-6">
                    <Link
                        to="/inventory"
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 sm:space-x-3 bg-coffee-800 hover:bg-coffee-900 text-coffee-50 px-8 py-3.5 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-xl shadow-coffee-800/30 transition-all transform hover:-translate-y-1 hover:scale-105"
                    >
                        <span>View Inventory</span>
                        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default LandingPage;
