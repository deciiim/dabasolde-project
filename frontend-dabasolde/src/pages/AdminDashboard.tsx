import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './AdminDashboard.css';

// --- FIX: Get the API URL Dynamically ---
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Icons
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
);

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (!window.confirm(`Mark as ${newStatus}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/orders/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm("🔴 هل أنت متأكد من حذف هذا الطلب نهائياً؟")) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      alert("Delete failed. Check backend.");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  }

  const getWaLink = (phone: string) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\s/g, '').replace(/^0/, '212');
    return `https://wa.me/${cleanPhone}`;
  }

  const getStatusClass = (status: string) => {
    if (status === 'COMPLETED') return 'status-completed';
    if (status === 'REJECTED') return 'status-rejected';
    return 'status-pending';
  }

  const getStatusText = (status: string) => {
    if (status === 'COMPLETED') return 'مكتمل ✅';
    if (status === 'REJECTED') return 'مرفوض ❌';
    return 'قيد الانتظار ⏳';
  }

  const [activeTab, setActiveTab] = useState<'ALL' | 'PLANS' | 'RECHARGES'>('ALL');

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'ALL') return true;

    // Check if it's a Recharge
    // We assume recharges have a productType starting with 'Recharge' or 'تعبئة'
    const pType = order.productType ? String(order.productType) : '';
    const isRecharge = pType.startsWith('Recharge') || pType.startsWith('تعبئة');

    if (activeTab === 'RECHARGES') return isRecharge;
    if (activeTab === 'PLANS') return !isRecharge; // Plans are anything that looks like a plan (or old orders)

    return true;
  });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h2 className="admin-title">Admin Dashboard ⚡</h2>
          <p className="admin-subtitle">إدارة الطلبات والعمليات</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/admin/recharge-config')}
            className="logout-btn"
            style={{ background: '#d946ef' }}
          >
            🎛️ إدارة التعبئات
          </button>
          <button onClick={logout} className="logout-btn">
            تسجيل الخروج
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="tabs-container" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          الكل ({orders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'PLANS' ? 'active' : ''}`}
          onClick={() => setActiveTab('PLANS')}
        >
          📱 شراء الحسابات ({orders.filter(o => {
            const p = o.productType ? String(o.productType) : '';
            return !(p.startsWith('Recharge') || p.startsWith('تعبئة'));
          }).length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'RECHARGES' ? 'active' : ''}`}
          onClick={() => setActiveTab('RECHARGES')}
        >
          ⚡ التعبئات ({orders.filter(o => {
            const p = o.productType ? String(o.productType) : '';
            return p.startsWith('Recharge') || p.startsWith('تعبئة');
          }).length})
        </button>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الزبون</th>
              <th>رقم الهاتف</th>
              <th>تفاصيل المبلغ</th>
              <th>البنك</th>
              <th>الإثبات (Reçu)</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '30px', color: '#888' }}>لا توجد طلبات في هذه الخانة</td></tr>
            ) : filteredOrders.map(order => (
              <tr key={order.id} className="table-row">

                <td data-label="التاريخ" className="date-cell">
                  {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  <span className="date-time">{new Date(order.createdAt).toLocaleTimeString()}</span>
                </td>

                <td data-label="الزبون" className="client-name">{order.fullName || 'Unknown'}</td>

                <td data-label="رقم الهاتف">
                  {/* Show recipient phone if it exists (for recharges) */}
                  {order.recipientPhone ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <a href={getWaLink(order.recipientPhone)} target="_blank" rel="noreferrer" className="wa-link">
                        <WhatsAppIcon />
                        {order.recipientPhone}
                        <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '5px' }}>(مستلم)</span>
                      </a>
                      <a href={getWaLink(order.phone)} target="_blank" rel="noreferrer" className="wa-link">
                        <WhatsAppIcon />
                        {order.phone}
                        <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '5px' }}>(دافع)</span>
                      </a>
                    </div>
                  ) : (
                    <a href={getWaLink(order.phone)} target="_blank" rel="noreferrer" className="wa-link">
                      <WhatsAppIcon />
                      {order.phone}
                    </a>
                  )}
                </td>

                <td data-label="تفاصيل المبلغ">
                  <div className="amount-box">
                    <div className="amount-row">
                      <span className="txt-label">رصيد:</span>
                      <span className="txt-val">{order.amount} DH</span>
                    </div>
                    <div className="amount-row paid">
                      <span className="txt-label">مدفوع:</span>
                      <span className="txt-green">{order.price} DH</span>
                    </div>
                    {/* Show Product Type if available */}
                    {order.productType && (
                      <div className="amount-row" style={{ marginTop: '5px', borderTop: '1px dashed #333', paddingTop: '5px' }}>
                        <span className="txt-label" style={{ fontSize: '0.75rem' }}>نوع:</span>
                        <span className="txt-val" style={{ fontSize: '0.75rem', color: '#d946ef' }}>{order.productType}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td data-label="البنك" style={{ color: '#ccc' }}>{order.bank}</td>

                <td data-label="الإثبات">
                  {order.receiptImage ? (
                    // --- FIX: Use API_URL here ---
                    <a
                      href={`${API_URL}/uploads/${order.receiptImage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="view-receipt-btn"
                    >
                      📸 معاينة الصورة
                    </a>
                  ) : <span style={{ color: '#444', fontStyle: 'italic', fontSize: '0.85rem' }}>بدون صورة</span>}
                </td>

                <td data-label="الحالة">
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>

                <td data-label="إجراءات">
                  <div className="actions-cell">
                    {order.status === 'PENDING' && (
                      <>
                        <button title="Accept" onClick={() => updateStatus(order.id, 'COMPLETED')} className="action-btn btn-accept">✅</button>
                        <button title="Reject" onClick={() => updateStatus(order.id, 'REJECTED')} className="action-btn btn-reject">⚠️</button>
                      </>
                    )}

                    <button
                      title="Delete Order"
                      onClick={() => deleteOrder(order.id)}
                      className="action-btn btn-delete"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}