// Set Hebrew as the default language
let currentLanguage = 'he';

// Initialize the page with Hebrew language
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage('he');
});

function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    
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
}

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
let cart = [];
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.querySelector('.cart-icon');
const closeCart = document.querySelector('.close-cart');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.querySelector('.cart-items');
const totalAmount = document.querySelector('.total-amount');
const checkoutButton = document.querySelector('.checkout-button');

// Open/Close Cart
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

// Size Selection and Price Update
const sizeOptions = document.querySelectorAll('input[name="size"]');
const priceDisplay = document.querySelector('.price');
const prices = {
    '100': 99,
    '250': 199
};

sizeOptions.forEach(option => {
    option.addEventListener('change', (e) => {
        const selectedSize = e.target.value;
        priceDisplay.textContent = `₪${prices[selectedSize]}`;
    });
});

// Add to Cart
document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    const quantity = parseInt(document.querySelector('.quantity-input').value);
    const selectedSize = document.querySelector('input[name="size"]:checked').value;
    const product = {
        id: `argan-oil-${selectedSize}`,
        name: `${document.querySelector('[data-i18n="product1_title"]').textContent} - ${selectedSize}ml`,
        price: prices[selectedSize],
        quantity: quantity,
        size: `${selectedSize}ml`,
        image: document.querySelector('.product-image').src
    };

    addToCart(product);
    updateCartUI();
    cartModal.classList.add('active');
});

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartUI() {
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-size">${item.size}</p>
                    <p class="cart-item-price">₪${item.price} × ${item.quantity}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
            </div>
        `;
    });

    totalAmount.textContent = `₪${total}`;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    updateCartCount();
}

// Checkout Process
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
