document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown-location");

    dropdowns.forEach(dropdown => {
        // Kiểm tra xem dropdown có thuộc tính force-direction hay không
        const forceDirection = dropdown.getAttribute("data-direction") || "auto";
        
        dropdown.addEventListener("mouseenter", function () {
            const dropdownContent = this.querySelector(".dropdown-content-location");

            if (dropdownContent) {
                // Đặt display để có thể đo lường kích thước thực tế
                dropdownContent.style.visibility = 'hidden';
                dropdownContent.style.display = 'block';
                
                const dropdownRect = dropdownContent.getBoundingClientRect();
                const parentRect = dropdown.getBoundingClientRect();
                const spaceBelow = window.innerHeight - parentRect.bottom;
                const spaceAbove = parentRect.top;
                
                // Xử lý hiển thị dựa trên hướng được chỉ định
                if (forceDirection === "up" || 
                    (forceDirection === "auto" && spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height)) {
                    // Luôn hiển thị dropdown phía trên
                    dropdownContent.style.top = "auto";
                    dropdownContent.style.bottom = "100%";
                    dropdownContent.classList.add("dropdown-up");
                    dropdownContent.classList.remove("dropdown-down");
                } else {
                    // Mặc định hiển thị phía dưới
                    dropdownContent.style.top = "100%";
                    dropdownContent.style.bottom = "auto";
                    dropdownContent.classList.add("dropdown-down");
                    dropdownContent.classList.remove("dropdown-up");
                }

                // Xử lý tràn trái/phải
                if (dropdownRect.left < 0) {
                    dropdownContent.style.left = "0";
                    dropdownContent.style.right = "auto";
                } else if (dropdownRect.right > window.innerWidth) {
                    dropdownContent.style.left = "auto";
                    dropdownContent.style.right = "0";
                }

                // Reset visibility
                dropdownContent.style.visibility = '';
            }
        });
    });

    // Mobile handling tương tự
    if (isMobile()) {
        document.querySelectorAll('.scrollable').forEach(scrollable => {
            let ticking = false;
            scrollable.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        dropdowns.forEach(content => {
                            const dropdown = content.querySelector('.dropdown-content-location');
                            if (dropdown) {
                                const forceDirection = content.getAttribute("data-direction") || "auto";
                                adjustDropdownPosition(content, dropdown, forceDirection);
                            }
                        });
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        });
    }

    function adjustDropdownPosition(content, dropdown, forceDirection) {
        if (!dropdown) return;

        // Temporarily force display for measurement
        dropdown.style.visibility = 'hidden';
        dropdown.style.display = 'block';

        const contentRect = content.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();

        // Xử lý vị trí ngang
        let dropdownLeft = contentRect.left;
        if (dropdownLeft + dropdownRect.width > window.innerWidth) {
            dropdownLeft = window.innerWidth - dropdownRect.width - 20;
        }
        dropdownLeft = Math.max(dropdownLeft, 0);
        dropdown.style.left = dropdownLeft + 'px';
        dropdown.style.right = 'auto';

        // Xử lý vị trí dọc dựa trên hướng được chỉ định
        const spaceBelow = window.innerHeight - contentRect.bottom;
        const spaceAbove = contentRect.top;
        
        if (forceDirection === "up" || 
            (forceDirection === "auto" && spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height)) {
            dropdown.style.top = 'auto';
            dropdown.style.bottom = content.offsetHeight + 'px';
            dropdown.classList.add("dropdown-up");
            dropdown.classList.remove("dropdown-down");
        } else {
            dropdown.style.top = content.offsetHeight + 'px';
            dropdown.style.bottom = 'auto';
            dropdown.classList.add("dropdown-down");
            dropdown.classList.remove("dropdown-up");
        }

        // Reset visibility
        dropdown.style.visibility = '';
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }
});
