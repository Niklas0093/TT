document.addEventListener('DOMContentLoaded', function() {
    console.log("🔍 search-results.js wurde geladen!");

    const urlParams = new URLSearchParams(window.location.search);

    // Referenzen auf die Filter-Elemente
    const startDateInput = document.getElementById('filter-start-date');
    const endDateInput = document.getElementById('filter-end-date');
    const countrySelect = document.getElementById('filter-country');
    const groupSizeInput = document.getElementById('filter-group-size');
    const tripTypeSelect = document.getElementById('filter-trip-type');
    const priceSlider = document.getElementById('price-filter');
    const priceValue = document.getElementById('price-value');
    const starsInput = document.getElementById('stars-filter');
    const poolCheckbox = document.getElementById('pool-filter');
    const fitnessCheckbox = document.getElementById('fitness-filter');

    // Werte aus URL übernehmen (falls vorhanden)
    startDateInput.value = urlParams.get('start-date') || "";
    endDateInput.value = urlParams.get('end-date') || "";
    countrySelect.value = urlParams.get('country') || "";
    groupSizeInput.value = urlParams.get('group-size') || 6;
    tripTypeSelect.value = urlParams.get('trip-type') || "";
    priceSlider.value = urlParams.get('max-price') || priceSlider.max;
    priceValue.textContent = priceSlider.value; // Preisanzeige aktualisieren
    starsInput.value = urlParams.get('stars') || "";
    
    // Funktion: Setze Placeholder für leere Datumsfelder
    function updateDatePlaceholder(input, placeholderText) {
        if (!input.value) {
            input.classList.add("placeholder-active");
            input.setAttribute("data-placeholder", placeholderText);
            input.type = "text"; 
            input.value = placeholderText;
        }
    }

    function removePlaceholder(input) {
        if (input.classList.contains("placeholder-active")) {
            input.classList.remove("placeholder-active");
            input.value = "";
            input.type = "date";
        }
    }

    // Setze Platzhalter falls kein Datum eingegeben wurde
    updateDatePlaceholder(startDateInput, "Startdatum");
    updateDatePlaceholder(endDateInput, "Enddatum");

    startDateInput.addEventListener("focus", () => removePlaceholder(startDateInput));
    endDateInput.addEventListener("focus", () => removePlaceholder(endDateInput));

    startDateInput.addEventListener("blur", () => updateDatePlaceholder(startDateInput, "Startdatum"));
    endDateInput.addEventListener("blur", () => updateDatePlaceholder(endDateInput, "Enddatum"));

    // Dynamische Länder-Dropdown-Befüllung
    fetch("assets/data/hotels.json")
        .then(response => response.json())
        .then(data => {
            const countries = new Set();
            data.hotels.forEach(hotel => countries.add(hotel.country));

            countries.forEach(country => {
                let option = document.createElement("option");
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });

            countrySelect.value = urlParams.get('country') || "";
        })
        .catch(error => console.error("❌ Fehler beim Laden der Länder:", error));

    function filterAndRenderHotels() {
        console.log("✅ Filter wird angewendet...");

        const startDate = startDateInput.value.includes("Startdatum") ? "" : startDateInput.value;
        const endDate = endDateInput.value.includes("Enddatum") ? "" : endDateInput.value;
        const country = countrySelect.value;
        let groupSize = parseInt(groupSizeInput.value);
        const tripType = tripTypeSelect.value;
        const maxPrice = parseInt(priceSlider.value);
        const minStars = parseInt(starsInput.value) || 0;
        const poolChecked = poolCheckbox.checked;
        const fitnessChecked = fitnessCheckbox.checked;

        // Gruppengröße darf nicht unter 6 fallen
        if (!groupSize || groupSize < 6) {
            groupSize = 6;
            groupSizeInput.value = 6;
        }

        fetch("assets/data/hotels.json")
            .then(response => response.json())
            .then(data => {
                const filteredHotels = data.hotels.filter(hotel =>
                    (country === "" || hotel.country === country) &&
                    (tripType === "" || hotel.trip_types.includes(tripType)) &&
                    (hotel.price <= maxPrice) &&
                    (hotel.stars >= minStars) &&
                    (!poolChecked || hotel.facilities.includes("Pool")) &&
                    (!fitnessChecked || hotel.facilities.includes("Fitnessstudio")) &&
                    hasEnoughAvailableRooms(hotel, groupSize, startDate, endDate)
                );

                renderHotels(filteredHotels);
            })
            .catch(error => console.error("❌ Fehler beim Filtern der Hotels:", error));
    }

    function hasEnoughAvailableRooms(hotel, groupSize, startDate, endDate) {
        if (!startDate || !endDate) {
            return true;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        let availableRooms = hotel.rooms.filter(room =>
            !room.booked_periods.some(period => {
                const bookedStart = new Date(period.start);
                const bookedEnd = new Date(period.end);
                return !(end <= bookedStart || start >= bookedEnd);
            })
        ).length;

        return availableRooms >= groupSize;
    }

    function renderHotels(hotels) {
        const resultsContainer = document.getElementById("search-results");
        resultsContainer.innerHTML = hotels.length === 0 ? 
            "<p class='text-white text-center'>🚫 Keine passenden Hotels gefunden.</p>" :
            hotels.map(hotel => {
                const params = new URLSearchParams({
                    hotel_id: hotel.hotel_id,
                    start_date: document.getElementById("filter-start-date").value || "",
                    end_date: document.getElementById("filter-end-date").value || "",
                    group_size: document.getElementById("filter-group-size").value || 6,
                    country: document.getElementById("filter-country").value || "",
                    trip_type: document.getElementById("filter-trip-type").value || "",
                }).toString();
    
                return `
                    <div class="relative bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 transition-transform transform hover:scale-105">
                        <img src="${hotel.image}" class="w-full h-64 object-cover rounded-lg mb-4">
                        <h3 class="text-xl font-bold text-white mb-2">${hotel.name}</h3>
                        <p class="text-gray-400">📍 ${hotel.location}, ${hotel.country}</p>
                        <p class="text-gray-400">⭐ ${hotel.stars} Sterne | 🏆 ${hotel.rating.toFixed(1)}</p>
                        <p class="text-gray-400">💰 ${hotel.price}€ p.P./Nacht</p>
                        <p class="text-gray-400 mb-2">🏊‍♂️ Ausstattung: ${hotel.facilities.join(", ")}</p>
                        <button class="details-btn bg-primary text-white px-4 py-2 rounded-lg w-full mt-2" 
                            onclick="window.location.href='hotel-overview.html?${params}'">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                    </div>
                `;
            }).join('');
    }
    

    // Automatische Filteraktualisierung bei Änderungen
    const filterElements = [
        "filter-start-date",
        "filter-end-date",
        "filter-country",
        "filter-group-size",
        "filter-trip-type",
        "price-filter",
        "stars-filter",
        "pool-filter",
        "fitness-filter"
    ];

    filterElements.forEach(id => {
        document.getElementById(id).addEventListener("change", filterAndRenderHotels);
    });

    // Preis-Slider live aktualisieren
    priceSlider.addEventListener("input", function () {
        priceValue.textContent = this.value;
        filterAndRenderHotels();
    });

    // Initiale Filteranwendung beim Laden der Seite
    filterAndRenderHotels();
});
