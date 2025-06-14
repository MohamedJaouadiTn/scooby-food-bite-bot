import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Translation data
  const translations = {
    en: {
      home: "Home",
      menu: "Menu",
      about: "About",
      contact: "Contact",
      heroTitle: "Delicious Food for Every Mood",
      heroSubtitle: "Experience the taste that makes you come back for more",
      exploreMenu: "Explore Menu",
      featuredItems: "Featured Items",
      popularItems: "Our most popular and delicious offerings",
      orderNow: "Order Now",
      testimonials: "What Our Customers Say",
      testimonialSubtitle: "Hear from people who love our food",
      aboutTitle: "About Scooby Food",
      aboutText1: "Since 2010, Scooby Food has been serving delicious, high-quality fast food with a twist of homemade goodness. We believe in using fresh ingredients to create meals that not only satisfy hunger but also delight the taste buds.",
      aboutText2: "Our passionate team works hard to ensure every customer leaves with a smile, making us one of the most beloved food spots in town.",
      viewMenu: "View Our Menu",
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      copyright: "2023 Scooby Food. All rights reserved.",
      // Featured items descriptions
      chapatyDesc: "Soft, fluffy chapati bread perfect for any meal",
      malawiDesc: "Traditional Malawi with authentic flavors",
      sodaDesc: "Ice-cold sodas to complement your meal",
      tacosDesc: "Delicious tacos with fresh ingredients and bold flavors",
      // Testimonials
      testimonial1: "The best chapaty I've ever had! Scooby Food never disappoints with their quality and taste.",
      testimonial2: "Quick service, friendly staff and delicious food. What more could you ask for? Highly recommend!",
      testimonial3: "Their burgers are juicy and flavorful. My go-to place when I'm craving fast food that's actually good.",
      // Ingredients
      chapatyIngredients: "Made with premium flour, water, salt, and a touch of oil",
      malawiIngredients: "Prepared with fine flour, water, salt, oil and traditional spices",
      sodaIngredients: "Various refreshing flavors with natural ingredients",
      tacosIngredients: "Fresh tortillas, seasoned meat, lettuce, tomatoes, cheese and sauce"
    },
    fr: {
      home: "Accueil",
      menu: "Menu",
      about: "À Propos",
      contact: "Contact",
      heroTitle: "Des Plats Délicieux pour Chaque Humeur",
      heroSubtitle: "Découvrez le goût qui vous fera revenir pour plus",
      exploreMenu: "Explorer le Menu",
      featuredItems: "Articles Vedettes",
      popularItems: "Nos offres les plus populaires et délicieuses",
      orderNow: "Commander",
      testimonials: "Ce Que Disent Nos Clients",
      testimonialSubtitle: "Écoutez les personnes qui adorent notre nourriture",
      aboutTitle: "À Propos de Scooby Food",
      aboutText1: "Depuis 2010, Scooby Food sert de la restauration rapide délicieuse et de qualité avec une touche de bonté maison. Nous croyons en l'utilisation d'ingrédients frais pour créer des repas qui non seulement satisfont la faim mais ravissent aussi les papilles.",
      aboutText2: "Notre équipe passionnée travaille dur pour s'assurer que chaque client repart avec le sourire, faisant de nous l'un des endroits les plus aimés en ville.",
      viewMenu: "Voir Notre Menu",
      quickLinks: "Liens Rapides",
      followUs: "Suivez-nous",
      copyright: "2023 Scooby Food. Tous droits réservés.",
      // Featured items descriptions in French
      chapatyDesc: "Pain chapati moelleux et léger, parfait pour tous les repas",
      malawiDesc: "Malawi traditionnel avec des saveurs authentiques",
      sodaDesc: "Sodas glacés pour accompagner votre repas",
      tacosDesc: "Délicieux tacos avec des ingrédients frais et des saveurs audacieuses",
      // Testimonials in French
      testimonial1: "Le meilleur chapati que j'ai jamais mangé ! Scooby Food ne déçoit jamais avec sa qualité et son goût.",
      testimonial2: "Service rapide, personnel sympathique et nourriture délicieuse. Que demander de plus ? Je recommande vivement !",
      testimonial3: "Leurs hamburgers sont juteux et savoureux. Mon endroit préféré quand j'ai envie de fast-food qui est vraiment bon.",
      // Ingredients in French
      chapatyIngredients: "Préparé avec de la farine premium, de l'eau, du sel et un peu d'huile",
      malawiIngredients: "Préparé avec de la farine fine, de l'eau, du sel, de l'huile et des épices traditionnelles",
      sodaIngredients: "Diverses saveurs rafraîchissantes avec des ingrédients naturels",
      tacosIngredients: "Tortillas fraîches, viande assaisonnée, laitue, tomates, fromage et sauce"
    }
  };

  // Get translation function
  const t = (key: string) => {
    return translations[currentLanguage as keyof typeof translations][key as keyof typeof translations["en"]] || key;
  };

  useEffect(() => {
    // Testimonial slider effect
    const slideInterval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % 3);
    }, 5000);

    // Animation on scroll function
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.featured-item, .about-content, .footer-content');
      const windowHeight = window.innerHeight;
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementPosition < windowHeight - elementVisible) {
          element.classList.add('animate-active');
        }
      });
    };

    // Set initial animations
    const elementsToAnimate = document.querySelectorAll('.featured-item, .about-content, .footer-content');
    elementsToAnimate.forEach(element => {
      element.classList.add('animate-on-scroll');
    });

    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Run once on page load
    animateOnScroll();
    return () => {
      clearInterval(slideInterval);
      window.removeEventListener('scroll', animateOnScroll);
    };
  }, []);
  return <div className="home-page">
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
          <select value={currentLanguage} onChange={e => setCurrentLanguage(e.target.value)} className="language-select">
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
        
        <div className="mobile-menu-btn">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>
      
      <section className="hero">
        <div className="hero-content">
          <h2>{t('heroTitle')}</h2>
          <p>{t('heroSubtitle')}</p>
          <Link to="/menu" className="btn-primary">{t('exploreMenu')}</Link>
        </div>
      </section>
      
      <section className="featured">
        <div className="section-title">
          <h2>{t('featuredItems')}</h2>
          <p>{t('popularItems')}</p>
        </div>
        
        <div className="featured-items">
          <div className="featured-item">
            <div className="featured-img">
              <img src="/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" alt="Chapaty" />
            </div>
            <h3>Chapaty</h3>
            <p>{t('chapatyDesc')}</p>
            <p className="ingredients-text"><small>{t('chapatyIngredients')}</small></p>
            <div className="featured-price">Starting From
