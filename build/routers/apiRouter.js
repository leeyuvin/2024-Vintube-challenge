"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _videoController = require("../controllers/videoController");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//프론트엔드와 백엔드가 소통하는 방식

var apiRouter = _express["default"].Router();
apiRouter.post("/videos/:id([0-9a-f]{24})/view", _videoController.registerView);
var _default = exports["default"] = apiRouter;