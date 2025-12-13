// Payment processing

// EMAIL CONFIGURATION
// To enable email notifications, you need to set up Web3Forms (free):
// 1. Go to https://web3forms.com/
// 2. Enter your email: br02934a@gmail.com
// 3. Get your access key from your email
// 4. Replace 'YOUR_WEB3FORMS_ACCESS_KEY' below with your actual key
const WEB3FORMS_ACCESS_KEY = 'ff3a61f7-859c-4b85-bbbb-48854eae401f'; // Web3Forms access key

// DISCORD WEBHOOK CONFIGURATION
// To set up Discord webhook notifications:
// 1. Go to your Discord server settings
// 2. Navigate to Integrations > Webhooks
// 3. Create a new webhook
// 4. Copy the webhook URL and paste it below
// 5. Replace 'YOUR_DISCORD_WEBHOOK_URL' with your actual webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1448999561057009744/mVCIE4wYPidY7s4rJioKJJgdZld4yWKjtozEfiLbrdYz-_jXIELh7lTh4B88IHe'; // Discord webhook URL

document.addEventListener('DOMContentLoaded', () => {
    const processPaymentBtn = document.getElementById('process-payment');
    if (processPaymentBtn) {
        processPaymentBtn.addEventListener('click', processPayment);
    }
});

function processPayment() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;

    if (!email || !name || !paymentMethod) {
        alert('Please fill in all required fields and select a payment method.');
        return;
    }

    // Show processing modal
    showPaymentModal(paymentMethod, email, name);
}

function showPaymentModal(method, email, name) {
    const modal = document.getElementById('payment-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.getElementById('close-modal');

    if (!modal || !modalTitle || !modalBody) return;

    modal.classList.add('active');

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    switch(method) {
        case 'paypal':
            modalTitle.textContent = 'PayPal Payment';
            const paypalMeLink = 'paypal.me/gunszzs';
            modalBody.innerHTML = `
                <div class="payment-status">
                    <i class="fab fa-paypal" style="font-size: 3rem; color: #0070ba; margin-bottom: 1rem;"></i>
                    <h3>PayPal Payment</h3>
                    <p style="color: var(--text-gray); margin-top: 1rem;">
                        Click the button below to complete your payment of <strong>$${total.toFixed(2)}</strong>
                    </p>
                    <div class="payment-address" style="margin: 1.5rem 0; background: var(--card-bg); padding: 1rem; border-radius: 6px; border: 1px solid var(--border-color); word-break: break-all; text-align: center;">
                        <strong>https://${paypalMeLink}</strong>
                    </div>
                    <div style="display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-top: 1rem;">
                        <a href="https://${paypalMeLink}/${total.toFixed(2)}" target="_blank" class="btn btn-primary" style="text-decoration: none; padding: 1rem 2rem; font-size: 1.1rem;">
                            <i class="fab fa-paypal"></i> Pay $${total.toFixed(2)} with PayPal
                        </a>
                        <button class="btn" style="background: var(--card-bg); border: 1px solid var(--border-color);" onclick="copyToClipboard('https://${paypalMeLink}')">
                            <i class="fas fa-copy"></i> Copy Link
                        </button>
                    </div>
                    <p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1.5rem;">
                        <strong>Instructions:</strong>
                        <ol style="text-align: left; margin-top: 0.5rem; padding-left: 1.5rem;">
                            <li>Click "Pay with PayPal" button above</li>
                            <li>You will be redirected to PayPal to complete payment</li>
                            <li>After completing payment, return here and click "Confirm Payment"</li>
                        </ol>
                    </p>
                    <button class="btn btn-primary" style="margin-top: 1rem; background: var(--success-color);" onclick="simulatePaymentSuccess('${method}')">
                        <i class="fas fa-check"></i> Confirm Payment
                    </button>
                </div>
            `;
            break;

        case 'bitcoin':
        case 'litecoin':
            modalTitle.textContent = `${method === 'bitcoin' ? 'Bitcoin' : 'Litecoin'} Payment`;
            const cryptoAmount = (total / getCryptoRate(method.toUpperCase())).toFixed(8);
            const address = document.getElementById(`${method}-address`)?.textContent || generateCryptoAddress(method.toUpperCase());
            
            modalBody.innerHTML = `
                <div class="payment-status">
                    <h3>Waiting for Payment</h3>
                    <p style="color: var(--text-gray); margin: 1rem 0;">
                        Send <strong>${cryptoAmount} ${method.toUpperCase()}</strong> to:
                    </p>
                    <div class="payment-address" style="margin: 1rem 0;">${address}</div>
                    <button class="copy-button" onclick="copyToClipboard('${address}')">
                        <i class="fas fa-copy"></i> Copy Address
                    </button>
                    <p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1rem;">
                        <strong>Note:</strong> In production, integrate with a payment processor like:
                        <ul style="text-align: left; margin-top: 0.5rem;">
                            <li>BTCPay Server</li>
                            <li>Coinbase Commerce</li>
                            <li>Blockonomics</li>
                        </ul>
                    </p>
                    <button class="btn btn-primary" style="margin-top: 1rem;" onclick="simulatePaymentSuccess('${method}')">
                        Simulate Payment (Demo)
                    </button>
                </div>
            `;
            break;
    }

    if (closeModal) {
        closeModal.onclick = () => {
            modal.classList.remove('active');
        };
    }
}

function simulatePaymentSuccess(method) {
    const modal = document.getElementById('payment-modal');
    const modalBody = document.getElementById('modal-body');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (!modalBody) return;

    modalBody.innerHTML = `
        <div class="payment-status success">
            <i class="fas fa-check-circle"></i>
            <h3>Payment Successful!</h3>
            <p style="color: var(--text-gray); margin-top: 1rem;">
                Your order has been processed successfully.
            </p>
            <p style="margin-top: 1rem;">
                <strong>Order Total:</strong> $${total.toFixed(2)}
            </p>
            <p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1rem;">
                A confirmation email has been sent to your email address.
            </p>
            <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="completeOrder()">
                Continue Shopping
            </button>
        </div>
    `;
}

async function completeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    
    // Save order to localStorage (in production, send to server)
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
        id: Date.now(),
        email,
        name,
        items: cart,
        total: orderTotal,
        date: new Date().toISOString(),
        status: 'completed'
    };
    
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Show sending email message
    const modalBody = document.getElementById('modal-body');
    if (modalBody) {
        modalBody.innerHTML += '<p style="margin-top: 1rem; color: #666;">Sending confirmation emails...</p>';
    }
    
    // Send notifications - wait for them to complete
    try {
        await Promise.all([
            sendPaymentConfirmationEmail(orderData),
            sendReceiptToCustomer(orderData),
            sendDiscordNotification(orderData)
        ]);
        console.log('✅ All notifications sent successfully!');
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Close modal and redirect
    const modal = document.getElementById('payment-modal');
    if (modal) modal.classList.remove('active');
    
    // Small delay to ensure emails are sent
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}

