document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown-location");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            const dropdownContent = this.querySelector(".dropdown-content-location");

            if (dropdownContent) {
                const rect = dropdownContent.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.top;
                const spaceAbove = rect.top;

                // 👉 Lật dropdown lên nếu không đủ chỗ bên dưới
                if (spaceBelow < rect.height && spaceAbove > rect.height) {
                    dropdownContent.style.top = "auto";
                    dropdownContent.style.bottom = "100%";
                } else {
                    dropdownContent.style.top = "100%";
                    dropdownContent.style.bottom = "auto";
                }

                // 👉 Xử lý tràn trái/phải
                if (rect.left < 0 || parseInt(dropdownContent.style.left) > 0) {
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

        function adjustDropdownPosition(content, dropdown) {
            if (!dropdown) return;

            const contentRect = content.getBoundingClientRect();
            const dropdownRect = dropdown.getBoundingClientRect();

            let dropdownLeft = contentRect.left - 20;

            if (dropdownLeft + dropdownRect.width > window.innerWidth) {
                dropdownLeft = window.innerWidth - dropdownRect.width - 40;
            }

            // Giới hạn left không âm và không lớn hơn 0 (căn lề trái màn hình)
            if (dropdownLeft < 0 || dropdownLeft > 0) {
                dropdownLeft = 0;
            }

            dropdown.style.left = dropdownLeft + 'px';
            dropdown.style.right = 'auto';

            // 👉 Lật dropdown lên nếu không đủ chỗ
            const spaceBelow = window.innerHeight - contentRect.bottom;
            const spaceAbove = contentRect.top;

            if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
                dropdown.style.top = 'auto';
                dropdown.style.bottom = content.offsetHeight + 'px';
            } else {
                dropdown.style.top = content.offsetHeight + 'px';
                dropdown.style.bottom = 'auto';
            }
        }
    }
});
