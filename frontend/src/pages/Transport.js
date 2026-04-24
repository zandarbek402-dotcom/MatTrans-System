import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Contacts from '../components/Contacts';

const Transport = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      // Демо деректер
      setTimeout(() => {
        setVehicles([
          { id: 1, name: 'Mercedes Actros', type: 'Фура', plate: 'KZ 123 ABC', capacity: '20 тонн', status: 'available', driver: 'Али Ибраев', phone: '+7 777 123 4567', location: 'Алматы' },
          { id: 2, name: 'Volvo FH', type: 'Фура', plate: 'KZ 456 DEF', capacity: '25 тонн', status: 'busy', driver: 'Серік Жумабаев', phone: '+7 777 987 6543', location: 'Нұр-Сұлтан' },
          { id: 3, name: 'КамАЗ 6520', type: 'Самосвал', plate: 'KZ 789 GHI', capacity: '15 тонн', status: 'available', driver: 'Болат Сейтов', phone: '+7 705 111 2233', location: 'Шымкент' },
          { id: 4, name: 'MAN TGX', type: 'Фура', plate: 'KZ 321 JKL', capacity: '22 тонн', status: 'maintenance', driver: 'Ерлан Муханов', phone: '+7 701 444 5566', location: 'Алматы' },
          { id: 5, name: 'Scania R500', type: 'Фура', plate: 'KZ 654 MNO', capacity: '24 тонн', status: 'available', driver: 'Марат Акбаев', phone: '+7 747 777 8888', location: 'Атырау' },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Көліктерді жүктеу қатесі:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const getStatusBadge = (status) => {
    const badges = {
      'available': { text: '✅ Бос', class: 'badge-success' },
      'busy': { text: '🚚 Жұмыс істеуде', class: 'badge-warning' },
      'maintenance': { text: '🔧 Жөндеуде', class: 'badge-danger' },
    };
    return badges[status] || { text: status, class: 'badge-info' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Көліктер жүктелуде...</p>
      </div>
    );
  }

  const filteredVehicles = vehicles.filter(v => 
    (statusFilter === '' || v.status === statusFilter) &&
    (searchTerm === '' || v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.plate.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">🚛 Көлік құралдары</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/transport/new" className="btn btn-primary">
            ➕ Көлік қосу
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="search-filter-bar">
        <input
          type="text"
          placeholder="🔍 Атауы немесе нөмірі бойынша іздеу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">📊 Барлық күйлер</option>
          <option value="available">✅ Бос</option>
          <option value="busy">🚚 Жұмыс істеуде</option>
          <option value="maintenance">🔧 Жөндеуде</option>
        </select>
        <button type="submit" className="btn btn-primary">🔍 Іздеу</button>
      </form>

      <div className="vehicles-grid">
        {filteredVehicles.length === 0 ? (
          <div className="card empty-card">
            <div className="empty-state">
              <div className="empty-icon">🚛</div>
              <p>Көліктер табылмады</p>
              <Link to="/transport/new" className="btn btn-primary">Көлік қосу</Link>
            </div>
          </div>
        ) : (
          filteredVehicles.map((vehicle, index) => {
            const statusBadge = getStatusBadge(vehicle.status);
            return (
              <div key={vehicle.id} className="vehicle-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="vehicle-header">
                  <div className="vehicle-icon">🚛</div>
                  <div className="vehicle-info">
                    <h3>{vehicle.name}</h3>
                    <span className="vehicle-plate">{vehicle.plate}</span>
                  </div>
                  <span className={`badge ${statusBadge.class}`}>{statusBadge.text}</span>
                </div>

                <div className="vehicle-specs">
                  <div className="spec-item">
                    <span className="spec-label">Түрі</span>
                    <span className="spec-value">{vehicle.type}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Жүк көліктілігі</span>
                    <span className="spec-value">{vehicle.capacity}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Орналасқан жері</span>
                    <span className="spec-value">{vehicle.location}</span>
                  </div>
                </div>

                <div className="vehicle-driver">
                  <div className="driver-avatar">👤</div>
                  <div className="driver-info">
                    <span className="driver-name">{vehicle.driver}</span>
                    <span className="driver-phone">📞 {vehicle.phone}</span>
                  </div>
                </div>

                <div className="vehicle-actions">
                  <Link to={`/transport/${vehicle.id}`} className="btn btn-primary btn-sm">
                    👁️ Көру
                  </Link>
                  <Link to={`/transport/${vehicle.id}/edit`} className="btn btn-success btn-sm">
                    ✏️ Өңдеу
                  </Link>
                  <button className="btn btn-danger btn-sm">
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

export default Transport;
