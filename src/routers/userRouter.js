import express from "express";
import {
    getEdit, postEdit, see, logout, startGithubLogin, finishGithubLogin, startKakaoLogin,
    finishKakaoLogin, getChangePassword, postChangePassword
} from "../controllers/userController";
import {
    protectedMiddleware, pubilcOnlyMiddleware
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectedMiddleware, logout);
userRouter.route("/edit").all(protectedMiddleware).get(getEdit).post(postEdit);
userRouter.route("/change-password").all(protectedMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", pubilcOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", pubilcOnlyMiddleware, finishGithubLogin);
userRouter.get("/kakao/start", pubilcOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", pubilcOnlyMiddleware, finishKakaoLogin);
userRouter.get(":id", see);

export default userRouter;