// Xử lý màu chữ image-caption
function getContrastColor(hexColor) {
    if (hexColor.startsWith('rgb')) {
        const rgb = hexColor.match(/\d+/g).map(Number);
        hexColor = `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1).padStart(6, '0')}`;
    }
    if (hexColor.startsWith('#')) hexColor = hexColor.slice(1);
    if (hexColor.length === 3) hexColor = hexColor.split('').map(char => char + char).join('');
    let r = parseInt(hexColor.slice(0, 2), 16);
    let g = parseInt(hexColor.slice(2, 4), 16);
    let b = parseInt(hexColor.slice(4, 6), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

document.addEventListener('DOMContentLoaded', () => {
    const wooPage = document.querySelector('.woocommerce-page');
    if (wooPage) {
        const bgColor = window.getComputedStyle(wooPage).backgroundColor;
        document.querySelectorAll('.image-caption').forEach(caption => {
            caption.style.color = getContrastColor(bgColor);
        });
    }
});

// Xử lý vị trí dropdown
document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown-location");
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            const dropdownContent = this.querySelector(".dropdown-content-location");
            if (dropdownContent) {
                const shouldDropUp = this.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
                if (isMobile()) {
                    adjustMobileDropdownPosition(this, dropdownContent, shouldDropUp);
                } else {
                    adjustDesktopDropdownPosition(this, dropdownContent, shouldDropUp);
                }
            }
        });
    });
});

function isMobile() {
    return window.innerWidth <= 768;
}

if (isMobile()) {
    document.querySelectorAll('.dropdown-location').forEach(content => {
        const dropdown = content.querySelector('.dropdown-content-location');
        if (dropdown) {
            content.addEventListener('mouseenter', () => {
                const shouldDropUp = content.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
                adjustMobileDropdownPosition(content, dropdown, shouldDropUp);
            });
        }
    });

    document.querySelectorAll('.scrollable').forEach(scrollable => {
        let ticking = false;
        scrollable.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    document.querySelectorAll('.dropdown-location').forEach(content => {
                        const dropdown = content.querySelector('.dropdown-content-location');
                        if (dropdown) {
                            const shouldDropUp = content.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
                            if (isMobile()) {
                                adjustMobileDropdownPosition(content, dropdown, shouldDropUp);
                            }
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    });
}

function adjustDesktopDropdownPosition(content, dropdown, shouldDropUp) {
    if (!dropdown) return;
    if (shouldDropUp) {
        dropdown.style.top = 'auto';
        dropdown.style.bottom = '100%';
    } else {
        dropdown.style.top = '';
        dropdown.style.bottom = '';
    }
}

function adjustMobileDropdownPosition(content, dropdown, shouldDropUp) {
    if (!dropdown) return;
    const contentRect = content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    dropdown.style.position = 'absolute';
    dropdown.style.maxWidth = 'none';
    dropdown.style.width = 'auto';
    const dropdownWidth = dropdown.offsetWidth;
    dropdown.style.width = dropdownWidth + 'px';
    if (shouldDropUp) {
        dropdown.style.top = 'auto';
        dropdown.style.bottom = '100%';
    } else {
        dropdown.style.top = '100%';
        dropdown.style.bottom = 'auto';
    }
    dropdown.style.left = '0';
    dropdown.style.transform = 'none';
    const dropdownRect = dropdown.getBoundingClientRect();
    if (dropdownRect.right > viewportWidth) {
        const rightEdge = contentRect.right;
        const rightOverflow = dropdownRect.width - rightEdge;
        if (rightOverflow > 0) {
            dropdown.style.left = 'auto';
            dropdown.style.right = '0';
        } else {
            dropdown.style.left = (viewportWidth - dropdownRect.width - 20) + 'px';
            dropdown.style.right = 'auto';
        }
    }
    if (dropdownRect.left < 0) {
        dropdown.style.left = '0';
        dropdown.style.right = 'auto';
    }
}

window.addEventListener('resize', function() {
    const visibleDropdowns = document.querySelectorAll('.dropdown-content-location:hover, .dropdown-content-location.active');
    visibleDropdowns.forEach(dropdown => {
        const parent = dropdown.closest('.dropdown-location');
        if (parent) {
            const shouldDropUp = parent.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
            if (isMobile()) {
                adjustMobileDropdownPosition(parent, dropdown, shouldDropUp);
            } else {
                adjustDesktopDropdownPosition(parent, dropdown, shouldDropUp);
            }
        }
    });
});
