// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      nav.classList.toggle('active');
    });
  }
  
  // Testimonial slider
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.dot');
  
  if (testimonialSlides.length > 0) {
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds per slide
    
    // Function to switch slides
    const showSlide = (index) => {
      testimonialSlides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      testimonialSlides[index].classList.add('active');
      dots[index].classList.add('active');
      
      currentSlide = index;
    };
    
    // Auto slide testimonials
    const autoSlide = setInterval(() => {
      currentSlide = (currentSlide + 1) % testimonialSlides.length;
      showSlide(currentSlide);
    }, slideInterval);
    
    // Click on dots to change slide
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(autoSlide);
        showSlide(index);
      });
    });
  }
  
  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#') {
        e.preventDefault();
        const targetId = href;
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (nav && nav.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
          }
        }
      }
    });
  });
  
  // Fixed animation on scroll function
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.featured-item, .about-content, .footer-content');
    const windowHeight = window.innerHeight;
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const elementVisible = 150; // Adjust this value as needed
      
      if (elementPosition < windowHeight - elementVisible) {
        element.classList.add('animate-active');
      }
    });
  };
  
  // Set initial opacity and transform for animation elements with CSS classes
  const elementsToAnimate = document.querySelectorAll('.featured-item, .about-content, .footer-content');
  elementsToAnimate.forEach(element => {
    element.classList.add('animate-on-scroll');
  });
  
  // Run animation on scroll
  window.addEventListener('scroll', animateOnScroll);
  
  // Run once on page load
  animateOnScroll();
  
  // Remove outline on click (focus) for better visual design
  document.querySelectorAll('button, a').forEach(element => {
    element.addEventListener('mousedown', function() {
      this.style.outline = 'none';
    });
    
    // But still keep outline for keyboard navigation (accessibility)
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        this.style.outline = '';
      }
    });
  });
});
