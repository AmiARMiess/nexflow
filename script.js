// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const pricingToggle = document.getElementById('pricingToggle');
const testimonialsSlider = document.getElementById('testimonialsSlider');
const testimonialDots = document.querySelectorAll('.dot');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalForm = document.getElementById('modalForm');

// ===== State =====
let isYearly = false;
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

// ===== Navbar Scroll Effect =====
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

// ===== Mobile Menu Toggle =====
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// ===== Smooth Scroll =====
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// ===== Pricing Toggle (FIXED) =====
pricingToggle.addEventListener('click', () => {
    isYearly = !isYearly;
    pricingToggle.classList.toggle('active');
    updatePrices();
});

function updatePrices() {
    const priceAmounts = document.querySelectorAll('.price-amount');
    
    priceAmounts.forEach(amount => {
        const monthly = parseInt(amount.dataset.monthly, 10);
        const yearly = parseInt(amount.dataset.yearly, 10);
        const targetPrice = isYearly ? yearly : monthly;
        
        // Safely get the currently displayed number
        const currentPrice = parseInt(amount.textContent, 10) || 0;
        
        // FIX: Cancel any ongoing animation for this specific element to prevent glitching
        if (amount.animationFrame) {
            cancelAnimationFrame(amount.animationFrame);
        }
        
        // Animate price change
        animateValue(amount, currentPrice, targetPrice, 400);
    });
}

// FIX: Replaced buggy setInterval with smooth requestAnimationFrame
function animateValue(element, start, end, duration) {
    if (start === end) return;

    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function (easeOutQuart) for a premium feel
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (end - start) * easeProgress);
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            element.animationFrame = window.requestAnimationFrame(step);
        } else {
            // Ensure it lands exactly on the target number
            element.textContent = end;
        }
    };
    
    element.animationFrame = window.requestAnimationFrame(step);
}

// ===== Testimonials Slider =====
function showTestimonial(index) {
    testimonials.forEach((card, i) => {
        card.classList.remove('active');
        testimonialDots[i].classList.remove('active');
    });
    
    testimonials[index].classList.add('active');
    testimonialDots[index].classList.add('active');
    currentTestimonial = index;
}

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showTestimonial(index);
    });
});

// Auto-advance testimonials
setInterval(() => {
    const next = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(next);
}, 5000);

// ===== Modal Functions =====
function showModal(type) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (type === 'login') {
        modalTitle.textContent = 'Welcome Back';
        modalSubtitle.textContent = 'Sign in to your account';
    } else if (type === 'signup') {
        modalTitle.textContent = 'Get Started';
        modalSubtitle.textContent = 'Start your free trial today';
    } else if (type === 'demo') {
        modalTitle.textContent = 'Schedule a Demo';
        modalSubtitle.textContent = 'See NexFlow in action';
    }
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Form submission
modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulate form submission
    const submitBtn = modalForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Success!';
        submitBtn.style.background = 'var(--success)';
        
        setTimeout(() => {
            closeModal();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
            modalForm.reset();
        }, 1000);
    }, 1500);
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// ===== Counter Animation =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isRating = target.includes('/');
        const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
        
        if (!isNaN(numericValue)) {
            const duration = 2000;
            const start = 0;
            const increment = numericValue / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(timer);
                }
                
                let displayValue;
                if (isRating) {
                    displayValue = current.toFixed(1) + '/5';
                } else if (isPercentage) {
                    displayValue = Math.floor(current) + '%';
                } else if (numericValue >= 1000) {
                    displayValue = (current / 1000).toFixed(0) + 'k+';
                } else {
                    displayValue = Math.floor(current);
                }
                
                counter.textContent = displayValue;
            }, 16);
        }
    });
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    heroObserver.observe(heroStats);
}

// ===== Parallax Effect for Hero Shapes =====
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Add active class to first nav link
    document.querySelector('.nav-link').classList.add('active');
    
    // Initialize prices
    updatePrices();
    
    // Show first testimonial
    showTestimonial(0);
    
    console.log('NexFlow Landing Page Loaded Successfully! 🚀');
});

// ===== Performance Optimization =====
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img').forEach(img => {
        imageObserver.observe(img);
    });
}

// Debounce function for performance
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

// Optimize scroll handler
window.addEventListener('scroll', debounce(handleScroll, 10));