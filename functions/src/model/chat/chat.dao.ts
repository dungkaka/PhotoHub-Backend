import {firestoreRef} from "../../config/firebase";

class chatDAO {
    private static chatRef = firestoreRef.collection("chat");

    static getAllChatRoomOfUser = async (id: string) => {
        const chatRoomSnapshot = await chatDAO.chatRef
            .where(`user.id`, "==", id)
            .orderBy("createdAt", "asc")
            .get();

        const result = [];
        for (let doc of chatRoomSnapshot.docs) {
            result.push({...doc.data(), id: doc.id})
        }
        return result;
    };

    static deactivateChatRoom = async (roomId: string) => {
        const roomRef =  chatDAO.chatRef.doc(roomId);
        await roomRef.update({
            active: false,
        });
        return {
            message: "Deactivate chat room successfully !"
        }
    };

    static getActiveChatRoomOfUser = async (id: string) => {
        const chatRoomSnapshot = await chatDAO.chatRef
            .where(`user.id`, "==", id)
            .where(`active`, "==", true)
            .orderBy("createdAt", "asc")
            .get();

        const result = [];
        for (let doc of chatRoomSnapshot.docs) {
            result.push({...doc.data(), id: doc.id})
        }
        return result;
    };

    static getInActiveChatRoomOfUser = async (id: string) => {
        const chatRoomSnapshot = await chatDAO.chatRef
            .where(`user.id`, "==", id)
            .where(`active`, "==", false)
            .orderBy("createdAt", "asc")
            .get();

        const result = [];
        for (let doc of chatRoomSnapshot.docs) {
            result.push({...doc.data(), id: doc.id})
        }
        return result;
    };


    static deleteChatRoom = async (roomId: string) => {
        await chatDAO.chatRef.doc(roomId).delete();
        return {
            message: "Delete chat room successfully !"
        }
    }


}

export default chatDAO;