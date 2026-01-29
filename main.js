/**
 * Grupo Holística - Landing Page JavaScript
 * Premium 10x Version
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Initialize all modules
  initNavigation();
  initScrollAnimations();
  initCounterAnimations();
  initSmoothScroll();
  initTestimonialDots();
  initHorizontalScrollIndicators();
  initHeroSlider();
  initInsights();
  initContactForm();
  initMobileScrollDots();
  initWhatsAppVisibility();
});


/**
 * Navigation functionality
 */
function initNavigation() {
  const nav = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!nav) return;

  // Scroll effect for navigation
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (navToggle && navMenu) {
    const toggleMenu = (forceClose = false) => {
      const isOpen = navMenu.classList.contains('active');
      const shouldClose = forceClose || isOpen;
      
      if (shouldClose) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        navMenu.classList.add('active');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    };

    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    // Close menu when clicking the CTA button
    const navCta = navMenu.querySelector('.nav-cta');
    if (navCta) {
      navCta.addEventListener('click', () => toggleMenu(true));
    }

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu(true);
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
        toggleMenu(true);
      }
    });
  }
}

/**
 * Scroll animations using Intersection Observer
 */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add stagger delay based on element index within its parent
        const parent = entry.target.parentElement;
        const siblings = Array.from(parent.querySelectorAll('.fade-up'));
        const elementIndex = siblings.indexOf(entry.target);
        const delay = elementIndex * 100;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  }, observerOptions);

  // Observe all elements with fade-up class
  document.querySelectorAll('.fade-up').forEach(element => {
    observer.observe(element);
  });
}

/**
 * Counter animations for statistics with exponential easing
 */
function initCounterAnimations() {
  // Support both data-count and data-target attributes
  const counters = document.querySelectorAll('[data-count], [data-target]');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count') || counter.getAttribute('data-target'));
        animateCounter(counter, target);
        counterObserver.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

/**
 * Animate a counter from 0 to target value with exponential easing
 */
function animateCounter(element, target) {
  const duration = 2500; // 2.5 seconds
  const frameDuration = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration / frameDuration);

  let frame = 0;
  const counter = setInterval(() => {
    frame++;

    // Exponential ease-out for more dramatic effect
    const progress = easeOutExpo(frame / totalFrames);
    const currentValue = Math.round(target * progress);

    element.textContent = currentValue;

    if (frame === totalFrames) {
      clearInterval(counter);
      element.textContent = target;
    }
  }, frameDuration);
}

/**
 * Exponential ease-out function
 */
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Testimonial dots navigation with horizontal scroll support
 */
function initTestimonialDots() {
  const dots = document.querySelectorAll('.testimonials__dot');
  const cards = document.querySelectorAll('.testimonial-card');
  const grid = document.querySelector('.testimonials__grid');

  if (!dots.length || !cards.length || !grid) return;

  // Click on dots to scroll to card
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      // Update active dot
      dots.forEach(d => d.classList.remove('testimonials__dot--active'));
      dot.classList.add('testimonials__dot--active');

      // Scroll to the corresponding card
      const card = cards[index];
      if (card && window.innerWidth <= 768) {
        // For horizontal scroll container
        const cardLeft = card.offsetLeft;
        const gridPadding = 20; // padding-left of the grid
        const scrollPosition = cardLeft - gridPadding - (grid.offsetWidth / 2) + (card.offsetWidth / 2);
        
        grid.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Update active dot based on horizontal scroll position
  let scrollTimeout;
  grid.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = grid.scrollLeft;
      const gridWidth = grid.offsetWidth;
      
      cards.forEach((card, index) => {
        const cardLeft = card.offsetLeft - 20; // Account for padding
        const cardWidth = card.offsetWidth;
        const cardCenter = cardLeft + (cardWidth / 2);
        const viewCenter = scrollLeft + (gridWidth / 2);
        
        // Check if card center is near view center
        if (Math.abs(cardCenter - viewCenter) < cardWidth / 2) {
          dots.forEach(d => d.classList.remove('testimonials__dot--active'));
          dots[index]?.classList.add('testimonials__dot--active');
        }
      });
    }, 50);
  }, { passive: true });

  // Also use Intersection Observer as backup
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        const index = Array.from(cards).indexOf(entry.target);
        dots.forEach(d => d.classList.remove('testimonials__dot--active'));
        dots[index]?.classList.add('testimonials__dot--active');
      }
    });
  }, { 
    root: grid,
    threshold: 0.5 
  });

  cards.forEach(card => scrollObserver.observe(card));
}

/**
 * Initialize horizontal scroll indicators for mobile
 */
function initHorizontalScrollIndicators() {
  if (window.innerWidth > 768) return;
  
  const scrollContainers = document.querySelectorAll('.services__grid, .testimonials__grid');
  
  scrollContainers.forEach(container => {
    // Add scroll hint animation on first view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Subtle scroll hint
          setTimeout(() => {
            container.scrollTo({ left: 40, behavior: 'smooth' });
            setTimeout(() => {
              container.scrollTo({ left: 0, behavior: 'smooth' });
            }, 300);
          }, 500);
          observer.unobserve(container);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(container);
  });
}


