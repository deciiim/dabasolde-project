import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recharge.css';

// --- DATA: RECHARGE TYPES ---
// Translated to Arabic
const RECHARGE_TYPES = [
    { id: '*1', label: 'تعبئة مكالمات ورسائل', code: '*1', desc: 'اتصل وطنيا بأفضل تعرفة', icon: '📞' },
    { id: '*2', label: 'تعبئة كولشي', code: '*2', desc: 'وطني، دولي، إنترنت، رسائل', icon: '🌐' },
    { id: '*3', label: 'تعبئة إنترنت', code: '*3', desc: 'اتصل بالإنترنت 4G/5G', icon: '📶' },
    { id: '*4', label: 'تعبئة وطنية ودولية', code: '*4', desc: 'اتصل وطنيا ودوليا', icon: '🌍' },
    { id: '*5', label: 'تعبئة تيك توك ويوتيوب', code: '*5', desc: 'استمتع بـ يوتيوب وتيك توك', icon: '📺' },
    { id: '*6', label: 'تعبئة شبكات التواصل', code: '*6', desc: 'واتساب، فيسبوك، انستغرام...', icon: '💬' },
    { id: '*7', label: 'تعبئة رومينج', code: '*7', desc: 'استفد من أفضل عروض التجوال', icon: '✈️' },
    { id: '*8', label: 'مكالمات إنوي لا محدودة', code: '*8', desc: 'اتصل بلا حدود بجميع أرقام إنوي', icon: '♾️' },
    { id: '*9', label: 'شراء عروض إنوي', code: '*9', desc: 'فعل عروضك المفضلة', icon: '🛒' },
    { id: '*33', label: 'إنترنت ومكالمات لا محدودة', code: '*33', desc: 'إنترنت لا محدود ابتداء من 100 درهم', icon: '🔥' },
    { id: '*77', label: 'عروض رومينج خاصة', code: '*77', desc: 'عروض تجوال خاصة ومميزة', icon: '🌟' }
];

// --- DATA: AMOUNTS (Standard List) ---
const AMOUNTS = [5, 10, 20, 25, 30, 50, 100, 200, 300, 500];

export default function Recharge() {
    const navigate = useNavigate();

    // STAGE: 'TYPE_SELECT' | 'AMOUNT_SELECT' | 'PHONE_INPUT'
    const [stage, setStage] = useState<'TYPE_SELECT' | 'AMOUNT_SELECT' | 'PHONE_INPUT'>('TYPE_SELECT');

    const [selectedType, setSelectedType] = useState<typeof RECHARGE_TYPES[0] | null>(null);
    const [selectedAmount, setSelectedAmount] = useState<number>(0);
    const [phone, setPhone] = useState('');

    // 1. Select Type
    const handleTypeSelect = (type: typeof RECHARGE_TYPES[0]) => {
        setSelectedType(type);
        setStage('AMOUNT_SELECT');
    };

    // 2. Select Amount
    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setStage('PHONE_INPUT');
    };

    // 3. Confirm & Go To Checkout
    const handleConfirm = () => {
        if (!phone || phone.length < 10) return;

        // Calculate Final Price (-15% Discount)
        const discount = 0.15;
        const finalPrice = selectedAmount * (1 - discount);

        navigate('/checkout', {
            state: {
                plan: {
                    id: `recharge-${selectedType?.code}-${selectedAmount}`,
                    amount: selectedAmount,
                    finalPrice: parseFloat(finalPrice.toFixed(2)),
                    title: `تعبئة ${selectedType?.code} (${selectedAmount} درهم)`,
                    productType: `تعبئة ${selectedType?.code} (${selectedAmount} درهم)`
                },
                prefilledPhone: phone
            }
        });
    };

    return (
        <div className="container recharge-container">

            {/* HEADER */}
            <div className="recharge-header">
                <h2>تعبئة رصيد Inwi ⚡</h2>
                <p>استفد من تخفيض 15% على جميع التعبئات!</p>
            </div>

            {/* STAGE 1: SELECT TYPE */}
            {stage === 'TYPE_SELECT' && (
                <div className="recharge-grid animate-fade">
                    {RECHARGE_TYPES.map((type) => (
                        <div key={type.id} className="recharge-card" onClick={() => handleTypeSelect(type)}>
                            <div className="recharge-type-header">
                                <span className="recharge-badge">Inwi</span>
                                <span className="star-code">{type.code}</span>
                            </div>

                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{type.icon}</div>

                            <h3 className="recharge-title">{type.label}</h3>
                            <p className="recharge-desc">{type.desc}</p>

                            <button className="btn-choose">اختر</button>
                        </div>
                    ))}
                </div>
            )}

            {/* STAGE 2: SELECT AMOUNT */}
            {stage === 'AMOUNT_SELECT' && selectedType && (
                <div className="amounts-container">
                    <button className="back-btn" onClick={() => setStage('TYPE_SELECT')}>
                        ← الرجوع
                    </button>

                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        اختر مبلغ التعبئة ({selectedType.code})
                    </h3>

                    <div className="amounts-list">
                        {AMOUNTS.map((amt) => {
                            const discounted = amt * 0.85;
                            return (
                                <div key={amt} className="amount-item" onClick={() => handleAmountSelect(amt)}>
                                    <div className="amount-val">{amt} درهم</div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'line-through' }}>{amt} درهم</div>
                                        <div className="amount-price">{discounted.toFixed(2)} درهم</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* STAGE 3: PHONE INPUT */}
            {stage === 'PHONE_INPUT' && selectedType && selectedAmount && (
                <div className="amounts-container phone-input-section">
                    <button className="back-btn" onClick={() => setStage('AMOUNT_SELECT')}>
                        ← الرجوع
                    </button>

                    <h3>أدخل رقم الهاتف للتعبئة</h3>
                    <p style={{ color: '#888', marginBottom: '20px' }}>سيتم شحن الرصيد {selectedType.code} بقيمة {selectedAmount} درهم</p>

                    <div className="final-price-display">
                        <span style={{ display: 'block', color: '#aaa', fontSize: '0.9rem' }}>المبلغ الذي ستدفعه</span>
                        <span className="price-tag">{(selectedAmount * 0.85).toFixed(2)} درهم</span>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <input
                            type="tel"
                            placeholder="06XXXXXXXX"
                            className="custom-input"
                            style={{ borderBottom: '2px solid #90268f', color: 'white', textAlign: 'center' }}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <button
                        className="btn-buy"
                        onClick={handleConfirm}
                        disabled={phone.length < 10}
                        style={{ opacity: phone.length < 10 ? 0.5 : 1 }}
                    >
                        تأكيد والذهاب للدفع 💳
                    </button>
                </div>
            )}

        </div>
    );
}
