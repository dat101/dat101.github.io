document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown-location");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            const dropdownContent = this.querySelector(".dropdown-content-location");

            if (dropdownContent) {
                // Reset vị trí để tính toán đúng
                dropdownContent.style.top = "";
                dropdownContent.style.bottom = "";
                dropdownContent.style.left = "";
                dropdownContent.style.right = "";

                const rect = dropdownContent.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                const spaceAbove = rect.top;

                // Căn trái/phải nếu tràn
                if (rect.left < 0) {
                    dropdownContent.style.left = "0";
                    dropdownContent.style.right = "auto";
                } else if (rect.right > window.innerWidth) {
                    dropdownContent.style.left = "auto";
                    dropdownContent.style.right = "0";
                }

                // Căn trên nếu không đủ không gian dưới
                if (spaceBelow < dropdownContent.offsetHeight && spaceAbove > dropdownContent.offsetHeight) {
                    dropdownContent.style.top = "auto";
                    dropdownContent.style.bottom = "100%";
                } else {
                    dropdownContent.style.top = "100%";
                    dropdownContent.style.bottom = "auto";
                }
            }
        });
    });

    // Xử lý riêng cho mobile
    if (window.innerWidth <= 768) {
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

            if (dropdownLeft < 0 || dropdownLeft > 0) {
                dropdownLeft = 0;
            }

            dropdown.style.left = dropdownLeft + 'px';
        }
    }
});
