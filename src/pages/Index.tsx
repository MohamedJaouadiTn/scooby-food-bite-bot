
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Index = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  useEffect(() => {
    // Testimonial slider effect
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
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
  
  return (
    <div className="home-page">
      <header className="header">
        <div className="logo">
          <h1>Scooby<span>Food</span></h1>
        </div>
        <nav className="nav">
          <ul>
            <li><Link to="/" className="active">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="mobile-menu-btn">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>
      
      <section className="hero">
        <div className="hero-content">
          <h2>Delicious Food for Every Mood</h2>
          <p>Experience the taste that makes you come back for more</p>
          <Link to="/menu" className="btn-primary">Explore Menu</Link>
        </div>
      </section>
      
      <section className="featured">
        <div className="section-title">
          <h2>Featured Items</h2>
          <p>Our most popular and delicious offerings</p>
        </div>
        
        <div className="featured-items">
          <div className="featured-item">
            <div className="featured-img">
              <img src="/lovable-uploads/a0b46da6-d8b9-474a-9eb4-4721b602592e.png" alt="Chapaty" />
            </div>
            <h3>Chapaty</h3>
            <p>Soft, fluffy chapati bread perfect for any meal</p>
            <div className="featured-price">$5.99</div>
            <Link to="/menu" className="btn-secondary">Order Now</Link>
          </div>
          
          <div className="featured-item">
            <div className="featured-img">
              <img src="/lovable-uploads/0f6b3ba4-8c6f-47d4-a4eb-9d1fd36d62d4.png" alt="Malawi" />
            </div>
            <h3>Malawi</h3>
            <p>Traditional Malawi with authentic flavors</p>
            <div className="featured-price">$7.99</div>
            <Link to="/menu" className="btn-secondary">Order Now</Link>
          </div>
          
          <div className="featured-item">
            <div className="featured-img">
              <img src="/lovable-uploads/2886d120-1731-41be-ab2f-00af287ea3e6.png" alt="Sodas" />
            </div>
            <h3>Refreshing Sodas</h3>
            <p>Ice-cold sodas to complement your meal</p>
            <div className="featured-price">$2.50</div>
            <Link to="/menu" className="btn-secondary">Order Now</Link>
          </div>
        </div>
      </section>
      
      <section className="testimonials" id="testimonials">
        <div className="section-title">
          <h2>What Our Customers Say</h2>
          <p>Hear from people who love our food</p>
        </div>
        
        <div className="testimonial-slider">
          <div className={`testimonial-slide ${activeSlide === 0 ? 'active' : ''}`}>
            <div className="testimonial-content">
              <p>"The best chapaty I've ever had! Scooby Food never disappoints with their quality and taste."</p>
              <div className="customer-info">
                <h4>Sarah Johnson</h4>
                <span className="customer-rating">★★★★★</span>
              </div>
            </div>
          </div>
          
          <div className={`testimonial-slide ${activeSlide === 1 ? 'active' : ''}`}>
            <div className="testimonial-content">
              <p>"Quick service, friendly staff and delicious food. What more could you ask for? Highly recommend!"</p>
              <div className="customer-info">
                <h4>Michael Brown</h4>
                <span className="customer-rating">★★★★★</span>
              </div>
            </div>
          </div>
          
          <div className={`testimonial-slide ${activeSlide === 2 ? 'active' : ''}`}>
            <div className="testimonial-content">
              <p>"Their burgers are juicy and flavorful. My go-to place when I'm craving fast food that's actually good."</p>
              <div className="customer-info">
                <h4>Emily Davis</h4>
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
            <h2>About Scooby Food</h2>
            <p>Since 2010, Scooby Food has been serving delicious, high-quality fast food with a twist of homemade goodness. We believe in using fresh ingredients to create meals that not only satisfy hunger but also delight the taste buds.</p>
            <p>Our passionate team works hard to ensure every customer leaves with a smile, making us one of the most beloved food spots in town.</p>
            <Link to="/menu" className="btn-secondary">View Our Menu</Link>
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
            <p><i className="fa fa-map-marker"></i> 123 Food Street, Foodville</p>
            <p><i className="fa fa-phone"></i> +1 (555) 123-4567</p>
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

export default Index;
