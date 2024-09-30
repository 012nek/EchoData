// DiscordUI.js

// Custom Module for Generating Discord-Themed UI Windows

// Exported Module Object
const DiscordUI = {};

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
    TEXT_COLOR: 'var(--text-normal)', // Default text color
    HYPERLINK_COLOR: '#00AFF4', // Color for hyperlinks
    SVG_ICON: `
        <!-- Question Mark Icon matching Discord's style -->
        <svg viewBox="0 0 24 24" width="24" height="24" class="icon_e986d9" aria-hidden="true">
            <path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10
            10 10-4.47 10-10S17.53 2 12 2zm1
            17h-2v-2h2v2zm1.07-7.75l-.9.92C11.45 12.9 11
            13.5 11 15h-2v-.5c0-1.1.45-2.1
            1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41
            0-1.1-.9-2-2-2s-2 .9-2
            2H7c0-2.21 1.79-4 4-4s4
            1.79 4 4c0 .88-.36 1.67-.93
            2.25z"/>
        </svg>
    `,
};

// Utility Functions

// Check if 'child' is a descendant of 'parent'
const isDescendant = (parent, child) => parent.contains(child);

// Extract user ID from message avatar
const extractUserIdFromMessage = (message) => {
    const avatarImg = message.querySelector(CONFIG.AVATAR_SELECTOR);
    if (avatarImg?.src) {
        const match = avatarImg.src.match(/\/(?:avatars|users)\/(\d+)/);
        return match ? match[1] : 'Unknown';
    }
    return 'Unknown';
};

// Find the previous message with an avatar
const findPreviousMessageWithAvatar = (currentMessage) => {
    let messageListItem = currentMessage.closest(CONFIG.MESSAGE_LIST_ITEM_SELECTOR);
    while ((messageListItem = messageListItem?.previousElementSibling)) {
        const message = messageListItem.querySelector(CONFIG.MESSAGE_SELECTOR);
        if (message?.querySelector(CONFIG.AVATAR_SELECTOR)) {
            return message;
        }
    }
    return null;
};

// Extract user information from a message element
const extractUserInfo = (message) => {
    let usernameElement = message.querySelector(CONFIG.USERNAME_SELECTOR);
    let username = usernameElement ? usernameElement.textContent.trim() : 'Unknown';

    let userId = extractUserIdFromMessage(message);

    if (userId === 'Unknown') {
        const previousMessage = findPreviousMessageWithAvatar(message);
        if (previousMessage) {
            userId = extractUserIdFromMessage(previousMessage);
            usernameElement = previousMessage.querySelector(CONFIG.USERNAME_SELECTOR);
            username = usernameElement ? usernameElement.textContent.trim() : username;
        }
    }

    const messageContentElement = message.querySelector(CONFIG.MESSAGE_CONTENT_SELECTOR);
    const messageContent = messageContentElement ? messageContentElement.textContent.trim() : '';

    const timestampElement = message.querySelector('time');
    const timestamp = timestampElement ? timestampElement.getAttribute('datetime') : '';

    const dataListItemId = message.getAttribute('data-list-item-id') || '';

    return { username, userId, messageContent, timestamp, dataListItemId };
};

// Create a custom button element
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
            const guildId = extractGuildId();

            console.log('--- User Information ---');
            console.log(`Username: ${userInfo.username}`);
            console.log(`User ID: ${userInfo.userId}`);
            console.log(`Message Content: ${userInfo.messageContent}`);
            console.log(`Timestamp: ${userInfo.timestamp}`);
            console.log(`Data List Item ID: ${userInfo.dataListItemId}`);
            console.log(`Guild ID: ${guildId}`);
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

