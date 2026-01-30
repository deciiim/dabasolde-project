import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Recharge.css';

import OperatorIcon from '../components/OperatorIcon';

// --- DATA: OPERATORS ---
const OPERATORS: { id: 'inwi' | 'orange', name: string, nameEn: string, color: string }[] = [
    { id: 'inwi', name: 'خدمة تعبئة (Inwi)', nameEn: 'Inwi Service', color: '#e3005b' },
    { id: 'orange', name: 'خدمة تعبئة (Orange)', nameEn: 'Orange Service', color: '#ff6600' }
];

// --- DATA: INWI RECHARGE TYPES ---
const INWI_RECHARGE_TYPES = [
    { id: '*1', label: 'مكالمات ورسائل', code: '*1', desc: 'اتصل وطنيا بأفضل تعرفة', icon: '☎️' },
    { id: '*2', label: 'كولشي', code: '*2', desc: 'وطني، دولي، إنترنت، رسائل', icon: '🌟' },
    { id: '*3', label: 'إنترنت', code: '*3', desc: 'اتصل بالإنترنت 4G/5G', icon: '🌐' },
    { id: '*4', label: 'مكالمات وطنية ودولية', code: '*4', desc: 'اتصل وطنيا ودوليا', icon: '🌍' },
    { id: '*5', label: 'تيك توك', code: '*5', desc: 'استمتع بـ يوتيوب وتيك توك', icon: '🎬' },
    { id: '*6', label: 'شبكات التواصل', code: '*6', desc: 'واتساب، فيسبوك، انستغرام...', icon: '💬' },
    { id: '*7', label: 'رومينج', code: '*7', desc: 'استفد من أفضل عروض التجوال', icon: '✈️' },
    { id: '*8', label: 'مكالمات لا محدودة', code: '*8', desc: 'اتصل بلا حدود بجميع أرقام إنوي', icon: '♾️' },
    { id: '*9', label: 'شراء عروض إنوي', code: '*9', desc: 'اشتر عروضك المفضلة من إنوي', icon: '🎁' },
    { id: '*33', label: 'إنترنت لا محدود', code: '*33', desc: 'إنترنت لا محدود ابتداء من 100 درهم', icon: '🚀' },
    { id: '*77', label: 'رومينج خاص', code: '*77', desc: 'عروض تجوال خاصة ومميزة', icon: '🌟' }
];

// --- DATA: ORANGE RECHARGE TYPES ---
const ORANGE_RECHARGE_TYPES = [
    { id: '*1', label: 'مكالمات وطنية', code: '*1', desc: 'اتصل وطنيا بأفضل تعرفة', icon: '☎️' },
    { id: '*2', label: 'مكالمات وإنترنت', code: '*2', desc: 'مكالمات وإنترنت معا', icon: '📱' },
    { id: '*3', label: 'إنترنت', code: '*3', desc: 'تصفح الإنترنت بسرعة عالية', icon: '🌐' },
    { id: '*4', label: 'مكالمات دولية', code: '*4', desc: 'اتصل بالعالم بأسعار مميزة', icon: '🌍' },
    { id: '*5', label: 'تيك توك', code: '*5', desc: 'استمتع بتيك توك ويوتيوب', icon: '🎬' },
    { id: '*6', label: 'شبكات التواصل', code: '*6', desc: 'واتساب، فيسبوك، انستغرام', icon: '💬' },
    { id: '*7', label: 'رومينج', code: '*7', desc: 'استفد من عروض التجوال', icon: '✈️' },
    { id: '*8', label: 'مكالمات لا محدودة', code: '*8', desc: 'اتصل بلا حدود بجميع أرقام أورانج', icon: '♾️' },
    { id: '*22', label: 'مكالمات وطنية 22', code: '*22', desc: 'عروض مكالمات وطنية خاصة', icon: '📞' },
    { id: '*33', label: 'إنترنت لا محدود', code: '*33', desc: 'إنترنت لا محدود بسرعة عالية', icon: '🚀' },
    { id: '*77', label: 'رومينج خاص', code: '*77', desc: 'عروض تجوال خاصة ومميزة', icon: '⭐' },
    { id: 'x25', label: 'Multiple X25', code: 'Multiple X25', desc: 'مضاعفة رصيدك 25 مرة', icon: '💰' }
];

