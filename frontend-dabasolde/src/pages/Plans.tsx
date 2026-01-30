import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Plans.css';

interface Plan {
  id: number;
  amount: number;
  discountPercent: number;
  isActive: boolean;
  createdAt: string;
  finalPrice: number;
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState<number | ''>('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/plans').then(res => { setPlans(res.data); setLoading(false); });
  }, []);

  const goToCheckout = (plan: Plan) => {
    navigate('/checkout', { state: { plan } });
  };

  const handleCustomBuy = () => {
    if (!customAmount || customAmount < 100) return;
    const finalPrice = Math.round(customAmount - (customAmount * 0.12));
    const customPlan: Plan = {
      id: 0, // Custom plan ID
      amount: customAmount,
      discountPercent: 12,
      isActive: true,
      createdAt: new Date().toISOString(),
      finalPrice: finalPrice,
    };
    navigate('/checkout', { state: { plan: customPlan } });
  };

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <h2 style={{ fontFamily: 'Cairo' }}>جاري تحميل الحسابات...</h2>
    </div>
  );

  return (
    <div className="plans-container container">
      <div className="plans-header">
        <h2>شراء حسابات مميزة 📱</h2>
        <p>اختر الرصيد الذي يناسبك (خدمة مستقلة متوافقة مع شبكة إنوي)</p>
      </div>

      <div className="plans-grid">

        {/* --- CUSTOM CARD (First Item) --- */}
        <div className="plan-card custom-card">
          <div className="discount-badge">الأكثر طلباً ✨</div>

          <div>
            <div className="account-icon">💎</div>
            <h3 className="plan-title" style={{ marginBottom: '20px' }}>حساب رصيد اختياري</h3>

            <div className="input-wrapper">
              <input
                type="number"
                placeholder="100"
                className="custom-input"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
              />
              <div className="input-hint">أدخل المبلغ (Min 100 DH)</div>
            </div>
          </div>

          <div>
            <div className="price-container">
              {customAmount && customAmount >= 100 ? (
                <>
                  <span className="old-price">قيمة الرصيد: {customAmount} DH</span>
                  <span className="final-price">{Math.round(customAmount - (customAmount * 0.12))} DH</span>
                </>
              ) : (
                <span style={{ color: '#666', fontSize: '0.9rem' }}>أدخل المبلغ لرؤية الثمن</span>
              )}
            </div>

            <button
              className="btn-buy"
              onClick={handleCustomBuy}
              disabled={!customAmount || customAmount < 100}
            >
              شراء هذا الحساب 🚀
            </button>
          </div>
        </div>

        {/* --- STANDARD CARDS --- */}
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <div className="discount-badge">-{plan.discountPercent}%</div>

            <div style={{ width: '100%' }}>
              <div className="account-icon" style={{ marginBottom: '5px' }}>📱</div>
              <h3 className="plan-title" style={{ marginBottom: '10px' }}>حساب جاهز</h3>

              {/* --- FIXED SECTION: AMOUNT + DH --- */}
              <div className="plan-amount-box" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                direction: 'ltr' /* Force Left-to-Right so number is left of DH */
              }}>
                {/* The Number (e.g. 500) */}
                <span style={{
                  fontSize: '3rem',
                  fontWeight: '900',
                  color: 'white',
                  lineHeight: '1',
                  textShadow: '0 0 20px rgba(255,255,255,0.1)'
                }}>
                  {plan.amount}
                </span>

                {/* The DH label */}
                <span style={{
                  fontSize: '2rem',
                  color: '#d946ef',
                  fontWeight: '900'
                }}>
                  DH
                </span>
              </div>

              <div style={{ color: '#a1a1aa', fontSize: '0.9rem', marginTop: '5px' }}>رصيد (*6) متوافق مع إنوي</div>
            </div>

            <div style={{ width: '100%', marginTop: '20px' }}>
              <div className="price-container">
                <span className="old-price">القيمة الحقيقية: {plan.amount} DH</span>
                <span className="final-price">تدفع فقط: {plan.finalPrice} DH</span>
              </div>

              <button className="btn-buy" onClick={() => goToCheckout(plan)}>
                شراء الآن
              </button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}