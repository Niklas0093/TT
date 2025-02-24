document.addEventListener("DOMContentLoaded", function() {
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", function() {
            mobileMenu.classList.toggle("hidden");
        });
    }

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = mobileMenu.querySelectorAll("a");
    mobileMenuLinks.forEach(link => {
        link.addEventListener("click", function() {
            mobileMenu.classList.add("hidden");
        });
    });
});

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    this.reset();
    document.getElementById('success-message').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('success-message').classList.add('hidden');
    }, 3000);
});