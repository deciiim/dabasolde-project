import { Link } from 'react-router-dom';
import './Home.css';
// Ensure this path matches exactly where you put the file in Step 1
import heroImg from '../assets/hero-img.jpg';

export default function Home() {
  return (
    <div className="container">
      <section className="hero-section">

        {/* --- Text Content --- */}
        <div className="hero-text">
          <h1 className="hero-title">
            أسرع طريقة لشراء <br />
            <span className="highlight">تعبئة و خدمات Inwi</span> في المغرب *
          </h1>

          <p className="hero-desc">
            مرحباً بك في <strong>DabaSolde</strong>. منصتك الأولى لشراء تعبئات ورصيد (متوافق مع إنوي) بتخفيضات تصل إلى 12%.
            <br />خدمة مستقلة، تسليم فوري، ودعم تقني 24/7.
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

        {/* --- Hero Image --- */}
        <div className="hero-image-wrapper">
          <img
            src={heroImg}
            alt="DabaSolde Services"
            className="hero-image"
          />
        </div>

      </section>
    </div>
  );
}