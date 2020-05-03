import App from './app';
import AuthenticationController from "./controller/account/authenication";
import "reflect-metadata";
import ImageQuery from "./controller/image/image";
import * as functions from "firebase-functions";
import Collection from "./controller/collection/collection";
import Tag from "./controller/tag/tag";
import Booking from "./controller/booking/booking";
import Chat from "./controller/chat/chat";

const app = new App(
    [
        new AuthenticationController(),
        new ImageQuery(),
        new Collection(),
        new Tag(),
        new Booking(),
        new Chat(),
    ],
);


exports.webApi = functions.https.onRequest(app.app);
export * from './storage-trigger/storage';
