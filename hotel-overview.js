document.addEventListener("DOMContentLoaded", function () {
    console.log("hotel-overview.js geladen!");

    const params = new URLSearchParams(window.location.search);
    const hotelId = params.get("hotel_id");
    console.log("Gefundene hotel_id:", hotelId);

    if (!hotelId) {
        console.error("Fehler: Keine Hotel-ID in der URL!");
        document.body.innerHTML = "<h1 class='text-center text-3xl text-white mt-10'>Fehler: Keine Hotel-ID</h1>";
        return;
    }

    fetch("assets/data/hotels.json")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP-Fehler: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const hotels = data.hotels;
            const hotel = hotels.find(h => h.hotel_id == hotelId);

            if (hotel) {
                console.log("Gefundenes Hotel:", hotel);

                // Setze den Hotelnamen als Seitentitel
                document.title = `${hotel.name} - Hotel Übersicht`;

                document.getElementById("hotel-name").textContent = hotel.name;
                document.getElementById("hotel-image").src = hotel.image;
                document.getElementById("hotel-image").alt = hotel.name;
                document.getElementById("hotel-location").textContent = `📍 ${hotel.location}`;
                document.getElementById("hotel-price").textContent = `💰 ${hotel.price_per_person_per_night}€ p.P./Nacht`;
                document.getElementById("hotel-description").textContent = hotel.description;

                // Sterne als FontAwesome-Icons anzeigen
                const starsContainer = document.getElementById("hotel-stars");
                starsContainer.innerHTML = "";
                for (let i = 0; i < hotel.stars; i++) {
                    const starIcon = document.createElement("i");
                    starIcon.classList.add("fas", "fa-star", "text-yellow-400");
                    starsContainer.appendChild(starIcon);
                }
            } else {
                console.error("Hotel nicht in der JSON-Datei gefunden!");
                document.body.innerHTML = "<h1 class='text-center text-3xl text-white mt-10'>Hotel nicht gefunden</h1>";
            }
        })
        .catch(error => {
            console.error("Fehler beim Laden der Hotel-Daten:", error);
            document.body.innerHTML = `<h1 class='text-center text-3xl text-white mt-10'>Fehler beim Laden der Hotel-Daten</h1><p class='text-center text-red-500'>${error.message}</p>`;
        });
});
