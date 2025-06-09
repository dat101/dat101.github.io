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
        // Xác định xem dropdown nằm trong vùng cần áp dụng kích thước cố định hay không
        const isInSpecialArea = this.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
        
        // Chỉ áp dụng điều chỉnh vị trí đặc biệt nếu là thiết bị di động
        if (isMobile()) {
          adjustMobileDropdownPosition(this, dropdownContent, isInSpecialArea);
        } else {
          // Trên desktop giữ cách hoạt động mặc định
          adjustDesktopDropdownPosition(this, dropdownContent, isInSpecialArea);
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
        const isInSpecialArea = content.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
        adjustMobileDropdownPosition(content, dropdown, isInSpecialArea);
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

// Hàm xử lý cho thiết bị desktop - giữ phong cách cơ bản
function adjustDesktopDropdownPosition(content, dropdown, isInSpecialArea) {
  if (!dropdown) return;
  
  // Chỉ áp dụng kích thước cố định và cuộn nếu trong khu vực đặc biệt
  if (isInSpecialArea) {
    dropdown.style.position = 'absolute';
    dropdown.style.top = '100%';
    dropdown.style.bottom = 'auto';
    dropdown.style.maxHeight = '200px'; // Chiều cao cố định
    dropdown.style.overflowY = 'auto'; // Cho phép cuộn dọc
    dropdown.style.overflowX = 'hidden'; // Ẩn cuộn ngang
    dropdown.style.width = 'auto';
    dropdown.style.minWidth = '200px'; // Chiều rộng tối thiểu
  } else {
    // Các khu vực khác giữ nguyên mặc định
    dropdown.style.top = '';
    dropdown.style.bottom = '';
    dropdown.style.maxHeight = '';
    dropdown.style.overflowY = '';
    dropdown.style.overflowX = '';
  }
}

// Hàm xử lý cho thiết bị di động
function adjustMobileDropdownPosition(content, dropdown, isInSpecialArea) {
  if (!dropdown) return;
  
  const contentRect = content.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Đặt position cho dropdown
  dropdown.style.position = 'absolute';
  dropdown.style.top = '100%'; // Luôn hiển thị phía dưới
  dropdown.style.bottom = 'auto';
  
  // Chỉ áp dụng kích thước cố định và cuộn nếu trong khu vực đặc biệt
  if (isInSpecialArea) {
    // Thiết lập kích thước cố định và cuộn
    const maxHeight = Math.min(250, viewportHeight - contentRect.bottom - 20); // Tối đa 250px hoặc khoảng trống còn lại
    dropdown.style.maxHeight = maxHeight + 'px';
    dropdown.style.overflowY = 'auto'; // Cho phép cuộn dọc
    dropdown.style.overflowX = 'hidden'; // Ẩn cuộn ngang
    
    // Đảm bảo chiều rộng của dropdown không bị thu nhỏ
    dropdown.style.width = 'auto';
    dropdown.style.minWidth = '200px'; // Chiều rộng tối thiểu
    dropdown.style.maxWidth = 'none';
    
    // Thêm style cho scrollbar (tùy chọn)
    dropdown.style.scrollbarWidth = 'thin'; // Firefox
    dropdown.style.scrollbarColor = '#888 #f1f1f1'; // Firefox
    
    // Webkit scrollbar styling
    if (!dropdown.classList.contains('custom-scrollbar')) {
      dropdown.classList.add('custom-scrollbar');
      
      // Thêm CSS cho scrollbar nếu chưa có
      if (!document.getElementById('dropdown-scrollbar-style')) {
        const style = document.createElement('style');
        style.id = 'dropdown-scrollbar-style';
        style.textContent = `
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `;
        document.head.appendChild(style);
      }
    }
  } else {
    // Các khu vực khác - bỏ các thiết lập có thể làm thu nhỏ kích thước
    dropdown.style.maxWidth = 'none';
    dropdown.style.width = 'auto';
    
    // Đảm bảo chiều rộng của dropdown không bị thu nhỏ
    const dropdownWidth = dropdown.offsetWidth;
    dropdown.style.width = dropdownWidth + 'px';
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
      const isInSpecialArea = parent.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
      
      // Kiểm tra lại điều kiện mobile sau khi resize
      if (isMobile()) {
        adjustMobileDropdownPosition(parent, dropdown, isInSpecialArea);
      } else {
        adjustDesktopDropdownPosition(parent, dropdown, isInSpecialArea);
      }
    }
  });
});
