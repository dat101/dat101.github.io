// Hàm tính độ sáng của màu (luminance)
function getLuminance(rgb) {
    // Chuyển đổi RGB thành giá trị 0-1
    const [r, g, b] = rgb.map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    // Tính luminance theo công thức W3C
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Hàm chuyển đổi màu từ string sang RGB array
function getRGBFromString(colorStr) {
    if (!colorStr || colorStr === 'transparent') return [255, 255, 255]; // Default white
    
    // Tạo element tạm để lấy computed color
    const tempEl = document.createElement('div');
    tempEl.style.color = colorStr;
    document.body.appendChild(tempEl);
    
    const computedColor = window.getComputedStyle(tempEl).color;
    document.body.removeChild(tempEl);
    
    // Extract RGB values từ "rgb(r, g, b)" hoặc "rgba(r, g, b, a)"
    const match = computedColor.match(/\d+/g);
    return match ? match.slice(0, 3).map(Number) : [255, 255, 255];
}

// Hàm tìm màu nền của một element cụ thể
function getBackgroundColor(element) {
    let currentEl = element;
    
    // Tìm kiếm màu nền từ element hiện tại lên các parent
    while (currentEl && currentEl !== document.body) {
        const bgColor = window.getComputedStyle(currentEl).backgroundColor;
        
        // Nếu tìm thấy màu nền không trong suốt
        if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
            return bgColor;
        }
        
        currentEl = currentEl.parentElement;
    }
    
    // Kiểm tra body
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    if (bodyBg && bodyBg !== 'rgba(0, 0, 0, 0)' && bodyBg !== 'transparent') {
        return bodyBg;
    }
    
    // Default white nếu không tìm thấy
    return 'rgb(255, 255, 255)';
}

// Hàm chính để cập nhật màu text cho từng caption
function updateTextColor() {
    const imageCaptions = document.querySelectorAll('.image-caption');
    
    if (imageCaptions.length === 0) return;
    
    // Xử lý từng .image-caption riêng biệt
    imageCaptions.forEach(caption => {
        // Tìm màu nền của khu vực chứa caption này
        const backgroundColor = getBackgroundColor(caption);
        
        // Chuyển đổi màu nền sang RGB
        const bgRGB = getRGBFromString(backgroundColor);
        const luminance = getLuminance(bgRGB);
        
        // Quyết định màu text: nền sáng -> text tối, nền tối -> text sáng
        const textColor = luminance > 0.5 ? '#333333' : '#ffffff';
        
        // Áp dụng màu cho caption này
        caption.style.color = textColor;
        caption.style.transition = 'color 0.3s ease';
        
        // Debug log cho từng caption
        console.log(`Caption background: ${backgroundColor}, Text color: ${textColor}`, caption);
    });
}

// Chạy khi DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateTextColor);
} else {
    updateTextColor();
}

// Theo dõi thay đổi màu nền (dành cho dynamic content)
const observer = new MutationObserver(() => {
    // Debounce để tránh chạy quá nhiều lần
    clearTimeout(window.colorUpdateTimeout);
    window.colorUpdateTimeout = setTimeout(updateTextColor, 50);
});

// Observe toàn bộ document để bắt mọi thay đổi có thể ảnh hưởng
observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style', 'class'],
    subtree: true,
    childList: true
});

// Chạy lại khi window resize (có thể có responsive color changes)
window.addEventListener('resize', () => {
    setTimeout(updateTextColor, 100);
});

// Export function để có thể gọi thủ công
window.updateImageCaptionColor = updateTextColor;

document.addEventListener("DOMContentLoaded", function () {
  // Handle horizontal overflow for all dropdowns
  const dropdowns = document.querySelectorAll(".dropdown-location");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("mouseenter", function () {
      const dropdownContent = this.querySelector(".dropdown-content-location");
      if (dropdownContent) {
        const isInSpecialArea = this.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
        if (isMobile()) {
          adjustMobileDropdownPosition(this, dropdownContent, isInSpecialArea);
        } else {
          adjustDesktopDropdownPosition(this, dropdownContent, isInSpecialArea);
        }
      }
    });
  });
});

function isMobile() {
  return window.innerWidth <= 768;
}

