import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddMachine from './components/AddMachine';
import EditReviewMachine from './components/EditReviewMachine';
import { Coffee, UserCircle } from 'lucide-react';

function App() {
  const [role, setRole] = useState('Admin'); // 'Admin', 'L1', 'L2'

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        {/* Navigation Bar */}
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition">
                  <Coffee size={28} />
                  <span className="font-bold text-xl tracking-tight">Antigravity Coffee</span>
                </Link>

                <div className="hidden md:flex space-x-6">
                  <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition">Dashboard</Link>
                  {role === 'Admin' && (
                    <Link to="/add" className="text-gray-600 hover:text-indigo-600 font-medium transition">Add Machine</Link>
                  )}
                </div>
              </div>

              {/* Role Switcher */}
              <div className="flex items-center space-x-3">
                <UserCircle size={24} className="text-gray-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 md:w-32 active:outline-none"
                >
                  <option value="Admin">Admin</option>
                  <option value="L1">L1 Reviewer</option>
                  <option value="L2">L2 Reviewer</option>
                </select>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard role={role} />} />
            <Route path="/add" element={<AddMachine role={role} />} />
            <Route path="/edit/:id" element={<EditReviewMachine role={role} mode="edit" />} />
            <Route path="/review/:id" element={<EditReviewMachine role={role} mode="review" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
