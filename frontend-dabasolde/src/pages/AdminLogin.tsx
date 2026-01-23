import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // New Error State
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة ❌');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleLogin} className="login-card">
        
        <div style={{fontSize: '3rem', marginBottom: '10px'}}>🔐</div>
        <h2 className="login-title">Admin Access</h2>
        <p className="login-subtitle">تسجيل الدخول للوحة التحكم</p>
        
        {error && (
          <div className="error-msg">
            {error}
          </div>
        )}

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Username" 
            className="login-input"
            value={username} 
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input 
            type="password" 
            placeholder="Password" 
            className="login-input"
            value={password} 
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="login-btn" disabled={isLoading}>
          {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول 🚀'}
        </button>

      </form>
    </div>
  );
}