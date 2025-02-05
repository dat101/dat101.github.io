function isMobile() {
    return window.innerWidth <= 1024; // Thay đổi giá trị này nếu cần
}

if (isMobile()) {
    // Đăng ký sự kiện cho tất cả các phần tử có class 'dropdown-location'
    document.querySelectorAll('.dropdown-location').forEach(content => {
        const dropdown = content.querySelector('.dropdown-content-location');

        content.addEventListener('mouseenter', () => {
            adjustDropdownPosition(content, dropdown);
        });
    });

    // Đăng ký sự kiện cuộn cho tất cả các phần tử có class 'scrollable'
    document.querySelectorAll('.scrollable').forEach(scrollable => {
        scrollable.addEventListener('scroll', () => {
            document.querySelectorAll('.dropdown-location').forEach(content => {
                const dropdown = content.querySelector('.dropdown-content-location');
                adjustDropdownPosition(content, dropdown);
            });
        });
    });

    function adjustDropdownPosition(content, dropdown) {
        const contentRect = content.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();

        let dropdownLeft = contentRect.left - 20;

        // Điều chỉnh nếu dropdown bị ra ngoài viewport bên phải
        if (dropdownLeft + dropdownRect.width > window.innerWidth) {
            dropdownLeft = window.innerWidth - dropdownRect.width - 40;
        }

        // Điều chỉnh nếu dropdown bị ra ngoài viewport bên trái
        if (dropdownLeft < 0) {
            dropdownLeft = 0;
        }

        dropdown.style.left = dropdownLeft + 'px';
    }
}
