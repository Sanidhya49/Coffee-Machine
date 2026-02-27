import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import AddMachine from './components/AddMachine';
import EditReviewMachine from './components/EditReviewMachine';
import ViewMachine from './components/ViewMachine';
import CompareMachines from './components/CompareMachines';
import { Coffee, UserCircle } from 'lucide-react';

function MainLayout() {
  const [role, setRole] = useState('Admin'); // 'Admin', 'L1', 'L2'
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

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

            {/* Role Switcher - Hidden on Professional Landing Page */}
            {!isLandingPage && (
              <div className="flex items-center space-x-2 bg-white border border-coffee-200 rounded-lg px-1.5 sm:px-2 shadow-sm">
                <UserCircle size={20} className="text-coffee-500 hidden sm:block" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-transparent text-coffee-900 text-xs sm:text-sm font-semibold rounded-lg focus:ring-0 focus:border-0 block p-1.5 sm:p-2 md:w-32 active:outline-none cursor-pointer outline-none border-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="L1">L1 Reviewer</option>
                  <option value="L2">L2 Reviewer</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`flex-1 w-full mx-auto ${isLandingPage ? 'flex flex-col' : 'max-w-7xl px-4 sm:px-6 lg:px-8 py-8'}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/inventory" element={<Dashboard role={role} />} />
          <Route path="/view/:id" element={<ViewMachine role={role} />} />
          <Route path="/compare" element={<CompareMachines role={role} />} />
          <Route path="/add" element={<AddMachine role={role} />} />
          <Route path="/edit/:id" element={<EditReviewMachine role={role} mode="edit" />} />
          <Route path="/review/:id" element={<EditReviewMachine role={role} mode="review" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

export default App;
