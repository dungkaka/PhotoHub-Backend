import {firestoreRef} from "../../config/firebase";
import HttpException from "../../exception/HttpException";

class ImageDAO {
    private static imagesRef = firestoreRef.collection("images");

    public static updateSizeOfImage = async () => {
        const probe = require('probe-image-size');
        const list = [];

        const imageQuertSnapshot = await ImageDAO.imagesRef.get();

        for (let doc of imageQuertSnapshot.docs) {
            const inforImage = await probe(doc.data().url);
            console.log(inforImage);

            const imageRef = ImageDAO.imagesRef.doc(doc.id);
            await imageRef.update({
                info: inforImage,
            });

            list.push(inforImage);
        }
        return list;

    }

    public static getPaginationImage = async (imageId: string) => {

        let imageDataQuerySnapshot;

        if (imageId) {
            const preImage
                = await ImageDAO
                .imagesRef
                .doc(imageId)
                .get();

            imageDataQuerySnapshot = await ImageDAO.imagesRef.startAfter(preImage).limit(40).get();

        } else {
            imageDataQuerySnapshot = await ImageDAO.imagesRef.limit(40).get();
        }

        const listImage: any[] = [];
        imageDataQuerySnapshot.forEach((doc) => {
            const tagsModel = doc.data().tags;
            const tagsArray = [];
            for (const field in tagsModel) {
                tagsArray.push(field);
            }
            listImage.push({...doc.data(), id: doc.id, tags: tagsArray});
        });

        return listImage;
    }

    public static deleteImage = async (image: any) => {
        const imgRef = ImageDAO.imagesRef.doc(image.id);

        if(imgRef) {
            await imgRef.delete();
        } else {
            throw new HttpException(400, "Image doesn't exist !");
        }

        return {
            message: "Delete image successfully !"
        }

    };

    public static addImage = async (images: any) => {
        try {
            const imageRef = await ImageDAO.imagesRef.add(images);
            const image = await imageRef.get();
            if(image) {
                const tagsArray = [];
                // @ts-ignore
                for (const field in image.data().tags) {
                    tagsArray.push(field);
                }
                return {...image.data(), id: image.id, tags: tagsArray};
            } else {
                throw new HttpException(400, "Can find image");
            }
        } catch (error) {
            throw new HttpException(400, error.message);
        }

    };

    public static getAllImage = async () => {
        const userDataQuerySnapshot = await ImageDAO.imagesRef.get();

        const listImage: any[] = [];
        userDataQuerySnapshot.forEach((doc) => {
            const tagsModel = doc.data().tags;
            const tagsArray = [];
            for (const field in tagsModel) {
                tagsArray.push(field);
            }
            listImage.push({...doc.data(), id: doc.id, tags: tagsArray});
        });

        return listImage;
    }

    public static getImageByTag = async (tags: any[]) => {
        let imageDataQuery: any = ImageDAO.imagesRef;

        tags.forEach(tag => {
            if (tag !== false && tag !== "") {
                imageDataQuery = imageDataQuery.where(`tags.${tag}`, "==", true);
            }
        });

        const imageList = await imageDataQuery.get();

        const listImage: any[] = [];
        imageList.forEach((doc: any) => {
            const tagsModel = doc.data().tags;
            const tagsArray = [];
            for (const field in tagsModel) {
                tagsArray.push(field);
            }
            listImage.push({...doc.data(), tags: tagsArray, id: doc.id});
        });

        return listImage;
    }

    public static getPaginationImageByTag = async (tags: any[], imageId: string) => {
        let imageList: any;

        let imageDataQuery: any = ImageDAO.imagesRef;
        tags.forEach(tag => {
            if (tag !== false && tag !== "") {
                imageDataQuery = imageDataQuery.where(`tags.${tag}`, "==", true);
            }
        });

        if(imageId) {
            const preImage
                = await ImageDAO
                .imagesRef
                .doc(imageId)
                .get();

            imageList = await imageDataQuery.startAfter(preImage).limit(40).get();
        } else {
            imageList = await imageDataQuery.limit(40).get();
        }

        const listImage: any[] = [];
        imageList.forEach((doc: any) => {
            const tagsModel = doc.data().tags;
            const tagsArray = [];
            for (const field in tagsModel) {
                tagsArray.push(field);
            }
            listImage.push({...doc.data(), tags: tagsArray, id: doc.id});
        });

        return listImage;
    }

    public static likeImage = async (userId: string, imageId: any) => {
        const imageRef = ImageDAO.imagesRef.doc(imageId);
        const image = await imageRef.get();

        if(image) {
            // @ts-ignore
            let like_by = image.data().like_by;
            // @ts-ignore
            let likes = image.data().likes;

            if (!like_by.includes(userId)) {
                like_by.push(userId);
                likes += 1;

                await imageRef.set({
                    // like_by: admin.firestore.FieldValue.arrayUnion("user_2"),
                    // likes: admin.firestore.FieldValue.increment(1),
                    like_by,
                    likes,
                }, {merge: true});

                return {
                    message: "Completed like image !"
                };
            } else {
                return {
                    message: "User already like this image"
                };
            }
        } else {
            throw new HttpException(400, "Image can not found");
        }
    }

    public static unLikeImage = async (userId: string, imageId: any) => {
        const imageRef = ImageDAO.imagesRef.doc(imageId);
        const image = await imageRef.get();

        if(image) {
            // @ts-ignore
            let like_by = image.data().like_by;
            // @ts-ignore
            let likes = image.data().likes;

            if (like_by.includes(userId)) {
                like_by = like_by.filter((item: any) => {
                    return item !== userId;
                });
                likes -= 1;

                await imageRef.set({
                    // like_by: admin.firestore.FieldValue.arrayUnion("user_2"),
                    // likes: admin.firestore.FieldValue.increment(1),
                    like_by,
                    likes,
                }, {merge: true});

                return {
                    message: "Completed unlike image !"
                };
            } else {
                return {
                    message: "User have not like this image yet"
                };
            }
        } else {
            throw new HttpException(400, "Image can not found");
        }
    }

    public static updateImage = async (image: any) => {
        const imageRef = ImageDAO.imagesRef.doc(image.id);

        if(imageRef) {
            await imageRef.set(image, {
                merge: true,
            })
        } else {
            throw new HttpException(400, "Image doesn't exist !");
        }

        return {
            message: "Update image successfully !"
        }
    }

    public static updateThumbnailofImage = async (filePath: any, thumb_url: any) => {
        console.log("compare", filePath);
        const tagsQuerySnapshot =  await ImageDAO.imagesRef.where("internalPath", "==", filePath).get();

        for (let doc of tagsQuerySnapshot.docs) {
            try {

                await ImageDAO.updateImage({id: doc.id, thumbnail_url: thumb_url});
            } catch (error) {
                console.log(error);
            }
        }
        return;
    }


}

export default ImageDAO;