/**
 * Debounce utility function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Add loading state handling
 */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Trigger initial animations after load
  setTimeout(() => {
    document.querySelectorAll('.hero-content .animate-fade-up, .hero-stats-bar').forEach((el, index) => {
      setTimeout(() => {
        el.style.animationPlayState = 'running';
      }, index * 150);
    });
  }, 100);
});

/**
 * Handle resize events
 */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Reinitialize components that depend on viewport size
    lucide.createIcons();
  }, 250);
});

/**
 * Smooth scroll behavior for reduced motion users
 */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
}


/**
 * Hero Slider functionality
 */
function initHeroSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  const track = slider.querySelector('.hero-slider__track');
  const slides = slider.querySelectorAll('.hero-slide');
  const prevBtn = slider.querySelector('.hero-slider__prev');
  const nextBtn = slider.querySelector('.hero-slider__next');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayInterval = null;
  let isTransitioning = false;
  const autoPlayDelay = 6000; // 6 seconds

  /**
   * Go to a specific slide
   */
  function goToSlide(index) {
    if (isTransitioning || index === currentIndex) return;

    isTransitioning = true;

    // Remove active class from current slide
    slides[currentIndex].classList.remove('hero-slide--active');

    // Update current index
    currentIndex = index;

    // Handle wraparound
    if (currentIndex < 0) {
      currentIndex = slides.length - 1;
    } else if (currentIndex >= slides.length) {
      currentIndex = 0;
    }

    // Move track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Add active class to new slide
    slides[currentIndex].classList.add('hero-slide--active');

    // Reset transition lock after animation
    setTimeout(() => {
      isTransitioning = false;
    }, 600);
  }

  /**
   * Go to next slide
   */
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  /**
   * Go to previous slide
   */
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  /**
   * Start auto-play
   */
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  }

  /**
   * Stop auto-play
   */
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  // Event listeners for controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay(); // Reset auto-play timer
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay(); // Reset auto-play timer
    });
  }

  // Pause auto-play on hover
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 50;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoPlay();
  }, { passive: true });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        prevSlide(); // Swipe right = previous
      } else {
        nextSlide(); // Swipe left = next
      }
    }
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    // Only handle if hero is in viewport
    const heroSection = document.getElementById('inicio');
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    if (isInViewport) {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoPlay();
      }
    }
  });

  // Pause when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  // Start auto-play
  startAutoPlay();
}

/**
 * Insights Section - Tab Filtering
 */
function initInsights() {
  const tabs = document.querySelectorAll('.insights__tab');
  const cards = document.querySelectorAll('.insight-card');
  const grid = document.querySelector('.insights__grid');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('insights__tab--active'));
      tab.classList.add('insights__tab--active');

      // Filter cards
      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const cardType = card.dataset.type;

        if (filter === 'all' || cardType === filter) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';

          // Animate in
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });

      // Reset scroll position on mobile
      if (grid && window.innerWidth <= 768) {
        grid.scrollTo({ left: 0, behavior: 'smooth' });
      }

      // Update scroll dots
      updateInsightsDots();
    });
  });
}

/**
 * Update Insights scroll dots based on visible cards
 */
function updateInsightsDots() {
  const dots = document.querySelectorAll('.insights__scroll-dots .scroll-dots__dot');
  const visibleCards = document.querySelectorAll('.insight-card[style=""], .insight-card:not([style])');

  dots.forEach((dot, index) => {
    if (index < visibleCards.length) {
      dot.style.display = '';
    } else {
      dot.style.display = 'none';
    }
  });

  // Reset active state
  dots.forEach(d => d.classList.remove('scroll-dots__dot--active'));
  if (dots[0]) dots[0].classList.add('scroll-dots__dot--active');
}

/**
 * Contact Form - Validation and Submission
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('contactSuccess');

  if (!form) return;

  // Real-time validation
  const inputs = form.querySelectorAll('input[required], textarea[required]');

  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.parentElement.classList.contains('form-group--error')) {
        validateField(input);
      }
    });
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    // Check privacy checkbox
    const privacyCheckbox = form.querySelector('#contact-privacy');
    if (!privacyCheckbox.checked) {
      isValid = false;
      privacyCheckbox.focus();
    }

    if (!isValid) return;

    // Show loading state
    const submitBtn = form.querySelector('.contact-form__submit');
    submitBtn.classList.add('contact-form__submit--loading');
    submitBtn.disabled = true;

    try {
      // Collect form data
      const formData = new FormData(form);

      // Send to Formspree (or handle locally for demo)
      const action = form.getAttribute('action');

      if (action && !action.includes('YOUR_FORM_ID')) {
        // Real submission
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Form submission failed');
        }
      } else {
        // Demo mode - simulate submission
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Show success message
      form.classList.add('hidden');
      successMessage.classList.add('show');

      // Reinitialize icons in success message
      lucide.createIcons();

    } catch (error) {
      console.error('Form submission error:', error);
      alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
    } finally {
      submitBtn.classList.remove('contact-form__submit--loading');
      submitBtn.disabled = false;
    }
  });
}

/**
 * Validate a single form field
 */
