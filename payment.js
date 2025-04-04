// Product prices in ILS
const PRODUCT_PRICES = {
    '1': 219, // 250ml bottle
    '2': 99,  // 100ml bottle
};

// Direct purchase functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check for payment status in URL (returning from payment)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus) {
        // Payment status is handled in script.js
        console.log('Payment status detected:', paymentStatus);
    }
    
    // Log Grow payment integration info
    console.log('Grow payment integration ready');
    console.log('250ml bottle (catalog #1): ₪219');
    console.log('100ml bottle (catalog #2): ₪99');
});

// Helper function to get product name from catalog number
function getProductName(catalogNumber) {
    return catalogNumber === '1' ? 'שמן ארגן 250 מ"ל' : 'שמן ארגן 100 מ"ל';
}

// Helper function to get product price from catalog number
function getProductPrice(catalogNumber) {
    return PRODUCT_PRICES[catalogNumber] || 0;
}

// Placeholder for error handling if needed in the future
function showPaymentError(message) {
    console.error('Payment error:', message);
}

// Update order summary in payment form
function updateOrderSummary(cart, total) {
    const orderItemsContainer = document.querySelector('.order-items');
    if (!orderItemsContainer) return;

    orderItemsContainer.innerHTML = '';

    // Create items list
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="item-name">${item.size} - ${translations[currentLanguage].product_title}</div>
            <div class="item-quantity">${translations[currentLanguage].quantity}: ${item.quantity}</div>
            <div class="item-price">₪${PRODUCT_PRICES[item.size]} × ${item.quantity}</div>
        `;
        orderItemsContainer.appendChild(itemElement);
    });

    // Update total
    const totalElement = document.querySelector('.order-total .total-amount');
    if (totalElement) {
        totalElement.textContent = `₪${total}`;
    }
}

// Generate unique order number
function generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
}

// Generate unique transaction ID
function generateTransactionId() {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `TXN-${timestamp}-${random}`;
}

// Show order confirmation
function showOrderConfirmation(orderDetails) {
    // Create a new modal for order confirmation
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'confirmation-modal';
    confirmationModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        direction: rtl;
    `;

    // Create items list
    const items = orderDetails.items.map(item => {
        const price = PRODUCT_PRICES[item.size] || PRODUCT_PRICES[item.size.match(/\d+/)?.[0]];
        return `
            <div class="confirmation-item" style="display: flex; justify-content: space-between; margin: 5px 0; padding: 5px 0; border-bottom: 1px solid #eee;">
                <span>${translations[currentLanguage].product_title} - ${item.size}</span>
                <span>${item.quantity} x ₪${price} = ₪${price * item.quantity}</span>
            </div>
        `;
    }).join('');

    confirmationModal.innerHTML = `
        <div class="confirmation-content" style="
            background: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        ">
            <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">
                ${translations[currentLanguage].order_confirmation || 'אישור הזמנה'}
            </h2>

            <div class="confirmation-details" style="margin: 20px 0;">
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p style="margin: 5px 0;"><strong>${translations[currentLanguage].order_number || 'מספר הזמנה'}:</strong> ${orderDetails.orderNumber}</p>
                    <p style="margin: 5px 0;"><strong>${translations[currentLanguage].order_date || 'תאריך'}:</strong> ${new Date(orderDetails.orderDate).toLocaleDateString('he-IL')}</p>
                    <p style="margin: 5px 0;"><strong>${translations[currentLanguage].payment_method || 'אמצעי תשלום'}:</strong> ${orderDetails.paymentMethod === 'Credit Card' ? 'כרטיס אשראי' : 'PayPal'}</p>
                </div>

                <div class="customer-info" style="margin-bottom: 20px;">
                    <h3 style="color: #2c3e50; margin-bottom: 10px;">${translations[currentLanguage].customer_details || 'פרטי לקוח'}:</h3>
                    <p style="margin: 5px 0;">${orderDetails.customerInfo.name}</p>
                    <p style="margin: 5px 0;">${orderDetails.customerInfo.email}</p>
                    ${orderDetails.customerInfo.phone ? `<p style="margin: 5px 0;">${orderDetails.customerInfo.phone}</p>` : ''}
                </div>

                <div class="order-items" style="margin-bottom: 20px;">
                    <h3 style="color: #2c3e50; margin-bottom: 10px;">${translations[currentLanguage].order_items || 'פריטים שהוזמנו'}:</h3>
                    ${items}
                </div>

                <div class="order-total" style="
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 2px solid #ddd;
                    font-size: 1.2em;
                    text-align: left;
                ">
                    <strong>${translations[currentLanguage].total || 'סה״כ'}:</strong> ₪${orderDetails.total}
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                <button onclick="window.print()" style="
                    padding: 10px 20px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">
                    ${translations[currentLanguage].print_order || 'הדפסת הזמנה'}
                </button>
                <button onclick="location.reload()" style="
                    padding: 10px 20px;
                    background: #666;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">
                    ${translations[currentLanguage].close || 'סגירה'}
                </button>
            </div>
        </div>
    `;

    // Add print styles
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            body * {
                visibility: hidden;
            }
            .confirmation-modal,
            .confirmation-modal * {
                visibility: visible;
            }
            .confirmation-modal button {
                display: none;
            }
            .confirmation-modal {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white;
            }
        }
    `;
    document.head.appendChild(style);

    // Add the modal to the page
    document.body.appendChild(confirmationModal);
}

// Send order confirmation email (simulated)
function sendOrderConfirmationEmail(orderDetails) {
    console.log('Sending order confirmation email:', {
        to: orderDetails.customerInfo.email,
        subject: translations[currentLanguage].email_subject,
        orderDetails: orderDetails
    });
}

// Show payment success message
function showPaymentSuccess(message) {
    const successElement = document.createElement('div');
    successElement.className = 'payment-success';
    successElement.textContent = message;

    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter) {
        // Remove existing messages
        const existingMessages = cartFooter.querySelectorAll('.payment-success, .payment-error');
        existingMessages.forEach(msg => msg.remove());
        
        cartFooter.appendChild(successElement);
        
        // Clear cart and close modal after success
        localStorage.removeItem('cart');
        updateCartDisplay();
        setTimeout(() => {
            const cartModal = document.querySelector('.cart-modal');
            if (cartModal) cartModal.classList.remove('active');
            successElement.remove();
        }, 3000);
    }
}



// Wait for both DOM and PayPal SDK to load
let paypalSDKLoaded = false;
let domLoaded = false;

window.paypalSDKLoaded = function() {
    console.log('PayPal SDK load callback triggered');
    paypalSDKLoaded = true;
    if (domLoaded) {
        initializePayments();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content loaded');
    domLoaded = true;
    if (paypalSDKLoaded) {
        initializePayments();
    }
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            console.log('Checkout button clicked');
            initializePayments();
        });
    }

    // Add click event to close cart modal
    const closeCartButton = document.querySelector('.close-cart');
    if (closeCartButton) {
        closeCartButton.addEventListener('click', () => {
            const modal = document.querySelector('.cart-modal');
            if (modal) {
                modal.style.display = 'none';
                // Reset payment form
                const paymentForm = document.querySelector('.payment-form');
                const checkoutButton = document.querySelector('.checkout-button');
                const paypalContainer = document.getElementById('paypal-button-container');
                if (paymentForm && checkoutButton) {
                    paymentForm.style.display = 'none';
                    checkoutButton.style.display = 'block';
                }
                if (paypalContainer) {
                    paypalContainer.innerHTML = '';
                    paypalContainer.style.display = 'none';
                }
            }
        });
    }
});

// Initialize payment options in the cart modal
function initializePayments() {
    try {
        // Get cart items and validate
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Cart contents:', cart);
        
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            return;
        }

        const cartTotal = calculateCartTotal();
        
        if (!cartTotal || cartTotal <= 0) {
            return;
        }

        // Show payment form and PayPal container
        const paymentForm = document.querySelector('.payment-form');
        const checkoutButton = document.querySelector('.checkout-button');
        const paypalContainer = document.getElementById('paypal-button-container');
        const cartItems = document.querySelector('.cart-items');
        const orderSummary = document.querySelector('.order-summary');

        if (!paypalContainer) {
            console.error('PayPal container not found');
            showPaymentError(translations[currentLanguage].payment_error);
            return;
        }

        // Hide cart edit buttons but show order summary
        if (cartItems) {
            const editButtons = cartItems.querySelectorAll('.quantity-controls, .remove-item');
            editButtons.forEach(button => button.style.display = 'none');
        }

        // Update order summary with items and total
        updateOrderSummary(cart, cartTotal);

        if (paymentForm && checkoutButton) {
            checkoutButton.style.display = 'none';
            paymentForm.style.display = 'block';
            paypalContainer.style.display = 'block';
        }

        // Clear any existing buttons
        paypalContainer.innerHTML = '';

        // Create PayPal button with credit card option
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'gold',
                shape: 'rect',
                height: 45
            },
            createOrder: function(data, actions) {
                try {
                    // Get current cart total in case it changed
                    const currentTotal = calculateCartTotal();
                    console.log('Processing payment...');
                    
                    if (currentTotal <= 0) {
                        showPaymentError(translations[currentLanguage].cart_empty);
                        return null;
                    }

                    // Get cart items for the order
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const items = cart.map(item => {
                        const size = item.size;
                        const price = PRODUCT_PRICES[size] || PRODUCT_PRICES[size.match(/\d+/)?.[0]];
                        if (!price) {
                            throw new Error(`Invalid product size or price not found: ${size}`);
                        }
                        return {
                            name: `${translations[currentLanguage].product_title} - ${size}`,
                            unit_amount: {
                                currency_code: 'ILS',
                                value: price.toString()
                            },
                            quantity: item.quantity
                        };
                    });

                    console.log('Creating PayPal order with items:', items);
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                currency_code: 'ILS',
                                value: currentTotal.toString(),
                                breakdown: {
                                    item_total: {
                                        currency_code: 'ILS',
                                        value: currentTotal.toString()
                                    }
                                }
                            },
                            items: items,
                            description: translations[currentLanguage].product_title
                        }]
                    });
                } catch (error) {
                    console.error('Error creating PayPal order:', error);
                    showPaymentError(translations[currentLanguage].payment_error);
                    return null;
                }
            },
            onApprove: function(data, actions) {
                // Process payment
                return actions.order.capture().then(function(details) {
                    console.log('Payment completed successfully.');
                    
                    try {
                        // Handle successful payment
                        const orderDetails = {
                            orderNumber: generateOrderNumber(),
                            orderDate: new Date().toISOString(),
                            customerInfo: {
                                name: details.payer.name.given_name + ' ' + details.payer.name.surname,
                                email: details.payer.email_address,
                                phone: details.payer.phone?.phone_number,
                                address: details.purchase_units[0]?.shipping?.address
                            },
                            items: JSON.parse(localStorage.getItem('cart')) || [],
                            total: calculateCartTotal(),
                            transactionId: details.id,
                            paymentStatus: details.status,
                            paymentMethod: details.payment_source?.card ? 'Credit Card' : 'PayPal'
                        };

                        console.log('Payment completed successfully. Order details:', orderDetails);
                        
                        // Show success message and confirmation
                        showOrderConfirmation(orderDetails);
                        showPaymentSuccess(translations[currentLanguage].payment_success);
                        
                        // Clear cart and update display
                        localStorage.removeItem('cart');
                        updateCartDisplay();

                        // Close modal and reload page after a delay
                        // Hide the cart modal
                        const cartModal = document.querySelector('.cart-modal');
                        if (cartModal) {
                            cartModal.style.display = 'none';
                        }
                    } catch (error) {
                        console.error('Error processing successful payment:', error);
                        showPaymentError(translations[currentLanguage].payment_error);
                    }
                }).catch(function(error) {
                    console.error('Error capturing PayPal order:', error);
                    showPaymentError(translations[currentLanguage].payment_error);
                });
            },
            onError: function(err) {
                console.error('PayPal error:', err);
                showPaymentError(translations[currentLanguage].payment_error);
            },
            onCancel: function(data) {
                console.log('Payment cancelled by user');
                showPaymentError(translations[currentLanguage].payment_cancelled || 'Payment was cancelled');
            }
        }).render('#paypal-button-container').catch(function(error) {
            console.error('Failed to render PayPal button:', error);
            showPaymentError(translations[currentLanguage].payment_error);
        });

    } catch (error) {
        console.error('Error initializing payments:', error);
        showPaymentError(translations[currentLanguage].payment_error);
    }
}

// Calculate cart total
function calculateCartTotal() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) return 0;

        const total = cart.reduce((sum, item) => {
            const price = PRODUCT_PRICES[item.size];
            if (!price) {
                console.error('Invalid product size:', item.size);
                return sum;
            }
            return sum + (price * (item.quantity || 1));
        }, 0);

        return total || 0;
    } catch (error) {
        console.error('Error calculating cart total:', error);
        return 0;
    }
}

// Show payment error message
function showPaymentError(message) {
    try {
        const cartFooter = document.querySelector('.cart-footer');
        if (!cartFooter) return;

        // Remove existing error messages
        const existingErrors = cartFooter.querySelectorAll('.payment-error');
        existingErrors.forEach(error => error.remove());

        // Create and show new error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'payment-error';
        errorMessage.textContent = message;
        cartFooter.appendChild(errorMessage);

        // Remove error message after 3 seconds
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 3000);
    } catch (error) {
        console.error('Error showing payment error:', error);
    }
}

// Show payment success message
function showPaymentSuccess(message) {
    try {
        const cartFooter = document.querySelector('.cart-footer');
        if (!cartFooter) return;

        // Remove existing success messages
        const existingMessages = cartFooter.querySelectorAll('.payment-success');
        existingMessages.forEach(msg => msg.remove());

        // Create and show new success message
        const successMessage = document.createElement('div');
        successMessage.className = 'payment-success';
        successMessage.textContent = message;
        cartFooter.appendChild(successMessage);

        // Clear cart and update display
        try {
            localStorage.removeItem('cart');
            updateCartDisplay();
        } catch (storageError) {
            console.error('Error clearing cart:', storageError);
        }

        // Close cart modal after success
        setTimeout(() => {
            try {
                if (successMessage.parentNode) {
                    successMessage.remove();
                }
                const cartModal = document.querySelector('.cart-modal');
                if (cartModal) cartModal.classList.remove('active');
            } catch (cleanupError) {
                console.error('Error during cleanup:', cleanupError);
            }
        }, 3000);
    } catch (error) {
        console.error('Error showing payment success:', error);
        showPaymentError(translations[currentLanguage].payment_error);
    }
}


