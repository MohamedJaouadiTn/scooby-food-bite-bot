
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const translations = {
  en: {
    home: "Home",
    menu: "Menu",
    about: "About",
    contact: "Contact",
    hero: {
      title: "Delicious Street Food",
      subtitle: "Enjoy the best quality food with fast delivery",
      viewMenu: "View Menu",
      orderNow: "Order Now"
    },
    featured: {
      title: "Featured Items",
      subtitle: "Our most popular dishes",
      mlawi: "Mlawi Collection",
      chapati: "Chapati Specialties",
      tacos: "Tasty Tacos",
      sodas: "Refreshing Sodas",
      startingFrom: "Starting from ",
      viewAll: "View All"
    },
    about: {
      title: "About Us",
      desc: "We are a street food stand offering delicious takeaway food. Our passion is to provide high-quality, flavorful dishes that you can enjoy at home or on the go. With fresh ingredients and authentic recipes, we bring the best of street food to your table."
    },
    contact: {
      title: "Contact Us",
      address: "123 Food Street, Tasty Town",
      phone: "(123) 456-7890",
      email: "info@scoobyfood.com",
      hours: "Opening Hours",
      weekdays: "Monday - Friday: 10:00 AM - 10:00 PM",
      weekends: "Saturday - Sunday: 11:00 AM - 11:00 PM"
    },
    footer: {
      quickLinks: "Quick Links",
      followUs: "Follow Us",
      contactUs: "Contact Us",
      copyright: "2024 Scooby Food. All rights reserved."
    }
  },
  fr: {
    home: "Accueil",
    menu: "Menu",
    about: "À Propos",
    contact: "Contact",
    hero: {
      title: "Délicieuse Street Food",
      subtitle: "Profitez de la meilleure qualité de nourriture avec une livraison rapide",
      viewMenu: "Voir le Menu",
      orderNow: "Commander"
    },
    featured: {
      title: "Articles Vedettes",
      subtitle: "Nos plats les plus populaires",
      mlawi: "Collection Mlawi",
      chapati: "Spécialités Chapati",
      tacos: "Délicieux Tacos",
      sodas: "Sodas Rafraîchissants",
      startingFrom: "À partir de ",
      viewAll: "Voir Tout"
    },
    about: {
      title: "À Propos de Nous",
      desc: "Nous sommes un stand de street food proposant de délicieux plats à emporter. Notre passion est de fournir des plats de haute qualité et savoureux que vous pouvez déguster à la maison ou en déplacement. Avec des ingrédients frais et des recettes authentiques, nous apportons le meilleur de la street food à votre table."
    },
    contact: {
      title: "Contactez-Nous",
      address: "123 Rue de la Nourriture, Ville Savoureuse",
      phone: "(123) 456-7890",
      email: "info@scoobyfood.com",
      hours: "Heures d'Ouverture",
      weekdays: "Lundi - Vendredi: 10:00 - 22:00",
      weekends: "Samedi - Dimanche: 11:00 - 23:00"
    },
    footer: {
      quickLinks: "Liens Rapides",
      followUs: "Suivez-Nous",
      contactUs: "Contactez-Nous",
      copyright: "2024 Scooby Food. Tous droits réservés."
    }
  }
};

