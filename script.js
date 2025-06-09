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
  // Xử lý overflow chiều ngang cho tất cả các dropdown
  const dropdowns = document.querySelectorAll(".dropdown-location");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("mouseenter", function () {
      const dropdownContent = this.querySelector(".dropdown-content-location");
      if (dropdownContent) {
        // Xác định xem dropdown nằm trong vùng cần áp dụng drop-up hay không
        const shouldDropUp = this.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
        
        // Chỉ áp dụng điều chỉnh vị trí đặc biệt nếu là thiết bị di động
        if (isMobile()) {
          adjustMobileDropdownPosition(this, dropdownContent, shouldDropUp);
        } else {
          // Trên desktop giữ cách hoạt động mặc định
          adjustDesktopDropdownPosition(this, dropdownContent, shouldDropUp);
        }
      }
    });
  });
});

function isMobile() {
  return window.innerWidth <= 768;
}

// Thiết lập sự kiện cho thiết bị mobile
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

// Hàm xử lý cho thiết bị desktop - giữ phong cách cơ bản
function adjustDesktopDropdownPosition(content, dropdown, shouldDropUp) {
  if (!dropdown) return;
  
  // Trên desktop, chỉ xử lý chiều dọc (drop-up) nếu cần
  if (shouldDropUp) {
    dropdown.style.top = 'auto';
    dropdown.style.bottom = '100%';
  } else {
    dropdown.style.top = '';
    dropdown.style.bottom = '';
  }
}

// Hàm xử lý cho thiết bị di động
function adjustMobileDropdownPosition(content, dropdown, shouldDropUp) {
  if (!dropdown) return;
  
  const contentRect = content.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  
  // Đặt position cho dropdown để nó vẫn theo chiều dọc
  dropdown.style.position = 'absolute';
  
  // Bỏ các thiết lập có thể làm thu nhỏ kích thước
  dropdown.style.maxWidth = 'none';
  dropdown.style.width = 'auto';
  
  // Đảm bảo chiều rộng của dropdown không bị thu nhỏ
  const dropdownWidth = dropdown.offsetWidth;
  dropdown.style.width = dropdownWidth + 'px';
  
  // Xử lý theo chiều dọc dựa vào vị trí
  if (shouldDropUp) {
    // Chỉ áp dụng drop-up cho khu vực được chỉ định
    dropdown.style.top = 'auto';
    dropdown.style.bottom = '100%';
  } else {
    // Các khu vực khác giữ nguyên mặc định: hiển thị phía dưới
    dropdown.style.top = '100%';
    dropdown.style.bottom = 'auto';
  }
  
  // Giữ nguyên vị trí theo chiều ngang của dropdown
  dropdown.style.left = '0';
  dropdown.style.transform = 'none';
  
  // Kiểm tra nếu dropdown bị tràn ra ngoài màn hình
  const dropdownRect = dropdown.getBoundingClientRect();
  
  if (dropdownRect.right > viewportWidth) {
    // Nếu bị tràn ra ngoài bên phải, căn lề phải
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
  
  // Đảm bảo dropdown không vượt quá bên trái màn hình
  if (dropdownRect.left < 0) {
    dropdown.style.left = '0';
    dropdown.style.right = 'auto';
  }
}

// Thêm xử lý sự kiện resize để tái tính toán vị trí dropdown khi kích thước màn hình thay đổi
window.addEventListener('resize', function() {
  const visibleDropdowns = document.querySelectorAll('.dropdown-content-location:hover, .dropdown-content-location.active');
  visibleDropdowns.forEach(dropdown => {
    const parent = dropdown.closest('.dropdown-location');
    if (parent) {
      const shouldDropUp = parent.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
      
      // Kiểm tra lại điều kiện mobile sau khi resize
      if (isMobile()) {
        adjustMobileDropdownPosition(parent, dropdown, shouldDropUp);
      } else {
        adjustDesktopDropdownPosition(parent, dropdown, shouldDropUp);
      }
    }
  });
});
