// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(47, 27, 20, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.4)';
    } else {
        navbar.style.background = 'rgba(47, 27, 20, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Load and render data from JSON
async function loadData() {
    try {
        const response = await fetch('./data.json');
        const data = await response.json();
        
        renderDownloadProducts(data.downloads);
        renderTeamMembers(data.developers);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Render download products
function renderDownloadProducts(downloads) {
    const downloadProducts = document.getElementById('downloadProducts');
    
    Object.keys(downloads).forEach(productKey => {
        const product = downloads[productKey];
        const productSection = createProductSection(product);
        downloadProducts.appendChild(productSection);
    });
}

// Create product section element
function createProductSection(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'download-product';
    
    productDiv.innerHTML = `
        <div class="product-header">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
        </div>
        
        <div class="product-downloads">
            <div class="download-category">
                <h4 class="download-category-title">
                    <i class="fas fa-mobile-alt"></i>
                    Download the App
                </h4>
                <div class="download-buttons app-downloads">
                    ${product.app.map(app => createDownloadButtonHTML(app)).join('')}
                </div>
            </div>
            
            <div class="download-category">
                <h4 class="download-category-title">
                    <i class="fas fa-book"></i>
                    Download the Book
                </h4>
                <div class="download-buttons book-downloads">
                    ${product.book.map(book => createDownloadButtonHTML(book)).join('')}
                </div>
            </div>
        </div>
    `;
    
    return productDiv;
}

// Create download button HTML
function createDownloadButtonHTML(link) {
    const isDirectLink = link.platform === 'Direct Link';
    const downloadAttr = isDirectLink ? `download="${link.name || ''}"` : '';
    const targetAttr = isDirectLink ? '' : 'target="_blank" rel="noopener noreferrer"';
    
    return `
        <a href="${link.url}" class="download-btn" ${targetAttr} ${downloadAttr}>
            <div class="download-btn-content">
                <div class="download-btn-icon">
                    <i class="${link.icon}"></i>
                </div>
                <div class="download-btn-info">
                    <div class="download-btn-name">${link.platform}</div>
                    <div class="download-btn-details">${link.fileSize} • ${link.version}</div>
                </div>
            </div>
            <div class="download-btn-arrow">
                <i class="fas fa-arrow-right"></i>
            </div>
        </a>
    `;
}

// Create download button element
function createDownloadButton(link) {
    const downloadBtn = document.createElement('a');
    downloadBtn.href = link.url;
    downloadBtn.className = 'download-btn';
    downloadBtn.target = '_blank';
    downloadBtn.rel = 'noopener noreferrer';

    if (link.platform === 'Direct Link') {
        downloadBtn.setAttribute('download', link.name || '');
        downloadBtn.target = '';
    }
    
    downloadBtn.innerHTML = `
        <div class="download-btn-content">
            <div class="download-btn-icon">
                <i class="${link.icon}"></i>
            </div>
            <div class="download-btn-info">
                <div class="download-btn-name">${link.platform}</div>
                <div class="download-btn-details">${link.fileSize} • ${link.version}</div>
            </div>
        </div>
        <div class="download-btn-arrow">
            <i class="fas fa-arrow-right"></i>
        </div>
    `;
    
    return downloadBtn;
}

// Render team members
function renderTeamMembers(developers) {
    const teamGrid = document.getElementById('teamGrid');
    
    developers.forEach(dev => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        
        // Generate avatar initials
        const initials = dev.name.split(' ').map(name => name[0]).join('');
        
        teamCard.innerHTML = `
            <div class="team-avatar">${initials}</div>
            <h3>${dev.name}</h3>
            <div class="team-role">${dev.role}</div>
            <p>${dev.description}</p>
            <div class="team-links">
                <a href="${dev.github}" class="team-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github"></i>
                </a>
                <a href="${dev.linkedin}" class="team-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-linkedin"></i>
                </a>
            </div>
        `;
        
        teamGrid.appendChild(teamCard);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
function initializeAnimations() {
    const animateElements = document.querySelectorAll('.feature-card, .step, .download-card, .team-card, .guide-section');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// Copy to clipboard functionality for download links
function addCopyToClipboard() {
    const downloadLinks = document.querySelectorAll('.download-link');
    
    downloadLinks.forEach(link => {
        // Add double-click to copy URL
        link.addEventListener('dblclick', (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(link.href).then(() => {
                showToast('Download link copied to clipboard!');
            }).catch(() => {
                console.log('Failed to copy to clipboard');
            });
        });
    });
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--primary-color);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 8px 30px var(--shadow-medium);
        z-index: 1001;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add toast animations to CSS
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeAnimations();
    
    // Add copy functionality after download links are rendered
    setTimeout(() => {
        addCopyToClipboard();
    }, 100);
});

// Performance optimization: Lazy load non-critical animations
window.addEventListener('load', () => {
    // Add subtle drift effect to background elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPosition = `${scrolled * 0.1}px ${scrolled * 0.05}px`;
        }
    });
});