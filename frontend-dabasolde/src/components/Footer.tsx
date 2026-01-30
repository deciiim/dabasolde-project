import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section">
                    <h3>DabaSolde</h3>
                    <p>
                        خدمات الدفع والتعبئة السريعة في المغرب.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>روابط سريعة</h4>
                    <ul>
                        <li><Link to="/">الرئيسية</Link></li>
                        <li><Link to="/plans">شراء حساب</Link></li>
                        <li><Link to="/contact">اتصل بنا</Link></li>
                        <li><Link to="/legal">الشروط والأحكام</Link></li>
                    </ul>
                </div>

                <div className="footer-section disclaimer">
                    <h4>إخلاء مسؤولية قانوني</h4>
                    <p>
                        <strong>تنويه هام:</strong> موقع DabaSolde هو موزع مستقل لخدمات الاتصالات.
                        جميع أسماء المنتجات والشعارات والعلامات التجارية (مثل Inwi و Orange) هي ملك لأصحابها المعنيين.
                        استخدام هذه الأسماء لا يعني الانتماء أو التأييد أو الشراكة الرسمية معهم.
                    </p>
                    <p className="en-disclaimer">
                        <strong>Disclaimer:</strong> DabaSolde is an independent reseller. All product names, logos, and brands
                        are property of their respective owners. Use of these names, logos, and brands does not imply endorsement.
                    </p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} DabaSolde. All rights reserved.</p>
            </div>
        </footer>
    );
}
