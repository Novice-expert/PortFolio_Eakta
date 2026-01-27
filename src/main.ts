import './style.css';

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle') as HTMLButtonElement;
const navMenu = document.querySelector('.nav-menu') as HTMLElement;

menuToggle?.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle?.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.nav-container') && navMenu.classList.contains('active')) {
    menuToggle?.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href')!);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar') as HTMLElement;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  } else {
    navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
  }
});

// Intersection Observer for scroll animations
const observerOptions: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

// Observe cards
document.querySelectorAll('.education-card, .cert-card').forEach(card => {
  observer.observe(card);
});

// Carousel functionality
class Carousel {
  private currentSlide = 0;
  private slides: NodeListOf<Element>;
  private indicators: NodeListOf<Element>;
  private track: HTMLElement;
  private totalSlides: number;
  private touchStartX = 0;
  private touchEndX = 0;

  constructor() {
    this.slides = document.querySelectorAll('.carousel-slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.track = document.querySelector('.carousel-track') as HTMLElement;
    this.totalSlides = this.slides.length;

    this.init();
  }

  private init() {
    // Next button
    document.querySelector('.carousel-btn-next')?.addEventListener('click', () => {
      this.nextSlide();
    });

    // Previous button
    document.querySelector('.carousel-btn-prev')?.addEventListener('click', () => {
      this.prevSlide();
    });

    // Indicator clicks
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });

    // Touch support for mobile
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      carousel.addEventListener('touchstart', (e: Event) => {
        this.touchStartX = (e as TouchEvent).changedTouches[0].screenX;
      });

      carousel.addEventListener('touchend', (e: Event) => {
        this.touchEndX = (e as TouchEvent).changedTouches[0].screenX;
        this.handleSwipe();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  private updateSlide() {
    // Update slides
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });

    // Move track
    this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
  }

  private nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlide();
  }

  private prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlide();
  }

  private goToSlide(index: number) {
    this.currentSlide = index;
    this.updateSlide();
  }
}

// Initialize carousel if it exists
if (document.querySelector('.carousel')) {
  new Carousel();
}

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = (section as HTMLElement).offsetTop;

    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id') || '';
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

console.log('Portfolio loaded successfully!');
