import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Contacts from '../components/Contacts';

const Routes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [materials, setMaterials] = useState([]);

  const fetchMaterials = useCallback(async () => {
    try {
      const response = await axios.get('/api/materials/');
      setMaterials(response.data.results || response.data);
    } catch (error) {
      console.error('Материалдарды жүктеу қатесі:', error);
    }
  }, []);

  const fetchRoutes = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (materialFilter) params.material = materialFilter;
      if (searchTerm) params.search = searchTerm;

      const response = await axios.get('/api/transport/routes/', { params });
      setRoutes(response.data.results || response.data);
    } catch (error) {
      console.error('Маршруттарды жүктеу қатесі:', error);
      // Демо деректер API қате болғанда
      setRoutes([
        { id: 1, material: { name: 'Цемент' }, origin_location: 'Алматы', destination_location: 'Астана', status: 'planned', quantity: 50 },
        { id: 2, material: { name: 'Кірпіш' }, origin_location: 'Шымкент', destination_location: 'Алматы', status: 'in_progress', quantity: 1000 },
        { id: 3, material: { name: 'Құм' }, origin_location: 'Атырау', destination_location: 'Ақтау', status: 'completed', quantity: 30 },
      ]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, materialFilter, searchTerm]);

  useEffect(() => {
    fetchMaterials();
    fetchRoutes();
  }, [fetchMaterials, fetchRoutes]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRoutes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Бұл маршрутты жоюға сенімдісіз бе?')) return;
    try {
      await axios.delete(`/api/transport/routes/${id}/`);
      fetchRoutes();
    } catch (error) {
      alert('Маршрутты жою кезінде қате орын алды');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Маршруттар жүктелуде...</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const badges = {
      'planned': { text: '📋 Жоспарланған', class: 'badge-info' },
      'in_progress': { text: '🚚 Тасымалдауда', class: 'badge-warning' },
      'completed': { text: '✅ Жеткізілген', class: 'badge-success' },
      'cancelled': { text: '❌ Бас тартылды', class: 'badge-danger' },
    };
    return badges[status] || { text: status, class: 'badge-info' };
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">🗺️ Маршруттар</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/routes/new" className="btn btn-primary">
            ➕ Маршрут қосу
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="search-filter-bar">
        <input
          type="text"
          placeholder="🔍 Бастапқы немесе соңғы нүкте бойынша іздеу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">📊 Барлық күйлер</option>
          <option value="planned">📋 Жоспарланған</option>
          <option value="in_progress">🚚 Тасымалдауда</option>
          <option value="completed">✅ Жеткізілген</option>
          <option value="cancelled">❌ Бас тартылды</option>
        </select>
        <select value={materialFilter} onChange={(e) => setMaterialFilter(e.target.value)}>
          <option value="">📦 Барлық материалдар</option>
          {materials.map((mat) => (
            <option key={mat.id} value={mat.id}>{mat.name}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">🔍 Іздеу</button>
      </form>

      <div className="routes-grid">
        {routes.length === 0 ? (
          <div className="card empty-card">
            <div className="empty-state">
              <div className="empty-icon">🗺️</div>
              <p>Маршруттар табылмады</p>
              <Link to="/routes/new" className="btn btn-primary">Маршрут қосу</Link>
            </div>
          </div>
        ) : (
          routes.map((route, index) => {
            const statusBadge = getStatusBadge(route.status);
            return (
              <div key={route.id} className="route-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="route-header">
                  <h3>{route.material?.name || 'Материал'}</h3>
                  <span className={`badge ${statusBadge.class}`}>{statusBadge.text}</span>
                </div>
                
                <div className="route-path">
                  <div className="route-point">
                    <div className="point-marker start">📍</div>
                    <div className="point-info">
                      <span className="point-label">Бастапқы нүкте</span>
                      <span className="point-value">{route.origin_location}</span>
                    </div>
                  </div>
                  <div className="route-line">
                    <div className="route-arrow">→</div>
                    <span className="route-distance">{route.distance || '?'} км</span>
                  </div>
                  <div className="route-point">
                    <div className="point-marker end">🏁</div>
                    <div className="point-info">
                      <span className="point-label">Соңғы нүкте</span>
                      <span className="point-value">{route.destination_location}</span>
                    </div>
                  </div>
                </div>

                <div className="route-details">
                  <div className="detail-item">
                    <span className="detail-icon">📦</span>
                    <span>{route.quantity} {route.material?.unit || 'дана'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🚛</span>
                    <span>{route.transport_type || 'Көлік'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <span>{route.estimated_cost ? `${route.estimated_cost} тг` : 'Белгісіз'}</span>
                  </div>
                </div>

                <div className="route-actions">
                  <Link to={`/routes/${route.id}`} className="btn btn-primary btn-sm">
                    👁️ Көру
                  </Link>
                  <Link to={`/routes/${route.id}/edit`} className="btn btn-success btn-sm">
                    ✏️ Өңдеу
                  </Link>
                  <button onClick={() => handleDelete(route.id)} className="btn btn-danger btn-sm">
                    🗑️ Жою
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Contacts />
    </div>
  );
};

export default Routes;
