// Checkout functionality
document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutItems();
    setupPaymentMethods();
    setupFormValidation();
});

function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItems = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (!checkoutItems) return;

    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p style="color: var(--text-gray);">No items in cart.</p>';
        if (subtotalEl) subtotalEl.textContent = '0.00';
        if (totalEl) totalEl.textContent = '0.00';
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; // No tax/shipping for digital products

    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item-info">
                <div class="checkout-item-title">${item.title}</div>
                <div style="color: var(--text-gray); font-size: 0.9rem;">Quantity: ${item.quantity}</div>
            </div>
            <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (totalEl) totalEl.textContent = total.toFixed(2);
}

function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-option input[type="radio"]');
    const paymentDetails = document.getElementById('payment-details');
    const processPaymentBtn = document.getElementById('process-payment');

    paymentOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            if (e.target.checked) {
                const method = e.target.value;
                showPaymentDetails(method);
                if (processPaymentBtn) processPaymentBtn.disabled = false;
            }
        });
    });
}

function showPaymentDetails(method) {
    const paymentDetails = document.getElementById('payment-details');
    if (!paymentDetails) return;

    paymentDetails.classList.remove('hidden');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    switch(method) {
        case 'paypal':
            paymentDetails.innerHTML = `
                <h3>PayPal Payment</h3>
                <p style="color: var(--text-gray); margin-bottom: 1rem;">
                    You will be redirected to PayPal to complete your payment.
                </p>
                <p style="text-align: center; font-size: 1.2rem; color: var(--primary-color); font-weight: bold;">
                    Total: $${total.toFixed(2)}
                </p>
                <p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1rem;">
                    <strong>Note:</strong> Once you have made the payment screenshot and send it to me to Confirm it.
                </p>
            `;
            break;

        case 'bitcoin':
            const btcAddress = '34A4bJFd7QU34zP6r3vBSjw7hp2hSQZaHx';
            const btcAmount = (total / getCryptoRate('BTC')).toFixed(8);
            paymentDetails.innerHTML = `
                <h3>Bitcoin Payment</h3>
                <div class="amount-crypto">
                    ${btcAmount} BTC
                </div>
                <p style="color: var(--text-gray); margin-bottom: 1rem; text-align: center;">
                    Send exactly <strong>${btcAmount} BTC</strong> to the address below:
                </p>
                <div class="payment-address" id="btc-address">${btcAddress}</div>
                <button class="copy-button" onclick="copyToClipboard('${btcAddress}')">
                    <i class="fas fa-copy"></i> Copy Address
                </button>
                <p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1rem; text-align: center;">
                    <strong>Note:</strong> Once you have made the payment screenshot and send it to me to Confirm it.
                </p>
            `;
            break;

        case 'litecoin':
            const ltcAddress = 'MNnZmHx76W5ZXMY4mAg3uLswbrtv9WpRc6';
            const ltcAmount = (total / getCryptoRate('LTC')).toFixed(8);
            paymentDetails.innerHTML = `
                <h3>Litecoin Payment</h3>
                <div class="amount-crypto">
                    ${ltcAmount} LTC
                </div>
                <p style="color: var(--text-gray); margin-bottom: 1rem; text-align: center;">
                    Send exactly <strong>${ltcAmount} LTC</strong> to the address below:
                </p>
                <div class="payment-address" id="ltc-address">${ltcAddress}</div>
                <button class="copy-button" onclick="copyToClipboard('${ltcAddress}')">
                    <i class="fas fa-copy"></i> Copy Address
                </button>
                <p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1rem; text-align: center;">
                    <strong>Note:</strong> Once you have made the payment screenshot and send it to me to Confirm it.
                </p>
            `;
            break;
    }
}

function generateCryptoAddress(type) {
    // Generate a demo address (in production, use a real payment processor API)
    const prefix = type === 'BTC' ? 'bc1' : 'ltc1';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let address = prefix;
    for (let i = 0; i < 30; i++) {
        address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
}

function getCryptoRate(type) {
    // Demo rates (in production, fetch from an API)
    const rates = {
        'BTC': 45000, // $45,000 per BTC
        'LTC': 150    // $150 per LTC
    };
    return rates[type] || 1;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const button = event.target.closest('.copy-button');
        if (button) {
            const originalText = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.classList.add('copied');
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function setupFormValidation() {
    const form = document.getElementById('customer-form');
    const processPaymentBtn = document.getElementById('process-payment');

    if (!form || !processPaymentBtn) return;

    form.addEventListener('input', () => {
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const paymentSelected = document.querySelector('input[name="payment"]:checked');

        if (email && name && paymentSelected) {
            processPaymentBtn.disabled = false;
        } else {
            processPaymentBtn.disabled = true;
        }
    });
}

// Make copyToClipboard available globally
window.copyToClipboard = copyToClipboard;

