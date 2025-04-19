document.addEventListener("DOMContentLoaded", function () {
  // Xử lý overflow chiều ngang cho tất cả các dropdown
  const dropdowns = document.querySelectorAll(".dropdown-location");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("mouseenter", function () {
      const dropdownContent = this.querySelector(".dropdown-content-location");
      if (dropdownContent) {
        adjustDropdownPosition(this, dropdownContent);
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
        adjustDropdownPosition(content, dropdown);
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
              adjustDropdownPosition(content, dropdown);
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  });
}

function adjustDropdownPosition(content, dropdown) {
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
  
  // Xử lý overflow theo chiều dọc
  const spaceBelow = viewportHeight - contentRect.bottom;
  const spaceAbove = contentRect.top;
  const dropdownHeight = dropdownRect.height;
  
  // Nếu không đủ không gian phía dưới nhưng có đủ không gian phía trên
  if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
    // Hiển thị dropdown phía trên thay vì phía dưới
    dropdown.style.top = 'auto';
    dropdown.style.bottom = '100%';
    dropdown.style.position = 'absolute';
  } else if (spaceBelow < dropdownHeight && spaceAbove < dropdownHeight) {
    // Nếu cả trên và dưới đều không đủ chỗ, đặt dropdown ở vị trí tốt nhất có thể
    const topPosition = Math.max(10, Math.min(viewportHeight - dropdownHeight - 10, contentRect.bottom));
    dropdown.style.top = topPosition + 'px';
    dropdown.style.bottom = 'auto';
    dropdown.style.position = 'fixed';
    dropdown.style.left = dropdownLeft + 'px';
  } else {
    // Mặc định: hiển thị phía dưới
    dropdown.style.top = '';
    dropdown.style.bottom = '';
    dropdown.style.position = '';
  }
  
  // Đảm bảo dropdown luôn hiển thị trên viewport
  setTimeout(() => {
    const updatedRect = dropdown.getBoundingClientRect();
    if (updatedRect.bottom > viewportHeight) {
      const adjustedTop = Math.max(0, viewportHeight - updatedRect.height - 10);
      dropdown.style.top = adjustedTop + 'px';
      dropdown.style.bottom = 'auto';
      dropdown.style.position = 'fixed';
    }
  }, 0);
  
  // Thêm class để xử lý transition và animation nếu cần
  dropdown.classList.add('dropdown-positioned');
}

// Thêm xử lý sự kiện resize để tái tính toán vị trí dropdown khi kích thước màn hình thay đổi
window.addEventListener('resize', function() {
  const visibleDropdowns = document.querySelectorAll('.dropdown-content-location:hover, .dropdown-content-location.active');
  visibleDropdowns.forEach(dropdown => {
    const parent = dropdown.closest('.dropdown-location');
    if (parent) {
      adjustDropdownPosition(parent, dropdown);
    }
  });
});
