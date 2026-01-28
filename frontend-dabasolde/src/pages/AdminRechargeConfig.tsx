import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './AdminRechargeConfig.css';

interface RechargeConfig {
    id: number;
    operator: 'inwi' | 'orange';
    rechargeCode: string | null;
    isAvailable: boolean;
    disabledReason?: string;
    updatedAt: string;
    updatedBy?: string;
}

export default function AdminRechargeConfig() {
    const navigate = useNavigate();
    const [configs, setConfigs] = useState<RechargeConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<number | null>(null);

    const fetchConfigs = async () => {
        try {
            const res = await api.get('/recharge-config');
            setConfigs(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching configs:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfigs();
    }, []);

    const toggleAvailability = async (config: RechargeConfig) => {
        setUpdating(config.id);
        try {
            await api.put('/recharge-config', {
                operator: config.operator,
                rechargeCode: config.rechargeCode,
                isAvailable: !config.isAvailable,
                updatedBy: 'admin',
            });
            await fetchConfigs();
        } catch (error) {
            console.error('Error updating config:', error);
        }
        setUpdating(null);
    };

    const updateReason = async (config: RechargeConfig, reason: string) => {
        setUpdating(config.id);
        try {
            await api.put('/recharge-config', {
                operator: config.operator,
                rechargeCode: config.rechargeCode,
                isAvailable: config.isAvailable,
                disabledReason: reason,
                updatedBy: 'admin',
            });
            await fetchConfigs();
        } catch (error) {
            console.error('Error updating reason:', error);
        }
        setUpdating(null);
    };

    const getOperatorColor = (operator: string) => {
        return operator === 'inwi' ? '#e3005b' : '#ff6600';
    };

    const getRechargeLabel = (code: string | null) => {
        if (!code) return 'المشغل بالكامل';

        const labels: Record<string, string> = {
            '*1': 'مكالمات ورسائل',
            '*2': 'كولشي',
            '*3': 'إنترنت',
            '*4': 'مكالمات دولية',
            '*5': 'تيك توك',
            '*6': 'شبكات التواصل',
            '*7': 'رومينج',
            '*8': 'مكالمات لا محدودة',
            '*9': 'شراء عروض إنوي',
            '*22': 'مكالمات وطنية 22',
            '*33': 'إنترنت لا محدود',
            '*77': 'رومينج خاص',
            'x25': 'Multiple X25',
        };

        return labels[code] || code;
    };

    // Group configs by operator
    const inwiConfigs = configs.filter(c => c.operator === 'inwi');
    const orangeConfigs = configs.filter(c => c.operator === 'orange');

    if (loading) {
        return (
            <div className="admin-recharge-config">
                <h2>جاري التحميل...</h2>
            </div>
        );
    }

    return (
        <div className="admin-recharge-config">
            <div className="config-header">
                <div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            marginBottom: '15px',
                            fontFamily: 'Cairo, sans-serif'
                        }}
                    >
                        ← العودة للوحة التحكم
                    </button>
                    <h2>إدارة التعبئات المتاحة 🎛️</h2>
                    <p>تحكم في توفر المشغلين وأنواع التعبئات</p>
                </div>
            </div>

            {/* INWI SECTION */}
            <div className="operator-section">
                <h3 style={{ color: '#e3005b' }}>
                    📱 إنوي (Inwi)
                </h3>
                <div className="config-grid">
                    {inwiConfigs.map((config) => (
                        <div
                            key={config.id}
                            className={`config-card ${!config.isAvailable ? 'disabled' : ''}`}
                            style={{ borderColor: getOperatorColor(config.operator) }}
                        >
                            <div className="config-card-header">
                                <div>
                                    <h4>{getRechargeLabel(config.rechargeCode)}</h4>
                                    {config.rechargeCode && (
                                        <span className="code-badge">{config.rechargeCode}</span>
                                    )}
                                </div>
                                <button
                                    className={`toggle-btn ${config.isAvailable ? 'active' : 'inactive'}`}
                                    onClick={() => toggleAvailability(config)}
                                    disabled={updating === config.id}
                                    style={{
                                        background: config.isAvailable ? '#22c55e' : '#ef4444'
                                    }}
                                >
                                    {updating === config.id ? '...' : config.isAvailable ? '✓ متاح' : '✗ غير متاح'}
                                </button>
                            </div>

                            {!config.isAvailable && (
                                <div className="reason-section">
                                    <input
                                        type="text"
                                        placeholder="سبب التعطيل (اختياري)"
                                        defaultValue={config.disabledReason || ''}
                                        onBlur={(e) => {
                                            if (e.target.value !== (config.disabledReason || '')) {
                                                updateReason(config, e.target.value);
                                            }
                                        }}
                                        className="reason-input"
                                    />
                                </div>
                            )}

                            {config.disabledReason && !config.isAvailable && (
                                <div className="reason-display">
                                    💬 {config.disabledReason}
                                </div>
                            )}

                            <div className="config-meta">
                                <small>آخر تحديث: {new Date(config.updatedAt).toLocaleString('ar-MA')}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ORANGE SECTION */}
            <div className="operator-section">
                <h3 style={{ color: '#ff6600' }}>
                    🍊 أورانج (Orange)
                </h3>
                <div className="config-grid">
                    {orangeConfigs.map((config) => (
                        <div
                            key={config.id}
                            className={`config-card ${!config.isAvailable ? 'disabled' : ''}`}
                            style={{ borderColor: getOperatorColor(config.operator) }}
                        >
                            <div className="config-card-header">
                                <div>
                                    <h4>{getRechargeLabel(config.rechargeCode)}</h4>
                                    {config.rechargeCode && (
                                        <span className="code-badge">{config.rechargeCode}</span>
                                    )}
                                </div>
                                <button
                                    className={`toggle-btn ${config.isAvailable ? 'active' : 'inactive'}`}
                                    onClick={() => toggleAvailability(config)}
                                    disabled={updating === config.id}
                                    style={{
                                        background: config.isAvailable ? '#22c55e' : '#ef4444'
                                    }}
                                >
                                    {updating === config.id ? '...' : config.isAvailable ? '✓ متاح' : '✗ غير متاح'}
                                </button>
                            </div>

                            {!config.isAvailable && (
                                <div className="reason-section">
                                    <input
                                        type="text"
                                        placeholder="سبب التعطيل (اختياري)"
                                        defaultValue={config.disabledReason || ''}
                                        onBlur={(e) => {
                                            if (e.target.value !== (config.disabledReason || '')) {
                                                updateReason(config, e.target.value);
                                            }
                                        }}
                                        className="reason-input"
                                    />
                                </div>
                            )}

                            {config.disabledReason && !config.isAvailable && (
                                <div className="reason-display">
                                    💬 {config.disabledReason}
                                </div>
                            )}

                            <div className="config-meta">
                                <small>آخر تحديث: {new Date(config.updatedAt).toLocaleString('ar-MA')}</small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="config-info">
                <p>💡 <strong>ملاحظة:</strong> عند تعطيل "المشغل بالكامل"، سيتم إخفاء جميع خيارات التعبئة لهذا المشغل من الموقع.</p>
            </div>
        </div>
    );
}
