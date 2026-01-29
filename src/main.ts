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

// 3D Experience Card Stack
class ExperienceCards {
  private currentIndex = 0;
  private cards: NodeListOf<Element>;
  private timelinePoints: NodeListOf<Element>;
  private timelineProgress: HTMLElement | null;
  private counterCurrent: HTMLElement | null;
  private totalCards: number;
  private touchStartX = 0;
  private touchEndX = 0;
  private isAnimating = false;

  constructor() {
    this.cards = document.querySelectorAll('.exp-card');
    this.timelinePoints = document.querySelectorAll('.timeline-point');
    this.timelineProgress = document.querySelector('.timeline-progress');
    this.counterCurrent = document.querySelector('.exp-counter-current');
    this.totalCards = this.cards.length;

    if (this.totalCards > 0) {
      this.init();
    }
  }

  private init() {
    // Navigation buttons
    document.querySelector('.exp-nav-next')?.addEventListener('click', () => {
      this.next();
    });

    document.querySelector('.exp-nav-prev')?.addEventListener('click', () => {
      this.prev();
    });

    // Timeline point clicks
    this.timelinePoints.forEach((point, index) => {
      point.addEventListener('click', () => {
        this.goTo(index);
      });
    });

    // Touch support
    const wrapper = document.querySelector('.exp-cards-wrapper');
    if (wrapper) {
      wrapper.addEventListener('touchstart', (e: Event) => {
        this.touchStartX = (e as TouchEvent).changedTouches[0].screenX;
      });

      wrapper.addEventListener('touchend', (e: Event) => {
        this.touchEndX = (e as TouchEvent).changedTouches[0].screenX;
        this.handleSwipe();
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        this.prev();
      } else if (e.key === 'ArrowRight') {
        this.next();
      }
    });

    // Initial state
    this.updateCards();
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  private updateCards() {
    // Update card positions
    this.cards.forEach((card, index) => {
      card.classList.remove('active', 'prev', 'next');

      if (index === this.currentIndex) {
        card.classList.add('active');
      } else if (index === this.currentIndex - 1 || (this.currentIndex === 0 && index === this.totalCards - 1)) {
        card.classList.add('prev');
      } else if (index === this.currentIndex + 1 || (this.currentIndex === this.totalCards - 1 && index === 0)) {
        card.classList.add('next');
      }
    });

    // Update timeline
    this.timelinePoints.forEach((point, index) => {
      point.classList.toggle('active', index === this.currentIndex);
    });

    // Update timeline progress
    if (this.timelineProgress) {
      const progress = (this.currentIndex / (this.totalCards - 1)) * 100;
      this.timelineProgress.style.width = `${progress}%`;
    }

    // Update counter
    if (this.counterCurrent) {
      this.counterCurrent.textContent = String(this.currentIndex + 1).padStart(2, '0');
    }
  }

  private next() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.currentIndex = (this.currentIndex + 1) % this.totalCards;
    this.updateCards();

    setTimeout(() => {
      this.isAnimating = false;
    }, 700);
  }

  private prev() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
    this.updateCards();

    setTimeout(() => {
      this.isAnimating = false;
    }, 700);
  }

  private goTo(index: number) {
    if (this.isAnimating || index === this.currentIndex) return;
    this.isAnimating = true;

    this.currentIndex = index;
    this.updateCards();

    setTimeout(() => {
      this.isAnimating = false;
    }, 700);
  }
}

// Initialize experience cards
new ExperienceCards();

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

// Draggable Scroll for Skills and Certifications on Mobile
class DraggableScroll {
  private containers: NodeListOf<Element>;
  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;
  private activeEl: HTMLElement | null = null;

  constructor() {
    this.containers = document.querySelectorAll('.skills-grid, .certifications-grid');
    this.init();
  }

  private init() {
    this.containers.forEach(container => {
      const el = container as HTMLElement;

      // Mouse events
      el.addEventListener('mousedown', (e) => this.handleMouseDown(e, el));
      el.addEventListener('mouseleave', () => this.handleMouseLeave());
      el.addEventListener('mouseup', () => this.handleMouseUp());
      el.addEventListener('mousemove', (e) => this.handleMouseMove(e));

      // Touch events for better mobile support
      el.addEventListener('touchstart', (e) => this.handleTouchStart(e, el), { passive: true });
      el.addEventListener('touchend', () => this.handleTouchEnd());
      el.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
    });
  }

  private handleMouseDown(e: MouseEvent, el: HTMLElement) {
    this.isDown = true;
    this.activeEl = el;
    el.classList.add('dragging');
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }

  private handleMouseLeave() {
    if (!this.isDown || !this.activeEl) return;
    this.isDown = false;
    this.activeEl.classList.remove('dragging');
  }

  private handleMouseUp() {
    this.isDown = false;
    if (this.activeEl) {
      this.activeEl.classList.remove('dragging');
    }
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDown || !this.activeEl) return;
    e.preventDefault();
    const x = e.pageX - this.activeEl.offsetLeft;
    const walk = (x - this.startX) * 1.5;
    this.activeEl.scrollLeft = this.scrollLeft - walk;
  }

  private handleTouchStart(e: TouchEvent, el: HTMLElement) {
    this.isDown = true;
    this.activeEl = el;
    this.startX = e.touches[0].pageX - el.offsetLeft;
    this.scrollLeft = el.scrollLeft;
  }

  private handleTouchEnd() {
    this.isDown = false;
    this.activeEl = null;
  }

  private handleTouchMove(e: TouchEvent) {
    if (!this.isDown || !this.activeEl) return;
    const x = e.touches[0].pageX - this.activeEl.offsetLeft;
    const walk = (x - this.startX) * 1.5;
    this.activeEl.scrollLeft = this.scrollLeft - walk;
  }
}

// Initialize draggable scroll
new DraggableScroll();

console.log('Portfolio loaded successfully!');