function validateField(input) {
  const formGroup = input.parentElement;
  let isValid = true;

  // Check required
  if (input.hasAttribute('required') && !input.value.trim()) {
    isValid = false;
  }

  // Check email format
  if (input.type === 'email' && input.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      isValid = false;
    }
  }

  // Update UI
  if (isValid) {
    formGroup.classList.remove('form-group--error');
  } else {
    formGroup.classList.add('form-group--error');
  }

  return isValid;
}

/**
 * Mobile Scroll Dots - Services and Insights
 * Creates dots for scroll containers. CSS handles visibility based on viewport.
 */
function initMobileScrollDots() {
  // Services scroll dots
  initScrollDotsForContainer('.services__grid', '.services');

  // Insights scroll dots
  initScrollDotsForContainer('.insights__grid', '.insights__scroll-dots');
}

/**
 * Handle resize events to ensure dots work when switching viewports
 */
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Re-initialize dots if they don't exist yet (e.g., loaded on desktop, resized to mobile)
    const servicesDotsExist = document.querySelector('.services .scroll-dots');
    if (!servicesDotsExist) {
      initScrollDotsForContainer('.services__grid', '.services');
    }
  }, 250);
});

/**
 * Initialize scroll dots for a container
 */
function initScrollDotsForContainer(containerSelector, dotsContainerSelector) {
  const container = document.querySelector(containerSelector);
  const dotsContainer = document.querySelector(dotsContainerSelector);

  if (!container) return;

  // Create dots if they don't exist (for services)
  let dots = dotsContainer?.querySelectorAll('.scroll-dots__dot');

  if (containerSelector === '.services__grid') {
    const cards = container.querySelectorAll('.service-card');
    const existingDots = document.querySelector('.services .scroll-dots');

    if (!existingDots && cards.length > 0) {
      const dotsWrapper = document.createElement('div');
      dotsWrapper.className = 'scroll-dots services__scroll-dots';

      cards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `scroll-dots__dot${index === 0 ? ' scroll-dots__dot--active' : ''}`;
        dot.setAttribute('aria-label', `Servicio ${index + 1}`);
        dotsWrapper.appendChild(dot);
      });

      container.parentElement.appendChild(dotsWrapper);
      dots = dotsWrapper.querySelectorAll('.scroll-dots__dot');
    }
  }

  if (!dots || !dots.length) return;

  const cards = container.children;

  // Click on dots to scroll
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const card = cards[index];
      if (card) {
        const scrollPosition = card.offsetLeft - 20;
        container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }
    });
  });

  // Update dots on scroll
  let scrollTimeout;
  container.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;

      Array.from(cards).forEach((card, index) => {
        const cardLeft = card.offsetLeft - 20;
        const cardWidth = card.offsetWidth;
        const cardCenter = cardLeft + (cardWidth / 2);
        const viewCenter = scrollLeft + (containerWidth / 2);

        if (Math.abs(cardCenter - viewCenter) < cardWidth / 2) {
          dots.forEach(d => d.classList.remove('scroll-dots__dot--active'));
          dots[index]?.classList.add('scroll-dots__dot--active');
        }
      });
    }, 50);
  }, { passive: true });
}

/**
 * Hide hero swipe indicator after first interaction
 */
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('heroSlider');
  const swipeHint = document.querySelector('.hero-slider__swipe-hint');

  if (slider && swipeHint) {
    // Hide after touch or after 8 seconds
    const hideHint = () => {
      swipeHint.style.opacity = '0';
      setTimeout(() => {
        swipeHint.style.display = 'none';
      }, 300);
    };

    slider.addEventListener('touchstart', hideHint, { once: true });
    setTimeout(hideHint, 8000);
  }
});

/**
 * WhatsApp button visibility on mobile
 * Hide in hero, show when scrolling to services section
 */
function initWhatsAppVisibility() {
  const whatsappBtn = document.querySelector('.whatsapp-btn');
  const serviciosSection = document.getElementById('servicios');

  if (!whatsappBtn || !serviciosSection) return;

  // Always visible on desktop
  if (window.innerWidth > 768) {
    whatsappBtn.classList.add('visible');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    // Only apply on mobile
    if (window.innerWidth <= 768) {
      const entry = entries[0];
      // Show button when services section is in view or has been scrolled past
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
        whatsappBtn.classList.add('visible');
      } else {
        whatsappBtn.classList.remove('visible');
      }
    }
  }, { threshold: 0 });

  observer.observe(serviciosSection);

  // Handle resize events
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      whatsappBtn.classList.add('visible');
    } else {
      // Re-check visibility based on scroll position
      const rect = serviciosSection.getBoundingClientRect();
      if (rect.top < window.innerHeight || rect.top < 0) {
        whatsappBtn.classList.add('visible');
      } else {
        whatsappBtn.classList.remove('visible');
      }
    }
  });
}
