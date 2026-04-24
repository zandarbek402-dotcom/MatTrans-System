import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Contacts from '../components/Contacts';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Демо деректер
      setTimeout(() => {
        setOrders([
          { id: 1, order_number: 'ORD-2024-001', customer: 'ТОО "Құрылыс-Плюс"', material: 'Цемент', quantity: '50 тонна', total_cost: 750000, status: 'pending', date: '2024-01-20', delivery_date: '2024-01-25' },
          { id: 2, order_number: 'ORD-2024-002', customer: 'АҚ "Қазақ-Кұрылыс"', material: 'Кірпіш', quantity: '10000 дана', total_cost: 450000, status: 'in_progress', date: '2024-01-18', delivery_date: '2024-01-22' },
          { id: 3, order_number: 'ORD-2024-003', customer: 'ТОО "Алатау Инвест"', material: 'Құм', quantity: '30 тонна', total_cost: 120000, status: 'completed', date: '2024-01-15', delivery_date: '2024-01-18' },
          { id: 4, order_number: 'ORD-2024-004', customer: 'ТОО "Сауда-Орталық"', material: 'Темір', quantity: '5 тонна', total_cost: 500000, status: 'cancelled', date: '2024-01-14', delivery_date: '2024-01-20' },
          { id: 5, order_number: 'ORD-2024-005', customer: 'АҚ "Нұр-Сұртан Бұйымтай"', material: 'Бетон', quantity: '100 м³', total_cost: 2000000, status: 'pending', date: '2024-01-22', delivery_date: '2024-01-28' },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Тапсырыстарды жүктеу қатесі:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': { text: '⏳ Күтілуде', class: 'badge-info' },
      'in_progress': { text: '🚚 Орындалуда', class: 'badge-warning' },
      'completed': { text: '✅ Аяқталды', class: 'badge-success' },
      'cancelled': { text: '❌ Бас тартылды', class: 'badge-danger' },
    };
    return badges[status] || { text: status, class: 'badge-info' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('kk-KZ').format(amount) + ' ₸';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Тапсырыстар жүктелуде...</p>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => 
    (statusFilter === '' || o.status === statusFilter) &&
    (searchTerm === '' || o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">📋 Тапсырыстар</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Link to="/orders/new" className="btn btn-success">
            ➕ Жаңа тапсырыс
          </Link>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card stat-blue">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{orders.filter(o => o.status === 'pending').length}</div>
          <div className="stat-label">Күтілуде</div>
        </div>
        <div className="stat-card stat-yellow">
          <div className="stat-icon">🚚</div>
          <div className="stat-value">{orders.filter(o => o.status === 'in_progress').length}</div>
          <div className="stat-label">Орындалуда</div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{orders.filter(o => o.status === 'completed').length}</div>
          <div className="stat-label">Аяқталды</div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{formatCurrency(orders.reduce((sum, o) => sum + o.total_cost, 0))}</div>
          <div className="stat-label">Жалпы сома</div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="search-filter-bar">
        <input
          type="text"
          placeholder="🔍 Тапсырыс нөмірі немесе тұтынушы бойынша іздеу..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">📊 Барлық күйлер</option>
          <option value="pending">⏳ Күтілуде</option>
          <option value="in_progress">🚚 Орындалуда</option>
          <option value="completed">✅ Аяқталды</option>
          <option value="cancelled">❌ Бас тартылды</option>
        </select>
        <button type="submit" className="btn btn-primary">🔍 Іздеу</button>
      </form>

      <div className="orders-grid">
        {filteredOrders.length === 0 ? (
          <div className="card empty-card">
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>Тапсырыстар табылмады</p>
              <Link to="/orders/new" className="btn btn-success">Тапсырыс жасау</Link>
            </div>
          </div>
        ) : (
          filteredOrders.map((order, index) => {
            const statusBadge = getStatusBadge(order.status);
            return (
              <div key={order.id} className="order-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="order-header">
                  <div className="order-number">{order.order_number}</div>
                  <span className={`badge ${statusBadge.class}`}>{statusBadge.text}</span>
                </div>

                <div className="order-customer">
                  <span className="customer-icon">🏢</span>
                  <span className="customer-name">{order.customer}</span>
                </div>

                <div className="order-material">
                  <div className="material-icon">📦</div>
                  <div className="material-details">
                    <span className="material-name">{order.material}</span>
                    <span className="material-quantity">{order.quantity}</span>
                  </div>
                </div>

                <div className="order-dates">
                  <div className="date-item">
                    <span className="date-label">Тапсырыс күні:</span>
                    <span className="date-value">{order.date}</span>
                  </div>
                  <div className="date-item">
                    <span className="date-label">Жеткізу күні:</span>
                    <span className="date-value">{order.delivery_date}</span>
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-total">{formatCurrency(order.total_cost)}</div>
                  <div className="order-actions">
                    <Link to={`/orders/${order.id}`} className="btn btn-primary btn-sm">
                      👁️ Көру
                    </Link>
                    <button className="btn btn-danger btn-sm">
                      🗑️ Жою
                    </button>
                  </div>
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

export default Orders;
