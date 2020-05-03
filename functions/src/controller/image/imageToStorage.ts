import { admin } from "../../config/firebase";
import * as stream from "stream";
import { Buffer } from "buffer";
const UUID = require('uuid/v4');

const uploadPicture = function(base64: any, name: any) {
    return new Promise( (resolve, reject) => {
        if (!base64) {
            reject("news.provider#uploadPicture - Could not upload picture because at least one param is missing.");
        }

        let bufferStream = new stream.PassThrough();
        bufferStream.end(Buffer.from(base64, 'base64'));

        // Retrieve default storage bucket
        let bucket = admin.storage().bucket();

        let uuid = UUID();
        // Create a reference to the new image file
        let file = bucket.file(`news/${uuid}.jpg`);


        bufferStream.pipe(file.createWriteStream({
            metadata: {
                contentType: 'image/jpeg',
                metadata: {
                    firebaseStorageDownloadTokens: uuid,
                }
            }
        }))
            .on('error', error => {
                reject(`news.provider#uploadPicture - Error while uploading picture ${JSON.stringify(error)}`);
            })

            .on('finish', async () => {
                // The file upload is complete.
                const internalPath = file.name;
                console.log("InternalPath", internalPath);
                const urlImage = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid;
                const [metadata] = await bucket.file(`news/${uuid}.jpg`).getMetadata();

                bucket.file(`news/${uuid}.jpg`).getSignedUrl({
                    action: 'read',
                    expires: '11-11-2030'
                }, (error, url) => {
                    if (error) {
                        reject(`news.provider#uploadPicture - Error  ${JSON.stringify(error)}`);
                    }
                    resolve({
                        internalPath: internalPath,
                        metadata: metadata,
                        signedUrl: url,
                        url: urlImage,
                    })
                });
            });
    })
};


export default uploadPicture;