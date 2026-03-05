import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Coffee, Lock, User, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login(username, password);

        if (result.success) {
            navigate('/inventory');
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-coffee-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-coffee-100 overflow-hidden animate-fade-in-up">

                {/* Header Pattern */}
                <div className="bg-coffee-900 h-32 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                    }}></div>
                    <div className="bg-white/10 p-4 rounded-full backdrop-blur-md relative z-10 border border-white/20">
                        <Coffee className="w-10 h-10 text-cream-50" color="#F3F2F1" />
                    </div>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-coffee-900 mb-2 tracking-tight">Welcome Back</h2>
                        <p className="text-coffee-600 font-medium text-sm">Sign in to manage the coffee fleet.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100 flex items-center">
                            <Lock className="w-4 h-4 mr-2 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-coffee-700 tracking-wider uppercase ml-1">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-coffee-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-coffee-50/50 border border-coffee-200 rounded-xl focus:ring-4 focus:ring-coffee-500/20 focus:border-coffee-500 transition-all text-coffee-900 font-medium placeholder-coffee-300"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-coffee-700 tracking-wider uppercase ml-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-coffee-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-coffee-50/50 border border-coffee-200 rounded-xl focus:ring-4 focus:ring-coffee-500/20 focus:border-coffee-500 transition-all text-coffee-900 font-medium placeholder-coffee-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center bg-coffee-800 text-white font-bold rounded-xl py-4 transition-all hover:bg-coffee-900 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 mt-8"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm font-medium text-coffee-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-coffee-900 hover:text-coffee-700 underline decoration-2 underline-offset-2">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
