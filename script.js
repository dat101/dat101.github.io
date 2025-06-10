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
  const dropdowns = document.querySelectorAll(".dropdown-location");

  // Handle mouseenter and touchstart events for dropdowns
  dropdowns.forEach(dropdown => {
    ['mouseenter', 'touchstart'].forEach(event => {
      dropdown.addEventListener(event, function (e) {
        if (e.type === 'touchstart') e.preventDefault();
        const dropdownContent = this.querySelector(".dropdown-content-location");
        if (dropdownContent) {
          const isInSpecialArea = this.closest('[data-special-area="true"]') !== null;
          if (isMobile()) {
            adjustMobileDropdownPosition(this, dropdownContent, isInSpecialArea);
          } else {
            adjustDesktopDropdownPosition(this, dropdownContent, isInSpecialArea);
          }
        }
      });
    });
  });

  // Handle scroll events with throttling
  document.querySelectorAll('.scrollable').forEach(scrollable => {
    scrollable.addEventListener('scroll', throttle(() => {
      dropdowns.forEach(content => {
        const dropdown = content.querySelector('.dropdown-content-location');
        if (dropdown) {
          const isInSpecialArea = content.closest('[data-special-area="true"]') !== null;
          if (isMobile()) {
            adjustMobileDropdownPosition(content, dropdown, isInSpecialArea);
          }
        }
      });
    }, 100));
  });

  // Handle window resize events
  window.addEventListener('resize', () => {
    const visibleDropdowns = document.querySelectorAll('.dropdown-content-location:hover, .dropdown-content-location.active');
    visibleDropdowns.forEach(dropdown => {
      const parent = dropdown.closest('.dropdown-location');
      if (parent) {
        const isInSpecialArea = parent.closest('[data-special-area="true"]') !== null;
        if (isMobile()) {
          adjustMobileDropdownPosition(parent, dropdown, isInSpecialArea);
        } else {
          adjustDesktopDropdownPosition(parent, dropdown, isInSpecialArea);
        }
      }
    });
  });

  // New: Observe size changes in .dropdown-content-location
  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const dropdown = entry.target;
      dropdown.style.right = '0';
      dropdown.style.left = 'auto';
    }
  });

  // Attach ResizeObserver to each .dropdown-content-location
  document.querySelectorAll('.dropdown-content-location').forEach(dropdown => {
    resizeObserver.observe(dropdown);
  });
});

function isMobile() {
  return window.innerWidth <= 768;
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function adjustDesktopDropdownPosition(content, dropdown, isInSpecialArea) {
  if (!dropdown) return;
  const contentRect = content.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  dropdown.style.position = 'absolute';
  dropdown.style.top = '250%';
  dropdown.style.bottom = 'auto';
  // Note: left and right are managed by ResizeObserver if size changes
  dropdown.style.transform = 'none';

  const spaceBelow = viewportHeight - contentRect.bottom - 20;
  if (isInSpecialArea) {
    dropdown.style.maxHeight = Math.min(300, spaceBelow) + 'px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.overflowX = 'hidden';
    dropdown.style.width = 'auto';
    dropdown.style.minWidth = '200px';
  } else {
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

  requestAnimationFrame(() => {
    const dropdownRect = dropdown.getBoundingClientRect();
    if (dropdownRect.right > viewportWidth - 10 && dropdown.style.right !== '0') {
      dropdown.style.left = 'auto';
      dropdown.style.right = '0';
      const newDropdownRect = dropdown.getBoundingClientRect();
      if (newDropdownRect.left < 10) {
        dropdown.style.left = '10px';
        dropdown.style.right = 'auto';
        dropdown.style.maxWidth = (viewportWidth - 20) + 'px';
      }
    }
    if (dropdownRect.left < 10 && dropdown.style.right !== '0') {
      dropdown.style.left = '10px';
      dropdown.style.right = 'auto';
    }
  });

  if (!dropdown.classList.contains('custom-scrollbar')) {
    dropdown.classList.add('custom-scrollbar');
    if (!document.getElementById('dropdown-scrollbar-style')) {
      const style = document.createElement('style');
      style.id = 'dropdown-scrollbar-style';
      style.textContent = `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
      `;
      document.head.appendChild(style);
    }
  }
}

function adjustMobileDropdownPosition(content, dropdown, isInSpecialArea) {
  if (!dropdown) return;
  const contentRect = content.getBoundingClientRect ElsaMeyersohn;ect'.top = '100%';
  dropdown.style.bottom = 'auto';

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
    if (!dropdown.classList.contains('custom-scrollbar')) {
      dropdown.classList.add('custom-scrollbar');
      if (!document.getElementById('dropdown-scrollbar-style')) {
        const style = document.createElement('style');
        style.id = 'dropdown-scrollbar-style';
        style.textContent = `
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        `;
        document.head.appendChild(style);
      }
    }
  } else {
    dropdown.style.maxWidth = 'none';
    dropdown.style.width = 'auto';
    dropdown.style.width = dropdown.offsetWidth + 'px';
  }

  // Note: left and right are managed by ResizeObserver if size changes
  const dropdownRect = dropdown.getBoundingClientRect();
  if (dropdownRect.right > viewportWidth && dropdown.style.right !== '0') {
    dropdown.style.left = 'auto';
    dropdown.style.right = '0';
  }
  if (dropdownRect.left < 0 && dropdown.style.right !== '0') {
    dropdown.style.left = '0';
    dropdown.style.right = 'auto';
  }
}
