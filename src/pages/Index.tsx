import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    document.title = "Scooby Food - Home";
  }, []);

  // Translation data
  const translations = {
    en: {
      home: "Home",
      menu: "Menu",
      about: "About",
      contact: "Contact",
      deliciousFood: "Delicious street food for takeaway",
      heroTitle: "Scooby Food",
      heroSubtitle: "The best street food in town",
      orderNow: "Order Now",
      featuredItems: "Featured Items",
      featuredItemsMlawi: "Try our delicious Mlawi",
      featuredItemsChapati: "Taste our fresh Chapati",
      featuredItemsTacos: "Enjoy our tasty Tacos",
      startingFrom: "Starting from",
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      contactUs: "Contact Us",
      copyright: "2025 Scooby Food. All rights reserved.",
      openingHours: "Opening Hours"
    },
    fr: {
      home: "Accueil",
      menu: "Menu",
      about: "À Propos",
      contact: "Contact",
      deliciousFood: "Délicieuse street food à emporter",
      heroTitle: "Scooby Food",
      heroSubtitle: "La meilleure street food en ville",
      orderNow: "Commander",
      featuredItems: "Articles en Vedette",
      featuredItemsMlawi: "Essayez notre délicieux Mlawi",
      featuredItemsChapati: "Goûtez notre Chapati frais",
      featuredItemsTacos: "Savourez nos savoureux Tacos",
      startingFrom: "À partir de",
      quickLinks: "Liens Rapides",
      followUs: "Suivez-nous",
      contactUs: "Contactez-nous",
      copyright: "2025 Scooby Food. Tous droits réservés.",
      openingHours: "Horaires d'Ouverture"
    }
  };

  // Get translation function
  const t = (key: string) => {
    return translations[currentLanguage as keyof typeof translations][key as keyof typeof translations["en"]] || key;
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>Scooby<span>Food</span></h1>
            </div>
            <nav className="nav">
              <ul>
                <li><Link to="/" className="active">{t('home')}</Link></li>
                <li><Link to="/menu">{t('menu')}</Link></li>
                <li><a href="/#about">{t('about')}</a></li>
                <li><a href="/#contact">{t('contact')}</a></li>
              </ul>
            </nav>
            
            <div className="right-header-items">
              {/* Language Switcher moved next to cart icon */}
              <div className="language-switcher">
                <select value={currentLanguage} onChange={e => setCurrentLanguage(e.target.value)} className="language-select">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              
              <div className="cart-icon">
                <ShoppingCart className="w-6 h-6" />
                <span className="cart-count">0</span>
              </div>
            </div>
            
            <div className="mobile-menu-btn" onClick={() => {
            const nav = document.querySelector('.nav') as HTMLElement;
            if (nav) nav.classList.toggle('active');
          }}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>{t('heroTitle')}</h1>
            <p>{t('heroSubtitle')}</p>
            <Link to="/menu" className="btn">{t('orderNow')}</Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="featured-items">
        <div className="container">
          <h2>{t('featuredItems')}</h2>
          <div className="featured-items-grid">
            <div className="featured-item">
              <img src="/lovable-uploads/60a0a66d-96f1-4e6a-8a98-b4eaae85a200.png" alt="Mlawi" />
              <h3>{t('featuredItemsMlawi')}</h3>
              <p>{t('startingFrom')} 3.50 TND</p>
              <Link to="/menu" className="btn">{t('orderNow')}</Link>
            </div>
            <div className="featured-item">
              <img src="/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png" alt="Chapati" />
              <h3>{t('featuredItemsChapati')}</h3>
              <p>{t('startingFrom')} 6.00 TND</p>
              <Link to="/menu" className="btn">{t('orderNow')}</Link>
            </div>
            <div className="featured-item">
              <img src="/lovable-uploads/7f6ef961-d8a3-4cc3-8a10-943b8487da0b.png" alt="Tacos" />
              <h3>{t('featuredItemsTacos')}</h3>
              <p>{t('startingFrom')} 3.50 TND</p>
              <Link to="/menu" className="btn">{t('orderNow')}</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>Scooby<span>Food</span></h2>
              <p>{t('deliciousFood')}</p>
            </div>
            
            <div className="footer-links">
              <h3>{t('quickLinks')}</h3>
              <ul>
                <li><Link to="/">{t('home')}</Link></li>
                <li><Link to="/menu">{t('menu')}</Link></li>
                <li><a href="/#about">{t('about')}</a></li>
                <li><a href="/#contact">{t('contact')}</a></li>
              </ul>
            </div>
            
            <div className="footer-contact">
              <h3>{t('contactUs')}</h3>
              <p><i className="fa fa-map-marker"></i> 123 Food Street, Tasty Town</p>
              <p><i className="fa fa-phone"></i> (123) 456-7890</p>
              <p><i className="fa fa-envelope"></i> info@scoobyfood.com</p>
            </div>
            
            <div className="footer-hours">
              <h3>{t('openingHours')}</h3>
              <p><strong>Monday - Friday:</strong> 10:00 AM - 10:00 PM</p>
              <p><strong>Saturday - Sunday:</strong> 11:00 AM - 11:00 PM</p>
            </div>
            
            <div className="footer-social">
              <h3>{t('followUs')}</h3>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className="fa fa-facebook"></i></a>
                <a href="#" className="social-icon"><i className="fa fa-instagram"></i></a>
                <a href="#" className="social-icon"><i className="fa fa-twitter"></i></a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {t('copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
