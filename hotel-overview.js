document.addEventListener("DOMContentLoaded", function () {
    console.log("🛎 hotel-overview.js geladen!");

    const params = new URLSearchParams(window.location.search);
    const hotelId = params.get("hotel_id");
    const startDate = params.get("start_date") || "Nicht angegeben";
    const endDate = params.get("end_date") || "Nicht angegeben";
    const groupSize = params.get("group_size") || "Nicht angegeben";
    const tripType = params.get("trip_type") || "Nicht angegeben";

    console.log("🏨 Hotel-ID:", hotelId);
    console.log("📅 Zeitraum:", startDate, "bis", endDate);
    console.log("👥 Gruppengröße:", groupSize);
    console.log("🎯 Art der Reise:", tripType);

    if (!hotelId) {
        console.error("❌ Keine Hotel-ID gefunden!");
        document.body.innerHTML = "<h1 class='text-center text-3xl text-white mt-10'>❌ Fehler: Keine Hotel-ID</h1>";
        return;
    }

    fetch("assets/data/hotels.json")
        .then(response => response.json())
        .then(data => {
            const hotel = data.hotels.find(h => h.hotel_id == hotelId);

            if (hotel) {
                document.title = `${hotel.name} - Hotel Übersicht`;

                document.getElementById("hotel-name").textContent = hotel.name;
                document.getElementById("hotel-image").src = hotel.image;
                document.getElementById("hotel-image").alt = hotel.name;
                document.getElementById("hotel-location").textContent = `📍 ${hotel.location}, ${hotel.country}`;
                document.getElementById("hotel-price").textContent = `💰 ${hotel.price}€ p.P./Nacht`;
                document.getElementById("hotel-description").textContent = hotel.description;

                // Sterne setzen
                const starsContainer = document.getElementById("hotel-stars");
                starsContainer.innerHTML = "⭐".repeat(hotel.stars);

                // Falls Suchparameter vorhanden sind, zeige Buchungsdetails
                if (params.has("start_date")) {
                    document.getElementById("booking-details").classList.remove("hidden");
                    document.getElementById("booking-dates").textContent = `${startDate} bis ${endDate}`;
                    document.getElementById("booking-group-size").textContent = groupSize;
                    document.getElementById("booking-trip-type").textContent = tripType;
                }

                // Buchungs-Button setzt die richtigen Parameter
                const bookingButton = document.getElementById("booking-button");
                const bookingParams = new URLSearchParams({
                    hotel_id: hotelId,
                    start_date: startDate,
                    end_date: endDate,
                    group_size: groupSize,
                    trip_type: tripType
                }).toString();
                bookingButton.href = `booking.html?${bookingParams}`;

            } else {
                console.error("❌ Hotel nicht gefunden!");
                document.body.innerHTML = "<h1 class='text-center text-3xl text-white mt-10'>❌ Hotel nicht gefunden</h1>";
            }
        })
        .catch(error => {
            console.error("❌ Fehler beim Laden der Hotel-Daten:", error);
            document.body.innerHTML = `<h1 class='text-center text-3xl text-white mt-10'>❌ Fehler beim Laden der Hotel-Daten</h1><p class='text-center text-red-500'>${error.message}</p>`;
        });
});