async function sendPaymentConfirmationEmail(orderData) {
    // Format order items
    const itemsList = orderData.items.map(item => 
        `- ${item.title}: $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const emailSubject = `New Payment Received - Order #${orderData.id}`;
    const emailBody = `New payment confirmed!

Order ID: ${orderData.id}
Customer Name: ${orderData.name}
Customer Email: ${orderData.email}
Order Total: $${orderData.total.toFixed(2)}
Payment Method: PayPal

Items:
${itemsList}

Date: ${new Date(orderData.date).toLocaleString()}`;
    
    const storeEmail = 'br02934a@gmail.com';
    
    try {
        // Try using EmailJS first (if configured)
        if (typeof emailjs !== 'undefined' && emailjs) {
            try {
                await emailjs.send(
                    'YOUR_SERVICE_ID',
                    'YOUR_TEMPLATE_ID',
                    {
                        to_email: storeEmail,
                        to_name: 'Store Owner',
                        subject: emailSubject,
                        message: emailBody,
                        order_id: orderData.id,
                        customer_name: orderData.name,
                        customer_email: orderData.email,
                        order_total: `$${orderData.total.toFixed(2)}`,
                        items: itemsList
                    }
                );
                console.log('Payment confirmation email sent to store owner via EmailJS!');
                return;
            } catch (emailjsError) {
                console.warn('EmailJS failed, trying Web3Forms:', emailjsError);
            }
        }
        
        // Primary method: Web3Forms (free, easy setup)
        if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
            // Web3Forms API - sends to the email registered with the access key
            // Include customer email in the message so you know who it's from
            const formData = new FormData();
            formData.append('access_key', WEB3FORMS_ACCESS_KEY);
            formData.append('subject', emailSubject);
            formData.append('from_name', 'Digital Store Payment System');
            formData.append('name', `Order from ${orderData.name}`);
            formData.append('email', orderData.email); // Customer's email (for your reference)
            formData.append('message', emailBody);
            formData.append('replyto', orderData.email);
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Payment confirmation email sent to store owner!', result);
                return;
            } else {
                console.error('Web3Forms error:', result);
                throw new Error('Web3Forms failed: ' + JSON.stringify(result));
            }
        } else {
            console.warn('⚠️ Web3Forms access key not configured. Please set it up - see EMAIL_SETUP.md');
            throw new Error('Access key not configured');
        }
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        console.log('📧 Email details (for manual sending):', {
            to: storeEmail,
            subject: emailSubject,
            body: emailBody
        });
    }
}

