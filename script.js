// Set Hebrew as the default language
var currentLanguage = 'he';

// Initialize the page with Hebrew language
document.addEventListener('DOMContentLoaded', () => {
    if (typeof translations === 'undefined') {
        console.error('Translations not loaded! Make sure translations.js is loaded before script.js');
        return;
    }
    initializeLanguageButtons();
    changeLanguage('he');
});

function initializeLanguageButtons() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(button => {
        button.style.pointerEvents = 'auto';
        button.style.opacity = '1';
    });
}

function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    
    // Update language button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.includes(lang === 'he' ? 'עברית' : (lang === 'en' ? 'English' : 'Français'))) {
            btn.classList.add('active');
        }
    });
    
    // Update all translatable elements
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    // Update form placeholders
    document.querySelectorAll('input, textarea').forEach(input => {
        const key = input.getAttribute('name');
        if (translations[lang] && translations[lang][key + '_placeholder']) {
            input.placeholder = translations[lang][key + '_placeholder'];
        }
    });

    // Update text alignment
    const alignment = lang === 'he' ? 'right' : 'left';
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(element => {
        element.style.textAlign = alignment;
    });
}

// Remove the old event listener
const oldForm = document.getElementById('contact-form');
if (oldForm) {
    const newForm = oldForm.cloneNode(true);
    oldForm.parentNode.replaceChild(newForm, oldForm);
}

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Remove any existing messages
    const existingMessages = this.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());

    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = '...';

    const templateParams = {
        name: this.querySelector('#name').value,
        email: this.querySelector('#email').value,
        message: this.querySelector('#message').value
    };

    console.log('Sending email with params:', templateParams);

    const emailParams = {
        to_name: "Admin",
        from_name: templateParams.name,
        from_email: templateParams.email,
        message: templateParams.message,
        reply_to: templateParams.email
    };

    console.log('Sending with params:', emailParams);

    emailjs.send("service_9l7i6wc", "template_l93xvt2", emailParams, "2I1ujWsX3Fe_9X1q4")
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = translations[currentLanguage].message_sent || 'Message sent successfully!';
            event.target.appendChild(successMessage);
            event.target.reset();
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = translations[currentLanguage].message_error || 'Failed to send message. Please try again.';
            event.target.appendChild(errorMessage);
        })
        .finally(function() {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
});

// Product Selection and Purchase Functionality
document.addEventListener('DOMContentLoaded', function() {
    // No product selection functionality needed anymore
    console.log('Direct purchase mode active');
});





// Direct Purchase Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for Buy Now button
    const buyNowButton = document.querySelector('.buy-now-btn');
    
    if (buyNowButton) {
        buyNowButton.addEventListener('click', function() {
            // Always use catalog number 1 (250ml bottle) with quantity 1
            const catalogNumber = '1';
            const quantity = 1;
            
            directPurchase(catalogNumber, quantity);
        });
    }
});

// Function to handle direct purchase via Grow payment link
function directPurchase(catalogNumber, quantity) {
    if (quantity <= 0) quantity = 1;
    
    // Base URL with merchant ID
    let growPaymentUrl = 'https://pay.grow.link/889c0323deea09c8b0b82378c79bf387-MTg3OTMwNw';
    
    // Add product with quantity to URL
    growPaymentUrl += `/${catalogNumber}:${quantity}`;
    
    // Create a generic success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'מעביר אותך לתשלום עבור שמן ארגן למאכל';
    document.body.appendChild(successMessage);
    
    // Log the URL for debugging
    console.log(`Opening direct purchase for Argan culinary oil`);
    console.log('Payment URL:', growPaymentUrl);
    
    // For mobile devices, we need a more reliable approach
    // First, try direct window location change which is more reliable on mobile
    setTimeout(() => {
        successMessage.remove();
        
        // Try multiple approaches to ensure it works across all devices
        // 1. First attempt: window.location approach
        window.location.href = growPaymentUrl;
        
        // 2. Fallback: If the above doesn't redirect within 100ms, try window.open
        setTimeout(() => {
            window.open(growPaymentUrl, '_blank');
        }, 100);
    }, 1000);
}







// Handle payment success/cancel when returning from payment page
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'תודה על הרכישה! ההזמנה שלך התקבלה בהצלחה.';
        document.body.appendChild(successMessage);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 5000);
    } else if (paymentStatus === 'cancel') {
        // Show cancellation message
        const cancelMessage = document.createElement('div');
        cancelMessage.className = 'error-message';
        cancelMessage.textContent = 'התשלום בוטל. ניתן לנסות שוב מאוחר יותר.';
        document.body.appendChild(cancelMessage);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            cancelMessage.remove();
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 5000);
    }
});



// Quantity Selector
document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const input = e.target.parentElement.querySelector('.quantity-input');
        if (e.target.classList.contains('plus')) {
            input.value = parseInt(input.value) + 1;
        } else if (e.target.classList.contains('minus') && input.value > 1) {
            input.value = parseInt(input.value) - 1;
        }
    });
});

// Size selection handling
document.querySelectorAll('.size-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        // Update price display
        const price = this.dataset.price;
        const priceDisplay = document.querySelector('.product-price .price');
        if (priceDisplay) {
            priceDisplay.textContent = `₪${price}`;
        }
    });
});

// Initialize with 250ml selected
window.addEventListener('DOMContentLoaded', (event) => {
    // Initialize default size selection
    const defaultSizeBtn = document.querySelector('.size-btn[data-size="250"]');
    if (defaultSizeBtn) {
        defaultSizeBtn.click();
    }
});


// Header Scroll Effect
const header = document.querySelector('.main-header');
const scrollThreshold = 50;

window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const menuLinks = document.querySelectorAll('.nav-menu a');

mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking a link
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuToggle.contains(e.target) && 
        !navMenu.contains(e.target) && 
        navMenu.classList.contains('active')) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Add any interactive JavaScript here
