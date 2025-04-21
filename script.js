document.addEventListener("DOMContentLoaded", function () {
  // Xử lý overflow chiều ngang cho tất cả các dropdown
  const dropdowns = document.querySelectorAll(".dropdown-location");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("mouseenter", function () {
      const dropdownContent = this.querySelector(".dropdown-content-location");
      if (dropdownContent) {
        // Xác định xem dropdown nằm trong vùng cần áp dụng drop-up hay không
        const shouldDropUp = this.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
        adjustDropdownPosition(this, dropdownContent, shouldDropUp);
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
        adjustDropdownPosition(content, dropdown, shouldDropUp);
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
              adjustDropdownPosition(content, dropdown, shouldDropUp);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  });
}

function adjustDropdownPosition(content, dropdown, shouldDropUp) {
  if (!dropdown) return;
  
  const contentRect = content.getBoundingClientRect();
  const dropdownRect = dropdown.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  
  // Đặt position cho dropdown để nó vẫn theo chiều dọc nhưng cố định theo chiều ngang
  dropdown.style.position = 'absolute';
  
  // Cố định vị trí theo chiều ngang bằng cách thiết lập left: 50% và transform: translateX(-50%)
  dropdown.style.left = '50%';
  dropdown.style.transform = 'translateX(-50%)';
  
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
  
  // Kiểm tra nếu dropdown bị tràn ra ngoài màn hình
  const updatedRect = dropdown.getBoundingClientRect();
  if (updatedRect.right > viewportWidth) {
    // Nếu bị tràn ra ngoài bên phải, điều chỉnh lại
    const adjustment = updatedRect.right - viewportWidth + 10; // thêm 10px padding
    dropdown.style.transform = `translateX(calc(-50% - ${adjustment}px))`;
  } else if (updatedRect.left < 0) {
    // Nếu bị tràn ra ngoài bên trái, điều chỉnh lại
    const adjustment = 0 - updatedRect.left + 10; // thêm 10px padding
    dropdown.style.transform = `translateX(calc(-50% + ${adjustment}px))`;
  }
}

// Thêm xử lý sự kiện resize để tái tính toán vị trí dropdown khi kích thước màn hình thay đổi
window.addEventListener('resize', function() {
  const visibleDropdowns = document.querySelectorAll('.dropdown-content-location:hover, .dropdown-content-location.active');
  visibleDropdowns.forEach(dropdown => {
    const parent = dropdown.closest('.dropdown-location');
    if (parent) {
      const shouldDropUp = parent.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
      adjustDropdownPosition(parent, dropdown, shouldDropUp);
    }
  });
});
