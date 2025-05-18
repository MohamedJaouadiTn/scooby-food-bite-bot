
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const IndexPage = () => {
  const [heroMenu, setHeroMenu] = useState([
    {
      id: 1,
      image: "/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png",
      name: "Mlewi",
      price: "Starting at 3.500 TND"
    },
    {
      id: 2,
      image: "/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png",
      name: "Chapati",
      price: "Starting at 6.000 TND"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGFjb3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
      name: "Tacos",
      price: "Starting at 3.500 TND"
    }
  ]);

  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Translations
  const translations = {
    en: {
      home: "Home",
      menu: "Menu",
      about: "About",
      contact: "Contact",
      welcomeTo: "Welcome to",
      scoobyfood: "ScoobyFood",
      tagline: "Delicious food, delivered fast",
      orderNow: "Order Now",
      exploreMenu: "Explore Menu",
      featuredItems: "Featured Items",
      viewAllItems: "View All Items",
      aboutUs: "About Us",
      aboutText: "We are a street food stand specializing in traditional fast food items like Mlawi, Chapati, and Tacos. All our delicious food is available for takeaway only – we prepare everything fresh to order so you can enjoy at home or on the go.",
      ourLocation: "Our Location",
      visitUs: "Visit Us",
      address: "123 Food Street, Tasty Town",
      callUs: "Call Us",
      phone: "(123) 456-7890",
      emailUs: "Email Us",
      email: "info@scoobyfood.com",
      openingHours: "Opening Hours",
      monFri: "Monday - Friday: 10:00 AM - 10:00 PM",
      satSun: "Saturday - Sunday: 11:00 AM - 11:00 PM",
      allRightsReserved: "© 2023 Scooby Food. All rights reserved."
    },
    fr: {
      home: "Accueil",
      menu: "Menu",
      about: "À Propos",
      contact: "Contact",
      welcomeTo: "Bienvenue à",
      scoobyfood: "ScoobyFood",
      tagline: "Délicieuse nourriture, livrée rapidement",
      orderNow: "Commander Maintenant",
      exploreMenu: "Explorer le Menu",
      featuredItems: "Articles en Vedette",
      viewAllItems: "Voir Tous les Articles",
      aboutUs: "À Propos de Nous",
      aboutText: "Nous sommes un stand de street food spécialisé dans les plats traditionnels comme Mlawi, Chapati et Tacos. Toute notre délicieuse nourriture est disponible uniquement à emporter – nous préparons tout frais sur commande pour que vous puissiez en profiter à la maison ou en déplacement.",
      ourLocation: "Notre Emplacement",
      visitUs: "Visitez-nous",
      address: "123 Rue de la Nourriture, Ville Savoureuse",
      callUs: "Appelez-nous",
      phone: "(123) 456-7890",
      emailUs: "Envoyez-nous un email",
      email: "info@scoobyfood.com",
      openingHours: "Heures d'Ouverture",
      monFri: "Lundi - Vendredi: 10:00 - 22:00",
      satSun: "Samedi - Dimanche: 11:00 - 23:00",
      allRightsReserved: "© 2023 Scooby Food. Tous droits réservés."
    }
  };

  // Get translation function
  const t = (key: string) => {
    return translations[currentLanguage as keyof typeof translations][key as keyof typeof translations["en"]] || key;
  };

  return (
    <div className="index-page">
      <header className="header">
        <div className="logo">
          <h1>Scooby<span>Food</span></h1>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/" className="active">{t('home')}</Link></li>
            <li><Link to="/menu">{t('menu')}</Link></li>
            <li><a href="#about">{t('about')}</a></li>
            <li><a href="#contact">{t('contact')}</a></li>
          </ul>
        </nav>
        
        {/* Language Switcher */}
        <div className="language-switcher">
          <select 
            value={currentLanguage} 
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="language-select"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
        
        <div className="mobile-menu-btn" onClick={() => {
          const nav = document.querySelector('.nav') as HTMLElement;
          if (nav) nav.classList.toggle('active');
        }}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>
      
      <section className="hero">
        <div className="hero-content">
          <h2>{t('welcomeTo')} <span>{t('scoobyfood')}</span></h2>
          <p>{t('tagline')}</p>
          <div className="hero-buttons">
            <Link to="/menu" className="btn-primary">{t('orderNow')}</Link>
            <Link to="/menu" className="btn-secondary">{t('exploreMenu')}</Link>
          </div>
        </div>
      </section>
      
      <section className="featured-items">
        <div className="section-title">
          <h2>{t('featuredItems')}</h2>
        </div>
        
        <div className="featured-grid">
          {heroMenu.map((item) => (
            <div key={item.id} className="featured-item">
              <img src={item.image} alt={item.name} className="featured-img" />
              <h3>{item.name}</h3>
              <p>{item.price}</p>
              <Link to="/menu" className="btn-view">{t('viewAllItems')}</Link>
            </div>
          ))}
        </div>
      </section>
      
      <section id="about" className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>{t('aboutUs')}</h2>
            <p>{t('aboutText')}</p>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3" alt="Food Stand" />
          </div>
        </div>
      </section>
      
      <section id="contact" className="contact-section">
        <div className="section-title">
          <h2>{t('contact')}</h2>
        </div>
        
        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">
              <i className="fa fa-map-marker"></i>
            </div>
            <h3>{t('visitUs')}</h3>
            <p>{t('address')}</p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon">
              <i className="fa fa-phone"></i>
            </div>
            <h3>{t('callUs')}</h3>
            <p>{t('phone')}</p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon">
              <i className="fa fa-envelope"></i>
            </div>
            <h3>{t('emailUs')}</h3>
            <p>{t('email')}</p>
          </div>
          
          <div className="contact-card">
            <div className="contact-icon">
              <i className="fa fa-clock-o"></i>
            </div>
            <h3>{t('openingHours')}</h3>
            <p>{t('monFri')}</p>
            <p>{t('satSun')}</p>
          </div>
        </div>
      </section>
      
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Scooby<span>Food</span></h2>
            <p>Delicious food, delivered fast</p>
          </div>
          
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <p><i className="fa fa-map-marker"></i> 123 Food Street, Tasty Town</p>
            <p><i className="fa fa-phone"></i> (123) 456-7890</p>
            <p><i className="fa fa-envelope"></i> info@scoobyfood.com</p>
          </div>
          
          <div className="footer-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="fa fa-facebook"></i></a>
              <a href="#" className="social-icon"><i className="fa fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fa fa-twitter"></i></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2023 Scooby Food. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default IndexPage;
