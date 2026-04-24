import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Contacts from '../components/Contacts';

const Tracking = () => {
  const [trackings, setTrackings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTrackings();
  }, []);

  const fetchTrackings = async () => {
    try {
      const response = await axios.get('/api/transport/history/');
      setTrackings(response.data.results || response.data);
    } catch (error) {
      console.error('Трекингті жүктеу қатесі:', error);
      setTrackings([
        { id: 1, material: 'Цемент', origin: 'Алматы', destination: 'Астана', current_location: 'Караганда', status: 'in_transit', progress: 60, driver: 'Али Ибраев', vehicle: 'Mercedes Actros', last_update: '2024-01-20 14:30', eta: '2024-01-21 10:00' },
        { id: 2, material: 'Кірпіш', origin: 'Шымкент', destination: 'Алматы', current_location: 'Тараз', status: 'in_transit', progress: 40, driver: 'Серік Жумабаев', vehicle: 'Volvo FH', last_update: '2024-01-20 13:15', eta: '2024-01-20 18:00' },
        { id: 3, material: 'Құм', origin: 'Атырау', destination: 'Ақтау', current_location: 'Жаңаөзен', status: 'delivered', progress: 100, driver: 'Болат Сейтов', vehicle: 'КамАЗ 6520', last_update: '2024-01-19 16:45', eta: 'Жеткізілді' },
        { id: 4, material: 'Темір', origin: 'Нұр-Сұлтан', destination: 'Қарағанды', current_location: 'Теміртау', status: 'in_transit', progress: 75, driver: 'Ерлан Муханов', vehicle: 'MAN TGX', last_update: '2024-01-20 15:00', eta: '2024-01-20 20:00' },
        { id: 5, material: 'Бетон', origin: 'Алматы', destination: 'Талдықорған', current_location: 'Үшарал', status: 'loading', progress: 10, driver: 'Марат Акбаев', vehicle: 'Scania R500', last_update: '2024-01-20 12:00', eta: '2024-01-20 17:30' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrackings = trackings.filter(item => {
    const matchesFilter = filter === 'all' || item?.status === filter;
    const matchesSearch = item?.material?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item?.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item?.destination?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const badges = {
      'loading': { text: '📦 Жүктеу', class: 'badge-info' },
      'in_transit': { text: '🚚 Жолда', class: 'badge-warning' },
      'delivered': { text: '✅ Жеткізілді', class: 'badge-success' },
      'delayed': { text: '⏰ Кешігу', class: 'badge-danger' },
    };
    return badges[status] || { text: status, class: 'badge-info' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Трекинг жүктелуде...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">🗺️ Тасымалды бақылау</h1>
      </div>

      <div className="tracking-filters">
        <div className="filter-tabs">
          <button 
            className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            📊 Барлығы
          </button>
          <button 
            className={`tab-btn ${filter === 'in_transit' ? 'active' : ''}`}
            onClick={() => setFilter('in_transit')}
          >
            🚚 Жолда
          </button>
          <button 
            className={`tab-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            ✅ Жеткізілген
          </button>
          <button 
            className={`tab-btn ${filter === 'loading' ? 'active' : ''}`}
            onClick={() => setFilter('loading')}
          >
            📦 Жүктелуде
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Материал, бастапқы немесе соңғы нүкте..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="tracking-grid">
        {filteredTrackings.map((item, index) => {
          const statusBadge = getStatusBadge(item.status);
          return (
            <div key={item.id} className="tracking-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="tracking-header">
                <div className="tracking-material">
                  <span className="material-icon">📦</span>
                  <span className="material-name">{item?.material || 'Белгісіз'}</span>
                </div>
                <span className={`badge ${statusBadge.class}`}>{statusBadge.text}</span>
              </div>

              <div className="tracking-route">
                <div className="route-points">
                  <div className="point start">
                    <div className="dot"></div>
                    <span>{item?.origin || '-'}</span>
                  </div>
                  <div className="route-line-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${item?.progress || 0}%` }}></div>
                    </div>
                    <span className="progress-text">{item?.progress || 0}%</span>
                  </div>
                  <div className="point end">
                    <div className="dot"></div>
                    <span>{item?.destination || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="tracking-current">
                <div className="current-label">📍 Ағымдағы орналасқан жері:</div>
                <div className="current-value">{item?.current_location || '-'}</div>
              </div>

              <div className="tracking-details">
                <div className="detail-row">
                  <div className="detail">
                    <span className="detail-icon">🚛</span>
                    <div className="detail-info">
                      <span className="detail-label">Көлік</span>
                      <span className="detail-value">{item?.vehicle || '-'}</span>
                    </div>
                  </div>
                  <div className="detail">
                    <span className="detail-icon">👤</span>
                    <div className="detail-info">
                      <span className="detail-label">Жүргізуші</span>
                      <span className="detail-value">{item?.driver || '-'}</span>
                    </div>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail">
                    <span className="detail-icon">🕐</span>
                    <div className="detail-info">
                      <span className="detail-label">Соңғы жаңарту</span>
                      <span className="detail-value">{item?.last_update || '-'}</span>
                    </div>
                  </div>
                  <div className="detail">
                    <span className="detail-icon">⏰</span>
                    <div className="detail-info">
                      <span className="detail-label">ETA</span>
                      <span className="detail-value eta">{item?.eta || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tracking-actions">
                <button className="btn btn-primary btn-sm">
                  🗺️ Картада көру
                </button>
                <button className="btn btn-secondary btn-sm">
                  📱 Хабарлама жіберу
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTrackings.length === 0 && (
        <div className="card empty-card">
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <p>Тасымал табылмады</p>
          </div>
        </div>
      )}
      <Contacts />
    </div>
  );
};

export default Tracking;
