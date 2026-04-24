import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const TransportRouteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    material: searchParams.get('material') || '',
    origin_location: '',
    destination_location: '',
    quantity: '',
    transport_company: '',
    driver_name: '',
    driver_phone: '',
    vehicle_number: '',
    planned_date: '',
    actual_date: '',
    status: 'planned',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMaterials();
    if (id) {
      fetchRoute();
    }
  }, [id]);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get('/api/materials/');
      setMaterials(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    }
  };

  const fetchRoute = async () => {
    try {
      const response = await axios.get(`/api/transport/routes/${id}/`);
      const route = response.data;
      setFormData({
        material: route.material,
        origin_location: route.origin_location || '',
        destination_location: route.destination_location || '',
        quantity: route.quantity || '',
        transport_company: route.transport_company || '',
        driver_name: route.driver_name || '',
        driver_phone: route.driver_phone || '',
        vehicle_number: route.vehicle_number || '',
        planned_date: route.planned_date ? route.planned_date.split('T')[0] : '',
        actual_date: route.actual_date ? route.actual_date.split('T')[0] : '',
        status: route.status || 'planned',
        notes: route.notes || '',
      });
    } catch (error) {
      console.error('Failed to fetch route:', error);
      setError('Маршрутты жүктеу кезінде қате орын алды');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        ...formData,
        material: parseInt(formData.material),
        quantity: parseFloat(formData.quantity),
        planned_date: formData.planned_date ? `${formData.planned_date}T00:00:00Z` : null,
        actual_date: formData.actual_date ? `${formData.actual_date}T00:00:00Z` : null,
        transport_company: formData.transport_company || null,
        driver_name: formData.driver_name || null,
        driver_phone: formData.driver_phone || null,
        vehicle_number: formData.vehicle_number || null,
        notes: formData.notes || null,
      };

      if (id) {
        await axios.put(`/api/transport/routes/${id}/`, data);
      } else {
        await axios.post('/api/transport/routes/', data);
      }

      navigate('/transport');
    } catch (error) {
      setError(error.response?.data?.detail || 'Сақтау кезінде қате орын алды');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div>
      <h1 className="page-title">{id ? 'Маршрутты өңдеу' : 'Жаңа маршрут қосу'}</h1>
      {error && <div className="error">{error}</div>}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Материал *</label>
            <select
              name="material"
              value={formData.material}
              onChange={handleChange}
              required
              disabled={!!searchParams.get('material')}
            >
              <option value="">Материал таңдау</option>
              {materials.map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.name} ({mat.quantity} {mat.unit})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Бастапқы орналасқан жері *</label>
            <input
              type="text"
              name="origin_location"
              value={formData.origin_location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Мақсатты орналасқан жері *</label>
            <input
              type="text"
              name="destination_location"
              value={formData.destination_location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Тасымалданатын саны *</label>
            <input
              type="number"
              step="0.01"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Тасымалдаушы компания</label>
            <input
              type="text"
              name="transport_company"
              value={formData.transport_company}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Жүргізуші аты</label>
              <input
                type="text"
                name="driver_name"
                value={formData.driver_name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Жүргізуші телефоны</label>
              <input
                type="tel"
                name="driver_phone"
                value={formData.driver_phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Көлік нөмірі</label>
            <input
              type="text"
              name="vehicle_number"
              value={formData.vehicle_number}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Жоспарланған күні *</label>
              <input
                type="datetime-local"
                name="planned_date"
                value={formData.planned_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Нақты күні</label>
              <input
                type="datetime-local"
                name="actual_date"
                value={formData.actual_date}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Күйі *</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="planned">Жоспарланған</option>
              <option value="in_transit">Тасымалдауда</option>
              <option value="completed">Аяқталған</option>
              <option value="cancelled">Бас тартылған</option>
            </select>
          </div>
          <div className="form-group">
            <label>Ескертпелер</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Сақтауда...' : 'Сақтау'}
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate('/transport')}
            >
              Болдырмау
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransportRouteForm;


