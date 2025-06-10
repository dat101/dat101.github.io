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
  
  // Đảm bảo dropdown có z-index cao và không bị clip
  dropdown.style.zIndex = '9999';
  dropdown.style.position = 'absolute';
  
  // Reset overflow cho parent elements
  resetParentOverflow(dropdown);
  
  // Trên desktop, chỉ xử lý chiều dọc (drop-up) nếu cần
  if (shouldDropUp) {
    dropdown.style.top = 'auto';
    dropdown.style.bottom = '100%';
    dropdown.style.marginBottom = '0px';
  } else {
    dropdown.style.top = '100%';
    dropdown.style.bottom = 'auto';
    dropdown.style.marginTop = '0px';
  }
}

// Hàm xử lý cho thiết bị di động
function adjustMobileDropdownPosition(content, dropdown, shouldDropUp) {
  if (!dropdown) return;
  
  const contentRect = content.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Đặt position cho dropdown với z-index cao
  dropdown.style.position = 'absolute';
  dropdown.style.zIndex = '9999';
  
  // Reset overflow cho parent elements
  resetParentOverflow(dropdown);
  
  // Bỏ các thiết lập có thể làm thu nhỏ kích thước
  dropdown.style.maxWidth = 'none';
  dropdown.style.width = 'auto';
  
  // Đảm bảo chiều rộng của dropdown không bị thu nhỏ
  const dropdownWidth = dropdown.offsetWidth;
  dropdown.style.width = dropdownWidth + 'px';
  
  // Xử lý theo chiều dọc dựa vào vị trí và không gian có sẵn
  if (shouldDropUp) {
    // Kiểm tra xem có đủ không gian phía trên không
    const spaceAbove = contentRect.top;
    const dropdownHeight = dropdown.offsetHeight;
    
    if (spaceAbove >= dropdownHeight + 10) {
      // Đủ không gian phía trên
      dropdown.style.top = 'auto';
      dropdown.style.bottom = '100%';
      dropdown.style.marginBottom = '2px';
    } else {
      // Không đủ không gian phía trên, hiển thị phía dưới
      dropdown.style.top = '100%';
      dropdown.style.bottom = 'auto';
      dropdown.style.marginTop = '2px';
    }
  } else {
    // Kiểm tra xem có đủ không gian phía dưới không
    const spaceBelow = viewportHeight - contentRect.bottom;
    const dropdownHeight = dropdown.offsetHeight;
    
    if (spaceBelow >= dropdownHeight + 10) {
      // Đủ không gian phía dưới
      dropdown.style.top = '100%';
      dropdown.style.bottom = 'auto';
      dropdown.style.marginTop = '2px';
    } else {
      // Không đủ không gian phía dưới, hiển thị phía trên
      dropdown.style.top = 'auto';
      dropdown.style.bottom = '100%';
      dropdown.style.marginBottom = '2px';
    }
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

// Hàm reset overflow cho các parent elements
function resetParentOverflow(element) {
  let parent = element.parentElement;
  const parentsToCheck = [];
  
  // Tìm tất cả parent elements cho đến document body
  while (parent && parent !== document.body) {
    parentsToCheck.push(parent);
    parent = parent.parentElement;
  }
  
  // Kiểm tra và sửa overflow hidden của parents
  parentsToCheck.forEach(parentEl => {
    const computedStyle = window.getComputedStyle(parentEl);
    
    // Nếu parent có overflow hidden, tạm thời set thành visible
    if (computedStyle.overflow === 'hidden' || 
        computedStyle.overflowY === 'hidden' || 
        computedStyle.overflowX === 'hidden') {
      
      // Lưu giá trị ban đầu nếu chưa lưu
      if (!parentEl.dataset.originalOverflow) {
        parentEl.dataset.originalOverflow = computedStyle.overflow;
        parentEl.dataset.originalOverflowX = computedStyle.overflowX;
        parentEl.dataset.originalOverflowY = computedStyle.overflowY;
      }
      
      // Set overflow visible tạm thời
      parentEl.style.overflow = 'visible';
    }
    
    // Kiểm tra position static và set relative nếu cần
    if (computedStyle.position === 'static') {
      if (!parentEl.dataset.originalPosition) {
        parentEl.dataset.originalPosition = 'static';
      }
      parentEl.style.position = 'relative';
    }
  });
}

// Hàm restore overflow cho parents khi dropdown ẩn
function restoreParentOverflow(element) {
  let parent = element.parentElement;
  
  while (parent && parent !== document.body) {
    // Restore overflow nếu đã được lưu
    if (parent.dataset.originalOverflow) {
      parent.style.overflow = parent.dataset.originalOverflow;
      delete parent.dataset.originalOverflow;
      delete parent.dataset.originalOverflowX;
      delete parent.dataset.originalOverflowY;
    }
    
    // Restore position nếu đã được lưu
    if (parent.dataset.originalPosition) {
      parent.style.position = parent.dataset.originalPosition;
      delete parent.dataset.originalPosition;
    }
    
    parent = parent.parentElement;
  }
}

// Thêm event listener để restore overflow khi dropdown ẩn
document.querySelectorAll('.dropdown-location').forEach(dropdown => {
  dropdown.addEventListener('mouseleave', function() {
    const dropdownContent = this.querySelector('.dropdown-content-location');
    if (dropdownContent) {
      // Restore parent overflow sau một khoảng thời gian ngắn
      setTimeout(() => {
        restoreParentOverflow(dropdownContent);
      }, 100);
    }
  });
});

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