async function sendReceiptToCustomer(orderData) {
    // Format order items for customer receipt
    const itemsList = orderData.items.map((item, index) => 
        `${index + 1}. ${item.title}
   Price: $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n\n');
    
    const customerSubject = `Order Receipt - Order #${orderData.id}`;
    const customerBody = `Thank you for your purchase!

ORDER RECEIPT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order ID: ${orderData.id}
Order Date: ${new Date(orderData.date).toLocaleString()}
Payment Method: PayPal

ITEMS PURCHASED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: $${orderData.total.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your order has been confirmed and will be processed shortly.

If you have any questions or concerns, please contact us through our support system.

Thank you for shopping with Guns Store!

Best regards,
Guns Store Team`;
    
    const customerEmail = orderData.email;
    
    try {
        // Try using EmailJS first (if configured)
        if (typeof emailjs !== 'undefined' && emailjs) {
            try {
                await emailjs.send(
                    'YOUR_SERVICE_ID',
                    'YOUR_TEMPLATE_ID_RECEIPT',
                    {
                        to_email: customerEmail,
                        to_name: orderData.name,
                        subject: customerSubject,
                        message: customerBody,
                        order_id: orderData.id,
                        order_total: `$${orderData.total.toFixed(2)}`,
                        items: itemsList,
                        reply_to: 'br02934a@gmail.com'
                    }
                );
                console.log('✅ Receipt email sent to customer via EmailJS!');
                return;
            } catch (emailjsError) {
                console.warn('EmailJS failed, trying Web3Forms:', emailjsError);
            }
        }
        
        // Primary method: Web3Forms (free, easy setup)
        // Note: Free tier sends to your registered email. For customer receipts,
        // you'd need Pro autoresponder feature. For now, we'll send to you with customer info.
        if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
            // Send customer receipt - Web3Forms free sends to registered email
            // Include customer email so you can forward or they can see it in console
            const formData = new FormData();
            formData.append('access_key', WEB3FORMS_ACCESS_KEY);
            formData.append('subject', `CUSTOMER RECEIPT - ${customerSubject} - To: ${customerEmail}`);
            formData.append('from_name', 'Guns Store');
            formData.append('name', orderData.name);
            formData.append('email', customerEmail); // Customer's email (for reference)
            formData.append('message', `RECEIPT FOR: ${customerEmail}\n\n${customerBody}`);
            formData.append('replyto', 'br02934a@gmail.com');
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Receipt email sent to customer!', result);
                return;
            } else {
                console.error('Web3Forms error:', result);
                throw new Error('Web3Forms failed: ' + JSON.stringify(result));
            }
        } else {
            console.warn('⚠️ Web3Forms access key not configured. Please set it up - see EMAIL_SETUP.md');
            throw new Error('Access key not configured');
        }
    } catch (error) {
        console.error('❌ Failed to send receipt email:', error);
        console.log('📧 Receipt email details (for manual sending):', {
            to: customerEmail,
            subject: customerSubject,
            body: customerBody
        });
    }
}


function getCryptoRate(type) {
    const rates = {
        'BTC': 45000,
        'LTC': 150
    };
    return rates[type] || 1;
}

