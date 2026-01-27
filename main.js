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

  // Premium features
  initParticleSystem();
  initParallaxEffects();
  initNetworkInteractivity();
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
 * Interactive Canvas Particle System
 */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.animationId = null;
    this.isRunning = false;

    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.canvas));
    }
    this.isRunning = true;
  }

  bindEvents() {
    // Mouse move
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Mouse leave
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    // Resize
    window.addEventListener('resize', debounce(() => {
      this.resize();
      this.init();
    }, 250));

    // Visibility change - pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  pause() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  resume() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update(this.mouse);
      this.particles[i].draw(this.ctx);
    }

    // Draw connections
    this.drawConnections();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  drawConnections() {
    const maxDistance = 120;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(46, 163, 242, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}

/**
 * Individual Particle
 */
class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.density = Math.random() * 30 + 1;

    // Color variation - brighter for dark background
    const colors = [
      { r: 46, g: 163, b: 242 },  // Accent blue
      { r: 41, g: 196, b: 169 },  // Secondary teal
      { r: 255, g: 255, b: 255 } // White
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.3;
  }

  update(mouse) {
    // Floating movement
    this.x += this.speedX;
    this.y += this.speedY;

    // Bounce off edges
    if (this.x < 0 || this.x > this.canvas.width) {
      this.speedX = -this.speedX;
    }
    if (this.y < 0 || this.y > this.canvas.height) {
      this.speedY = -this.speedY;
    }

    // Mouse interaction - repulsion effect
    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const directionX = dx / distance;
        const directionY = dy / distance;

        this.x -= directionX * force * this.density * 0.1;
        this.y -= directionY * force * this.density * 0.1;
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
    ctx.fill();
  }
}

/**
 * Initialize Particle System
 */
function initParticleSystem() {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  // Create particle system instance
  new ParticleSystem(canvas);

  // Also create fallback CSS particles for older browsers
  initFallbackParticles();
}

/**
 * Fallback CSS Particles
 */
function initFallbackParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = window.innerWidth < 768 ? 10 : 20;
  const particleTypes = ['circle', 'hexagon', 'diamond', 'plus'];

  for (let i = 0; i < particleCount; i++) {
    createFallbackParticle(container, particleTypes);
  }
}

/**
 * Create a single fallback particle element
 */
function createFallbackParticle(container, types) {
  const particle = document.createElement('div');
  const type = types[Math.floor(Math.random() * types.length)];

  particle.className = `hero__particle hero__particle--${type}`;

  // Random position
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${Math.random() * 100}%`;

  // Random animation
  const duration = 15 + Math.random() * 20;
  const delay = Math.random() * 10;

  particle.style.animation = `particle-float-${Math.ceil(Math.random() * 3)} ${duration}s ease-in-out ${delay}s infinite`;

  // Random size variation
  const scale = 0.5 + Math.random() * 1;
  particle.style.transform = `scale(${scale})`;

  container.appendChild(particle);

  // Add animated class after a delay for fade-in effect
  setTimeout(() => {
    particle.classList.add('animated');
  }, delay * 100);
}

/**
 * Parallax Effects for Floating Elements
 */
function initParallaxEffects() {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const floatingCards = document.querySelectorAll('.hero__floating-card');
  const gradientOrbs = document.querySelectorAll('.hero__gradient-orb');

  let ticking = false;

  function updateParallax() {
    const scrollY = window.pageYOffset;
    const heroHeight = document.querySelector('.hero')?.offsetHeight || 800;

    // Only apply parallax in hero section
    if (scrollY > heroHeight) {
      ticking = false;
      return;
    }

    const scrollProgress = scrollY / heroHeight;

    // Parallax for floating cards
    floatingCards.forEach((card, index) => {
      const speed = (index + 1) * 0.3;
      const yOffset = scrollY * speed;
      card.style.transform = `translateY(${yOffset}px)`;
    });

    // Parallax for gradient orbs
    gradientOrbs.forEach((orb, index) => {
      const speed = (index + 1) * 0.15;
      const yOffset = scrollY * speed;
      orb.style.transform = `translateY(${yOffset}px)`;
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
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
 * Network SVG Interactivity
 */
function initNetworkInteractivity() {
  const network = document.querySelector('.hero__network');
  if (!network) return;

  const nodes = network.querySelectorAll('.hero__network-nodes circle');
  const lines = network.querySelectorAll('.hero__network-lines path');

  // Add hover effect to nodes
  nodes.forEach((node, index) => {
    node.style.cursor = 'pointer';
    node.style.transition = 'transform 0.3s ease, filter 0.3s ease';

    node.addEventListener('mouseenter', () => {
      // Scale up the node
      node.style.transform = 'scale(1.5)';
      node.style.filter = 'drop-shadow(0 0 15px rgba(46, 163, 242, 1))';

      // Highlight connected lines
      highlightConnections(node, lines, true);
    });

    node.addEventListener('mouseleave', () => {
      node.style.transform = 'scale(1)';
      node.style.filter = '';

      // Reset line highlights
      highlightConnections(node, lines, false);
    });
  });

  // Mouse parallax effect on the network
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Subtle parallax movement
      const moveX = x * 20;
      const moveY = y * 20;

      network.style.transform = `translateY(-50%) translate(${moveX}px, ${moveY}px)`;
    });

    hero.addEventListener('mouseleave', () => {
      network.style.transform = 'translateY(-50%)';
    });
  }
}

/**
 * Highlight network connections
 */
function highlightConnections(node, lines, highlight) {
  const nodeX = parseFloat(node.getAttribute('cx'));
  const nodeY = parseFloat(node.getAttribute('cy'));

  lines.forEach(line => {
    const d = line.getAttribute('d');
    if (!d) return;

    // Check if line connects to this node (simple check)
    const pathMatch = d.match(/[ML]\s*(\d+\.?\d*)\s+(\d+\.?\d*)/g);
    if (!pathMatch) return;

    const coords = pathMatch.map(m => {
      const nums = m.match(/(\d+\.?\d*)/g);
      return { x: parseFloat(nums[0]), y: parseFloat(nums[1]) };
    });

    // Check if node is at start or end of path
    const isConnected = coords.some(coord =>
      Math.abs(coord.x - nodeX) < 5 && Math.abs(coord.y - nodeY) < 5
    );

    if (isConnected) {
      if (highlight) {
        line.style.opacity = '0.8';
        line.style.stroke = 'url(#flowGradient)';
        line.style.strokeWidth = '2';
      } else {
        line.style.opacity = '';
        line.style.stroke = '';
        line.style.strokeWidth = '';
      }
    }
  });
}
