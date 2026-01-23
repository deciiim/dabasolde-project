import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="container">
      <section className="hero-section">
        
        {/* Left Side: Text */}
        <div className="hero-text">
          <h1 className="hero-title">
            أسرع طريقة لشراء <br/>
            <span className="highlight">حسابات Inwi</span> في المغرب
          </h1>
          
          <p className="hero-desc">
            مرحباً بك في <strong>DabaSolde</strong>. منصتك الأولى لشراء حسابات مشحونة برصيد إنوي بتخفيضات تصل إلى 12%. 
            <br/>خدمة آمنة، تسليم فوري، ودعم تقني 24/7.
          </p>
          
          <div className="hero-buttons">
            <Link to="/plans" className="btn-primary">
              اكتشف العروض 🚀
            </Link>
            <Link to="/contact" className="btn-outline">
              تواصل معنا 📞
            </Link>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="hero-image-wrapper">
          <img 
            src="https://img.freepik.com/free-vector/digital-wallet-concept-illustration_114360-7561.jpg?w=740&t=st=1705912345~exp=1705912945~hmac=..." 
            alt="DabaSolde Service" 
            className="hero-image" 
          />
        </div>

      </section>
    </div>
  );
}