// Handle mobile-specific events
if (isMobile()) {
  document.querySelectorAll('.dropdown-location').forEach(content => {
    const dropdown = content.querySelector('.dropdown-content-location');
    if (dropdown) {
      content.addEventListener('click', (e) => {
        e.preventDefault();
        const isInSpecialArea = content.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
        adjustMobileDropdownPosition(content, dropdown, isInSpecialArea);
        dropdown.classList.toggle('active');
      });
    }
  });

  document.querySelectorAll('.scrollable').forEach(scrollable => {
    let ticking = false;
    scrollable.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          document.querySelectorAll('.dropdown-location.active').forEach(content => {
            const dropdown = content.querySelector('.dropdown-content-location');
            if (dropdown) {
              const isInSpecialArea = content.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
              if (isMobile()) {
                adjustMobileDropdownPosition(content, dropdown, isInSpecialArea);
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

// Handle desktop dropdown positioning
function adjustDesktopDropdownPosition(content, dropdown, isInSpecialArea) {
  if (!dropdown) return;

  const contentRect = content.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Set default position for dropdown
  dropdown.style.position = 'absolute';
  dropdown.style.top = '100%';
  dropdown.style.bottom = 'auto';
  dropdown.style.left = '0';
  dropdown.style.right = 'auto';
  dropdown.style.transform = 'none';

  // Calculate available space below
  const spaceBelow = viewportHeight - contentRect.bottom - 20;

  // Apply fixed size and scrolling for special area
  if (isInSpecialArea) {
    const maxHeight = Math.min(300, spaceBelow);
    dropdown.style.maxHeight = maxHeight + 'px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.overflowX = 'hidden';
    dropdown.style.width = 'auto';
    dropdown.style.minWidth = '200px';
  } else {
    // Other areas: adjust height dynamically
    if (spaceBelow < dropdown.scrollHeight) {
      dropdown.style.maxHeight = Math.max(200, spaceBelow) + 'px';
      dropdown.style.overflowY = 'auto';
      dropdown.style.overflowX = 'hidden';
    } else {
      dropdown.style.maxHeight = '';
      dropdown.style.overflowY = '';
      dropdown.style.overflowX = '';
    }
    dropdown.style.width = 'auto';
    dropdown.style.minWidth = '200px';
  }

  // Check and adjust horizontal position to prevent right overflow
  setTimeout(() => {
    const dropdownRect = dropdown.getBoundingClientRect();
    if (dropdownRect.right > viewportWidth - 10) {
      // Align left to stay within viewport
      dropdown.style.left = '0';
      dropdown.style.right = 'auto';
      dropdown.style.maxWidth = (viewportWidth - contentRect.left - 10) + 'px';
    }

    // Ensure dropdown doesn't overflow left edge
    const finalRect = dropdown.getBoundingClientRect();
    if (finalRect.left < 10) {
      dropdown.style.left = '10px';
      dropdown.style.maxWidth = (viewportWidth - 20) + 'px';
    }
  }, 0);

  // Add custom scrollbar
  if (!dropdown.classList.contains('custom-scrollbar')) {
    dropdown.classList.add('custom-scrollbar');
  }
}

// Handle mobile dropdown positioning (unchanged from original)
function adjustMobileDropdownPosition(content, dropdown, isInSpecialArea) {
  if (!dropdown) return;

  const contentRect = content.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Set default position
  dropdown.style.position = 'absolute';
  dropdown.style.top = '100%';
  dropdown.style.bottom = 'auto';
  dropdown.style.left = '0';
  dropdown.style.right = 'auto';
  dropdown.style.transform = 'none';

  // Apply fixed size and scrolling for special area
  if (isInSpecialArea) {
    const maxHeight = Math.min(300, viewportHeight - contentRect.bottom - 20);
    dropdown.style.maxHeight = maxHeight + 'px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.overflowX = 'hidden';
    dropdown.style.width = 'auto';
    dropdown.style.minWidth = '200px';
    dropdown.style.maxWidth = 'none';
    dropdown.style.scrollbarWidth = 'thin';
    dropdown.style.scrollbarColor = '#888 #f1f1f1';
  } else {
    dropdown.style.maxWidth = 'none';
    dropdown.style.width = 'auto';
    const dropdownWidth = dropdown.offsetWidth;
    dropdown.style.width = dropdownWidth + 'px';
  }

  // Check if dropdown overflows right edge
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

  // Ensure dropdown doesn't overflow left edge
  if (dropdownRect.left < 0) {
    dropdown.style.left = '0';
    dropdown.style.right = 'auto';
  }

  // Add custom scrollbar
  if (!dropdown.classList.contains('custom-scrollbar')) {
    dropdown.classList.add('custom-scrollbar');
  }
}

// Add resize event listener
window.addEventListener('resize', function() {
  const visibleDropdowns = document.querySelectorAll('.dropdown-content-location.active');
  visibleDropdowns.forEach(dropdown => {
    const parent = dropdown.closest('.dropdown-location');
    if (parent) {
      const isInSpecialArea = parent.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
      if (isMobile()) {
        adjustMobileDropdownPosition(parent, dropdown, isInSpecialArea);
      } else {
        adjustDesktopDropdownPosition(parent, dropdown, isInSpecialArea);
      }
    }
  });
});
