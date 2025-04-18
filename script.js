document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown-location");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            const dropdownContent = this.querySelector(".dropdown-content-location");

            if (dropdownContent) {
                // Force display temporarily to measure actual size
                dropdownContent.style.visibility = 'hidden';
                dropdownContent.style.display = 'block';
                
                const dropdownRect = dropdownContent.getBoundingClientRect();
                const parentRect = dropdown.getBoundingClientRect();
                const spaceBelow = window.innerHeight - parentRect.bottom;
                const spaceAbove = parentRect.top;
                
                console.log("Space above:", spaceAbove, "Space below:", spaceBelow, "Dropdown height:", dropdownRect.height);

                // Chọn hướng có nhiều không gian hơn
                if (spaceBelow >= spaceAbove) {
                    // Hiển thị bên dưới nếu có đủ không gian
                    if (spaceBelow >= dropdownRect.height) {
                        // Đủ không gian bên dưới
                        dropdownContent.style.top = "100%";
                        dropdownContent.style.bottom = "auto";
                        dropdownContent.style.maxHeight = spaceBelow - 10 + "px"; // Để lại 10px margin
                    } else {
                        // Không đủ không gian bên dưới, hiển thị tối đa có thể và cho phép scroll
                        dropdownContent.style.top = "100%";
                        dropdownContent.style.bottom = "auto";
                        dropdownContent.style.maxHeight = spaceBelow - 10 + "px";
                        dropdownContent.style.overflowY = "auto";
                    }
                } else {
                    // Hiển thị bên trên nếu có đủ không gian
                    if (spaceAbove >= dropdownRect.height) {
                        // Đủ không gian bên trên
                        dropdownContent.style.bottom = "100%";
                        dropdownContent.style.top = "auto";
                        dropdownContent.style.maxHeight = spaceAbove - 10 + "px";
                    } else {
                        // Không đủ không gian bên trên, hiển thị tối đa có thể và cho phép scroll
                        dropdownContent.style.bottom = "100%";
                        dropdownContent.style.top = "auto";
                        dropdownContent.style.maxHeight = spaceAbove - 10 + "px";
                        dropdownContent.style.overflowY = "auto";
                    }
                }

                // Xử lý tràn trái/phải
                const horizontalSpace = window.innerWidth;
                if (dropdownRect.left < 0) {
                    dropdownContent.style.left = "0";
                    dropdownContent.style.right = "auto";
                    // Giới hạn chiều rộng nếu bị tràn phải
                    if (dropdownRect.width > horizontalSpace) {
                        dropdownContent.style.maxWidth = horizontalSpace - 20 + "px";
                    }
                } else if (dropdownRect.right > horizontalSpace) {
                    // Nếu bị tràn phải, điều chỉnh vị trí trái
                    const newLeft = Math.max(0, horizontalSpace - dropdownRect.width - 20);
                    dropdownContent.style.left = newLeft + "px";
                    dropdownContent.style.right = "auto";
                    
                    // Nếu vẫn quá rộng
                    if (dropdownRect.width > horizontalSpace) {
                        dropdownContent.style.maxWidth = horizontalSpace - 20 + "px";
                    }
                }

                // Đảm bảo có scroll khi nội dung bị cắt
                if (dropdownContent.scrollHeight > dropdownContent.clientHeight) {
                    dropdownContent.style.overflowY = "auto";
                }

                // Reset visibility sau khi đã định vị
                dropdownContent.style.visibility = '';
            }
        });
    });

    // Xử lý cho mobile
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

    function adjustDropdownPosition(content, dropdown) {
        if (!dropdown) return;

        // Force display temporarily to measure
        dropdown.style.visibility = 'hidden';
        dropdown.style.display = 'block';

        const contentRect = content.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        const spaceBelow = window.innerHeight - contentRect.bottom;
        const spaceAbove = contentRect.top;

        // Tính toán vị trí ngang
        let dropdownLeft = contentRect.left;
        const horizontalSpace = window.innerWidth;

        if (dropdownLeft + dropdownRect.width > horizontalSpace) {
            dropdownLeft = horizontalSpace - dropdownRect.width - 20;
        }

        dropdownLeft = Math.max(dropdownLeft, 0);
        dropdown.style.left = dropdownLeft + 'px';
        dropdown.style.right = 'auto';

        // Chọn hướng có nhiều không gian hơn
        if (spaceBelow >= spaceAbove) {
            if (spaceBelow >= dropdownRect.height) {
                dropdown.style.top = content.offsetHeight + 'px';
                dropdown.style.bottom = 'auto';
                dropdown.style.maxHeight = spaceBelow - 10 + "px";
            } else {
                dropdown.style.top = content.offsetHeight + 'px';
                dropdown.style.bottom = 'auto';
                dropdown.style.maxHeight = spaceBelow - 10 + "px";
                dropdown.style.overflowY = "auto";
            }
        } else {
            if (spaceAbove >= dropdownRect.height) {
                dropdown.style.bottom = content.offsetHeight + 'px';
                dropdown.style.top = 'auto';
                dropdown.style.maxHeight = spaceAbove - 10 + "px";
            } else {
                dropdown.style.bottom = content.offsetHeight + 'px';
                dropdown.style.top = 'auto';
                dropdown.style.maxHeight = spaceAbove - 10 + "px";
                dropdown.style.overflowY = "auto";
            }
        }

        // Đảm bảo có scroll khi nội dung bị cắt
        if (dropdown.scrollHeight > dropdown.clientHeight) {
            dropdown.style.overflowY = "auto";
        }

        // Nếu bị tràn phải, điều chỉnh chiều rộng
        if (dropdownRect.width > horizontalSpace) {
            dropdown.style.maxWidth = horizontalSpace - 20 + "px";
        }

        // Reset visibility
        dropdown.style.visibility = '';
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }
});
