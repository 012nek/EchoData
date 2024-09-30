// DiscordUI.js

// Custom Module for Generating Discord-Themed UI Windows
(function() {
    // Configuration Constants
    const CONFIG = {
        MESSAGE_SELECTOR: '.message_d5deea',
        MESSAGE_LIST_ITEM_SELECTOR: '.messageListItem_d5deea',
        BUTTON_CONTAINER_SELECTOR: '.buttonsInner_d5deea',
        CUSTOM_BUTTON_CLASS: 'custom-hover-button',
        BUTTON_PROCESSED_DATA_ATTR: 'data-hover-button-added',
        USERNAME_SELECTOR: '.username_f9f2ca',
        AVATAR_SELECTOR: 'img.avatar_f9f2ca',
        MESSAGE_CONTENT_SELECTOR: '.messageContent_f9f2ca',
        REPLY_CONTEXT_SELECTOR: '.repliedMessage_f9f2ca',
        TEXT_COLOR: 'var(--text-normal)',
        HYPERLINK_COLOR: '#00AFF4',
        SVG_ICON: `
            <!-- Info Icon matching Discord's style -->
            <svg viewBox="0 0 24 24" width="24" height="24" class="icon_e986d9" aria-hidden="true">
                <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10
                10 10-4.47 10-10S17.53 2 12 2zm0
                17a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 12
                19zm1-4h-2v-6h2v6z"/>
            </svg>
        `,
    };

    /** Utility Functions **/

    // Create a ripple effect on click
    const createRippleEffect = (event, element) => {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;
        Object.assign(circle.style, {
            width: `${diameter}px`,
            height: `${diameter}px`,
            left: `${event.clientX - element.getBoundingClientRect().left - radius}px`,
            top: `${event.clientY - element.getBoundingClientRect().top - radius}px`,
            position: 'absolute',
            background: 'var(--interactive-active)',
            borderRadius: '50%',
            transform: 'scale(0)',
            animation: 'ripple 600ms linear',
            pointerEvents: 'none',
        });
        element.appendChild(circle);
        setTimeout(() => {
            circle.remove();
        }, 600);
    };

    // Create the modal window
    const createModalWindow = (content, button) => {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        Object.assign(modal.style, {
            backgroundColor: 'var(--background-secondary)',
            color: CONFIG.TEXT_COLOR,
            padding: '16px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90%',
            maxHeight: '80vh',
            position: 'absolute',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.24)',
            zIndex: '1000',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        });

        // Header with Divider
        const header = document.createElement('div');
        header.textContent = 'User Information';
        Object.assign(header.style, {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: CONFIG.TEXT_COLOR,
            flexShrink: '0',
        });
        modal.appendChild(header);

        const divider = document.createElement('div');
        Object.assign(divider.style, {
            height: '1px',
            backgroundColor: 'var(--background-modifier-accent)',
            marginBottom: '8px',
            flexShrink: '0',
        });
        modal.appendChild(divider);

        const contentWrapper = document.createElement('div');
        Object.assign(contentWrapper.style, {
            overflowY: 'auto',
            flex: '1',
        });
        contentWrapper.appendChild(content);
        modal.appendChild(contentWrapper);

        const exitButton = document.createElement('button');
        exitButton.innerHTML = '&times;';
        Object.assign(exitButton.style, {
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--interactive-normal)',
            fontSize: '16px',
            cursor: 'pointer',
        });

        exitButton.addEventListener('mouseover', () => {
            exitButton.style.color = 'var(--interactive-hover)';
        });
        exitButton.addEventListener('mouseout', () => {
            exitButton.style.color = 'var(--interactive-normal)';
        });

        exitButton.addEventListener('click', () => {
            modal.remove();
        });

        modal.appendChild(exitButton);

        document.body.appendChild(modal);

        // Position the modal near the button
        positionModal(modal, button);

        // Make the modal draggable
        makeModalDraggable(modal, header);

        // Enable window snapping
        enableWindowSnapping(modal);
    };

    // Position the modal window
    const positionModal = (modal, button) => {
        const buttonRect = button.getBoundingClientRect();
        const modalRect = modal.getBoundingClientRect();

        let top = buttonRect.top + window.scrollY - modalRect.height - 10;
        let left = buttonRect.left + window.scrollX - (modalRect.width / 2) + (buttonRect.width / 2);

        // Adjust if modal goes off screen
        if (left < 0) left = 10;
        if (left + modalRect.width > window.innerWidth) left = window.innerWidth - modalRect.width - 10;
        if (top < 0) top = buttonRect.bottom + window.scrollY + 10;

        modal.style.top = `${top}px`;
        modal.style.left = `${left}px`;
    };

    // Make the modal window draggable
    const makeModalDraggable = (modal, handle) => {
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;

        handle.style.cursor = 'move';

        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - modal.offsetLeft;
            offsetY = e.clientY - modal.offsetTop;
            document.addEventListener('mousemove', moveModal);
            document.addEventListener('mouseup', stopDragging);
        });

        const moveModal = (e) => {
            if (isDragging) {
                modal.style.left = `${e.clientX - offsetX}px`;
                modal.style.top = `${e.clientY - offsetY}px`;
            }
        };

        const stopDragging = () => {
            isDragging = false;
            document.removeEventListener('mousemove', moveModal);
            document.removeEventListener('mouseup', stopDragging);
        };
    };

    // Enable window snapping to screen edges
    const enableWindowSnapping = (modal) => {
        const SNAP_DISTANCE = 20; // Pixels to snap to edge
        const checkSnap = () => {
            const rect = modal.getBoundingClientRect();

            if (rect.left <= SNAP_DISTANCE) {
                modal.style.left = '0px';
            }
            if (rect.top <= SNAP_DISTANCE) {
                modal.style.top = '0px';
            }
            if (window.innerWidth - rect.right <= SNAP_DISTANCE) {
                modal.style.left = `${window.innerWidth - rect.width}px`;
            }
            if (window.innerHeight - rect.bottom <= SNAP_DISTANCE) {
                modal.style.top = `${window.innerHeight - rect.height}px`;
            }
        };

        modal.addEventListener('mouseup', checkSnap);
    };

    // Generate the content for the modal window
    const generateModalContent = (userInfo) => {
        const content = document.createElement('div');
        Object.assign(content.style, {
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        });

        const usernameField = createField('Username', userInfo.username, { hyperlink: false });
        content.appendChild(usernameField);

        const userIdField = createField('User ID', userInfo.userId);
        content.appendChild(userIdField);

        const guildIdField = createField('Guild ID', userInfo.guildId);
        content.appendChild(guildIdField);

        return content;
    };

    // Create a field element
    const createField = (labelText, valueText, options = {}) => {
        const field = document.createElement('div');
        field.style.display = 'flex';
        field.style.flexDirection = 'column';

        const label = document.createElement('span');
        label.textContent = labelText;
        Object.assign(label.style, {
            fontWeight: 'bold',
            color: CONFIG.TEXT_COLOR,
        });
        field.appendChild(label);

        let value;
        if (options.hyperlink) {
            value = document.createElement('a');
            value.href = options.url || '#';
            value.textContent = valueText;
            Object.assign(value.style, {
                color: CONFIG.HYPERLINK_COLOR,
                textDecoration: 'none',
            });
            value.addEventListener('mouseover', () => {
                value.style.textDecoration = 'underline';
            });
            value.addEventListener('mouseout', () => {
                value.style.textDecoration = 'none';
            });
        } else {
            value = document.createElement('span');
            value.textContent = valueText;
            value.style.color = CONFIG.TEXT_COLOR;
        }

        // Apply rainbow effect if specified
        if (options.rainbow) {
            applyRainbowEffect(value);
        }

        field.appendChild(value);

        return field;
    };

    // Apply a rainbow effect to an element
    const applyRainbowEffect = (element) => {
        element.style.backgroundImage = 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)';
        element.style.backgroundSize = '200% auto';
        element.style.color = 'transparent';
        element.style.backgroundClip = 'text';
        element.style.animation = 'rainbow 10s linear infinite';
    };

    // Extract guild ID from the URL
    const extractGuildId = () => {
        const pathSegments = window.location.pathname.split('/');
        return pathSegments[2] || 'Unknown';
    };

    const extractUsernameFromMessage = (message) => {
        // Select the username element of the message sender, excluding those in the reply context
        const usernameElement = message.querySelector('.contents_f9f2ca > h3 .username_f9f2ca');
        if (usernameElement) {
            return usernameElement.textContent.trim();
        }
        return 'Unknown';
    };

    const extractUserIdFromMessage = (message) => {
        // Select the avatar image of the message sender, excluding images in the reply context
        const avatarImage = message.querySelector('.avatar_f9f2ca:not(.replyAvatar_f9f2ca)');
        if (avatarImage && avatarImage.src) {
            const match = avatarImage.src.match(/\/(?:avatars|users)\/(\d+)/);
            if (match) {
                return match[1];
            }
        }
        return null;
    };

    // Extract user ID from reply context if present
    const extractUserIdFromReplyContext = (message) => {
        const replyContext = message.querySelector(CONFIG.REPLY_CONTEXT_SELECTOR);
        if (replyContext) {
            const images = replyContext.querySelectorAll('img[src*="/avatars/"], img[src*="/users/"]');
            for (const img of images) {
                const match = img.src.match(/\/(?:avatars|users)\/(\d+)/);
                if (match) {
                    return match[1];
                }
            }
        }
        return null;
    };

    // Extract username from reply context if present
    const extractUsernameFromReplyContext = (message) => {
        const replyContext = message.querySelector(CONFIG.REPLY_CONTEXT_SELECTOR);
        if (replyContext) {
            const usernameElement = replyContext.querySelector(CONFIG.USERNAME_SELECTOR);
            if (usernameElement) {
                return usernameElement.textContent.trim();
            }
        }
        return null;
    };

    // Find the previous message
    const findPreviousMessage = (message) => {
        let messageListItem = message.closest(CONFIG.MESSAGE_LIST_ITEM_SELECTOR);
        if (messageListItem) {
            let previousMessageListItem = messageListItem.previousElementSibling;
            while (previousMessageListItem) {
                const previousMessage = previousMessageListItem.querySelector(CONFIG.MESSAGE_SELECTOR);
                if (previousMessage) {
                    return previousMessage;
                }
                previousMessageListItem = previousMessageListItem.previousElementSibling;
            }
        }
        return null;
    };

    const extractUserInfo = (message) => {
        let currentMessage = message;
        let username = extractUsernameFromMessage(currentMessage);
        let userId = extractUserIdFromMessage(currentMessage);
    
        // Traverse upward until we find a valid userId
        while (!userId && currentMessage) {
            currentMessage = findPreviousMessage(currentMessage);
            if (currentMessage) {
                userId = extractUserIdFromMessage(currentMessage);
                if (username === 'Unknown') {
                    username = extractUsernameFromMessage(currentMessage);
                }
            }
        }
    
        // If userId is still unknown after traversing
        if (!userId) {
            userId = 'Unknown';
            console.warn('User ID could not be extracted.');
        }
    
        // Extract message content
        const messageContentElement = message.querySelector(CONFIG.MESSAGE_CONTENT_SELECTOR);
        const messageContent = messageContentElement ? messageContentElement.textContent.trim() : '';
    
        // Extract timestamp
        const timestampElement = message.querySelector('time');
        const timestamp = timestampElement ? timestampElement.getAttribute('datetime') : '';
    
        // Extract data-list-item-id
        const dataListItemId = message.getAttribute('data-list-item-id') || '';
    
        // Extract guild ID
        const guildId = extractGuildId();
    
        return { username, userId, messageContent, timestamp, dataListItemId, guildId };
    };     

    // Add keyframes and custom styles
    const addStyles = () => {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            @keyframes rainbow {
                0% { background-position: 0% }
                100% { background-position: 200% }
            }
            /* Custom scrollbar styling */
            .custom-modal ::-webkit-scrollbar {
                width: 8px;
            }
            .custom-modal ::-webkit-scrollbar-track {
                background: var(--background-tertiary);
            }
            .custom-modal ::-webkit-scrollbar-thumb {
                background-color: var(--scrollbar-auto-thumb);
                border-radius: 4px;
            }
            .custom-modal ::-webkit-scrollbar-thumb:hover {
                background-color: var(--scrollbar-auto-thumb);
            }
            /* Modal animation */
            .custom-modal {
                animation: fadeIn 0.2s ease-in-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            /* Button hover effect */
            .${CONFIG.CUSTOM_BUTTON_CLASS}:hover {
                background-color: var(--background-modifier-hover);
                border-radius: 4px;
            }
        `;
        document.head.appendChild(styleSheet);
    };

    const createCustomButton = () => {
        const button = document.createElement('div');
        button.className = `button_f7e168 ${CONFIG.CUSTOM_BUTTON_CLASS}`;
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.setAttribute('aria-label', 'Show User Info');
        button.innerHTML = CONFIG.SVG_ICON;
        Object.assign(button.style, {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            marginLeft: '4px',
            color: 'var(--interactive-normal)',
            position: 'relative',
            overflow: 'hidden',
        });

        // Hover and Click Effects
        button.addEventListener('mouseover', () => {
            button.style.color = 'var(--interactive-hover)';
        });
        button.addEventListener('mouseout', () => {
            button.style.color = 'var(--interactive-normal)';
        });
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            createRippleEffect(event, button);

            const message = event.target.closest(CONFIG.MESSAGE_SELECTOR);
            if (message) {
                const userInfo = extractUserInfo(message);

                console.log('--- User Information ---');
                console.log(`Username: ${userInfo.username}`);
                console.log(`User ID: ${userInfo.userId}`);
                console.log(`Message Content: ${userInfo.messageContent}`);
                console.log(`Timestamp: ${userInfo.timestamp}`);
                console.log(`Data List Item ID: ${userInfo.dataListItemId}`);
                console.log(`Guild ID: ${userInfo.guildId}`);
                console.log('-------------------------');

                const modalContent = generateModalContent(userInfo);
                createModalWindow(modalContent, button);
            }
        });

        // Keyboard Accessibility
        button.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                button.click();
            }
        });

        return button;
    };

    const isDescendant = (parent, child) => parent.contains(child);

    const addCustomButton = (message) => {
        if (!message.hasAttribute(CONFIG.BUTTON_PROCESSED_DATA_ATTR)) {
            const buttonsContainer = message.querySelector(CONFIG.BUTTON_CONTAINER_SELECTOR);
            if (buttonsContainer) {
                const customButton = createCustomButton();
                buttonsContainer.appendChild(customButton);
                message.setAttribute(CONFIG.BUTTON_PROCESSED_DATA_ATTR, 'true');
            }
        }
    };

    const removeCustomButton = (message) => {
        if (message.hasAttribute(CONFIG.BUTTON_PROCESSED_DATA_ATTR)) {
            const customButton = message.querySelector(`.${CONFIG.CUSTOM_BUTTON_CLASS}`);
            customButton?.remove();
            message.removeAttribute(CONFIG.BUTTON_PROCESSED_DATA_ATTR);
        }
    };

    const handleMouseEvent = (event) => {
        const message = event.target.closest(CONFIG.MESSAGE_SELECTOR);
        if (message) {
            if (event.type === 'mouseenter') {
                addCustomButton(message);
            } else if (event.type === 'mouseleave' && !isDescendant(message, event.relatedTarget)) {
                removeCustomButton(message);
            }
        }
    };

    const initializeEventDelegation = () => {
        const container = document.querySelector('[data-list-id="chat-messages"]') || document.body;
        container.addEventListener('mouseenter', handleMouseEvent, true);
        container.addEventListener('mouseleave', handleMouseEvent, true);
    };

    // Initialize the module
    const init = () => {
        addStyles();
        initializeEventDelegation();
    };

    // Start the script
    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    };

})();
