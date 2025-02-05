function adjustDropdownPosition(content, dropdown) {
    const contentRect = content.getBoundingClientRect();
    const dropdownRect = dropdown.getBoundingClientRect();
    
    let dropdownLeft = contentRect.left; // Vị trí mặc định

    // Nếu dropdown bị tràn ra bên phải, dịch chuyển sang trái
    if (dropdownLeft + dropdownRect.width > window.innerWidth) {
        dropdownLeft = contentRect.right - dropdownRect.width;
    }

    // Nếu dropdown bị tràn ra bên trái, giữ nó trong viewport
    if (dropdownLeft < 0) {
        dropdownLeft = 0;
    }

    dropdown.style.left = dropdownLeft + 'px';
}

// Áp dụng sự kiện cho tất cả dropdown-location
document.querySelectorAll('.dropdown-location').forEach(content => {
    const dropdown = content.querySelector('.dropdown-content-location');

    content.addEventListener('mouseenter', () => {
        adjustDropdownPosition(content, dropdown);
        dropdown.style.display = 'block';
    });

    content.addEventListener('mouseleave', () => {
        dropdown.style.display = 'none';
    });
});

// Xử lý khi scroll (tránh lỗi dropdown không cập nhật vị trí)
document.querySelectorAll('.scrollable').forEach(scrollable => {
    scrollable.addEventListener('scroll', () => {
        document.querySelectorAll('.dropdown-location').forEach(content => {
            const dropdown = content.querySelector('.dropdown-content-location');
            adjustDropdownPosition(content, dropdown);
        });
    });
});
