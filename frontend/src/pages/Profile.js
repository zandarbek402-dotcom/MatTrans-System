import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Кіру формасы үшін
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await axios.put('/api/auth/profile/', formData);
      setMessage('Профиль сәтті жаңартылды');
    } catch (error) {
      setError(error.response?.data?.detail || 'Жаңарту кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };

  // Кірусіз қол жетімді - кіру формасын көрсету
  if (!user) {
    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoginLoading(true);
      
      const result = await login(loginData.username, loginData.password);
      
      if (result.success) {
        setMessage('Сәтті кірдіңіз!');
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
      
      setLoginLoading(false);
    };
    
    return (
      <div>
        <h1 className="page-title">🔐 Кіру / Тіркелу</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '900px', margin: '0 auto' }}>
          {/* Кіру формасы */}
          <div className="card">
            <h2 style={{ marginBottom: '20px', color: '#667eea' }}>🚪 Кіру</h2>
            {error && <div className="error">{error}</div>}
            {message && <div className="success">{message}</div>}
            
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>👤 Пайдаланушы аты:</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  placeholder="Пайдаланушы атын енгізіңіз"
                  required
                />
              </div>
              <div className="form-group">
                <label>🔒 Құпия сөз:</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  placeholder="Құпия сөзді енгізіңіз"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loginLoading}
                style={{ width: '100%' }}
              >
                {loginLoading ? '⏳ Кіруде...' : '🚪 Кіру'}
              </button>
            </form>
            
            <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '10px', color: '#64748b' }}>🧪 Тест деректері:</h4>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                <strong>Админ:</strong> admin / admin123<br/>
                <strong>User:</strong> user1 / user12345
              </p>
            </div>
          </div>
          
          {/* Тіркелу бөлімі */}
          <div className="card">
            <h2 style={{ marginBottom: '20px', color: '#10b981' }}>📝 Тіркелу</h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              Жаңа аккаунт жасау үшін төмендегі батырманы басыңыз:
            </p>
            <Link to="/register" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', display: 'inline-block' }}>
              📝 Жаңа аккаунт жасау
            </Link>
            
            <div style={{ marginTop: '30px', padding: '15px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
              <h4 style={{ marginBottom: '10px', color: '#166534' }}>✨ Қол жетімді мүмкіндіктер:</h4>
              <ul style={{ fontSize: '14px', color: '#166534', paddingLeft: '20px' }}>
                <li>📦 Материалдарды көру</li>
                <li>🚛 Тасымал маршруттарын көру</li>
                <li>🔐 Кіруден кейін материал қосу</li>
                <li>🔐 Кіруден кейін маршрут қосу</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Профиль</h1>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <strong>Пайдаланушы аты:</strong> {user.username}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <strong>Рөл:</strong> {user.role === 'admin' ? 'Администратор' : 'Пайдаланушы'}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Электрондық пошта</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Аты</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Тегі</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Сақтауда...' : 'Сақтау'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;


