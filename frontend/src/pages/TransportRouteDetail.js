import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const TransportRouteDetail = () => {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchRoute();
  }, [id]);

  const fetchRoute = async () => {
    try {
      const response = await axios.get(`/api/transport/routes/${id}/`);
      setRoute(response.data);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error('Failed to fetch route:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Жүктелуде...</div>;
  }

  if (!route) {
    return <div className="error">Маршрут табылмады</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Тасымал маршруты</h1>
        <Link to={`/transport/${id}/edit`} className="btn btn-primary">
          ✏️ Өңдеу
        </Link>
      </div>

      <div className="card">
        <h2>Маршрут ақпараты</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <strong>Материал:</strong>{' '}
            <Link to={`/materials/${route.material}`}>
              {route.material_detail?.name || route.material}
            </Link>
          </div>
          <div>
            <strong>Бастапқы жер:</strong> {route.origin_location}
          </div>
          <div>
            <strong>Мақсатты жер:</strong> {route.destination_location}
          </div>
          <div>
            <strong>Саны:</strong> {route.quantity}
          </div>
          <div>
            <strong>Күйі:</strong> {route.status}
          </div>
          <div>
            <strong>Тасымалдаушы компания:</strong> {route.transport_company || '-'}
          </div>
          <div>
            <strong>Жүргізуші аты:</strong> {route.driver_name || '-'}
          </div>
          <div>
            <strong>Жүргізуші телефоны:</strong> {route.driver_phone || '-'}
          </div>
          <div>
            <strong>Көлік нөмірі:</strong> {route.vehicle_number || '-'}
          </div>
          <div>
            <strong>Жоспарланған күні:</strong>{' '}
            {new Date(route.planned_date).toLocaleString('kk-KZ')}
          </div>
          {route.actual_date && (
            <div>
              <strong>Нақты күні:</strong>{' '}
              {new Date(route.actual_date).toLocaleString('kk-KZ')}
            </div>
          )}
        </div>
        {route.notes && (
          <div style={{ marginTop: '20px' }}>
            <strong>Ескертпелер:</strong>
            <p>{route.notes}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Тасымал тарихы</h2>
        {history.length === 0 ? (
          <p>Тарих жоқ</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Уақыты</th>
                <th>Орналасқан жері</th>
                <th>Күйі</th>
                <th>Жаңартқан пайдаланушы</th>
                <th>Ескертпелер</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.created_at).toLocaleString('kk-KZ')}</td>
                  <td>{item.location}</td>
                  <td>{item.status}</td>
                  <td>{item.updated_by_username || '-'}</td>
                  <td>{item.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Link to="/transport" className="btn btn-primary" style={{ marginTop: '20px' }}>
        Артқа
      </Link>
    </div>
  );
};

export default TransportRouteDetail;


