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
