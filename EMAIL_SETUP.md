# Email Setup Instructions

To enable email notifications for payment confirmations and customer receipts, you need to set up Web3Forms (free and easy).

## ⚡ Quick Setup (5 minutes)

### Step 1: Get Your Web3Forms Access Key
1. Go to **https://web3forms.com/**
2. Enter your email: `br02934a@gmail.com`
3. Click **"Get Your Access Key"**
4. Check your email inbox (and spam folder) and copy the access key (it looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 2: Update the Code
1. Open `js/payment.js`
2. Find line **~7** (near the top of the file)
3. You'll see:
   ```javascript
   const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
   ```
4. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your actual key from Step 1:
   ```javascript
   const WEB3FORMS_ACCESS_KEY = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
   ```
5. Save the file

### Step 3: Test
1. Open your website and go to checkout
2. Make a test purchase
3. Check your email (`br02934a@gmail.com`) for the payment confirmation
4. Check the customer's email (the one entered in checkout) for the receipt

## ✅ What You'll Get

- **Payment Confirmation Email** → Sent to `br02934a@gmail.com` when someone pays
  - Includes: Order ID, customer info, items purchased, total amount

- **Customer Receipt** → Sent to the buyer's email address
  - Includes: Order details, itemized list, total, confirmation message

## Alternative: EmailJS Setup (More features, slightly more setup)

If you prefer EmailJS instead:

1. Sign up at https://www.emailjs.com/ (free for 200 emails/month)
2. Create an email service (connect your Gmail)
3. Create two email templates:
   - Template 1: Payment confirmation to store owner
   - Template 2: Receipt to customer
4. Get your Service ID, Template IDs, and Public Key
5. Update `checkout.html` line ~201: Replace `YOUR_PUBLIC_KEY`
6. Update `js/payment.js`:
   - Replace `YOUR_SERVICE_ID` with your service ID
   - Replace `YOUR_TEMPLATE_ID` with your payment confirmation template ID
   - Replace `YOUR_TEMPLATE_ID_RECEIPT` with your receipt template ID

## How It Works

- **Payment Confirmation Email**: Sent to `br02934a@gmail.com` when a customer completes payment
- **Customer Receipt**: Sent to the customer's email address they provided during checkout

Both emails are sent automatically when `completeOrder()` is called after payment confirmation.

