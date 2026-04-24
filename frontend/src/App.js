import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Materials from './pages/Materials';
import MaterialDetail from './pages/MaterialDetail';
import MaterialForm from './pages/MaterialForm';
import RoutesPage from './pages/Routes';
import Transport from './pages/Transport';
import Orders from './pages/Orders';
import Tracking from './pages/Tracking';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Login - Кіру */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            
            {/* Materials - Материалдар */}
            <Route path="/materials" element={<Materials />} />
            <Route path="/materials/new" element={<MaterialForm />} />
            <Route path="/materials/:id" element={<MaterialDetail />} />
            <Route path="/materials/:id/edit" element={<MaterialForm />} />
            
            {/* Routes - Маршруттар */}
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/routes/new" element={<div className="card">Маршрут қосу формасы</div>} />
            <Route path="/routes/:id" element={<div className="card">Маршрут детальдары</div>} />
            <Route path="/routes/:id/edit" element={<div className="card">Маршрут өңдеу</div>} />
            
            {/* Transport - Көлік */}
            <Route path="/transport" element={<Transport />} />
            <Route path="/transport/new" element={<div className="card">Көлік қосу формасы</div>} />
            <Route path="/transport/:id" element={<div className="card">Көлік детальдары</div>} />
            <Route path="/transport/:id/edit" element={<div className="card">Көлік өңдеу</div>} />
            
            {/* Orders - Тапсырыстар */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/new" element={<div className="card">Тапсырыс қосу формасы</div>} />
            
            {/* Tracking - Бақылау */}
            <Route path="/tracking" element={
              <PrivateRoute requireAuth>
                <Tracking />
              </PrivateRoute>
            } />
            
            {/* Admin Panel - Админ панель */}
            <Route path="/admin" element={
              <PrivateRoute requireAuth>
                <div className="card">
                  <h1>👨‍💼 Админ панель</h1>
                  <p>Басқару панелі</p>
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;


