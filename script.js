document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown-location");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("mouseenter", function () {
            const dropdownContent = this.querySelector(".dropdown-content-location");

            if (dropdownContent) {
                const rect = dropdownContent.getBoundingClientRect();

                // Kiểm tra nếu tràn bên trái hoặc có giá trị left > 0
                if (rect.left < 0 || parseInt(dropdownContent.style.left) > 0) {
                    dropdownContent.style.left = "auto";
                    dropdownContent.style.right = "0";
                } 
                // Kiểm tra nếu tràn bên phải
                else if (rect.right > window.innerWidth) {
                    dropdownContent.style.left = "auto";
                    dropdownContent.style.right = "0";
                } 
                else {
                    dropdownContent.style.left = "";
                    dropdownContent.style.right = "";
                }
            }
        });
    });
});

function isMobile() {
    return window.innerWidth <= 1024; 
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

        // Ép giá trị left về 0 nếu lớn hơn 0
        if (dropdownLeft < 0 || dropdownLeft > 0) {
            dropdownLeft = 0;
        }

        dropdown.style.left = dropdownLeft + 'px';
    }
}