// Extract guild ID from the URL
const extractGuildId = () => {
    const pathSegments = window.location.pathname.split('/');
    return pathSegments[2] || 'Unknown';
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
        let snapped = false;

        if (rect.left <= SNAP_DISTANCE) {
            modal.style.left = '0px';
            snapped = true;
        }
        if (rect.top <= SNAP_DISTANCE) {
            modal.style.top = '0px';
            snapped = true;
        }
        if (window.innerWidth - rect.right <= SNAP_DISTANCE) {
            modal.style.left = `${window.innerWidth - rect.width}px`;
            snapped = true;
        }
        if (window.innerHeight - rect.bottom <= SNAP_DISTANCE) {
            modal.style.top = `${window.innerHeight - rect.height}px`;
            snapped = true;
        }

        if (!snapped) {
            // Do nothing if not snapped
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

    const usernameField = createField('Username', userInfo.username, { hyperlink: true, url: '#', rainbow: false });
    content.appendChild(usernameField);

    const userIdField = createField('User ID', userInfo.userId);
    content.appendChild(userIdField);

    const guildIdField = createField('Guild ID', extractGuildId());
    content.appendChild(guildIdField);

    // Code-like Text Label
    const codeLabel = createCodeLabel('Inline Code Example');
    content.appendChild(codeLabel);

    // Miniaturized Graph
    const graph = createMiniGraph([5, 10, 7, 12, 8]);
    content.appendChild(graph);

    // Scrollable Container
    const scrollableBox = document.createElement('div');
    Object.assign(scrollableBox.style, {
        maxHeight: '150px',
        overflowY: 'auto',
        backgroundColor: 'var(--background-tertiary)',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid var(--background-modifier-border)',
    });

    // Example content inside scrollable box
    for (let i = 1; i <= 10; i++) {
        const item = document.createElement('div');
        item.textContent = `Scrollable Item ${i}`;
        item.style.color = CONFIG.TEXT_COLOR;
        scrollableBox.appendChild(item);
    }

    content.appendChild(scrollableBox);

    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.placeholder = 'Enter something...';
    Object.assign(inputBox.style, {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid var(--background-modifier-border)',
        backgroundColor: 'var(--background-tertiary)',
        color: CONFIG.TEXT_COLOR,
        outline: 'none',
        transition: 'box-shadow 0.2s',
    });
    inputBox.addEventListener('focus', () => {
        inputBox.style.boxShadow = '0 0 0 2px var(--brand-experiment)';
    });
    inputBox.addEventListener('blur', () => {
        inputBox.style.boxShadow = 'none';
    });
    content.appendChild(inputBox);

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    Object.assign(submitButton.style, {
        padding: '10px',
        borderRadius: '4px',
        backgroundColor: 'var(--button-positive-background)',
        color: 'var(--button-positive-text)',
        border: 'none',
        cursor: 'pointer',
        marginTop: '10px',
        position: 'relative',
        overflow: 'hidden',
    });

    // Ripple Effect on Submit Button
    submitButton.addEventListener('click', (event) => {
        createRippleEffect(event, submitButton);
        alert(`You entered: ${inputBox.value}`);
    });

    submitButton.addEventListener('mouseover', () => {
        submitButton.style.backgroundColor = 'var(--button-positive-background-hover)';
    });
    submitButton.addEventListener('mouseout', () => {
        submitButton.style.backgroundColor = 'var(--button-positive-background)';
    });

    content.appendChild(submitButton);

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

// Create a code-like text label
const createCodeLabel = (text) => {
    const codeLabel = document.createElement('div');
    codeLabel.className = 'markup_f8f345 messageContent_f9f2ca';
    const codeElement = document.createElement('code');
    codeElement.className = 'inline';
    codeElement.textContent = text;
    codeLabel.appendChild(codeElement);
    return codeLabel;
};

const createMiniGraph = (data) => {
    const graphContainer = document.createElement('div');
    Object.assign(graphContainer.style, {
        display: 'flex',
        alignItems: 'flex-end',
        height: '100px',
        gap: '4px',
        marginTop: '10px',
        backgroundColor: 'var(--background-tertiary)', // Graph background color
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid var(--background-modifier-border)',
    });

    const maxDataValue = Math.max(...data);

    data.forEach((value, index) => {
        const bar = document.createElement('div');
        Object.assign(bar.style, {
            width: '20px',
            height: `${(value / maxDataValue) * 100}%`,
            backgroundColor: 'var(--interactive-normal)', // Bar color
            position: 'relative',
            cursor: 'pointer',
            borderRadius: '2px',
            transition: 'background-color 0.3s',
        });

        // Tooltip for each bar
        const tooltip = document.createElement('div');
        tooltip.textContent = `Value: ${value}`;
        Object.assign(tooltip.style, {
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--background-primary)',
            color: 'var(--text-normal)',
            padding: '4px 8px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            opacity: '0',
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
            fontSize: '12px',
            zIndex: '10',
        });

        // Show tooltip on hover
        bar.addEventListener('mouseover', () => {
            tooltip.style.opacity = '1';
        });
        bar.addEventListener('mouseout', () => {
            tooltip.style.opacity = '0';
        });

        bar.appendChild(tooltip);
        graphContainer.appendChild(bar);
    });

    return graphContainer;
};

// Apply a rainbow effect to an element
const applyRainbowEffect = (element) => {
    element.style.backgroundImage = 'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)';
    element.style.backgroundSize = '200% auto';
    element.style.color = 'transparent';
    element.style.backgroundClip = 'text';
    element.style.animation = 'rainbow 10s linear infinite';
};

// Add the custom button to messages
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

// Remove the custom button from messages
const removeCustomButton = (message) => {
    if (message.hasAttribute(CONFIG.BUTTON_PROCESSED_DATA_ATTR)) {
        const customButton = message.querySelector(`.${CONFIG.CUSTOM_BUTTON_CLASS}`);
        customButton?.remove();
        message.removeAttribute(CONFIG.BUTTON_PROCESSED_DATA_ATTR);
    }
};

// Handle mouse events for messages
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

// Initialize event delegation
const initializeEventDelegation = () => {
    const container = document.querySelector('[data-list-id="chat-messages"]') || document.body;
    container.addEventListener('mouseenter', handleMouseEvent, true);
    container.addEventListener('mouseleave', handleMouseEvent, true);
};

// Initialize the module
const init = () => {
    initializeEventDelegation();
};

// Start the script
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', init);
}

// Add keyframes and custom styles
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
`;
document.head.appendChild(styleSheet);

// Export the module
export { DiscordUI };
