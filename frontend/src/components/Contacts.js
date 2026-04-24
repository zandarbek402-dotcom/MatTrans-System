import React from 'react';

const Contacts = () => {
  return (
    <div className="contacts-mini">
      <div className="contacts-header">
        <span className="contacts-icon">📞</span>
        <span className="contacts-title">Байланыс</span>
      </div>
      <div className="contacts-list">
        <div className="contact-item">
          <span>📍</span>
          <span>Алматы, Назарбаев к-сі 123</span>
        </div>
        <div className="contact-item">
          <span>📞</span>
          <span>+7 (727) 123-45-67</span>
        </div>
        <div className="contact-item">
          <span>📧</span>
          <span>info@conmat-transport.kz</span>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
