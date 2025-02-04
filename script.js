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
