import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Invoiceold = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    total_records: 0,
    grand_total: 0,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get('http://localhost:9000/totalold');

      // Adjust according to your actual response structure
      if (res.data?.message === 'select success' || res.data?.status) {
        const rawData = res.data.data || [];

        // Parse products string → real array
        const parsedOrders = rawData.map(order => ({
          ...order,
          products: typeof order.products === 'string'
            ? JSON.parse(order.products)
            : (Array.isArray(order.products) ? order.products : []),
          total: Number(order.total || 0),
        }));

        setOrders(parsedOrders);

        // Calculate totals
        const grandTotal = parsedOrders.reduce((sum, o) => sum + o.total, 0);

        setTotals({
          total_records: parsedOrders.length,
          grand_total: Number(grandTotal.toFixed(2)),
        });
      } else {
        setError('API returned unexpected format');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('មិនអាចទាញយកទិន្នន័យបានទេ / Cannot load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', fontSize: '1.3em' }}>កំពុងផ្ទុក... / Loading...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#d32f2f', fontSize: '1.2em' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, "Khmer OS", sans-serif', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Action Buttons */}
      <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button
          onClick={handlePrint}
          style={{
            padding: '12px 28px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          🖨️ បោះពុម្ព / Print
        </button>
      </div>

      {/* Printable Content */}
      <div className="print-area">
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '20px' }}>
          បញ្ជីការលក់ (Sales / Order List)
        </h2>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '30px' }}>
          ចំនួនសរុប / Total Orders: <strong>{totals.total_records}</strong>
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 3px 12px rgba(0,0,0,0.12)' }}>
          <thead>
            <tr style={{ backgroundColor: '#000', color: '#fff' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>ឈ្មោះ / Name</th>
              <th style={{ padding: '12px' }}>ទូរស័ព្ទ / Phone</th>
              <th style={{ padding: '12px' }}>ផលិតផល / Products</th>
              <th style={{ padding: '12px' }}>សរុប / Total</th>
              <th style={{ padding: '12px' }}>កាលបរិច្ឆេទ / Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#777' }}>
                  មិនមានទិន្នន័យ / No orders found
                </td>
              </tr>
            ) : (
              orders.map((order, i) => (
                <tr
                  key={order.id}
                  style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#ffffff' }}
                >
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{order.id}</td>
                  <td style={{ padding: '12px' }}>{order.userName || '-'}</td>
                  <td style={{ padding: '12px' }}>{order.phone || '-'}</td>
                  <td style={{ padding: '12px', fontSize: '0.95em' }}>
                    {order.products.length > 0 ? (
                      order.products.map((p, idx) => (
                        <div key={idx} style={{ margin: '4px 0', borderBottom: '1px dotted #ccc' }}>
                          • {p.title} × {p.quantity} — ${Number(p.price).toFixed(2)}
                        </div>
                      ))
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#b12704' }}>
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', color: '#444' }}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString('km-KH', {
                          timeZone: 'Asia/Phnom_Penh',
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', fontSize: '1.1em' }}>
              <td colSpan={4} style={{ textAlign: 'right', padding: '14px' }}>
                សរុបទាំងអស់ / Grand Total :
              </td>
              <td style={{ padding: '14px', color: '#c62828' }}>
                ${totals.grand_total.toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Print-only CSS */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button, .actions { display: none !important; }
          h2 { margin-top: 0; }
        }
      `}</style>
    </div>
  );
};

export default Invoiceold;