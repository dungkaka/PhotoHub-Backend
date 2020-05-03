// import HttpException from "../../exception/HttpException";

import {firestoreRef} from "../../config/firebase";

class BookingDAO {
    private static locationsRef = firestoreRef.collection("location");


    static searchRadiusLocation = async (range: any) => {

        console.log("RANGE", range);
        const locationQuerySnapshot = await BookingDAO.locationsRef
            .where("geoHash", ">=", range.lower)
            .where("geoHash", "<=", range.upper)
            .get();

        const result = [];
        for (let doc of locationQuerySnapshot.docs) {
            console.log("DOC", doc);
            result.push({...doc.data(), id: doc.id})
        }

        return result;

    };

    static setLocation = async (photographer: any, location: any, geoHash: any) => {
        const locationQuerySnapshot = await BookingDAO.locationsRef.where("photographerId", "==", photographer.photographerId).get();

        if (locationQuerySnapshot.empty) {
            const locationRef = await BookingDAO.locationsRef.add({
                ...photographer, ...location, geoHash
            });
            const locationDocument = await locationRef.get();
            return {
                ...locationDocument.data()
            }
        } else {
            let locationDocument: any;
            for (let doc of locationQuerySnapshot.docs) {
                const locationRef = BookingDAO.locationsRef.doc(doc.id);
                const locationUpdate = await locationRef.update({
                    ...photographer, ...location, geoHash
                });
                locationDocument = locationUpdate;
            }
            return locationDocument;
        }
    }
}

export default BookingDAO;