document.addEventListener("DOMContentLoaded", function () {
  // Xử lý overflow chiều ngang cho tất cả các dropdown
  const dropdowns = document.querySelectorAll(".dropdown-location");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("mouseenter", function () {
      const dropdownContent = this.querySelector(".dropdown-content-location");
      if (dropdownContent) {
        // Xác định xem dropdown nằm trong footer elementor hay không
        const isInFooter = this.closest('.elementor-335 .elementor-element.elementor-element-110d384') !== null;
        adjustDropdownPosition(this, dropdownContent, isInFooter);
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
        const isInFooter = content.closest('.elementor-335 .elementor-element.elementor-element-110d384') !== null;
        adjustDropdownPosition(content, dropdown, isInFooter);
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
              const isInFooter = content.closest('.elementor-335 .elementor-element.elementor-element-110d384') !== null;
              adjustDropdownPosition(content, dropdown, isInFooter);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  });
}

function adjustDropdownPosition(content, dropdown, isInFooter) {
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
  if (isInFooter) {
    // Nếu ở footer, luôn hiển thị dropdown hướng lên trên
    dropdown.style.top = 'auto';
    dropdown.style.bottom = '100%';
  } else {
    // Nếu không phải ở footer, kiểm tra không gian phía dưới
    const spaceBelow = viewportHeight - contentRect.bottom;
    const dropdownHeight = dropdownRect.height;
    
    // Nếu không đủ không gian phía dưới, hiển thị lên trên
    if (spaceBelow < dropdownHeight) {
      dropdown.style.top = 'auto';
      dropdown.style.bottom = '100%';
    } else {
      // Mặc định: hiển thị phía dưới
      dropdown.style.top = '';
      dropdown.style.bottom = '';
    }
  }
}

// Thêm xử lý sự kiện resize để tái tính toán vị trí dropdown khi kích thước màn hình thay đổi
window.addEventListener('resize', function() {
  const visibleDropdowns = document.querySelectorAll('.dropdown-content-location:hover, .dropdown-content-location.active');
  visibleDropdowns.forEach(dropdown => {
    const parent = dropdown.closest('.dropdown-location');
    if (parent) {
      const isInFooter = parent.closest('.elementor-335 .elementor-element.elementor-element-110d384') !== null;
      adjustDropdownPosition(parent, dropdown, isInFooter);
    }
  });
});
