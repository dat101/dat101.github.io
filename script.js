document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown-location");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            const dropdownContent = this.querySelector(".dropdown-content-location");

            if (dropdownContent) {
                showDropdownTemporarily(dropdownContent);

                const dropdownRect = dropdownContent.getBoundingClientRect();
                const parentRect = dropdown.getBoundingClientRect();
                const spaceBelow = window.innerHeight - parentRect.bottom;
                const spaceAbove = parentRect.top;

                // 👉 Lật dropdown lên nếu không đủ chỗ bên dưới
                if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
                    dropdownContent.style.top = "auto";
                    dropdownContent.style.bottom = "100%";
                } else {
                    dropdownContent.style.top = "100%";
                    dropdownContent.style.bottom = "auto";
                }

                // 👉 Xử lý tràn trái/phải
                if (dropdownRect.left < 0) {
                    dropdownContent.style.left = "0";
                    dropdownContent.style.right = "auto";
                } else if (dropdownRect.right > window.innerWidth) {
                    dropdownContent.style.left = "auto";
                    dropdownContent.style.right = "0";
                } else {
                    dropdownContent.style.left = "";
                    dropdownContent.style.right = "";
                }

                resetDropdownStyle(dropdownContent);
            }
        });
    });

    // 👇 Chạy thêm cho mobile nếu cần
    if (isMobile()) {
        document.querySelectorAll('.scrollable').forEach(scrollable => {
            let ticking = false;
            scrollable.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        dropdowns.forEach(content => {
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

    // 👇 Hàm xử lý vị trí dropdown chính xác
    function adjustDropdownPosition(content, dropdown) {
        if (!dropdown) return;

        showDropdownTemporarily(dropdown);

        const contentRect = content.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();

        let dropdownLeft = contentRect.left;

        if (dropdownLeft + dropdownRect.width > window.innerWidth) {
            dropdownLeft = window.innerWidth - dropdownRect.width - 20;
        }

        dropdownLeft = Math.max(dropdownLeft, 0);

        dropdown.style.left = dropdownLeft + 'px';
        dropdown.style.right = 'auto';

        const spaceBelow = window.innerHeight - contentRect.bottom;
        const spaceAbove = contentRect.top;

        if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
            dropdown.style.top = 'auto';
            dropdown.style.bottom = content.offsetHeight + 'px';
        } else {
            dropdown.style.top = content.offsetHeight + 'px';
            dropdown.style.bottom = 'auto';
        }

        resetDropdownStyle(dropdown);
    }

    // 👇 Tạm thời hiển thị dropdown để đo kích thước
    function showDropdownTemporarily(el) {
        el.dataset.originalDisplay = el.style.display || '';
        el.style.visibility = 'hidden';
        el.style.display = 'block';
    }

    // 👇 Khôi phục lại style sau khi đo
    function resetDropdownStyle(el) {
        el.style.visibility = '';
        el.style.display = el.dataset.originalDisplay || '';
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }
});