const Home = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [showExtrasDialog, setShowExtrasDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [extras, setExtras] = useState<string[]>([]);

  // Function to get translated text
  const t = (key: string): string => {
    const keys = key.split(".");
    let translation: any = translations[currentLanguage as keyof typeof translations];
    
    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return translation as string;
  };

  const handleOrderClick = (itemName: string) => {
    setSelectedItem(itemName);
    setExtras([]);
    setShowExtrasDialog(true);
  };

  const handleExtrasConfirm = () => {
    // Here you would typically handle the order with the selected extras
    console.log(`Order confirmed for ${selectedItem} with extras:`, extras);
    setShowExtrasDialog(false);
  };

  const handleExtraToggle = (extra: string) => {
    if (extras.includes(extra)) {
      setExtras(extras.filter(e => e !== extra));
    } else {
      setExtras([...extras, extra]);
    }
  };

  return (
    <div className="homepage">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>Scooby<span>Food</span></h1>
            </div>
            <nav className="nav">
              <ul>
                <li><Link to="/" className="active">{t("home")}</Link></li>
                <li><Link to="/menu">{t("menu")}</Link></li>
                <li><a href="#about">{t("about")}</a></li>
                <li><a href="#contact">{t("contact")}</a></li>
              </ul>
            </nav>
            
            <div className="right-header-items">
              {/* Language Switcher */}
              <div className="language-switcher">
                <select value={currentLanguage} onChange={e => setCurrentLanguage(e.target.value)} className="language-select">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              
              <Link to="/menu" className="cart-icon">
                <ShoppingCart className="w-6 h-6" />
              </Link>
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

      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>{t("hero.title")}</h1>
              <p>{t("hero.subtitle")}</p>
              <div className="hero-buttons">
                <Link to="/menu" className="btn-primary">{t("hero.viewMenu")}</Link>
                <Link to="/menu" className="btn-secondary">{t("hero.orderNow")}</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="featured-section">
          <div className="container">
            <div className="section-title">
              <h2>{t("featured.title")}</h2>
              <p>{t("featured.subtitle")}</p>
            </div>
            
            <div className="featured-grid">
              <div className="featured-card">
                <img src="/lovable-uploads/e036f500-7659-4481-8dbb-7fd189e0342a.png" alt="Mlawi" />
                <div className="featured-info">
                  <h3>{t("featured.mlawi")}</h3>
                  <p>{t("featured.startingFrom")}3.50 TND</p>
                  <button onClick={() => handleOrderClick("Mlawi")} className="featured-btn">{t("featured.viewAll")}</button>
                </div>
              </div>
              
              <div className="featured-card">
                <img src="/lovable-uploads/c92d067b-44d8-4570-bd8e-2bd4927e7fb7.png" alt="Chapati" />
                <div className="featured-info">
                  <h3>{t("featured.chapati")}</h3>
                  <p>{t("featured.startingFrom")}6.00 TND</p>
                  <button onClick={() => handleOrderClick("Chapati")} className="featured-btn">{t("featured.viewAll")}</button>
                </div>
              </div>
              
              <div className="featured-card">
                <img src="/lovable-uploads/7f6ef961-d8a3-4cc3-8a10-943b8487da0b.png" alt="Tacos" />
                <div className="featured-info">
                  <h3>{t("featured.tacos")}</h3>
                  <p>{t("featured.startingFrom")}3.50 TND</p>
                  <button onClick={() => handleOrderClick("Tacos")} className="featured-btn">{t("featured.viewAll")}</button>
                </div>
              </div>
              
              <div className="featured-card">
                <img src="/lovable-uploads/d0cd08a4-4b41-456e-9348-166d9b4e3420.png" alt="Sodas" />
                <div className="featured-info">
                  <h3>{t("featured.sodas")}</h3>
                  <p>{t("featured.startingFrom")}2.00 TND</p>
                  <button onClick={() => handleOrderClick("Sodas")} className="featured-btn">{t("featured.viewAll")}</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="about" className="about-section">
          <div className="container">
            <div className="about-content">
              <div className="about-text">
                <h2>{t("about.title")}</h2>
                <p>{t("about.desc")}</p>
              </div>
              <div className="about-image">
                <img src="/lovable-uploads/a9a310a0-a2f6-4a19-ad28-62cc5f6a0bca.png" alt="About Us" />
              </div>
            </div>
          </div>
        </section>
        
        <section id="contact" className="contact-section">
          <div className="container">
            <div className="section-title">
              <h2>{t("contact.title")}</h2>
            </div>
            
            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>{t("contact.address")}</p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <p>{t("contact.phone")}</p>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <p>{t("contact.email")}</p>
                </div>
              </div>
              
              <div className="opening-hours">
                <h3>{t("contact.hours")}</h3>
                <p>{t("contact.weekdays")}</p>
                <p>{t("contact.weekends")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>Scooby<span>Food</span></h2>
              <p>{t("contact.address")}</p>
            </div>
            
            <div className="footer-links">
              <h3>{t("footer.quickLinks")}</h3>
              <ul>
                <li><Link to="/">{t("home")}</Link></li>
                <li><Link to="/menu">{t("menu")}</Link></li>
                <li><a href="#about">{t("about")}</a></li>
                <li><a href="#contact">{t("contact")}</a></li>
              </ul>
            </div>
            
            <div className="footer-contact text-center">
              <h3>{t("footer.contactUs")}</h3>
              <p><i className="fas fa-map-marker-alt"></i> {t("contact.address")}</p>
              <p><i className="fas fa-phone"></i> {t("contact.phone")}</p>
              <p><i className="fas fa-envelope"></i> {t("contact.email")}</p>
            </div>
            
            <div className="footer-hours">
              <h3>{t("contact.hours")}</h3>
              <p>{t("contact.weekdays")}</p>
              <p>{t("contact.weekends")}</p>
            </div>
            
            <div className="footer-social text-center">
              <h3>{t("footer.followUs")}</h3>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {t("footer.copyright")}</p>
          </div>
        </div>
      </footer>

      {/* Extras Dialog */}
      <Dialog open={showExtrasDialog} onOpenChange={setShowExtrasDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add extras to your order</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h4 className="font-medium mb-3">Select extras for {selectedItem}</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="extra-cheese" 
                  checked={extras.includes('Cheese')}
                  onChange={() => handleExtraToggle('Cheese')}
                  className="mr-2"
                />
                <label htmlFor="extra-cheese">Extra Cheese (+1.00 TND)</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="extra-sauce" 
                  checked={extras.includes('Special Sauce')}
                  onChange={() => handleExtraToggle('Special Sauce')}
                  className="mr-2"
                />
                <label htmlFor="extra-sauce">Special Sauce (+0.50 TND)</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="extra-toppings" 
                  checked={extras.includes('Extra Toppings')}
                  onChange={() => handleExtraToggle('Extra Toppings')}
                  className="mr-2"
                />
                <label htmlFor="extra-toppings">Extra Toppings (+1.50 TND)</label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setShowExtrasDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExtrasConfirm}>
              Add to Cart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;

