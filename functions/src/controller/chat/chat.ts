import Controller from "../../interfaces/controller.interface";
import * as express from 'express';
import authMiddleware from "../../middleware/auth.middleware";
import RequestWithUser from "../../interfaces/requestUser.interface";
import chatDAO from "../../model/chat/chat.dao";

class Chat implements Controller {
    path = "";
    router = express.Router();

    constructor() {
        // @ts-ignore
        this.router.get(`${this.path}/chats`, authMiddleware, this.getAllChatRoomOfUser);
        // @ts-ignore
        this.router.delete(`${this.path}/chats/:roomId`, authMiddleware, this.deleteChatRoom);
        // @ts-ignore
        this.router.put(`${this.path}/chats/:roomId/deactivate`, authMiddleware, this.deactiveChatRoom);
        // @ts-ignore
        this.router.get(`${this.path}/chats/active-room`, authMiddleware, this.getActiveChatRoomOfUser);
        // @ts-ignore
        this.router.get(`${this.path}/chats/inactive-room`, authMiddleware, this.getInActiveChatRoomOfUser);
    }

    private getAllChatRoomOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const user = request.user;

        try {
            // @ts-ignore
            const result = await chatDAO.getAllChatRoomOfUser(user.id);

            response.status(200).send(JSON.stringify({
                status: true,
                chatRooms: result,
            }, null, '\t'));
    } catch (error) {
            next(error);
        }
    };

    private getActiveChatRoomOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const user = request.user;

        try {
            // @ts-ignore
            const result = await chatDAO.getActiveChatRoomOfUser(user.id);

            response.status(200).send(JSON.stringify({
                status: true,
                chatRooms: result,
            }, null, '\t'));
        } catch (error) {
            next(error);
        }
    };


    private getInActiveChatRoomOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const user = request.user;

        try {
            // @ts-ignore
            const result = await chatDAO.getInActiveChatRoomOfUser(user.id);

            response.status(200).send(JSON.stringify({
                status: true,
                chatRooms: result,
            }, null, '\t'));
        } catch (error) {
            next(error);
        }
    };

    private deactiveChatRoom = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const roomId = request.params.roomId;

        try {
            // @ts-ignore
            const result = await chatDAO.deactivateChatRoom(roomId);

            response.status(200).send(JSON.stringify({
                status: true,
                message: result.message,
            }, null, '\t'));

        } catch (error) {
            next(error);
        }
    }


    private deleteChatRoom = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const roomId = request.params.roomId;

        try {
            // @ts-ignore
            const result = await chatDAO.deleteChatRoom(roomId);

            response.status(200).send(JSON.stringify({
                status: true,
                message: result.message,
            }, null, '\t'));

        } catch (error) {
            next(error);
        }
    }

}

export default Chat;