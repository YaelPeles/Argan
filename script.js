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

// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart UI function
function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const totalAmount = document.querySelector('.total-amount');
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-size">${item.size}</span>
                <span class="cart-item-price">₪${item.price}</span>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    totalAmount.textContent = `₪${total.toFixed(2)}`;
    updateCartCount();
}

function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity > 0) {
        item.quantity = newQuantity;
    } else {
        cart.splice(index, 1);
    }
    
    updateCartDisplay();
    saveCartToLocalStorage();
}

function addToCart(product) {
    const existingItemIndex = cart.findIndex(item => 
        item.id === product.id && item.size === product.size
    );

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += product.quantity;
    } else {
        cart.push(product);
    }

    updateCartDisplay();
    saveCartToLocalStorage();
    showCartModal();
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showCartModal() {
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) {
        cartModal.classList.add('active');
    }
}

// Add to Cart functionality
document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
    const quantity = parseInt(document.querySelector('.quantity-input').value);
    const selectedSize = document.querySelector('.size-btn.active').dataset.size;
    const selectedPrice = parseInt(document.querySelector('.size-btn.active').dataset.price);
    
    const product = {
        id: `argan-oil-${selectedSize}`,
        name: `שמן ארגן למאכל - ${selectedSize} מ"ל`,
        price: selectedPrice,
        quantity: quantity,
        size: `${selectedSize} מ"ל`,
        image: 'images/products/bottle.jpeg'
    };

    addToCart(product);

    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'המוצר נוסף לעגלה בהצלחה!';
    document.body.appendChild(successMessage);

    // Remove success message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
});

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();
    updateCartDisplay();
}

// Update cart count function
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateCartCount();
});

// Open/Close Cart
const cartIcon = document.querySelector('.cart-icon');
const closeCart = document.querySelector('.close-cart');
const cartModal = document.getElementById('cart-modal');

cartIcon.addEventListener('click', () => {
    cartModal.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartModal.classList.remove('active');
});

// Close cart when clicking outside
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove('active');
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
    const defaultSizeBtn = document.querySelector('.size-btn[data-size="250"]');
    if (defaultSizeBtn) {
        defaultSizeBtn.click();
    }
});

// Checkout Process
const checkoutButton = document.querySelector('.checkout-button');

checkoutButton.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('העגלה ריקה');
        return;
    }

    // Here you would typically integrate with a payment processor
    // For now, we'll just show a success message
    alert('מעבר לתשלום...');
    // You can add your payment processing logic here
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
