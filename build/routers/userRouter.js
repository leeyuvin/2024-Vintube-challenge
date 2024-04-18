"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _userController = require("../controllers/userController");
var _middlewares = require("../middlewares");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var userRouter = _express["default"].Router();
userRouter.get("/logout", _middlewares.protectedMiddleware, _userController.logout);
userRouter.route("/edit").all(_middlewares.protectedMiddleware).get(_userController.getEdit).post(_userController.postEdit);
userRouter.route("/change-password").all(_middlewares.protectedMiddleware).get(_userController.getChangePassword).post(_userController.postChangePassword);
userRouter.get("/github/start", _middlewares.pubilcOnlyMiddleware, _userController.startGithubLogin);
userRouter.get("/github/finish", _middlewares.pubilcOnlyMiddleware, _userController.finishGithubLogin);
userRouter.get("/kakao/start", _middlewares.pubilcOnlyMiddleware, _userController.startKakaoLogin);
userRouter.get("/kakao/finish", _middlewares.pubilcOnlyMiddleware, _userController.finishKakaoLogin);
userRouter.get(":id", _userController.see);
var _default = exports["default"] = userRouter;