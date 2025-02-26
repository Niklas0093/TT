document.addEventListener('DOMContentLoaded', function() {
    console.log("search-results.js wurde geladen!");

    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get('start-date') || "Nicht angegeben";
    const endDate = urlParams.get('end-date') || "Nicht angegeben";
    const country = urlParams.get('country') || "";
    const groupSize = urlParams.get('group-size') || "Nicht angegeben";
    const tripType = urlParams.get('trip-type') || "";

    // Suchkriterien anzeigen
    const searchCriteria = document.getElementById('search-criteria');
    searchCriteria.innerHTML = `
        <p><strong>Startdatum:</strong> ${startDate}</p>
        <p><strong>Enddatum:</strong> ${endDate}</p>
        <p><strong>Land:</strong> ${country || 'Nicht angegeben'}</p>
        <p><strong>Gruppengröße:</strong> ${groupSize}</p>
        <p><strong>Art der Reise:</strong> ${tripType || 'Nicht angegeben'}</p>
    `;

    let hotelsData = [];

    fetch("assets/data/hotels.json")
        .then(response => response.json())
        .then(data => {
            hotelsData = data.hotels;
            renderHotels(hotelsData);
        })
        .catch(error => console.error("Fehler beim Laden der Hotels:", error));

    function renderHotels(hotels) {
        const resultsContainer = document.getElementById("search-results");
        resultsContainer.innerHTML = "";

        if (hotels.length === 0) {
            resultsContainer.innerHTML = "<p class='text-white text-center'>Keine passenden Hotels gefunden.</p>";
        } else {
            hotels.forEach(hotel => {
                resultsContainer.innerHTML += `
                    <div class="relative bg-gray-900 bg-opacity-90 p-6 shadow-xl rounded-2xl border border-gray-700 transition-transform transform hover:scale-105 hover:border-gray-500">
                        <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-64 object-cover rounded-lg mb-4">
                        <h3 class="font-bold text-xl text-white mb-2">${hotel.name}</h3>
                        <p class="text-gray-400 mb-2">📍 ${hotel.location}, ${hotel.country}</p>
                        <p class="text-gray-400 mb-2">⭐ ${hotel.stars} Sterne | 🏆 ${hotel.rating.toFixed(1)}</p>
                        <p class="text-gray-400 mb-2">💰 ${hotel.price}€ p.P./Nacht</p>
                        <p class="text-gray-400 mb-4">🏊‍♂️ Ausstattung: ${hotel.facilities.join(", ")}</p>
                        <button class="details-btn bg-primary text-white px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors" data-hotel-id="${hotel.hotel_id}">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                    </div>
                `;
            });
        }
    }

    document.getElementById("apply-filters").addEventListener("click", function() {
        const maxPrice = document.getElementById("price-filter").value;
        const minStars = document.getElementById("stars-filter").value;
        const poolChecked = document.getElementById("pool-filter").checked;
        const fitnessChecked = document.getElementById("fitness-filter").checked;

        const filteredHotels = hotelsData.filter(hotel =>
            (maxPrice === "" || hotel.price <= maxPrice) &&
            (minStars === "" || hotel.stars >= minStars) &&
            (!poolChecked || hotel.facilities.includes("Pool")) &&
            (!fitnessChecked || hotel.facilities.includes("Fitnessstudio"))
        );

        renderHotels(filteredHotels);
    });
});
