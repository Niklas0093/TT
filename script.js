document.addEventListener("DOMContentLoaded", function() {
    // Mobile Menü öffnen/schließen
    const mobileMenuButton = document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener("click", function() {
            mobileMenu.classList.toggle("hidden");
        });

        // Schließt das Menü, wenn ein Link angeklickt wird
        const mobileMenuLinks = mobileMenu.querySelectorAll("a");
        mobileMenuLinks.forEach(link => {
            link.addEventListener("click", function() {
                mobileMenu.classList.add("hidden");
            });
        });
    }

    // Kontaktformular-Handling mit Bestätigungsmeldung
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            this.reset();
            document.getElementById('success-message').classList.remove('hidden');
            setTimeout(() => {
                document.getElementById('success-message').classList.add('hidden');
            }, 3000);
        });
    }

    // Hotel-Details Buttons leiten zur richtigen Seite weiter
    const buttons = document.querySelectorAll(".details-btn");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const hotelId = this.getAttribute("data-hotel-id");
            window.location.href = `hotel-overview.html?hotel_id=${hotelId}`;
        });
    });

    // Dynamische Länderauswahl in der Suchmaske
    const countrySelect = document.getElementById("country");
    if (countrySelect) {
        fetch("assets/data/hotels.json")
            .then(response => response.json())
            .then(data => {
                const countries = new Set();
                data.hotels.forEach(hotel => {
                    countries.add(hotel.country);
                });

                countries.forEach(country => {
                    let option = document.createElement("option");
                    option.value = country;
                    option.textContent = country;
                    countrySelect.appendChild(option);
                });
            })
            .catch(error => console.error("Fehler beim Laden der Hotels:", error));
    }

    // Gruppengröße darf nicht unter 6 sein
    const groupSizeInput = document.getElementById("group-size");
    if (groupSizeInput) {
        groupSizeInput.addEventListener("change", function () {
            if (this.value < 6) {
                this.value = 6;
            }
        });
    }
});
