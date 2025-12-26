// ============================================
// VELOCITY BLACK - MAIN JAVASCRIPT
// ============================================

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navIcons = document.querySelector('.nav-icons');
  
  // Function to add icons to mobile menu
  function addIconsToMobileMenu() {
    // Remove existing mobile icons container if it exists
    const existingMobileIcons = navMenu.querySelector('.mobile-nav-icons');
    if (existingMobileIcons) {
      existingMobileIcons.remove();
    }
    
    // Clone nav-icons to mobile menu if on mobile/tablet
    if (navIcons && navMenu && window.innerWidth <= 1024) {
      const mobileIconsContainer = document.createElement('div');
      mobileIconsContainer.className = 'mobile-nav-icons';
      mobileIconsContainer.style.cssText = 'display: flex; flex-direction: column; width: 100%; gap: 1rem; padding-top: 1rem; margin-top: 1rem; border-top: 2px solid var(--secondary);';
      
      // Clone all buttons from nav-icons (Dashboard, Login, Register)
      const allButtons = navIcons.querySelectorAll('a.btn, a.btn-secondary');
      
      allButtons.forEach((button, index) => {
        const clonedButton = button.cloneNode(true);
        clonedButton.style.cssText = 'display: block; width: 100%; text-align: center; padding: 1rem; margin: 0;';
        mobileIconsContainer.appendChild(clonedButton);
      });
      
      navMenu.appendChild(mobileIconsContainer);
    }
  }
  
  // Add icons to mobile menu on load
  addIconsToMobileMenu();
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      addIconsToMobileMenu();
    }, 250);
  });
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      this.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
    });
  }

  // Dropdown menu toggle for mobile
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        const dropdown = this.parentElement;
        dropdown.classList.toggle('active');
      }
    });
  });

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-icons a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        // Don't close menu if clicking dropdown toggle
        if (this.classList.contains('dropdown-toggle')) {
          e.preventDefault();
          return; // Don't close menu when toggling dropdown
        }
        
        // Don't close menu if clicking on dropdown menu items (keep menu open for easy access)
        const isDropdownItem = this.closest('.dropdown-menu');
        if (isDropdownItem) {
          // Keep the mobile menu and dropdown open so user can access both home pages
          // Don't prevent default - allow navigation, but keep menu open
          const dropdown = this.closest('.nav-dropdown');
          if (dropdown) {
            dropdown.classList.add('active'); // Ensure dropdown stays open
          }
          // Don't close the mobile menu - let user access both options
          return;
        }
        
        // Close menu for regular nav links (not dropdown items)
        navMenu.classList.remove('active');
        if (mobileMenuToggle) {
          mobileMenuToggle.innerHTML = '☰';
        }
        
        // Also close any open dropdowns
        document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
          dropdown.classList.remove('active');
        });
      }
    });
  });

  // Active Link Highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Remove active class from all dropdown items first
  document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.classList.remove('active');
  });
  
  // Set active class for dropdown items based on current page
  if (currentPage === 'index.html' || currentPage === '' || currentPage === 'index') {
    const homePage1 = document.querySelector('.dropdown-menu a[href="index.html"]');
    if (homePage1) {
      homePage1.classList.add('active');
    }
  } else if (currentPage === 'index2.html' || currentPage === 'index2') {
    const homePage2 = document.querySelector('.dropdown-menu a[href="index2.html"]');
    if (homePage2) {
      homePage2.classList.add('active');
      // Auto-expand dropdown on mobile/tablet when on Home Page 2
      if (window.innerWidth <= 1024) {
        const dropdown = document.querySelector('.nav-dropdown');
        if (dropdown) {
          dropdown.classList.add('active');
        }
      }
    }
  }
  
  // Set active class for regular nav links
  navLinks.forEach(link => {
    // Skip dropdown toggle and dropdown menu items (already handled above)
    if (link.classList.contains('dropdown-toggle') || link.closest('.dropdown-menu')) {
      return;
    }
    
    if (link.getAttribute('href') === currentPage || 
        (currentPage === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Back to Top Button
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Form Validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      
      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#DC143C';
          setTimeout(() => {
            input.style.borderColor = '';
          }, 3000);
        } else {
          input.style.borderColor = '#DC143C';
          setTimeout(() => {
            input.style.borderColor = '';
          }, 1000);
        }
      });

      if (isValid) {
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = `
          position: fixed;
          top: 100px;
          right: 20px;
          background: #DC143C;
          color: white;
          padding: 1rem 2rem;
          border-radius: 5px;
          z-index: 10000;
          animation: slideIn 0.3s ease;
        `;
        successMsg.textContent = 'Form submitted successfully!';
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
          successMsg.remove();
        }, 3000);
        
        form.reset();
      }
    });
  });

  // Animated Counters
  const animateCounter = (element, target, duration = 2000) => {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target + (element.dataset.suffix || '');
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current) + (element.dataset.suffix || '');
      }
    }, 16);
  };

  // Intersection Observer for Animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        
        // Animate counters if present
        const counter = entry.target.querySelector('.counter');
        if (counter && !counter.dataset.animated) {
          counter.dataset.animated = 'true';
          const target = parseInt(counter.dataset.target) || 0;
          animateCounter(counter, target);
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // Image Lazy Loading
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  lazyImages.forEach(img => imageObserver.observe(img));

  // Car Card Hover Effects
  const carCards = document.querySelectorAll('.car-card');
  carCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Date Picker Enhancement (if using HTML5 date input)
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.borderColor = '#DC143C';
      this.style.boxShadow = '0 0 10px rgba(220, 20, 60, 0.3)';
    });
  });

  // Filter Toggle is handled in fleet.html page-specific script
  // Removed to avoid conflicts with fleet.html implementation

  // Price Range Slider
  const priceSlider = document.querySelector('.price-slider');
  if (priceSlider) {
    const priceOutput = document.querySelector('.price-output');
    priceSlider.addEventListener('input', function() {
      if (priceOutput) {
        priceOutput.textContent = '$' + this.value;
      }
    });
  }

  // Tab Functionality
  const tabs = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.dataset.tab;
      
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });

  // Lightbox for Gallery
  const galleryImages = document.querySelectorAll('.gallery-image');
  galleryImages.forEach(img => {
    img.addEventListener('click', function() {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
      `;
      
      const lightboxImg = document.createElement('img');
      lightboxImg.src = this.src;
      lightboxImg.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
      `;
      
      lightbox.appendChild(lightboxImg);
      document.body.appendChild(lightbox);
      
      lightbox.addEventListener('click', function() {
        this.remove();
      });
    });
  });

  // Accordion Functionality
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const accordion = this.parentElement;
      const content = accordion.querySelector('.accordion-content');
      const isActive = accordion.classList.contains('active');
      
      // Close all accordions
      document.querySelectorAll('.accordion').forEach(acc => {
        acc.classList.remove('active');
        acc.querySelector('.accordion-content').style.maxHeight = null;
      });
      
      // Open clicked accordion if it wasn't active
      if (!isActive) {
        accordion.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Sticky Navbar on Scroll
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.style.boxShadow = '0 4px 20px rgba(220, 20, 60, 0.5)';
    } else {
      navbar.style.boxShadow = '0 4px 20px rgba(220, 20, 60, 0.3)';
    }
    
    lastScroll = currentScroll;
  });

  // Parallax Effect for Hero Sections
  const heroSections = document.querySelectorAll('.hero');
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    heroSections.forEach(hero => {
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent && scrolled < hero.offsetHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight);
      }
    });
  });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .tab-content {
    display: none;
  }
  
  .tab-content.active {
    display: block;
    animation: fadeInUp 0.5s ease;
  }
  
  .accordion-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  
  .accordion.active .accordion-content {
    max-height: 1000px;
  }
`;
document.head.appendChild(style);


