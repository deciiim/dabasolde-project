import { Link } from 'react-router-dom';
import './Home.css';
// Ensure this path matches exactly where you put the file in Step 1
import heroImg from '../assets/hero-img.jpg'; 

export default function Home() {
  return (
    <div className="container">
      <section className="hero-section">
        
        {/* --- LEFT SIDE (Text + Mobile Image + Buttons) --- */}
        <div className="hero-text">
          <h1 className="hero-title">
            أسرع طريقة لشراء <br/>
            <span className="highlight">حسابات Inwi</span> في المغرب
          </h1>
          
          <p className="hero-desc">
            مرحباً بك في <strong>DabaSolde</strong>. منصتك الأولى لشراء حسابات مشحونة برصيد إنوي بتخفيضات تصل إلى 12%. 
            <br/>خدمة آمنة، تسليم فوري، ودعم تقني 24/7.
          </p>

          {/* !!! CRITICAL CHANGE !!! */}
          {/* This places the image BETWEEN text and buttons on Mobile */}
          <div className="mobile-image-wrapper">
            <img src={heroImg} alt="Mobile Display" className="hero-image-mobile" />
          </div>
          
          <div className="hero-buttons">
            <Link to="/plans" className="btn-primary">
              اكتشف العروض 🚀
            </Link>
            <Link to="/contact" className="btn-outline">
              تواصل معنا 📞
            </Link>
          </div>
        </div>

        {/* --- RIGHT SIDE (Desktop Image Only) --- */}
        <div className="desktop-image-wrapper">
          <img 
            src={heroImg} 
            alt="Desktop Display" 
            className="hero-image-desktop" 
          />
        </div>

      </section>
    </div>
  );
}