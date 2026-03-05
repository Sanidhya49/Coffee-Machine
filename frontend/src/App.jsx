import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import AddMachine from './components/AddMachine';
import EditReviewMachine from './components/EditReviewMachine';
import ViewMachine from './components/ViewMachine';
import CompareMachines from './components/CompareMachines';
import Login from './components/Login';
import Register from './components/Register';
import { Coffee, UserCircle, LogOut } from 'lucide-react';
import { AuthContext, AuthProvider } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role || 'Guest';

  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isAuthView = isLandingPage || isLoginPage || isRegisterPage;

  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col font-sans overflow-hidden">
      {/* Navigation Bar */}
      <nav className={`${isLandingPage ? 'absolute w-full top-0 bg-transparent' : 'bg-white shadow-sm sticky top-0'} z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 md:h-20 items-center">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link to="/" className="flex items-center space-x-2 text-coffee-800 hover:text-coffee-900 transition">
                <Coffee size={28} />
                <span className="font-bold text-base sm:text-xl tracking-tight">Caffeineer</span>
              </Link>

              <div className="hidden md:flex space-x-6">
                <Link to="/inventory" className="text-coffee-800 hover:text-coffee-900 font-bold transition text-sm">Inventory</Link>
                {role === 'Admin' && (
                  <Link to="/add" className="text-coffee-800 hover:text-coffee-900 font-bold transition text-sm">Add Machine</Link>
                )}
              </div>
            </div>

            {/* Auth Actions - Hidden on Landing Page unless requested */}
            {!isAuthView && user && (
              <div className="flex items-center space-x-3 sm:space-x-5">
                <div className="flex items-center space-x-2 bg-coffee-50 border border-coffee-200 rounded-lg px-2 shadow-sm py-1.5">
                  <UserCircle size={18} className="text-coffee-500 hidden sm:block" />
                  <span className="text-coffee-900 text-xs sm:text-sm font-bold pr-1">{user.role}</span>
                </div>
                <button onClick={logout} className="flex items-center space-x-1.5 text-coffee-600 hover:text-red-600 transition" title="Logout">
                  <LogOut size={18} />
                  <span className="text-sm font-bold hidden sm:inline">Logout</span>
                </button>
              </div>
            )}
            {!user && !isAuthView && (
              <div className="flex space-x-3">
                <Link to="/login" className="text-coffee-800 font-bold hover:text-coffee-600 transition self-center text-sm mr-2">
                  Log In
                </Link>
                <Link to="/register" className="bg-coffee-800 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-coffee-900 transition shadow-sm hover:shadow hidden sm:block">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto ${isAuthView ? 'flex flex-col' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-8'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/inventory" element={<ProtectedRoute><Dashboard role={role} /></ProtectedRoute>} />
          <Route path="/view/:id" element={<ProtectedRoute><ViewMachine role={role} /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><CompareMachines role={role} /></ProtectedRoute>} />
          <Route path="/add" element={<ProtectedRoute><AddMachine role={role} /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditReviewMachine role={role} mode="edit" /></ProtectedRoute>} />
          <Route path="/review/:id" element={<ProtectedRoute><EditReviewMachine role={role} mode="review" /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
