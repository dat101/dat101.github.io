document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown-location");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            const dropdownContent = this.querySelector(".dropdown-content-location");

            if (dropdownContent) {
                dropdownContent.style.left = "0";  // Mặc định căn trái
                dropdownContent.style.right = "auto";

                const rect = dropdownContent.getBoundingClientRect();
                const screenWidth = window.innerWidth;

                // Nếu dropdown bị tràn ra ngoài bên trái
                if (rect.left < 0) {
                    dropdownContent.style.left = "auto";
                    dropdownContent.style.right = "0";
                }
                
                // Nếu dropdown bị tràn ra ngoài bên phải
                if (rect.right > screenWidth) {
                    dropdownContent.style.left = "auto";
                    dropdownContent.style.right = "0";
                }
            }
        });
    });
});

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
