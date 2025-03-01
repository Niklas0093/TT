document.addEventListener('DOMContentLoaded', function () {
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
    groupSizeInput.value = urlParams.get('group-size') || 6;
    tripTypeSelect.value = urlParams.get('trip-type') || "";
    priceSlider.value = urlParams.get('max-price') || priceSlider.max;
    priceValue.textContent = priceSlider.value;
    starsInput.value = urlParams.get('stars') || "";

    
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

            const initialCountry = urlParams.get('country') || "";
            countrySelect.value = initialCountry;
            console.log("🌍 Verfügbare Länder:", [...countries]);
            console.log("🌍 Gewähltes Land im Filter:", initialCountry);

            filterAndRenderHotels();
        })
        .catch(error => console.error("❌ Fehler beim Laden der Länder:", error));

    function filterAndRenderHotels() {
        console.log("✅ Filter wird angewendet...");

        const startDate = startDateInput.value || "";
        const endDate = endDateInput.value || "";
        const country = countrySelect.value || "";
        let groupSize = parseInt(groupSizeInput.value) || 6;
        const tripType = tripTypeSelect.value || "";
        const maxPrice = parseInt(priceSlider.value) || 500;
        const minStars = parseInt(starsInput.value) || 0;
        const poolChecked = poolCheckbox.checked;
        const fitnessChecked = fitnessCheckbox.checked;

        console.log(`🔍 Aktuelle Filter:
            Startdatum: ${startDate}
            Enddatum: ${endDate}
            Land: ${country}
            Gruppengröße: ${groupSize}
            Art der Reise: ${tripType}
            Maximaler Preis: ${maxPrice}
            Mindeststerne: ${minStars}
            Pool: ${poolChecked}
            Fitnessstudio: ${fitnessChecked}`);

        if (groupSize < 6) {
            groupSize = 6;
            groupSizeInput.value = 6;
        }

        fetch("assets/data/hotels.json")
            .then(response => response.json())
            .then(data => {
                const filteredHotels = data.hotels.filter(hotel => {
                    const matchesCountry = !country || hotel.country.toLowerCase() === country.toLowerCase();
                    const matchesTripType = !tripType || hotel.trip_types.includes(tripType);
                    const matchesPrice = hotel.price <= maxPrice;
                    const matchesStars = hotel.stars >= minStars;
                    const matchesPool = !poolChecked || hotel.facilities.includes("Pool");
                    const matchesFitness = !fitnessChecked || hotel.facilities.includes("Fitnessstudio");
                    const matchesRooms = hasEnoughAvailableRooms(hotel, groupSize, startDate, endDate);

                    console.log(`🏨 Überprüfung: ${hotel.name} 
                        Land: ${hotel.country} (${matchesCountry})
                        Art der Reise: ${hotel.trip_types} (${matchesTripType})
                        Preis: ${hotel.price} (${matchesPrice})
                        Sterne: ${hotel.stars} (${matchesStars})
                        Pool: ${matchesPool}
                        Fitnessstudio: ${matchesFitness}
                        Verfügbare Zimmer: ${matchesRooms}`);

                    return (
                        matchesCountry &&
                        matchesTripType &&
                        matchesPrice &&
                        matchesStars &&
                        matchesPool &&
                        matchesFitness &&
                        matchesRooms
                    );
                });

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
                    start_date: startDateInput.value || "",
                    end_date: endDateInput.value || "",
                    group_size: groupSizeInput.value || 6,
                    country: countrySelect.value || "",
                    trip_type: tripTypeSelect.value || "",
                }).toString();

                return `
                    <div class="relative bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 transition-transform transform hover:scale-105">
                        <img src="${hotel.image}" class="w-full h-64 object-cover rounded-lg mb-4">
                        <h3 class="text-xl font-bold text-white mb-2">${hotel.name}</h3>
                        <p class="text-gray-400">📍 ${hotel.location}, ${hotel.country}</p>
                        <p class="text-gray-400">⭐ ${hotel.stars} Sterne | 🏆 ${hotel.rating.toFixed(1)}</p>
                        <p class="text-gray-400">💰 ${hotel.price}€ p.P./Nacht</p>
                        <p class="text-gray-400 mb-2">🏊‍♂️ Ausstattung: ${hotel.facilities?.join(", ") || "Keine Angaben"}</p>
                        <button class="details-btn bg-primary text-white px-4 py-2 rounded-lg w-full mt-2" 
                            onclick="window.location.href='hotel-overview.html?${params}'">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                    </div>
                `;
            }).join('');
    }

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

    priceSlider.addEventListener("input", function () {
        priceValue.textContent = this.value;
        filterAndRenderHotels();
    });
});
