import React, { useState } from 'react';

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const contacts = [
    {
      icon: '📍',
      title: 'Мекен-жай',
      info: 'Қазақстан, Алматы қаласы, Назарбаев көшесі, 123'
    },
    {
      icon: '📞',
      title: 'Телефон',
      info: '+7 (727) 123-45-67'
    },
    {
      icon: '📧',
      title: 'Email',
      info: 'info@conmat-transport.kz'
    },
    {
      icon: '🕐',
      title: 'Жұмыс уақыты',
      info: 'Дүйсенбі - Жұма: 9:00 - 18:00'
    }
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">📞 Байланыс</h1>
      </div>

      <div className="contacts-grid">
        {contacts.map((contact, index) => (
          <div key={index} className="contact-card" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="contact-icon">{contact.icon}</div>
            <h3>{contact.title}</h3>
            <p>{contact.info}</p>
          </div>
        ))}
      </div>

      <div className="card contact-form-card">
        <h2>📨 Бізге хабарлама жіберіңіз</h2>
        
        {submitted && (
          <div className="success-message">
            ✅ Хабарламаңыз сәтті жіберілді! Біз жақын арада сізге хабарласамыз.
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label>Атыңыз *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Атыңызды енгізіңіз"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="email@example.com"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (___) ___-__-__"
            />
          </div>
          
          <div className="form-group">
            <label>Хабарлама *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Хабарламаңызды жазыңыз..."
            />
          </div>
          
          <button type="submit" className="btn btn-primary btn-large">
            📤 Жіберу
          </button>
        </form>
      </div>

      <div className="card map-card">
        <h2>🗺️ Біздің мекен-жай</h2>
        <div className="map-placeholder">
          <div className="map-icon">🗺️</div>
          <p>Карта осында көрсетіледі</p>
          <p className="map-address">Алматы қаласы, Назарбаев көшесі, 123</p>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