// --- DATA: AMOUNTS (Standard List) ---
const AMOUNTS = [5, 10, 20, 25, 30, 50, 100, 200, 300, 500];

type Operator = { id: 'inwi' | 'orange', name: string, nameEn: string, color: string };
type RechargeType = typeof INWI_RECHARGE_TYPES[0];

interface RechargeConfig {
    id: number;
    operator: 'inwi' | 'orange';
    rechargeCode: string | null;
    isAvailable: boolean;
}

export default function Recharge() {
    const navigate = useNavigate();

    // STAGE: 'OPERATOR_SELECT' | 'TYPE_SELECT' | 'AMOUNT_SELECT' | 'PHONE_INPUT'
    const [stage, setStage] = useState<'OPERATOR_SELECT' | 'TYPE_SELECT' | 'AMOUNT_SELECT' | 'PHONE_INPUT'>('OPERATOR_SELECT');

    const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
    const [selectedType, setSelectedType] = useState<RechargeType | null>(null);
    const [selectedAmount, setSelectedAmount] = useState<number>(0);
    const [phone, setPhone] = useState('');

    // Availability state
    const [availableConfigs, setAvailableConfigs] = useState<RechargeConfig[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch available configurations on mount
    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await api.get('/recharge-config/available');
                setAvailableConfigs(res.data);
                console.log('Available configs:', res.data); // Debug
            } catch (error) {
                console.error('Error fetching availability:', error);
                setAvailableConfigs([]);
            }
            setLoading(false);
        };
        fetchAvailability();
    }, []);

    // Filter operators based on availability
    const getAvailableOperators = () => {
        // Only show operators that are in the available configs list
        return OPERATORS.filter(op => {
            const operatorConfig = availableConfigs.find(
                c => c.operator === op.id && c.rechargeCode === null
            );
            // Only show if config exists AND is available
            return operatorConfig !== undefined;
        });
    };

    // Get recharge types based on selected operator and availability
    const getRechargeTypes = () => {
        if (!selectedOperator) return [];

        const baseTypes = selectedOperator.id === 'inwi' ? INWI_RECHARGE_TYPES : ORANGE_RECHARGE_TYPES;

        // Only show types that are in the available configs list
        return baseTypes.filter(type => {
            const typeConfig = availableConfigs.find(
                c => c.operator === selectedOperator.id && c.rechargeCode === type.code
            );
            // Only show if config exists (meaning it's available)
            return typeConfig !== undefined;
        });
    };

    // 0. Select Operator
    const handleOperatorSelect = (operator: Operator) => {
        setSelectedOperator(operator);
        setStage('TYPE_SELECT');
    };

    // 1. Select Type
    const handleTypeSelect = (type: RechargeType) => {
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

        // Calculate Final Price (-7.5% Discount)
        const discount = 0.075;
        const finalPrice = selectedAmount * (1 - discount);

        navigate('/checkout', {
            state: {
                plan: {
                    id: 0,
                    amount: selectedAmount,
                    finalPrice: parseFloat(finalPrice.toFixed(2)),
                    discountPercent: 7.5,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    productType: `تعبئة ${selectedOperator?.name} ${selectedType?.code} (${selectedAmount} درهم)`
                },
                prefilledPhone: phone
            }
        });
    };

    return (
        <div className="container recharge-container">

            {/* HEADER */}
            <div className="recharge-header">
                <h2>تعبئة رصيد الهاتف ⚡</h2>
                <p>اختر المشغل واستفد من تخفيض 7.5% على جميع خدمات التعبئة!</p>
            </div>

            {/* STAGE 0: SELECT OPERATOR */}
            {stage === 'OPERATOR_SELECT' && (
                <>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                            <h3>جاري التحميل...</h3>
                        </div>
                    ) : getAvailableOperators().length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <h3 style={{ color: '#ef4444' }}>⚠️ لا توجد خدمات متاحة حالياً</h3>
                            <p style={{ color: '#888' }}>نعتذر، جميع خدمات التعبئة غير متاحة مؤقتاً</p>
                        </div>
                    ) : (
                        <div className="operators-grid animate-fade">
                            {getAvailableOperators().map((operator) => (
                                <div
                                    key={operator.id}
                                    className="operator-card"
                                    onClick={() => handleOperatorSelect(operator)}
                                    style={{ borderColor: operator.color }}
                                >
                                    <div style={{ marginBottom: '15px' }}>
                                        <OperatorIcon operator={operator.id} size="lg" />
                                    </div>
                                    <h3 className="operator-name" style={{ color: operator.color }}>
                                        {operator.name}
                                    </h3>
                                    <p className="operator-name-en">{operator.nameEn}</p>
                                    <button className="btn-choose" style={{ background: operator.color }}>
                                        اختر {operator.name}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* STAGE 1: SELECT TYPE */}
            {stage === 'TYPE_SELECT' && selectedOperator && (
                <div className="recharge-grid animate-fade">
                    <button className="back-btn" onClick={() => setStage('OPERATOR_SELECT')}>
                        ← الرجوع
                    </button>

                    <h3 style={{
                        textAlign: 'center',
                        marginBottom: '30px',
                        gridColumn: '1 / -1',
                        color: selectedOperator.color,
                        fontSize: '1.5rem'
                    }}>
                        اختر نوع التعبئة - {selectedOperator.name}
                    </h3>

                    {getRechargeTypes().map((type) => (
                        <div key={type.id} className="recharge-card" onClick={() => handleTypeSelect(type)}>
                            <div className="recharge-type-header">
                                <span className="recharge-badge" style={{ background: selectedOperator.color }}>
                                    {selectedOperator.nameEn}
                                </span>
                                <span className="star-code">{type.code}</span>
                            </div>

                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{type.icon}</div>

                            <h3 className="recharge-title">{type.label}</h3>
                            <p className="recharge-desc">{type.desc}</p>

                            <button className="btn-choose" style={{ background: selectedOperator.color }}>
                                اختر
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* STAGE 2: SELECT AMOUNT */}
            {stage === 'AMOUNT_SELECT' && selectedType && selectedOperator && (
                <div className="amounts-container">
                    <button className="back-btn" onClick={() => setStage('TYPE_SELECT')}>
                        ← الرجوع
                    </button>

                    <h3 style={{ textAlign: 'center', marginBottom: '20px', color: selectedOperator.color }}>
                        اختر مبلغ التعبئة ({selectedType.code})
                    </h3>

                    <div className="amounts-list">
                        {AMOUNTS.map((amt) => {
                            const discounted = amt * 0.925;
                            return (
                                <div
                                    key={amt}
                                    className="amount-item"
                                    onClick={() => handleAmountSelect(amt)}
                                    style={{ borderColor: selectedOperator.color }}
                                >
                                    <div className="amount-val">{amt} درهم</div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'line-through' }}>{amt} درهم</div>
                                        <div className="amount-price" style={{ color: selectedOperator.color }}>
                                            {discounted.toFixed(2)} درهم
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* STAGE 3: PHONE INPUT */}
            {stage === 'PHONE_INPUT' && selectedType && selectedAmount && selectedOperator && (
                <div className="amounts-container phone-input-section">
                    <button className="back-btn" onClick={() => setStage('AMOUNT_SELECT')}>
                        ← الرجوع
                    </button>

                    <h3 style={{ color: selectedOperator.color }}>أدخل رقم الهاتف للتعبئة</h3>
                    <p style={{ color: '#888', marginBottom: '20px' }}>
                        سيتم شحن الرصيد {selectedType.code} بقيمة {selectedAmount} درهم على {selectedOperator.name}
                    </p>

                    <div className="final-price-display">
                        <span style={{ display: 'block', color: '#aaa', fontSize: '0.9rem' }}>المبلغ الذي ستدفعه</span>
                        <span className="price-tag" style={{ color: selectedOperator.color }}>
                            {(selectedAmount * 0.925).toFixed(2)} درهم
                        </span>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <input
                            type="tel"
                            placeholder="06XXXXXXXX"
                            className="custom-input"
                            style={{ borderBottom: `2px solid ${selectedOperator.color}`, color: 'white', textAlign: 'center' }}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <button
                        className="btn-buy"
                        onClick={handleConfirm}
                        disabled={phone.length < 10}
                        style={{
                            opacity: phone.length < 10 ? 0.5 : 1,
                            background: selectedOperator.color
                        }}
                    >
                        تأكيد والذهاب للدفع 💳
                    </button>
                </div>
            )}

        </div>
    );
}
