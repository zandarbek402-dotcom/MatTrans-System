import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MaterialForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    quantity: '',
    unit: 'piece',
    price_per_unit: '',
    status: 'available',
    location: '',
    supplier: '',
    delivery_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchMaterial();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/materials/categories/');
      setCategories(response.data.results || response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchMaterial = async () => {
    try {
      const response = await axios.get(`/api/materials/${id}/`);
      const material = response.data;
      setFormData({
        name: material.name || '',
        description: material.description || '',
        category: material.category || '',
        quantity: material.quantity || '',
        unit: material.unit || 'piece',
        price_per_unit: material.price_per_unit || '',
        status: material.status || 'available',
        location: material.location || '',
        supplier: material.supplier || '',
        delivery_date: material.delivery_date || '',
      });
    } catch (error) {
      console.error('Failed to fetch material:', error);
      setError('Материалды жүктеу кезінде қате орын алды');
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
        category: formData.category || null,
        quantity: parseFloat(formData.quantity),
        price_per_unit: formData.price_per_unit ? parseFloat(formData.price_per_unit) : null,
        delivery_date: formData.delivery_date || null,
      };

      if (id) {
        await axios.put(`/api/materials/${id}/`, data);
      } else {
        await axios.post('/api/materials/', data);
      }

      navigate('/materials');
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
      <h1 className="page-title">{id ? 'Материалды өңдеу' : 'Жаңа материал қосу'}</h1>
      {error && <div className="error">{error}</div>}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Атауы *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Сипаттама</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Санаты</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="">Санат таңдау</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label>Саны *</label>
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
              <label>Өлшем бірлігі *</label>
              <select name="unit" value={formData.unit} onChange={handleChange} required>
                <option value="kg">Килограмм</option>
                <option value="ton">Тонна</option>
                <option value="m3">Кубикалық метр</option>
                <option value="m2">Шаршы метр</option>
                <option value="piece">Дана</option>
                <option value="pack">Пакет</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Бірлік бағасы</label>
            <input
              type="number"
              step="0.01"
              name="price_per_unit"
              value={formData.price_per_unit}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Күйі *</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="available">Қолжетімді</option>
              <option value="in_transit">Тасымалдауда</option>
              <option value="delivered">Жеткізілген</option>
              <option value="reserved">Резервтелген</option>
            </select>
          </div>
          <div className="form-group">
            <label>Орналасқан жері</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Жеткізуші</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Жеткізу күні</label>
            <input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
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
              onClick={() => navigate('/materials')}
            >
              Болдырмау
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialForm;


