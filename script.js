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

// Contact form handling
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = '...';

    emailjs.sendForm('service_zmy298j', 'template_l93xvt2', this)
        .then(function() {
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = translations[currentLanguage].message_sent || 'Message sent successfully!';
            event.target.appendChild(successMessage);
            
            // Reset form
            event.target.reset();
            
            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        })
        .catch(function(error) {
            console.error('Error:', error);
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = translations[currentLanguage].message_error || 'Failed to send message. Please try again.';
            event.target.appendChild(errorMessage);
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        })
        .finally(function() {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
});

// Handle form submission
document.querySelector('#contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'שולח...';
    submitButton.disabled = true;

    try {
        const formData = {
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            message: form.querySelector('[name="message"]').value
        };

        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Show success message
            alert('ההודעה נשלחה בהצלחה!');
            form.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('אירעה שגיאה בשליחת ההודעה. אנא נסה שוב מאוחר יותר.');
    } finally {
        // Reset button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
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

// Add any interactive JavaScript here