function generateCryptoAddress(type) {
    const prefix = type === 'BTC' ? 'bc1' : 'ltc1';
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let address = prefix;
    for (let i = 0; i < 30; i++) {
        address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
}

async function sendDiscordNotification(orderData) {
    console.log('🔔 Attempting to send Discord notification...', orderData);
    
    // Check if webhook URL is configured
    if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === 'YOUR_DISCORD_WEBHOOK_URL') {
        console.warn('⚠️ Discord webhook URL not configured. Skipping Discord notification.');
        return false;
    }

    try {
        console.log('📤 Sending to Discord webhook:', DISCORD_WEBHOOK_URL);
        // Format order items for Discord embed (Discord has 1024 char limit per field)
        let itemsList = '';
        if (orderData.items && orderData.items.length > 0) {
            itemsList = orderData.items.map((item, index) => {
                const itemTitle = item.title || item.name || 'Unknown Item';
                const itemPrice = item.price || 0;
                const itemQuantity = item.quantity || 1;
                return `${index + 1}. **${itemTitle}** - $${itemPrice.toFixed(2)} × ${itemQuantity} = $${(itemPrice * itemQuantity).toFixed(2)}`;
            }).join('\n');
            
            // Truncate if too long (Discord limit is 1024 chars per field)
            if (itemsList.length > 1000) {
                itemsList = itemsList.substring(0, 997) + '...';
            }
        } else {
            itemsList = 'No items found';
        }

        // Create Discord embed message
        const embed = {
            title: '🛒 New Purchase Received!',
            color: 0x00ff00, // Green color
            fields: [
                {
                    name: '📦 Order ID',
                    value: `#${orderData.id}`,
                    inline: true
                },
                {
                    name: '💰 Total Amount',
                    value: `$${orderData.total.toFixed(2)}`,
                    inline: true
                },
                {
                    name: '👤 Customer Name',
                    value: (orderData.name || 'N/A').substring(0, 1024),
                    inline: true
                },
                {
                    name: '📧 Customer Email',
                    value: (orderData.email || 'N/A').substring(0, 1024),
                    inline: true
                },
                {
                    name: '📅 Order Date',
                    value: new Date(orderData.date).toLocaleString(),
                    inline: true
                },
                {
                    name: '✅ Status',
                    value: orderData.status || 'completed',
                    inline: true
                },
                {
                    name: '🛍️ Items Purchased',
                    value: itemsList || 'No items',
                    inline: false
                }
            ],
            timestamp: new Date(orderData.date).toISOString(),
            footer: {
                text: 'Digital Store Notification System'
            }
        };

        // Send to Discord webhook
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                embeds: [embed]
            })
        });

        if (response.ok) {
            console.log('✅ Discord notification sent successfully!');
            return true;
        } else {
            const errorText = await response.text();
            console.error('❌ Discord webhook error:', response.status, errorText);
            
            // Try sending a simple message as fallback
            try {
                const simpleMessage = {
                    content: `🛒 **New Purchase!**\nOrder #${orderData.id}\nCustomer: ${orderData.name || 'N/A'}\nEmail: ${orderData.email || 'N/A'}\nTotal: $${orderData.total.toFixed(2)}`
                };
                
                const fallbackResponse = await fetch(DISCORD_WEBHOOK_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(simpleMessage)
                });
                
                if (fallbackResponse.ok) {
                    console.log('✅ Discord notification sent as simple message!');
                    return true;
                }
            } catch (fallbackError) {
                console.error('❌ Fallback message also failed:', fallbackError);
            }
            
            throw new Error(`Discord webhook failed: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('❌ Failed to send Discord notification:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            orderData: orderData
        });
        // Don't throw - we don't want to break the order completion if Discord fails
        return false;
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            z-index: 10001;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        `;
        notification.textContent = 'Copied to clipboard!';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please copy manually: ' + text);
    });
}

// Test Discord webhook function (can be called from browser console)
async function testDiscordWebhook() {
    const testOrderData = {
        id: Date.now(),
        email: 'test@example.com',
        name: 'Test Customer',
        items: [
            { title: 'Test Product', price: 10.00, quantity: 1 }
        ],
        total: 10.00,
        date: new Date().toISOString(),
        status: 'test'
    };
    
    console.log('🧪 Testing Discord webhook...');
    const result = await sendDiscordNotification(testOrderData);
    if (result) {
        console.log('✅ Test notification sent! Check your Discord channel.');
    } else {
        console.error('❌ Test notification failed. Check console for errors.');
    }
    return result;
}

// Make functions available globally
window.simulatePaymentSuccess = simulatePaymentSuccess;
window.completeOrder = completeOrder;
window.copyToClipboard = copyToClipboard;
window.testDiscordWebhook = testDiscordWebhook;

