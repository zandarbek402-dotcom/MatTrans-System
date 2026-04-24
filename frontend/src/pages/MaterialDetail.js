import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

const MaterialDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [material, setMaterial] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterial();
    fetchRoutes();
  }, [id]);

  const fetchMaterial = async () => {
    try {
      const response = await axios.get(`/api/materials/${id}/`);
      setMaterial(response.data);
    } catch (error) {
      console.error('Failed to fetch material:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`/api/transport/routes/material/${id}/`);
      setRoutes(response.data);
    } catch (error) {
      console.error('Failed to fetch routes:', error);
    }
  };

  if (loading) {
    return <div className="loading">Жүктелуде...</div>;
  }

  if (!material) {
    return <div className="error">Материал табылмады</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{material.name}</h1>
        <Link to={`/materials/${id}/edit`} className="btn btn-primary">
          ✏️ Өңдеу
        </Link>
      </div>

      <div className="card">
        <h2>Материал ақпараты</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div>
            <strong>Атауы:</strong> {material.name}
          </div>
          <div>
            <strong>Санаты:</strong> {material.category_name || '-'}
          </div>
          <div>
            <strong>Саны:</strong> {material.quantity} {material.unit}
          </div>
          <div>
            <strong>Күйі:</strong> {material.status}
          </div>
          <div>
            <strong>Орналасқан жері:</strong> {material.location || '-'}
          </div>
          <div>
            <strong>Жеткізуші:</strong> {material.supplier || '-'}
          </div>
          <div>
            <strong>Жеткізу күні:</strong> {material.delivery_date || '-'}
          </div>
          <div>
            <strong>Бірлік бағасы:</strong> {material.price_per_unit ? `${material.price_per_unit} ₸` : '-'}
          </div>
        </div>
        {material.description && (
          <div style={{ marginTop: '20px' }}>
            <strong>Сипаттама:</strong>
            <p>{material.description}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h2>Тасымал маршруттары</h2>
        {routes.length === 0 ? (
          <p>Бұл материал үшін маршруттар жоқ</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Бастапқы жер</th>
                <th>Мақсатты жер</th>
                <th>Саны</th>
                <th>Күйі</th>
                <th>Жоспарланған күні</th>
                <th>Әрекеттер</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.id}>
                  <td>{route.origin_location}</td>
                  <td>{route.destination_location}</td>
                  <td>{route.quantity}</td>
                  <td>{route.status}</td>
                  <td>{route?.planned_date ? new Date(route.planned_date).toLocaleDateString('kk-KZ') : '-'}</td>
                  <td>
                    <Link
                      to={`/transport/${route.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Көру
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {isAdmin && (
          <Link
            to={`/transport/new?material=${id}`}
            className="btn btn-success"
            style={{ marginTop: '15px' }}
          >
            Жаңа маршрут қосу
          </Link>
        )}
      </div>

      <Link to="/materials" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
        Артқа
      </Link>
    </div>
  );
};

export default MaterialDetail;


