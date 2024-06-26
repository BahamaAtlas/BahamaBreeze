// API key
const windyApiKey = 'RMa21z9qCe9LrPlRm0rxE49vfIA9VIcV';

// Initialize the Windy API
windyInit({
    key: windyApiKey,
    lat: 25.0343,
    lon: -77.3963,
    zoom: 7,
    overlay: 'wind'
}, windyAPI => {
    const { map } = windyAPI;
    
    // Function to get color based on wind speed
    function getColorForSpeed(speed) {
        if (speed <= 10) return 'lightblue';
        if (speed <= 20) return 'green';
        if (speed <= 30) return 'yellow';
        return 'red';
    }
    
    // Add wind data to the map
    function addWindDataToMap() {
        fetch(`https://api.windy.com/api/point-forecast/v2?lat=25.0343&lon=-77.3963&model=ecmwf&parameters=wind`)
            .then(response => response.json())
            .then(data => {
                data.wind.map(windPoint => {
                    const color = getColorForSpeed(windPoint.speed);
                    const arrow = L.polylineDecorator(L.polyline([
                        [windPoint.lat, windPoint.lon],
                        [windPoint.lat + 0.1 * Math.cos(windPoint.direction), windPoint.lon + 0.1 * Math.sin(windPoint.direction)]
                    ]), {
                        patterns: [
                            { offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 15, pathOptions: { color: color } }) }
                        ]
                    }).addTo(map);
                });
            });
    }
    
    // Initial load
    addWindDataToMap();
    
    // Refresh every hour
    setInterval(addWindDataToMap, 3600000);
});
