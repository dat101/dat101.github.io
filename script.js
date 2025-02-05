document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown-location");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            const dropdownContent = this.querySelector(".dropdown-content-location");

            if (dropdownContent && window.innerWidth > 1024) { // Chỉ áp dụng khi màn hình lớn hơn 1024px
                const rect = dropdownContent.getBoundingClientRect();

                // Nếu dropdown có chiều rộng dưới 400px thì căn phải
                if (rect.width < 200) {
                    dropdownContent.style.left = "auto";
                    dropdownContent.style.right = "0";
                } else {
                    // Xử lý khi tràn màn hình
                    if (rect.left < 0) {
                        dropdownContent.style.left = "auto";
                        dropdownContent.style.right = "0";
                    } else if (rect.right > window.innerWidth) {
                        dropdownContent.style.left = "auto";
                        dropdownContent.style.right = "0";
                    } else {
                        dropdownContent.style.left = "";
                        dropdownContent.style.right = "";
                    }
                }
            }
        });
    });
});

function isMobile() {
    return window.innerWidth <= 1024; // Thay đổi giá trị này nếu cần
}

if (isMobile()) {
    document.querySelectorAll('.dropdown-location').forEach(content => {
        const dropdown = content.querySelector('.dropdown-content-location');

        content.addEventListener('mouseenter', () => {
            adjustDropdownPosition(content, dropdown);
        });
    });

    // Thay vì sử dụng document.getElementById("scrollable"), ta dùng class
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
