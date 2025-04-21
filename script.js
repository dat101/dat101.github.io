document.addEventListener("DOMContentLoaded", function () {
  // Xử lý overflow chiều ngang cho tất cả các dropdown
  const dropdowns = document.querySelectorAll(".dropdown-location");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("mouseenter", function () {
      const dropdownContent = this.querySelector(".dropdown-content-location");
      if (dropdownContent) {
        // Xác định xem dropdown có nằm trong khu vực cần áp dụng drop-up không
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
        // Xác định xem dropdown có nằm trong khu vực cần áp dụng drop-up không
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
              // Xác định xem dropdown có nằm trong khu vực cần áp dụng drop-up không
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
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  // Xử lý overflow theo chiều ngang
  let dropdownLeft = contentRect.left - 20;
  if (dropdownLeft + dropdownRect.width > viewportWidth) {
    dropdownLeft = viewportWidth - dropdownRect.width - 40;
  }
  // Ép giá trị left về 0 nếu nhỏ hơn 0
  if (dropdownLeft < 0) {
    dropdownLeft = 0;
  }
  dropdown.style.left = dropdownLeft + 'px';
  
  // Xử lý theo chiều dọc dựa vào vị trí
  if (shouldDropUp) {
    // Khu vực được chỉ định luôn hiển thị dropdown hướng lên trên
    dropdown.style.top = 'auto';
    dropdown.style.bottom = '100%';
  } else {
    // Mặc định: hiển thị phía dưới
    dropdown.style.top = '';
    dropdown.style.bottom = '';
  }
}

// Thêm xử lý sự kiện resize để tái tính toán vị trí dropdown khi kích thước màn hình thay đổi
window.addEventListener('resize', function() {
  const visibleDropdowns = document.querySelectorAll('.dropdown-content-location:hover, .dropdown-content-location.active');
  visibleDropdowns.forEach(dropdown => {
    const parent = dropdown.closest('.dropdown-location');
    if (parent) {
      // Xác định xem dropdown có nằm trong khu vực cần áp dụng drop-up không
      const shouldDropUp = parent.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
      adjustDropdownPosition(parent, dropdown, shouldDropUp);
    }
  });
});
