import {NextFunction, Response} from 'express';
import RequestWithUser from "../interfaces/requestUser.interface";
import HttpException from "../exception/HttpException";

const authPhotographerMiddleware = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    const user = request.user;

    if (user.role == "photographer") {
        next();
    } else {
        next(new HttpException(401, "You are not photographer to set location"));
    }

};

export default authPhotographerMiddleware;