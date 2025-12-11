// Chat Widget Functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chat-widget-button');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const emailForm = document.getElementById('email-form');
    const liveChatTab = document.getElementById('live-chat-tab');
    const emailTab = document.getElementById('email-tab');
    const liveChatContent = document.getElementById('live-chat-content');
    const emailContent = document.getElementById('email-content');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const sendEmailBtn = document.getElementById('send-email-btn');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');

    // Open chat window
    if (chatButton) {
        chatButton.addEventListener('click', () => {
            if (chatWindow) {
                chatWindow.classList.add('active');
            }
        });
    }

    // Close chat window
    if (closeChat) {
        closeChat.addEventListener('click', () => {
            if (chatWindow) {
                chatWindow.classList.remove('active');
            }
        });
    }

    // Tab switching
    if (liveChatTab && emailTab && liveChatContent && emailContent) {
        liveChatTab.addEventListener('click', () => {
            liveChatTab.classList.add('active');
            emailTab.classList.remove('active');
            liveChatContent.classList.add('active');
            emailContent.classList.remove('active');
        });

        emailTab.addEventListener('click', () => {
            emailTab.classList.add('active');
            liveChatTab.classList.remove('active');
            emailContent.classList.add('active');
            liveChatContent.classList.remove('active');
        });
    }

    // Send live chat message
    if (sendMessageBtn && chatInput && chatMessages) {
        sendMessageBtn.addEventListener('click', () => {
            const message = chatInput.value.trim();
            if (message) {
                addChatMessage(message, 'user');
                chatInput.value = '';
                
                // Simulate auto-reply (you can replace this with actual live chat functionality)
                setTimeout(() => {
                    addChatMessage('Thank you for your message! Our team will respond shortly.', 'support');
                }, 1000);
            }
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessageBtn.click();
            }
        });
    }

    // Send email
    if (sendEmailBtn && emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email-address').value;
            const subject = document.getElementById('email-subject').value;
            const message = document.getElementById('email-message').value;

            if (email && subject && message) {
                // Create mailto link
                const mailtoLink = `mailto:br02934a@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + email + '\n\n' + message)}`;
                window.location.href = mailtoLink;
                
                // Show success message
                showNotification('Opening email client...');
                
                // Reset form
                emailForm.reset();
            } else {
                showNotification('Please fill in all fields', 'error');
            }
        });
    }

    function addChatMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `
            <div class="chat-message-content">${message}</div>
            <div class="chat-message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `chat-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});

