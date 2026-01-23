import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import './Checkout.css';

// Define the shape of the Plan object for TypeScript safety
interface Plan {
  id: string;
  amount: number;
  finalPrice: number;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);

  // --- CONFIGURATION FROM ENV ---
  const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '212600000000';
  
  // Bank Details Mapping
  const BANK_ACCOUNTS: Record<string, string> = {
    CIH: import.meta.env.VITE_RIB_CIH || '230 150 123456789012345678',
    Attijari: import.meta.env.VITE_RIB_ATTIJARI || '007 150 XXXXXXXXXXXXXX',
    Barid: import.meta.env.VITE_RIB_BARID || 'Barid Bank RIB Here',
  };

  // Form State
  const [paymentMethod, setPaymentMethod] = useState<'BANK' | 'CASH'>('BANK');
  const [bank, setBank] = useState('CIH');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!location.state || !location.state.plan) {
      navigate('/plans');
    } else {
      setPlan(location.state.plan);
    }
  }, [location, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(''); 
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (paymentMethod === 'BANK') {
      if (!file) {
        setErrorMessage("⚠️ المرجو إرفاق صورة وصل التحويل للمتابعة");
        return;
      }

      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('amount', String(plan?.amount));
      formData.append('price', String(plan?.finalPrice));
      formData.append('paymentMethod', 'BANK');
      formData.append('bank', bank);
      formData.append('fullName', name);
      formData.append('phone', phone);
      formData.append('receipt', file);

      try {
        const res = await api.post('/orders', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data.success) {
          setSuccess(true);
        }
      } catch (error) {
        console.error("Upload Error:", error);
        setErrorMessage("❌ حدث خطأ أثناء الاتصال بالسيرفر. حاول مرة أخرى.");
        setIsSubmitting(false);
      }

    } else {
      // WhatsApp Logic (Using Env Var)
      const msg = `Salam DabaSolde, bghit compte Inwi ${plan?.amount}DH via CashPlus. Nom: ${name}`;
      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.location.href = waLink;
    }
  };

  if (!plan) return null;

  // --- RENDER SUCCESS VIEW ---
  if (success) {
    return (
      <div className="checkout-wrapper">
        <div className="checkout-card" style={{textAlign: 'center', padding: '50px 30px'}}>
          <div style={{fontSize: '5rem', marginBottom: '20px'}}>🎉</div>
          <h2 style={{color: '#22c55e', fontSize: '2.5rem', margin: '0 0 10px 0'}}>تم بنجاح!</h2>
          <p style={{color: '#a1a1aa', fontSize: '1.2rem', margin: '0 0 40px 0'}}>
            شكراً لثقتك بنا. تم استلام طلبك بنجاح وسيتم التواصل معك قريباً.
          </p>
          <button 
            onClick={() => navigate('/plans')} 
            className="btn-submit"
            style={{background: '#22c55e', marginTop: 0}}
          >
            العودة للعروض 🏠
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER CHECKOUT FORM ---
  return (
    <div className="checkout-wrapper">
      <div className="checkout-card">
        
        <div className="checkout-header">
          <h2 style={{textAlign: 'center', margin:0}}>إتمام الطلب 🛒</h2>
        </div>

        {/* ORDER SUMMARY */}
        <div className="order-summary">
          <div style={{marginBottom: '20px'}}>
             <span className="summary-label">أنت تطلب حساب Inwi برصيد:</span>
             <div className="price-row">
                <span className="big-number">{plan.amount}</span>
                <span className="currency-label">DH</span>
             </div>
          </div>
          <div style={{borderTop: '1px solid rgba(255,255,255,0.1)', margin: '15px 0'}}></div>
          <div>
             <span className="summary-label">المبلغ الواجب أداؤه:</span>
             <div className="price-row total-price">
                <span className="big-number">{plan.finalPrice}</span>
                <span className="currency-label">DH</span>
             </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">اختر طريقة الدفع</label>
          <div className="payment-methods">
            <button 
              type="button" 
              className={`method-btn ${paymentMethod === 'CASH' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('CASH')}
            >
              💵 كاش بلس
            </button>
            <button 
              type="button" 
              className={`method-btn ${paymentMethod === 'BANK' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('BANK')}
            >
              🏦 تحويل بنكي
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          
          {paymentMethod === 'BANK' && (
            <div className="animate-fade">
              <div className="form-group">
                <label className="form-label">البنك المستلم</label>
                <select className="checkout-select" value={bank} onChange={(e) => setBank(e.target.value)}>
                  <option value="CIH">CIH Bank</option>
                  <option value="Attijari">Attijariwafa Bank</option>
                  <option value="Barid">Barid Bank</option>
                </select>
              </div>

              {/* DYNAMIC BANK DETAILS CARD */}
              <div style={{background:'#111', padding:'15px', borderRadius:'10px', textAlign:'center', marginBottom:'20px', border:'1px solid #333'}}>
                <span style={{color:'#888', fontSize:'0.9rem'}}>RIB للتحويل ({bank}):</span>
                <span style={{display:'block', color:'#e3005b', fontFamily:'monospace', fontSize:'1.1rem', marginTop:'5px', letterSpacing:'1px', wordBreak: 'break-all'}}>
                  {BANK_ACCOUNTS[bank]}
                </span>
                <div style={{fontSize: '0.8rem', color: '#666', marginTop: '5px'}}>Name: Youssef Abayda</div>
              </div>

              <div className="form-group">
                <label className="form-label">الاسم الكامل</label>
                <input type="text" className="checkout-input" placeholder="مثال: Ahmed Alami" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">رقم الهاتف</label>
                <input type="tel" className="checkout-input" placeholder="06XXXXXXXX" required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">صورة وصل التحويل (Reçu)</label>
                <div style={{position:'relative'}}>
                  <input 
                    type="file" 
                    id="receipt-upload" 
                    style={{display:'none'}} 
                    accept="image/*" 
                    onChange={handleFileChange}
                    required
                  />
                  <label 
                    htmlFor="receipt-upload" 
                    className={`custom-file-label ${file ? 'file-selected' : ''}`}
                    style={errorMessage ? {borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)'} : {}}
                  >
                    <span style={{fontSize:'1.8rem', marginBottom:'10px'}}>{file ? '✅' : '📤'}</span>
                    <span style={{fontWeight:'bold', color: file ? '#fff' : '#aaa'}}>
                      {file ? `تم اختيار: ${file.name}` : 'اضغط لرفع صورة التوصيل'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'CASH' && (
            <div style={{textAlign: 'center', marginBottom: '30px', color: '#ccc', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}>
              <p style={{lineHeight: '1.6', margin:0}}>للدفع عبر وكالات CashPlus أو Wafacash، المرجو الضغط على الزر أسفله للتواصل معنا عبر الواتساب وتأكيد الطلب.</p>
            </div>
          )}

          {errorMessage && (
            <div style={{color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px', textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)'}}>
              {errorMessage}
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={isSubmitting} style={{opacity: isSubmitting ? 0.7 : 1}}>
            {isSubmitting ? 'جاري الإرسال...' : (paymentMethod === 'BANK' ? 'تأكيد وإرسال الطلب ✅' : 'إتمام الطلب عبر الواتساب 💬')}
          </button>
        </form>

        <button onClick={() => navigate('/plans')} style={{background:'none', border:'none', color:'#666', width:'100%', marginTop:'20px', cursor:'pointer', textDecoration:'underline', fontFamily: 'Cairo'}}>
           إلغاء والرجوع
        </button>

      </div>
    </div>
  );
}