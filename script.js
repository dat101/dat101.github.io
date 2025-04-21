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
  const viewportHeight = window.innerHeight;
  
  // Đặt dropdown ở vị trí fixed
  dropdown.style.position = 'fixed';
  
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
    // Chỉ áp dụng drop-up cho khu vực được chỉ định
    dropdown.style.top = 'auto';
    dropdown.style.bottom = (viewportHeight - contentRect.top) + 'px';
  } else {
    // Các khu vực khác hiển thị phía dưới
    dropdown.style.top = contentRect.bottom + 'px';
    dropdown.style.bottom = 'auto';
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

// Thêm xử lý sự kiện scroll để cập nhật vị trí của dropdown khi trang được cuộn
window.addEventListener('scroll', function() {
  const visibleDropdowns = document.querySelectorAll('.dropdown-content-location:hover, .dropdown-content-location.active');
  if (visibleDropdowns.length > 0) {
    visibleDropdowns.forEach(dropdown => {
      const parent = dropdown.closest('.dropdown-location');
      if (parent) {
        const shouldDropUp = parent.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
        adjustDropdownPosition(parent, dropdown, shouldDropUp);
      }
    });
  }
}, { passive: true });
