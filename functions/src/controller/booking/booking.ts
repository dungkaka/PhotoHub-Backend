import Controller from "../../interfaces/controller.interface";
import * as express from 'express';
import authMiddleware from "../../middleware/auth.middleware";
import RequestWithUser from "../../interfaces/requestUser.interface";
import authPhotographerMiddleware from "../../middleware/auth.photographer.middleware";
import BookingDAO from "../../model/booking/booking.dao";
import BookingService from "../../services/booking/booking.service";

const geohash = require('ngeohash');


class Booking implements Controller {
    path = "";
    router = express.Router();

    constructor() {
        // @ts-ignore
        this.router.post(`${this.path}/photographers/set-location`, authMiddleware, authPhotographerMiddleware, this.setLocation);
        // @ts-ignore
        this.router.post(`${this.path}/booking/search`, authMiddleware, this.searchRadiusLocation);
    }

    private searchRadiusLocation = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const locationDTO = request.body;

        try {
            const { latitude, longitude } = locationDTO.coords;
            const range = BookingService.getGeohashRange(latitude, longitude, 5/1.6);
            const resultSearch = await BookingDAO.searchRadiusLocation(range);

            response.status(200).send(JSON.stringify({
                status: true,
                locations: resultSearch,
                range: range,
            }, null, '\t'));
        } catch (error) {
            next(error);
        }
    };

    private setLocation = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const location = request.body;
        const user = request.user;

        try {
            // @ts-ignore
            const photographer = {
                photographerId: user.id,
                photographerInfor: {
                    age: user.age,
                    email: user.email,
                    gender: user.gender,
                    name: user.name ? user.name: user.username,
                },
            };

            const geoHash = geohash.encode(location.latitude, location.longitude);
            const locationSet = await BookingDAO.setLocation(photographer, location, geoHash);

            response.status(200).send(JSON.stringify({
                status: true,
                location: locationSet,
            }, null, '\t'));

        } catch (error) {
            next(error);
        }
    }

}

export default Booking;