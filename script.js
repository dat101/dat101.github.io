document.addEventListener("DOMContentLoaded", function () {
  // Xử lý chức năng drop-up cho khu vực chỉ định, hoạt động trên mọi màn hình
  const dropdowns = document.querySelectorAll(".dropdown-location");
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener("mouseenter", function () {
      const dropdownContent = this.querySelector(".dropdown-content-location");
      if (dropdownContent) {
        // Kiểm tra xem có thuộc khu vực cần drop-up không
        const inDropUpArea = this.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
        if (inDropUpArea) {
          // Áp dụng drop-up cho khu vực đặc biệt trên mọi màn hình
          dropdownContent.style.top = 'auto';
          dropdownContent.style.bottom = '100%';
        } else if (isMobile()) {
          // Các vùng khác chỉ xử lý khi là mobile
          adjustDropdownPosition(this, dropdownContent);
        }
      }
    });
  });
});

function isMobile() {
  return window.innerWidth <= 768;
}

// Các chức năng khác chỉ áp dụng cho mobile
if (isMobile()) {
  document.querySelectorAll('.dropdown-location').forEach(content => {
    const dropdown = content.querySelector('.dropdown-content-location');
    if (dropdown) {
      content.addEventListener('mouseenter', () => {
        const inDropUpArea = content.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
        if (inDropUpArea) {
          // Áp dụng drop-up cho khu vực đặc biệt
          dropdown.style.top = 'auto';
          dropdown.style.bottom = '100%';
        } else {
          // Xử lý các khu vực khác theo cách thông thường
          adjustDropdownPosition(content, dropdown);
        }
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
              const inDropUpArea = content.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
              if (inDropUpArea) {
                // Áp dụng drop-up cho khu vực đặc biệt
                dropdown.style.top = 'auto';
                dropdown.style.bottom = '100%';
              } else {
                // Xử lý các khu vực khác theo cách thông thường
                adjustDropdownPosition(content, dropdown);
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

// Hàm này chỉ áp dụng cho các khu vực không phải drop-up và chỉ khi là mobile
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
  
  // Xử lý theo chiều dọc dựa vào vị trí
  const isInFooter = content.closest('.elementor-335 .elementor-element.elementor-element-110d384') !== null;
  
  if (isInFooter) {
    // Nếu ở footer, hiển thị dropdown hướng lên trên
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

// Thêm xử lý sự kiện resize
window.addEventListener('resize', function() {
  const visibleDropdowns = document.querySelectorAll('.dropdown-content-location:hover, .dropdown-content-location.active');
  visibleDropdowns.forEach(dropdown => {
    const parent = dropdown.closest('.dropdown-location');
    if (parent) {
      const inDropUpArea = parent.closest('.elementor-335 .elementor-element.elementor-element-34d62bad') !== null;
      if (inDropUpArea) {
        // Luôn áp dụng drop-up cho khu vực đặc biệt, không quan tâm kích thước màn hình
        dropdown.style.top = 'auto';
        dropdown.style.bottom = '100%';
      } else if (isMobile()) {
        // Chỉ áp dụng các chức năng khác cho mobile
        adjustDropdownPosition(parent, dropdown);
      }
    }
  });
});