3.50 TND</div>
            <Link to="/menu" className="btn-secondary">{t('orderNow')}</Link>
          </div>
          
          <div className="featured-item">
            <div className="featured-img">
              <img src="/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" alt="Malawi" />
            </div>
            <h3>Malawi</h3>
            <p>{t('malawiDesc')}</p>
            <p className="ingredients-text"><small>{t('malawiIngredients')}</small></p>
            <div className="featured-price">Starting From
3.50 TND</div>
            <Link to="/menu" className="btn-secondary">{t('orderNow')}</Link>
          </div>
          
          <div className="featured-item">
            <div className="featured-img">
              <img src="/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" alt="Sodas" />
            </div>
            <h3>Refreshing Sodas</h3>
            <p>{t('sodaDesc')}</p>
            <p className="ingredients-text"><small>{t('sodaIngredients')}</small></p>
            <div className="featured-price">Starting From
3.50 TND</div>
            <Link to="/menu" className="btn-secondary">{t('orderNow')}</Link>
          </div>

          <div className="featured-item">
            <div className="featured-img">
              <img src="https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dGFjb3N8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60" alt="Tacos" />
            </div>
            <h3>Tacos</h3>
            <p>{t('tacosDesc')}</p>
            <p className="ingredients-text"><small>{t('tacosIngredients')}</small></p>
            <div className="featured-price">Starting From
3.50 TND</div>
            <Link to="/menu" className="btn-secondary">{t('orderNow')}</Link>
          </div>
        </div>
      </section>
      
      <section className="testimonials" id="testimonials">
        <div className="section-title">
          <h2>{t('testimonials')}</h2>
          <p>{t('testimonialSubtitle')}</p>
        </div>
        
        <div className="testimonial-slider">
          <div className={`testimonial-slide ${activeSlide === 0 ? 'active' : ''}`}>
            <div className="testimonial-content">
              <p>"{t('testimonial1')}"</p>
              <div className="customer-info">
                <h4>Mohamed Jaouadi</h4>
                <span className="customer-rating">★★★★★</span>
              </div>
            </div>
          </div>
          
          <div className={`testimonial-slide ${activeSlide === 1 ? 'active' : ''}`}>
            <div className="testimonial-content">
              <p>"{t('testimonial2')}"</p>
              <div className="customer-info">
                <h4>Abdel Waheb Magdoud</h4>
                <span className="customer-rating">★★★★★</span>
              </div>
            </div>
          </div>
          
          <div className={`testimonial-slide ${activeSlide === 2 ? 'active' : ''}`}>
            <div className="testimonial-content">
              <p className="Very Good Service">"{t('testimonial3')}"</p>
              <div className="customer-info">
                <h4>Adem Marzougui</h4>
                <span className="customer-rating">★★★★☆</span>
              </div>
            </div>
          </div>
          
          <div className="slider-controls">
            <span className={`dot ${activeSlide === 0 ? 'active' : ''}`} onClick={() => setActiveSlide(0)}></span>
            <span className={`dot ${activeSlide === 1 ? 'active' : ''}`} onClick={() => setActiveSlide(1)}></span>
            <span className={`dot ${activeSlide === 2 ? 'active' : ''}`} onClick={() => setActiveSlide(2)}></span>
          </div>
        </div>
      </section>
      
      <section className="about" id="about">
        <div className="about-content">
          <div className="about-text">
            <h2>{t('aboutTitle')}</h2>
            <p>{t('aboutText1')}</p>
            <p>{t('aboutText2')}</p>
            <Link to="/menu" className="btn-secondary">{t('viewMenu')}</Link>
          </div>
          <div className="about-image">
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60" alt="Restaurant Interior" />
          </div>
        </div>
      </section>
      
      <footer className="footer" id="contact">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Scooby<span>Food</span></h2>
            <p>Delicious food for every mood</p>
          </div>
          
          <div className="footer-links">
            <h3>{t('quickLinks')}</h3>
            <ul>
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/menu">{t('menu')}</Link></li>
              <li><a href="#about">{t('about')}</a></li>
              <li><a href="#contact">{t('contact')}</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>{t('contact')}</h3>
            <p><i className="fa fa-map-marker"></i> 123 Food Street, Foodville</p>
            <p><i className="fa fa-phone"></i> +1 (555) 123-4567</p>
            <p><i className="fa fa-envelope"></i> info@scoobyfood.com</p>
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
      </footer>
    </div>;
};

export default Index;
