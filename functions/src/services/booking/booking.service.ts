const geohash = require('ngeohash');

class BookingService {

    static getGeohashRange = (
        latitude: number,
        longitude: number,
        distance: number, // miles
    ) => {
        const lat = 0.0144927536231884; // degrees latitude per mile
        const lon = 0.0181818181818182; // degrees longitude per mile

        const lowerLat = latitude - lat * distance;
        const lowerLon = longitude - lon * distance;

        const upperLat = latitude + lat * distance;
        const upperLon = longitude + lon * distance;

        const lower = geohash.encode(lowerLat, lowerLon);
        const upper = geohash.encode(upperLat, upperLon);

        return {
            lower,
            upper
        };
    };
}

export default BookingService;