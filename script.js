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

                // Improved condition: drop-up if not enough space below OR if more space above
                const shouldDropUp = (spaceBelow < dropdownRect.height) || 
                                    (spaceBelow < spaceAbove && dropdownRect.height < spaceAbove);
                
                if (shouldDropUp) {
                    // Drop-up
                    dropdownContent.style.top = "auto";
                    dropdownContent.style.bottom = "100%";
                    console.log("Dropdown flipped up"); // Debug info
                } else {
                    // Drop-down
                    dropdownContent.style.top = "100%";
                    dropdownContent.style.bottom = "auto";
                }

                // Handle horizontal overflow
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

                // Reset visibility after positioning
                dropdownContent.style.visibility = '';
                dropdownContent.style.display = '';
            }
        });
    });

    // Mobile handling
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

        let dropdownLeft = contentRect.left;

        if (dropdownLeft + dropdownRect.width > window.innerWidth) {
            dropdownLeft = window.innerWidth - dropdownRect.width - 20;
        }

        dropdownLeft = Math.max(dropdownLeft, 0);

        dropdown.style.left = dropdownLeft + 'px';
        dropdown.style.right = 'auto';

        const spaceBelow = window.innerHeight - contentRect.bottom;
        const spaceAbove = contentRect.top;

        // Improved condition for mobile
        const shouldDropUp = (spaceBelow < dropdownRect.height) || 
                            (spaceBelow < spaceAbove && dropdownRect.height < spaceAbove);
        
        if (shouldDropUp) {
            dropdown.style.top = 'auto';
            dropdown.style.bottom = content.offsetHeight + 'px';
        } else {
            dropdown.style.top = content.offsetHeight + 'px';
            dropdown.style.bottom = 'auto';
        }

        // Reset visibility after positioning
        dropdown.style.visibility = '';
        dropdown.style.display = '';
    }

    function isMobile() {
        return window.innerWidth <= 768;
    }
});
